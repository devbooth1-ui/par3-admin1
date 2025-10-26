import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TournamentConfirmation() {
    const navigate = useNavigate();
    const [registrationData, setRegistrationData] = useState(null);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("tournamentRegistration") || "null");
        if (!data) {
            navigate("/tournament-signup");
            return;
        }
        setRegistrationData(data);
    }, [navigate]);

    if (!registrationData) {
        return <div>Loading...</div>;
    }

    return (
        <div
            className="min-h-screen py-12 px-4 overflow-hidden"
            style={{
                backgroundImage: 'url(/golf-bg.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Premium overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/60 via-emerald-800/40 to-lime-700/50"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-yellow-200">
                        <div className="text-8xl mb-4 animate-bounce">🎉</div>
                        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-lime-600 mb-4">
                            REGISTRATION CONFIRMED!
                        </h1>
                        <div className="text-6xl mb-4">🏆</div>
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 mb-4">
                            $1 MILLION TOURNAMENT
                        </h2>
                        <div className="bg-gradient-to-r from-green-100 to-yellow-100 rounded-lg p-4">
                            <p className="text-green-800 font-bold text-lg">
                                Welcome to the Tournament, {registrationData.firstName}!
                            </p>
                            <p className="text-sm text-green-700 mt-2">
                                Confirmation Date: {new Date(registrationData.registrationDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Registration Details */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-emerald-200 mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Registration Summary
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-blue-800 mb-2">Player Information</h4>
                                <p><strong>Name:</strong> {registrationData.firstName} {registrationData.lastName}</p>
                                <p><strong>Email:</strong> {registrationData.email}</p>
                                <p><strong>Phone:</strong> {registrationData.phone}</p>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-green-800 mb-2">Tournament Stats</h4>
                                <p><strong>Total Points:</strong> {registrationData.playerStats.totalPoints}</p>
                                <p><strong>Qualification Status:</strong> ✅ QUALIFIED</p>
                                <p><strong>Total Rounds:</strong> {registrationData.playerStats.totalRounds || 0}</p>
                                <p><strong>Best Score:</strong> {registrationData.playerStats.bestScore || "N/A"}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-yellow-800 mb-2">Contact Information</h4>
                                <p><strong>Address:</strong> {registrationData.address}</p>
                                <p><strong>City:</strong> {registrationData.city}, {registrationData.state} {registrationData.zipCode}</p>
                                <p><strong>Emergency Contact:</strong> {registrationData.emergencyContact}</p>
                                <p><strong>Emergency Phone:</strong> {registrationData.emergencyPhone}</p>
                            </div>

                            <div className="bg-purple-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-purple-800 mb-2">Tournament Details</h4>
                                <p><strong>T-Shirt Size:</strong> {registrationData.tshirtSize}</p>
                                <p><strong>Golf Experience:</strong> {registrationData.golfExperience || "Not specified"}</p>
                                <p><strong>Handicap:</strong> {registrationData.handicap || "Not specified"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* What's Next */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-emerald-200 mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        What Happens Next?
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                            <div className="text-4xl mb-3">📧</div>
                            <h4 className="font-bold text-blue-800 mb-2">Email Confirmation</h4>
                            <p className="text-sm text-blue-700">
                                You'll receive a detailed confirmation email with tournament information within 24 hours.
                            </p>
                        </div>

                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                            <div className="text-4xl mb-3">📅</div>
                            <h4 className="font-bold text-green-800 mb-2">Tournament Schedule</h4>
                            <p className="text-sm text-green-700">
                                Tournament dates, venue details, and schedule will be announced 30 days prior to the event.
                            </p>
                        </div>

                        <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                            <div className="text-4xl mb-3">🎁</div>
                            <h4 className="font-bold text-yellow-800 mb-2">Welcome Package</h4>
                            <p className="text-sm text-yellow-700">
                                Your tournament welcome package including t-shirt and materials will be mailed to you.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Continue Playing */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-emerald-200">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                            Keep Playing to Earn More!
                        </h3>
                        <p className="text-gray-600 mb-6">
                            You're qualified for the tournament, but extra points can be redeemed for:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg">
                                <div className="text-3xl mb-2">👕</div>
                                <h4 className="font-bold text-red-800">Par3Challenge Gear</h4>
                                <p className="text-sm text-red-700">Shirts, hats, accessories</p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                                <div className="text-3xl mb-2">🍽️</div>
                                <h4 className="font-bold text-blue-800">Clubhouse Specials</h4>
                                <p className="text-sm text-blue-700">Food, drinks, pro shop items</p>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                                <div className="text-3xl mb-2">🏆</div>
                                <h4 className="font-bold text-green-800">Future Tournaments</h4>
                                <p className="text-sm text-green-700">Entry into additional events</p>
                            </div>
                        </div>

                        <div className="space-x-4">
                            <button
                                onClick={() => navigate("/play")}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-300"
                            >
                                Continue Playing for More Points
                            </button>

                            <button
                                onClick={() => navigate("/myscorecard")}
                                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-300"
                            >
                                View My Scorecard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}