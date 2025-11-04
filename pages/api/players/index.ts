import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "";
const MONGODB_DB = process.env.MONGODB_DB || "par3";
let client: MongoClient | null = null;

async function getDb() {
  if (!MONGODB_URI) return null;
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }
  return client.db(MONGODB_DB);
}

function normalize(body: any) {
  const b = typeof body === "string" ? JSON.parse(body || "{}") : body || {};
  const first = b.firstName || "";
  const last = b.lastName || "";
  const playerEmail = b.playerEmail ?? b.email ?? "";
  const playerName = b.playerName ?? b.name ?? [first, last].filter(Boolean).join(" ").trim();
  const playerPhone = b.playerPhone ?? b.phone ?? "";
  const course = b.courseId ?? b.course ?? "";
  return { playerEmail, playerName, playerPhone, course };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const db = await getDb();

    if (req.method === "GET") {
      const list = db
        ? await db.collection("players").find({}).sort({ _id: -1 }).limit(200).toArray()
        : [];
      return res.status(200).json({ players: list });
    }

    if (req.method === "POST") {
      const data = normalize(req.body);
      if (!data.playerEmail) return res.status(400).json({ error: "email required" });

      await db!.collection("players").updateOne(
        { playerEmail: data.playerEmail },
        {
          $setOnInsert: { points: 0, claims: [], createdAt: new Date() },
          $set: { playerName: data.playerName, playerPhone: data.playerPhone },
          ...(data.course ? { $addToSet: { coursesPlayed: data.course } } : {})
        },
        { upsert: true }
      );

      const updated = await db!.collection("players").findOne({ playerEmail: data.playerEmail });
      return res.status(200).json({ player: updated });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    return res.status(500).json({ error: e.message || "Server error" });
  }
}
