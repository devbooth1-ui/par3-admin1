import React, { useState, useEffect, useRef } from "react";
import StripeDemoForm from "../assets/StripeDemoForm";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../utils/adminAPI";


export default function Payment() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);
  const [cardApproved, setCardApproved] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [savedMethod, setSavedMethod] = useState(null);
  const [pricing, setPricing] = useState({ game_fee: 8.00, display_price: '$8.00' });
  const videoRef = useRef(null);
  const playerName = localStorage.getItem("playerName") || "Player";
  const firstName = playerName.split(" ")[0];
  // Get last payment method for returning players
  const lastPaymentMethod = localStorage.getItem("lastPaymentMethod");
  // Get player type: if 'isReturningPlayer' is not set or false, treat as new
  const isReturningPlayer = localStorage.getItem("isReturningPlayer") === "true";

  useEffect(() => {
    // Load pricing and saved payment method from backend
    const loadBackendData = async () => {
      // Load dynamic pricing
      const coursePricing = await adminAPI.getCoursePricing('wentworth-gc');
      setPricing(coursePricing);
      
      // Load saved payment method for returning players
      if (isReturningPlayer) {
        const playerEmail = localStorage.getItem("playerEmail");
        if (playerEmail) {
          const saved = await adminAPI.getSavedPaymentMethod(playerEmail);
          if (saved) {
            setSavedMethod(saved);
            setPaymentMethod("saved");
          }
        }
      } else {
        // If not a returning player, clear local storage
        localStorage.removeItem("lastPaymentMethod");
      }
    };

    loadBackendData();
  }, [isReturningPlayer]);

  // Force video to play when showVideo becomes true
  useEffect(() => {
    if (showVideo && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, [showVideo]);

  const handleSwingAway = async () => {
    // Determine the actual payment method being used
    const actualMethod = paymentMethod === "saved" ? savedMethod : 
                        paymentMethod === "same" ? lastPaymentMethod : paymentMethod;
    
    // Store payment method locally for immediate fallback
    if (actualMethod) {
      localStorage.setItem("lastPaymentMethod", actualMethod);
    }

    // Track payment with course-based accounting
    try {
      const playerEmail = localStorage.getItem("playerEmail") || "";
      const playerPhone = localStorage.getItem("playerPhone") || "";
      
      console.log("🚀 Processing payment with course accounting...");
      
      const paymentData = {
        playerName: playerName,
        playerEmail: playerEmail,
        playerPhone: playerPhone,
        paymentMethod: actualMethod,
        savePaymentMethod: savePaymentMethod,
        amount: pricing.game_fee,  // Use dynamic pricing
        transactionType: 'game_payment',
        courseId: 'wentworth-gc',
        courseName: 'Wentworth Golf Club',
        courseLocation: 'Surrey, UK'
      };
      
      try {
        const result = await adminAPI.trackPaymentWithAccounting(paymentData);
        
        if (result.success) {
          console.log("✅ Payment tracked with course accounting:", result);
          
          // Also record the course play for analytics
          try {
            await fetch('https://par3-admin1.vercel.app/api/course-plays', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                playerName: paymentData.playerName,
                playerEmail: paymentData.playerEmail,
                courseId: paymentData.courseId,
                courseName: paymentData.courseName,
                amount: paymentData.amount,
                paymentMethod: paymentData.paymentMethod
              })
            });
            console.log("✅ Course play recorded in backend");
          } catch (courseError) {
            console.log("❌ Course play recording failed (non-critical):", courseError.message);
          }
        } else {
          console.log("❌ Payment tracking failed (non-critical):", result.error);
        }
      } catch (trackingError) {
        console.log("❌ Payment tracking error (non-critical - continuing):", trackingError.message);
        // Continue with the flow even if tracking fails
      }
      
    } catch (error) {
      console.error("🚨 Error processing payment:", error);
    }

    setShowVideo(true);
  };

  // When video ends, go to teeoff page
  const handleVideoEnd = () => {
    setShowVideo(false);
    navigate("/teeoff");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        height: "100%",
        width: "100vw",
        backgroundImage: "url('/teeball.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center -50px",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: "2rem"
      }}
    >
      {/* Video Modal Overlay */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <video
            ref={videoRef}
            src="/driver-nosound-mp4.mp4"
            autoPlay
            muted
            onEnded={handleVideoEnd}
            className="w-full max-w-2xl rounded-xl shadow-2xl"
            controls={false}
            loop={false}
            playsInline
          >
            Sorry, your browser doesn't support embedded videos. You can <a href="/driver-nosound-mp4.mp4">download the video here</a>.
          </video>
        </div>
      )}
      <div className="max-w-lg w-full space-y-2 px-1 sm:px-0">
        <div className="text-center mb-3">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-2xl">
            READY<span className="text-emerald-400">.</span>SET<span className="text-emerald-400">.</span>GOLF<span className="text-emerald-400">.</span>
          </h1>
          <div className="text-2xl font-bold text-white mb-2 drop-shadow-2xl">{firstName}</div>

          {/* Cost Display - Dynamic Pricing */}
          <div className="bg-white/20 border border-white/30 rounded-xl p-2 mb-2 max-w-sm mx-auto">
            <div className="text-center">
              <span className="text-white text-lg font-medium">Entry:</span>
              <div className="text-4xl font-black text-green-500 mt-1">
                {pricing.display_price}
              </div>
            </div>
          </div>

          <p className="text-white text-lg drop-shadow-xl">
            Select your payment method to start your round
          </p>
        </div>

        {/* Simple Shot Recording Notice */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">📹</span>
          <span className="font-bold text-lg drop-shadow text-green-500">Shot Recording Active</span>
        </div>

        {/* Saved Payment Method for Returning Players */}
        {isReturningPlayer && savedMethod && (
          <div className="mb-2">
            <button
              onClick={() => setPaymentMethod("saved")}
              className={`w-full p-3 border-2 border-emerald-400 bg-emerald-50 bg-opacity-90 rounded-lg transition-all hover:bg-emerald-100 ${paymentMethod === "saved" ? "bg-emerald-200" : ""}`}
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">💳</span>
                <div className="text-emerald-800">
                  <div className="font-bold text-lg">Use Saved Payment</div>
                  <div className="text-sm capitalize">Saved: {savedMethod.replace('-', ' ')}</div>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Use Previous Payment Option for Returning Players Only (Fallback) */}
        {isReturningPlayer && lastPaymentMethod && !savedMethod && (
          <div className="mb-2">
            <button
              onClick={() => setPaymentMethod("same")}
              className={`w-full p-3 border-2 border-emerald-400 bg-emerald-50 bg-opacity-90 rounded-lg transition-all hover:bg-emerald-100 ${paymentMethod === "same" ? "bg-emerald-200" : ""}`}
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">✅</span>
                <div className="text-emerald-800">
                  <div className="font-bold text-lg">Use Previous Payment</div>
                  <div className="text-sm capitalize">Last used: {lastPaymentMethod.replace('-', ' ')}</div>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Payment Method Boxes - Icons on Left - CLEAR (No Blur) */}
        <div className="grid grid-cols-1 gap-2 mb-3 sm:grid-cols-2 sm:gap-4">
          {/* PayPal Option */}
          <button
            onClick={() => setPaymentMethod("paypal")}
            className={`flex items-center p-3 border-2 rounded-xl shadow-xl transition-all w-full text-base font-extrabold tracking-wide focus:outline-none focus:ring-4 focus:ring-yellow-400/60
                ${paymentMethod === "paypal"
                ? "bg-yellow-400 text-yellow-900 border-yellow-400 scale-105 ring-4 ring-yellow-300/60"
                : "bg-black/40 text-white border-white/20 hover:bg-yellow-400/20 hover:border-yellow-400"}
              `}
            style={{ minHeight: '48px', textShadow: '0 2px 8px #000a' }}
          >
            <span className="mr-4 flex items-center" aria-label="PayPal" role="img">
              {/* PayPal SVG logo */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle">
                <g>
                  <path d="M13.7 7.5c.2-1.2 1.2-2.1 2.4-2.1h7.2c1.5 0 2.7 1.4 2.4 2.9l-2.1 11.2c-.2 1.2-1.2 2.1-2.4 2.1h-3.7c-.3 0-.6.2-.7.5l-1.1 5.7c-.1.4-.4.7-.8.7h-3.2c-.5 0-.9-.5-.8-1l3.4-17z" fill="#003087" />
                  <path d="M25.3 7.5c.2-1.2-1-2.3-2.2-2.3h-7.2c-1.2 0-2.2.9-2.4 2.1l-3.4 17c-.1.5.3 1 .8 1h3.2c.4 0 .7-.3.8-.7l1.1-5.7c.1-.3.4-.5.7-.5h3.7c1.2 0 2.2-.9 2.4-2.1l2.1-11.2z" fill="#009cde" />
                  <path d="M21.7 13.2c.1-.7-.4-1.2-1.1-1.2h-3.2c-.3 0-.6.2-.7.5l-.7 3.7c-.1.4.2.7.6.7h2.1c.7 0 1.3-.5 1.4-1.2l.6-2.5z" fill="#012169" />
                </g>
              </svg>
            </span>
            <span className="drop-shadow-lg">PayPal</span>
          </button>
          <button
            onClick={() => setPaymentMethod("card")}
            className={`flex items-center p-3 border-2 rounded-xl shadow-xl transition-all w-full text-base font-extrabold tracking-wide focus:outline-none focus:ring-4 focus:ring-yellow-400/60
                ${paymentMethod === "card"
                ? "bg-yellow-400 text-yellow-900 border-yellow-400 scale-105 ring-4 ring-yellow-300/60"
                : "bg-black/40 text-white border-white/20 hover:bg-yellow-400/20 hover:border-yellow-400"}
              `}
            style={{ minHeight: '48px', textShadow: '0 2px 8px #000a' }}
          >
            <span className="text-3xl mr-4">💳</span>
            <span className="drop-shadow-lg">Card</span>
          </button>

          <button
            onClick={() => setPaymentMethod("apple-pay")}
            className={`flex items-center p-3 border-2 rounded-xl shadow-xl transition-all w-full text-base font-extrabold tracking-wide focus:outline-none focus:ring-4 focus:ring-yellow-400/60
                ${paymentMethod === "apple-pay"
                ? "bg-yellow-400 text-yellow-900 border-yellow-400 scale-105 ring-4 ring-yellow-300/60"
                : "bg-black/40 text-white border-white/20 hover:bg-yellow-400/20 hover:border-yellow-400"}
              `}
            style={{ minHeight: '48px', textShadow: '0 2px 8px #000a' }}
          >
            <span className="text-3xl mr-4" aria-label="Apple Pay" role="img">
              {/* Apple SVG icon */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle">
                <path d="M25.6 17.6c-.032-3.2 2.624-4.736 2.752-4.832-1.504-2.176-3.84-2.496-4.672-2.528-1.984-.192-3.872 1.152-4.864 1.152-.992 0-2.528-1.12-4.16-1.088-2.144.032-4.128 1.248-5.216 3.168-2.24 3.872-.576 9.6 1.6 12.736 1.088 1.568 2.368 3.328 4.064 3.264 1.664-.064 2.288-1.056 4.288-1.056 2.016 0 2.56 1.056 4.224 1.024 1.76-.032 2.88-1.6 3.936-3.168 1.28-1.792 1.792-3.52 1.824-3.616-.032-.016-3.488-1.344-3.52-5.344zm-4.16-10.24c.864-1.056 1.44-2.528 1.28-4.016-1.232.048-2.72.816-3.616 1.824-.8.896-1.504 2.368-1.232 3.776 1.312.096 2.672-.672 3.568-1.584z" />
              </svg>
            </span>
            <span className="drop-shadow-lg">Apple Pay</span>
          </button>

          <button
            onClick={() => setPaymentMethod("google-pay")}
            className={`flex items-center p-3 border-2 rounded-xl shadow-xl transition-all w-full text-base font-extrabold tracking-wide focus:outline-none focus:ring-4 focus:ring-yellow-400/60
                ${paymentMethod === "google-pay"
                ? "bg-yellow-400 text-yellow-900 border-yellow-400 scale-105 ring-4 ring-yellow-300/60"
                : "bg-black/40 text-white border-white/20 hover:bg-yellow-400/20 hover:border-yellow-400"}
              `}
            style={{ minHeight: '48px', textShadow: '0 2px 8px #000a' }}
          >
            <span className="text-3xl mr-4" aria-label="Google Pay" role="img">
              {/* Google SVG icon */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle">
                <g>
                  <path d="M16.318 13.818v3.364h4.77c-.192 1.09-1.152 3.2-4.77 3.2-2.872 0-5.218-2.38-5.218-5.318s2.346-5.318 5.218-5.318c1.636 0 2.736.654 3.364 1.236l2.454-2.382C20.454 7.236 18.636 6.182 16.318 6.182c-5.09 0-9.218 4.128-9.218 9.218s4.128 9.218 9.218 9.218c5.272 0 8.772-3.708 8.772-8.945 0-.602-.068-1.063-.154-1.455h-8.618z" fill="#4285F4" />
                  <path d="M16.318 25.636c2.364 0 4.336-.782 5.782-2.127l-2.745-2.236c-.764.545-1.8.927-3.037.927-2.34 0-4.324-1.58-5.034-3.709H8.44v2.309c1.438 2.836 4.444 4.836 7.878 4.836z" fill="#34A853" />
                  <path d="M11.284 18.491c-.218-.654-.343-1.345-.343-2.045 0-.7.125-1.391.343-2.045v-2.309H8.44A8.995 8.995 0 0 0 7.1 16.446c0 1.418.345 2.763.96 3.954l2.784-2.309z" fill="#FBBC05" />
                  <path d="M16.318 10.545c1.29 0 2.18.545 2.682 1.0l2.018-2.018C19.99 8.073 18.636 7.273 16.318 7.273c-3.434 0-6.44 2-7.878 4.836l2.784 2.309c.71-2.129 2.694-3.709 5.034-3.709z" fill="#EA4335" />
                </g>
              </svg>
            </span>
            <span className="drop-shadow-lg">Google Pay</span>
          </button>
        </div>

        {/* Stripe Card Form for Card Payment */}
        {paymentMethod === "card" && (
          <div className="mb-2">
            <StripeDemoForm onApproved={() => setCardApproved(true)} pricing={pricing} />
          </div>
        )}

        {/* Save Payment Method Checkbox - Only show for new payment methods */}
        {paymentMethod && paymentMethod !== "saved" && paymentMethod !== "same" && (
          <div className="mb-3 flex items-center justify-center gap-2 bg-white bg-opacity-10 rounded-lg p-3">
            <input
              type="checkbox"
              id="savePayment"
              checked={savePaymentMethod}
              onChange={(e) => setSavePaymentMethod(e.target.checked)}
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
            />
            <label htmlFor="savePayment" className="text-white font-medium text-sm">
              💾 Save this payment method for faster checkout
            </label>
          </div>
        )}

        {/* Main Action Button: Only show for non-card methods, or after card payment is approved */}
        {((paymentMethod && paymentMethod !== "card") || (paymentMethod === "card" && cardApproved)) && (
          <button
            onClick={handleSwingAway}
            className="w-full bg-yellow-600 bg-opacity-80 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all transform hover:scale-105 border-2 border-yellow-400 mb-2 text-base"
          >
            🏌️ SWING AWAY!
          </button>
        )}

        {/* Security Note */}
        <div className="mt-2 text-center">
          <p className="text-xs text-white drop-shadow-lg">
            🔒 All payments are secure and encrypted. No payment info is stored on device.
          </p>
        </div>
      </div>
    </div>
  );
}
