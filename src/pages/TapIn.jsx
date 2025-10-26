import React from "react";
import { useNavigate } from "react-router-dom";
import VideoRecordingNotice from "../components/VideoRecordingNotice";

export default function TapIn() {
  const navigate = useNavigate();

  const handleTap = () => {
    const user = localStorage.getItem("par3User");
    if (user) {
      navigate("/returning");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center overflow-hidden" style={{ backgroundImage: 'url(/golf-bg.jpg)' }}>
      <VideoRecordingNotice position="top-right" autoHide={false} />
      <button
        onClick={handleTap}
        className="bg-lime-700 hover:bg-lime-800 text-white text-2xl font-bold py-4 px-10 rounded-full shadow-lg transition"
      >
        Tap In To Play
      </button>
    </div>
  );
}