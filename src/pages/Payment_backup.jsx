import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Payment() {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState("");
    const [showQRScanner, setShowQRScanner] = useState(false);
    const [showTapToPay, setShowTapToPay] = useState(false);
    const [showCardForm, setShowCardForm] = useState(false);
    const [cardInfo, setCardInfo] = useState({ number: "", expiry: "", cvv: "", name: "" });
    const playerName = localStorage.getItem("playerName") || "Player";
    const firstName = playerName.split(" ")[0];

    // Get last payment method
    const lastPaymentMethod = localStorage.getItem("lastPaymentMethod");

    useEffect(() => {
        // Auto-select last payment method if available
        if (lastPaymentMethod && !paymentMethod) {
            setPaymentMethod("same");
        }
    }, [lastPaymentMethod, paymentMethod]);

    const handleSwingAway = () => {
        // Immediately go to scoring page
        navigate("/howd-we-do");
    };

    const handlePayment = () => {
        if (!paymentMethod) {
            alert("Please select a payment method");
            return;
        }

        if (paymentMethod === "card" && !showCardForm) {
            setShowCardForm(true);
            return;
        }

        // Store payment method for next time
        const selectedMethod = paymentMethod === "same" ? lastPaymentMethod : paymentMethod;
        localStorage.setItem("lastPaymentMethod", selectedMethod);

        // Simulate payment processing
        setTimeout(() => {
            // After payment, go to scoring page
            navigate("/howd-we-do");
        }, 1500);
    };

    const handleQRScan = () => {
        setShowQRScanner(true);
        // Simulate QR scan
        setTimeout(() => {
            setShowQRScanner(false);
            setPaymentMethod("qr-scan");
        }, 2000);
    };

    const handleTapToPay = () => {
        setShowTapToPay(true);
        // Simulate tap detection
        setTimeout(() => {
            setShowTapToPay(false);
            setPaymentMethod("tap-pay");
        }, 3000);
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
                        onClick={handleQRScan}
                        className="flex flex-col items-center p-4 border-2 border-white border-opacity-40 rounded-lg hover:border-yellow-400 transition-all text-white"
                        disabled={showQRScanner}
                    >
                        {showQRScanner ? (
                            <div className="text-yellow-300">
                                <div className="animate-spin text-2xl mb-2">📱</div>
                                <div className="text-sm">Scanning...</div>
                            </div>
                        ) : (
                            <>
                                <div className="text-2xl mb-2">📱</div>
                                <div className="text-sm font-semibold drop-shadow-lg">Scan QR Code</div>
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleTapToPay}
                        className="flex flex-col items-center p-4 border-2 border-white border-opacity-40 rounded-lg hover:border-yellow-400 transition-all text-white"
                        disabled={showTapToPay}
                    >
                        {showTapToPay ? (
                            <div className="text-yellow-300">
                                <div className="animate-pulse text-2xl mb-2">📲</div>
                                <div className="text-sm">Waiting for tap...</div>
                            </div>
                        ) : (
                            <>
                                <div className="text-2xl mb-2">📲</div>
                                <div className="text-sm font-semibold drop-shadow-lg">Tap to Pay</div>
                            </>
                        )}
                    </button>
                </div>

                {/* Payment Methods */}
                <div className="bg-white bg-opacity-95 rounded-lg p-6 shadow-2xl">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">Choose Payment Method</h3>

                    <div className="space-y-3">
                        {lastPaymentMethod && (
                            <label className="flex items-center p-3 border-2 border-emerald-200 rounded-lg cursor-pointer hover:border-emerald-300 transition-all bg-emerald-50">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="same"
                                    checked={paymentMethod === "same"}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="mr-3 text-emerald-600"
                                />
                                <div className="flex-1">
                                    <div className="font-semibold text-emerald-800">Use Last Payment Method</div>
                                    <div className="text-sm text-emerald-600 capitalize">{lastPaymentMethod.replace('-', ' ')}</div>
                                </div>
                                <div className="text-2xl">⚡</div>
                            </label>
                        )}

                        <label className="flex items-center p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-emerald-300 transition-all">
                            <input
                                type="radio"
                                name="payment"
                                value="card"
                                checked={paymentMethod === "card"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="mr-3 text-emerald-600"
                            />
                            <div className="flex-1">
                                <div className="font-semibold text-slate-800">Credit/Debit Card</div>
                                <div className="text-sm text-slate-600">Visa, MasterCard, American Express</div>
                            </div>
                            <div className="text-2xl">💳</div>
                        </label>

                        <label className="flex items-center p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-emerald-300 transition-all">
                            <input
                                type="radio"
                                name="payment"
                                value="apple-pay"
                                checked={paymentMethod === "apple-pay"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="mr-3 text-emerald-600"
                            />
                            <div className="flex-1">
                                <div className="font-semibold text-slate-800">Apple Pay</div>
                                <div className="text-sm text-slate-600">Quick and secure</div>
                            </div>
                            <div className="text-2xl">📱</div>
                        </label>

                        <label className="flex items-center p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-emerald-300 transition-all">
                            <input
                                type="radio"
                                name="payment"
                                value="google-pay"
                                checked={paymentMethod === "google-pay"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="mr-3 text-emerald-600"
                            />
                            <div className="flex-1">
                                <div className="font-semibold text-slate-800">Google Pay</div>
                                <div className="text-sm text-slate-600">Quick and secure</div>
                            </div>
                            <div className="text-2xl">🤖</div>
                        </label>
                    </div>

                    {paymentMethod && paymentMethod !== "same" && (
                        <button
                            onClick={handlePayment}
                            className="w-full mt-4 bg-yellow-600 bg-opacity-80 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all transform hover:scale-105 border-2 border-yellow-400"
                        >
                            🏌️ SWING AWAY!
                        </button>
                    )}

                    {paymentMethod === "same" && (
                        <button
                            onClick={handleSwingAway}
                            className="w-full mt-4 bg-yellow-600 bg-opacity-80 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all transform hover:scale-105 border-2 border-yellow-400"
                        >
                            🏌️ SWING AWAY!
                        </button>
                    )}

                    {/* Card Form */}
                    {showCardForm && (
                        <div className="mt-4 p-4 bg-emerald-50 rounded-lg space-y-3">
                            <h4 className="font-semibold text-emerald-800 mb-3">Enter Card Details</h4>
                            <input
                                type="text"
                                placeholder="Card Number"
                                value={cardInfo.number}
                                onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                                className="w-full rounded px-3 py-2 border border-emerald-300 text-emerald-700 placeholder-emerald-400 bg-emerald-50"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    value={cardInfo.expiry}
                                    onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                                    className="rounded px-3 py-2 border border-emerald-300 text-emerald-700 placeholder-emerald-400 bg-emerald-50"
                                />
                                <input
                                    type="text"
                                    placeholder="CVV"
                                    value={cardInfo.cvv}
                                    onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                                    className="rounded px-3 py-2 border border-emerald-300 text-emerald-700 placeholder-emerald-400 bg-emerald-50"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Cardholder Name"
                                value={cardInfo.name}
                                onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value })}
                                className="w-full rounded px-3 py-2 border border-emerald-300 text-emerald-700 placeholder-emerald-400 bg-emerald-50"
                            />

                            {cardInfo.number && cardInfo.expiry && cardInfo.cvv && cardInfo.name && (
                                <button
                                    onClick={handleSwingAway}
                                    className="w-full bg-yellow-600 bg-opacity-80 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all transform hover:scale-105 border-2 border-yellow-400 mt-3"
                                >
                                    🏌️ SWING AWAY!
                                </button>
                            )}
                        </div>
                    )}
                </div>

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