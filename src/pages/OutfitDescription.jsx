import React, { useEffect, useState } from "react";
import ConfettiEffect from "../components/ConfettiEffect";
import { useLocation, useNavigate } from "react-router-dom";
import { adminAPI } from "../utils/adminAPI";

export default function OutfitDescription() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [outfitDescription, setOutfitDescription] = useState("");
  const [teeDate, setTeeDate] = useState("");
  const [teeTime, setTeeTime] = useState("");
  const [error, setError] = useState("");

  const playerName = (state && state.playerName) || localStorage.getItem("playerName") || "";
  const playerEmail = (state && state.playerEmail) || localStorage.getItem("playerEmail") || "";
  const playerPhone = (state && state.playerPhone) || localStorage.getItem("playerPhone") || "";
  const claimType = (state && state.prize === "hio") ? "hole-in-one" : "birdie";
  const courseName = localStorage.getItem("playerCourseName") || "";

  useEffect(() => {
    if (!state || !state.prize) navigate("/howd-we-do", { replace: true });
  }, [state, navigate]);

  if (!state || !state.prize) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !claimType.trim() ||
      !playerName.trim() ||
      !playerEmail.trim() ||
      !teeDate.trim() ||
      !teeTime.trim()
    ) {
      setError("All required fields must be filled: claimType, playerName, playerEmail, teeDate, teeTime.");
      return;
    }

    // Prepare player data for adminAPI
    const playerData = {
      firstName: playerName.split(" ")[0] || "",
      lastName: playerName.split(" ").slice(1).join(" ") || "",
      email: playerEmail,
      phone: playerPhone
    };

    const teeTimeFormatted = `${teeDate} ${teeTime}`;

    console.log("Submitting claim via adminAPI:", { playerData, claimType, outfitDescription, teeTimeFormatted });

    try {
      let result;
      
      if (claimType === "birdie") {
        result = await adminAPI.submitBirdieClaim(playerData, outfitDescription, teeTimeFormatted);
      } else if (claimType === "hole-in-one") {
        result = await adminAPI.submitHoleInOneClaim(playerData, 'card', outfitDescription, teeTimeFormatted);
      }

      console.log("Claim submission result:", result);

      // Update local stats
      let stats = JSON.parse(localStorage.getItem("playerStats") || "{}");
      if (claimType === "birdie") {
        stats.totalPoints = (stats.totalPoints || 0) + 200;
        stats.lastReward = "Birdie";
      } else if (claimType === "hole-in-one") {
        stats.totalPoints = (stats.totalPoints || 0) + 1000;
        stats.lastReward = "Hole-in-One";
        stats.tournamentQualified = true;
      }
      stats.lastDate = new Date().toLocaleDateString();
      stats.totalRounds = (stats.totalRounds || 0) + 1;
      localStorage.setItem("playerStats", JSON.stringify(stats));

      // Sync stats to backend
      try {
        await adminAPI.syncPlayerStats(playerData, stats);
        console.log("Stats synced to backend successfully");
      } catch (error) {
        console.error("Failed to sync stats to backend:", error);
      }

      if (result && result.error) {
        alert(`Claim submitted but may need review: ${result.error}`);
      } else {
        alert("Your claim has been submitted successfully! You will receive an email confirmation and further instructions from our team.");
      }

      navigate("/myscorecard", {
        state: { prize: state.prize, outfitDescription, teeDate, teeTime },
      });
    } catch (error) {
      console.error("Claim submission failed:", error);
      setError("Claim submission failed. Please contact support.");
    }
  };

  const isHoleInOne = state.prize === "hio";
  const prizeAmount = isHoleInOne ? "$1,000 CASH* + Instant Qualification for the $1 Million Shoot Out" : "$65 Club Card + 200 Points";

  return (
    <div
      className="min-h-screen flex flex-col justify-between p-0 sm:p-4 overflow-hidden"
      style={{
        minHeight: '100dvh',
        backgroundImage: 'url(/golf-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {(state.prize === "hio" || state.prize === "birdie") && <ConfettiEffect duration={3000} />}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 via-emerald-800/30 to-lime-700/40"></div>
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 border border-emerald-200 mx-auto my-4 flex flex-col justify-between min-h-[80svh] overflow-y-auto">
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 mb-1">
            Congratulations {playerName.split(" ")[0] || "Player"}!
          </h1>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-700 mb-1">
            {isHoleInOne ? "on your Hole-in-One!" : "on your Birdie!"}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mb-2">
            You've claimed: <span className="font-bold text-emerald-700">{prizeAmount}</span>
          </p>
          <p className="text-xs sm:text-sm text-slate-600">
            Let's get some details for recognition and verification.
          </p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-3 flex-1 justify-between">
          <div className="space-y-1">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700">
              Outfit Description for Verification
            </label>
            <textarea
              className="w-full border-2 border-emerald-200 rounded-lg p-2 sm:p-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-[16px]"
              rows={3}
              value={outfitDescription}
              onChange={(e) => setOutfitDescription(e.target.value)}
              placeholder="Please describe what you were wearing (e.g., blue cap, red polo, white pants)"
              required
              style={{ fontSize: 16 }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                Date of Achievement
              </label>
              <input
                type="date"
                className="w-full border-2 border-emerald-200 rounded-lg p-2 sm:p-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-[16px]"
                value={teeDate}
                onChange={(e) => setTeeDate(e.target.value)}
                required
                style={{ fontSize: 16 }}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                Approximate Tee Time
              </label>
              <input
                type="time"
                className="w-full border-2 border-emerald-200 rounded-lg p-2 sm:p-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-[16px]"
                value={teeTime}
                onChange={(e) => setTeeTime(e.target.value)}
                required
                style={{ fontSize: 16 }}
              />
            </div>
          </div>
          <input type="hidden" name="courseName" value={courseName} />
          <div className="my-3 text-center text-xs sm:text-sm text-slate-700 font-medium">
            Awards subject to verification. Hole-in-Won confirmation status will be emailed within 24 hours. *Award will be paid back to the method of payment used.
          </div>
          {error && <div className="text-red-600 text-xs text-center mb-2">{error}</div>}
          <button
            type="submit"
            className="w-full mt-2 px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg text-base sm:text-lg"
          >
            Submit for Verification
          </button>
        </form>
        <div className="mt-3 text-center pb-2">
          <p className="text-xs text-slate-500">
            🔒 Your information is secure and used only for prize verification
          </p>
        </div>
      </div>
    </div>
  );
}
