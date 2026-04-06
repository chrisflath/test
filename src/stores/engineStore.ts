import { create } from 'zustand';
import { fetchCloudEval, type CloudEvalResult } from '../services/lichessEval';

interface EngineState {
  /** Whether the engine panel is visible */
  enabled: boolean;
  /** Whether we're currently fetching */
  loading: boolean;
  /** The current evaluation result */
  result: CloudEvalResult | null;
  /** Number of PV lines to show */
  multiPv: number;
  /** Whether the position was found in cloud */
  cloudHit: boolean;
  /** The FEN we last evaluated */
  lastFen: string;

  // Actions
  toggle: () => void;
  setMultiPv: (n: number) => void;
  evaluate: (fen: string) => void;
  clear: () => void;
}

let abortController: AbortController | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | undefined;

export const useEngineStore = create<EngineState>((set, get) => ({
  enabled: false,
  loading: false,
  result: null,
  multiPv: 3,
  cloudHit: false,
  lastFen: '',

  toggle: () => {
    const wasEnabled = get().enabled;
    set({ enabled: !wasEnabled });
    if (!wasEnabled) {
      // Re-evaluate current position when turning on
      const { lastFen } = get();
      if (lastFen) get().evaluate(lastFen);
    }
  },

  setMultiPv: (n: number) => {
    set({ multiPv: n });
    const { lastFen, enabled } = get();
    if (enabled && lastFen) get().evaluate(lastFen);
  },

  evaluate: (fen: string) => {
    const { enabled, multiPv } = get();
    if (!enabled) {
      set({ lastFen: fen });
      return;
    }

    set({ lastFen: fen });

    // Cancel previous request
    if (abortController) abortController.abort();
    if (debounceTimer) clearTimeout(debounceTimer);

    abortController = new AbortController();

    // Debounce 200ms
    debounceTimer = setTimeout(async () => {
      set({ loading: true });

      const result = await fetchCloudEval(fen, multiPv);

      // Only update if this is still the current FEN
      if (get().lastFen === fen) {
        set({
          result,
          loading: false,
          cloudHit: result !== null,
        });
      }
    }, 200);
  },

  clear: () => {
    set({ result: null, loading: false, cloudHit: false });
  },
}));
