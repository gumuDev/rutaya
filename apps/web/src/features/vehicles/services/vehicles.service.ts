import { CreateVehiclePayload, UpdateVehiclePayload, Vehicle } from '../types/vehicle.types';
import { getToken } from '@/features/auth/hooks/useAuth';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

async function authFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? 'request_failed');
  }
  if (res.status === 204) return;
  return res.json();
}

export const listVehicles = (): Promise<Vehicle[]> => authFetch('/vehicles');

export const createVehicle = (payload: CreateVehiclePayload): Promise<Vehicle> =>
  authFetch('/vehicles', { method: 'POST', body: JSON.stringify(payload) });

export const updateVehicle = (id: string, payload: UpdateVehiclePayload): Promise<Vehicle> =>
  authFetch(`/vehicles/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });

export const deleteVehicle = (id: string): Promise<void> =>
  authFetch(`/vehicles/${id}`, { method: 'DELETE' });
