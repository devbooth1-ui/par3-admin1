import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

// Example mapping: coordinates to course/hole info
const COURSE_MAP = [
  {
    name: "Creekside No. 17",
    yards: 168,
    lat: 37.7749, // Example lat
    lng: -122.4194, // Example lng
    radius: 0.5, // miles
  },
  // Add more courses/holes here
];

// Hard-coded course name for all sessions
const HARDCODED_COURSE_NAME = "Wentworth Hole #4";

function getCourseInfo(lat, lng) {
  // Simple radius check (not accurate for real-world, but fine for demo)
  for (const course of COURSE_MAP) {
    const dLat = (lat - course.lat) * 69; // rough miles per degree
    const dLng = (lng - course.lng) * 54.6; // rough miles per degree at mid-lat
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    if (dist < course.radius) return course;
  }
  return null;
}

export default function Home() {
  // Developer toggle for new player flow
  const clearPlayerData = () => {
    localStorage.removeItem("playerName");
    localStorage.removeItem("playerEmail");
    localStorage.removeItem("playerStats");
    localStorage.removeItem("tournamentRegistration");
    window.location.reload();
  };
  const navigate = useNavigate();
  const handleTap = () => {
    const savedName = localStorage.getItem("playerName");
    if (savedName && savedName.trim() !== "") {
      navigate("/play");
    } else {
      navigate("/login");
    }
  };

  // Geolocation state
  const [geo, setGeo] = useState({ loading: true, error: null, course: null });

  useEffect(() => {
    // Hard-code course name in localStorage for all users/sessions
    localStorage.setItem("playerCourseName", HARDCODED_COURSE_NAME);

    // --- Your existing geolocation logic (can be kept for future use) ---
    if (!navigator.geolocation) {
      setGeo({ loading: false, error: "Geolocation not supported", course: null });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const course = getCourseInfo(latitude, longitude);
        if (!course) {
          // Redirect to homepage if no course found
          navigate("/", { replace: true });
        } else {
          setGeo({ loading: false, error: null, course });
          // If you want to use dynamic in future, you would set:
          // localStorage.setItem("playerCourseName", course.name);
        }
      },
      (err) => {
        setGeo({ loading: false, error: "Location permission denied", course: null });
      }
    );
  }, [navigate]);

  return (
    <div className="relative min-h-screen flex flex-col justify-start items-center overflow-hidden text-white">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/homepageball.jpg)" }}
        aria-hidden
      ></div>
      {/* DEV/TEST: Button to simulate new player flow */}
      <div className="absolute top-8 right-4 z-30 flex flex-col gap-1 items-end">
        <button
          onClick={clearPlayerData}
          className="text-xs px-2 py-1 rounded bg-red-600 text-white font-bold shadow hover:bg-red-700 transition"
          title="Clear player data and simulate new player flow"
        >
          Test New Player
        </button>
        <button
          onClick={() => {
            localStorage.setItem('lastPaymentMethod', 'apple-pay');
            window.location.reload();
          }}
          className="text-xs px-2 py-1 rounded bg-emerald-200 text-emerald-900 font-bold shadow hover:bg-emerald-300 transition"
          title="Set last payment method for testing"
        >
          Test Returning Player
        </button>
      </div>

      {/* Main Content */}
      <div className="relative w-full flex flex-col items-center mt-0 mb-0 z-20">
        <div className="flex flex-col items-center mb-1">
          <img
            src="/par3logo.png"
            alt="Par 3 Challenge Logo"
            className="w-40 sm:w-56 h-auto -mb-1 mt-0 drop-shadow-2xl"
          />
          <h1 className="font-extrabold drop-shadow mb-0 text-2xl xs:text-3xl sm:text-4xl flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center leading-tight mt-0" style={{ marginTop: '-30px' }}>
            <span>PAY</span>
            <span className="text-lime-400">.</span>
            <span>PLAY</span>
            <span className="text-lime-400">.</span>
            <span>WIN</span>
          </h1>
          <h3 className="text-sm sm:text-lg font-bold text-lime-200 mb-0 text-center max-w-xs sm:max-w-xl px-0 drop-shadow-lg flex flex-nowrap items-end justify-center gap-x-0">
            <span className="text-xl sm:text-2xl font-extrabold text-white drop-shadow-lg">$1000</span>
            <span className="text-sm sm:text-base font-semibold text-lime-200 ml-1 mr-1 whitespace-nowrap">Today</span>
            <span className="text-xl sm:text-2xl font-extrabold text-white drop-shadow-lg">$1 Million</span>
            <span className="text-sm sm:text-base font-semibold text-lime-200 ml-1 whitespace-nowrap">Tomorrow</span>
          </h3>
          <h4
            className="text-xl sm:text-2xl font-extrabold text-center mb-1 mt-4 tracking-wide"
            style={{
              background: 'linear-gradient(90deg, #ff7300 0%, #ffe259 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            HOW IT'S PLAYED
          </h4>
        </div>
        {/* Move Challenge Box lower */}
        <div className="w-full flex justify-center items-center mt-6 mb-2 px-2">
          <div className="relative bg-emerald-600/30 rounded-xl p-3 sm:p-5 shadow-lg backdrop-blur-sm border border-emerald-300/40 min-w-[180px] max-w-xs sm:max-w-md w-full flex flex-col items-start" style={{ border: '1.5px solid rgba(52,211,153,0.25)' }}>
            <span className="text-base sm:text-lg font-bold text-white/90 mb-1">Today's Challenge</span>
            {/* Show hard-coded course name */}
            <span className="text-white/90 text-sm sm:text-base font-semibold mb-2">
              {HARDCODED_COURSE_NAME} &bull; Approx. 176 yards
            </span>
            <ul className="text-white/80 text-sm sm:text-base font-medium list-disc pl-4 space-y-2">
              <li>Login, pay entry, $8 and tee off.</li>
              <li>Follow all prompts for verification.</li>
              <li><span className="font-bold text-lime-200">Birdie</span> wins <span className="font-bold">$65</span> + <span className="font-bold">200 points</span></li>
              <li><span className="font-bold text-yellow-300">Hole in One</span> wins <span className="font-bold">$1000</span> + <span className="font-bold">Instant qualify for $1M shootout</span></li>
            </ul>
          </div>
        </div>
        {/* Move Let's Go button further down, just above the green box */}
        <div className="w-full flex flex-col items-center justify-center p-2 sm:p-4 text-center mt-2">
          <div className="mt-0 flex flex-col items-center gap-2 w-full">
            <button
              onClick={handleTap}
              className="w-full max-w-xs rounded-xl border border-lime-400/30 bg-lime-500/90 px-5 py-3 text-base sm:text-lg text-white font-bold shadow-lg hover:bg-lime-600 transition backdrop-blur"
            >
              Let's Go!
            </button>
          </div>
        </div>
      </div>

      {/* Shot Verification at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-emerald-900/90 backdrop-blur-md border-t border-emerald-400/30 p-1 sm:p-2">
        <div className="max-w-lg mx-auto flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 mb-0">
            <span className="text-lg">📹</span>
            <span className="text-lime-200 font-semibold text-xs">Shot Verification Active</span>
          </div>
          <p className="text-white/80 text-[10px] text-center leading-tight mt-0 mb-0">
            Every shot recorded for verification & highlight reel
          </p>
          <div className="flex items-center justify-center gap-2 mt-0 mb-0">
            <span className="text-[10px] text-emerald-200">✓ Fair Play</span>
            <span className="text-[10px] text-emerald-200">✓ Memories</span>
            <span className="text-[10px] text-emerald-200">✓ Proof</span>
          </div>
        </div>
      </div>
    </div>
  );
}
