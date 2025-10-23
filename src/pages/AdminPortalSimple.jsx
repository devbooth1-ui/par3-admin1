import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/adminAPI';

function AdminPortal() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [claims, setClaims] = useState([]);
    const [courses, setCourses] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [activeTab, setActiveTab] = useState('courses'); // courses, customers, claims, emails
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [emailCampaign, setEmailCampaign] = useState({
        type: 'tournament',
        subject: '',
        message: '',
        targetAudience: 'all_players',
        scheduledDate: ''
    });
    const [emailStats, setEmailStats] = useState({
        totalPlayers: 0,
        tournamentPlayers: 0,
        recentPlayers: 0,
        coursePartners: 0,
        businessCustomers: 0
    });
    const [newCourse, setNewCourse] = useState({ 
        name: '', 
        location: '', 
        contact_name: '', 
        contact_email: '', 
        contact_phone: '', 
        pricing_model: 'standard',
        notes: '' 
    });
    const [newCustomer, setNewCustomer] = useState({ 
        company_name: '', 
        contact_name: '', 
        contact_email: '', 
        contact_phone: '', 
        customer_type: 'corporate',
        notes: '' 
    });
    const [editingCourse, setEditingCourse] = useState(null);
    const [editingCustomer, setEditingCustomer] = useState(null);

    useEffect(() => {
        const adminSession = localStorage.getItem('adminSession');
        if (adminSession) {
            setIsLoggedIn(true);
            loadAllData();

            // Set up auto-refresh every 30 seconds 
            const pollInterval = setInterval(() => {
                console.log('🔄 Auto-refreshing data...');
                loadAllData();
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
            loadAllData();
        } else {
            alert('Invalid credentials');
        }
    };

    const loadAllData = () => {
        loadClaims();
        loadCourses();
        loadCustomers();
    };

    const loadCourses = async () => {
        console.log('🏌️ Loading golf courses...');
        
        // Load from localStorage (no sample data - pure CRM)
        const storedCourses = localStorage.getItem('adminCourses');
        if (storedCourses) {
            setCourses(JSON.parse(storedCourses));
        } else {
            setCourses([]); // Start with empty CRM
        }
    };

    const loadCustomers = async () => {
        console.log('🏢 Loading other customers...');
        
        // Load from localStorage (no sample data - pure CRM)
        const storedCustomers = localStorage.getItem('adminCustomers');
        if (storedCustomers) {
            setCustomers(JSON.parse(storedCustomers));
        } else {
            setCustomers([]); // Start with empty CRM
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

    const addCourse = (e) => {
        e.preventDefault();
        const course = {
            id: Date.now().toString(),
            ...newCourse,
            status: 'active',
            created_at: new Date().toISOString()
        };
        
        const updatedCourses = [...courses, course];
        setCourses(updatedCourses);
        localStorage.setItem('adminCourses', JSON.stringify(updatedCourses));
        
        // Reset form
        setNewCourse({ 
            name: '', 
            location: '', 
            contact_name: '', 
            contact_email: '', 
            contact_phone: '', 
            pricing_model: 'standard',
            notes: '' 
        });
        
        alert('Golf course added successfully!');
    };

    const addCustomer = (e) => {
        e.preventDefault();
        const customer = {
            id: Date.now().toString(),
            ...newCustomer,
            status: 'active',
            created_at: new Date().toISOString()
        };
        
        const updatedCustomers = [...customers, customer];
        setCustomers(updatedCustomers);
        localStorage.setItem('adminCustomers', JSON.stringify(updatedCustomers));
        
        // Reset form
        setNewCustomer({ 
            company_name: '', 
            contact_name: '', 
            contact_email: '', 
            contact_phone: '', 
            customer_type: 'corporate',
            notes: '' 
        });
        
        alert('Customer added successfully!');
    };

    // Edit Course Functions
    const startEditingCourse = (course) => {
        setEditingCourse(course.id);
        setNewCourse(course);
    };

    const saveEditCourse = (e) => {
        e.preventDefault();
        const updatedCourses = courses.map(course => 
            course.id === editingCourse 
                ? { ...newCourse, id: editingCourse, updated_at: new Date().toISOString() }
                : course
        );
        setCourses(updatedCourses);
        localStorage.setItem('adminCourses', JSON.stringify(updatedCourses));
        
        // Reset form and editing state
        setEditingCourse(null);
        setNewCourse({ 
            name: '', 
            location: '', 
            contact_name: '', 
            contact_email: '', 
            contact_phone: '', 
            pricing_model: 'standard',
            notes: '' 
        });
        alert('Golf course updated successfully!');
    };

    const cancelEditCourse = () => {
        setEditingCourse(null);
        setNewCourse({ 
            name: '', 
            location: '', 
            contact_name: '', 
            contact_email: '', 
            contact_phone: '', 
            pricing_model: 'standard',
            notes: '' 
        });
    };

    const deleteCourse = (courseId) => {
        if (confirm('Are you sure you want to delete this golf course? This action cannot be undone.')) {
            const updatedCourses = courses.filter(course => course.id !== courseId);
            setCourses(updatedCourses);
            localStorage.setItem('adminCourses', JSON.stringify(updatedCourses));
            alert('Golf course deleted successfully!');
        }
    };

    // Edit Customer Functions
    const startEditingCustomer = (customer) => {
        setEditingCustomer(customer.id);
        setNewCustomer(customer);
    };

    const saveEditCustomer = (e) => {
        e.preventDefault();
        const updatedCustomers = customers.map(customer => 
            customer.id === editingCustomer 
                ? { ...newCustomer, id: editingCustomer, updated_at: new Date().toISOString() }
                : customer
        );
        setCustomers(updatedCustomers);
        localStorage.setItem('adminCustomers', JSON.stringify(updatedCustomers));
        
        // Reset form and editing state
        setEditingCustomer(null);
        setNewCustomer({ 
            company_name: '', 
            contact_name: '', 
            contact_email: '', 
            contact_phone: '', 
            customer_type: 'corporate',
            notes: '' 
        });
        alert('Customer updated successfully!');
    };

    const cancelEditCustomer = () => {
        setEditingCustomer(null);
        setNewCustomer({ 
            company_name: '', 
            contact_name: '', 
            contact_email: '', 
            contact_phone: '', 
            customer_type: 'corporate',
            notes: '' 
        });
    };

    const deleteCustomer = (customerId) => {
        if (confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
            const updatedCustomers = customers.filter(customer => customer.id !== customerId);
            setCustomers(updatedCustomers);
            localStorage.setItem('adminCustomers', JSON.stringify(updatedCustomers));
            alert('Customer deleted successfully!');
        }
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
                    <h1 className="text-2xl font-bold">🏢 PAR3 CRM & Admin Portal</h1>
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
                {/* Navigation Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('courses')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'courses' 
                                    ? 'border-green-500 text-green-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            🏌️ Golf Courses
                        </button>
                        <button
                            onClick={() => setActiveTab('customers')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'customers' 
                                    ? 'border-purple-500 text-purple-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            � Other Customers
                        </button>
                        <button
                            onClick={() => setActiveTab('claims')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'claims' 
                                    ? 'border-orange-500 text-orange-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            ⚙️ Player Claims Admin
                        </button>
                        <button
                            onClick={() => setActiveTab('emails')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'emails' 
                                    ? 'border-blue-500 text-blue-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            📧 Email Campaigns
                        </button>
                    </nav>
                </div>

                {/* Stats Overview - Changes based on active tab */}
                {activeTab === 'courses' && (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-green-100 p-4 rounded-lg">
                            <h3 className="font-bold">Total Courses</h3>
                            <p className="text-2xl">{courses.length}</p>
                        </div>
                        <div className="bg-blue-100 p-4 rounded-lg">
                            <h3 className="font-bold">Active Partnerships</h3>
                            <p className="text-2xl">{courses.filter(c => c.status === 'active').length}</p>
                        </div>
                        <div className="bg-yellow-100 p-4 rounded-lg">
                            <h3 className="font-bold">Premium Tier</h3>
                            <p className="text-2xl">{courses.filter(c => c.pricing_model === 'premium').length}</p>
                        </div>
                    </div>
                )}

                {activeTab === 'customers' && (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-purple-100 p-4 rounded-lg">
                            <h3 className="font-bold">Total Customers</h3>
                            <p className="text-2xl">{customers.length}</p>
                        </div>
                        <div className="bg-blue-100 p-4 rounded-lg">
                            <h3 className="font-bold">Corporate Clients</h3>
                            <p className="text-2xl">{customers.filter(c => c.customer_type === 'corporate').length}</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg">
                            <h3 className="font-bold">Vendors</h3>
                            <p className="text-2xl">{customers.filter(c => c.customer_type === 'vendor').length}</p>
                        </div>
                    </div>
                )}

                {activeTab === 'claims' && (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-orange-100 p-4 rounded-lg">
                            <h3 className="font-bold">Total Claims</h3>
                            <p className="text-2xl">{claims.length}</p>
                        </div>
                        <div className="bg-yellow-100 p-4 rounded-lg">
                            <h3 className="font-bold">Pending Claims</h3>
                            <p className="text-2xl">{claims.filter(c => c.status === 'pending').length}</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg">
                            <h3 className="font-bold">Approved Claims</h3>
                            <p className="text-2xl">{claims.filter(c => c.status === 'approved').length}</p>
                        </div>
                    </div>
                )}

                {activeTab === 'emails' && (
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-100 p-4 rounded-lg">
                            <h3 className="font-bold">Total Recipients</h3>
                            <p className="text-2xl">{emailStats.totalPlayers + emailStats.coursePartners + emailStats.businessCustomers}</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg">
                            <h3 className="font-bold">Tournament Players</h3>
                            <p className="text-2xl">{emailStats.tournamentPlayers}</p>
                        </div>
                        <div className="bg-purple-100 p-4 rounded-lg">
                            <h3 className="font-bold">Course Partners</h3>
                            <p className="text-2xl">{courses.length}</p>
                        </div>
                        <div className="bg-yellow-100 p-4 rounded-lg">
                            <h3 className="font-bold">Business Customers</h3>
                            <p className="text-2xl">{customers.length}</p>
                        </div>
                    </div>
                )}

                {/* GOLF COURSES TAB CONTENT - CRM */}
                {/* PLAYER CLAIMS TAB CONTENT - ADMIN ONLY (NOT CRM) */}
                {activeTab === 'claims' && (
                    <>
                        <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-6">
                            <p className="text-orange-800 text-sm">
                                <strong>Note:</strong> This is administrative functionality for game operations, not CRM.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow mb-6">
                            <h3 className="text-lg font-bold mb-4">⚙️ Player Claims Administration</h3>
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
                                    onClick={async () => {
                                        try {
                                            console.log('🔧 Testing API connection...');
                                            const response = await fetch('https://par3-admin1.vercel.app/api/health');
                                            const result = await response.json();
                                            alert(`✅ API Status: ${result.message}\nPlayers: ${result.stats.players}\nClaims: ${result.stats.claims}`);
                                        } catch (error) {
                                            alert(`❌ API Error: ${error.message}`);
                                        }
                                    }}
                                    className="bg-purple-600 text-white px-4 py-2 rounded"
                                >
                                    🔧 Test API
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow">
                            <div className="p-4 border-b bg-orange-50">
                                <h3 className="font-bold text-orange-800">⚙️ Player Claims (Game Administration)</h3>
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
                    </>
                )}

                {activeTab === 'courses' && (
                    <>
                        <div className="bg-white p-6 rounded-lg shadow mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">
                                    🏌️ {editingCourse ? 'Edit Golf Course Partner' : 'Add New Golf Course Partner'}
                                </h3>
                                <button
                                    onClick={() => {
                                        if (confirm('Clear all golf course data? This cannot be undone!')) {
                                            setCourses([]);
                                            localStorage.removeItem('adminCourses');
                                            alert('All golf course data cleared!');
                                        }
                                    }}
                                    className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
                                >
                                    🗑️ Clear All Courses
                                </button>
                            </div>
                            <form onSubmit={editingCourse ? saveEditCourse : addCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Course Name</label>
                                    <input
                                        type="text"
                                        value={newCourse.name}
                                        onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="Pebble Beach Golf Links"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Location</label>
                                    <input
                                        type="text"
                                        value={newCourse.location}
                                        onChange={(e) => setNewCourse({...newCourse, location: e.target.value})}
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="Pebble Beach, CA"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Contact Name</label>
                                    <input
                                        type="text"
                                        value={newCourse.contact_name}
                                        onChange={(e) => setNewCourse({...newCourse, contact_name: e.target.value})}
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="John Smith"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Contact Email</label>
                                    <input
                                        type="email"
                                        value={newCourse.contact_email}
                                        onChange={(e) => setNewCourse({...newCourse, contact_email: e.target.value})}
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="manager@golfcourse.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Contact Phone</label>
                                    <input
                                        type="tel"
                                        value={newCourse.contact_phone}
                                        onChange={(e) => setNewCourse({...newCourse, contact_phone: e.target.value})}
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="+1 555-123-4567"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Pricing Model</label>
                                    <select
                                        value={newCourse.pricing_model}
                                        onChange={(e) => setNewCourse({...newCourse, pricing_model: e.target.value})}
                                        className="w-full p-3 border rounded-lg"
                                    >
                                        <option value="standard">Standard</option>
                                        <option value="premium">Premium</option>
                                        <option value="custom">Custom</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2">Notes</label>
                                    <textarea
                                        value={newCourse.notes}
                                        onChange={(e) => setNewCourse({...newCourse, notes: e.target.value})}
                                        className="w-full p-3 border rounded-lg"
                                        rows="3"
                                        placeholder="Partnership details, special arrangements..."
                                    />
                                </div>
                                <div className="md:col-span-2 flex gap-4">
                                    <button
                                        type="submit"
                                        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
                                    >
                                        {editingCourse ? 'Update Golf Course' : 'Add Golf Course'}
                                    </button>
                                    {editingCourse && (
                                        <button
                                            type="button"
                                            onClick={cancelEditCourse}
                                            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="bg-white rounded-lg shadow">
                            <div className="p-4 border-b bg-green-50">
                                <h3 className="font-bold text-green-800">🏌️ Golf Course Partners (CRM)</h3>
                            </div>

                            {courses.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    No golf courses added yet. Add your first course partner above.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="p-3 text-left">Course Name</th>
                                                <th className="p-3 text-left">Location</th>
                                                <th className="p-3 text-left">Contact</th>
                                                <th className="p-3 text-left">Pricing</th>
                                                <th className="p-3 text-left">Status</th>
                                                <th className="p-3 text-left">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {courses.map((course) => (
                                                <tr key={course.id} className="border-t">
                                                    <td className="p-3 font-semibold">{course.name}</td>
                                                    <td className="p-3">{course.location}</td>
                                                    <td className="p-3">
                                                        {course.contact_name}
                                                        <br />
                                                        <span className="text-sm text-gray-500">{course.contact_email}</span>
                                                    </td>
                                                    <td className="p-3">
                                                        <span className={`px-2 py-1 rounded text-sm ${
                                                            course.pricing_model === 'premium' ? 'bg-gold-100 text-gold-800' : 
                                                            course.pricing_model === 'custom' ? 'bg-purple-100 text-purple-800' :
                                                            'bg-blue-100 text-blue-800'
                                                        }`}>
                                                            {course.pricing_model}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">
                                                        <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-800">
                                                            {course.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => startEditingCourse(course)}
                                                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                                            >
                                                                ✏️ Edit
                                                            </button>
                                                            <button
                                                                onClick={() => deleteCourse(course.id)}
                                                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                                            >
                                                                🗑️ Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* OTHER CUSTOMERS TAB CONTENT - CRM */}
                {activeTab === 'customers' && (
                    <>
                        <div className="bg-white p-6 rounded-lg shadow mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">
                                    🏢 {editingCustomer ? 'Edit Business Customer' : 'Add New Business Customer'}
                                </h3>
                                <button
                                    onClick={() => {
                                        if (confirm('Clear all customer data? This cannot be undone!')) {
                                            setCustomers([]);
                                            localStorage.removeItem('adminCustomers');
                                            alert('All customer data cleared!');
                                        }
                                    }}
                                    className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
                                >
                                    🗑️ Clear All Customers
                                </button>
                            </div>
                            <form onSubmit={editingCustomer ? saveEditCustomer : addCustomer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Company Name</label>
                                    <input
                                        type="text"
                                        value={newCustomer.company_name}
                                        onChange={(e) => setNewCustomer({...newCustomer, company_name: e.target.value})}
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="ABC Corporation"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Customer Type</label>
                                    <select
                                        value={newCustomer.customer_type}
                                        onChange={(e) => setNewCustomer({...newCustomer, customer_type: e.target.value})}
                                        className="w-full p-3 border rounded-lg"
                                    >
                                        <option value="corporate">Corporate Client</option>
                                        <option value="vendor">Vendor/Supplier</option>
                                        <option value="partner">Business Partner</option>
                                        <option value="service">Service Provider</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Contact Name</label>
                                    <input
                                        type="text"
                                        value={newCustomer.contact_name}
                                        onChange={(e) => setNewCustomer({...newCustomer, contact_name: e.target.value})}
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="Jane Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Contact Email</label>
                                    <input
                                        type="email"
                                        value={newCustomer.contact_email}
                                        onChange={(e) => setNewCustomer({...newCustomer, contact_email: e.target.value})}
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="jane@company.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Contact Phone</label>
                                    <input
                                        type="tel"
                                        value={newCustomer.contact_phone}
                                        onChange={(e) => setNewCustomer({...newCustomer, contact_phone: e.target.value})}
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="+1 555-987-6543"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2">Notes</label>
                                    <textarea
                                        value={newCustomer.notes}
                                        onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                                        className="w-full p-3 border rounded-lg"
                                        rows="3"
                                        placeholder="Relationship details, special requirements..."
                                    />
                                </div>
                                <div className="md:col-span-2 flex gap-4">
                                    <button
                                        type="submit"
                                        className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold"
                                    >
                                        {editingCustomer ? 'Update Customer' : 'Add Customer'}
                                    </button>
                                    {editingCustomer && (
                                        <button
                                            type="button"
                                            onClick={cancelEditCustomer}
                                            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="bg-white rounded-lg shadow">
                            <div className="p-4 border-b bg-purple-50">
                                <h3 className="font-bold text-purple-800">🏢 Business Customer Directory (CRM)</h3>
                            </div>

                            {customers.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    No customers added yet. Add your first customer above.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="p-3 text-left">Company</th>
                                                <th className="p-3 text-left">Type</th>
                                                <th className="p-3 text-left">Contact</th>
                                                <th className="p-3 text-left">Phone</th>
                                                <th className="p-3 text-left">Status</th>
                                                <th className="p-3 text-left">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {customers.map((customer) => (
                                                <tr key={customer.id} className="border-t">
                                                    <td className="p-3 font-semibold">{customer.company_name}</td>
                                                    <td className="p-3">
                                                        <span className={`px-2 py-1 rounded text-sm ${
                                                            customer.customer_type === 'corporate' ? 'bg-blue-100 text-blue-800' :
                                                            customer.customer_type === 'vendor' ? 'bg-green-100 text-green-800' :
                                                            customer.customer_type === 'partner' ? 'bg-purple-100 text-purple-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {customer.customer_type}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">
                                                        {customer.contact_name}
                                                        <br />
                                                        <span className="text-sm text-gray-500">{customer.contact_email}</span>
                                                    </td>
                                                    <td className="p-3">{customer.contact_phone}</td>
                                                    <td className="p-3">
                                                        <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-800">
                                                            {customer.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => startEditingCustomer(customer)}
                                                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                                            >
                                                                ✏️ Edit
                                                            </button>
                                                            <button
                                                                onClick={() => deleteCustomer(customer.id)}
                                                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                                            >
                                                                🗑️ Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* EMAIL CAMPAIGNS TAB CONTENT */}
                {activeTab === 'emails' && (
                    <>
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                            <p className="text-blue-800 text-sm">
                                <strong>Email Campaign Center:</strong> Send targeted emails to players, course partners, and business customers.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow mb-6">
                            <h3 className="text-lg font-bold mb-4">📧 Create Email Campaign</h3>
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Campaign Type</label>
                                    <select
                                        value={emailCampaign.type}
                                        onChange={(e) => setEmailCampaign({...emailCampaign, type: e.target.value})}
                                        className="w-full p-3 border rounded-lg"
                                    >
                                        <option value="tournament">Tournament Update</option>
                                        <option value="specials">Course Specials</option>
                                        <option value="newsletter">Weekly Newsletter</option>
                                        <option value="event">Special Event</option>
                                        <option value="reminder">Claim Reminder</option>
                                        <option value="custom">Custom Campaign</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Target Audience</label>
                                    <select
                                        value={emailCampaign.targetAudience}
                                        onChange={(e) => setEmailCampaign({...emailCampaign, targetAudience: e.target.value})}
                                        className="w-full p-3 border rounded-lg"
                                    >
                                        <option value="all_players">All Players</option>
                                        <option value="tournament_qualified">Tournament Qualified Players</option>
                                        <option value="recent_players">Recent Players (30 days)</option>
                                        <option value="high_value">High Value Players ($100+)</option>
                                        <option value="pending_claims">Players with Pending Claims</option>
                                        <option value="course_partners">Golf Course Partners</option>
                                        <option value="business_customers">Business Customers</option>
                                        <option value="all_contacts">All Contacts</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2">Subject Line</label>
                                    <input
                                        type="text"
                                        value={emailCampaign.subject}
                                        onChange={(e) => setEmailCampaign({...emailCampaign, subject: e.target.value})}
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="Enter email subject line..."
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2">Email Message</label>
                                    <textarea
                                        value={emailCampaign.message}
                                        onChange={(e) => setEmailCampaign({...emailCampaign, message: e.target.value})}
                                        className="w-full p-3 border rounded-lg"
                                        rows="8"
                                        placeholder="Enter your email message here..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Schedule Date (Optional)</label>
                                    <input
                                        type="datetime-local"
                                        value={emailCampaign.scheduledDate}
                                        onChange={(e) => setEmailCampaign({...emailCampaign, scheduledDate: e.target.value})}
                                        className="w-full p-3 border rounded-lg"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // Preview functionality
                                            alert(`Preview Email Campaign:\n\nTo: ${emailCampaign.targetAudience}\nSubject: ${emailCampaign.subject}\n\n${emailCampaign.message}`);
                                        }}
                                        className="bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold mr-2"
                                    >
                                        📄 Preview
                                    </button>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            // Send email functionality
                                            if (!emailCampaign.subject || !emailCampaign.message) {
                                                alert('Please fill in both subject and message fields.');
                                                return;
                                            }
                                            
                                            const confirmSend = confirm(`Send email campaign to ${emailCampaign.targetAudience}?\n\nSubject: ${emailCampaign.subject}`);
                                            if (confirmSend) {
                                                // Integrate with actual email service
                                                try {
                                                    const response = await fetch('https://par3-admin1.vercel.app/api/email/send', {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json'
                                                        },
                                                        body: JSON.stringify({ campaign: emailCampaign })
                                                    });
                                                    
                                                    if (response.ok) {
                                                        const result = await response.json();
                                                        console.log('📧 Email campaign sent successfully:', result);
                                                        alert('✅ Email campaign sent successfully!');
                                                    } else {
                                                        throw new Error('Failed to send campaign');
                                                    }
                                                } catch (error) {
                                                    console.log('📧 Sending via demo mode:', emailCampaign);
                                                    alert('📧 Email campaign queued! (Demo mode - would integrate with actual email service)');
                                                }
                                                
                                                // Reset form
                                                setEmailCampaign({
                                                    type: 'tournament',
                                                    subject: '',
                                                    message: '',
                                                    targetAudience: 'all_players',
                                                    scheduledDate: ''
                                                });
                                            }
                                        }}
                                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
                                    >
                                        📧 Send Campaign
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Email Templates Section */}
                        <div className="bg-white rounded-lg shadow mb-6">
                            <div className="p-4 border-b bg-blue-50">
                                <h3 className="font-bold text-blue-800">📝 Quick Email Templates</h3>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                                     onClick={() => setEmailCampaign({
                                         ...emailCampaign,
                                         type: 'tournament',
                                         subject: '🏆 Million Dollar Tournament Update!',
                                         message: 'Dear [Player Name],\n\nExciting news about our upcoming $1 Million Tournament!\n\n• Tournament Date: March 16, 2026\n• Location: Orlando, Florida\n• Current Qualification: [Points] points\n\nKeep playing to secure your spot!\n\nBest regards,\nPar3 Challenge Team'
                                     })}>
                                    <h4 className="font-semibold text-green-600">Tournament Update</h4>
                                    <p className="text-sm text-gray-600 mt-2">Send updates about the million dollar tournament</p>
                                </div>

                                <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                                     onClick={() => setEmailCampaign({
                                         ...emailCampaign,
                                         type: 'specials',
                                         subject: '⛳ Special Offers at [Course Name]',
                                         message: 'Hello [Player Name],\n\nExclusive specials available at your favorite golf course!\n\n🍔 19th Hole Burger + Drink – $12\n⛳ Range Balls (Large) – $8\n🧢 Pro Shop: 15% off hats\n\nValid this week only!\n\nHappy Golfing!'
                                     })}>
                                    <h4 className="font-semibold text-blue-600">Course Specials</h4>
                                    <p className="text-sm text-gray-600 mt-2">Promote current course offers and specials</p>
                                </div>

                                <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                                     onClick={() => setEmailCampaign({
                                         ...emailCampaign,
                                         type: 'newsletter',
                                         subject: '📰 Par3 Challenge Weekly Newsletter',
                                         message: 'Hi [Player Name],\n\nThis Week in Par3 Challenge:\n\n🏆 New Tournament Qualifiers: [Count]\n💰 Total Prizes Won: $[Amount]\n⭐ Course Spotlight: [Course Name]\n📊 Your Stats: [Rounds] rounds, [Points] points\n\nKeep playing and good luck!\n\nThe Par3 Team'
                                     })}>
                                    <h4 className="font-semibold text-purple-600">Weekly Newsletter</h4>
                                    <p className="text-sm text-gray-600 mt-2">Regular updates and player engagement</p>
                                </div>
                            </div>
                        </div>

                        {/* Campaign History */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-4 border-b bg-blue-50">
                                <h3 className="font-bold text-blue-800">📈 Campaign History</h3>
                            </div>
                            <div className="p-6">
                                <div className="text-center text-gray-500 py-8">
                                    <p className="text-lg mb-2">📧 No campaigns sent yet</p>
                                    <p>Create your first email campaign above to engage with your audience!</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default AdminPortal;
