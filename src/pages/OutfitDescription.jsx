import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OutfitDescription() {
  const navigate = useNavigate();
  const [outfit, setOutfit] = useState("");
  const [teeDate, setTeeDate] = useState("");
  const [teeTime, setTeeTime] = useState("");
  const [claimInfo, setClaimInfo] = useState(null);

  useEffect(() => {
    const info = localStorage.getItem("claimInfo");
    setClaimInfo(info ? JSON.parse(info) : null);
  }, []);

  if (!claimInfo || !claimInfo.prize) {
    return (
      <div style={{ color: "red", padding: 40 }}>
        <h2>Error: Missing claim info. Try again.</h2>
        <pre>{JSON.stringify(claimInfo, null, 2)}</pre>
        <p>Return to HowdWeDo and click Birdie or Hole-in-One.</p>
      </div>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    // submit data to your backend here
    alert(`Submitted: ${JSON.stringify({
      ...claimInfo,
      outfit,
      teeDate,
      teeTime
    }, null, 2)}`);
    // Clear claimInfo after submit
    localStorage.removeItem("claimInfo");
    navigate("/myscorecard");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Outfit Description Page</h2>
      <p>Prize: {claimInfo.prize}</p>
      <p>Player Name: {claimInfo.playerName}</p>
      <input
        value={outfit}
        onChange={e => setOutfit(e.target.value)}
        placeholder="Outfit"
        required
      />
      <input
        type="date"
        value={teeDate}
        onChange={e => setTeeDate(e.target.value)}
        required
      />
      <input
        type="time"
        value={teeTime}
        onChange={e => setTeeTime(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
}
