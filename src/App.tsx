import { Toolbar } from './components/layout/Toolbar';
import { AnalysisPage } from './pages/AnalysisPage';

function App() {
  return (
    <div className="h-full flex flex-col bg-[var(--color-bg)]">
      <Toolbar />
      <AnalysisPage />
    </div>
  );
}

export default App;
