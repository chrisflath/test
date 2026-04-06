import { useMemo } from 'react';
import { useEngineStore } from '../../stores/engineStore';
import { useGameStore } from '../../stores/gameStore';
import { useI18n } from '../../i18n';
import { formatEval } from '../../services/lichessEval';
import { Chess } from '@jackstenglein/chess';

/**
 * Convert a UCI move sequence to SAN notation using a chess instance.
 * e.g. "e2e4 e7e5 g1f3" -> "1. e4 e5 2. Nf3"
 */
function uciLineToSan(fen: string, uciMoves: string, maxMoves: number = 8): string {
  try {
    const chess = new Chess({ fen });
    const ucis = uciMoves.split(' ').slice(0, maxMoves);
    const sans: string[] = [];

    for (const uci of ucis) {
      const from = uci.slice(0, 2);
      const to = uci.slice(2, 4);
      const promotion = uci.length > 4 ? uci[4] : undefined;
      const move = chess.move({ from: from as never, to: to as never, promotion });
      if (!move) break;
      sans.push(move.san);
    }

    // Format with move numbers
    const parts: string[] = [];
    const fenParts = fen.split(' ');
    let moveNum = parseInt(fenParts[5] || '1', 10);
    const isBlackToMove = fenParts[1] === 'b';

    for (let i = 0; i < sans.length; i++) {
      const isBlack = (i === 0 && isBlackToMove) || (i > 0 && (i + (isBlackToMove ? 1 : 0)) % 2 === 1);

      if (i === 0 && isBlackToMove) {
        parts.push(`${moveNum}...${sans[i]}`);
        moveNum++;
      } else if (!isBlack) {
        parts.push(`${moveNum}.${sans[i]}`);
      } else {
        parts.push(sans[i]);
        moveNum++;
      }
    }

    return parts.join(' ');
  } catch {
    // Fallback to UCI if parsing fails
    return uciMoves.split(' ').slice(0, maxMoves).join(' ');
  }
}

function EvalScore({ cp, mate }: { cp?: number; mate?: number }) {
  const isWhiteAdvantage = (cp !== undefined && cp > 0) || (mate !== undefined && mate > 0);
  const text = formatEval({ cp, mate, moves: '', depth: 0 });

  return (
    <span
      className={`inline-flex items-center justify-center min-w-[52px] px-2 py-0.5
                  rounded text-sm font-bold tabular-nums
        ${isWhiteAdvantage
          ? 'bg-white text-gray-900'
          : 'bg-gray-700 text-gray-200'
        }`}
    >
      {text}
    </span>
  );
}

export function EnginePanel() {
  const { result, enabled, loading, cloudHit, multiPv, toggle, setMultiPv } =
    useEngineStore();
  const { fen } = useGameStore();
  const { locale } = useI18n();

  const lines = useMemo(() => {
    if (!result) return [];
    return result.lines.map((line) => ({
      ...line,
      san: uciLineToSan(fen, line.moves),
    }));
  }, [result, fen]);

  return (
    <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] overflow-hidden">
      {/* Header with toggle */}
      <div className="px-3 py-2 flex items-center justify-between border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className={`w-10 h-6 rounded-full transition-colors cursor-pointer touch-manipulation relative
              ${enabled ? 'bg-[var(--color-accent)]' : 'bg-gray-600'}`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform
                ${enabled ? 'translate-x-4.5' : 'translate-x-0.5'}`}
            />
          </button>
          <span className="text-base font-semibold">
            Stockfish
          </span>
          {enabled && result && (
            <span className="text-xs text-[var(--color-text-muted)]">
              {locale === 'de' ? 'Tiefe' : 'Depth'} {result.depth}
            </span>
          )}
        </div>

        {enabled && (
          <div className="flex items-center gap-2">
            {/* Cloud indicator */}
            <span
              className={`text-xs px-2 py-0.5 rounded
                ${cloudHit
                  ? 'bg-green-900/50 text-green-400'
                  : 'bg-yellow-900/50 text-yellow-400'
                }`}
              title={cloudHit
                ? 'Evaluation from Lichess cloud database'
                : 'Position not found in cloud'
              }
            >
              {cloudHit ? '☁ Cloud' : '⚠ N/A'}
            </span>

            {/* Multi-PV selector */}
            <select
              value={multiPv}
              onChange={(e) => setMultiPv(Number(e.target.value))}
              className="text-sm bg-[var(--color-surface-2)] text-[var(--color-text)]
                         rounded border border-[var(--color-border)] px-2 py-1 cursor-pointer"
            >
              <option value={1}>1 {locale === 'de' ? 'Variante' : 'Line'}</option>
              <option value={2}>2 {locale === 'de' ? 'Varianten' : 'Lines'}</option>
              <option value={3}>3 {locale === 'de' ? 'Varianten' : 'Lines'}</option>
              <option value={5}>5 {locale === 'de' ? 'Varianten' : 'Lines'}</option>
            </select>
          </div>
        )}
      </div>

      {/* Engine lines */}
      {enabled && (
        <div className="divide-y divide-[var(--color-border)]">
          {loading && lines.length === 0 && (
            <div className="px-3 py-4 text-center text-[var(--color-text-muted)] text-sm">
              <div className="animate-pulse">
                {locale === 'de' ? 'Bewertung wird geladen...' : 'Loading evaluation...'}
              </div>
            </div>
          )}

          {!loading && !cloudHit && (
            <div className="px-3 py-4 text-center text-sm">
              <div className="text-yellow-400 mb-1">
                {locale === 'de'
                  ? 'Diese Stellung ist nicht in der Cloud-Datenbank'
                  : 'This position is not in the cloud database'}
              </div>
              <div className="text-[var(--color-text-muted)] text-xs">
                {locale === 'de'
                  ? 'Tipp: Bekannte Eroeffnungen und beruehmte Partien haben meistens eine Bewertung!'
                  : 'Tip: Known openings and famous games usually have an evaluation!'}
              </div>
            </div>
          )}

          {lines.map((line, i) => (
            <div
              key={i}
              className="px-3 py-2 flex items-start gap-2 hover:bg-[var(--color-surface-2)] transition-colors"
            >
              {/* Eval score badge */}
              <EvalScore cp={line.cp} mate={line.mate} />

              {/* Move sequence in SAN */}
              <div className="flex-1 text-sm text-[var(--color-text)] font-mono leading-relaxed break-words">
                {line.san}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
