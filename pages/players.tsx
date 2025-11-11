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
    fetchPlayers();
  }, []);

  function fetchPlayers() {
    const url = `${window.location.origin}/api/players`;
    fetch(url)
      .then((r) => r.json())
      .then((json) => {
        const list = Array.isArray(json) ? json : (json.players || []);
        setPlayers(list);
      })
      .catch(() => setPlayers([]))
      .finally(() => setLoading(false));
  }

  async function handleDelete(player: Player) {
    const body = player._id ? { _id: player._id } : { playerEmail: player.playerEmail };
    await fetch(`/api/players`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    fetchPlayers();
  }

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
                <button
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => handleDelete(p)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
