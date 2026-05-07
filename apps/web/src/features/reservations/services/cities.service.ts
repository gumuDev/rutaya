const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export interface City {
  id: string;
  name: string;
  department: string;
}

export async function searchCities(q: string): Promise<City[]> {
  if (q.trim().length < 2) return [];
  const res = await fetch(`${API_URL}/cities?q=${encodeURIComponent(q)}`);
  if (!res.ok) return [];
  return res.json();
}
