import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ThanksForPlaying = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderData, setOrderData] = useState(null);
  const orderType = searchParams.get("order");

  useEffect(() => {
    if (orderType === "video") {
      const videoOrder = localStorage.getItem("videoOrder");
      if (videoOrder) {
        setOrderData(JSON.parse(videoOrder));
      }
    }
  }, [orderType]);

  const handleHomeReturn = () => {
    navigate("/");
  };

  const handlePlayAgain = () => {
    navigate("/challenge");
  };

  if (orderType === "video" && orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 text-center">
            <div className="text-6xl mb-4">🎥</div>
            <h1 className="text-3xl font-bold mb-2">Video Order Confirmed!</h1>
            <p className="text-purple-100 text-lg">
              Your professional Par3 Challenge video has been ordered
            </p>
          </div>

          {/* Order Details */}
          <div className="p-8">
            <div className="bg-purple-50 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-purple-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Player Name:</span>
                  <span className="font-semibold text-purple-900">{orderData.playerName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Email:</span>
                  <span className="font-semibold text-purple-900">{orderData.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Order Date:</span>
                  <span className="font-semibold text-purple-900">
                    {new Date(orderData.orderDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Payment Method:</span>
                  <span className="font-semibold text-purple-900 capitalize">
                    {orderData.paymentMethod === "card" ? "Credit/Debit Card" :
                     orderData.paymentMethod === "apple" ? "Apple Pay" :
                     orderData.paymentMethod === "google" ? "Google Pay" :
                     orderData.paymentMethod}
                  </span>
                </div>
                <div className="border-t pt-3 mt-4">
                  <div className="flex justify-between items-center text-xl">
                    <span className="font-bold text-gray-900">Total:</span>
                    <span className="font-bold text-green-600">${orderData.amount}.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-blue-900 mb-3">📧 Video Delivery</h3>
              <div className="space-y-2 text-gray-700">
                <p>Your professional Par3 Challenge video will be:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Processed within 24 hours</li>
                  <li>Delivered via email to: <span className="font-semibold text-blue-900">{orderData.email}</span></li>
                  <li>Available in HD quality for download</li>
                  <li>Perfect for sharing with friends and social media</li>
                </ul>
              </div>
            </div>

            {/* Confirmation Notice */}
            <div className="bg-green-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-green-900 mb-3">✅ Email Confirmations Sent</h3>
              <div className="space-y-2 text-gray-700">
                <p>• Order confirmation sent to your email</p>
                <p>• Receipt sent to devbooth1@yahoo.com and video@par3challenge.com</p>
                <p>• You'll receive a delivery notification when your video is ready</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handlePlayAgain}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
              >
                🏌️ Play Another Round
              </button>
              <button
                onClick={handleHomeReturn}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
              >
                🏠 Return Home
              </button>
            </div>

            {/* Footer Message */}
            <div className="text-center mt-8 p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-600">
                Thank you for playing Par3 Challenge! 
                <br />
                <span className="font-semibold">Share your experience and tag us on social media! 📱</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default thanks page (for non-video orders)
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl overflow-hidden text-center">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-8">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-3xl font-bold mb-2">Thanks for Playing!</h1>
          <p className="text-green-100 text-lg">
            Hope you enjoyed your Par3 Challenge experience
          </p>
        </div>

        <div className="p-8">
          <p className="text-gray-700 text-lg mb-8">
            We hope you had a great time playing Par3 Challenge. 
            Come back anytime for another round!
          </p>

          {/* Video Order Section */}
          <div className="mb-8 bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-2 border-purple-400/50 rounded-xl p-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🎥</div>
              <h3 className="text-xl font-bold text-purple-800 mb-3">
                ORDER YOUR VIDEO HERE!
              </h3>
              <p className="text-sm text-purple-700 mb-4">
                Capture your Par3 Challenge experience forever! Professional video footage delivered via email.
              </p>
              <button
                onClick={() => navigate('/order-form')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all transform hover:scale-105 mb-2"
              >
                🎥 Order Professional Video - $25.00
              </button>
              <p className="text-xs text-purple-600">
                📧 Delivered within 24 hours via email
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handlePlayAgain}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all"
            >
              🏌️ Play Again
            </button>
            <button
              onClick={handleHomeReturn}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              🏠 Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThanksForPlaying;
