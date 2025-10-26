import React from "react";
import { useNavigate } from "react-router-dom";

export default function WelcomeGolfer() {
    const navigate = useNavigate();
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden"
            style={{
                minHeight: '100dvh',
                backgroundImage: "url('/ballroll.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="flex flex-col items-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg text-center mb-2">
                    Welcome to the
                </h1>
                <img
                    src="/par3logo.png"
                    alt="Par 3 Challenge Logo"
                    className="w-40 sm:w-56 h-auto mb-2 drop-shadow-2xl"
                />
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white drop-shadow-lg text-center mb-2">
                    Par 3 Challenge
                </h2>
                <p className="text-lg sm:text-xl text-white/90 mb-4 text-center max-w-xl">
                    Swing into action! Your shot at <span className="font-bold text-yellow-300">$1,000</span> today, plus a chance to qualify for the <span className="font-bold text-lime-300">$1 Million Shootout</span> in Orlando, FL!
                </p>
            </div>
            <div className="bg-black/50 rounded-2xl p-6 shadow-xl max-w-lg w-full mb-8">
                <h3 className="text-2xl font-bold text-lime-200 mb-3 text-center">How to Play Through</h3>
                <ol className="list-decimal list-inside text-white/90 space-y-2 text-lg">
                    <li><span className="font-bold text-lime-300">Tee Up:</span> Scan in, pay, and get ready to play your par-3 challenge hole.</li>
                    <li><span className="font-bold text-yellow-200">Swing:</span> Take your best shot—birdie or ace for instant rewards!</li>
                    <li><span className="font-bold text-blue-200">Chip In:</span> Describe your outfit for quick prize verification.</li>
                    <li><span className="font-bold text-green-200">Putt:</span> Track your scorecard and build points toward the $1 Million Shootout.</li>
                </ol>
            </div>
            <div className="flex flex-col items-center gap-4">
                <button
                    onClick={() => navigate('/login')}
                    className="bg-gradient-to-r from-lime-500 to-green-600 text-white font-bold py-3 px-8 rounded-xl text-xl shadow-lg hover:from-lime-600 hover:to-green-700 transition-all duration-200"
                >
                    Tee Off Now
                </button>
                <p className="text-white/80 text-center text-sm max-w-xs">
                    Birdie for a <span className="font-bold text-blue-200">$65 Club Card</span> and more! Every swing builds your chance for the $1 Million Shootout.
                </p>
            </div>
        </div>
    );
}