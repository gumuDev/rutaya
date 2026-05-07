'use client';

import { useState, useEffect, useCallback } from 'react';
import { Schedule } from '../types/schedule.types';
import { listSchedules, deleteSchedule, toggleSchedule } from '../services/schedules.service';

export function useSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSchedules(await listSchedules());
    } catch {
      setError('load_failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = async (id: string) => { await deleteSchedule(id); await load(); };
  const toggle = async (id: string) => { await toggleSchedule(id); await load(); };

  return { schedules, loading, error, reload: load, remove, toggle };
}
