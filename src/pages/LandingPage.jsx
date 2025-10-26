import React from "react";

export default function LandingPage() {
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
            <div className="flex flex-col items-center mb-6">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg text-center mb-2">
                    Welcome to the
                </h1>
                <img
                    src="/par3logo.png"
                    alt="Par 3 Challenge Logo"
                    className="w-40 sm:w-56 h-auto mb-2 drop-shadow-2xl"
                />
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white drop-shadow-lg text-center">
                    Par 3 Challenge
                </h2>
            </div>
            <p className="text-lg sm:text-xl text-white/90 mb-6 text-center">
                Play. Win. Celebrate.<br />
                Your shot at $1 Million starts here.
            </p>
            {/* Add navigation or call-to-action buttons here as needed */}
        </div>
    );
}