import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";

type Player = {
  _id?: string;
  playerEmail?: string;
  playerName?: string;
  playerPhone?: string;
  coursesPlayed?: string[];
  awards?: string[];
  points?: number;
  qualifiedForMillion?: boolean;
};

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = `${window.location.origin}/api/players`;
    fetch(url)
      .then((r) => r.json())
      .then((json) => {
        const list = Array.isArray(json) ? json : (json.players || []);
        setPlayers(list);
      })
      .catch(() => setPlayers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold mb-4">Players</h1>
        {loading ? (
          <p>Loading...</p>
        ) : players.length === 0 ? (
          <p className="mb-6 text-gray-600">No players found.</p>
        ) : (
          <div className="grid gap-4">
            {players.map((p, i) => (
              <div key={p._id || p.playerEmail || i} className="bg-white rounded shadow p-4">
                <div><strong>Name:</strong> {p.playerName || "—"}</div>
                <div><strong>Email:</strong> {p.playerEmail || "—"}</div>
                <div><strong>Phone:</strong> {p.playerPhone || "—"}</div>
                <div><strong>Last Course:</strong> {p.coursesPlayed?.[p.coursesPlayed.length - 1] || "—"}</div>
                <div><strong>Points:</strong> {typeof p.points === "number" ? p.points : 0}</div>
                <div><strong>Million Qual:</strong> {p.qualifiedForMillion ? "Yes" : "No"}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
