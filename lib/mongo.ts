import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please add your MongoDB Atlas URI to .env.local as MONGODB_URI");
}

export const connectMongo = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(MONGODB_URI);
};

const claimSchema = new mongoose.Schema({
  claimType: String,
  playerName: String,
  playerEmail: String,
  playerPhone: String,
  outfitDescription: String,
  teeTime: String,
  courseId: String,
  hole: mongoose.Schema.Types.Mixed,
  paymentMethod: String,
  status: { type: String, default: "pending" },
  submitted_at: { type: Date, default: Date.now },
  wallet_address: String,
  mediaUrl: String,
  clubId: String,
});

export const Claim = mongoose.models.Claim || mongoose.model("Claim", claimSchema);
