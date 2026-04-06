import { useEffect, useState } from 'react';
import { useAchievementStore } from '../../stores/achievementStore';
import { useI18n } from '../../i18n';
import { getLevelForXp, getXpProgress } from '../../data/achievements';

export function AchievementToast() {
  const { toastQueue, dismissToast, xp } = useAchievementStore();
  const { locale } = useI18n();
  const [visible, setVisible] = useState(false);

  const toast = toastQueue[0];

  useEffect(() => {
    if (!toast) {
      setVisible(false);
      return;
    }

    // Show animation
    setVisible(true);

    // Auto-dismiss after 4 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(dismissToast, 300); // Wait for fade-out animation
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast, dismissToast]);

  if (!toast) return null;

  const name = locale === 'de' ? toast.name_de : toast.name_en;
  const description = locale === 'de' ? toast.description_de : toast.description_en;
  const tierColors = {
    bronze: 'from-amber-900/90 to-amber-800/90 border-amber-600',
    silver: 'from-gray-600/90 to-gray-500/90 border-gray-300',
    gold: 'from-yellow-700/90 to-yellow-600/90 border-yellow-400',
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm transition-all duration-300
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
    >
      <div
        className={`rounded-xl p-4 border-2 bg-gradient-to-r shadow-2xl
          ${tierColors[toast.tier]}`}
        onClick={() => {
          setVisible(false);
          setTimeout(dismissToast, 300);
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="text-4xl">{toast.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase tracking-wider text-yellow-200 font-bold">
              {locale === 'de' ? 'Erfolg freigeschaltet!' : 'Achievement Unlocked!'}
            </div>
            <div className="text-lg font-bold text-white truncate">{name}</div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-yellow-300 font-bold text-lg">+{toast.xp} XP</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-white/80 mt-1 ml-[52px]">{description}</p>

        {/* XP bar */}
        <div className="mt-2 ml-[52px]">
          <XpMiniBar xp={xp} />
        </div>
      </div>
    </div>
  );
}

function XpMiniBar({ xp }: { xp: number }) {
  const { locale } = useI18n();
  const level = getLevelForXp(xp);
  const progress = getXpProgress(xp);
  const title = locale === 'de' ? level.title_de : level.title_en;

  return (
    <div className="flex items-center gap-2 text-xs text-white/70">
      <span>{level.icon} {title}</span>
      <div className="flex-1 h-1.5 bg-black/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-500"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
      <span>{progress.current}/{progress.needed}</span>
    </div>
  );
}
