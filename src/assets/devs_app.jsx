import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import ReturningPlayer from "./pages/ReturningPlayer.jsx";
import PlayGame from "./pages/PlayGame.jsx";
import Payment from "./pages/Payment.jsx";
import HowdWeDo from "./pages/HowdWeDo.jsx";
import MyScorecard from "./pages/MyScorecard.jsx";
import OutfitDescription from "./pages/OutfitDescription.jsx";
import Tournament from "./pages/Tournament.jsx";
import TapIn from "./pages/TapIn.jsx";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/returning" element={<ReturningPlayer />} />
            <Route path="/play" element={<PlayGame />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/howd-we-do" element={<HowdWeDo />} />
            <Route path="/myscorecard" element={<MyScorecard />} />
            <Route path="/verify" element={<OutfitDescription />} />
            <Route path="/tournament" element={<Tournament />} />
            <Route path="/tapin" element={<TapIn />} />
        </Routes>
    );
}