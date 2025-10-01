import React from "react";
import { useNavigate } from "react-router-dom";

export default function HowdWeDo() {
  const navigate = useNavigate();
  const playerName = localStorage.getItem("playerName") || "Player";
  const playerEmail = localStorage.getItem("playerEmail") || "";
  const courseId = localStorage.getItem("courseId") || "";
  const hole = localStorage.getItem("hole") || "";

  // Birdie or HIO: store claim info, send to outfit-description
  const handleBirdieOrHioClick = (scoreType, reward, points) => {
    localStorage.setItem("claimInfo", JSON.stringify({
      prize: scoreType === "Hole-in-One" ? "hio" : "birdie",
      playerName,
      playerEmail,
      courseId,
      hole,
      points,
      reward,
    }));
    navigate("/outfit-description");
  };

  // Par/Bogey: just send to scorecard page
  const handleParOrShankClick = (scoreType, reward, points) => {
    navigate("/myscorecard", { state: { prize: null, scoreType, points } });
  };

  return (
    <div>
      <button onClick={() => handleBirdieOrHioClick("Hole-in-One", "$1,000 CASH* + $1 Million Qualifier", 1000)}>
        Hole-in-One
      </button>
      <button onClick={() => handleBirdieOrHioClick("Birdie", "$65 Club Card + 200 Points", 200)}>
        Birdie
      </button>
      <button onClick={() => handleParOrShankClick("Par", "50 Points", 50)}>
        Par
      </button>
      <button onClick={() => handleParOrShankClick("Bogey", "50 Points", 50)}>
        Bogey
      </button>
    </div>
  );
}
