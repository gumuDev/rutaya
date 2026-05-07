'use client';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('rutaya_token');
}

export function saveSession(token: string, companyId: string, companyName: string, role: string) {
  localStorage.setItem('rutaya_token', token);
  localStorage.setItem('rutaya_company_id', companyId);
  localStorage.setItem('rutaya_company_name', companyName);
  localStorage.setItem('rutaya_role', role);
}

export function getRole(): string {
  if (typeof window === 'undefined') return 'operator';
  return localStorage.getItem('rutaya_role') ?? 'operator';
}

export function clearSession() {
  localStorage.removeItem('rutaya_token');
  localStorage.removeItem('rutaya_company_id');
  localStorage.removeItem('rutaya_company_name');
  localStorage.removeItem('rutaya_role');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function saveImpersonation(superToken: string, companyToken: string, companyId: string, companyName: string) {
  localStorage.setItem('rutaya_super_token', superToken);
  saveSession(companyToken, companyId, companyName, 'admin');
}

export function getSuperToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('rutaya_super_token');
}

export function exitImpersonation() {
  const superToken = getSuperToken();
  if (!superToken) return false;
  localStorage.setItem('rutaya_token', superToken);
  localStorage.setItem('rutaya_role', 'superadmin');
  localStorage.removeItem('rutaya_super_token');
  localStorage.removeItem('rutaya_company_id');
  localStorage.removeItem('rutaya_company_name');
  return true;
}
