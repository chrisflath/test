import { create } from 'zustand';

export type SidePanel = 'explorer' | 'engine' | 'database';

interface UIState {
  activePanel: SidePanel;
  showEngine: boolean;
  showExplorer: boolean;

  setActivePanel: (panel: SidePanel) => void;
  toggleEngine: () => void;
  toggleExplorer: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activePanel: 'explorer',
  showEngine: false,
  showExplorer: true,

  setActivePanel: (panel) => set({ activePanel: panel }),
  toggleEngine: () => set((s) => ({ showEngine: !s.showEngine })),
  toggleExplorer: () => set((s) => ({ showExplorer: !s.showExplorer })),
}));
