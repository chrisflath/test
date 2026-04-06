import { useState, useEffect, useRef, useMemo } from 'react';
import { Chessground } from 'chessground';
import type { Api } from 'chessground/api';
import { useI18n } from '../i18n';
import { useAchievementStore } from '../stores/achievementStore';
import {
  evalFactors,
  evalPositions,
  scaleLabels,
  type EvalPosition,
  type EvalFactorId,
  type EvalScore,
} from '../data/evalScale';

// =====================================================
// Static Board
// =====================================================

function StaticBoard({ fen }: { fen: string }) {
  const boardRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<Api | null>(null);

  useEffect(() => {
    if (!boardRef.current) return;
    apiRef.current = Chessground(boardRef.current, {
      fen,
      viewOnly: true,
      coordinates: true,
      animation: { enabled: false },
    });
    return () => { apiRef.current?.destroy(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { apiRef.current?.set({ fen }); }, [fen]);

  return (
    <div ref={boardRef} className="aspect-square w-full max-w-[min(55vh,480px)]" style={{ minWidth: '260px' }} />
  );
}

// =====================================================
// Scale Slider
// =====================================================

function EvalSlider({
  icon,
  name,
  description,
  value,
  onChange,
  correctValue,
  revealed,
}: {
  icon: string;
  name: string;
  description: string;
  value: EvalScore;
  onChange: (v: EvalScore) => void;
  correctValue?: EvalScore;
  revealed: boolean;
}) {
  const { locale } = useI18n();

  const label = scaleLabels[String(value) as unknown as number];
  const labelText = locale === 'de' ? label?.de : label?.en;

  const diff = revealed && correctValue !== undefined
    ? Math.abs(value - correctValue)
    : 0;
  const matchColor = diff === 0 ? 'border-green-500' : diff === 1 ? 'border-yellow-500' : 'border-red-500';

  return (
    <div className={`p-3 rounded-lg bg-[var(--color-surface)] border-2 transition-colors
      ${revealed ? matchColor : 'border-[var(--color-border)]'}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="font-bold text-base text-[var(--color-text)]">{name}</span>
        {revealed && correctValue !== undefined && (
          <span className={`ml-auto text-sm font-bold
            ${diff === 0 ? 'text-green-400' : diff === 1 ? 'text-yellow-400' : 'text-red-400'}`}>
            {diff === 0 ? '✓' : diff === 1 ? '~' : '✗'}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-[var(--color-text-muted)] mb-3 leading-relaxed">{description}</p>

      {/* Scale */}
      <div className="space-y-2">
        {/* Labels: Black ... Equal ... White */}
        <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
          <span>⬛ {locale === 'de' ? 'Schwarz' : 'Black'}</span>
          <span>{locale === 'de' ? 'Gleich' : 'Equal'}</span>
          <span>{locale === 'de' ? 'Weiss' : 'White'} ⬜</span>
        </div>

        {/* Button row: -3 to +3 */}
        <div className="flex gap-1">
          {([-3, -2, -1, 0, 1, 2, 3] as EvalScore[]).map((score) => {
            const isSelected = value === score;
            const isCorrect = revealed && correctValue === score;

            let bg = 'bg-[var(--color-bg)]';
            if (isSelected && !revealed) bg = 'bg-[var(--color-accent)]';
            if (revealed && isCorrect) bg = 'bg-green-600';
            if (revealed && isSelected && !isCorrect) bg = 'bg-red-800';

            // Color gradient from black to white
            const opacity = Math.abs(score) / 3;
            const scoreColor = score > 0
              ? `rgba(255,255,255,${0.1 + opacity * 0.3})`
              : score < 0
                ? `rgba(0,0,0,${0.2 + opacity * 0.4})`
                : 'transparent';

            return (
              <button
                key={score}
                onClick={() => !revealed && onChange(score)}
                disabled={revealed}
                className={`flex-1 py-2.5 rounded text-sm font-bold transition-all
                           touch-manipulation
                  ${revealed ? 'cursor-default' : 'cursor-pointer hover:scale-105'}
                  ${bg}
                  ${isSelected ? 'text-white ring-2 ring-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}`}
                style={!isSelected && !revealed ? { backgroundColor: scoreColor } : undefined}
              >
                {score > 0 ? `+${score}` : score}
              </button>
            );
          })}
        </div>

        {/* Current label */}
        <div className="text-center text-sm text-[var(--color-text)] font-medium">
          {labelText}
        </div>
      </div>
    </div>
  );
}

// =====================================================
// Balance Meter (visual summary)
// =====================================================

function BalanceMeter({
  userTotal,
  correctTotal,
  revealed,
}: {
  userTotal: number;
  correctTotal?: number;
  revealed: boolean;
}) {
  const { locale } = useI18n();

  // Normalize total to -100..+100 range roughly
  const normalize = (v: number) => Math.max(-100, Math.min(100, v * 8));
  const userNorm = normalize(userTotal);
  const correctNorm = correctTotal !== undefined ? normalize(correctTotal) : 0;

  // Convert to percent (0 = full black, 100 = full white, 50 = equal)
  const userPct = 50 + userNorm / 2;
  const correctPct = 50 + correctNorm / 2;

  return (
    <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)]">
      <div className="text-center mb-3">
        <span className="text-2xl">⚖</span>
        <span className="ml-2 font-bold text-[var(--color-text)]">
          {locale === 'de' ? 'Stellungsbewertung' : 'Position Evaluation'}
        </span>
      </div>

      {/* Balance bar */}
      <div className="relative h-10 rounded-lg overflow-hidden bg-gradient-to-r from-gray-900 via-gray-500 to-white border border-[var(--color-border)]">
        {/* User marker */}
        <div
          className="absolute top-0 h-full w-1 bg-[var(--color-accent)] transition-all duration-500 z-10"
          style={{ left: `${userPct}%` }}
        >
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-[var(--color-accent)] whitespace-nowrap">
            {locale === 'de' ? 'Du' : 'You'}
          </div>
        </div>

        {/* Correct marker (shown after reveal) */}
        {revealed && correctTotal !== undefined && (
          <div
            className="absolute top-0 h-full w-1 bg-green-400 transition-all duration-500 z-10"
            style={{ left: `${correctPct}%` }}
          >
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-bold text-green-400 whitespace-nowrap">
              ✓
            </div>
          </div>
        )}

        {/* Center line */}
        <div className="absolute top-0 left-1/2 h-full w-px bg-gray-400 opacity-50" />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-[var(--color-text-muted)] mt-1">
        <span>⬛ {locale === 'de' ? 'Schwarz gewinnt' : 'Black wins'}</span>
        <span>=</span>
        <span>{locale === 'de' ? 'Weiss gewinnt' : 'White wins'} ⬜</span>
      </div>

      {/* Score display */}
      <div className="text-center mt-3">
        <span className="text-2xl font-bold tabular-nums text-[var(--color-text)]">
          {userTotal > 0 ? '+' : ''}{userTotal.toFixed(1)}
        </span>
        {revealed && correctTotal !== undefined && (
          <span className="text-sm text-green-400 ml-3">
            ({locale === 'de' ? 'Richtig' : 'Correct'}: {correctTotal > 0 ? '+' : ''}{correctTotal.toFixed(1)})
          </span>
        )}
      </div>
    </div>
  );
}

