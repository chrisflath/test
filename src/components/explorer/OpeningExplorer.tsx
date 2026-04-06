import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useAchievementStore } from '../../stores/achievementStore';
import { useOpeningExplorer } from '../../hooks/useOpeningExplorer';
import { useI18n } from '../../i18n';
import { MoveTable } from './MoveTable';
import { PlanPanel } from './PlanPanel';
import { FamousGamesPanel } from './FamousGamesPanel';

type Tab = 'moves' | 'plans' | 'games';

export function OpeningExplorer() {
  const { fen } = useGameStore();
  const { data, loading, error, database, setDatabase } = useOpeningExplorer(fen);
  const { t, locale } = useI18n();
  const [activeTab, setActiveTab] = useState<Tab>('moves');
  const lastEcoRef = useRef('');

  const eco = data?.opening?.eco || '';
  const openingName = data?.opening?.name || '';

  // Track openings explored for achievements
  useEffect(() => {
    if (eco && eco !== lastEcoRef.current) {
      lastEcoRef.current = eco;
      useAchievementStore.getState().addOpeningExplored(eco);
    }
  }, [eco]);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'moves', label: locale === 'de' ? 'Zuege' : 'Moves', icon: '♟' },
    { key: 'plans', label: locale === 'de' ? 'Plaene' : 'Plans', icon: '🎯' },
    { key: 'games', label: locale === 'de' ? 'Beruehmte Partien' : 'Famous Games', icon: '⭐' },
  ];

  return (
    <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] overflow-hidden">
      {/* Header with opening name */}
      <div className="px-3 py-2 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-[var(--color-text)] truncate">
            {t('panel.explorer')}
          </h3>
          {/* Database selector */}
          <div className="flex gap-1 text-sm">
            <button
              onClick={() => setDatabase('masters')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer touch-manipulation
                ${database === 'masters'
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
            >
              {t('explorer.masters')}
            </button>
            <button
              onClick={() => setDatabase('lichess')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer touch-manipulation
                ${database === 'lichess'
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
            >
              {t('explorer.lichess')}
            </button>
          </div>
        </div>

        {/* Opening name badge */}
        {openingName && (
          <div className="mt-1 flex items-center gap-2">
            {eco && (
              <span className="bg-[var(--color-surface-2)] text-[var(--color-accent)] px-2 py-0.5 rounded text-sm font-mono font-bold">
                {eco}
              </span>
            )}
            <span className="text-sm text-[var(--color-text-muted)] truncate">
              {openingName}
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--color-border)]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-3 py-2 text-base font-medium transition-colors
                       cursor-pointer touch-manipulation flex items-center justify-center gap-1.5
              ${activeTab === tab.key
                ? 'bg-[var(--color-surface-2)] text-[var(--color-text)] border-b-2 border-[var(--color-accent)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]'
              }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="max-h-[45vh] overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center py-8 text-[var(--color-text-muted)]">
            <div className="animate-spin w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full mr-3" />
            {locale === 'de' ? 'Lade...' : 'Loading...'}
          </div>
        )}

        {error && (
          <div className="p-4 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {activeTab === 'moves' && <MoveTable data={data} />}
            {activeTab === 'plans' && (
              <PlanPanel eco={eco} openingName={openingName} />
            )}
            {activeTab === 'games' && (
              <FamousGamesPanel eco={eco} openingName={openingName} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
