import React, { useEffect, useState } from "react";
import ConfettiEffect from "../components/ConfettiEffect";
import { useLocation, useNavigate } from "react-router-dom";
import { adminAPI } from "../utils/adminAPI.js";

// --- ADD THIS FUNCTION AT THE TOP ---
async function sendClaimEmail({ to, subject, text, html }) {
  const response = await fetch("https://par3-admin1.vercel.app/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, subject, text, html })
  });
  const result = await response.json();
  if (response.ok) {
    alert("Email sent! Preview URL: " + result.previewUrl);
  } else {
    alert("Email failed: " + (result.error || "Unknown error"));
  }
}

export default function OutfitDescription() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [outfit, setOutfit] = useState("");
  const [teeDate, setTeeDate] = useState("");
  const [teeTime, setTeeTime] = useState("");

  // Prefer playerName from navigation state, fallback to localStorage
  const playerName = (state && state.playerName) || localStorage.getItem("playerName") || "Player";
  const firstName = playerName.split(" ")[0];
  // Ensure proper capitalization for first name
  const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

  useEffect(() => {
    if (!state || !state.prize) navigate("/howd-we-do", { replace: true });
  }, [state, navigate]);

  if (!state || !state.prize) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    const combinedTeeTime = `${teeDate} ${teeTime}`;

    // Get player info
    const playerName = localStorage.getItem("playerName") || "Unknown Player";
    const playerEmail = localStorage.getItem("playerEmail") || "No email provided";
    const paymentMethod = localStorage.getItem("lastPaymentMethod") || "card";

    const nameparts = playerName.split(" ");
    const firstName = nameparts[0] || "Player";
    const lastName = nameparts.slice(1).join(" ") || "";

    const playerData = {
      firstName,
      lastName,
      email: playerEmail,
      phone: "", // You can add phone collection in your app later
    };

    try {
      // Submit claim to admin portal with outfit and tee time
      let claimResult;
      if (isHoleInOne) {
        claimResult = await adminAPI.submitHoleInOneClaim(playerData, paymentMethod, outfit, combinedTeeTime);
      } else {
        claimResult = await adminAPI.submitBirdieClaim(playerData, outfit, combinedTeeTime);
      }

      console.log("🚨 CLAIM SUBMITTED TO ADMIN PORTAL:", claimResult);

      if (claimResult && !claimResult.error) {
        alert(`✅ Prize claim submitted! devbooth1@yahoo.com has been notified immediately.`);
      } else if (claimResult && claimResult.offline) {
        alert(`⚠️ Claim logged locally. Will sync with our team when available.`);
      } else {
        alert(`✅ Prize claim submitted! Company will be notified immediately.`);
      }

      // Always show review/email info after submitting
      alert("Your submission is under review. You will receive an email when your hole has been reviewed by our team.");

      // --- Claim Sync to Backend ---
      const claimData = {
        playerName: localStorage.getItem("playerName") || "",
        playerEmail: localStorage.getItem("playerEmail") || "",
        playerPhone: localStorage.getItem("playerPhone") || "",
        courseId: state.courseId || "",
        hole: state.hole || "",
        claimType: state.prize === "hio" ? "hole-in-one" : "birdie",
        teeTime: combinedTeeTime || "",
        outfit: outfit || "",
        points: state.points || 0
      };

      fetch('https://par3-admin1.vercel.app/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claimData)
      })
      .then(res => res.json())
      .then(data => {
        console.log("Claim submitted to backend:", data);
      })
      .catch(error => {
        console.error("Failed to submit claim to backend:", error);
      });

      // --- SEND THE VERIFICATION EMAIL ---
      sendClaimEmail({
        to: "devbooth1@yahoo.com",
        subject: `Claim Verification for ${playerName}`,
        text: `Player ${playerName} submitted a ${state.prize === "hio" ? "Hole-in-One" : "Birdie"} claim. Outfit: ${outfit}. Tee time: ${teeDate} ${teeTime}.`,
        html: `<p>Player <strong>${playerName}</strong> submitted a <strong>${state.prize === "hio" ? "Hole-in-One" : "Birdie"}</strong> claim.<br/>Outfit: <strong>${outfit}</strong><br/>Tee time: <strong>${teeDate} ${teeTime}</strong></p>`
      });

    } catch (error) {
      console.error("Failed to submit claim to admin portal:", error);
      alert("Prize claim logged! Company notification will be sent immediately.");
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

  const isHoleInOne = state.prize === "hio";
  const prizeLabel = isHoleInOne ? "Hole-in-One" : "Birdie";
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

        <form onSubmit={onSubmit} className="flex flex-col gap-3 flex-1 justify-between">
          {/* Outfit Description */}
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

          {/* Date and Time */}
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
