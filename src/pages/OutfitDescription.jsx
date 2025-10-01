import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { adminAPI } from "../utils/adminAPI";

export default function OutfitDescription() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Defensive fallback if routed incorrectly
  if (!state || !state.playerName || !state.prize) {
    return (
      <div className="p-6 text-center text-red-700">
        <h2>Verification Error</h2>
        <p>Missing claim info. Please return to the main page and try again.</p>
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </div>
    );
  }

  const [outfitDescription, setOutfitDescription] = useState("");
  const [teeDate, setTeeDate] = useState("");
  const [teeTime, setTeeTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    // Compose claim data
    const claimData = {
      claimType: state.prize === "hio" ? "hole_in_one" : "birdie",
      playerName: state.playerName,
      playerEmail: state.playerEmail || "",
      playerPhone: state.playerPhone || "",
      outfitDescription,
      teeDate,
      teeTime,
      reward: state.reward,
      points: state.points,
      firstName: state.firstName,
      lastName: state.lastName,
      paymentMethod: state.paymentMethod,
    };

    try {
      let result;
      if (claimData.claimType === "hole_in_one") {
        result = await adminAPI.submitHoleInOneClaim(claimData, claimData.paymentMethod);
      } else {
        result = await adminAPI.submitBirdieClaim(claimData);
      }
      if (result && result.ok) {
        navigate("/myscorecard", { state: { prize: claimData.claimType, outfitDescription, teeDate, teeTime } });
      } else {
        setError("Failed to submit claim: " + (result?.error || "Unknown error"));
      }
    } catch (err) {
      setError("Submission error: " + err.message);
    }
    setSubmitting(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-4"
      style={{
        backgroundImage: "url('/golf-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 border border-emerald-200 mx-auto my-4 flex flex-col justify-between min-h-[70svh] overflow-y-auto">
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 mb-1">
            Congratulations {state.playerName}!
          </h1>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-700 mb-1">
            {state.prize === "hio" ? "on your Hole-in-One!" : "on your Birdie!"}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mb-2">
            You've claimed: <span className="font-bold text-emerald-700">{state.reward}</span>
          </p>
          <p className="text-xs sm:text-sm text-slate-600">
            Let's get some details for recognition and verification.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1 justify-between">
          <div className="space-y-1">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700">
              Outfit Description for Verification
            </label>
            <textarea
              className="w-full border-2 border-emerald-200 rounded-lg p-2 sm:p-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-[16px]"
              rows={3}
              value={outfitDescription}
              onChange={(e) => setOutfitDescription(e.target.value)}
              placeholder="Describe what you were wearing (e.g., blue cap, red polo, white pants)"
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
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full mt-2 px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg text-base sm:text-lg"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit for Verification"}
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
