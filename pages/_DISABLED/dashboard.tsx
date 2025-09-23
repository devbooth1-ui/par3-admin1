// Only JS version is active. Disabled TSX and backup files.
// import React, { useState, useEffect } from 'react';

// export default function Dashboard() {
//     const [stats, setStats] = useState({
//         totalUsers: 1247,
//         activeBookings: 89,
//         revenue: 45870,
//         tournaments: 12
//     });

//     const [recentActivity, setRecentActivity] = useState([
//         { id: 1, user: 'John Smith', action: 'Booked Par 3 Challenge', time: '2 hours ago' },
//         { id: 2, user: 'Sarah Johnson', action: 'Completed Tournament', time: '4 hours ago' },
//         { id: 3, user: 'Mike Davis', action: 'Updated Profile', time: '6 hours ago' },
//         { id: 4, user: 'Lisa Wilson', action: 'Payment Processed', time: '8 hours ago' }
//     ]);

//     return (
//         <div className="min-h-screen bg-gray-100">
//             {/* Navigation */}
//             <nav className="bg-white shadow-lg">
//                 <div className="max-w-7xl mx-auto px-4">
//                     <div className="flex justify-between h-16">
//                         <div className="flex items-center">
//                             <h1 className="text-xl font-bold text-gray-800">PAR3 Admin Dashboard</h1>
//                         </div>
//                         <div className="flex items-center space-x-4">
//                             <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
//                             <a href="/claims" className="text-gray-600 hover:text-gray-900 font-medium">[1m[31m[4m[0m Claims</a>
//                             <a href="/settings" className="text-gray-600 hover:text-gray-900">Settings</a>
//                             <a href="/login" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</a>
//                         </div>
//                     </div>
//                 </div>
//             </nav>

//             {/* Main Content */}
//             <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//                 {/* Page Header */}
//                 <div className="mb-8">
//                     {/* ...existing code... */}
//                 </div>
//             </div>
//         </div>
//     );
// }
