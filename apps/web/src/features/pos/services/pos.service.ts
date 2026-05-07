import { getToken } from '@/features/auth/hooks/useAuth';
import { ScheduleResult } from '@/features/reservations/types/reservation.types';
import { ReservationResult } from '@/features/reservations/types/reservation.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

export async function searchSchedulesPos(origin: string, destination: string, date: string): Promise<ScheduleResult[]> {
  const res = await fetch(
    `${API_URL}/reservations/search?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&date=${date}&passengers=1`,
    { headers: authHeaders() },
  );
  if (!res.ok) throw new Error('load_failed');
  return res.json();
}

export interface PosPayload {
  scheduleId: string;
  passengerName: string;
  passengerPhone: string;
  quantity: number;
  paymentMethod: 'cash' | 'qr';
  travelDate: string;
  selectedSeats?: number[];
}

export async function createPosReservation(payload: PosPayload): Promise<ReservationResult> {
  const res = await fetch(`${API_URL}/reservations/pos`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'request_failed');
  }
  return res.json();
}
