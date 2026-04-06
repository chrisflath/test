/**
 * Achievement system for chess study gamification.
 *
 * Design principles:
 * - Every achievement teaches something or rewards good study habits
 * - Badges are chess-themed with fun German/English names
 * - Three tiers: Bronze, Silver, Gold
 * - XP earned per achievement feeds into a level system
 * - Daily streaks reward consistency
 */

export type AchievementTier = 'bronze' | 'silver' | 'gold';
export type AchievementCategory =
  | 'study'      // Studying games
  | 'explorer'   // Using the opening explorer
  | 'opening'    // Opening knowledge
  | 'famous'     // Famous games
  | 'streak'     // Daily consistency
  | 'collection' // Building a game collection
  | 'mastery';   // Deep knowledge

export interface AchievementDef {
  id: string;
  icon: string;
  tier: AchievementTier;
  category: AchievementCategory;
  name_de: string;
  name_en: string;
  description_de: string;
  description_en: string;
  /** How to unlock — checked against player stats */
  requirement: (stats: PlayerStats) => boolean;
  /** XP awarded */
  xp: number;
  /** Optional: secret achievement not shown until unlocked */
  secret?: boolean;
}

export interface PlayerStats {
  gamesStudied: number;
  movesPlayed: number;
  openingsExplored: Set<string>;  // ECO codes seen
  famousGamesLoaded: Set<string>; // Famous game IDs loaded
  plansViewed: number;
  daysActive: number;
  currentStreak: number;
  longestStreak: number;
  gamesImported: number;
  totalStudyMinutes: number;
  explorerMovesClicked: number;
  differentOpeningsPlayed: number;
  pgnsLoaded: number;
  boardFlips: number;
}

export const defaultStats: PlayerStats = {
  gamesStudied: 0,
  movesPlayed: 0,
  openingsExplored: new Set(),
  famousGamesLoaded: new Set(),
  plansViewed: 0,
  daysActive: 0,
  currentStreak: 0,
  longestStreak: 0,
  gamesImported: 0,
  totalStudyMinutes: 0,
  explorerMovesClicked: 0,
  differentOpeningsPlayed: 0,
  pgnsLoaded: 0,
  boardFlips: 0,
};

// =====================================================
// ACHIEVEMENT DEFINITIONS
// =====================================================

