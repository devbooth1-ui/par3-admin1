import type { NextApiRequest, NextApiResponse } from "next";
import mongoose, { Model, Document } from "mongoose";

// --- Types ---
interface IPlayer extends Document {
  name: string;
  email: string;
  phone: string;
  stats: {
    points?: number;
    lastPlayed?: string; // date or round description
    bestScore?: number;
    qualified?: boolean;
    lastReward?: string;
    lastDate?: string;
    holeInOneQualified?: boolean;
    tournamentRegistered?: boolean;
  };
}

// --- Schema ---
const playerSchema = new mongoose.Schema<IPlayer>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, default: "" },
  stats: {
    points: { type: Number, default: 0 },
    lastPlayed: { type: String, default: "" },
    bestScore: { type: Number, default: 99 },
    qualified: { type: Boolean, default: false },
    lastReward: { type: String, default: "" },
    lastDate: { type: String, default: "" },
    holeInOneQualified: { type: Boolean, default: false },
    tournamentRegistered: { type: Boolean, default: false }
  },
}, { minimize: true }); // minimize removes empty objects

const Player: Model<IPlayer> =
  (mongoose.models.Player as Model<IPlayer>) || mongoose.model<IPlayer>("Player", playerSchema);

// --- Mongo Connection Helper ---
const connectMongo = async () => {
  if (mongoose.connection.readyState < 1) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }
};

// --- API Handler ---
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS headers for EVERY request
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  await connectMongo();

  // --- Create or Update Player ---
  if (req.method === "POST") {
    const { name, email, phone, stats } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    // Upsert player info by email
    const player = await Player.findOneAndUpdate(
      { email },
      { name, phone, stats },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json(player);
  }

  // --- Get Players (compact or full) ---
  if (req.method === "GET") {
    const { compact } = req.query;
    let players;
    if (compact === "true") {
      // Compact: only name, points, lastPlayed, email, _id
      players = await Player.find({}, "name stats.points stats.lastPlayed email _id");
    } else {
      // Full record (for admin details)
      players = await Player.find({});
    }
    return res.status(200).json(players);
  }

  // --- Delete Player by Email ---
  if (req.method === "DELETE") {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    await Player.deleteOne({ email });
    return res.status(200).json({ ok: true });
  }

  // --- Unsupported method ---
  res.status(405).json({ error: "Method not allowed" });
}
