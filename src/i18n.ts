export type Locale = 'en' | 'de';

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Navigation
    'nav.analysis': 'Analysis',
    'nav.database': 'Database',
    'nav.training': 'Training',

    // Board controls
    'board.flip': 'Flip Board',
    'board.start': 'Go to Start',
    'board.back': 'Previous Move',
    'board.forward': 'Next Move',
    'board.end': 'Go to End',

    // Game headers
    'game.white': 'White',
    'game.black': 'Black',
    'game.event': 'Event',
    'game.date': 'Date',
    'game.result': 'Result',
    'game.round': 'Round',

    // Panels
    'panel.explorer': 'Opening Explorer',
    'panel.engine': 'Engine',
    'panel.moves': 'Moves',
    'panel.annotations': 'Annotations',

    // Explorer
    'explorer.move': 'Move',
    'explorer.games': 'Games',
    'explorer.white_wins': 'White',
    'explorer.draws': 'Draws',
    'explorer.black_wins': 'Black',
    'explorer.avg_rating': 'Avg Rating',
    'explorer.masters': 'Masters',
    'explorer.lichess': 'Lichess',
    'explorer.recent_games': 'Recent Games',

    // Engine
    'engine.start': 'Start Analysis',
    'engine.stop': 'Stop Analysis',
    'engine.depth': 'Depth',
    'engine.lines': 'Lines',
    'engine.eval': 'Evaluation',

    // Database
    'db.import': 'Import PGN',
    'db.export': 'Export PGN',
    'db.search': 'Search',
    'db.clear_filters': 'Clear Filters',
    'db.player': 'Player',
    'db.no_games': 'No games found',
    'db.games_count': 'games',
    'db.import_success': 'Games imported successfully',
    'db.importing': 'Importing...',

    // Annotations
    'ann.comment': 'Comment',
    'ann.add_comment': 'Add comment...',

    // Actions
    'action.copy_pgn': 'Copy PGN',
    'action.load_pgn': 'Load PGN',
    'action.new_game': 'New Game',
    'action.settings': 'Settings',

    // Settings
    'settings.language': 'Language',
    'settings.board_theme': 'Board Theme',
    'settings.piece_set': 'Piece Set',
  },
  de: {
    // Navigation
    'nav.analysis': 'Analyse',
    'nav.database': 'Datenbank',
    'nav.training': 'Training',

    // Board controls
    'board.flip': 'Brett drehen',
    'board.start': 'Zum Anfang',
    'board.back': 'Zug zurück',
    'board.forward': 'Nächster Zug',
    'board.end': 'Zum Ende',

    // Game headers
    'game.white': 'Weiß',
    'game.black': 'Schwarz',
    'game.event': 'Turnier',
    'game.date': 'Datum',
    'game.result': 'Ergebnis',
    'game.round': 'Runde',

    // Panels
    'panel.explorer': 'Eröffnungsdatenbank',
    'panel.engine': 'Engine',
    'panel.moves': 'Züge',
    'panel.annotations': 'Kommentare',

    // Explorer
    'explorer.move': 'Zug',
    'explorer.games': 'Partien',
    'explorer.white_wins': 'Weiß',
    'explorer.draws': 'Remis',
    'explorer.black_wins': 'Schwarz',
    'explorer.avg_rating': 'Ø Elo',
    'explorer.masters': 'Meister',
    'explorer.lichess': 'Lichess',
    'explorer.recent_games': 'Neueste Partien',

    // Engine
    'engine.start': 'Analyse starten',
    'engine.stop': 'Analyse stoppen',
    'engine.depth': 'Tiefe',
    'engine.lines': 'Varianten',
    'engine.eval': 'Bewertung',

    // Database
    'db.import': 'PGN importieren',
    'db.export': 'PGN exportieren',
    'db.search': 'Suchen',
    'db.clear_filters': 'Filter löschen',
    'db.player': 'Spieler',
    'db.no_games': 'Keine Partien gefunden',
    'db.games_count': 'Partien',
    'db.import_success': 'Partien erfolgreich importiert',
    'db.importing': 'Importiere...',

    // Annotations
    'ann.comment': 'Kommentar',
    'ann.add_comment': 'Kommentar hinzufügen...',

    // Actions
    'action.copy_pgn': 'PGN kopieren',
    'action.load_pgn': 'PGN laden',
    'action.new_game': 'Neue Partie',
    'action.settings': 'Einstellungen',

    // Settings
    'settings.language': 'Sprache',
    'settings.board_theme': 'Brettfarbe',
    'settings.piece_set': 'Figurenstil',
  },
};

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

export const useI18n = create<I18nState>()(
  persist(
    (set, get) => ({
      locale: 'de', // Default to German as requested
      setLocale: (locale: Locale) => set({ locale }),
      t: (key: string) => {
        const { locale } = get();
        return translations[locale]?.[key] ?? translations.en[key] ?? key;
      },
    }),
    { name: 'chess-i18n' }
  )
);
