import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { parse } from 'cookie';
import { GetServerSideProps } from 'next';

// Block navigation data
const pages = [
	{
		name: 'Claims',
		href: '/claims',
		color: 'from-pink-500 to-yellow-400',
		icon: '🏆',
		description: 'Manage and verify prize claims.',
	},
	{
		name: 'Courses',
		href: '/courses',
		color: 'from-green-400 to-blue-500',
		icon: '⛳',
		description: 'View and edit course details.',
	},
	{
		name: 'CRM',
		href: '/crm',
		color: 'from-blue-500 to-indigo-500',
		icon: '👥',
		description: 'Customer relationship management.',
	},
	{
		name: 'Accounting',
		href: '/accounting',
		color: 'from-yellow-400 to-orange-500',
		icon: '💰',
		description: 'Financial reports and transactions.',
	},
	{
		name: 'Events',
		href: '/events',
		color: 'from-purple-500 to-pink-500',
		icon: '📅',
		description: 'Create and manage events.',
	},
	{
		name: 'Notifications',
		href: '/notifications',
		color: 'from-red-400 to-pink-400',
		icon: '🔔',
		description: 'Send and review notifications.',
	},
	{
		name: 'Settings',
		href: '/settings',
		color: 'from-gray-500 to-gray-700',
		icon: '⚙️',
		description: 'Admin and system settings.',
	},
	{
		name: 'Specials',
		href: '/specials',
		color: 'from-yellow-300 to-pink-300',
		icon: '⭐',
		description: 'Add and manage special offers.',
	},
	{
		name: 'Verification',
		href: '/verification',
		color: 'from-green-300 to-blue-300',
		icon: '✅',
		description: 'User verification and KYC.',
	},
	{
		name: 'Tournaments',
		href: '/tournaments',
		color: 'from-indigo-400 to-purple-500',
		icon: '🏆',
		description: 'View and manage tournaments.',
	},
];

// Example stats data (replace with API call if needed)
const stats = [
	{ label: 'Total Users', value: 1247, icon: '👤', color: 'bg-blue-100 text-blue-600' },
	{ label: 'Active Bookings', value: 89, icon: '📅', color: 'bg-green-100 text-green-600' },
	{ label: 'Revenue ($)', value: 45870, icon: '💰', color: 'bg-yellow-100 text-yellow-600' },
	{ label: 'Tournaments', value: 12, icon: '🏌️‍♂️', color: 'bg-purple-100 text-purple-600' },
];

// Example recent activity data (replace with API call if needed)
const recentActivity = [
	{ id: 1, user: 'John Smith', action: 'Booked Par 3 Challenge', time: '2 hours ago' },
	{ id: 2, user: 'Sarah Johnson', action: 'Completed Tournament', time: '4 hours ago' },
	{ id: 3, user: 'Mike Davis', action: 'Updated Profile', time: '6 hours ago' },
	{ id: 4, user: 'Lisa Wilson', action: 'Payment Processed', time: '8 hours ago' }
];

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { req, res: _res } = context;
	const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
	const token = cookies.adminToken;

	// You can add more robust token validation here if needed
	if (!token) {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		};
	}

	return { props: {} };
};

export default function Dashboard() {
	const { user, loading } = useAuth();
	const router = useRouter();
	const [hydrated, setHydrated] = React.useState(false);

	useEffect(() => {
		setHydrated(true);
	}, []);

	useEffect(() => {
		if (hydrated && !loading && !user) {
			router.replace('/login');
		}
	}, [hydrated, user, loading, router]);

	if (!hydrated || loading || !user) return null;

	return (
		<AdminLayout>
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-100 p-8">
				{/* Header */}
				<div className="mb-8 text-center">
					<h2 className="text-4xl font-extrabold text-gray-900 mb-2">
						Admin Dashboard
					</h2>
					<p className="text-lg text-gray-600">
						Quick access to all admin features
					</p>
				</div>

				{/* Stats Row */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-10">
					{stats.map((stat) => (
						<div
							key={stat.label}
							className={`flex flex-col items-center rounded-xl shadow bg-white p-6 ${stat.color} transition hover:scale-105`}
						>
							<div className="text-3xl mb-2">{stat.icon}</div>
							<div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
							<div className="text-sm text-gray-600">{stat.label}</div>
						</div>
					))}
				</div>

				{/* Navigation Blocks */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-10">
					{pages.map((page) => (
						<a
							key={page.name}
							href={page.href}
							className={`rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center bg-gradient-to-br ${page.color} transition-transform transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-green-300`}
							style={{ minHeight: '200px' }}
						>
							<div className="text-5xl mb-4">{page.icon}</div>
							<div className="text-2xl font-bold text-white mb-2">
								{page.name}
							</div>
							<div className="text-white text-center opacity-90">
								{page.description}
							</div>
						</a>
					))}
				</div>

				{/* Recent Activity */}
				<div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
					<h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h3>
					<ul>
						{recentActivity.map((act) => (
							<li key={act.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
								<span className="font-medium text-gray-700">{act.user}</span>
								<span className="text-gray-500">{act.action}</span>
								<span className="text-xs text-gray-400">{act.time}</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</AdminLayout>
	);
}
