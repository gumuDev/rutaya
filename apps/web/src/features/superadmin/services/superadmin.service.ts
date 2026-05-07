import { getToken, saveImpersonation } from '@/features/auth/hooks/useAuth';
import { CompanySummary } from '../types/superadmin.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

export async function listCompanies(): Promise<CompanySummary[]> {
  const res = await fetch(`${API_URL}/companies`, { headers: authHeaders() });
  if (!res.ok) throw new Error('load_failed');
  return res.json();
}

export async function getCompany(id: string): Promise<CompanySummary> {
  const res = await fetch(`${API_URL}/companies/${id}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('not_found');
  return res.json();
}

export async function impersonateCompany(id: string): Promise<void> {
  const superToken = getToken()!;
  const res = await fetch(`${API_URL}/companies/${id}/impersonate`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('impersonate_failed');
  const data = await res.json();
  saveImpersonation(superToken, data.accessToken, data.companyId, data.companyName);
}
