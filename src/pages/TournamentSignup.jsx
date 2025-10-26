import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ConfettiEffect from "../components/ConfettiEffect";
import { notifyTournamentRegistration } from "../assets/utils/notificationService.js";

export default function TournamentSignup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: ""
    });
    const [submitted, setSubmitted] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // Auto-populate form with existing player data
    useEffect(() => {
        const playerName = localStorage.getItem("playerName") || "";
        const playerEmail = localStorage.getItem("playerEmail") || "";
        const playerPhone = localStorage.getItem("playerPhone") || "";
        
        setForm({
            name: playerName,
            email: playerEmail,
            phone: playerPhone
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        setShowConfetti(true);
        
        // Store tournament registration data
        const tournamentData = {
            playerName: form.name,
            playerEmail: form.email,
            playerPhone: form.phone,
            registrationDate: new Date().toISOString(),
            tournamentId: "million-dollar-tournament",
            status: "registered"
        };
        
        localStorage.setItem("tournamentRegistered", "true");
        localStorage.setItem("tournamentData", JSON.stringify(tournamentData));
        
        const playerStats = JSON.parse(localStorage.getItem("playerStats") || "{}");
        playerStats.tournamentRegistered = true;
        localStorage.setItem("playerStats", JSON.stringify(playerStats));
        
        // Also update the main player data if it was modified
        if (form.name) localStorage.setItem("playerName", form.name);
        if (form.email) localStorage.setItem("playerEmail", form.email);
        if (form.phone) localStorage.setItem("playerPhone", form.phone);
        
        // Send registration notification using the notification service
        try {
            const result = await notifyTournamentRegistration(tournamentData);
            console.log("Tournament registration notification result:", result);
        } catch (error) {
            console.error("Failed to send tournament registration notification:", error);
        }
        
        // Send registration confirmation email to player
        sendPlayerConfirmationEmail(tournamentData);
        
        // Send notification to company (legacy backup)
        sendCompanyNotificationEmail(tournamentData);
        
        setTimeout(() => navigate("/play"), 3000);
    };

    const sendPlayerConfirmationEmail = async (tournamentData) => {
        const playerConfirmation = {
            to: tournamentData.playerEmail,
            subject: "🏆 Tournament Registration Confirmed - Par3 Challenge $1 Million Shootout!",
            body: `Congratulations ${tournamentData.playerName}!

🏆 YOUR TOURNAMENT REGISTRATION IS CONFIRMED! 🏆

You are now officially registered for the Par3 Challenge Million Dollar Shootout!

Registration Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Player Name: ${tournamentData.playerName}
Email: ${tournamentData.playerEmail}
Phone: ${tournamentData.playerPhone || "Not provided"}
Registration Date: ${new Date(tournamentData.registrationDate).toLocaleString()}
Tournament ID: ${tournamentData.tournamentId}

💰 PRIZE POOL: $1,000,000 SHOOTOUT! 💰

What happens next:
✅ You're qualified and registered
✅ Play your tournament round immediately
✅ Best score wins the grand prize
✅ Results verified within 24 hours

Tournament Rules:
• Prize subject to tournament completion and verification
• Winner must complete verification process
• Tournament subject to official rules and regulations
• Final prize amount determined by total participants

🏌️‍♂️ Ready to compete for $1 Million? Let's play!

Good luck!
The Par3 Challenge Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated confirmation. Please keep this email for your records.`,
            timestamp: new Date().toISOString(),
            type: "tournament_registration"
        };

        // Store for demonstration (in production, this would send actual email)
        localStorage.setItem("lastPlayerTournamentConfirmation", JSON.stringify(playerConfirmation));
        console.log("Tournament registration confirmation sent to player:", playerConfirmation);
    };

    const sendCompanyNotificationEmail = async (tournamentData) => {
        const companyNotification = {
            to: "devbooth1@yahoo.com, registration@par3challenge.com",
            subject: "🏆 New Tournament Registration - Par3 Challenge",
            body: `New tournament registration received:

Player Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${tournamentData.playerName}
Email: ${tournamentData.playerEmail}
Phone: ${tournamentData.playerPhone || "Not provided"}
Registration Date: ${new Date(tournamentData.registrationDate).toLocaleString()}
Tournament ID: ${tournamentData.tournamentId}
Status: ${tournamentData.status}

Tournament: Million Dollar Shootout
Prize Pool: $1,000,000 SHOOTOUT

Player is now registered and will proceed to play their tournament round.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Action Required: Monitor player's tournament performance and verify results.`,
            timestamp: new Date().toISOString(),
            type: "company_tournament_notification"
        };

        // Store for demonstration (in production, this would send actual email)
        localStorage.setItem("lastCompanyTournamentNotification", JSON.stringify(companyNotification));
        console.log("Company tournament notification sent:", companyNotification);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 p-4 overflow-hidden relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                    className="absolute top-10 left-10 text-6xl opacity-20"
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 8, repeat: Infinity }}
                >
                    🏆
                </motion.div>
                <motion.div 
                    className="absolute top-20 right-20 text-4xl opacity-20"
                    animate={{ y: [-20, 20, -20] }}
                    transition={{ duration: 4, repeat: Infinity }}
                >
                    💰
                </motion.div>
                <motion.div 
                    className="absolute bottom-20 left-20 text-5xl opacity-20"
                    animate={{ x: [-10, 10, -10], rotate: [-10, 10, -10] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    🎯
                </motion.div>
                <motion.div 
                    className="absolute bottom-10 right-10 text-3xl opacity-20"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    ⭐
                </motion.div>
            </div>

            {/* Confetti Effect */}
            {showConfetti && <ConfettiEffect duration={4000} />}

            <motion.div 
                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 w-full max-w-md border-4 border-gradient-to-r from-yellow-400 to-red-500 relative z-10"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
            >

                <motion.h1 
                    className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 mb-4 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    🏆 TOURNAMENT SIGNUP 🏆
                </motion.h1>

                {submitted ? (
                    <motion.div 
                        className="text-center py-8 space-y-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div 
                            className="text-6xl mb-4"
                            animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            🎉
                        </motion.div>
                        <div className="text-green-700 font-bold text-xl">
                            🏆 REGISTRATION CONFIRMED! 🏆
                        </div>
                        <div className="text-gray-700 font-semibold">
                            Welcome to the $1 Million Shootout!
                        </div>
                        <div className="text-sm text-gray-600">
                            📧 Confirmation email sent to your address
                        </div>
                        <div className="text-sm text-gray-600">
                            Redirecting to play your qualifying round...
                        </div>
                        <motion.div 
                            className="w-full bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full mt-4"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3 }}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        {/* Prize Info Banner */}
                        <motion.div 
                            className="bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 border-2 border-green-400 rounded-xl p-4 mb-6 text-center"
                            animate={{ boxShadow: ["0 0 0px rgba(34, 197, 94, 0.4)", "0 0 20px rgba(34, 197, 94, 0.4)", "0 0 0px rgba(34, 197, 94, 0.4)"] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <div className="text-2xl mb-2">💎 QUALIFIED PLAYER 💎</div>
                            <div className="text-sm font-bold text-green-800">
                                You've earned your spot in the<br />
                                <span className="text-xl text-emerald-600">$1 MILLION SHOOTOUT!</span>
                            </div>
                            <div className="text-xs text-green-700 mt-2 font-medium">
                                *Prize subject to tournament completion and verification
                            </div>
                        </motion.div>

                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                            >
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="🏌️ Full Name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="rounded-xl px-4 py-3 border-2 border-yellow-300 text-gray-800 placeholder-gray-700 bg-gradient-to-r from-yellow-50 to-orange-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 transition-all font-semibold"
                                    required
                                />
                            </motion.div>
                            
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                            >
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="📧 Email Address"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="rounded-xl px-4 py-3 border-2 border-yellow-300 text-gray-800 placeholder-gray-700 bg-gradient-to-r from-yellow-50 to-orange-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 transition-all font-semibold"
                                    required
                                />
                            </motion.div>
                            
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                            >
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="📱 Phone (optional)"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="rounded-xl px-4 py-3 border-2 border-yellow-300 text-gray-800 placeholder-gray-700 bg-gradient-to-r from-yellow-50 to-orange-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 transition-all font-semibold"
                                    maxLength={16}
                                    pattern="[0-9\-\+\(\) ]*"
                                />
                            </motion.div>
                            
                            <motion.button
                                type="submit"
                                className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white text-xl font-extrabold py-4 px-8 rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 mt-2"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.9, duration: 0.5 }}
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(34, 197, 94, 0.4)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                🚀 REGISTER FOR $1 MILLION SHOOTOUT! 🚀
                            </motion.button>

                            {/* Tournament Details Toggle */}
                            <motion.button
                                type="button"
                                onClick={() => navigate("/tournament")}
                                className="mt-4 w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl border border-gray-300 transition-all transform hover:scale-105 active:scale-95"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2, duration: 0.6 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                📋 Tournament Details →
                            </motion.button>
                        </form>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}