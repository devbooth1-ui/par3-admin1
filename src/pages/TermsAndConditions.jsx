import React from "react";
import { useNavigate } from "react-router-dom";

export default function TermsAndConditions() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <img src="/par3logo.png" alt="Par3 Challenge Logo" className="w-32 h-auto mx-auto mb-4" />
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Terms and Conditions</h1>
                        <p className="text-gray-600">Par3 Challenge Official Rules and Regulations</p>
                        <p className="text-sm text-gray-500 mt-2">Last Updated: September 2025</p>
                    </div>

                    {/* Terms Content */}
                    <div className="space-y-8 text-gray-700">
                        
                        {/* Game Rules & Verification */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-green-500 pb-2">
                                🏌️ Game Rules & Verification
                            </h2>
                            <div className="space-y-4">
                                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                                    <h3 className="font-bold text-yellow-800 mb-2">One Shot Per Golfer Verification Policy</h3>
                                    <p>Each golfer is permitted <strong>one (1) official shot attempt</strong> per game session for prize verification purposes.</p>
                                </div>
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                                    <h3 className="font-bold text-blue-800 mb-2">AI Technology & Facial Recognition</h3>
                                    <p>Par3 Challenge utilizes advanced artificial intelligence, facial recognition technology, and machine learning algorithms to:</p>
                                    <ul className="list-disc ml-6 mt-2 space-y-1">
                                        <li>Verify player identity and prevent fraud</li>
                                        <li>Analyze game performance and shot accuracy</li>
                                        <li>Ensure fair play and legitimate prize claims</li>
                                        <li>Enhance user experience through personalized features</li>
                                    </ul>
                                    <p className="mt-2 text-sm">By participating, you consent to the capture and processing of your biometric data for verification purposes.</p>
                                </div>
                            </div>
                        </section>

                        {/* Prize Claims & Penalties */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-red-500 pb-2">
                                ⚖️ Prize Claims & Anti-Fraud Policy
                            </h2>
                            <div className="space-y-4">
                                                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                                    <h3 className="font-bold text-blue-800 mb-2">🏌️ Amateur Golfers Only</h3>
                                    <p><strong>Par3 Challenge is exclusively for amateur status golfers.</strong> Participants must be 18+ years of age or have parental/guardian consent.</p>
                                    <p className="mt-3"><strong>EXCLUDED FROM PARTICIPATION:</strong></p>
                                    <ul className="list-disc ml-6 mt-2 space-y-1">
                                        <li>Par3 Challenge employees, contractors, and immediate family members</li>
                                        <li>Golf course/club employees and their immediate family members</li>
                                        <li>Tournament officials and event organizers</li>
                                    </ul>
                                    <p className="mt-3 text-sm text-blue-700"><strong>Note:</strong> Amateur status determination is at the sole discretion of Par3 Challenge management.</p>
                                </div>
                                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                                    <h3 className="font-bold text-orange-800 mb-2">Verification Process</h3>
                                    <p>All prize claims are subject to thorough verification including but not limited to:</p>
                                    <ul className="list-disc ml-6 mt-2 space-y-1">
                                        <li>Video review and shot analysis</li>
                                        <li>Identity verification through government-issued ID</li>
                                        <li>Cross-reference with AI and facial recognition systems</li>
                                        <li>Witness statements and facility records</li>
                                        <li>Background checks for high-value prizes</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Tax Requirements */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-green-500 pb-2">
                                💰 Tax Obligations & Reporting
                            </h2>
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                                <h3 className="font-bold text-green-800 mb-2">IRS Reporting Requirements</h3>
                                <p>In accordance with IRS regulations:</p>
                                <ul className="list-disc ml-6 mt-2 space-y-2">
                                    <li><strong>Prizes valued at $600 or more</strong> require mandatory reporting to state and federal tax authorities</li>
                                    <li>Form 1099-MISC will be electronically filed and emailed to winners at their registered email address</li>
                                    <li>Winners are responsible for all applicable federal, state, and local taxes</li>
                                    <li>Tax withholding may be required for certain prize amounts</li>
                                    <li>Social Security Number (SSN) or Tax Identification Number (TIN) required for prize claims over $600</li>
                                </ul>
                                <div className="mt-3 p-3 bg-yellow-100 rounded-lg">
                                    <p className="text-sm text-yellow-800"><strong>Important:</strong> Consult with a tax professional regarding your specific tax obligations. Par3 Challenge is not responsible for providing tax advice.</p>
                                </div>
                            </div>
                        </section>

                        {/* Intellectual Property */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-500 pb-2">
                                📋 Intellectual Property & Copyright
                            </h2>
                            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                                <h3 className="font-bold text-purple-800 mb-2">Protected Property</h3>
                                <p>The following are protected by copyright, trademark, and intellectual property laws:</p>
                                <ul className="list-disc ml-6 mt-2 space-y-1">
                                    <li><strong>"Par3 Challenge"</strong> name and all variations</li>
                                    <li>Par3 Challenge logo, designs, and branding materials</li>
                                    <li>Game mechanics, processes, and unique gameplay concepts</li>
                                    <li>Payment processing systems and software</li>
                                    <li>Scoring algorithms and prize distribution methods</li>
                                    <li>Mobile application and digital platform technologies</li>
                                </ul>
                                <p className="mt-3"><strong>Copyright © 2025 Par3 Challenge, Devereaux Booth, et al.</strong></p>
                                <p className="mt-2 text-sm">All rights reserved. Unauthorized use, reproduction, or distribution is strictly prohibited and may result in legal action.</p>
                            </div>
                        </section>

                        {/* Additional Terms */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
                                📜 Additional Terms & Conditions
                            </h2>
                            <div className="space-y-4">
                                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                                    <h3 className="font-bold text-green-800 mb-2">Not a Gambling Site</h3>
                                    <p><strong>Par3 Challenge is NOT a gambling establishment.</strong> This is a skill-based golf challenge game where prizes are awarded based on athletic performance and golf skill. Participants pay for the golf experience and entertainment, with prizes awarded for achieving specific golf shots (hole-in-one, birdie, etc.). No element of chance determines the outcome - success is based entirely on golf skill and performance.</p>
                                </div>
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                                    <h3 className="font-bold text-blue-800 mb-2">🏌️ Amateur Golfers Only</h3>
                                    <p><strong>Par3 Challenge is exclusively for amateur status golfers.</strong> Participants must be 18+ years of age or have parental/guardian consent.</p>
                                    <p className="mt-3"><strong>EXCLUDED FROM PARTICIPATION:</strong></p>
                                    <ul className="list-disc ml-6 mt-2 space-y-1">
                                        <li>Par3 Challenge employees, contractors, and immediate family members</li>
                                        <li>Golf course/club employees and their immediate family members</li>
                                        <li>Tournament officials and event organizers</li>
                                    </ul>
                                    <p className="mt-3 text-sm text-blue-700"><strong>Note:</strong> Amateur status determination is at the sole discretion of Par3 Challenge management.</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-bold mb-2">Prize Limitations</h3>
                                    <p>Prizes are non-transferable, non-refundable, and cannot be exchanged for cash except as required by law. Prize availability subject to change without notice.</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-bold mb-2">Liability Waiver</h3>
                                    <p>Participants assume all risks associated with gameplay. Par3 Challenge, its officers, employees, and affiliates are not liable for injuries, damages, or losses incurred during participation.</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-bold mb-2">Governing Law</h3>
                                    <p>These terms are governed by the laws of the state where the game is played. Any disputes will be resolved through binding arbitration.</p>
                                </div>
                            </div>
                        </section>

                        {/* Contact Information */}
                        <section className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p><strong>Par3 Challenge</strong></p>
                                <p>Email: <a href="mailto:devbooth1@yahoo.com" className="text-blue-600 hover:text-blue-800">devbooth1@yahoo.com</a></p>
                                <p className="mt-2 text-sm text-gray-600">
                                    For questions regarding these terms, prize claims, or technical support, please contact us using the information above.
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 pt-6 border-t text-center space-y-4">
                        <p className="text-sm text-gray-600 mb-4">
                            By participating in Par3 Challenge, you acknowledge that you have read, understood, and agree to these Terms and Conditions.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                            >
                                ← Back
                            </button>
                            <button
                                onClick={() => {
                                    // Auto-accept terms when user clicks "Accept & Continue"
                                    localStorage.setItem("termsAccepted", "true");
                                    // Navigate back to login page
                                    navigate("/login");
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                            >
                                Accept & Continue to Game
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
