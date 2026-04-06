import { useState, useEffect } from 'react';
import { Toolbar } from './components/layout/Toolbar';
import { AnalysisPage } from './pages/AnalysisPage';
import { TrophyCase } from './components/achievements/TrophyCase';
import { AchievementToast } from './components/achievements/AchievementToast';
import { useAchievementStore } from './stores/achievementStore';

type View = 'analysis' | 'trophies';

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
      <Toolbar onShowTrophies={() => setView(view === 'trophies' ? 'analysis' : 'trophies')} />

      {view === 'analysis' && <AnalysisPage />}
      {view === 'trophies' && (
        <div className="flex-1 overflow-y-auto">
          <TrophyCase />
        </div>
      )}

      {/* Achievement toast notifications */}
      <AchievementToast />
    </div>
  );
}

export default App;
