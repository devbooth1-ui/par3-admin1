import React, { useEffect, useState } from "react";
import ConfettiEffect from "../components/ConfettiEffect";
import { useLocation, useNavigate } from "react-router-dom";

async function sendClaimEmail(claimData) {
  const response = await fetch("https://par3-admin1.vercel.app/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(claimData)
  });
  const result = await response.json();
  if (response.ok) {
    alert("Claim sent! Response: " + JSON.stringify(result));
  } else {
    alert("Claim failed: " + (result.error || "Unknown error"));
  }
}

export default function OutfitDescription() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [outfit, setOutfit] = useState("");
  const [error, setError] = useState("");

  // Pull player info from navigation state or localStorage
  const playerName = (state && state.playerName) || localStorage.getItem("playerName") || "";
  const playerEmail = (state && state.playerEmail) || localStorage.getItem("playerEmail") || "";
  const playerPhone = (state && state.playerPhone) || localStorage.getItem("playerPhone") || "";
  const claimType = (state && state.prize === "hio") ? "hole-in-one" : "birdie";

  useEffect(() => {
    if (!state || !state.prize) navigate("/howd-we-do", { replace: true });
  }, [state, navigate]);

  if (!state || !state.prize) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Required by backend
    if (!claimType.trim() || !playerName.trim() || !playerEmail.trim()) {
      setError("Claim type, name, and email are required.");
      return;
    }

    // Compose ONLY the fields backend wants
    const claimData = {
      claimType,
      playerName,
      playerEmail,
      playerPhone,
      outfitDescription: outfit
    };

    console.log("Sending claimData:", claimData);

    try {
      await sendClaimEmail(claimData);

      // Update local points immediately after successful claim
      let stats = JSON.parse(localStorage.getItem("playerStats") || "{}");
      if (claimType === "birdie") {
        stats.totalPoints = (stats.totalPoints || 0) + 200;
        stats.lastReward = "Birdie";
      } else if (claimType === "hole-in-one") {
        stats.totalPoints = (stats.totalPoints || 0) + 1000;
        stats.lastReward = "Hole-in-One";
      }
      stats.lastDate = new Date().toLocaleDateString();
      localStorage.setItem("playerStats", JSON.stringify(stats));

      alert("Your submission is under review. You will receive an email when your hole has been reviewed by our team.");
      navigate("/myscorecard", {
        state: { prize: state.prize, outfit },
      });
    } catch (error) {
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
      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white/95 backdrop-blur-sm rounded-
