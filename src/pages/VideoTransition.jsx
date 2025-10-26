import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function VideoTransition() {
    const navigate = useNavigate();
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            // Auto-play the video
            video.play().catch(console.error);

            // When video ends, go to HowdWeDo page
            const handleVideoEnd = () => {
                navigate("/howd-we-do");
            };

            video.addEventListener("ended", handleVideoEnd);

            // Cleanup
            return () => {
                video.removeEventListener("ended", handleVideoEnd);
            };
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
            <video
                ref={videoRef}
                className="max-w-full max-h-full"
                muted
                playsInline
                onError={(e) => {
                    console.error("Video error:", e);
                    // If video fails, go to HowdWeDo anyway after 3 seconds
                    setTimeout(() => navigate("/howd-we-do"), 3000);
                }}
            >
                <source src="/driver-nosound-mp4.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
} import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function VideoTransition() {
    const navigate = useNavigate();
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            // Auto-play the video
            video.play().catch(console.error);

            // When video ends, go to HowdWeDo page
            const handleVideoEnd = () => {
                navigate("/howd-we-do");
            };

            video.addEventListener("ended", handleVideoEnd);

            // Cleanup
            return () => {
                video.removeEventListener("ended", handleVideoEnd);
            };
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
            <video
                ref={videoRef}
                className="max-w-full max-h-full"
                muted
                playsInline
                onError={(e) => {
                    console.error("Video error:", e);
                    // If video fails, go to HowdWeDo anyway after 3 seconds
                    setTimeout(() => navigate("/howd-we-do"), 3000);
                }}
            >
                <source src="/driver-nosound-mp4.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}