// =====================================================
// Comparison feedback
// =====================================================

function ComparisonFeedback({
  position,
  userScores,
}: {
  position: EvalPosition;
  userScores: Record<EvalFactorId, EvalScore>;
}) {
  const { locale } = useI18n();

  let totalDiff = 0;
  for (const factor of position.factors) {
    totalDiff += Math.abs(userScores[factor.factorId] - factor.score);
  }

  const accuracy = Math.max(0, 100 - totalDiff * 5); // rough %
  const emoji = accuracy >= 80 ? '🏆' : accuracy >= 60 ? '⭐' : accuracy >= 40 ? '👍' : '💪';

  return (
    <div className="space-y-4">
      {/* Score */}
      <div className="text-center">
        <span className="text-4xl">{emoji}</span>
        <div className="text-xl font-bold text-[var(--color-text)] mt-1">
          {accuracy}% {locale === 'de' ? 'Genauigkeit' : 'Accuracy'}
        </div>
      </div>

      {/* Factor-by-factor feedback */}
      <div className="space-y-2">
        {position.factors.map((factor) => {
          const userScore = userScores[factor.factorId];
          const diff = Math.abs(userScore - factor.score);
          const fDef = evalFactors.find((f) => f.id === factor.factorId)!;

          if (diff === 0) return null; // Skip correct ones

          return (
            <div key={factor.factorId} className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="flex items-center gap-2 mb-1">
                <span>{fDef.icon}</span>
                <span className="font-bold text-sm text-[var(--color-text)]">
                  {locale === 'de' ? fDef.name_de : fDef.name_en}
                </span>
                <span className="text-xs text-[var(--color-text-muted)] ml-auto">
                  {locale === 'de' ? 'Dein Wert' : 'Your score'}: {userScore > 0 ? '+' : ''}{userScore} →{' '}
                  {locale === 'de' ? 'Richtig' : 'Correct'}: {factor.score > 0 ? '+' : ''}{factor.score}
                </span>
              </div>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                {locale === 'de' ? factor.explanation_de : factor.explanation_en}
              </p>
            </div>
          );
        })}
      </div>

      {/* Overall summary */}
      <div className="p-4 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-accent)]">
        <div className="text-xs uppercase tracking-wider text-[var(--color-accent)] font-bold mb-1">
          {locale === 'de' ? 'Zusammenfassung' : 'Summary'}
        </div>
        <p className="text-base text-[var(--color-text)] leading-relaxed">
          {locale === 'de' ? position.summary_de : position.summary_en}
        </p>
      </div>
    </div>
  );
}

