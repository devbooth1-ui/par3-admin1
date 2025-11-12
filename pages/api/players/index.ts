import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "";
const MONGODB_DB  = process.env.MONGODB_DB  || "par3";

let client: MongoClient | null = null;
async function getDb() {
  if (!MONGODB_URI) return null;
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }
  return client.db(MONGODB_DB);
}

type ClaimLog = {
  claimType: string;
  courseId?: string;
  hole?: string;
  status?: "submitted" | "approved" | "denied";
  createdAt?: Date | string;
};

type PlayerDoc = {
  _id?: string | ObjectId;
  playerEmail: string;
  playerName?: string;
  playerPhone?: string;
  coursesPlayed?: string[];
  points?: number;
  qualifiedForMillion?: boolean;
  claims?: ClaimLog[];
};

// in-memory fallback (dev safety)
const mem: { players: PlayerDoc[] } =
  (global as any).__MEM__ || ((global as any).__MEM__ = { players: [] });

function cors(res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,x-admin-key");
}

function normalize(body: any) {
  const b = typeof body === "string" ? JSON.parse(body || "{}") : (body || {});
  const first = b.firstName || "";
  const last  = b.lastName  || "";
  const playerEmail = (b.playerEmail ?? b.email ?? "").trim();
  const playerName  = (b.playerName ?? b.name ?? [first, last].filter(Boolean).join(" ")).trim();
  const playerPhone = (b.playerPhone ?? b.phone ?? "").trim();
  const course      = (b.courseId ?? b.course ?? b.lastCourse ?? "").trim();
  const points      = typeof b.points === "number" ? b.points : undefined;
  const qualifiedForMillion = b.qualifiedForMillion === true;
  return { playerEmail, playerName, playerPhone, course, points, qualifiedForMillion };
}

// helper: remove conflicting nested/parent paths in one payload
function dedupePathConflicts(obj: any) {
  const flat: Record<string, any> = {};
  const seenParents = new Set<string>();
  // flatten with dot-notation
  function walk(cur: any, prefix = '') {
    Object.entries(cur || {}).forEach(([k, v]) => {
      const path = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        walk(v, path);
      } else {
        flat[path] = v;
      }
    });
  }
  walk(obj);
  // detect conflicts: e.g., "a" and "a.b"
  const paths = Object.keys(flat).sort((a,b)=>a.length-b.length);
  const keep: Record<string, any> = {};
  for (const p of paths) {
    const parent = p.split('.').slice(0, -1).join('.');
    if (parent && (parent in keep || seenParents.has(parent))) {
      continue;
    }
    let acc = '';
    p.split('.').forEach(seg => {
      acc = acc ? `${acc}.${seg}` : seg;
      seenParents.add(acc);
    });
    keep[p] = flat[p];
  }
  return keep;
}

// OPTIONAL: remove undefined/null keys
function compact(obj: any) {
  return Object.fromEntries(Object.entries(obj).filter(([_,v]) => v !== undefined && v !== null));
}

// --- EMERGENCY HOT-FIX: drop child dotted paths if parent exists ---
// Example: keep `qualifiedForMillion` and DROP `qualifiedForMillion.lastQualifiedAt` (or any `qualifiedForMillion.*`)
function dropParentChildConflicts<T extends Record<string, any>>(data: T): T {
  const cleaned: Record<string, any> = { ...data };
  const keys = Object.keys(cleaned);
  for (const k of keys) {
    if (k.includes('.')) {
      const parent = k.split('.')[0];
      if (parent in cleaned) {
        delete cleaned[k]; // parent + child causes Firestore conflict → drop child
      }
    }
  }
  return cleaned as T;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const db = await getDb();

    // GET: list players -> { players: [...] }
    if (req.method === "GET") {
      if (db) {
        const list = await db.collection<PlayerDoc>("players")
          .find({})
          .sort({ _id: -1 })
          .limit(300)
          .toArray();
        return res.status(200).json({ players: list });
      }
      return res.status(200).json({ players: mem.players });
    }

    // POST: upsert-by-email (accepts legacy + new payload shapes)
    if (req.method === "POST") {
      // Sanitize payload
      const body = req.body || (typeof (req as any).json === 'function' ? await (req as any).json() : {});
      const clean = compact(body);
      const updateMap = dedupePathConflicts(clean);
      const data = normalize(updateMap);
      // --- HOT-FIX: drop parent/child conflicts ---
      const safeData = dropParentChildConflicts(data);
      if (!safeData.playerEmail) {
        return res.status(400).json({ error: "playerEmail (or email) is required" });
      }
      if (db) {
        // Upsert with sanitized payload
        await db.collection<PlayerDoc>("players").updateOne(
          { playerEmail: safeData.playerEmail },
          { $set: safeData },
          { upsert: true }
        );
        const updated = await db.collection<PlayerDoc>("players")
          .findOne({ playerEmail: safeData.playerEmail });
        return res.status(201).json({ player: updated });
      }
      // mem fallback
      const i = mem.players.findIndex(p => p.playerEmail === data.playerEmail);
      const base: PlayerDoc = i >= 0 ? mem.players[i] : {
        _id: String(Date.now()),
        playerEmail: data.playerEmail,
        points: 0,
        qualifiedForMillion: false,
        claims: []
      };
      if (data.playerName)  base.playerName  = data.playerName;
      if (data.playerPhone) base.playerPhone = data.playerPhone;
      if (data.course) base.coursesPlayed = Array.from(new Set([...(base.coursesPlayed || []), data.course]));
      if (typeof data.points === "number") base.points = data.points;
      if (typeof data.qualifiedForMillion === "boolean") base.qualifiedForMillion = data.qualifiedForMillion;

      if (i >= 0) mem.players[i] = base; else mem.players.push(base);
      return res.status(201).json({ player: base });
    }

    // DELETE: by _id or playerEmail
    if (req.method === "DELETE") {
      const {_id, email, playerEmail} = (typeof req.body === "string" ? JSON.parse(req.body||"{}") : req.body) || {};
      if (!(_id || email || playerEmail)) {
        return res.status(400).json({ error: "_id or playerEmail required" });
      }
      if (db) {
        if (_id) {
          await db.collection("players").deleteOne({ _id: new ObjectId(String(_id)) });
        } else {
          await db.collection("players").deleteOne({ playerEmail: String(email || playerEmail) });
        }
        return res.status(200).json({ ok: true });
      }
      const key = String(email || playerEmail || "");
      if (_id) mem.players = mem.players.filter(p => String(p._id) !== String(_id));
      else if (key) mem.players = mem.players.filter(p => p.playerEmail !== key);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    console.error("players.api error:", e);
    return res.status(500).json({ error: e?.message || "Failed" });
  }
}
