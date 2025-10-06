import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../components/AdminLayout'
import Link from 'next/link'

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.replace('/login');
      }
    }
  }, [router]);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to the Par3 Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard" className="bg-white rounded shadow p-6 hover:bg-blue-50 transition">
            <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
            <p>Overview of all admin features and quick links.</p>
          </Link>
          <Link href="/claims" className="bg-white rounded shadow p-6 hover:bg-blue-50 transition">
            <h2 className="text-xl font-semibold mb-2">Claims</h2>
            <p>Manage and review prize claims.</p>
          </Link>
          <Link href="/courses" className="bg-white rounded shadow p-6 hover:bg-blue-50 transition">
            <h2 className="text-xl font-semibold mb-2">Courses</h2>
            <p>Manage golf courses and club information.</p>
          </Link>
          <Link href="/players" className="bg-white rounded shadow p-6 hover:bg-blue-50 transition">
            <h2 className="text-xl font-semibold mb-2">Players</h2>
            <p>View and manage player data and awards.</p>
          </Link>
          <Link href="/tournaments" className="bg-white rounded shadow p-6 hover:bg-blue-50 transition">
            <h2 className="text-xl font-semibold mb-2">Tournaments</h2>
            <p>Current tournaments, registration, and details.</p>
          </Link>
          <Link href="/accounting" className="bg-white rounded shadow p-6 hover:bg-blue-50 transition">
            <h2 className="text-xl font-semibold mb-2">Accounting</h2>
            <p>Track payouts, revenue, and financials.</p>
          </Link>
          <Link href="/events" className="bg-white rounded shadow p-6 hover:bg-blue-50 transition">
            <h2 className="text-xl font-semibold mb-2">Events</h2>
            <p>Manage and schedule events.</p>
          </Link>
          <Link href="/specials" className="bg-white rounded shadow p-6 hover:bg-blue-50 transition">
            <h2 className="text-xl font-semibold mb-2">Specials</h2>
            <p>Create and approve club specials and notifications.</p>
          </Link>
          <Link href="/crm" className="bg-white rounded shadow p-6 hover:bg-blue-50 transition">
            <h2 className="text-xl font-semibold mb-2">CRM</h2>
            <p>Manage club and contact information.</p>
          </Link>
        </div>
      </div>
    </AdminLayout>
  )
}
