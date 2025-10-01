import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
      <div style={{ color: "red", padding: 40 }}>
        <h2>Error: Missing claim info. Try again.</h2>
        <pre>{JSON.stringify(state, null, 2)}</pre>
        <p>Did you refresh or use the browser Back button? Always use the claim buttons.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Outfit Description Page</h2>
      <p>Prize: {state.prize}</p>
      <p>Player Name: {state.playerName}</p>
      <input value={outfit} onChange={e => setOutfit(e.target.value)} placeholder="Outfit" />
      <input type="date" value={teeDate} onChange={e => setTeeDate(e.target.value)} />
      <input type="time" value={teeTime} onChange={e => setTeeTime(e.target.value)} />
      {/* ...rest of your form ... */}
    </div>
  );
}
