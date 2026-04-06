import { useGameStore } from '../../stores/gameStore';
import { useI18n } from '../../i18n';

export function GameHeaders() {
  const { chess } = useGameStore();
  const { t } = useI18n();
  const header = chess.header();

  const white = header.getRawValue('White') || '?';
  const black = header.getRawValue('Black') || '?';
  const whiteElo = header.getRawValue('WhiteElo');
  const blackElo = header.getRawValue('BlackElo');
  const event = header.getRawValue('Event');
  const date = header.getRawValue('Date');
  const result = header.getRawValue('Result');
  const round = header.getRawValue('Round');
  const eco = header.getRawValue('ECO');

  const hasInfo = white !== '?' || event;

  if (!hasInfo) return null;

  return (
    <div className="bg-[var(--color-surface)] rounded-lg p-3 mb-3 border border-[var(--color-border)]">
      {/* Players */}
      <div className="flex items-center justify-between gap-4 text-lg">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-white rounded-sm inline-block flex-shrink-0" />
          <span className="font-semibold">{white}</span>
          {whiteElo && (
            <span className="text-[var(--color-text-muted)] text-base">
              ({whiteElo})
            </span>
          )}
        </div>
        {result && (
          <span className="font-bold text-[var(--color-accent)] text-xl px-3">
            {result}
          </span>
        )}
        <div className="flex items-center gap-2">
          <span className="font-semibold">{black}</span>
          {blackElo && (
            <span className="text-[var(--color-text-muted)] text-base">
              ({blackElo})
            </span>
          )}
          <span className="w-4 h-4 bg-gray-800 rounded-sm inline-block flex-shrink-0 border border-gray-600" />
        </div>
      </div>

      {/* Event info */}
      {(event || date || eco) && (
        <div className="flex items-center gap-3 mt-2 text-sm text-[var(--color-text-muted)] flex-wrap">
          {event && event !== '?' && <span>{event}</span>}
          {round && round !== '?' && (
            <span>{t('game.round')} {round}</span>
          )}
          {date && date !== '????.??.??' && <span>{date}</span>}
          {eco && (
            <span className="bg-[var(--color-surface-2)] px-2 py-0.5 rounded text-xs font-mono">
              {eco}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
