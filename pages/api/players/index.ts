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

// in-memory fallback for local
type PlayerDoc = {
  _id?: string | ObjectId;
  playerEmail: string;
  playerName?: string;
  playerPhone?: string;
  coursesPlayed?: string[];
  points?: number;
  qualifiedForMillion?: boolean;
  claims?: Array<{
    claimType: string;
    courseId?: string;
    hole?: string;
    status?: "submitted" | "approved" | "denied";
    createdAt?: Date | string;
  }>;
};
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
  const playerEmail = b.playerEmail ?? b.email ?? "";
  const playerName  = b.playerName ?? b.name ?? [first, last].filter(Boolean).join(" ").trim();
  const playerPhone = b.playerPhone ?? b.phone ?? "";
  const course      = b.courseId ?? b.course ?? b.lastCourse ?? "";
  const points      = typeof b.points === "number" ? b.points : undefined;
  const qualifiedForMillion = b.qualifiedForMillion === true;
  return { playerEmail, playerName, playerPhone, course, points, qualifiedForMillion };
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const db = await getDb();

    if (req.method === "GET") {
      if (db) {
        const list = await db.collection<PlayerDoc>("players")
          .find({})
          .sort({ _id: -1 })
          .limit(200)
          .toArray();
        return res.status(200).json({ players: list });
      } else {
        return res.status(200).json({ players: mem.players });
      }
    }
    if (req.method === "POST") {
      const data = normalize(req.body);
      if (!data.playerEmail) {
        return res.status(400).json({ error: "playerEmail (or email) is required" });
      }

      if (db) {
        const set: any = {
          playerName: data.playerName ?? "",
          playerPhone: data.playerPhone ?? "",
        };
        const update: any = {
          $setOnInsert: { points: 0, qualifiedForMillion: false, claims: [] },
          $set: set,
        };
        if (data.course) {
          update.$addToSet = { ...(update.$addToSet || {}), coursesPlayed: data.course };
        }
        if (typeof data.points === "number") update.$set.points = data.points;
        if (typeof data.qualifiedForMillion === "boolean") {
          update.$set.qualifiedForMillion = data.qualifiedForMillion;
        }

        const result = await db.collection<PlayerDoc>("players").findOneAndUpdate(
          { playerEmail: data.playerEmail },
          update,
          { upsert: true, returnDocument: "after" }
        );
        return res.status(201).json({ player: result.value });
      } else {
        const i = mem.players.findIndex(p => p.playerEmail === data.playerEmail);
        const base: PlayerDoc = i >= 0 ? mem.players[i] : {
          _id: String(Date.now()),
          playerEmail: data.playerEmail,
          points: 0,
          qualifiedForMillion: false,
          claims: []
        };
        base.playerName  = data.playerName ?? base.playerName;
        base.playerPhone = data.playerPhone ?? base.playerPhone;
        if (data.course) {
          base.coursesPlayed = Array.from(new Set([...(base.coursesPlayed || []), data.course]));
        }
        if (typeof data.points === "number") base.points = data.points;
        if (typeof data.qualifiedForMillion === "boolean") base.qualifiedForMillion = data.qualifiedForMillion;

        if (i >= 0) mem.players[i] = base; else mem.players.push(base);
        return res.status(201).json({ player: base });
      }
    }

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
      } else {
        const key = String(email || playerEmail || "");
        if (_id) mem.players = mem.players.filter(p => String(p._id) !== String(_id));
        else if (key) mem.players = mem.players.filter(p => p.playerEmail !== key);
        return res.status(200).json({ ok: true });
      }
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e:any) {
    return res.status(500).json({ error: e?.message || "Failed" });
  }
}
