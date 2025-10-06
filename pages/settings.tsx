import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import AdminLayout from '../components/AdminLayout';
import Link from 'next/link';


export default function Settings() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || (user.role !== 'admin' && user.role !== 'staff'))) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    const [settings, setSettings] = useState({
        siteName: 'PAR3 Challenge',
        adminEmail: 'admin@par3challenge.com',
        enableNotifications: true,
        enableRegistrations: true,
        maxPlayersPerEvent: 100,
        bookingWindowDays: 30,
        enablePayments: true,
        stripePublicKey: 'pk_test_...',
        enableVideoRecording: true,
        enableGeolocation: true
    });

    const handleSettingChange = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        // Save settings logic here
        alert('Settings saved successfully!');
    };

    if (loading || !user || (user.role !== 'admin' && user.role !== 'staff')) return null;

    return (
        <AdminLayout>
            <div className="max-w-2xl mx-auto p-8">
                <h1 className="text-3xl font-bold mb-6 text-center">Settings</h1>
                <p className="mb-4 text-center text-gray-700">Only visible to admin and staff users. Here you can manage Stripe, bank account, and settings.</p>

                {/* Existing settings form */}
                <div className="min-h-screen bg-gray-100">
                    {/* Navigation */}
                    <nav className="bg-white shadow-lg">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="flex justify-between h-16">
                                <div className="flex items-center">
                                    <Link href="/dashboard" className="mr-4">← Back to Dashboard</Link>
                                    <h1 className="text-xl font-bold text-gray-800">Admin Settings</h1>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Link href="/dashboard">Dashboard</Link>
                                    <Link href="/login">Logout</Link>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Main Content */}
                    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
                                <p className="text-gray-600">Configure your PAR3 Challenge application settings</p>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* General Settings */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900">General Settings</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                                            <input
                                                type="text"
                                                value={settings.siteName}
                                                onChange={(e) => handleSettingChange('siteName', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                                            <input
                                                type="email"
                                                value={settings.adminEmail}
                                                onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Feature Settings */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900">Feature Controls</h3>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">Enable Notifications</label>
                                                <p className="text-sm text-gray-500">Allow system to send notifications to users</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={settings.enableNotifications}
                                                onChange={(e) => handleSettingChange('enableNotifications', e.target.checked)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">Enable Registrations</label>
                                                <p className="text-sm text-gray-500">Allow new user registrations</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={settings.enableRegistrations}
                                                onChange={(e) => handleSettingChange('enableRegistrations', e.target.checked)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">Enable Video Recording</label>
                                                <p className="text-sm text-gray-500">Allow video recording during gameplay</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={settings.enableVideoRecording}
                                                onChange={(e) => handleSettingChange('enableVideoRecording', e.target.checked)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">Enable Geolocation</label>
                                                <p className="text-sm text-gray-500">Use GPS for course detection</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={settings.enableGeolocation}
                                                onChange={(e) => handleSettingChange('enableGeolocation', e.target.checked)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Event Settings */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900">Event Management</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Max Players Per Event</label>
                                            <input
                                                type="number"
                                                value={settings.maxPlayersPerEvent}
                                                onChange={(e) => handleSettingChange('maxPlayersPerEvent', parseInt(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Booking Window (Days)</label>
                                            <input
                                                type="number"
                                                value={settings.bookingWindowDays}
                                                onChange={(e) => handleSettingChange('bookingWindowDays', parseInt(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Settings */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900">Payment Settings</h3>

                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Enable Payments</label>
                                            <p className="text-sm text-gray-500">Allow payment processing through Stripe</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settings.enablePayments}
                                            onChange={(e) => handleSettingChange('enablePayments', e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                        />
                                    </div>

                                    {settings.enablePayments && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Stripe Public Key</label>
                                            <input
                                                type="text"
                                                value={settings.stripePublicKey}
                                                onChange={(e) => handleSettingChange('stripePublicKey', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="pk_test_..."
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Save Button */}
                                <div className="pt-6 border-t border-gray-200">
                                    <button
                                        onClick={handleSave}
                                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        Save Settings
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
