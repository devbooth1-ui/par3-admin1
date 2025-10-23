// lib/api.ts
const API = process.env.NEXT_PUBLIC_API_URL!;
if (!API) console.warn("NEXT_PUBLIC_API_URL missing");

export async function apiGet<T>(path: string, init: RequestInit = {}) {
  const r = await fetch(`${API}${path}`, { credentials: 'include', ...init });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return (await r.json()) as T;
}
export async function apiPatch<T>(path: string, body: unknown) {
  return apiGet<T>(path, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
