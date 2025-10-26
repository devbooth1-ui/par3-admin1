import React from 'react';

const Leaderboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Leaderboard</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-semibold">Rank</span>
              <span className="font-semibold">Player</span>
              <span className="font-semibold">Score</span>
            </div>
            {/* Add leaderboard entries here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
