// lib/api.ts
// Single API helper using NEXT_PUBLIC_API_URL.
// Works in the browser and on the server (Next.js).
const API = process.env.NEXT_PUBLIC_API_URL;

if (!API) {
  // Non-fatal: the page will render but fetches will fail until set in Vercel.
  // Set in Vercel → Project → Settings → Environment Variables
  // Example: https://api.par3challenge.com or http://localhost:4000 for dev
  // NEXT_PUBLIC_API_URL=<your-backend>
  console.warn("⚠ NEXT_PUBLIC_API_URL is not set.");
}

type JSONLike = Record<string, unknown> | unknown[] | string | number | boolean | null;

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}${text ? `: ${text}` : ""}`);
  }
  return (await res.json()) as T;
}

export async function apiGet<T>(path: string, init: RequestInit = {}) {
  if (!API) throw new Error("NEXT_PUBLIC_API_URL is not configured");
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    ...init,
    headers: {
      ...(init.headers || {}),
      // Accept JSON responses
      Accept: "application/json",
    },
  });
  return handle<T>(res);
}

export async function apiPatch<T>(path: string, body: JSONLike) {
  if (!API) throw new Error("NEXT_PUBLIC_API_URL is not configured");
  const res = await fetch(`${API}${path}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body ?? {}),
  });
  return handle<T>(res);
}

export async function apiPost<T>(path: string, body: JSONLike) {
  if (!API) throw new Error("NEXT_PUBLIC_API_URL is not configured");
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body ?? {}),
  });
  return handle<T>(res);
}
