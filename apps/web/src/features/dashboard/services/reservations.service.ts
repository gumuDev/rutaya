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

export const listReservations = (status?: string, date?: string) => {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (date) params.set('date', date);
  const query = params.toString();
  return authFetch(`/reservations${query ? `?${query}` : ''}`);
};

export const confirmReservation = (code: string) => authFetch(`/reservations/${code}/confirm`, { method: 'PATCH' });
export const cancelReservation = (code: string) => authFetch(`/reservations/${code}/cancel`, { method: 'PATCH' });
export const boardReservation = (code: string) => authFetch(`/reservations/${code}/board`, { method: 'PATCH' });
