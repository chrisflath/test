import { useEngineStore } from '../../stores/engineStore';
import { evalToBarPercent, formatEval } from '../../services/lichessEval';

export function EvalBar() {
  const { result, enabled, loading } = useEngineStore();

  if (!enabled) return null;

  const topLine = result?.lines[0] ?? null;
  const whitePercent = evalToBarPercent(topLine);
  const evalText = topLine ? formatEval(topLine) : '';

  // Color the eval text
  const isWhiteAdvantage = topLine
    ? (topLine.cp !== undefined && topLine.cp > 0) ||
      (topLine.mate !== undefined && topLine.mate > 0)
    : false;

  return (
    <div className="flex flex-col items-center w-8 flex-shrink-0 select-none">
      {/* Eval number at top */}
      <div
        className={`text-xs font-bold tabular-nums mb-1 h-5 flex items-center
          ${loading ? 'animate-pulse text-[var(--color-text-muted)]' : ''}
          ${!loading && isWhiteAdvantage ? 'text-white' : 'text-gray-400'}`}
      >
        {loading ? '...' : evalText}
      </div>

      {/* The bar itself */}
      <div className="w-6 flex-1 min-h-[200px] rounded-sm overflow-hidden relative bg-gray-800 border border-[var(--color-border)]">
        {/* White portion (from top) */}
        <div
          className="absolute top-0 left-0 w-full bg-white transition-all duration-500 ease-out"
          style={{ height: `${whitePercent}%` }}
        />
        {/* Black portion fills the rest */}
      </div>
    </div>
  );
}
