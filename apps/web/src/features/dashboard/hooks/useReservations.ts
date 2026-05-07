'use client';

import { useState, useEffect, useCallback } from 'react';
import { listReservations, confirmReservation, cancelReservation, boardReservation } from '../services/reservations.service';

export function useReservations(status?: string, date?: string) {
  const [reservations, setReservations] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setReservations(await listReservations(status, date));
    } catch {
      setError('load_failed');
    } finally {
      setLoading(false);
    }
  }, [status, date]);

  useEffect(() => { load(); }, [load]);

  const confirm = async (code: string) => { await confirmReservation(code); await load(); };
  const cancel = async (code: string) => { await cancelReservation(code); await load(); };
  const board = async (code: string) => { await boardReservation(code); await load(); };

  return { reservations, loading, error, reload: load, confirm, cancel, board };
}
