'use client';

import { useState, useEffect, useCallback } from 'react';
import { Vehicle } from '../types/vehicle.types';
import { listVehicles, deleteVehicle } from '../services/vehicles.service';

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setVehicles(await listVehicles());
    } catch {
      setError('load_failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = async (id: string) => {
    await deleteVehicle(id);
    await load();
  };

  return { vehicles, loading, error, reload: load, remove };
}
