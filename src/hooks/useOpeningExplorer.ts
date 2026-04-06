import { useEffect, useState, useRef } from 'react';
import { fetchExplorerData, type ExplorerDatabase } from '../services/lichessApi';
import type { ExplorerData } from '../types/chess';

interface UseOpeningExplorerResult {
  data: ExplorerData | null;
  loading: boolean;
  error: string | null;
  database: ExplorerDatabase;
  setDatabase: (db: ExplorerDatabase) => void;
}

export function useOpeningExplorer(fen: string): UseOpeningExplorerResult {
  const [data, setData] = useState<ExplorerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [database, setDatabase] = useState<ExplorerDatabase>('masters');
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    // Debounce: wait 300ms after last FEN change
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      // Cancel previous request
      if (abortRef.current) {
        abortRef.current.abort();
      }

      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      fetchExplorerData(fen, database)
        .then((result) => {
          if (!controller.signal.aborted) {
            setData(result);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (!controller.signal.aborted) {
            setError(err.message);
            setLoading(false);
          }
        });
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [fen, database]);

  return { data, loading, error, database, setDatabase };
}
