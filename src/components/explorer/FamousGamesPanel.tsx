import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useAchievementStore } from '../../stores/achievementStore';
import { useI18n } from '../../i18n';
import { findFamousGamesByEco, findFamousGamesByOpening, famousGames as allFamousGames, type FamousGame } from '../../data/famousGames';

interface FamousGamesPanelProps {
  eco: string;
  openingName: string;
}

function GameCard({ game }: { game: FamousGame }) {
  const { loadPgn } = useGameStore();
  const { locale } = useI18n();
  const [expanded, setExpanded] = useState(false);

  const story = locale === 'de' ? game.story_de : game.story_en;
  const lesson = locale === 'de' ? game.lesson_de : game.lesson_en;
  const keyMoment = locale === 'de' ? game.keyMoment_de : game.keyMoment_en;

  const handleLoad = () => {
    loadPgn(game.pgn);
    // Track for achievements
    const gameId = `${game.white}-${game.black}-${game.year}`;
    useAchievementStore.getState().addFamousGameLoaded(gameId);
    useAchievementStore.getState().incrementStat('gamesStudied');
  };

  const resultColor =
    game.result === '1-0'
      ? 'text-white'
      : game.result === '0-1'
        ? 'text-gray-400'
        : 'text-gray-500';

  return (
    <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
      {/* Card header */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="px-3 py-3 bg-[var(--color-surface-2)] cursor-pointer
                   hover:bg-[var(--color-border)] transition-colors touch-manipulation"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="font-bold text-base text-[var(--color-text)] truncate">
              {game.white} vs {game.black}
            </div>
            <div className="text-sm text-[var(--color-text-muted)] flex items-center gap-2 mt-0.5">
              <span>{game.event}, {game.year}</span>
              <span className={`font-bold ${resultColor}`}>{game.result}</span>
            </div>
          </div>
          <span className="text-2xl flex-shrink-0">
            {expanded ? '▾' : '▸'}
          </span>
        </div>

        {/* Story preview (always visible) */}
        <p className="text-sm text-[var(--color-text-muted)] mt-2 leading-relaxed line-clamp-2">
          {story}
        </p>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-3 py-3 space-y-3">
          {/* Full story */}
          <div className="flex gap-2">
            <span className="text-xl flex-shrink-0">📖</span>
            <p className="text-sm text-[var(--color-text)] leading-relaxed">
              {story}
            </p>
          </div>

          {/* Key moment */}
          <div className="flex gap-2 bg-[var(--color-bg)] rounded-lg p-2">
            <span className="text-xl flex-shrink-0">⚡</span>
            <div>
              <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-0.5">
                {locale === 'de' ? 'Schluesselmoment' : 'Key Moment'}
              </div>
              <p className="text-sm text-[var(--color-accent)] font-medium leading-relaxed">
                {keyMoment}
              </p>
            </div>
          </div>

          {/* Lesson */}
          <div className="flex gap-2">
            <span className="text-xl flex-shrink-0">🎓</span>
            <div>
              <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-0.5">
                {locale === 'de' ? 'Was du lernen kannst' : 'What you can learn'}
              </div>
              <p className="text-sm text-[var(--color-text)] leading-relaxed">
                {lesson}
              </p>
            </div>
          </div>

          {/* Load game button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLoad();
            }}
            className="w-full py-2.5 text-base font-medium bg-[var(--color-accent)] text-white
                       rounded-lg hover:opacity-90 transition-opacity cursor-pointer
                       touch-manipulation flex items-center justify-center gap-2"
          >
            <span className="text-lg">♟</span>
            {locale === 'de' ? 'Partie laden und durchspielen' : 'Load game and play through'}
          </button>
        </div>
      )}
    </div>
  );
}

export function FamousGamesPanel({ eco, openingName }: FamousGamesPanelProps) {
  const { locale } = useI18n();

  // Find matching famous games
  let games: FamousGame[] = findFamousGamesByEco(eco);
  if (games.length === 0) {
    games = findFamousGamesByOpening(openingName);
  }

  // If no matches, show all games as "inspiration"
  if (games.length === 0) {
    games = allFamousGames;
  }

  return (
    <div className="p-3 space-y-3">
      {/* Intro text */}
      <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
        <span className="text-xl">⭐</span>
        <span>
          {locale === 'de'
            ? 'Beruehmte Partien in dieser Eroeffnung - lerne von den Besten!'
            : 'Famous games in this opening - learn from the best!'}
        </span>
      </div>

      {/* Game cards */}
      {games.map((game, i) => (
        <GameCard key={i} game={game} />
      ))}

      {games.length === 0 && (
        <div className="text-center py-6 text-[var(--color-text-muted)]">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-base">
            {locale === 'de'
              ? 'Spiele ein paar Zuege um passende Partien zu finden...'
              : 'Play a few moves to find matching games...'}
          </p>
        </div>
      )}
    </div>
  );
}
