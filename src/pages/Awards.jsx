
import React from "react";
import { useNavigate } from "react-router-dom";


const awards = [
  {
    title: "🏆 Hole-in-Won",
    description: "Prize: $1000 cash*, 800 reward points, and instant qualification for the $1 million shoot-out!",
  },
  {
    title: "🥇 Birdie",
    description: "Prize: $65.00 Club Card and 200 points toward qualifying for $1 million shoot-out!",
  },
  {
    title: "🥈 Par",
    description: "50 reward points toward qualifying for $1 million shoot-out.",
  },
];

export default function Awards() {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative px-2 sm:px-0 overflow-hidden"
      style={{
        backgroundImage: `url('/golf-grass.jpg')`,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40 z-0" />
      {/* Centered Logo Higher on Page */}
      <div className="w-full flex justify-center mt-[-64px] -mb-16 sm:mt-[-96px] sm:-mb-24 relative z-10">
        <img
          src="/par3logo.png"
          alt="Par 3 Logo"
          className="h-[160px] w-auto sm:h-[350px] drop-shadow-xl max-w-[90vw] sm:max-w-[600px]"
        />
      </div>
      {/* Awards Title Section Header Lower */}
      <div className="w-full max-w-md px-2 mb-2 mt-2 flex justify-start relative z-10">
        <span className="bg-white bg-opacity-95 rounded-xl px-3 py-2 text-base sm:text-lg font-bold text-gray-900 shadow-md">The Awards</span>
      </div>
      <ul className="space-y-3 relative z-10 w-full max-w-md px-1 sm:px-2">
        {awards.map((award, idx) => (
          <li key={idx} className="border-l-4 border-green-500 pl-2 py-2 bg-white bg-opacity-90 rounded-xl shadow-2xl">
            <div className="text-base sm:text-lg font-semibold text-green-700 flex items-center">
              {award.title}
              {award.title === "🥈 Par" && (
                <span className="text-xs ml-1 font-bold bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text">(or not up to par)</span>
              )}
            </div>
            <div className="text-gray-800 font-semibold text-xs sm:text-sm ml-1">{award.description}</div>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-2 mt-4 justify-center relative z-10 w-full max-w-md px-1 sm:px-2">
        <button
          className="px-3 py-1.5 sm:px-4 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition text-sm sm:text-base"
          onClick={() => navigate("/tournament")}
        >
          Tournament Details
        </button>
        <button
          className="px-4 py-2 sm:px-6 bg-green-600 text-white rounded-xl font-bold shadow hover:bg-green-700 transition text-base sm:text-lg mt-2"
          onClick={() => navigate("/payment")}
        >
          Tee it up!
        </button>
      </div>
    </div>
  );
}