import { getToken } from '@/features/auth/hooks/useAuth';
import { Operator, CreateOperatorPayload, UpdateOperatorPayload } from '../types/team.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

export async function listOperators(): Promise<Operator[]> {
  const res = await fetch(`${API_URL}/companies/operators`, { headers: authHeaders() });
  if (!res.ok) throw new Error('load_failed');
  return res.json();
}

export async function createOperator(payload: CreateOperatorPayload): Promise<Operator> {
  const res = await fetch(`${API_URL}/companies/operators`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'save_failed');
  }
  return res.json();
}

export async function updateOperator(id: string, payload: UpdateOperatorPayload): Promise<void> {
  const res = await fetch(`${API_URL}/companies/operators/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'save_failed');
  }
}

export async function deleteOperator(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/companies/operators/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('delete_failed');
}
