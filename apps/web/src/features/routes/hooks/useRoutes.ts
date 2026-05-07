'use client';

import { useState, useEffect, useCallback } from 'react';
import { Route } from '../types/route.types';
import { listRoutes, deleteRoute } from '../services/routes.service';

export function useRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRoutes(await listRoutes());
    } catch {
      setError('load_failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = async (id: string) => {
    await deleteRoute(id);
    await load();
  };

  return { routes, loading, error, reload: load, remove };
}
