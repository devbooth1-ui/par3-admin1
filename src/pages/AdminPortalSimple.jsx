import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/adminAPI';

function AdminPortal() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [claims, setClaims] = useState([]);
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });

    useEffect(() => {
        const adminSession = localStorage.getItem('adminSession');
        if (adminSession) {
            setIsLoggedIn(true);
            loadClaims();

            // Set up auto-refresh every 30 seconds to check for new claims
            const pollInterval = setInterval(() => {
                console.log('🔄 Auto-refreshing claims...');
                loadClaims();
            }, 30000); // 30 seconds

            return () => clearInterval(pollInterval);
        }

        // Listen for localStorage changes from other tabs/windows
        const handleStorageChange = (e) => {
            if (e.key === 'adminClaims') {
                console.log('Admin portal detected new claims!');
                loadClaims();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [isLoggedIn]);

    const login = (e) => {
        e.preventDefault();
        if (loginForm.email === 'admin@par3challenge.com' && loginForm.password === 'admin123') {
            localStorage.setItem('adminSession', 'true');
            setIsLoggedIn(true);
            loadClaims();
        } else {
            alert('Invalid credentials');
        }
    };

    const loadClaims = async () => {
        console.log('🔄 Loading claims...');

        // First try to fetch from backend
        try {
            const result = await adminAPI.getClaims();
            if (result.success && result.claims) {
                console.log('✅ Claims loaded from backend:', result.claims.length);
                setClaims(result.claims);
                // Save to localStorage for offline access
                localStorage.setItem('adminClaims', JSON.stringify(result.claims));
                return;
            }
        } catch (error) {
            console.log('❌ Backend fetch failed, trying local storage...');
        }

        // Fallback to localStorage and global claims
        const storedClaims = localStorage.getItem('adminClaims');
        const globalClaims = window.globalClaims || [];

        console.log('💾 localStorage adminClaims:', storedClaims);
        console.log('🌐 Global claims found:', globalClaims.length);

        if (storedClaims) {
            const parsedClaims = JSON.parse(storedClaims);
            console.log('📋 Using stored claims:', parsedClaims.length);
            setClaims(parsedClaims);
        } else if (globalClaims.length > 0) {
            console.log('📋 Using global claims:', globalClaims.length);
            setClaims(globalClaims);
            localStorage.setItem('adminClaims', JSON.stringify(globalClaims));
        } else {
            console.log('📋 No claims found anywhere, setting empty array');
            setClaims([]);
        }
    };

    const addTestClaim = (type) => {
        const newClaim = {
            id: Date.now().toString(),
            first_name: 'Test',
            last_name: 'Player',
            email: 'test@example.com',
            hole: Math.floor(Math.random() * 18) + 1,
            claim_type: type,
            status: 'pending',
            created_at: new Date().toISOString(),
            prize_amount: type === 'birdie' ? 6500 : 100000
        };

        const updatedClaims = [...claims, newClaim];
        setClaims(updatedClaims);
        localStorage.setItem('adminClaims', JSON.stringify(updatedClaims));
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-purple-900 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                    <h1 className="text-3xl font-bold text-center mb-8">🔧 Admin Portal</h1>

                    <form onSubmit={login} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                value={loginForm.email}
                                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                placeholder="admin@par3challenge.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <input
                                type="password"
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                placeholder="admin123"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg"
                        >
                            Login
                        </button>
                    </form>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm">
                        <p><strong>Demo Credentials:</strong></p>
                        <p>Email: admin@par3challenge.com</p>
                        <p>Password: admin123</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow p-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">🔧 PAR3 Admin Portal</h1>
                    <button
                        onClick={() => {
                            localStorage.removeItem('adminSession');
                            setIsLoggedIn(false);
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-100 p-4 rounded-lg">
                        <h3 className="font-bold">Total Claims</h3>
                        <p className="text-2xl">{claims.length}</p>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded-lg">
                        <h3 className="font-bold">Pending Claims</h3>
                        <p className="text-2xl">{claims.filter(c => c.status === 'pending').length}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h3 className="text-lg font-bold mb-4">Testing Tools</h3>
                    <div className="flex gap-4 flex-wrap">
                        <button
                            onClick={() => addTestClaim('birdie')}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Add Test Birdie
                        </button>
                        <button
                            onClick={() => addTestClaim('hole_in_one')}
                            className="bg-yellow-600 text-white px-4 py-2 rounded"
                        >
                            Add Test Hole-in-One
                        </button>
                        <button
                            onClick={loadClaims}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            🔄 Refresh Claims
                        </button>
                        <button
                            onClick={() => {
                                console.log('🐛 DEBUG INFO:');
                                console.log('Global claims:', window.globalClaims || []);
                                console.log('localStorage adminClaims:', localStorage.getItem('adminClaims'));
                                console.log('Current claims state:', claims);
                                alert(`Debug Info:\nGlobal: ${(window.globalClaims || []).length} claims\nLocalStorage: ${localStorage.getItem('adminClaims') ? JSON.parse(localStorage.getItem('adminClaims')).length : 0} claims\nState: ${claims.length} claims`);
                            }}
                            className="bg-purple-600 text-white px-4 py-2 rounded"
                        >
                            🐛 Debug Info
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b">
                        <h3 className="font-bold">Claims</h3>
                    </div>

                    {claims.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No claims yet. Submit some from the game or use the test buttons above.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-3 text-left">Player</th>
                                        <th className="p-3 text-left">Type</th>
                                        <th className="p-3 text-left">Hole</th>
                                        <th className="p-3 text-left">Prize</th>
                                        <th className="p-3 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {claims.map((claim) => (
                                        <tr key={claim.id} className="border-t">
                                            <td className="p-3">
                                                {claim.first_name} {claim.last_name}
                                                <br />
                                                <span className="text-sm text-gray-500">{claim.email}</span>
                                            </td>
                                            <td className="p-3">
                                                {claim.claim_type === 'hole_in_one' ? '🏆 Hole-in-One' : '🎯 Birdie'}
                                            </td>
                                            <td className="p-3">#{claim.hole}</td>
                                            <td className="p-3">${(claim.prize_amount / 100)}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded text-sm ${claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {claim.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminPortal;
