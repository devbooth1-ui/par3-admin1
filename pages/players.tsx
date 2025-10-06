import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';

// Player type
interface Player {
  _id: string;
  playerEmail: string;
  playerName?: string;
  playerPhone?: string;
  handicap?: string;
  awards?: string[];
  coursesPlayed?: string[];
  points?: number;
  qualifiedForMillion?: boolean;
}

function PlayerCard({ player, onDelete }: { player: Player, onDelete: (_id: string) => void }) {
  const [showDetails, setShowDetails] = useState(false);
  const lastCourse = player.coursesPlayed?.[player.coursesPlayed.length - 1] || 'N/A';
  const lastAward = player.awards?.[player.awards.length - 1] || 'N/A';
  const qualified = player.qualifiedForMillion ? 'Yes' : 'No';

  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      <div>
        <strong>Email:</strong> {player.playerEmail}
      </div>
      <div>
        <strong>Last Course:</strong> {lastCourse}
      </div>
      <div>
        <strong>Last Result:</strong> {lastAward}
      </div>
      <div>
        <strong>Current Points:</strong> {player.points}
      </div>
      <div>
        <strong>Qualified for Tournament:</strong> <span className="text-green-600 font-bold">{qualified}</span>
      </div>
      <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? 'Hide Details' : 'View More'}
      </button>
      <button className="mt-2 bg-red-500 text-white px-4 py-2 rounded ml-2" onClick={() => onDelete(player._id)}>
        Delete
      </button>
      {showDetails && (
        <div className="mt-2">
          <div><strong>Name:</strong> {player.playerName}</div>
          <div><strong>Phone:</strong> {player.playerPhone}</div>
          <div><strong>Handicap:</strong> {player.handicap}</div>
          <div><strong>Awards:</strong> {player.awards?.join(', ')}</div>
          <div><strong>Courses Played:</strong> {player.coursesPlayed?.join(', ')}</div>
        </div>
      )}
    </div>
  );
}

export default function Players() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/players')
      .then(res => res.json())
      .then(data => {
        setPlayers(data.players || []);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (_id: string) => {
    if (!window.confirm('Delete this player?')) return;
    const res = await fetch('/api/players', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id }),
    });
    if (res.ok) {
      setPlayers(players => players.filter(p => p._id !== _id));
    } else {
      alert('Failed to delete player');
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold mb-4">Players</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          players.length === 0 ? (
            <p className="mb-6 text-gray-600">No players found.</p>
          ) : (
            players.map(player => <PlayerCard key={player._id} player={player} onDelete={handleDelete} />)
          )
        )}
      </div>
    </AdminLayout>
  );
}
