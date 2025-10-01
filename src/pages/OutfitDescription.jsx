import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

async function sendClaim(claimData) {
  const response = await fetch("https://par3-admin1.vercel.app/api/claims", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(claimData)
  });
  return response.json();
}

export default function OutfitDescription() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [outfit, setOutfit] = useState("");
  const [teeDate, setTeeDate] = useState("");
  const [teeTime, setTeeTime] = useState("");

  useEffect(() => {
    console.log("Location state:", state);
    if (!state || !state.prize) {
      navigate("/howd-we-do", { replace: true });
    }
  }, [state, navigate]);

  if (!state || !state.prize) {
    return (
      <div style={{color: "red", padding: 40}}>
        <h2>Error: Missing claim info. Try again.</h2>
        <pre>{JSON.stringify(state, null, 2)}</pre>
        <p>Did you refresh, or use the browser Back button? Always use the claim buttons.</p>
      </div>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const combinedTeeTime = `${teeDate} ${teeTime}`;
    const claimData = {
      playerName: state.playerName || "",
      playerEmail: state.playerEmail || "",
      courseId: state.courseId || "",
      hole: state.hole || "",
      claimType: state.prize === "hio" ? "hole-in-one" : "birdie",
      points: state.points || 0,
      reward: state.reward || "",
      outfitDescription: outfit || "",
      teeTime: combinedTeeTime,
      teeDate: teeDate || "",
      submittedAt: new Date().toISOString(),
    };
    try {
      const result = await sendClaim(claimData);
      if (result.ok || result.id) {
        alert("✅ Claim submitted for verification!");
      } else {
        alert("❌ There was a problem: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      alert("❌ Network error: " + error.message);
    }
    navigate("/myscorecard", {
      state: { prize: state.prize, outfit, teeTime: combinedTeeTime },
    });
  };

  const isHoleInOne = state.prize === "hio";
  const prizeAmount = isHoleInOne
    ? "$1,000 CASH* + Instant Qualification for the $1 Million Shoot Out"
    : "$65 Club Card + 200 Points";

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
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 via-emerald-800/30 to-lime-700/40"></div>
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 border border-emerald-200 mx-auto my-4 flex flex-col justify-between min-h-[80svh] overflow-y-auto">
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 mb-1">
            Congratulations {state.playerName}!
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
              value={outfit}
              onChange={(e) => setOutfit(e.target.value)}
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
          <div className="my-3 text-center text-xs sm:text-sm text-slate-700 font-medium">
            Awards subject to verification. Hole-in-Won confirmation status will be emailed within 24 hours. *Award will be paid back to the method of payment used.
          </div>
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
