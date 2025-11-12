// pages/api/players/index.js
// Minimal, safe Firestore Admin API for players
// - CORS
// - Payload sanitize to avoid "Updating the path ... would create a conflict"
// - Uses set({ merge: true }) to avoid nested/parent update conflicts

import admin from 'firebase-admin';

// --- Firestore Admin init (works on Vercel) ---
if (!admin.apps.length) {
  // On Vercel, GOOGLE_APPLICATION_CREDENTIALS is not used.
  // Use default credentials if running locally with gcloud auth,
  // or rely on FIREBASE_CONFIG/GOOGLE_* env set in your project.
  admin.initializeApp();
}
const db = admin.firestore();

// --- CORS allowlist (comma-separated) ---
const allowlist = (process.env.ALLOWED_ORIGIN || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

function setCors(req, res) {
  const origin = req.headers.origin || '';
  const allowed = allowlist.length === 0 || allowlist.includes(origin);
  res.setHeader('Access-Control-Allow-Origin', allowed ? (allowlist.length ? origin : '*') : '');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-admin-key');
}

function isPlainObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}

// Drop nested keys if we are also setting their parent in the same payload
function sanitizeConflicts(obj) {
  const data = { ...obj };
  // Build a set of top-level parent keys present
  const parents = new Set(Object.keys(data));
  // If a parent exists, remove any "parent.*" keys in the same object
  for (const p of parents) {
    const prefix = p + '.';
    for (const k of Object.keys(data)) {
      if (k.startsWith(prefix)) delete data[k];
    }
  }
  return data;
}

// If the body was sent as nested objects, flatten conflicts by preferring parents
function flattenIfNeeded(obj, prefix = '', out = {}) {
  if (!isPlainObject(obj)) return out;
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (isPlainObject(v)) {
      flattenIfNeeded(v, path, out);
    } else {
      out[path] = v;
    }
  }
  return out;
}

function unflatten(map) {
  const root = {};
  for (const [path, value] of Object.entries(map)) {
    const parts = path.split('.');
    let cur = root;
    for (let i = 0; i < parts.length; i++) {
      const key = parts[i];
      if (i === parts.length - 1) {
        cur[key] = value;
      } else {
        if (!isPlainObject(cur[key])) cur[key] = {};
        cur = cur[key];
      }
    }
  }
  return root;
}

export default async function handler(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'POST') {
      const body =
        req.body && Object.keys(req.body).length
          ? req.body
          : (typeof req.json === 'function' ? await req.json() : {});

      // require an identifier
      const id = (body.id || body.email || '').toString().trim().toLowerCase();
      if (!id) return res.status(400).json({ ok: false, error: 'Missing player identifier (email or id).' });

      // 1) Flatten nested objects, 2) remove parent/child conflicts, 3) unflatten back
      const flat = flattenIfNeeded(body);
      const noConflicts = sanitizeConflicts(flat);
      const merged = unflatten(noConflicts);

      // Write safely (prevents parent/child conflicts)
      await db.collection('players').doc(id).set(merged, { merge: true });

      return res.status(200).json({ ok: true, id });
    }

    if (req.method === 'GET') {
      // optional: list/read stub (kept simple)
      return res.status(200).json({ ok: true, info: 'GET /api/players ready' });
    }

    res.setHeader('Allow', 'GET,POST,DELETE,OPTIONS');
    return res.status(405).end();
  } catch (err) {
    console.error('POST /api/players error:', err);
    return res.status(500).json({ error: err?.message || 'Unknown error' });
  }
}
