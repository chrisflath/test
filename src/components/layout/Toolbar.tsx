import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useAchievementStore } from '../../stores/achievementStore';
import { useI18n } from '../../i18n';
import { XpBadge } from '../achievements/XpBadge';
import type { Locale } from '../../i18n';

interface ToolbarProps {
  onShowTrophies?: () => void;
}

export function Toolbar({ onShowTrophies }: ToolbarProps) {
  const { loadPgn, reset } = useGameStore();
  const { incrementStat } = useAchievementStore();
  const { t, locale, setLocale } = useI18n();
  const [showPgnInput, setShowPgnInput] = useState(false);
  const [pgnText, setPgnText] = useState('');

  const handleLoadPgn = () => {
    if (pgnText.trim()) {
      loadPgn(pgnText.trim());
      incrementStat('pgnsLoaded');
      incrementStat('gamesStudied');
      setPgnText('');
      setShowPgnInput(false);
    }
  };

  const handleCopyPgn = () => {
    const { chess } = useGameStore.getState();
    const pgn = chess.renderPgn();
    navigator.clipboard.writeText(pgn);
  };

  return (
    <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      <div className="flex items-center justify-between px-4 py-2 flex-wrap gap-2">
        {/* App title + XP badge */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-[var(--color-accent)] tracking-tight">
            ♔ ChessBase Clone
          </h1>
          <XpBadge onClick={onShowTrophies} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowPgnInput(!showPgnInput)}
            className="px-4 py-2 text-base bg-[var(--color-surface-2)] hover:bg-[var(--color-accent)]
                       rounded-lg transition-colors border border-[var(--color-border)]
                       touch-manipulation cursor-pointer"
          >
            {t('action.load_pgn')}
          </button>

          <button
            onClick={handleCopyPgn}
            className="px-4 py-2 text-base bg-[var(--color-surface-2)] hover:bg-[var(--color-accent)]
                       rounded-lg transition-colors border border-[var(--color-border)]
                       touch-manipulation cursor-pointer"
          >
            {t('action.copy_pgn')}
          </button>

          <button
            onClick={reset}
            className="px-4 py-2 text-base bg-[var(--color-surface-2)] hover:bg-[var(--color-accent)]
                       rounded-lg transition-colors border border-[var(--color-border)]
                       touch-manipulation cursor-pointer"
          >
            {t('action.new_game')}
          </button>

          {/* Language toggle */}
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            className="px-3 py-2 text-base bg-[var(--color-surface-2)] text-[var(--color-text)]
                       rounded-lg border border-[var(--color-border)] cursor-pointer"
          >
            <option value="de">DE</option>
            <option value="en">EN</option>
          </select>
        </div>
      </div>

      {/* PGN Input area */}
      {showPgnInput && (
        <div className="px-4 pb-3">
          <textarea
            value={pgnText}
            onChange={(e) => setPgnText(e.target.value)}
            placeholder="PGN hier einfuegen... / Paste PGN here..."
            className="w-full h-40 p-3 text-base font-mono bg-[var(--color-bg)]
                       text-[var(--color-text)] rounded-lg border border-[var(--color-border)]
                       resize-y"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleLoadPgn}
              className="px-6 py-2 text-base bg-[var(--color-accent)] text-white
                         rounded-lg hover:opacity-90 transition-opacity
                         touch-manipulation cursor-pointer font-medium"
            >
              {t('action.load_pgn')}
            </button>
            <button
              onClick={() => setShowPgnInput(false)}
              className="px-6 py-2 text-base bg-[var(--color-surface-2)]
                         rounded-lg hover:opacity-80 transition-opacity
                         touch-manipulation cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
