import { LoginPayload, LoginResponse, RegisterCompanyPayload } from '../types/auth.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export async function registerCompany(payload: RegisterCompanyPayload) {
  const res = await fetch(`${API_URL}/companies/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message ?? 'register_failed');
  }
  return res.json();
}

export async function loginCompany(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/companies/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message ?? 'login_failed');
  }
  return res.json();
}
