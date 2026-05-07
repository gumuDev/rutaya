import { getToken } from '@/features/auth/hooks/useAuth';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

// El backend maneja el upload a Supabase Storage internamente
// Cuando el backend tenga SUPABASE_URL y SUPABASE_SERVICE_KEY configurados,
// esto funciona automáticamente sin cambios aquí
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const token = getToken();
  const res = await fetch(`${API_URL}/upload/image`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) throw new Error('upload_failed');
  const data = await res.json();
  return data.url;
}
