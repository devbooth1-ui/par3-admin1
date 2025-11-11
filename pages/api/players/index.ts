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
      const data = normalize(req.body);
      if (!data.playerEmail) {
        return res.status(400).json({ error: "playerEmail (or email) is required" });
      }

      if (db) {
        const set: any = {
          ...(data.playerName ? { playerName: data.playerName } : {}),
          ...(data.playerPhone ? { playerPhone: data.playerPhone } : {}),
        };

        const update: any = {
          $setOnInsert: { points: 0, qualifiedForMillion: false, claims: [] as ClaimLog[] },
          ...(Object.keys(set).length ? { $set: set } : {})
        };

        if (data.course) {
          update.$addToSet = { ...(update.$addToSet || {}), coursesPlayed: data.course };
        }
        if (typeof data.points === "number") {
          update.$set = { ...(update.$set || {}), points: data.points };
        }
        if (typeof data.qualifiedForMillion === "boolean") {
          update.$set = { ...(update.$set || {}), qualifiedForMillion: data.qualifiedForMillion };
        }

        await db.collection<PlayerDoc>("players").updateOne(
          { playerEmail: data.playerEmail },
          update,
          { upsert: true }
        );

        const updated = await db.collection<PlayerDoc>("players")
          .findOne({ playerEmail: data.playerEmail });

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
