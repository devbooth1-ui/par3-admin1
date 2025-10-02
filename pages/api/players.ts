import type { NextApiRequest, NextApiResponse } from "next";
import mongoose, { Model, Document } from "mongoose";

interface IPlayer extends Document {
  name: string;
  email: string;
  phone: string;
  stats: {
    points?: number;
    lastPlayed?: string;
    bestScore?: number;
    qualified?: boolean;
    lastReward?: string;
    lastDate?: string;
    holeInOneQualified?: boolean;
    tournamentRegistered?: boolean;
  };
}

const playerSchema = new mongoose.Schema<IPlayer>(
  {
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
    }
  },
  { minimize: true }
);

const Player: Model<IPlayer> =
  (mongoose.models.Player as Model<IPlayer>) || mongoose.model<IPlayer>("Player", playerSchema);

const connectMongo = async (): Promise<void> => {
  if (mongoose.connection.readyState < 1) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  await connectMongo();

  // Upsert player info
  if (req.method === "POST") {
    const { name, email, phone, stats } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email required" });
      return;
    }
    const player = await Player.findOneAndUpdate(
      { email },
      { name, phone, stats },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(200).json(player);
    return;
  }

  // Compact GET: only basic info
  if (req.method === "GET") {
    const { compact, email } = req.query;

    if (email) {
      // GET specific player by email, return all info
      const player = await Player.findOne({ email });
      res.status(200).json(player);
      return;
    }

    let players;
    if (compact === "true") {
      players = await Player.find({}, "name email stats.points stats.lastPlayed");
    } else {
      players = await Player.find({});
    }
    res.status(200).json(players);
    return;
  }

  // Delete by email
  if (req.method === "DELETE") {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email required" });
      return;
    }
    await Player.deleteOne({ email });
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
