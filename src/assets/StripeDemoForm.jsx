import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Replace with your Stripe publishable key
const stripePromise = loadStripe("pk_test_12345");

function CheckoutForm({ onApproved }) {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [success, setSuccess] = React.useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);
        setError(null);
        setSuccess(false);
        // This is a demo: in production, fetch clientSecret from your backend
        // Here, payment will always fail (no backend)
        setTimeout(() => {
            setProcessing(false);
            setSuccess(true);
            if (onApproved) onApproved();
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-black/40 p-6 rounded-xl flex flex-col gap-4">
            <CardElement className="bg-white rounded p-2" options={{ hidePostalCode: true }} />
            <button
                type="submit"
                disabled={!stripe || processing}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full mt-2"
            >
                {processing ? "Processing..." : "Pay $8.00"}
            </button>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-400 text-sm">Payment simulated! (No backend yet)</div>}
        </form>
    );
}

export default function StripeDemoForm({ onApproved }) {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm onApproved={onApproved} />
        </Elements>
    );
}