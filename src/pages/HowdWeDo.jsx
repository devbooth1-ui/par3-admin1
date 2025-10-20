import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { adminAPI } from "../utils/adminAPI";

export default function HowdWeDo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showVideoOrder, setShowVideoOrder] = useState(false);
  const [videoOrderData, setVideoOrderData] = useState(null);

  useEffect(() => {
    const videoOrderParam = searchParams.get('videoOrder');
    if (videoOrderParam === 'true') {
      const orderData = localStorage.getItem('videoOrder');
      if (orderData) {
        setVideoOrderData(JSON.parse(orderData));
        setShowVideoOrder(true);
      }
    }
  }, [searchParams]);

  let playerName = localStorage.getItem("playerName") || "Player";
  let playerEmail = localStorage.getItem("playerEmail") || "";
  let currentStats = {};
  let courseId = localStorage.getItem("courseId") || "";
  let hole = localStorage.getItem("hole") || "";

  try {
    currentStats = JSON.parse(localStorage.getItem("playerStats") || "{}") || {};
  } catch (e) {
    currentStats = {};
  }

  // Birdie/Hole-in-One handler: ONLY navigates to /verify, never submits claim here
  const handleBirdieOrHioClick = (scoreType, reward, points) => {
    navigate("/verify", {
      state: {
        prize: scoreType === "Hole-in-One" ? "hio" : "birdie",
        playerName,
        playerEmail,
        courseId,
        hole,
        points,
        reward,
      }
    });
  };

  // Par/Bogey: update stats and navigate (these don't need backend claims)
  const handleParOrShankClick = async (scoreType, reward, points) => {
    // Update local stats
    let stats = JSON.parse(localStorage.getItem("playerStats") || "{}");
    stats.totalPoints = (stats.totalPoints || 0) + points;
    stats.lastReward = scoreType;
    stats.lastDate = new Date().toLocaleDateString();
    stats.totalRounds = (stats.totalRounds || 0) + 1;
    
    if (scoreType === "Par" && (!stats.bestScore || stats.bestScore === "N/A" || stats.bestScore > 3)) {
      stats.bestScore = 3;
    } else if (scoreType === "Bogey" && (!stats.bestScore || stats.bestScore === "N/A" || stats.bestScore > 4)) {
      stats.bestScore = 4;
    }
    
    localStorage.setItem("playerStats", JSON.stringify(stats));
    
    // Sync stats to backend
    try {
      const playerData = {
        firstName: playerName.split(" ")[0] || "",
        lastName: playerName.split(" ").slice(1).join(" ") || "",
        email: playerEmail,
        phone: localStorage.getItem("playerPhone") || ""
      };
      await adminAPI.syncPlayerStats(playerData, stats);
      console.log("Stats synced to backend for", scoreType);
    } catch (error) {
      console.error("Failed to sync stats to backend:", error);
    }
    
    navigate("/myscorecard", { state: { prize: null, scoreType, points } });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden"
      style={{
        minHeight: '100dvh',
        backgroundImage: "url('/ballroll.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-white drop-shadow mb-2">How'd Ya Do?</h2>
      <p className="text-center text-white/90 mb-6 text-base sm:text-lg drop-shadow">
        <span className="font-bold text-white">Click On It...</span>
      </p>
      {showVideoOrder && videoOrderData && (
        <div className="w-full max-w-md mb-6 bg-purple-600/90 border-2 border-purple-400 rounded-xl p-4">
          {/* ... video order code unchanged ... */}
        </div>
      )}
      <div className="flex flex-col gap-2 w-full max-w-md">
        <button
          className="w-full py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all shadow text-base flex flex-col items-center"
          onClick={() => handleBirdieOrHioClick("Hole-in-One", "$1,000 CASH* + Instant Qualification for the $1 Million Tournament", 1000)}
        >
          🏆 HOLE-IN-WON!
          <div className="text-xs">$1,000 CASH*<br />Instant Qualification for the $1 Million Tournament</div>
        </button>
        <button
          onClick={() => handleBirdieOrHioClick("Birdie", "$65 Club Card + 200 Points + Towards $1Million Dollar Tournament", 200)}
          className="w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow text-base flex flex-col items-center"
        >
          🎯 BIRDIE (2 strokes)
          <div className="text-xs">$65 Club Card<br />200 Points<br />Towards $1Million Dollar Tournament</div>
        </button>
        <button
          onClick={() => handleParOrShankClick("Par", "50 Points + Towards $1Million Dollar Tournament", 50)}
          className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow text-base flex flex-col items-center"
        >
          ⛳ PAR (3 strokes)
          <div className="text-xs">50 Points<br />Towards $1Million Dollar Tournament</div>
        </button>
        <button
          onClick={() => handleParOrShankClick("Bogey", "50 Points + Towards $1Million Dollar Tournament", 50)}
          className="w-full py-2 bg-gradient-to-r from-gray-500 to-slate-600 text-white font-bold rounded-lg hover:from-gray-600 hover:to-slate-700 transition-all shadow text-base flex flex-col items-center"
        >
          🥲 SHANK'D IT!
          <div className="text-xs">50 Points<br />Towards $1Million Dollar Tournament</div>
        </button>
      </div>
      <div className="mt-20 text-center">
        <p className="text-lg sm:text-xl font-extrabold drop-shadow-lg tracking-wide text-red-600">
          ⛳ Building toward the $1M Tournament
        </p>
      </div>
    </div>
  );
}
