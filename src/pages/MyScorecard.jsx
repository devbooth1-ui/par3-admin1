
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PRIZE_CONFIG } from "../config/prizes";

export default function MyScorecard() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [playerStats, setPlayerStats] = useState({});
  const prize = state?.prize ?? null;
  const [autoRedirectTimer, setAutoRedirectTimer] = useState(15);

  useEffect(() => {
    const stats = JSON.parse(localStorage.getItem("playerStats") || "{}");
    setPlayerStats(stats);
  }, []);

  // Auto-redirect timer after 15 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoRedirectTimer((prev) => {
        if (prev <= 1) {
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const isQualified = playerStats.tournamentQualified || (playerStats.totalPoints >= 800);
  const isRegistered = playerStats.tournamentRegistered;
  const [showSeeYou, setShowSeeYou] = useState(false);

  useEffect(() => {
    if (showSeeYou) {
      const timer = setTimeout(() => {
        setShowSeeYou(false);
        navigate("/");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSeeYou, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-100 flex flex-col items-center justify-center p-8 overflow-hidden" style={{ minHeight: '100dvh' }}>
      <div className="max-w-2xl w-full">
        <div className="grid gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-center mb-4">My Scorecard</h2>

            {/* Tournament Status - Always visible when qualified */}
            {isQualified && (
              <div className={`${isRegistered ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} border rounded-lg p-6 mb-6`}>
                <div className="text-center">
                  <div className="text-4xl mb-3">🏆</div>
                  <h3 className={`text-xl font-bold mb-2 ${isRegistered ? 'text-green-800' : 'text-yellow-800'}`}>
                    $1 MILLION TOURNAMENT
                  </h3>

                  {isRegistered ? (
                    <div className="text-green-700">
                      <p className="font-semibold text-lg mb-2">✅ REGISTERED & QUALIFIED!</p>
                      <p className="text-sm mb-4">
                        You're all set for the tournament. Keep playing to earn points for gear and specials!
                      </p>
                      <div className="bg-green-100 rounded-lg p-3 text-sm">
                        <p><strong>Current Points:</strong> {playerStats.totalPoints || 0}</p>
                        <p><strong>Extra Points:</strong> Redeemable for gear & clubhouse specials</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-yellow-700">
                      <p className="font-semibold text-lg mb-2">🎉 YOU'RE QUALIFIED!</p>
                      <p className="text-sm mb-4">
                        You have {playerStats.totalPoints || 0} points - enough to enter the $1 Million Tournament!
                      </p>
                      <button
                        onClick={() => navigate('/tournament-signup')}
                        className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white font-bold py-3 px-6 rounded-xl text-lg shadow-lg hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300"
                      >
                        🏆 REGISTER FOR TOURNAMENT 🏆
                      </button>
                      <div className="mt-2">
                        <span
                          onClick={() => setShowSeeYou(true)}
                          className="cursor-pointer underline text-slate-500 hover:text-slate-700 text-base font-medium"
                          role="button"
                          tabIndex={0}
                        >
                          Not Now
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Points Progress for Non-Qualified Players */}
            {!isQualified && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <div className="text-center">
                  <div className="text-4xl mb-3">🎯</div>
                  <h3 className="text-xl font-bold text-blue-800 mb-2">Tournament Progress</h3>
                  <div className="text-blue-700">
                    <p className="text-lg font-semibold mb-2">{playerStats.totalPoints || 0} / 800 points</p>
                    <p className="text-sm mb-4">{Math.max(0, 800 - (playerStats.totalPoints || 0))} points needed to qualify for $1M Tournament</p>
                    <div className="bg-blue-100 rounded-full h-4 mb-4">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, ((playerStats.totalPoints || 0) / 800) * 100)}%` }}
                      ></div>
                    </div>
                    <button
                      onClick={() => navigate('/play')}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      Keep Playing to Qualify!
                    </button>
                  </div>
                </div>
              </div>
            )}

            {prize === "hio" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-green-800 mb-2">🏆 Congratulations on your Hole-in-One!</h3>
                  <p className="text-green-700 font-semibold">Your prize is being verified</p>
                </div>

                <div className="space-y-4 text-sm text-green-700">
                  <div className="bg-green-100 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="text-lg">⏱️</span>
                      Verification Process
                    </h4>
                    <p className="ml-2">• Verification typically takes up to 48 hours</p>
                    <p className="ml-2">• Our team will review your submitted details</p>
                    <p className="ml-2">• You may be contacted for additional verification if needed</p>
                  </div>

                  <div className="bg-green-100 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="text-lg">*</span>
                      $1000 Payment Information
                    </h4>
                    <p className="ml-2">• Prize will be deposited to your original payment method</p>
                    <p className="ml-2">• Example: If you paid with PayPal, your prize will be deposited to PayPal</p>
                    <p className="ml-2">• Payment processing occurs after successful verification</p>
                  </div>
                </div>
              </div>
            )}

            {prize === "birdie" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-blue-800 mb-2">🐦 Nice Birdie!</h3>
                  <p className="text-blue-700 font-semibold">Your ${PRIZE_CONFIG.BIRDIE_AMOUNT} prize claim is being verified</p>
                </div>

                <div className="bg-blue-100 rounded-lg p-4 text-sm text-blue-700">
                  <h4 className="font-semibold mb-2">Verification & Payment</h4>
                  <p className="ml-2">• Typical verification for the Birdie prize up to 1 hour</p>
                  <p className="ml-2">• Prize will be pushed through the Pro Shop or app with ClubCard<span style={{ fontSize: '0.8em', verticalAlign: 'super' }}>™</span></p>
                </div>
              </div>
            )}

            {prize === null && (
              <p className="mt-2 text-slate-600 text-center mb-6">
                No prize this round—better luck on the next tee!
              </p>
            )}

            {/* Verification Details box removed as requested */}
          </div>

          {/* Video Order Button for Par/Shank'd It players */}
          {(!prize || (prize !== "hio" && prize !== "birdie")) && (
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/order-form')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg mb-4 shadow-lg transition-all transform hover:scale-105"
              >
                🎥 Order Your Par3 Challenge Video - $25
              </button>
              <p className="text-xs text-gray-600 mb-4">
                Capture your Par3 Challenge experience forever! Professional video delivered via email.
              </p>
            </div>
          )}

          {/* Tournament Details Link - Only show after prize claims */}
          {(prize === "hio" || prize === "birdie") && (
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/tournament')}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-3 px-6 rounded-lg mb-4"
              >
                🏆 View Tournament Details
              </button>
              <p className="text-sm text-slate-500">
                Redirecting to home in {autoRedirectTimer} seconds...
              </p>
            </div>
          )}

          {/* Auto-redirect info for Par/Shank'd It players */}
          {(!prize || (prize !== "hio" && prize !== "birdie")) && (
            <div className="text-center">
              <p className="text-sm text-slate-500">
                Redirecting to home in {autoRedirectTimer} seconds...
              </p>
            </div>
          )}

          {/* Local ads / clubhouse specials slot removed as requested */}
        </div>
      </div>
      {/* See you next time popup */}
      {showSeeYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadein">
          <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 flex flex-col items-center animate-bounceIn">
            <span className="text-5xl mb-4">👋</span>
            <h2 className="text-2xl font-bold mb-2 text-green-700">See you next time!</h2>
            <p className="text-slate-600 text-center">Thanks for playing. Come back soon for another shot at the $1 Million Tournament!</p>
          </div>
        </div>
      )}
    </div>
  );
}