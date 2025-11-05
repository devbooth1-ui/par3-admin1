import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";

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

// Dev-safe in-memory store (when MONGODB_URI is not set/available)
type Player = {
  playerEmail: string;
  playerName?: string;
  playerPhone?: string;
  coursesPlayed?: string[];
  points?: number;
  claims?: any[];
  createdAt?: Date;
};
const mem: { players: Player[] } =
  (global as any).__MEM__ || ((global as any).__MEM__ = { players: [] });

function cors(res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function normalize(body: any) {
  const b = typeof body === "string" ? JSON.parse(body || "{}") : body || {};
  const first = b.firstName || "";
  const last  = b.lastName  || "";
  const playerEmail = b.playerEmail ?? b.email ?? "";
  const playerName  = b.playerName  ?? b.name  ?? [first, last].filter(Boolean).join(" ").trim();
  const playerPhone = b.playerPhone ?? b.phone ?? "";
  const course      = b.courseId    ?? b.course ?? "";
  return { playerEmail, playerName, playerPhone, course };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const db = await getDb();

    if (req.method === "GET") {
      if (db) {
        const list = await db.collection<Player>("players").find({}).sort({ _id: -1 }).limit(200).toArray();
        return res.status(200).json({ players: list });
      } else {
        return res.status(200).json({ players: mem.players });
      }
    }

    if (req.method === "POST") {
      const data = normalize(req.body);
      if (!data.playerEmail) return res.status(400).json({ error: "email required" });

      if (db) {
        await db.collection<Player>("players").updateOne(
          { playerEmail: data.playerEmail },
          {
            $setOnInsert: { points: 0, claims: [], createdAt: new Date() },
            $set: { playerName: data.playerName, playerPhone: data.playerPhone },
            ...(data.course ? { $addToSet: { coursesPlayed: data.course } } : {})
          },
          { upsert: true }
        );
        const updated = await db.collection<Player>("players").findOne({ playerEmail: data.playerEmail });
        return res.status(200).json({ player: updated });
      } else {
        // in-memory upsert
        const i = mem.players.findIndex(p => p.playerEmail === data.playerEmail);
        const base: Player = i >= 0 ? mem.players[i] : { playerEmail: data.playerEmail, points: 0, claims: [], createdAt: new Date() };
        base.playerName  = data.playerName  || base.playerName;
        base.playerPhone = data.playerPhone || base.playerPhone;
        if (data.course) {
          base.coursesPlayed = Array.from(new Set([...(base.coursesPlayed || []), data.course]));
        }
        if (i >= 0) mem.players[i] = base; else mem.players.push(base);
        return res.status(200).json({ player: base });
      }
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    console.error("players API error:", e);
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
