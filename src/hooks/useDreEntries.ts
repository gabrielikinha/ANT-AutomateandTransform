import { useCallback, useEffect, useState } from 'react';
import { DreEntry } from '@/types/dre';
import { fetchEntries } from '@/services/dreService';

export function useDreEntries() {
  const [entries, setEntries] = useState<DreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchEntries();
      setEntries(data);
    } catch (err: any) {
      setError(err?.message || 'Não foi possível carregar seus lançamentos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { entries, loading, error, reload: load, setEntries };
}
