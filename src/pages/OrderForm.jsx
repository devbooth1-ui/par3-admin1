import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { notifyVideoOrder } from "../assets/utils/notificationService.js";

export default function OrderForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    playerName: "",
    email: "",
    phone: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardApproved, setCardApproved] = useState(false);

  // Get last payment method for returning players
  const lastPaymentMethod = localStorage.getItem("lastPaymentMethod");
  const isReturningPlayer = localStorage.getItem("isReturningPlayer") === "true";

  // Populate form with existing player data
  useEffect(() => {
    const playerName = localStorage.getItem("playerName") || "";
    const playerEmail = localStorage.getItem("playerEmail") || "";
    const playerPhone = localStorage.getItem("playerPhone") || "";
    
    setFormData(prev => ({
      ...prev,
      playerName,
      email: playerEmail,
      phone: playerPhone
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate payment method is selected
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    // For card payments, ensure approval
    if (paymentMethod === "card" && !cardApproved) {
      alert("Please complete card payment verification");
      return;
    }

    // Process payment and send notifications
    processVideoOrder();
  };

  const processVideoOrder = async () => {
    const orderData = {
      ...formData,
      paymentMethod: paymentMethod === "same" ? lastPaymentMethod : paymentMethod,
      orderDate: new Date().toISOString(),
      amount: 25,
      status: "confirmed",
      orderType: "video"
    };

    // Store order data
    localStorage.setItem("videoOrder", JSON.stringify(orderData));

    // Send notification using the notification service
    try {
      const result = await notifyVideoOrder(orderData);
      console.log("Video order notification result:", result);
    } catch (error) {
      console.error("Failed to send video order notification:", error);
    }

    // Send legacy notification for backup
    await sendOrderNotification(orderData);

    // Send confirmation email to customer
    await sendCustomerConfirmation(orderData);

    // Show success message and navigate back to farewell page
    alert("🎥 Video order confirmed! Your professional Par3 Challenge video will be delivered within 24 hours via email. Thank you!");
    
    // Navigate back to regular farewell page
    navigate("/thanks-for-playing");
  };

  const sendOrderNotification = async (orderData) => {
    // This would integrate with your email service
    // For now, we'll simulate with console.log and localStorage
    const notification = {
      to: "devbooth1@yahoo.com, video@par3challenge.com",
      subject: "New Video Order - Par3 Challenge",
      body: `New video order received:
        
Customer: ${orderData.playerName}
Email: ${orderData.email}
Phone: ${orderData.phone}
Payment Method: ${orderData.paymentMethod}
Amount: $${orderData.amount}
Order Date: ${new Date(orderData.orderDate).toLocaleString()}

Note: Video will be delivered via email attachment to customer's email address.`,
      timestamp: new Date().toISOString()
    };

    // Store for demonstration (in production, this would send actual email)
    localStorage.setItem("lastNotification", JSON.stringify(notification));
    console.log("Order notification sent to devbooth1@yahoo.com and video@par3challenge.com", notification);
  };

  const sendCustomerConfirmation = async (orderData) => {
    const confirmation = {
      to: orderData.email,
      subject: "Video Order Confirmation - Par3 Challenge",
      body: `Thank you for your video order!
        
Order Details:
- Professional Par3 Challenge Video: $25.00
- Payment Method: ${orderData.paymentMethod}
- Order Date: ${new Date(orderData.orderDate).toLocaleString()}

Your video will be processed and delivered within 24 hours via email.

Thank you for playing Par3 Challenge!`,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem("lastCustomerConfirmation", JSON.stringify(confirmation));
    console.log("Customer confirmation sent", confirmation);
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-start p-2 sm:p-4"
      style={{ backgroundImage: "url('/golf-bg.jpg')" }}
    >
      <div className="max-w-md w-full bg-white/95 rounded-xl shadow-2xl p-4 sm:p-6 my-2">
        {/* Header - More Compact */}
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
            🎥 Video Order
          </h1>
          <div className="text-lg sm:text-xl font-bold text-purple-600 mb-1">
            $25.00
          </div>
          <p className="text-gray-600 text-xs sm:text-sm">
            Professional footage delivered by email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Player Name - Compact */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-900">
              Player Name
            </label>
            <input
              type="text"
              name="playerName"
              value={formData.playerName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          {/* Email & Phone in Grid on larger screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Phone number"
              />
            </div>
          </div>

          {/* Payment Method - Compact Design */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900">
              Payment Method
            </label>
            
            {/* Previous Payment - More Compact */}
            {isReturningPlayer && lastPaymentMethod && (
              <div className="mb-2">
                <label className="flex items-center p-3 border-2 border-emerald-300 bg-emerald-50 rounded-lg cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="same"
                    checked={paymentMethod === "same"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-emerald-600 mr-3"
                  />
                  <div>
                    <div className="font-semibold text-emerald-800 text-sm">
                      ✅ Use Previous Payment
                    </div>
                    <div className="text-xs text-emerald-700">
                      {lastPaymentMethod === "card" ? "Credit/Debit Card" : 
                       lastPaymentMethod === "apple-pay" ? "Apple Pay" : 
                       lastPaymentMethod === "google-pay" ? "Google Pay" :
                       lastPaymentMethod === "paypal" ? "PayPal" : lastPaymentMethod}
                    </div>
                  </div>
                </label>
              </div>
            )}

            {/* Payment Methods - Compact Grid Layout */}
            <div className="grid grid-cols-2 gap-2">
              {/* PayPal */}
              <label className="flex flex-col items-center p-3 border-2 border-gray-200 rounded-lg hover:border-purple-400 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-purple-600 mb-1"
                />
                <div className="text-center">
                  <div className="font-semibold text-xs">PayPal</div>
                  <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-1">
                    <path d="M13.7 7.5c.2-1.2 1.2-2.1 2.4-2.1h7.2c1.5 0 2.7 1.4 2.4 2.9l-2.1 11.2c-.2 1.2-1.2 2.1-2.4 2.1h-3.7c-.3 0-.6.2-.7.5l-1.1 5.7c-.1.4-.4.7-.8.7h-3.2c-.5 0-.9-.5-.8-1l3.4-17z" fill="#003087" />
                    <path d="M25.3 7.5c.2-1.2-1-2.3-2.2-2.3h-7.2c-1.2 0-2.2.9-2.4 2.1l-3.4 17c-.1.5.3 1 .8 1h3.2c.4 0 .7-.3.8-.7l1.1-5.7c.1-.3.4-.5.7-.5h3.7c1.2 0 2.2-.9 2.4-2.1l2.1-11.2z" fill="#009cde" />
                  </svg>
                </div>
              </label>

              {/* Card */}
              <label className="flex flex-col items-center p-3 border-2 border-gray-200 rounded-lg hover:border-purple-400 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-purple-600 mb-1"
                />
                <div className="text-center">
                  <div className="font-semibold text-xs">Card</div>
                  <div className="text-xl mt-1">💳</div>
                </div>
              </label>

              {/* Apple Pay */}
              <label className="flex flex-col items-center p-3 border-2 border-gray-200 rounded-lg hover:border-purple-400 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="apple-pay"
                  checked={paymentMethod === "apple-pay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-purple-600 mb-1"
                />
                <div className="text-center">
                  <div className="font-semibold text-xs">Apple Pay</div>
                  <div className="text-xl mt-1">🍎</div>
                </div>
              </label>

              {/* Google Pay */}
              <label className="flex flex-col items-center p-3 border-2 border-gray-200 rounded-lg hover:border-purple-400 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="google-pay"
                  checked={paymentMethod === "google-pay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-purple-600 mb-1"
                />
                <div className="text-center">
                  <div className="font-semibold text-xs">Google Pay</div>
                  <div className="text-xl mt-1">🔍</div>
                </div>
              </label>
            </div>

            {/* Card Verification - Compact */}
            {paymentMethod === "card" && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <button
                  type="button"
                  onClick={() => setCardApproved(true)}
                  className={`w-full px-4 py-2 rounded-lg font-semibold text-sm ${
                    cardApproved 
                      ? "bg-green-500 text-white cursor-default" 
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  disabled={cardApproved}
                >
                  {cardApproved ? "✓ Card Verified" : "Verify Card Payment"}
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all transform hover:scale-105 mt-4"
          >
            🎥 Order Video - $25.00
          </button>

          {/* Back Button - Smaller */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all text-sm"
          >
            ← Back
          </button>
        </form>
      </div>
    </div>
  );
}
