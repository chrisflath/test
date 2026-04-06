import { useGameStore } from '../../stores/gameStore';
import { useAchievementStore } from '../../stores/achievementStore';
import { useI18n } from '../../i18n';
import type { ExplorerData, ExplorerMove } from '../../types/chess';

interface MoveTableProps {
  data: ExplorerData | null;
}

function WinBar({ white, draws, black }: { white: number; draws: number; black: number }) {
  const total = white + draws + black;
  if (total === 0) return null;
  const wPct = (white / total) * 100;
  const dPct = (draws / total) * 100;
  const bPct = (black / total) * 100;

  return (
    <div className="flex h-5 rounded-sm overflow-hidden text-xs font-medium leading-5 min-w-[120px]">
      {wPct > 0 && (
        <div
          className="bg-white text-gray-900 text-center truncate"
          style={{ width: `${wPct}%` }}
        >
          {wPct >= 15 ? `${Math.round(wPct)}%` : ''}
        </div>
      )}
      {dPct > 0 && (
        <div
          className="bg-gray-500 text-white text-center truncate"
          style={{ width: `${dPct}%` }}
        >
          {dPct >= 15 ? `${Math.round(dPct)}%` : ''}
        </div>
      )}
      {bPct > 0 && (
        <div
          className="bg-gray-800 text-white text-center truncate"
          style={{ width: `${bPct}%` }}
        >
          {bPct >= 15 ? `${Math.round(bPct)}%` : ''}
        </div>
      )}
    </div>
  );
}

function MoveRow({ move }: { move: ExplorerMove }) {
  const { makeMove } = useGameStore();
  const total = move.white + move.draws + move.black;

  const handleClick = () => {
    // The explorer gives us UCI, but makeMove needs from/to
    const from = move.uci.slice(0, 2);
    const to = move.uci.slice(2, 4);
    const promotion = move.uci.length > 4 ? move.uci[4] : undefined;
    makeMove(from, to, promotion);
    useAchievementStore.getState().incrementStat('explorerMovesClicked');
  };

  return (
    <tr
      onClick={handleClick}
      className="hover:bg-[var(--color-surface-2)] cursor-pointer transition-colors touch-manipulation"
    >
      <td className="px-3 py-2 font-bold text-lg text-[var(--color-accent)]">
        {move.san}
      </td>
      <td className="px-3 py-2 text-right text-sm text-[var(--color-text-muted)] tabular-nums">
        {total.toLocaleString()}
      </td>
      <td className="px-3 py-2">
        <WinBar white={move.white} draws={move.draws} black={move.black} />
      </td>
      <td className="px-3 py-2 text-right text-sm text-[var(--color-text-muted)] tabular-nums hidden sm:table-cell">
        {move.averageRating || '-'}
      </td>
    </tr>
  );
}

export function MoveTable({ data }: MoveTableProps) {
  const { t } = useI18n();

  if (!data || data.moves.length === 0) {
    return (
      <div className="p-6 text-center text-[var(--color-text-muted)] text-base">
        {t('db.no_games')}
      </div>
    );
  }

  // Total stats
  const totalGames = data.white + data.draws + data.black;

  return (
    <div>
      {/* Summary bar */}
      {totalGames > 0 && (
        <div className="px-3 py-2 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
            <span>{totalGames.toLocaleString()} {t('explorer.games')}</span>
            <WinBar white={data.white} draws={data.draws} black={data.black} />
          </div>
        </div>
      )}

      {/* Moves table */}
      <table className="w-full">
        <thead>
          <tr className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
            <th className="px-3 py-2 text-left">{t('explorer.move')}</th>
            <th className="px-3 py-2 text-right">{t('explorer.games')}</th>
            <th className="px-3 py-2 text-left">
              {t('explorer.white_wins')}/{t('explorer.draws')}/{t('explorer.black_wins')}
            </th>
            <th className="px-3 py-2 text-right hidden sm:table-cell">
              {t('explorer.avg_rating')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {data.moves.map((move) => (
            <MoveRow key={move.san} move={move} />
          ))}
        </tbody>
      </table>

      {/* Top games from Lichess */}
      {data.topGames.length > 0 && (
        <div className="border-t border-[var(--color-border)]">
          <div className="px-3 py-2 text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
            {t('explorer.recent_games')}
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {data.topGames.slice(0, 4).map((game) => (
              <div
                key={game.id}
                className="px-3 py-2 text-sm flex items-center justify-between gap-2
                          hover:bg-[var(--color-surface-2)] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="truncate">
                    {game.white.name}
                    <span className="text-[var(--color-text-muted)]"> ({game.white.rating})</span>
                  </span>
                  <span className="text-[var(--color-text-muted)]">vs</span>
                  <span className="truncate">
                    {game.black.name}
                    <span className="text-[var(--color-text-muted)]"> ({game.black.rating})</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[var(--color-text-muted)] text-xs">{game.year}</span>
                  <span
                    className={`text-xs font-bold ${
                      game.winner === 'white'
                        ? 'text-white'
                        : game.winner === 'black'
                          ? 'text-gray-400'
                          : 'text-gray-500'
                    }`}
                  >
                    {game.winner === 'white' ? '1-0' : game.winner === 'black' ? '0-1' : '½-½'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
