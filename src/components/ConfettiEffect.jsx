import React, { useEffect, useRef } from "react";

// Simple confetti effect using canvas
export default function ConfettiEffect({ duration = 2500 }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const W = window.innerWidth;
        const H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;

        // Confetti particles
        const confettiColors = ["#FFD700", "#FF6347", "#00FA9A", "#1E90FF", "#FF69B4", "#7CFC00"];
        const confetti = Array.from({ length: 120 }, () => ({
            x: Math.random() * W,
            y: Math.random() * -H,
            r: Math.random() * 6 + 4,
            d: Math.random() * 80 + 40,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            tilt: Math.random() * 10 - 10,
            tiltAngle: 0,
            tiltAngleIncremental: Math.random() * 0.07 + 0.05
        }));

        let angle = 0;
        let animationFrameId;
        let running = true;

        function draw() {
            ctx.clearRect(0, 0, W, H);
            angle += 0.01;
            for (let i = 0; i < confetti.length; i++) {
                let c = confetti[i];
                c.tiltAngle += c.tiltAngleIncremental;
                c.y += (Math.cos(angle + c.d) + 3 + c.r / 2) / 2;
                c.x += Math.sin(angle);
                c.tilt = Math.sin(c.tiltAngle) * 15;
                ctx.beginPath();
                ctx.lineWidth = c.r;
                ctx.strokeStyle = c.color;
                ctx.moveTo(c.x + c.tilt + c.r / 3, c.y);
                ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r);
                ctx.stroke();
            }
            animationFrameId = requestAnimationFrame(draw);
        }
        draw();

        // Stop animation after duration
        const timeout = setTimeout(() => {
            running = false;
            cancelAnimationFrame(animationFrameId);
            ctx.clearRect(0, 0, W, H);
        }, duration);

        return () => {
            running = false;
            cancelAnimationFrame(animationFrameId);
            clearTimeout(timeout);
            ctx.clearRect(0, 0, W, H);
        };
    }, [duration]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                pointerEvents: "none",
                zIndex: 9999
            }}
        />
    );
}