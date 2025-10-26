import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VideoRecordingNotice from "../components/VideoRecordingNotice";

export default function PlayGame() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get player info
  const fullName = location.state?.name || localStorage.getItem("playerName") || "Player";
  const firstName = fullName.split(" ")[0]?.charAt(0).toUpperCase() + fullName.split(" ")[0]?.slice(1).toLowerCase();

  // Get stats
  const savedStats = JSON.parse(localStorage.getItem("playerStats") || "{}");

  // Scorecard/progress
  const playerStats = {
    totalRounds: savedStats.totalRounds || 0,
    bestScore: savedStats.bestScore || "N/A",
    totalPoints: savedStats.totalPoints || 0,
    lastDate: savedStats.lastDate || "Never",
    lastReward: savedStats.lastReward || "None",
    tournamentQualified: savedStats.tournamentQualified || false,
  };

  const getProgressToTournament = () => {
    const totalPoints = playerStats.totalPoints;
    const percentage = Math.min((totalPoints / 800) * 100, 100);
    return { totalPoints, percentage, pointsNeeded: Math.max(800 - totalPoints, 0) };
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-2 sm:px-4 overflow-hidden"
      style={{
        backgroundImage: "url('/teeball.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
            {/* Video Recording Notice */}
      <VideoRecordingNotice 
        position="top-left" 
        autoHide={true} 
        variant="powerful"
      />
      {/* Logo, Welcome Back Banner, and Scorecard - vertical stack with centered banner */}
      <div className="flex flex-col items-center w-full max-w-md mb-2" style={{ position: 'relative' }}>
        <img src="/par3logo.png" alt="Par 3 Challenge Logo" className="w-56 sm:w-72 md:w-80 h-auto drop-shadow-2xl mb-0" style={{ marginTop: '-40px' }} />
        <div style={{ height: '0px' }} />
        <div className="bg-white bg-opacity-80 rounded-xl shadow-xl p-1 sm:p-2 w-full border flex items-center justify-center" style={{ minHeight: '48px', marginTop: '-24px' }}>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 mb-0 text-center drop-shadow-lg">
            Welcome Back, {firstName}!
          </h1>
        </div>
        <div style={{ height: '16px' }} />
      </div>
      {/* Scorecard & Progress */}
      <div className="bg-white bg-opacity-90 rounded-xl shadow-lg p-1 sm:p-2 w-full max-w-md mb-2">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 text-center">Your Scorecard</h2>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <div className="text-xs sm:text-sm text-gray-500">Rounds Played</div>
            <div className="text-sm sm:text-lg font-bold text-gray-800">{playerStats.totalRounds}</div>
          </div>
          <div>
            <div className="text-xs sm:text-sm text-gray-500">Best Score</div>
            <div className="text-sm sm:text-lg font-bold text-gray-800">{playerStats.bestScore}</div>
          </div>
          <div>
            <div className="text-xs sm:text-sm text-gray-500">Total Points</div>
            <div className="text-sm sm:text-lg font-bold text-gray-800">{playerStats.totalPoints}</div>
          </div>
          <div>
            <div className="text-xs sm:text-sm text-gray-500">Last Played</div>
            <div className="text-sm sm:text-lg font-bold text-gray-800">{playerStats.lastDate}</div>
          </div>
        </div>
        <div className="w-full mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-gray-700 text-xs sm:text-base">Progress to $1M Tournament</span>
            <span className="text-xs sm:text-sm font-semibold text-gray-700">
              {getProgressToTournament().totalPoints} / 800 pts
            </span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2 sm:h-3 mb-1">
            <div
              className="bg-blue-500 h-2 sm:h-3 rounded-full transition-all duration-1000"
              style={{ width: `${getProgressToTournament().percentage}%` }}
            ></div>
          </div>
          <div className="text-center text-xs sm:text-sm">
            {playerStats.tournamentQualified ? (
              <span className="text-green-700 font-bold">QUALIFIED!</span>
            ) : (
              <span className="text-gray-700">
                <strong>{getProgressToTournament().pointsNeeded} points</strong> to qualify
              </span>
            )}
          </div>
        </div>
        <div className="text-center text-xs sm:text-sm text-gray-600">
          Last Reward: <span className="font-semibold text-gray-800">{playerStats.lastReward}</span>
        </div>
      </div>
      {/* Awards Button */}
      <div className="flex flex-col items-center gap-1 mb-2 w-full max-w-xs">
        <button
          onClick={() => navigate("/awards")}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-4 rounded-full shadow transition w-full"
        >
          See Awards
        </button>
        <button
          onClick={() => navigate("/tournament")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-full shadow transition w-full"
        >
          Tournament Details & Updates
        </button>
        <button
          onClick={() => navigate("/payment")}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-4 rounded-full shadow transition w-full"
        >
          TEE IT UP!
        </button>
      </div>
    </div>
  );
}

