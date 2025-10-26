import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PromoDriver() {
    const navigate = useNavigate();


    // Go to home page as soon as the video ends
    const handleEnded = () => {
        navigate("/home");
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden"
            style={{
                minHeight: '100dvh',
                background: 'black',
            }}
        >
            <video
                src="/driver-nosound-mp4.mp4"
                autoPlay
                muted
                playsInline
                onEnded={handleEnded}
                style={{
                    width: '100vw',
                    height: '100vh',
                    maxWidth: '100vw',
                    maxHeight: '100vh',
                    objectFit: 'cover',
                    display: 'block',
                    margin: '0 auto',
                    filter: 'contrast(1.15) brightness(1.08) saturate(1.1)',
                    border: 'none',
                }}
            />
        </div>
    );
}