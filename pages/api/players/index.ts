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

// in-memory fallback (not durable, but fine to prove the flow)
const mem: any = (global as any).__MEM__ || ((global as any).__MEM__ = { players: [], claims: [] });

function cors(res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,x-admin-key");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const db = await getDb();

    if (req.method === "POST") {
      const { name, email } = (typeof req.body === "string" ? JSON.parse(req.body||"{}") : req.body) || {};
      if (!name || !email) return res.status(400).json({ error: "Missing or invalid required fields: name, email" });

      if (db) {
        const col = db.collection("players");
        await col.updateOne(
          { email },
          { $set: { name, email }, $setOnInsert: { claims_count: 0, points: 0, created_at: new Date() } },
          { upsert: true }
        );
        const doc = await col.findOne({ email }, { projection: { _id: 0 } });
        return res.status(200).json({ ok: true, player: doc });
      } else {
        const i = mem.players.findIndex((p:any) => p.email === email);
        const p = { name, email, claims_count: 0, points: 0 };
        if (i >= 0) mem.players[i] = { ...mem.players[i], ...p };
        else mem.players.push(p);
        return res.status(200).json({ ok: true, player: p });
      }
    }

    if (req.method === "GET") {
      const q = String((req.query.search || "") as string).toLowerCase();
      if (db) {
        const col = db.collection("players");
        const query = q ? { $or: [ { name: { $regex: q, $options: "i" } }, { email: { $regex: q, $options: "i" } } ] } : {};
        const list = await col.find(query, { projection: { _id: 0 } }).limit(200).toArray();
        return res.status(200).json(list);
      } else {
        const list = mem.players.filter((p:any) =>
          !q || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
        );
        return res.status(200).json(list);
      }
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e:any) {
    return res.status(500).json({ error: e?.message || "Failed" });
  }
}
