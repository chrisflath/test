import { useAchievementStore } from '../../stores/achievementStore';
import { useI18n } from '../../i18n';
import { getLevelForXp, getXpProgress } from '../../data/achievements';

interface XpBadgeProps {
  onClick?: () => void;
}

export function XpBadge({ onClick }: XpBadgeProps) {
  const { xp, stats } = useAchievementStore();
  const { locale } = useI18n();
  const level = getLevelForXp(xp);
  const progress = getXpProgress(xp);
  const title = locale === 'de' ? level.title_de : level.title_en;

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-surface-2)]
                 rounded-lg border border-[var(--color-border)] cursor-pointer
                 hover:border-[var(--color-accent)] transition-colors touch-manipulation"
    >
      {/* Level icon */}
      <span className="text-xl">{level.icon}</span>

      {/* Level info */}
      <div className="text-left hidden sm:block">
        <div className="text-xs text-[var(--color-text-muted)] leading-none">
          Lv.{level.level} {title}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="w-16 h-1.5 bg-[var(--color-bg)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-accent)] rounded-full"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <span className="text-xs text-yellow-400 font-bold">{xp} XP</span>
        </div>
      </div>

      {/* Streak */}
      {stats.currentStreak > 0 && (
        <span className="text-sm font-bold text-orange-400 flex items-center gap-0.5">
          🔥 {stats.currentStreak}
        </span>
      )}
    </button>
  );
}
