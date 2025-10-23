// lib/api.ts
// Same-origin API calls (no env var needed)

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

export async function apiGet<T>(path: string, init: RequestInit = {}) {
  const res = await fetch(path, { credentials: "include", ...init });
  return handle<T>(res);
}

export async function apiPatch<T>(path: string, body: unknown) {
  const res = await fetch(path, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  return handle<T>(res);
}
