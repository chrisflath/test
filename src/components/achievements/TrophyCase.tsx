import { useState } from 'react';
import { useAchievementStore } from '../../stores/achievementStore';
import { useI18n } from '../../i18n';
import {
  achievements,
  getLevelForXp,
  getXpProgress,
  getNextLevel,
  levels,
  type AchievementDef,
  type AchievementCategory,
} from '../../data/achievements';

const categoryInfo: Record<AchievementCategory, { icon: string; de: string; en: string }> = {
  study: { icon: '📚', de: 'Studium', en: 'Study' },
  explorer: { icon: '🔍', de: 'Explorer', en: 'Explorer' },
  opening: { icon: '♟', de: 'Eroeffnungen', en: 'Openings' },
  famous: { icon: '⭐', de: 'Beruehmte Partien', en: 'Famous Games' },
  streak: { icon: '🔥', de: 'Serien', en: 'Streaks' },
  collection: { icon: '📋', de: 'Sammlung', en: 'Collection' },
  mastery: { icon: '🏆', de: 'Meisterschaft', en: 'Mastery' },
};

function AchievementCard({
  achievement,
  unlocked,
}: {
  achievement: AchievementDef;
  unlocked: boolean;
}) {
  const { locale } = useI18n();
  const name = locale === 'de' ? achievement.name_de : achievement.name_en;
  const description = locale === 'de' ? achievement.description_de : achievement.description_en;

  const isHidden = achievement.secret && !unlocked;

  const tierBorder = {
    bronze: 'border-amber-700',
    silver: 'border-gray-400',
    gold: 'border-yellow-500',
  };

  const tierBg = {
    bronze: 'bg-amber-900/20',
    silver: 'bg-gray-500/20',
    gold: 'bg-yellow-600/20',
  };

  return (
    <div
      className={`rounded-lg p-3 border-2 transition-all
        ${unlocked
          ? `${tierBorder[achievement.tier]} ${tierBg[achievement.tier]}`
          : 'border-[var(--color-border)] opacity-50 grayscale'
        }`}
    >
      <div className="flex items-start gap-3">
        <span className={`text-3xl ${unlocked ? '' : 'grayscale'}`}>
          {isHidden ? '❓' : achievement.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-bold text-base text-[var(--color-text)] truncate">
              {isHidden
                ? (locale === 'de' ? 'Geheime Errungenschaft' : 'Secret Achievement')
                : name}
            </h4>
            <span className="text-sm text-yellow-400 font-bold flex-shrink-0">
              {unlocked ? `+${achievement.xp} XP` : `${achievement.xp} XP`}
            </span>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5 leading-relaxed">
            {isHidden
              ? (locale === 'de' ? 'Weiter spielen um es herauszufinden...' : 'Keep playing to find out...')
              : description}
          </p>
          {unlocked && (
            <span className="inline-block mt-1 text-xs text-green-400 font-medium">
              ✓ {locale === 'de' ? 'Freigeschaltet' : 'Unlocked'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function TrophyCase() {
  const { unlocked, xp, stats } = useAchievementStore();
  const { locale } = useI18n();
  const [filter, setFilter] = useState<AchievementCategory | 'all'>('all');

  const unlockedIds = new Set(unlocked.map((u) => u.id));
  const level = getLevelForXp(xp);
  const nextLevel = getNextLevel(xp);
  const progress = getXpProgress(xp);

  const filteredAchievements =
    filter === 'all'
      ? achievements
      : achievements.filter((a) => a.category === filter);

  const unlockedCount = unlocked.length;
  const totalCount = achievements.filter((a) => !a.secret).length;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* Player card */}
      <div className="bg-[var(--color-surface)] rounded-xl p-5 border border-[var(--color-border)]">
        <div className="flex items-center gap-4">
          {/* Level icon */}
          <div className="text-5xl">{level.icon}</div>

          <div className="flex-1">
            {/* Level and title */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--color-text-muted)]">Level {level.level}</span>
              <span className="text-xl font-bold text-[var(--color-text)]">
                {locale === 'de' ? level.title_de : level.title_en}
              </span>
            </div>

            {/* XP bar */}
            <div className="mt-2">
              <div className="flex justify-between text-sm text-[var(--color-text-muted)] mb-1">
                <span>{xp} XP</span>
                {nextLevel && (
                  <span>
                    {locale === 'de' ? 'Naechstes Level' : 'Next level'}: {nextLevel.minXp} XP
                  </span>
                )}
              </div>
              <div className="h-3 bg-[var(--color-bg)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--color-accent)] to-yellow-400 rounded-full transition-all duration-700"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex gap-4 mt-3 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--color-text)]">
                  {stats.currentStreak}
                </div>
                <div className="text-[var(--color-text-muted)] text-xs">
                  🔥 {locale === 'de' ? 'Tage-Serie' : 'Day Streak'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--color-text)]">
                  {stats.gamesStudied}
                </div>
                <div className="text-[var(--color-text-muted)] text-xs">
                  ♟ {locale === 'de' ? 'Partien' : 'Games'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--color-text)]">
                  {stats.openingsExplored.length}
                </div>
                <div className="text-[var(--color-text-muted)] text-xs">
                  📖 {locale === 'de' ? 'Eroeffnungen' : 'Openings'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--color-text)]">
                  {unlockedCount}/{totalCount}
                </div>
                <div className="text-[var(--color-text-muted)] text-xs">
                  🏅 {locale === 'de' ? 'Erfolge' : 'Achievements'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Level progression preview */}
        <div className="mt-4 flex items-center gap-1 overflow-x-auto pb-1">
          {levels.map((l) => (
            <div
              key={l.level}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm flex-shrink-0
                ${l.level === level.level
                  ? 'bg-[var(--color-accent)] text-white font-bold'
                  : l.minXp <= xp
                    ? 'bg-[var(--color-surface-2)] text-[var(--color-text)]'
                    : 'bg-[var(--color-bg)] text-[var(--color-text-muted)] opacity-50'
                }`}
            >
              <span>{l.icon}</span>
              <span className="hidden sm:inline">
                {locale === 'de' ? l.title_de : l.title_en}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                     cursor-pointer touch-manipulation flex-shrink-0
            ${filter === 'all'
              ? 'bg-[var(--color-accent)] text-white'
              : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
        >
          {locale === 'de' ? 'Alle' : 'All'}
        </button>
        {Object.entries(categoryInfo).map(([key, info]) => (
          <button
            key={key}
            onClick={() => setFilter(key as AchievementCategory)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                       cursor-pointer touch-manipulation flex-shrink-0 flex items-center gap-1
              ${filter === key
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
          >
            <span>{info.icon}</span>
            <span>{locale === 'de' ? info.de : info.en}</span>
          </button>
        ))}
      </div>

      {/* Achievement grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredAchievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            unlocked={unlockedIds.has(achievement.id)}
          />
        ))}
      </div>
    </div>
  );
}
