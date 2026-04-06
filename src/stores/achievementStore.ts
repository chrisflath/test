import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  achievements,
  defaultStats,
  getLevelForXp,
  type AchievementDef,
  type PlayerStats,
} from '../data/achievements';

interface UnlockedAchievement {
  id: string;
  unlockedAt: number; // timestamp
}

interface AchievementState {
  /** Raw stats (serializable version — Sets stored as arrays) */
  stats: Omit<PlayerStats, 'openingsExplored' | 'famousGamesLoaded'> & {
    openingsExplored: string[];
    famousGamesLoaded: string[];
  };

  /** IDs of unlocked achievements */
  unlocked: UnlockedAchievement[];

  /** Total XP earned */
  xp: number;

  /** Last active date (YYYY-MM-DD) for streak tracking */
  lastActiveDate: string;

  /** Session start time for study minutes */
  sessionStart: number;

  /** Queue of newly unlocked achievements to show as toasts */
  toastQueue: AchievementDef[];

  // Actions
  incrementStat: (key: keyof PlayerStats, amount?: number) => void;
  addOpeningExplored: (eco: string) => void;
  addFamousGameLoaded: (gameId: string) => void;
  recordActivity: () => void;
  updateStudyTime: () => void;
  dismissToast: () => void;
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function toPlayerStats(
  raw: AchievementState['stats']
): PlayerStats {
  return {
    ...raw,
    openingsExplored: new Set(raw.openingsExplored),
    famousGamesLoaded: new Set(raw.famousGamesLoaded),
  };
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, _get) => ({
      stats: {
        ...defaultStats,
        openingsExplored: [],
        famousGamesLoaded: [],
      },
      unlocked: [],
      xp: 0,
      lastActiveDate: '',
      sessionStart: Date.now(),
      toastQueue: [],

      incrementStat: (key, amount = 1) => {
        set((state) => {
          if (key === 'openingsExplored' || key === 'famousGamesLoaded') return state;

          const newStats = {
            ...state.stats,
            [key]: (state.stats[key as keyof typeof state.stats] as number) + amount,
          };

          return checkAndUnlock({ ...state, stats: newStats });
        });
      },

      addOpeningExplored: (eco: string) => {
        set((state) => {
          const openings = new Set(state.stats.openingsExplored);
          if (openings.has(eco)) return state;
          openings.add(eco);

          const newStats = {
            ...state.stats,
            openingsExplored: Array.from(openings),
          };

          return checkAndUnlock({ ...state, stats: newStats });
        });
      },

      addFamousGameLoaded: (gameId: string) => {
        set((state) => {
          const games = new Set(state.stats.famousGamesLoaded);
          if (games.has(gameId)) return state;
          games.add(gameId);

          const newStats = {
            ...state.stats,
            famousGamesLoaded: Array.from(games),
          };

          return checkAndUnlock({ ...state, stats: newStats });
        });
      },

      recordActivity: () => {
        set((state) => {
          const today = getToday();
          if (state.lastActiveDate === today) return state;

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().slice(0, 10);

          const isConsecutive = state.lastActiveDate === yesterdayStr;
          const newStreak = isConsecutive ? state.stats.currentStreak + 1 : 1;
          const newLongest = Math.max(state.stats.longestStreak, newStreak);

          const newStats = {
            ...state.stats,
            daysActive: state.stats.daysActive + 1,
            currentStreak: newStreak,
            longestStreak: newLongest,
          };

          return checkAndUnlock({
            ...state,
            stats: newStats,
            lastActiveDate: today,
          });
        });
      },

      updateStudyTime: () => {
        set((state) => {
          const now = Date.now();
          const elapsed = Math.floor((now - state.sessionStart) / 60000); // minutes
          if (elapsed <= 0) return state;

          const newStats = {
            ...state.stats,
            totalStudyMinutes: state.stats.totalStudyMinutes + elapsed,
          };

          return checkAndUnlock({
            ...state,
            stats: newStats,
            sessionStart: now,
          });
        });
      },

      dismissToast: () => {
        set((state) => ({
          toastQueue: state.toastQueue.slice(1),
        }));
      },
    }),
    {
      name: 'chess-achievements',
      partialize: (state) => ({
        stats: state.stats,
        unlocked: state.unlocked,
        xp: state.xp,
        lastActiveDate: state.lastActiveDate,
      }),
    }
  )
);

/**
 * Check all achievements against current stats and unlock any new ones.
 */
function checkAndUnlock(
  state: Omit<AchievementState, 'incrementStat' | 'addOpeningExplored' | 'addFamousGameLoaded' | 'recordActivity' | 'updateStudyTime' | 'dismissToast'>
): Partial<AchievementState> {
  const unlockedIds = new Set(state.unlocked.map((u) => u.id));
  const playerStats = toPlayerStats(state.stats);
  const newlyUnlocked: AchievementDef[] = [];
  let xpGained = 0;

  for (const achievement of achievements) {
    if (unlockedIds.has(achievement.id)) continue;
    if (achievement.requirement(playerStats)) {
      newlyUnlocked.push(achievement);
      xpGained += achievement.xp;
    }
  }

  if (newlyUnlocked.length === 0) return state;

  const now = Date.now();
  return {
    ...state,
    unlocked: [
      ...state.unlocked,
      ...newlyUnlocked.map((a) => ({ id: a.id, unlockedAt: now })),
    ],
    xp: state.xp + xpGained,
    toastQueue: [...state.toastQueue, ...newlyUnlocked],
  };
}

// =====================================================
// Selectors
// =====================================================

export function useLevel() {
  const xp = useAchievementStore((s) => s.xp);
  return getLevelForXp(xp);
}

export function useStreak() {
  return useAchievementStore((s) => s.stats.currentStreak);
}
