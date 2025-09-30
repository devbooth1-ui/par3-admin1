import type { NextApiRequest, NextApiResponse } from "next";
import mongoose, { Model, Document } from "mongoose";

interface IPlayer extends Document {
  name: string;
  email: string;
  phone: string;
  stats: object;
}

const playerSchema = new mongoose.Schema<IPlayer>({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  stats: Object,
});

const Player: Model<IPlayer> =
  (mongoose.models.Player as Model<IPlayer>) || mongoose.model<IPlayer>("Player", playerSchema);

const connectMongo = async () => {
  if (mongoose.connection.readyState < 1) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // --- CORS headers ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Preflight request: respond with 200 and no body
    res.status(200).end();
    return;
  }

  await connectMongo();

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

  if (req.method === "GET") {
    // List all players for admin view
    const players = await Player.find({});
    return res.status(200).json(players);
  }

  res.status(405).json({ error: "Method not allowed" });
}
