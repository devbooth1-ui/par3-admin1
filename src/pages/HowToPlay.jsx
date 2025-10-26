import React from "react";
import { useNavigate } from "react-router-dom";

export default function HowToPlay() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col flex-1 items-center justify-center bg-cover bg-center px-4 py-8 min-h-0 overflow-hidden" style={{ backgroundImage: "url(/golf-grass.jpg)", minHeight: '100dvh' }}>
            <div className="bg-white/90 rounded-2xl shadow-xl p-6 max-w-md w-full mx-auto text-center">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-lime-700 mb-4">How to Play</h1>
                <ol className="text-left text-gray-800 text-base sm:text-lg space-y-3 mb-6 list-decimal list-inside">
                    <li>Pay $8 to play one shot.</li>
                    <li>Step up to the tee and take your best swing!</li>
                    <li>Every shot is recorded for fair play and highlights.</li>
                    <li>Win instant cash and earn points for the $1M tournament.</li>
                    <li>Qualify for the $1 Million Challenge by earning points.</li>
                </ol>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => navigate("/login")}
                        className="w-full bg-lime-600 hover:bg-lime-700 text-white font-bold py-3 rounded-lg shadow-lg transition-all text-lg"
                    >
                        Get Started
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full bg-white border border-lime-400 text-lime-700 font-semibold py-2 rounded-lg hover:bg-lime-50 transition-all text-base"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}