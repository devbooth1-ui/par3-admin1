import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";

type PlayerStats = {
  lastRound?: string;
  totalRounds?: number;
  bestScore?: number;
  totalPoints?: number;
  lastReward?: string;
  lastDate?: string;
  holeInOneQualified?: boolean;
  tournamentQualified?: boolean;
  tournamentRegistered?: boolean;
};

type Player = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  stats?: PlayerStats;
};

export default function Players() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/players")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(err => {
        setError("Could not load players");
        setLoading(false);
      });
  }, []);

  async function sendTournamentEmail(player: Player) {
    setSendingEmail(player.email);
    const points = player.stats?.totalPoints ?? 0;
    const tournamentLink = `https://par3-admin1.vercel.app/tournament-details?player=${player._id}`;
    const nearestCourseLink = `https://par3-admin1.vercel.app/courses?player=${player._id}`;

    const html = `
      <h2>Hi ${player.name},</h2>
      <p>Your current points: <strong>${points}</strong></p>
      <p>Let's play toward the <strong>$1 Million Dollar Shootout!</strong></p>
      <p>
        <a href="${tournamentLink}" style="background:#048e27;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">Access Tournament Details</a>
      </p>
      <p>
        <a href="${nearestCourseLink}" style="background:#0d6efd;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">Click here for your nearest course</a>
      </p>
      <br>
      <p>Keep playing and earning points. Good luck!</p>
    `;

    const text = `
      Hi ${player.name},

      Your current points: ${points}

      Let's play toward the $1 Million Dollar Shootout!

      Access Tournament Details: ${tournamentLink}
      Click here for your nearest course: ${nearestCourseLink}

      Keep playing and earning points. Good luck!
    `;

    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: player.email,
          subject: "Your Tournament Invite & Nearest Course!",
          text,
          html
        })
      });
      alert(`Tournament invite sent to ${player.name} (${player.email})`);
    } catch (err) {
      alert("Error sending email.");
    }
    setSendingEmail(null);
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold mb-4">Players</h1>
        <p className="mb-6 text-gray-600">
          This player list is live from your backend. Email tournament invites with the button below!
        </p>
        {loading && <div>Loading players...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {players.length === 0 && !loading && <div>No players found.</div>}
        {players.map(player => (
          <div key={player._id} className="bg-white rounded shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">{player.name}</h2>
            <p>Email: {player.email}</p>
            <p>Phone: {player.phone || "N/A"}</p>
            <p>Current Points: {player.stats?.totalPoints ?? 0}</p>
            <p>
              Qualified for Tournament:{" "}
              <span className={player.stats?.tournamentQualified ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                {player.stats?.tournamentQualified ? "Yes" : "No"}
              </span>
            </p>
            <p>Last Round: {player.stats?.lastRound ?? "N/A"}</p>
            <p>Best Score: {player.stats?.bestScore ?? "N/A"}</p>
            <p>Last Reward: {player.stats?.lastReward ?? "N/A"}</p>
            <p>Last Date: {player.stats?.lastDate ?? "N/A"}</p>
            <p>Hole-in-One Qualified: {player.stats?.holeInOneQualified ? "Yes" : "No"}</p>
            <p>Tournament Registered: {player.stats?.tournamentRegistered ? "Yes" : "No"}</p>
            <button
              className={`mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold transition-all shadow ${sendingEmail === player.email ? "opacity-60 cursor-not-allowed" : ""}`}
              disabled={sendingEmail === player.email}
              onClick={() => sendTournamentEmail(player)}
            >
              {sendingEmail === player.email ? "Sending..." : "Send Tournament Invite"}
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
