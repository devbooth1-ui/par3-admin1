import React, { useState, useEffect } from "react";
import < button
className = "flex flex-col items-center p-4 border-2 border-white border-opacity-40 rounded-lg hover:border-yellow-400 transition-all text-white bg-white/10"
    >
            <div className="text-2xl mb-2">📱</div>
            <div className="text-sm font-semibold drop-shadow-lg">Scan QR Code</div>
          </button > Navigate } from "react-router-dom";

export default function Payment() {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState("");
    const playerName = localStorage.getItem("playerName") || "Player";
    const firstName = playerName.split(" ")[0];

    const handleSwingAway = () => {
        // Immediately go to scoring page
        navigate("/howd-we-do");
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100vw",
                backgroundImage: "url('/ballonlip.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center -50px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px"
            }}
        >
            <div className="max-w-lg w-full space-y-6">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-2xl">
                        PAY<span className="text-emerald-400">.</span>PLAY<span className="text-emerald-400">.</span>WIN<span className="text-emerald-400">.</span> → {firstName}
                    </h1>

                    {/* Cost Display */}
                    <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4 mb-4 max-w-sm mx-auto">
                        <div className="text-center">
                            <span className="text-white text-lg font-medium">Cost to Play:</span>
                            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mt-1">
                                $8.00
                            </div>
                        </div>
                    </div>

                    <p className="text-white text-lg drop-shadow-xl">
                        Select your payment method to start your round
                    </p>
                </div>

                {/* Simple Shot Recording Notice */}
                <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-2xl">📹</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 font-bold text-lg drop-shadow">Shot Recording Active</span>
                </div>

                {/* Quick Payment Options */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                        className="flex flex-col items-center p-4 border-2 border-white border-opacity-40 rounded-lg hover:border-yellow-400 transition-all text-white bg-white/10 backdrop-blur-sm"
                    >
                        <div className="text-2xl mb-2">�</div>
                        <div className="text-sm font-semibold drop-shadow-lg">Scan QR Code</div>
                    </button>

                    <button
                        className="flex flex-col items-center p-4 border-2 border-white border-opacity-40 rounded-lg hover:border-yellow-400 transition-all text-white bg-white/10 backdrop-blur-sm"
                    >
                        <div className="text-2xl mb-2">📲</div>
                        <div className="text-sm font-semibold drop-shadow-lg">Tap to Pay</div>
                    </button>
                </div>

                {/* Payment Method Boxes - Icons on Left */}
                <div className="grid grid-cols-1 gap-4 mb-6">
                    <button
                        onClick={() => setPaymentMethod("card")}
                        className={`p-4 border-2 border-white border-opacity-40 rounded-lg transition-all text-white bg-white/10 backdrop-blur-sm hover:border-yellow-400 ${paymentMethod === "card" ? "border-yellow-400 bg-yellow-400/20" : ""}`}
                    >
                        <div className="flex items-center">
                            <div className="text-2xl mr-4">💳</div>
                            <div className="font-semibold drop-shadow-lg">Card</div>
                        </div>
                    </button>

                    <button
                        onClick={() => setPaymentMethod("apple-pay")}
                        className={`p-4 border-2 border-white border-opacity-40 rounded-lg transition-all text-white bg-white/10 backdrop-blur-sm hover:border-yellow-400 ${paymentMethod === "apple-pay" ? "border-yellow-400 bg-yellow-400/20" : ""}`}
                    >
                        <div className="flex items-center">
                            <div className="text-2xl mr-4">🍎</div>
                            <div className="font-semibold drop-shadow-lg">Apple Pay</div>
                        </div>
                    </button>

                    <button
                        onClick={() => setPaymentMethod("google-pay")}
                        className={`p-4 border-2 border-white border-opacity-40 rounded-lg transition-all text-white bg-white/10 backdrop-blur-sm hover:border-yellow-400 ${paymentMethod === "google-pay" ? "border-yellow-400 bg-yellow-400/20" : ""}`}
                    >
                        <div className="flex items-center">
                            <div className="text-2xl mr-4">🎯</div>
                            <div className="font-semibold drop-shadow-lg">Google Pay</div>
                        </div>
                    </button>
                </div>

                {/* Main Action Button */}
                {paymentMethod && (
                    <button
                        onClick={handleSwingAway}
                        className="w-full bg-yellow-600 bg-opacity-80 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all transform hover:scale-105 border-2 border-yellow-400 mb-4"
                    >
                        🏌️ SWING AWAY!
                    </button>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => navigate("/play")}
                        className="bg-slate-600 bg-opacity-60 hover:bg-slate-700 text-white font-semibold py-3 px-8 rounded-full transition-all w-full border border-white border-opacity-40"
                    >
                        ← Back to Game
                    </button>
                </div>

                {/* Security Note */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-white drop-shadow-lg">
                        🔒 All payments are secure and encrypted. No payment info is stored on device.
                    </p>
                </div>
            </div>
        </div>
    );
}