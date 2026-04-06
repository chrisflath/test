import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  trainingPositions,
  type TrainingPosition,
  type TrainingQuestion,
  type Difficulty,
} from '../data/trainingPositions';
import { useAchievementStore } from './achievementStore';

interface TrainingSession {
  /** Positions in the current session */
  positions: TrainingPosition[];
  /** Current position index */
  currentIndex: number;
  /** Current question index within the position */
  currentQuestionIndex: number;
  /** Score in this session */
  score: number;
  /** Max possible score */
  maxScore: number;
  /** Whether the current question has been answered */
  answered: boolean;
  /** Whether the current answer was correct */
  correct: boolean;
  /** Whether hint has been shown */
  hintUsed: boolean;
  /** Session complete */
  finished: boolean;
  /** Selected squares (for square-selection questions) */
  selectedSquares: string[];
}

interface TrainingState {
  session: TrainingSession | null;
  /** Historical best scores per difficulty */
  bestScores: Record<Difficulty, number>;
  /** Total questions answered correctly */
  totalCorrect: number;
  /** Total questions attempted */
  totalAttempted: number;

  // Actions
  startSession: (difficulty: Difficulty, count?: number) => void;
  submitAnswer: (answer: unknown) => void;
  useHint: () => void;
  nextQuestion: () => void;
  toggleSquare: (square: string) => void;
  endSession: () => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set, get) => ({
      session: null,
      bestScores: { beginner: 0, intermediate: 0, advanced: 0 },
      totalCorrect: 0,
      totalAttempted: 0,

      startSession: (difficulty: Difficulty, count: number = 5) => {
        // Pick positions of this difficulty, shuffle, take `count`
        const available = trainingPositions.filter(
          (p) => p.difficulty === difficulty
        );
        const selected = shuffleArray(available).slice(0, count);

        // Calculate max score
        let maxScore = 0;
        for (const pos of selected) {
          for (const q of pos.questions) {
            maxScore += q.points;
          }
        }

        set({
          session: {
            positions: selected,
            currentIndex: 0,
            currentQuestionIndex: 0,
            score: 0,
            maxScore,
            answered: false,
            correct: false,
            hintUsed: false,
            finished: false,
            selectedSquares: [],
          },
        });
      },

      submitAnswer: (answer: unknown) => {
        const { session } = get();
        if (!session || session.answered || session.finished) return;

        const position = session.positions[session.currentIndex];
        if (!position) return;
        const question = position.questions[session.currentQuestionIndex];
        if (!question) return;

        const isCorrect = checkAnswer(question, answer, session.selectedSquares);
        const pointsEarned = isCorrect
          ? session.hintUsed
            ? Math.floor(question.points / 2)
            : question.points
          : 0;

        set({
          session: {
            ...session,
            answered: true,
            correct: isCorrect,
            score: session.score + pointsEarned,
          },
          totalAttempted: get().totalAttempted + 1,
          totalCorrect: get().totalCorrect + (isCorrect ? 1 : 0),
        });

        // Track in achievements
        const achStore = useAchievementStore.getState();
        achStore.incrementStat('trainingQuestionsAttempted');
        if (isCorrect) {
          achStore.incrementStat('trainingQuestionsCorrect');
        }
      },

      useHint: () => {
        const { session } = get();
        if (!session || session.answered) return;
        set({
          session: { ...session, hintUsed: true },
        });
      },

      toggleSquare: (square: string) => {
        const { session } = get();
        if (!session || session.answered) return;

        const selected = session.selectedSquares.includes(square)
          ? session.selectedSquares.filter((s) => s !== square)
          : [...session.selectedSquares, square];

        set({
          session: { ...session, selectedSquares: selected },
        });
      },

      nextQuestion: () => {
        const { session } = get();
        if (!session) return;

        const position = session.positions[session.currentIndex];
        const nextQIdx = session.currentQuestionIndex + 1;

        if (nextQIdx < position.questions.length) {
          // Next question in same position
          set({
            session: {
              ...session,
              currentQuestionIndex: nextQIdx,
              answered: false,
              correct: false,
              hintUsed: false,
              selectedSquares: [],
            },
          });
        } else {
          // Next position
          const nextPosIdx = session.currentIndex + 1;
          if (nextPosIdx < session.positions.length) {
            set({
              session: {
                ...session,
                currentIndex: nextPosIdx,
                currentQuestionIndex: 0,
                answered: false,
                correct: false,
                hintUsed: false,
                selectedSquares: [],
              },
            });
          } else {
            // Session finished!
            const finalScore = session.score;
            const pct = session.maxScore > 0 ? Math.round((finalScore / session.maxScore) * 100) : 0;

            // Update best score
            const difficulty = session.positions[0]?.difficulty || 'beginner';
            const currentBest = get().bestScores[difficulty];

            set({
              session: { ...session, finished: true },
              bestScores: {
                ...get().bestScores,
                [difficulty]: Math.max(currentBest, pct),
              },
            });

            // Track session completion for achievements
            useAchievementStore.getState().incrementStat('trainingSessionsCompleted');
          }
        }
      },

      endSession: () => {
        set({ session: null });
      },
    }),
    {
      name: 'chess-training',
      partialize: (state) => ({
        bestScores: state.bestScores,
        totalCorrect: state.totalCorrect,
        totalAttempted: state.totalAttempted,
      }),
    }
  )
);

// =====================================================
// Answer checking logic
// =====================================================

function checkAnswer(
  question: TrainingQuestion,
  answer: unknown,
  selectedSquares: string[]
): boolean {
  const expected = question.answer;

  switch (expected.type) {
    case 'squares': {
      // Check if selected squares match (with optional partial credit)
      const correct = new Set(expected.squares);
      const selected = new Set(selectedSquares);
      if (expected.partialCredit) {
        // At least half correct, no wrong selections
        let hits = 0;
        for (const s of selected) {
          if (correct.has(s)) hits++;
          else return false; // Wrong square selected
        }
        return hits >= Math.ceil(correct.size / 2);
      }
      // Exact match
      return (
        selected.size === correct.size &&
        [...correct].every((s) => selected.has(s))
      );
    }

    case 'choice':
      return answer === expected.correct;

    case 'side':
      return answer === expected.correct;

    case 'piece_on_square':
      return answer === expected.square || selectedSquares.includes(expected.square);

    case 'target_square':
      return answer === expected.to || selectedSquares.includes(expected.to);

    case 'move':
      if (answer === expected.san) return true;
      return expected.alternatives?.includes(answer as string) ?? false;

    default:
      return false;
  }
}