export const achievements: AchievementDef[] = [
  // ===== STUDY ACHIEVEMENTS =====
  {
    id: 'first_game',
    icon: '♟',
    tier: 'bronze',
    category: 'study',
    name_de: 'Erste Schritte',
    name_en: 'First Steps',
    description_de: 'Lade deine erste Partie und spiele sie durch',
    description_en: 'Load your first game and play through it',
    requirement: (s) => s.gamesStudied >= 1,
    xp: 10,
  },
  {
    id: 'student',
    icon: '📚',
    tier: 'bronze',
    category: 'study',
    name_de: 'Fleissiger Schueler',
    name_en: 'Diligent Student',
    description_de: 'Studiere 5 verschiedene Partien',
    description_en: 'Study 5 different games',
    requirement: (s) => s.gamesStudied >= 5,
    xp: 25,
  },
  {
    id: 'scholar',
    icon: '🎓',
    tier: 'silver',
    category: 'study',
    name_de: 'Gelehrter',
    name_en: 'Scholar',
    description_de: 'Studiere 25 Partien',
    description_en: 'Study 25 games',
    requirement: (s) => s.gamesStudied >= 25,
    xp: 100,
  },
  {
    id: 'grandmaster_student',
    icon: '🏆',
    tier: 'gold',
    category: 'study',
    name_de: 'Grossmeister-Schueler',
    name_en: 'Grandmaster Student',
    description_de: 'Studiere 100 Partien - du lernst wie ein Profi!',
    description_en: 'Study 100 games - you learn like a pro!',
    requirement: (s) => s.gamesStudied >= 100,
    xp: 500,
  },

  // ===== MOVE ACHIEVEMENTS =====
  {
    id: 'first_moves',
    icon: '👣',
    tier: 'bronze',
    category: 'study',
    name_de: 'Die ersten 100 Zuege',
    name_en: 'First 100 Moves',
    description_de: 'Spiele 100 Zuege auf dem Brett',
    description_en: 'Play 100 moves on the board',
    requirement: (s) => s.movesPlayed >= 100,
    xp: 15,
  },
  {
    id: 'thousand_moves',
    icon: '🏃',
    tier: 'silver',
    category: 'study',
    name_de: 'Marathonlaeufer',
    name_en: 'Marathon Runner',
    description_de: 'Spiele 1.000 Zuege',
    description_en: 'Play 1,000 moves',
    requirement: (s) => s.movesPlayed >= 1000,
    xp: 75,
  },
  {
    id: 'ten_thousand_moves',
    icon: '⚡',
    tier: 'gold',
    category: 'study',
    name_de: 'Blitzschnell',
    name_en: 'Lightning Fast',
    description_de: 'Spiele 10.000 Zuege - deine Finger fliegen!',
    description_en: 'Play 10,000 moves - your fingers are flying!',
    requirement: (s) => s.movesPlayed >= 10000,
    xp: 300,
  },

  // ===== OPENING EXPLORER ACHIEVEMENTS =====
  {
    id: 'explorer_curious',
    icon: '🔍',
    tier: 'bronze',
    category: 'explorer',
    name_de: 'Neugierig',
    name_en: 'Curious',
    description_de: 'Klicke zum ersten Mal einen Zug im Explorer an',
    description_en: 'Click a move in the explorer for the first time',
    requirement: (s) => s.explorerMovesClicked >= 1,
    xp: 10,
  },
  {
    id: 'explorer_adventurer',
    icon: '🧭',
    tier: 'silver',
    category: 'explorer',
    name_de: 'Entdecker',
    name_en: 'Adventurer',
    description_de: 'Erkunde 20 verschiedene Zuege im Explorer',
    description_en: 'Explore 20 different moves in the explorer',
    requirement: (s) => s.explorerMovesClicked >= 20,
    xp: 50,
  },

  // ===== OPENING KNOWLEDGE ACHIEVEMENTS =====
  {
    id: 'opening_dabbler',
    icon: '🗝',
    tier: 'bronze',
    category: 'opening',
    name_de: 'Eroeffnungs-Anfaenger',
    name_en: 'Opening Dabbler',
    description_de: 'Erkunde 3 verschiedene Eroeffnungen',
    description_en: 'Explore 3 different openings',
    requirement: (s) => s.openingsExplored.size >= 3,
    xp: 20,
  },
  {
    id: 'opening_connoisseur',
    icon: '📖',
    tier: 'silver',
    category: 'opening',
    name_de: 'Eroeffnungs-Kenner',
    name_en: 'Opening Connoisseur',
    description_de: 'Erkunde 7 verschiedene Eroeffnungen',
    description_en: 'Explore 7 different openings',
    requirement: (s) => s.openingsExplored.size >= 7,
    xp: 75,
  },
  {
    id: 'opening_encyclopedia',
    icon: '📚',
    tier: 'gold',
    category: 'opening',
    name_de: 'Wandelnde Enzyklopaedie',
    name_en: 'Walking Encyclopedia',
    description_de: 'Erkunde 15 verschiedene Eroeffnungen - du kennst sie alle!',
    description_en: 'Explore 15 different openings - you know them all!',
    requirement: (s) => s.openingsExplored.size >= 15,
    xp: 200,
  },

  // ===== FAMOUS GAMES ACHIEVEMENTS =====
  {
    id: 'famous_first',
    icon: '⭐',
    tier: 'bronze',
    category: 'famous',
    name_de: 'Starstunde',
    name_en: 'Star Moment',
    description_de: 'Lade deine erste beruehmte Partie',
    description_en: 'Load your first famous game',
    requirement: (s) => s.famousGamesLoaded.size >= 1,
    xp: 15,
  },
  {
    id: 'famous_collector',
    icon: '🌟',
    tier: 'silver',
    category: 'famous',
    name_de: 'Partiensammler',
    name_en: 'Game Collector',
    description_de: 'Studiere 3 beruehmte Partien',
    description_en: 'Study 3 famous games',
    requirement: (s) => s.famousGamesLoaded.size >= 3,
    xp: 50,
  },
  {
    id: 'famous_historian',
    icon: '👑',
    tier: 'gold',
    category: 'famous',
    name_de: 'Schachhistoriker',
    name_en: 'Chess Historian',
    description_de: 'Studiere alle 6 beruehmten Partien - du kennst die Klassiker!',
    description_en: 'Study all 6 famous games - you know the classics!',
    requirement: (s) => s.famousGamesLoaded.size >= 6,
    xp: 150,
  },

  // ===== PLANS ACHIEVEMENTS =====
  {
    id: 'plans_first',
    icon: '🎯',
    tier: 'bronze',
    category: 'opening',
    name_de: 'Stratege',
    name_en: 'Strategist',
    description_de: 'Schau dir zum ersten Mal die Plaene einer Eroeffnung an',
    description_en: 'View the plans of an opening for the first time',
    requirement: (s) => s.plansViewed >= 1,
    xp: 10,
  },
  {
    id: 'plans_expert',
    icon: '🧠',
    tier: 'silver',
    category: 'opening',
    name_de: 'Planschmied',
    name_en: 'Master Planner',
    description_de: 'Studiere die Plaene von 5 verschiedenen Eroeffnungen',
    description_en: 'Study the plans of 5 different openings',
    requirement: (s) => s.plansViewed >= 5,
    xp: 75,
  },

  // ===== STREAK ACHIEVEMENTS =====
  {
    id: 'streak_3',
    icon: '🔥',
    tier: 'bronze',
    category: 'streak',
    name_de: '3-Tage-Serie',
    name_en: '3-Day Streak',
    description_de: '3 Tage hintereinander Schach studiert!',
    description_en: '3 days in a row studying chess!',
    requirement: (s) => s.currentStreak >= 3 || s.longestStreak >= 3,
    xp: 30,
  },
  {
    id: 'streak_7',
    icon: '🔥🔥',
    tier: 'silver',
    category: 'streak',
    name_de: 'Wochen-Krieger',
    name_en: 'Week Warrior',
    description_de: '7 Tage hintereinander - eine ganze Woche!',
    description_en: '7 days in a row - a whole week!',
    requirement: (s) => s.currentStreak >= 7 || s.longestStreak >= 7,
    xp: 100,
  },
  {
    id: 'streak_30',
    icon: '🔥🔥🔥',
    tier: 'gold',
    category: 'streak',
    name_de: 'Monats-Meister',
    name_en: 'Monthly Master',
    description_de: '30 Tage hintereinander - unglaubliche Disziplin!',
    description_en: '30 days in a row - incredible discipline!',
    requirement: (s) => s.currentStreak >= 30 || s.longestStreak >= 30,
    xp: 500,
  },

  // ===== STUDY TIME ACHIEVEMENTS =====
  {
    id: 'time_hour',
    icon: '⏰',
    tier: 'bronze',
    category: 'study',
    name_de: 'Erste Stunde',
    name_en: 'First Hour',
    description_de: 'Insgesamt 1 Stunde Schach studiert',
    description_en: 'Total 1 hour of chess study',
    requirement: (s) => s.totalStudyMinutes >= 60,
    xp: 25,
  },
  {
    id: 'time_ten_hours',
    icon: '⏱',
    tier: 'silver',
    category: 'study',
    name_de: 'Zehn-Stunden-Held',
    name_en: 'Ten Hour Hero',
    description_de: '10 Stunden Studium - echte Hingabe!',
    description_en: '10 hours of study - real dedication!',
    requirement: (s) => s.totalStudyMinutes >= 600,
    xp: 150,
  },

  // ===== SECRET ACHIEVEMENTS =====
  {
    id: 'board_spinner',
    icon: '🌀',
    tier: 'bronze',
    category: 'study',
    name_de: 'Karussell',
    name_en: 'Carousel',
    description_de: 'Drehe das Brett 10 Mal - Schwindel!',
    description_en: 'Flip the board 10 times - dizzy!',
    requirement: (s) => s.boardFlips >= 10,
    xp: 5,
    secret: true,
  },
  {
    id: 'pgn_loader',
    icon: '📋',
    tier: 'bronze',
    category: 'collection',
    name_de: 'PGN-Meister',
    name_en: 'PGN Master',
    description_de: 'Lade 10 verschiedene PGN-Partien',
    description_en: 'Load 10 different PGN games',
    requirement: (s) => s.pgnsLoaded >= 10,
    xp: 30,
  },
];

