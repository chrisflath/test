import { useEffect, useMemo, useRef } from 'react';
import { Chessground } from 'chessground';
import type { Api } from 'chessground/api';
import type { Key } from 'chessground/types';
import { useTrainingStore } from '../stores/trainingStore';
import { useI18n } from '../i18n';
import { questionTypeInfo, type Difficulty } from '../data/trainingPositions';
import type { TrainingAnswer } from '../data/trainingPositions';

// =====================================================
// Session selector
// =====================================================

function SessionSelector() {
  const { startSession, bestScores, totalCorrect, totalAttempted } = useTrainingStore();
  const { locale } = useI18n();

  const levels: { key: Difficulty; icon: string; de: string; en: string; desc_de: string; desc_en: string }[] = [
    {
      key: 'beginner',
      icon: '🌱',
      de: 'Anfaenger',
      en: 'Beginner',
      desc_de: 'Grundlagen: Schwache Felder, einfache Plaene, Figurenentwicklung',
      desc_en: 'Basics: Weak squares, simple plans, piece development',
    },
    {
      key: 'intermediate',
      icon: '⚔',
      de: 'Fortgeschritten',
      en: 'Intermediate',
      desc_de: 'Positionsspiel: Bauernstrukturen, Figurenaktivitaet, Tauschentscheidungen',
      desc_en: 'Positional play: Pawn structures, piece activity, exchange decisions',
    },
    {
      key: 'advanced',
      icon: '👑',
      de: 'Experte',
      en: 'Advanced',
      desc_de: 'Meisterspiel: Komplexe Plaene, dynamische Stellungen, tiefe Strategie',
      desc_en: 'Master play: Complex plans, dynamic positions, deep strategy',
    },
  ];

  const accuracy = totalAttempted > 0
    ? Math.round((totalCorrect / totalAttempted) * 100)
    : 0;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">
          🧠 {locale === 'de' ? 'Strategisches Training' : 'Strategic Training'}
        </h2>
        <p className="text-[var(--color-text-muted)]">
          {locale === 'de'
            ? 'Trainiere wie ein Schachtrainer fragt: Schwache Felder, Plaene, Stellungsbewertung'
            : 'Train like a chess coach asks: Weak squares, plans, position evaluation'}
        </p>
      </div>

      {/* Stats */}
      {totalAttempted > 0 && (
        <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)]">
          <div className="flex justify-around text-center">
            <div>
              <div className="text-2xl font-bold text-[var(--color-text)]">{totalCorrect}</div>
              <div className="text-xs text-[var(--color-text-muted)]">
                {locale === 'de' ? 'Richtig' : 'Correct'}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--color-text)]">{totalAttempted}</div>
              <div className="text-xs text-[var(--color-text-muted)]">
                {locale === 'de' ? 'Versuche' : 'Attempted'}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--color-accent)]">{accuracy}%</div>
              <div className="text-xs text-[var(--color-text-muted)]">
                {locale === 'de' ? 'Genauigkeit' : 'Accuracy'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Difficulty selection */}
      <div className="space-y-3">
        {levels.map((level) => (
          <button
            key={level.key}
            onClick={() => startSession(level.key)}
            className="w-full text-left p-4 rounded-xl bg-[var(--color-surface)]
                       border border-[var(--color-border)] hover:border-[var(--color-accent)]
                       transition-colors cursor-pointer touch-manipulation"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{level.icon}</span>
                <div>
                  <div className="text-lg font-bold text-[var(--color-text)]">
                    {locale === 'de' ? level.de : level.en}
                  </div>
                  <div className="text-sm text-[var(--color-text-muted)]">
                    {locale === 'de' ? level.desc_de : level.desc_en}
                  </div>
                </div>
              </div>
              {bestScores[level.key] > 0 && (
                <div className="text-right flex-shrink-0">
                  <div className="text-sm text-yellow-400 font-bold">
                    {locale === 'de' ? 'Bestleistung' : 'Best'}
                  </div>
                  <div className="text-xl font-bold text-[var(--color-text)]">
                    {bestScores[level.key]}%
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// =====================================================
// Training board (non-interactive, just display)
// =====================================================

function TrainingBoard({
  fen,
  highlightSquares,
  onSquareClick,
  interactive,
}: {
  fen: string;
  highlightSquares?: string[];
  onSquareClick?: (square: string) => void;
  interactive?: boolean;
}) {
  const boardRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<Api | null>(null);

  useEffect(() => {
    if (!boardRef.current) return;

    apiRef.current = Chessground(boardRef.current, {
      fen,
      viewOnly: true,
      coordinates: true,
      highlight: { lastMove: false, check: false },
      animation: { enabled: false },
    });

    return () => {
      apiRef.current?.destroy();
      apiRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update FEN
  useEffect(() => {
    apiRef.current?.set({ fen });
  }, [fen]);

  // Draw highlights for selected squares
  useEffect(() => {
    if (!apiRef.current) return;
    const shapes = (highlightSquares || []).map((sq) => ({
      orig: sq as Key,
      brush: 'green',
    }));
    apiRef.current.setAutoShapes(shapes);
  }, [highlightSquares]);

  // Handle clicks for square selection mode
  useEffect(() => {
    if (!boardRef.current || !interactive || !onSquareClick) return;

    const handler = (e: MouseEvent | TouchEvent) => {
      const rect = boardRef.current!.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const fileIdx = Math.floor((x / rect.width) * 8);
      const rankIdx = Math.floor((y / rect.height) * 8);

      if (fileIdx < 0 || fileIdx > 7 || rankIdx < 0 || rankIdx > 7) return;

      const file = String.fromCharCode(97 + fileIdx); // a-h
      const rank = String(8 - rankIdx); // 8-1
      onSquareClick(`${file}${rank}`);
    };

    boardRef.current.addEventListener('click', handler);
    return () => boardRef.current?.removeEventListener('click', handler);
  }, [interactive, onSquareClick]);

  return (
    <div className="w-full max-w-[min(60vh,500px)]" style={{ minWidth: '280px' }}>
      <div ref={boardRef} className="board-container" />
    </div>
  );
}

// =====================================================
// Answer components
// =====================================================

function MultipleChoiceAnswer({
  answer,
  onSubmit,
  answered,
}: {
  answer: Extract<TrainingAnswer, { type: 'choice' }>;
  onSubmit: (idx: number) => void;
  answered: boolean;
}) {
  const { locale } = useI18n();
  const options = locale === 'de' ? answer.options_de : answer.options_en;

  return (
    <div className="space-y-2">
      {options.map((option, idx) => {
        const isCorrectOption = idx === answer.correct;
        let bgClass = 'bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)]';
        if (answered) {
          if (isCorrectOption) {
            bgClass = 'bg-green-900/50 border-green-500';
          } else {
            bgClass = 'bg-[var(--color-surface)] opacity-50';
          }
        }

        return (
          <button
            key={idx}
            onClick={() => !answered && onSubmit(idx)}
            disabled={answered}
            className={`w-full text-left p-3 rounded-lg border border-[var(--color-border)]
                       transition-colors touch-manipulation text-base leading-snug
                       ${answered ? 'cursor-default' : 'cursor-pointer'}
                       ${bgClass}`}
          >
            <span className="font-bold mr-2 text-[var(--color-accent)]">
              {String.fromCharCode(65 + idx)}.
            </span>
            {option}
          </button>
        );
      })}
    </div>
  );
}

function SideAnswer({
  onSubmit,
  answered,
  correctSide,
}: {
  onSubmit: (side: 'white' | 'black' | 'equal') => void;
  answered: boolean;
  correctSide: string;
}) {
  const { locale } = useI18n();

  const sides = [
    { key: 'white' as const, icon: '⬜', de: 'Weiss', en: 'White' },
    { key: 'equal' as const, icon: '⚖', de: 'Gleich', en: 'Equal' },
    { key: 'black' as const, icon: '⬛', de: 'Schwarz', en: 'Black' },
  ];

  return (
    <div className="flex gap-3 justify-center">
      {sides.map((side) => {
        const isCorrect = side.key === correctSide;
        let bgClass = 'bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)]';
        if (answered) {
          if (isCorrect) bgClass = 'bg-green-900/50 border-green-500';
          else bgClass = 'bg-[var(--color-surface)] opacity-50';
        }

        return (
          <button
            key={side.key}
            onClick={() => !answered && onSubmit(side.key)}
            disabled={answered}
            className={`flex-1 p-4 rounded-lg border border-[var(--color-border)]
                       text-center transition-colors touch-manipulation
                       ${answered ? 'cursor-default' : 'cursor-pointer'}
                       ${bgClass}`}
          >
            <div className="text-3xl mb-1">{side.icon}</div>
            <div className="text-base font-bold">
              {locale === 'de' ? side.de : side.en}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function SquareSelectionControls({ onSubmit }: { onSubmit: () => void }) {
  const { locale } = useI18n();
  const { session } = useTrainingStore();
  const count = session?.selectedSquares.length ?? 0;

  return (
    <div className="flex items-center justify-between">
      <span className="text-[var(--color-text-muted)] text-sm">
        {count} {locale === 'de' ? 'Felder ausgewaehlt' : 'squares selected'}
      </span>
      <button
        onClick={onSubmit}
        disabled={count === 0}
        className={`px-6 py-2 rounded-lg font-bold text-base touch-manipulation
          ${count > 0
            ? 'bg-[var(--color-accent)] text-white cursor-pointer hover:opacity-90'
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
      >
        {locale === 'de' ? 'Pruefen' : 'Check'}
      </button>
    </div>
  );
}

// =====================================================
// Active Quiz
// =====================================================

function ActiveQuiz() {
  const {
    session,
    submitAnswer,
    useHint,
    nextQuestion,
    toggleSquare,
    endSession,
  } = useTrainingStore();
  const { locale } = useI18n();

  if (!session) return null;

  // Session finished
  if (session.finished) {
    const pct = session.maxScore > 0
      ? Math.round((session.score / session.maxScore) * 100)
      : 0;
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : pct >= 30 ? 1 : 0;

    return (
      <div className="max-w-lg mx-auto p-6 text-center space-y-6">
        <div className="text-6xl">
          {pct >= 90 ? '🏆' : pct >= 60 ? '⭐' : pct >= 30 ? '👍' : '💪'}
        </div>
        <h2 className="text-2xl font-bold text-[var(--color-text)]">
          {locale === 'de' ? 'Training abgeschlossen!' : 'Training Complete!'}
        </h2>
        <div className="text-5xl font-bold text-[var(--color-accent)]">{pct}%</div>
        <div className="flex justify-center gap-2 text-3xl">
          {[1, 2, 3].map((s) => (
            <span key={s} className={s <= stars ? '' : 'opacity-20'}>⭐</span>
          ))}
        </div>
        <div className="text-[var(--color-text-muted)]">
          {session.score} / {session.maxScore}{' '}
          {locale === 'de' ? 'Punkte' : 'Points'}
        </div>
        <button
          onClick={endSession}
          className="px-8 py-3 bg-[var(--color-accent)] text-white rounded-lg
                     text-lg font-bold cursor-pointer touch-manipulation hover:opacity-90"
        >
          {locale === 'de' ? 'Zurueck zur Auswahl' : 'Back to Menu'}
        </button>
      </div>
    );
  }

  const position = session.positions[session.currentIndex];
  const question = position.questions[session.currentQuestionIndex];
  const qInfo = questionTypeInfo[question.type];

  const questionText = locale === 'de' ? question.question_de : question.question_en;
  const hintText = locale === 'de' ? question.hint_de : question.hint_en;
  const explanationText = locale === 'de' ? question.explanation_de : question.explanation_en;

  // Progress
  const totalQuestions = session.positions.reduce((acc, p) => acc + p.questions.length, 0);
  let currentQ = 0;
  for (let i = 0; i < session.currentIndex; i++) {
    currentQ += session.positions[i].questions.length;
  }
  currentQ += session.currentQuestionIndex + 1;

  const isSquareQuestion =
    question.answer.type === 'squares' ||
    question.answer.type === 'piece_on_square' ||
    question.answer.type === 'target_square';

  // Highlight correct/incorrect squares after answering
  const displaySquares = useMemo(() => {
    if (!session.answered) return session.selectedSquares;
    if (question.answer.type === 'squares') return question.answer.squares;
    if (question.answer.type === 'piece_on_square') return [question.answer.square];
    if (question.answer.type === 'target_square') return [question.answer.to];
    return session.selectedSquares;
  }, [session.answered, session.selectedSquares, question.answer]);

  return (
    <div className="max-w-4xl mx-auto p-2 md:p-4">
      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={endSession}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]
                     cursor-pointer touch-manipulation text-lg"
        >
          ✕
        </button>
        <div className="flex-1 h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-300"
            style={{ width: `${(currentQ / totalQuestions) * 100}%` }}
          />
        </div>
        <span className="text-sm text-[var(--color-text-muted)] tabular-nums">
          {currentQ}/{totalQuestions}
        </span>
        <span className="text-sm font-bold text-yellow-400 tabular-nums">
          {session.score} {locale === 'de' ? 'Pkt' : 'pts'}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Board */}
        <div className="flex-shrink-0 lg:w-[50%]">
          <TrainingBoard
            fen={position.fen}
            highlightSquares={displaySquares}
            onSquareClick={isSquareQuestion && !session.answered ? toggleSquare : undefined}
            interactive={isSquareQuestion && !session.answered}
          />
          {/* Source info */}
          {position.source && (
            <div className="text-xs text-[var(--color-text-muted)] text-center mt-2">
              {position.source.white} vs {position.source.black} •{' '}
              {position.source.event} {position.source.year}
            </div>
          )}
        </div>

        {/* Question panel */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Question type badge */}
          <div className="flex items-center gap-2">
            <span className="text-xl">{qInfo.icon}</span>
            <span className="text-sm font-medium text-[var(--color-accent)]">
              {locale === 'de' ? qInfo.de : qInfo.en}
            </span>
            <span className="text-xs text-[var(--color-text-muted)] ml-auto">
              {question.points} {locale === 'de' ? 'Punkte' : 'points'}
            </span>
          </div>

          {/* Question */}
          <h3 className="text-lg font-bold text-[var(--color-text)] leading-snug">
            {questionText}
          </h3>

          {/* Hint */}
          {!session.answered && hintText && (
            session.hintUsed ? (
              <div className="p-3 rounded-lg bg-yellow-900/30 border border-yellow-700 text-sm text-yellow-300">
                💡 {hintText}
                <span className="text-xs text-yellow-600 ml-2">
                  ({locale === 'de' ? 'halbe Punkte' : 'half points'})
                </span>
              </div>
            ) : (
              <button
                onClick={useHint}
                className="text-sm text-yellow-400 hover:text-yellow-300 cursor-pointer
                           touch-manipulation underline"
              >
                💡 {locale === 'de' ? 'Hinweis anzeigen (halbe Punkte)' : 'Show hint (half points)'}
              </button>
            )
          )}

          {/* Answer area */}
          {question.answer.type === 'choice' && (
            <MultipleChoiceAnswer
              answer={question.answer}
              onSubmit={(idx) => submitAnswer(idx)}
              answered={session.answered}
            />
          )}

          {question.answer.type === 'side' && (
            <SideAnswer
              onSubmit={(side) => submitAnswer(side)}
              answered={session.answered}
              correctSide={question.answer.correct}
            />
          )}

          {isSquareQuestion && !session.answered && (
            <SquareSelectionControls onSubmit={() => submitAnswer(null)} />
          )}

          {/* Feedback after answering */}
          {session.answered && (
            <div className="space-y-3">
              {/* Correct/Incorrect badge */}
              <div
                className={`p-3 rounded-lg text-base font-bold
                  ${session.correct
                    ? 'bg-green-900/50 text-green-300 border border-green-700'
                    : 'bg-red-900/50 text-red-300 border border-red-700'
                  }`}
              >
                {session.correct
                  ? (locale === 'de' ? '✓ Richtig!' : '✓ Correct!')
                  : (locale === 'de' ? '✗ Nicht ganz...' : '✗ Not quite...')}
                {session.hintUsed && session.correct && (
                  <span className="text-sm ml-2 text-yellow-400">
                    ({locale === 'de' ? 'halbe Punkte' : 'half points'})
                  </span>
                )}
              </div>

              {/* Explanation -- the educational payoff */}
              <div className="p-4 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                <div className="text-xs uppercase tracking-wider text-[var(--color-accent)] font-bold mb-1">
                  {locale === 'de' ? 'Erklaerung' : 'Explanation'}
                </div>
                <p className="text-base text-[var(--color-text)] leading-relaxed">
                  {explanationText}
                </p>
              </div>

              {/* Next button */}
              <button
                onClick={nextQuestion}
                className="w-full py-3 bg-[var(--color-accent)] text-white rounded-lg
                           text-lg font-bold cursor-pointer touch-manipulation hover:opacity-90"
              >
                {locale === 'de' ? 'Weiter' : 'Next'} →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =====================================================
// Main Training Page
// =====================================================

export function TrainingPage() {
  const { session } = useTrainingStore();

  if (session) {
    return <ActiveQuiz />;
  }

  return <SessionSelector />;
}
