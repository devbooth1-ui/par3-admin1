import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReturningPlayer() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");
  const [email, setEmail] = useState("");
  const [recognized, setRecognized] = useState(false);
  const [playerStats, setPlayerStats] = useState({});
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("playerName");
    const savedStats = JSON.parse(localStorage.getItem("playerStats") || "{}");

    if (savedName) {
      setPlayerName(savedName);
      setPlayerStats(savedStats);
      setRecognized(true);
      setShowWelcomeAnimation(true);

      // Hide animation after 3 seconds
      setTimeout(() => {
        setShowWelcomeAnimation(false);
      }, 3000);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("playerName", playerName);
    localStorage.setItem("playerEmail", email);

    // Initialize empty stats for new returning player
    const initialStats = {
      totalRounds: 0,
      totalPoints: 0,
      bestScore: null,
      lastRound: null,
      lastReward: null,
      lastDate: null,
      tournamentQualified: false,
      tournamentRegistered: false
    };

    localStorage.setItem("playerStats", JSON.stringify(initialStats));
    setPlayerStats(initialStats);
    setRecognized(true);
    setShowWelcomeAnimation(true);

    // Hide animation after 3 seconds
    setTimeout(() => {
      setShowWelcomeAnimation(false);
    }, 3000);
  };

  // Calculate tournament progress
  const getProgressToTournament = () => {
    const totalPoints = playerStats.totalPoints || 0;
    const percentage = Math.min((totalPoints / 800) * 100, 100);
    return { totalPoints, percentage, pointsNeeded: Math.max(800 - totalPoints, 0) };
  };

  const getScoreName = (score) => {
    switch (score) {
      case 1: return "Hole-in-One";
      case 2: return "Birdie";
      case 3: return "Par";
      case 4: return "Bogey";
      default: return "N/A";
    }
  };

  if (recognized) {
    const firstName = playerName.split(" ")[0];
    const progress = getProgressToTournament();

    return (
      <div
        className="min-h-screen py-8 px-4 overflow-hidden"
        style={{
          backgroundImage: 'url(/ballonlip.jpg)',
          backgroundSize: '60vw', // More zoomed out
          backgroundPosition: '-10vw top', // Shift left
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Premium overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/60 via-emerald-800/40 to-lime-700/50"></div>

        {/* Welcome Animation Overlay */}
        {showWelcomeAnimation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
            <div className="text-center">
              <div className="text-8xl mb-6 animate-bounce">🏌️‍♂️</div>
              <div className="text-4xl font-bold text-white mb-4 animate-pulse">
                Welcome Back!
              </div>
              <div className="text-2xl text-yellow-300 font-semibold">
                {firstName}
              </div>
              <div className="text-lg text-emerald-300 mt-4">
                Ready for another round?
              </div>
            </div>
          </div>
        )}

        <div className="relative z-10 max-w-6xl mx-auto -ml-12 sm:-ml-24 md:-ml-32 lg:-ml-40">
          {/* Logo at the top */}
          <div className="flex justify-center mb-1">
            <img src="/par3logo.png" alt="Par 3 Challenge Logo" className="w-44 sm:w-56 md:w-64 h-auto drop-shadow-2xl" />
          </div>
          {/* Header */}
          <div className="text-center mb-8 -mt-10">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-emerald-200">
              <div className="text-5xl mb-4">⛳</div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 mb-2">
                Welcome Back, {firstName}!
              </h1>
              <p className="text-gray-600 text-lg">
                Ready to improve your game and chase that $1M Tournament?
              </p>
            </div>
          </div>

          {/* Horizontal Scorecard */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-emerald-200 mb-8">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              📊 Your Golf Scorecard
            </h2>

            {/* Stats Grid - Horizontal Layout */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
              <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-2xl font-bold text-blue-800">
                  {playerStats.totalRounds || 0}
                </div>
                <div className="text-sm text-blue-600 font-medium">Rounds Played</div>
              </div>

              <div className="text-center bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-2xl font-bold text-green-800">
                  {playerStats.bestScore ? getScoreName(playerStats.bestScore) : "None"}
                </div>
                <div className="text-sm text-green-600 font-medium">Best Score</div>
              </div>

              <div className="text-center bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-2xl font-bold text-yellow-800">
                  {playerStats.totalPoints || 0}
                </div>
                <div className="text-sm text-yellow-600 font-medium">Total Points</div>
              </div>

              <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                <div className="text-3xl mb-2">🎮</div>
                <div className="text-2xl font-bold text-purple-800">
                  {playerStats.lastRound || "None"}
                </div>
                <div className="text-sm text-purple-600 font-medium">Last Round</div>
              </div>

              <div className="text-center bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
                <div className="text-3xl mb-2">🎁</div>
                <div className="text-xl font-bold text-red-800">
                  {playerStats.lastReward ? "Yes" : "None"}
                </div>
                <div className="text-sm text-red-600 font-medium">Last Reward</div>
              </div>

              <div className="text-center bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
                <div className="text-3xl mb-2">📅</div>
                <div className="text-lg font-bold text-indigo-800">
                  {playerStats.lastDate || "Never"}
                </div>
                <div className="text-sm text-indigo-600 font-medium">Last Played</div>
              </div>
            </div>

            {/* Tournament Progress Bar */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800">$1M Tournament Progress</h3>
                <span className="text-sm font-semibold text-gray-600">
                  {progress.totalPoints} / 800 points
                </span>
              </div>

              <div className="w-full bg-gray-300 rounded-full h-4 mb-3">
                <div
                  className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 h-4 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>

              <div className="text-center">
                {playerStats.tournamentQualified ? (
                  <div className="text-green-600 font-bold text-lg">
                    🎉 QUALIFIED FOR $1M TOURNAMENT! 🎉
                  </div>
                ) : (
                  <div className="text-gray-600">
                    <span className="font-semibold">{progress.pointsNeeded} points</span> needed to qualify
                  </div>
                )}
              </div>
            </div>
            {/* More indicator: immediately after green box */}
            <div className="flex flex-col items-center mt-0 mb-2">
              <span className="text-green-700 font-semibold text-xs sm:text-sm leading-none">More</span>
              <span className="animate-bounce text-green-700 text-xl sm:text-2xl leading-none">&#8595;</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Play Again */}
            <button
              onClick={() => navigate("/play")}
              className="group bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-bold py-6 px-6 rounded-xl hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="text-4xl mb-2 group-hover:animate-bounce">🏌️‍♂️</div>
              <div className="text-xl font-black">PLAY AGAIN</div>
              <div className="text-sm opacity-90 mt-1">Take another shot at glory</div>
            </button>

            {/* Tournament Signup (if qualified) */}
            {playerStats.tournamentQualified && !playerStats.tournamentRegistered && (
              <button
                onClick={() => navigate("/tournament-signup")}
                className="group bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white font-bold py-6 px-6 rounded-xl hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="text-4xl mb-2 group-hover:animate-pulse">🏆</div>
                <div className="text-xl font-black">TOURNAMENT</div>
                <div className="text-sm opacity-90 mt-1">Register for $1M Prize</div>
              </button>
            )}

            {/* My Scorecard */}
            <button
              onClick={() => navigate("/myscorecard")}
              className="group bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-bold py-6 px-6 rounded-xl hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="text-4xl mb-2 group-hover:animate-spin">📊</div>
              <div className="text-xl font-black">MY STATS</div>
              <div className="text-sm opacity-90 mt-1">View detailed scorecard</div>
            </button>
          </div>

          {/* Recent Activity */}
          {playerStats.totalRounds > 0 && (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-emerald-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                🎯 Recent Activity
              </h3>

              <div className="bg-gradient-to-r from-emerald-50 to-lime-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl mb-1">🎮</div>
                    <div className="font-semibold text-emerald-800">Last Round</div>
                    <div className="text-emerald-600">{playerStats.lastRound || "N/A"}</div>
                  </div>

                  <div>
                    <div className="text-2xl mb-1">🎁</div>
                    <div className="font-semibold text-emerald-800">Last Reward</div>
                    <div className="text-emerald-600 text-sm">
                      {playerStats.lastReward || "None yet"}
                    </div>
                  </div>

                  <div>
                    <div className="text-2xl mb-1">📅</div>
                    <div className="font-semibold text-emerald-800">Last Played</div>
                    <div className="text-emerald-600">{playerStats.lastDate || "Never"}</div>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-lime-100 rounded-full">
                    <span className="text-xl">💪</span>
                    <span className="text-emerald-800 font-semibold text-sm">
                      Keep playing to reach 800 points!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If not recognized, show the enhanced login form
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 overflow-hidden"
      style={{
        backgroundImage: 'url(/ballonlip.jpg)',
        backgroundSize: '60vw', // More zoomed out
        backgroundPosition: '-10vw top', // Shift left
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Premium overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/60 via-emerald-800/40 to-lime-700/50"></div>

      <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full border border-emerald-200 -ml-8 sm:-ml-16 md:-ml-24 lg:-ml-32">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🏌️‍♂️</div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 mb-3">
            Welcome Back!
          </h1>
          <p className="text-gray-600 text-lg">
            Ready to continue your journey to the $1M Tournament?
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-lime-400 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Enhanced Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white/90 backdrop-blur-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white/90 backdrop-blur-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full group bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 text-white font-bold py-4 px-6 rounded-xl hover:from-emerald-600 hover:via-green-600 hover:to-lime-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-xl group-hover:animate-bounce">⛳</span>
              <span className="text-xl">TEE IT UP!</span>
              <span className="text-xl group-hover:animate-bounce">🏌️‍♂️</span>
            </div>
            <div className="text-sm opacity-90 mt-1">
              Continue your golf journey
            </div>
          </button>
        </form>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <div className="bg-gradient-to-r from-emerald-50 to-lime-50 rounded-lg p-4">
            <div className="text-sm text-emerald-700">
              <div className="font-semibold mb-2">🎯 Your Progress Awaits</div>
              <div className="text-xs">
                We'll restore your scorecard, points, and tournament progress
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}