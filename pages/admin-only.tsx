import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import AdminLayout from '../components/AdminLayout';

export default function AdminSecurePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') return null;

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Secure Area</h1>
        <p className="mb-4 text-center text-gray-700">Only visible to admin users. Here you can manage Stripe, bank account, and settings.</p>
        {/* Add your Stripe/bank/settings components here */}
      </div>
    </AdminLayout>
  );
}
