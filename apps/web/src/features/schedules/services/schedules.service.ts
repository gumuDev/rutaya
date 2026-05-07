import { CreateSchedulePayload, Schedule, UpdateSchedulePayload } from '../types/schedule.types';
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

export const listSchedules = (): Promise<Schedule[]> => authFetch('/schedules');
export const createSchedule = (p: CreateSchedulePayload): Promise<Schedule> => authFetch('/schedules', { method: 'POST', body: JSON.stringify(p) });
export const updateSchedule = (id: string, p: UpdateSchedulePayload): Promise<Schedule> => authFetch(`/schedules/${id}`, { method: 'PATCH', body: JSON.stringify(p) });
export const toggleSchedule = (id: string): Promise<Schedule> => authFetch(`/schedules/${id}/toggle`, { method: 'PATCH' });
export const deleteSchedule = (id: string): Promise<void> => authFetch(`/schedules/${id}`, { method: 'DELETE' });
