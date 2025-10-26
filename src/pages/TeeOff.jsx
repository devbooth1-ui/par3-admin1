import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VideoRecordingNotice from "../components/VideoRecordingNotice";

export default function TeeOff() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/howd-we-do");
    }, 6000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #e0fff4 0%, #c6f7e2 100%)',
      }}
    >
      <VideoRecordingNotice position="top-right" autoHide={true} />
      <div className="text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-green-800 mb-4 drop-shadow-lg">Proceed to Tee</h1>
        <p className="text-2xl sm:text-3xl font-bold text-lime-700 mb-2 drop-shadow">Good luck! ⛳️</p>
      </div>
    </div>
  );
}