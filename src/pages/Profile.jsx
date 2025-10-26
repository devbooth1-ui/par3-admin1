import React from 'react';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Player Profile</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold">Player Name</h2>
            <p className="text-gray-600">Level 1 Player</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total Challenges:</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between">
              <span>Best Score:</span>
              <span className="font-semibold">-</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
