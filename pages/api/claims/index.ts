import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";
const MONGODB_URI = process.env.MONGODB_URI || "";
const MONGODB_DB  = process.env.MONGODB_DB  || "par3";
let client: MongoClient | null = null;
async function getDb() {
  if (!MONGODB_URI) return null;
  if (!client) { client = new MongoClient(MONGODB_URI); await client.connect(); }
  return client.db(MONGODB_DB);
}
const mem:any = (global as any).__MEM__ || ((global as any).__MEM__ = { players: [], claims: [] });
function cors(res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,x-admin-key");
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  cors(res); if (req.method === "OPTIONS") return res.status(200).end();
  try {
    const db = await getDb();
    if (req.method === "POST") {
      const body = (typeof req.body === "string" ? JSON.parse(req.body||"{}") : req.body) || {};
      const { player_email, course_id, hole, yards } = body;
      if (!player_email) return res.status(400).json({ error: "player_email required" });
      const claim = { id: String(Date.now()), player_email, course_id: course_id||null, hole: hole||null, yards: yards||null, created_at: new Date() };
      if (db) {
        const col = db.collection("claims");
        await col.insertOne(claim as any);
      } else {
        mem.claims.push(claim);
      }
      return res.status(200).json({ ok: true, claim });
    }
    if (req.method === "GET") {
      if (db) {
        const col = db.collection("claims");
        const list = await col.find({}, { projection: { _id: 0 } }).sort({ created_at: -1 }).limit(200).toArray();
        return res.status(200).json(list);
      } else {
        return res.status(200).json(mem.claims.slice().reverse());
      }
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e:any) {
    return res.status(500).json({ error: e?.message || "Failed" });
  }
}
