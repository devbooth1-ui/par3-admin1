import React from "react";
import { useNavigate } from "react-router-dom";
import VideoRecordingNotice from "../components/VideoRecordingNotice";

export default function Login() {
  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [agreeToTerms, setAgreeToTerms] = React.useState(false);

  // Check if terms were already accepted from Terms page
  React.useEffect(() => {
    const termsAccepted = localStorage.getItem("termsAccepted");
    if (termsAccepted === "true") {
      setAgreeToTerms(true);
      localStorage.removeItem("termsAccepted"); // Clean up
    }
  }, []);

  // Check if this is a returning player
  const isReturningPlayer = !!localStorage.getItem("playerStats");

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleNameChange = (e) => {
    const formattedName = capitalizeWords(e.target.value);
    setName(formattedName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check terms agreement for new players
    if (!agreeToTerms) {
      alert("Please agree to the terms and conditions to continue.");
      return;
    }
    localStorage.setItem("playerName", name);
    localStorage.setItem("playerEmail", email);
    localStorage.setItem("playerPhone", phone);
    // Check if playerStats already exists (returning player)
    const existingStats = localStorage.getItem("playerStats");
    if (!existingStats) {
      // New player: set up stats and go to awards
      const initialStats = {
        lastRound: "Par",
        totalRounds: 0,
        bestScore: 99,
        totalPoints: 50,
        lastReward: "Welcome Bonus",
        lastDate: new Date().toLocaleDateString(),
        holeInOneQualified: false,
        tournamentQualified: false,
        tournamentRegistered: false,
      };
      localStorage.setItem("playerStats", JSON.stringify(initialStats));
      // --- SYNC TO BACKEND ---
      try {
        const res = await fetch("https://par3-admin1.vercel.app/api/players", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            phone,
            stats: initialStats,
          }),
        });
        const data = await res.json();
        console.log("Synced player to admin backend:", data);
      } catch (error) {
        console.error("Error syncing player to admin backend:", error);
      }
      navigate("/Awards");
    } else {
      // Returning player: go to play page
      navigate("/play");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col flex-1 items-center bg-cover bg-center px-2 min-h-0 relative pt-0 overflow-hidden"
      style={{ backgroundImage: 'url(/golf-bg.jpg)' }}
    >
      <VideoRecordingNotice 
        position="top-right" 
        autoHide={false} 
        variant="login"
        isReturningPlayer={isReturningPlayer}
      />
      <div className="w-full flex flex-col items-center mt-0">
        <img
          src="/par3logo.png"
          alt="Par 3 Challenge Logo"
          className="w-60 sm:w-80 md:w-[28rem] h-auto drop-shadow-2xl"
          style={{ maxWidth: '80vw', height: 'auto' }}
        />
      </div>
      <div className="flex flex-col items-center w-full max-w-md" style={{ marginTop: '-1.2rem' }}>
        <div className="text-3xl font-extrabold text-white mb-1 drop-shadow-lg text-center w-full mt-0">
          Lets Get You Checked In
        </div>
        <div className="text-base font-bold text-white mb-1 mt-1">Cypress Creek Golf Club</div>
        <div
          className="mb-2 px-4 py-2 rounded-lg shadow border-2 border-lime-400 bg-gradient-to-r from-lime-100 to-emerald-100 text-lime-900 font-bold text-lg tracking-wide"
          style={{
            fontFamily: "'Montserrat', 'Arial', sans-serif",
            letterSpacing: "0.08em",
            textShadow: "1px 1px 0 #fff",
            textAlign: "center",
          }}
        >
          Hole <span className="text-lime-700">17</span> &nbsp;|&nbsp;
          Par <span className="text-lime-700">3</span> &nbsp;|&nbsp;
          <span className="text-emerald-700">176 yards</span>
        </div>
        <span className="text-white text-base text-center font-semibold drop-shadow-lg block max-w-md mx-auto mb-2">
          Begin your journey with instant awards while building rewards towards the $1million Tournament in Orlando, FL
        </span>
      </div>
      <div className="flex flex-col items-center w-full max-w-md mt-2">
        <form
          className="w-full flex flex-col gap-2 items-center"
          style={{ background: "none", boxShadow: "none", padding: 0 }}
          onSubmit={handleSubmit}
        >
          <div className="text-lg font-bold mb-1 text-center text-emerald-700 drop-shadow-lg">
            A LITTLE ABOUT YOU
          </div>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={handleNameChange}
            className="w-full rounded px-3 py-2 border border-lime-300 text-gray-800 placeholder-gray-700 bg-lime-50 focus:outline-none focus:ring-2 focus:ring-lime-300"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded px-3 py-2 border border-lime-300 text-gray-800 placeholder-gray-700 bg-lime-50 focus:outline-none focus:ring-2 focus:ring-lime-300"
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full rounded px-2 py-2 border border-lime-300 text-gray-800 placeholder-gray-700 bg-lime-50 focus:outline-none focus:ring-2 focus:ring-lime-300 text-base"
            maxLength={16}
            pattern="[0-9\-\+\(\) ]*"
            required
          />
          
          {/* Terms and Conditions Checkbox */}
          <div className="w-full mt-3 mb-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-lime-600 border-lime-300 rounded focus:ring-lime-500"
                required
              />
              <div className="text-sm text-white leading-relaxed">
                <span>I agree to the </span>
                <button 
                  type="button"
                  className="underline text-lime-300 hover:text-lime-200"
                  onClick={() => navigate('/terms')}
                >
                  terms and conditions
                </button>
                <span> including AI shot verification and recording for prizes and keepsakes.</span>
              </div>
            </label>
          </div>
          
          <button
            type="submit"
            className={`text-white text-lg font-bold py-2 px-6 rounded-full shadow-lg transition w-full mt-1 flex flex-col items-center gap-1 ${
              agreeToTerms 
                ? "bg-lime-700 hover:bg-lime-800" 
                : "bg-gray-500 cursor-not-allowed"
            }`}
            disabled={!agreeToTerms}
          >
            <span className="flex justify-center items-center gap-1">
              <span className="text-lime-100">APPROACH SHOT</span>
            </span>
            <span className="text-xs text-lime-300 mt-1 font-normal">click here</span>
          </button>
        </form>
      </div>
    </div>
  );
}
