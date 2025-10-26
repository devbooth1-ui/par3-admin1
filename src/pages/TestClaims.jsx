import React, { useState } from 'react';
import { adminAPI } from '../utils/adminAPI';

export default function TestClaims() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lastResult, setLastResult] = useState(null);
    const [formData, setFormData] = useState({
        firstName: 'Test',
        lastName: 'Player',
        email: 'test@par3challenge.com',
        phone: '555-0123',
        hole: '1'
    });

    const submitTestBirdie = async () => {
        setIsSubmitting(true);
        try {
            const result = await adminAPI.submitBirdieClaim(formData);
            setLastResult({ type: 'birdie', result });
            console.log('Birdie claim result:', result);
        } catch (error) {
            setLastResult({ type: 'birdie', error: error.message });
            console.error('Error submitting birdie:', error);
        }
        setIsSubmitting(false);
    };

    const submitTestHoleInOne = async () => {
        setIsSubmitting(true);
        try {
            const result = await adminAPI.submitHoleInOneClaim(formData, 'card');
            setLastResult({ type: 'hole_in_one', result });
            console.log('Hole-in-one claim result:', result);
        } catch (error) {
            setLastResult({ type: 'hole_in_one', error: error.message });
            console.error('Error submitting hole-in-one:', error);
        }
        setIsSubmitting(false);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-green-800 p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-6">
                <h1 className="text-3xl font-bold mb-6 text-center text-green-800">
                    🧪 Test Claims System
                </h1>

                {/* Player Data Form */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Player Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="p-2 border rounded-lg"
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="p-2 border rounded-lg"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="p-2 border rounded-lg"
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="p-2 border rounded-lg"
                        />
                        <select
                            name="hole"
                            value={formData.hole}
                            onChange={handleInputChange}
                            className="p-2 border rounded-lg col-span-2"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(hole => (
                                <option key={hole} value={hole.toString()}>Hole {hole}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Test Buttons */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={submitTestBirdie}
                        disabled={isSubmitting}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-all"
                    >
                        {isSubmitting ? 'Submitting...' : '🎯 Test Birdie Claim'}
                    </button>
                    <button
                        onClick={submitTestHoleInOne}
                        disabled={isSubmitting}
                        className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-all"
                    >
                        {isSubmitting ? 'Submitting...' : '🏆 Test Hole-in-One Claim'}
                    </button>
                </div>

                {/* Last Result Display */}
                {lastResult && (
                    <div className="p-4 bg-gray-100 rounded-lg">
                        <h3 className="font-semibold mb-2">Last Submission Result:</h3>
                        <div className="bg-white p-3 rounded border">
                            <p><strong>Type:</strong> {lastResult.type}</p>
                            {lastResult.error ? (
                                <p className="text-red-600"><strong>Error:</strong> {lastResult.error}</p>
                            ) : (
                                <pre className="text-sm text-green-600 mt-2 overflow-auto">
                                    {JSON.stringify(lastResult.result, null, 2)}
                                </pre>
                            )}
                        </div>
                    </div>
                )}

                {/* Quick Links */}
                <div className="mt-8 text-center space-y-2">
                    <p className="text-gray-600">Quick Links:</p>
                    <div className="flex gap-4 justify-center">
                        <a
                            href="/admin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all"
                        >
                            🔧 Admin Portal
                        </a>
                        <a
                            href="/"
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all"
                        >
                            🏠 Home
                        </a>
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm">
                    <h4 className="font-semibold mb-2">📋 Testing Instructions:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-gray-700">
                        <li>Fill in player information above</li>
                        <li>Click either "Test Birdie Claim" or "Test Hole-in-One Claim"</li>
                        <li>Check the result below</li>
                        <li>Open the Admin Portal to verify the claim appears</li>
                        <li>Login with: admin@par3challenge.com / admin123</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
