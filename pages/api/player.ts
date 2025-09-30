import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

// --- Define your Player model ---
const playerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  stats: Object,
});

// Type assertion for the model!
const Player = (mongoose.models.Player as mongoose.Model<any>) || mongoose.model("Player", playerSchema);

const connectMongo = async () => {
  if (mongoose.connection.readyState < 1) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