// =====================================================
// Position Selector
// =====================================================

function PositionSelector({ onSelect }: { onSelect: (pos: EvalPosition) => void }) {
  const { locale } = useI18n();

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">
          ⚖ {locale === 'de' ? 'Stellungsbewertung' : 'Position Evaluation'}
        </h2>
        <p className="text-[var(--color-text-muted)]">
          {locale === 'de'
            ? 'Bewerte jeden Faktor einzeln: Material, Entwicklung, Koenigssicherheit, Bauernstruktur, Raum und Figurenaktivitaet'
            : 'Rate each factor individually: Material, Development, King Safety, Pawn Structure, Space, and Piece Activity'}
        </p>
      </div>

      <div className="space-y-3">
        {evalPositions.map((pos) => (
          <button
            key={pos.id}
            onClick={() => onSelect(pos)}
            className="w-full text-left p-4 rounded-xl bg-[var(--color-surface)]
                       border border-[var(--color-border)] hover:border-[var(--color-accent)]
                       transition-colors cursor-pointer touch-manipulation"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {pos.difficulty === 'beginner' ? '🌱' : pos.difficulty === 'intermediate' ? '⚔' : '👑'}
              </span>
              <div>
                {pos.source && (
                  <div className="text-sm font-bold text-[var(--color-text)]">
                    {pos.source.white} vs {pos.source.black}
                  </div>
                )}
                <div className="text-xs text-[var(--color-text-muted)]">
                  {pos.source?.event} {pos.source?.year}
                  {' • '}
                  {pos.difficulty === 'beginner'
                    ? (locale === 'de' ? 'Anfaenger' : 'Beginner')
                    : pos.difficulty === 'intermediate'
                      ? (locale === 'de' ? 'Fortgeschritten' : 'Intermediate')
                      : (locale === 'de' ? 'Experte' : 'Advanced')}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// =====================================================
// Main Eval Trainer
// =====================================================

export function EvalTrainerPage() {
  const { locale } = useI18n();
  const [position, setPosition] = useState<EvalPosition | null>(null);
  const [scores, setScores] = useState<Record<EvalFactorId, EvalScore>>({
    material: 0,
    development: 0,
    king_safety: 0,
    pawn_structure: 0,
    space: 0,
    piece_activity: 0,
  });
  const [revealed, setRevealed] = useState(false);

  const resetScores = () => {
    setScores({
      material: 0, development: 0, king_safety: 0,
      pawn_structure: 0, space: 0, piece_activity: 0,
    });
    setRevealed(false);
  };

  const handleSelect = (pos: EvalPosition) => {
    setPosition(pos);
    resetScores();
  };

  // Calculate weighted totals
  const userTotal = useMemo(() => {
    let total = 0;
    for (const factor of evalFactors) {
      total += scores[factor.id] * factor.weight;
    }
    return total / evalFactors.reduce((sum, f) => sum + f.weight, 0);
  }, [scores]);

  const correctTotal = useMemo(() => {
    if (!position) return 0;
    let total = 0;
    for (const factor of position.factors) {
      const def = evalFactors.find((f) => f.id === factor.factorId)!;
      total += factor.score * def.weight;
    }
    return total / evalFactors.reduce((sum, f) => sum + f.weight, 0);
  }, [position]);

  const handleSubmit = () => {
    setRevealed(true);
    useAchievementStore.getState().incrementStat('trainingQuestionsAttempted');

    // Check if overall assessment was roughly correct
    const userSide = userTotal > 0.5 ? 'white' : userTotal < -0.5 ? 'black' : 'equal';
    if (position && userSide === position.verdict) {
      useAchievementStore.getState().incrementStat('trainingQuestionsCorrect');
    }
  };

  if (!position) {
    return <PositionSelector onSelect={handleSelect} />;
  }

  return (
    <div className="max-w-5xl mx-auto p-2 md:p-4">
      {/* Back button */}
      <button
        onClick={() => setPosition(null)}
        className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]
                   cursor-pointer touch-manipulation text-lg mb-3 flex items-center gap-1"
      >
        ← {locale === 'de' ? 'Zurueck' : 'Back'}
      </button>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: Board + Balance */}
        <div className="flex-shrink-0 lg:w-[45%] space-y-3">
          <StaticBoard fen={position.fen} />
          {position.source && (
            <div className="text-xs text-[var(--color-text-muted)] text-center">
              {position.source.white} vs {position.source.black} •{' '}
              {position.source.event} {position.source.year}
            </div>
          )}
          <BalanceMeter
            userTotal={userTotal}
            correctTotal={revealed ? correctTotal : undefined}
            revealed={revealed}
          />
        </div>

        {/* Right: Factor sliders */}
        <div className="flex-1 min-w-0 space-y-3">
          <h3 className="text-lg font-bold text-[var(--color-text)]">
            {locale === 'de'
              ? 'Bewerte jeden Faktor:'
              : 'Rate each factor:'}
          </h3>

          {evalFactors.map((factor) => {
            const correctFactor = position.factors.find((f) => f.factorId === factor.id);
            return (
              <EvalSlider
                key={factor.id}

                icon={factor.icon}
                name={locale === 'de' ? factor.name_de : factor.name_en}
                description={locale === 'de' ? factor.description_de : factor.description_en}
                value={scores[factor.id]}
                onChange={(v) => setScores((s) => ({ ...s, [factor.id]: v }))}
                correctValue={revealed ? correctFactor?.score : undefined}
                revealed={revealed}
              />
            );
          })}

          {/* Submit / Next */}
          {!revealed ? (
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-[var(--color-accent)] text-white rounded-lg
                         text-lg font-bold cursor-pointer touch-manipulation hover:opacity-90"
            >
              {locale === 'de' ? 'Bewertung abgeben' : 'Submit Evaluation'}
            </button>
          ) : (
            <>
              <ComparisonFeedback position={position} userScores={scores} />
              <button
                onClick={() => setPosition(null)}
                className="w-full py-3 bg-[var(--color-accent)] text-white rounded-lg
                           text-lg font-bold cursor-pointer touch-manipulation hover:opacity-90"
              >
                {locale === 'de' ? 'Naechste Stellung' : 'Next Position'} →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
