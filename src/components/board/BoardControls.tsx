import { useGameStore } from '../../stores/gameStore';
import { useI18n } from '../../i18n';

export function BoardControls() {
  const { goToStart, goBack, goForward, goToEnd, flipBoard } = useGameStore();
  const { t } = useI18n();

  const buttons = [
    { icon: '⏮', action: goToStart, label: t('board.start') },
    { icon: '◀', action: goBack, label: t('board.back') },
    { icon: '▶', action: goForward, label: t('board.forward') },
    { icon: '⏭', action: goToEnd, label: t('board.end') },
    { icon: '🔄', action: flipBoard, label: t('board.flip') },
  ];

  return (
    <div className="flex justify-center gap-1 mt-2">
      {buttons.map((btn) => (
        <button
          key={btn.label}
          onClick={btn.action}
          title={btn.label}
          className="flex items-center justify-center w-12 h-12 text-2xl
                     bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)]
                     rounded-lg transition-colors cursor-pointer
                     border border-[var(--color-border)]
                     touch-manipulation select-none"
        >
          {btn.icon}
        </button>
      ))}
    </div>
  );
}
