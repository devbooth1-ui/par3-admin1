import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Tournament() {
  const videoRef = React.useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Get player stats from localStorage for personalization
  const playerName = localStorage.getItem("playerName") || "Player";
  const firstName = playerName.split(" ")[0];
  const savedStats = JSON.parse(localStorage.getItem("playerStats") || "{}");
  const currentPoints = savedStats.totalPoints || 50; // Default to 50 to match PlayGame page
  const needed = Math.max(0, 800 - currentPoints);

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex flex-col items-center px-2 sm:px-4 py-4 overflow-hidden"
      style={{ backgroundImage: "url('/golf-7600958_640 (4).jpg')" }}
    >
      {/* Hero Video Section */}
      <div className="mb-4 w-full max-w-2xl mx-auto">
        <div className="relative rounded-xl overflow-hidden shadow-2xl w-full">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            disablePictureInPicture
            tabIndex={-1}
            draggable={false}
            onContextMenu={e => e.preventDefault()}
            className="w-full object-cover"
            style={{ height: 'auto', maxHeight: '220px', minHeight: '120px', background: '#000' }}
            onLoadedData={() => {
              if (videoRef.current) {
                videoRef.current.play().catch(console.log);
              }
            }}
          >
            <source src="/driver-nosound-mp4.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 flex items-end justify-center pb-4 sm:pb-6 pointer-events-none">
            <div className="text-center w-full">
              <div className="text-lime-300 font-bold text-sm sm:text-lg drop-shadow">
                🏆 March 16, 2026 • Orlando, FL 🌴
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl w-full mb-3">
        <div className="bg-white bg-opacity-90 rounded-xl shadow-xl py-3 px-3 sm:py-4 sm:px-6 text-center">
          <span className="text-base sm:text-xl font-bold text-green-800">Daily play information about awards</span>
        </div>
      </div>
      <div className="rounded-xl shadow-xl p-3 sm:p-8 max-w-2xl w-full"
        style={{ background: 'linear-gradient(135deg, #e0fff4 0%, #c6f7e2 100%)' }}>
        <div className="text-center mb-6 sm:mb-8">
          <div className="mb-2 sm:mb-4">
            <div className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 mb-2">
              The Orlando $1 Million Tournament
            </div>
            <h1 className="text-2xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-lime-600 to-yellow-600 mb-1 sm:mb-2">
              Tournament Details
            </h1>
            <div className="text-3xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 mb-2 sm:mb-4 animate-pulse">
              Start the Challenge! 🔥
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-100 to-lime-100 border-4 border-emerald-500 rounded-lg p-2 sm:p-4 mb-4 sm:mb-6">
            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <span className="text-lg sm:text-2xl">📅</span>
              <span className="text-base sm:text-lg font-bold text-emerald-800">March 16, 2026</span>
              <span className="text-lg sm:text-2xl">🌴</span>
              <span className="text-base sm:text-lg font-bold text-emerald-800">Orlando, FL</span>
            </div>
            <p className="text-emerald-700 font-semibold text-xs sm:text-lg">
              The ULTIMATE Par-3 Championship Experience!
            </p>
            <p className="text-emerald-600 text-xs sm:text-sm mt-1">
              Where dreams can become reality and champions are made! ⚡
            </p>
          </div>
        </div>

        {/* Personal Status */}
        <div className="bg-slate-50 rounded-lg p-3 sm:p-6 mb-2 sm:mb-4">
          <div className="flex justify-center mb-4">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-6 rounded-full shadow transition text-base sm:text-lg"
              style={{ fontFamily: 'Courier New, Courier, monospace' }}
              onClick={() => navigate('/play')}
            >
              Return to Game
            </button>
          </div>
          {/* More indicator */}
          <div className="flex flex-col items-center mb-2">
            <span className="text-green-700 font-semibold text-base sm:text-lg">More</span>
            <span className="animate-bounce text-green-700 text-3xl sm:text-4xl">&#8595;</span>
          </div>
          <h2 className="text-base sm:text-xl font-bold text-slate-800 mb-2 sm:mb-4">Your Status, {firstName}</h2>
          <div className="flex justify-between items-center mb-2 sm:mb-4">
            <span className="text-slate-600 font-semibold text-xs sm:text-base">Current Points:</span>
            <span className="text-lg sm:text-2xl font-bold text-emerald-700">{currentPoints}</span>
          </div>
          <div className="flex justify-between items-center mb-2 sm:mb-4">
            <span className="text-slate-600 font-semibold text-xs sm:text-base">Points Needed:</span>
            <span className="text-base sm:text-xl font-bold text-slate-800">{needed}</span>
          </div>
          {savedStats.holeInOneQualified ? (
            <div className="bg-green-100 border border-green-400 rounded-lg p-2 sm:p-4">
              <p className="text-green-800 font-bold text-center text-xs sm:text-base">
                🏆 QUALIFIED via Hole-in-One! See you in Orlando!
              </p>
            </div>
          ) : currentPoints >= 800 ? (
            <div className="bg-green-100 border border-green-400 rounded-lg p-2 sm:p-4">
              <p className="text-green-800 font-bold text-center text-xs sm:text-base">
                🎉 QUALIFIED! You've earned your spot in Orlando!
              </p>
            </div>
          ) : (
            <div className="bg-blue-100 border border-blue-400 rounded-lg p-2 sm:p-4">
              <p className="text-blue-800 font-semibold text-center text-xs sm:text-base">
                Keep playing! You're {needed} points away from qualification.
              </p>
            </div>
          )}
        </div>
        {/* Tournament Details */}
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">How to Qualify</h3>
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 rounded-lg p-4 mb-4">
              <p className="font-semibold text-slate-700 mb-2">Option 1: Point Accumulation</p>
              <p className="text-slate-600">Earn 800 points through consistent play</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-lg p-4">
              <p className="font-semibold text-slate-700 mb-2">Option 2: Hole-in-One</p>
              <p className="text-slate-600">Instant qualification with any hole-in-one!</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">💰 MASSIVE Prize Structure 💰</h3>
            <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 border-4 border-yellow-400 rounded-lg p-6 mb-4">
              <div className="text-center mb-4">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600">
                  $1,000,000
                </div>
                <div className="text-lg font-bold text-slate-800">GRAND PRIZE!</div>
              </div>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border-l-4 border-yellow-500">
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">🏆</span>
                    <span className="font-bold">The Ace:</span>
                  </span>
                  <span className="font-black text-xl text-orange-700">$1,000,000</span>
                </li>
              </ul>
              <div className="text-xs text-slate-500 mt-4">$1 million paid out to a registered golfer(s) who makes a hole in one from official teeing area under tournament guidelines.</div>
            </div>

            {/* Additional Competitions */}
            <div className="bg-gradient-to-r from-emerald-50 to-lime-50 border-l-4 border-emerald-400 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">⛳</span>
                <h4 className="font-bold text-emerald-800 text-lg">BONUS SKILL CHALLENGES</h4>
              </div>
              <div className="space-y-2 text-emerald-700">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  <span className="font-semibold">Putting Challenge</span>
                  <span className="text-emerald-600 italic">- Cash prizes & glory!</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚡</span>
                  <span className="font-semibold">Chipping Challenge</span>
                  <span className="text-emerald-600 italic">- Show your short game skills!</span>
                </div>
                <p className="text-sm text-emerald-600 mt-2 italic">
                  Details and prize amounts will be announced - ready for the challenge! 🔥
                </p>
              </div>
            </div>
          </div>

          {/* Prize Distribution */}
          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4 mt-6">
            <div className="flex items-start gap-2">
              <span className="text-xl text-blue-600 mt-1">*</span>
              <div>
                <h4 className="font-bold text-blue-800 mb-2">Prize Distribution</h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">*</span>
                    <div>
                      <p className="font-semibold">$1,000 Cash Prize:</p>
                      <p>Will be awarded back to the payment method you used to enter</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">🐦</span>
                    <div>
                      <p className="font-semibold">Birdie Awards ($65 ClubCard™ + 200 qualifying points):</p>
                      <p>Will be pushed through the Pro Shop or Par3 app using ClubCard™</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Notice */}
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4 mt-6">
            <div className="flex items-start gap-2">
              <span className="text-xl text-amber-600 mt-1">⚠️</span>
              <div>
                <h4 className="font-bold text-amber-800 mb-1">Important Notice</h4>
                <p className="text-amber-700 text-sm">
                  All prizes claimed are subject to verification. Winners must provide proof of qualifying scores and may be required to demonstrate their abilities during verification rounds.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/play")}
            className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all transform hover:scale-105"
          >
            Continue Playing
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}