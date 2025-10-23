import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import ReturningPlayer from "./pages/ReturningPlayer.jsx";
import PlayGame from "./pages/PlayGame.jsx";
import Payment from "./pages/Payment.jsx";
import HowdWeDo from "./pages/HowdWeDo.jsx";
import TeeOff from "./pages/TeeOff.jsx";
import MyScorecard from "./pages/MyScorecard.jsx";
import OutfitDescription from "./pages/OutfitDescription.jsx";
import Tournament from "./pages/Tournament.jsx";
import TapIn from "./pages/TapIn.jsx";
import Awards from "./pages/Awards.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Profile from "./pages/Profile.jsx";
import Challenge from "./pages/Challenge.jsx";
import OrderForm from "./pages/OrderForm.jsx";
import ThanksForPlaying from "./pages/ThanksForPlaying.jsx";
import TournamentSignup from "./pages/TournamentSignup.jsx";
import TermsAndConditions from "./pages/TermsAndConditions.jsx";
import TestClaims from "./pages/TestClaims.jsx";

export default function App() {
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {},
        () => {},
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/returning" element={<ReturningPlayer />} />
      <Route path="/play" element={<PlayGame />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/howd-we-do" element={<HowdWeDo />} />
      {/* Remove if not needed: <Route path="/howdwedo" element={<HowdWeDo />} /> */}
      <Route path="/teeoff" element={<TeeOff />} />
      <Route path="/myscorecard" element={<MyScorecard />} />
      <Route path="/verify" element={<OutfitDescription />} />
      <Route path="/tournament" element={<Tournament />} />
      <Route path="/awards" element={<Awards />} />
      <Route path="/tapin" element={<TapIn />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/challenge" element={<Challenge />} />
      <Route path="/order-form" element={<OrderForm />} />
      <Route path="/thanks-for-playing" element={<ThanksForPlaying />} />
      <Route path="/tournament-signup" element={<TournamentSignup />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/test-claims" element={<TestClaims />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
