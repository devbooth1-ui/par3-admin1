import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('points'); // points, claims, date

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://par3-admin1.vercel.app/api/players');
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }
      
      const data = await response.json();
      
      // Sort players by points (descending) by default
      const sortedPlayers = data.sort((a, b) => {
        if (sortBy === 'points') return b.points - a.points;
        if (sortBy === 'claims') return b.claims_count - a.claims_count;
        if (sortBy === 'date') return new Date(b.created_at) - new Date(a.created_at);
        return 0;
      });
      
      setPlayers(sortedPlayers);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    const sorted = [...players].sort((a, b) => {
      if (newSortBy === 'points') return b.points - a.points;
      if (newSortBy === 'claims') return b.claims_count - a.claims_count;
      if (newSortBy === 'date') return new Date(b.created_at) - new Date(a.created_at);
      return 0;
    });
    setPlayers(sorted);
  };

  const isQualifiedForTournament = (points) => points >= 800;

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-600">Loading Leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600 mb-4">⚠️ Error Loading Leaderboard</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchLeaderboardData}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #16a34a 50%, #0891b2 100%)'
      }}
    >
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="/par3logo.png" 
            alt="Par3 Challenge Logo" 
            className="w-48 h-auto mx-auto mb-4 drop-shadow-lg" 
          />
          <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
            🏆 Player Leaderboard
          </h1>
          <p className="text-lg text-lime-200 drop-shadow">
            Top players competing for the $1 Million Tournament
          </p>
        </div>

        {/* Sort Controls */}
        <div className="bg-white/90 rounded-xl p-4 mb-6 shadow-lg">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => handleSortChange('points')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                sortBy === 'points' 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🎯 By Points
            </button>
            <button
              onClick={() => handleSortChange('claims')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                sortBy === 'claims' 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🏅 By Wins
            </button>
            <button
              onClick={() => handleSortChange('date')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                sortBy === 'date' 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📅 Newest First
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white/95 rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4">
            <div className="grid grid-cols-12 gap-4 font-bold text-sm uppercase tracking-wide">
              <div className="col-span-1 text-center">Rank</div>
              <div className="col-span-4">Player</div>
              <div className="col-span-2 text-center">Points</div>
              <div className="col-span-2 text-center">Wins</div>
              <div className="col-span-3 text-center">Tournament Status</div>
            </div>
          </div>

          {/* Players List */}
          <div className="divide-y divide-gray-200">
            {players.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p className="text-lg mb-2">🏌️‍♂️ No players yet!</p>
                <p>Be the first to play and claim your spot on the leaderboard.</p>
              </div>
            ) : (
              players.map((player, index) => {
                const rank = index + 1;
                const isQualified = isQualifiedForTournament(player.points);
                
                return (
                  <div 
                    key={player.email} 
                    className={`grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors ${
                      rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
                    }`}
                  >
                    {/* Rank */}
                    <div className="col-span-1 text-center">
                      <span className="text-xl font-bold text-gray-800">
                        {getRankIcon(rank)}
                      </span>
                    </div>

                    {/* Player Name */}
                    <div className="col-span-4">
                      <div className="font-semibold text-gray-800 text-lg">
                        {player.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Joined {formatDate(player.created_at)}
                      </div>
                    </div>

                    {/* Points */}
                    <div className="col-span-2 text-center">
                      <div className="font-bold text-xl text-green-600">
                        {player.points.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>

                    {/* Claims/Wins */}
                    <div className="col-span-2 text-center">
                      <div className="font-bold text-xl text-blue-600">
                        {player.claims_count}
                      </div>
                      <div className="text-xs text-gray-500">
                        {player.claims_count === 1 ? 'win' : 'wins'}
                      </div>
                    </div>

                    {/* Tournament Status */}
                    <div className="col-span-3 text-center">
                      {isQualified ? (
                        <div className="flex flex-col items-center">
                          <div className="bg-green-100 text-green-800 font-bold py-1 px-3 rounded-full text-sm mb-1">
                            ✅ QUALIFIED
                          </div>
                          <div className="text-xs text-gray-500">
                            Ready for $1M Tournament
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="bg-gray-100 text-gray-600 font-semibold py-1 px-3 rounded-full text-sm mb-1">
                            {800 - player.points} pts needed
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 max-w-20 mx-auto">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${Math.min((player.points / 800) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Tournament Info */}
        <div className="bg-white/90 rounded-xl p-6 mt-8 shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            💰 $1 Million Tournament
          </h2>
          <p className="text-gray-600 mb-4">
            Earn 800 points to qualify for the Million Dollar Shootout in Orlando, Florida!
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-yellow-100 rounded-lg p-3">
              <div className="font-bold text-yellow-800">🏆 Hole-in-One</div>
              <div className="text-yellow-700">$1000 + 1000 pts</div>
            </div>
            <div className="bg-blue-100 rounded-lg p-3">
              <div className="font-bold text-blue-800">🎯 Birdie</div>
              <div className="text-blue-700">$65 Card + 200 pts</div>
            </div>
            <div className="bg-green-100 rounded-lg p-3">
              <div className="font-bold text-green-800">⛳ Par</div>
              <div className="text-green-700">50 points</div>
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="font-bold text-gray-800">🥲 Bogey</div>
              <div className="text-gray-700">50 points</div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105"
          >
            🏠 Back to Home
          </button>
          <button
            onClick={() => navigate('/play')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105"
          >
            ⛳ Play Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
