import React, { useEffect, useState } from "react";
import ConfettiEffect from "../components/ConfettiEffect";
import { useLocation, useNavigate } from "react-router-dom";
import { notifyCompany } from "../assets/utils/notificationService.js";

export default function OutfitDescription() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [outfit, setOutfit] = useState("");
  const [teeDate, setTeeDate] = useState("");
  const [teeTime, setTeeTime] = useState("");

  // Prefer playerName from navigation state, fallback to localStorage
  const playerName = (state && state.playerName) || localStorage.getItem("playerName") || "Player";
  const firstName = playerName.split(" ")[0];
  const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

  useEffect(() => {
    if (!state || !state.prize) navigate("/howd-we-do", { replace: true });
  }, [state, navigate]);

  if (!state || !state.prize) return null;

  const isHoleInOne = state.prize === "hio";
  const prizeLabel = isHoleInOne ? "Hole-in-One" : "Birdie";
  const prizeAmount = isHoleInOne ? "$1,000 CASH* + Instant Qualification for the $1 Million Shoot Out" : "$65 Club Card + 200 Points";

  const onSubmit = async (e) => {
    e.preventDefault();
    const combinedTeeTime = `${teeDate} ${teeTime}`;

    // Get player info
    const playerName = localStorage.getItem("playerName") || "Unknown Player";
    const playerEmail = localStorage.getItem("playerEmail") || "No email provided";

    // Prepare notification data
    const notificationData = {
      playerName,
      playerEmail,
      prizeType: prizeLabel,
      prizeAmount: prizeAmount,
      outfitDescription: outfit,
      teeDate,
      teeTime,
      timestamp: new Date().toLocaleString(),
      points: state.points || 0
    };

    try {
      // Send immediate notification to company
      const result = await notifyCompany(notificationData);
      if (result.success) {
        alert(`✅ Company notified immediately via ${result.method}! Prize processing will begin within 24 hours.`);
      } else {
        console.log("Notification logged for manual processing:", result.message);
        alert(`Prize claim submitted! Company will be notified immediately. ${result.message}`);
      }
      alert("Your submission is under review. You will receive an email when your hole has been reviewed by our team.");
    } catch (error) {
      console.error("Failed to send company notification:", error);
      alert("Prize claim submitted! Company notification logged - they will be contacted immediately.");
      alert("Your submission is under review. You will receive an email when your hole has been reviewed by our team.");
    }

    // Check tournament qualification after submitting
    const playerStats = JSON.parse(localStorage.getItem("playerStats") || "{}");
    const isQualified = playerStats.tournamentQualified || (playerStats.totalPoints >= 800);
    const isRegistered = playerStats.tournamentRegistered;

    if (isQualified && !isRegistered) {
      // Show tournament signup opportunity
      const wantsToRegister = window.confirm(
        `🏆 CONGRATULATIONS! 🏆\n\nYou now have ${playerStats.totalPoints} points and are QUALIFIED for the $1 MILLION TOURNAMENT!\n\nWould you like to register now?`
      );

      if (wantsToRegister) {
        navigate("/tournament-signup");
        return;
      }
    }

    navigate("/myscorecard", {
      state: { prize: state.prize, outfit, teeTime: combinedTeeTime },
    });
  };

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
      {/* Confetti for Birdie or Hole-in-Won */}
      {(state.prize === "hio" || state.prize === "birdie") && <ConfettiEffect duration={3000} />}

      {/* Premium overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 via-emerald-800/30 to-lime-700/40"></div>

      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 border border-emerald-200 mx-auto my-4 flex flex-col justify-between min-h-[80svh] overflow-y-auto">
        {/* Congratulations Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 mb-1">
            Congratulations {capitalizedFirstName}!
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

        {/* Verification Form */}
        <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4 flex-1">
          {/* Outfit Description */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-slate-700 mb-1 sm:mb-2">
              What were you wearing for this amazing shot?
            </label>
            <textarea
              className="w-full border-2 border-emerald-200 rounded-lg p-2 sm:p-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all resize-none text-[16px]"
              rows="3"
              value={outfit}
              onChange={(e) => setOutfit(e.target.value)}
              placeholder="Describe your outfit (e.g., blue polo, khaki pants, white golf shoes)"
              required
              style={{ fontSize: 16 }}
            />
          </div>
          {/* Tee Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm sm:text-base font-medium text-slate-700 mb-1 sm:mb-2">
                Date
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
            <div>
              <label className="block text-sm sm:text-base font-medium text-slate-700 mb-1 sm:mb-2">
                Tee Time
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
          {/* Verification info message */}
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

        {/* Video Order Section */}
        <div className="mt-4 bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-2 border-purple-400/50 rounded-xl p-4">
          <div className="text-center">
            <div className="text-2xl mb-2">🎥</div>
            <h3 className="text-lg font-bold text-purple-800 mb-2">
              ORDER YOUR VIDEO HERE!
            </h3>
            <p className="text-sm text-purple-700 mb-3">
              Capture this amazing {prizeLabel} moment forever! Professional video footage delivered via email.
            </p>
            <button
              onClick={() => navigate('/order-form')}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all transform hover:scale-105 text-sm"
            >
              🎥 Order Professional Video - $25.00
            </button>
            <p className="text-xs text-purple-600 mt-2">
              📧 Delivered within 24 hours via email
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 text-center pb-2">
          <p className="text-xs text-slate-500">
            🔒 Your information is secure and used only for prize verification
          </p>
        </div>
      </div>
    </div>
  );
}
