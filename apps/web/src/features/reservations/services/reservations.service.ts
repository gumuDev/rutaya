import { CreateReservationPayload, ReservationResult, ScheduleResult, SeatsResponse } from '../types/reservation.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? 'request_failed');
  }
  return res.json();
}

export const searchSchedules = (origin: string, destination: string, date: string, passengers = 1): Promise<ScheduleResult[]> =>
  apiFetch(`/reservations/search?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&date=${date}&passengers=${passengers}`);

export const createReservation = (payload: CreateReservationPayload): Promise<ReservationResult> =>
  apiFetch('/reservations', { method: 'POST', body: JSON.stringify(payload) });

export const getSeats = (scheduleId: string, date: string): Promise<SeatsResponse> =>
  apiFetch(`/reservations/seats/${scheduleId}?date=${date}`);
