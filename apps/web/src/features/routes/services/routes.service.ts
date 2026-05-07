import { CreateRoutePayload, Route, UpdateRoutePayload } from '../types/route.types';
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

export const listRoutes = (): Promise<Route[]> => authFetch('/routes');
export const createRoute = (p: CreateRoutePayload): Promise<Route> => authFetch('/routes', { method: 'POST', body: JSON.stringify(p) });
export const updateRoute = (id: string, p: UpdateRoutePayload): Promise<Route> => authFetch(`/routes/${id}`, { method: 'PATCH', body: JSON.stringify(p) });
export const deleteRoute = (id: string): Promise<void> => authFetch(`/routes/${id}`, { method: 'DELETE' });