// =====================================================
// XP & LEVEL SYSTEM
// =====================================================

export interface LevelInfo {
  level: number;
  title_de: string;
  title_en: string;
  minXp: number;
  icon: string;
}

export const levels: LevelInfo[] = [
  { level: 1, title_de: 'Anfaenger', title_en: 'Beginner', minXp: 0, icon: '🔰' },
  { level: 2, title_de: 'Lehrling', title_en: 'Apprentice', minXp: 50, icon: '♟' },
  { level: 3, title_de: 'Geselle', title_en: 'Journeyman', minXp: 150, icon: '♞' },
  { level: 4, title_de: 'Fortgeschritten', title_en: 'Advanced', minXp: 300, icon: '♝' },
  { level: 5, title_de: 'Experte', title_en: 'Expert', minXp: 500, icon: '♜' },
  { level: 6, title_de: 'Meister', title_en: 'Master', minXp: 800, icon: '♛' },
  { level: 7, title_de: 'Grossmeister', title_en: 'Grandmaster', minXp: 1200, icon: '♚' },
  { level: 8, title_de: 'Legende', title_en: 'Legend', minXp: 2000, icon: '👑' },
];

export function getLevelForXp(xp: number): LevelInfo {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].minXp) return levels[i];
  }
  return levels[0];
}

export function getNextLevel(xp: number): LevelInfo | null {
  const current = getLevelForXp(xp);
  const idx = levels.indexOf(current);
  return idx < levels.length - 1 ? levels[idx + 1] : null;
}

export function getXpProgress(xp: number): { current: number; needed: number; percent: number } {
  const currentLevel = getLevelForXp(xp);
  const nextLevel = getNextLevel(xp);
  if (!nextLevel) return { current: xp, needed: xp, percent: 100 };
  const current = xp - currentLevel.minXp;
  const needed = nextLevel.minXp - currentLevel.minXp;
  return { current, needed, percent: Math.round((current / needed) * 100) };
}
