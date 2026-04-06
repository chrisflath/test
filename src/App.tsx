import { useState, useEffect } from 'react';
import { Toolbar } from './components/layout/Toolbar';
import { AnalysisPage } from './pages/AnalysisPage';
import { TrainingPage } from './pages/TrainingPage';
import { TrophyCase } from './components/achievements/TrophyCase';
import { AchievementToast } from './components/achievements/AchievementToast';
import { useAchievementStore } from './stores/achievementStore';
import { useI18n } from './i18n';

type View = 'analysis' | 'training' | 'trophies';

function NavTabs({ view, setView }: { view: View; setView: (v: View) => void }) {
  const { locale } = useI18n();

  const tabs: { key: View; icon: string; de: string; en: string }[] = [
    { key: 'analysis', icon: '♟', de: 'Analyse', en: 'Analysis' },
    { key: 'training', icon: '🧠', de: 'Training', en: 'Training' },
    { key: 'trophies', icon: '🏆', de: 'Erfolge', en: 'Trophies' },
  ];

  return (
    <div className="flex border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setView(tab.key)}
          className={`flex-1 py-3 text-base font-medium flex items-center justify-center gap-2
                     transition-colors touch-manipulation cursor-pointer
            ${view === tab.key
              ? 'text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
        >
          <span className="text-lg">{tab.icon}</span>
          <span>{locale === 'de' ? tab.de : tab.en}</span>
        </button>
      ))}
    </div>
  );
}

function App() {
  const [view, setView] = useState<View>('analysis');
  const { recordActivity, updateStudyTime } = useAchievementStore();

  // Record daily activity on mount
  useEffect(() => {
    recordActivity();
  }, [recordActivity]);

  // Update study time every 5 minutes
  useEffect(() => {
    const interval = setInterval(updateStudyTime, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [updateStudyTime]);

  return (
    <div className="h-full flex flex-col bg-[var(--color-bg)]">
      <Toolbar onShowTrophies={() => setView('trophies')} />
      <NavTabs view={view} setView={setView} />

      <div className="flex-1 overflow-y-auto">
        {view === 'analysis' && <AnalysisPage />}
        {view === 'training' && <TrainingPage />}
        {view === 'trophies' && <TrophyCase />}
      </div>

      {/* Achievement toast notifications */}
      <AchievementToast />
    </div>
  );
}

export default App;
