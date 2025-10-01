import React from "react";
import { useNavigate } from "react-router-dom";

export default function HowdWeDo() {
  const navigate = useNavigate();
  const playerName = localStorage.getItem("playerName") || "Player";
  const playerEmail = localStorage.getItem("playerEmail") || "";
  const courseId = localStorage.getItem("courseId") || "";
  const hole = localStorage.getItem("hole") || "";

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

  return (
    <div>
      <button onClick={() => handleBirdieOrHioClick("Hole-in-One", "Prize!", 1000)}>
        Hole-in-One
      </button>
      <button onClick={() => handleBirdieOrHioClick("Birdie", "Prize!", 200)}>
        Birdie
      </button>
    </div>
  );
}
