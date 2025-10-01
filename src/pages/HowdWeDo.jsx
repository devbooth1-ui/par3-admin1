import React from "react";
import { useNavigate } from "react-router-dom";

export default function HowdWeDo() {
  const navigate = useNavigate();
  const playerName = localStorage.getItem("playerName") || "Player";
  const playerEmail = localStorage.getItem("playerEmail") || "";
  const courseId = localStorage.getItem("courseId") || "";
  const hole = localStorage.getItem("hole") || "";

  // Handles Birdie or Hole-in-One
  function handleBirdieOrHioClick(type, reward, points) {
    localStorage.setItem("claimInfo", JSON.stringify({
      prize: type === "Hole-in-One" ? "hio" : "birdie",
      playerName,
      playerEmail,
      courseId,
      hole,
      points,
      reward
    }));
    navigate("/outfit-description");
  }

  // Handles Par or Bogey
  function handleParOrShankClick(type, reward, points) {
    localStorage.removeItem("claimInfo"); // clear out any prior claim
    navigate("/myscorecard", { state: { prize: null, scoreType: type, points } });
  }

  return (
    <div>
      <button onClick={() => handleBirdieOrHioClick("Hole-in-One", "CASH + Million Qualifier", 1000)}>
        Hole-in-One
      </button>
      <button onClick={() => handleBirdieOrHioClick("Birdie", "$65 Card + 200 Points", 200)}>
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
