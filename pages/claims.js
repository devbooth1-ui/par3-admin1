import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'

export default function Claims() {
    const [claims, setClaims] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [emailNotificationStatus, setEmailNotificationStatus] = useState('')

    // Check authentication
    useEffect(() => {
        const token = localStorage.getItem('adminToken')
        if (!token) {
            window.location.href = '/login'
            return
        }
        // Only fetch claims if on /claims route
        if (window.location.pathname === '/claims') {
            fetchClaims()
        }
    }, [])

    const fetchClaims = async () => {
        try {
            setLoading(true)
            // In a real implementation, this would fetch from your backend
            // For now, we'll simulate with localStorage or API call
            const response = await fetch('/api/claims')
            if (response.ok) {
                const data = await response.json()
                setClaims(data.claims || [])
            } else {
                // Fallback to mock data for demo
                const mockClaims = [
                    {
                        id: '1',
                        claimType: 'hole_in_one',
                        playerName: 'John Smith',
                        playerEmail: 'john.smith@email.com',
                        playerPhone: '555-0123',
                        outfitDescription: 'Navy blue polo, khaki pants, white Nike shoes, red cap',
                        teeTime: '2:30 PM',
                        courseId: 'wentworth-gc',
                        hole: '1',
                        submittedAt: new Date().toISOString(),
                        status: 'pending',
                        prizeAmount: 100000, // $1000 in cents
                        paymentMethod: 'credit_card',
                        notes: ''
                    },
                    {
                        id: '2',
                        claimType: 'birdie',
                        playerName: 'Sarah Johnson',
                        playerEmail: 'sarah.j@email.com',
                        playerPhone: '555-0456',
                        outfitDescription: 'Pink golf shirt, black shorts, Adidas golf shoes',
                        teeTime: '11:15 AM',
                        courseId: 'wentworth-gc',
                        hole: '1',
                        submittedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
                        status: 'pending',
                        prizeAmount: 6500, // $65 in cents
                        paymentMethod: 'paypal',
                        notes: ''
                    }
                ]
                setClaims(mockClaims)
            }
        } catch (error) {
            console.error('Failed to fetch claims:', error)
            setClaims([])
        } finally {
            setLoading(false)
        }
    }

    const updateClaimStatus = async (claimId, newStatus, notes = '') => {
        try {
            // Update the claim status
            const updatedClaims = claims.map(claim =>
                claim.id === claimId
                    ? { ...claim, status: newStatus, notes }
                    : claim
            )
            setClaims(updatedClaims)

            // Send email notification to devbooth1@yahoo.com
            const claim = claims.find(c => c.id === claimId)
            if (claim) {
                await sendEmailNotification(claim, newStatus, notes)
            }

            // In a real implementation, you would also update the backend
            await fetch(`/api/claims/${claimId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, notes })
            })

        } catch (error) {
            console.error('Failed to update claim:', error)
            alert('Failed to update claim status')
        }
    }

    const sendEmailNotification = async (claim, status, notes) => {
        try {
            setEmailNotificationStatus('Sending email notification...')

            const emailData = {
                to: 'devbooth1@yahoo.com',
                subject: `Par3 Challenge - ${claim.claimType === 'hole_in_one' ? 'Hole-in-One' : 'Birdie'} Claim ${status.toUpperCase()}`,
                body: `
CLAIM STATUS UPDATE

Player: ${claim.playerName}
Email: ${claim.playerEmail}
Phone: ${claim.playerPhone}
Claim Type: ${claim.claimType === 'hole_in_one' ? 'Hole-in-One' : 'Birdie'}
Prize Amount: $${(claim.prizeAmount / 100).toFixed(2)}
Status: ${status.toUpperCase()}

PLAYER DETAILS:
Outfit: ${claim.outfitDescription}
Tee Time: ${claim.teeTime}
Course: ${claim.courseId}
Hole: ${claim.hole}
Submitted: ${new Date(claim.submittedAt).toLocaleString()}

Payment Method: ${claim.paymentMethod}

Admin Notes: ${notes || 'None'}

---
Par3 Challenge Admin Dashboard
        `
            }

            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(emailData)
            })

            if (response.ok) {
                setEmailNotificationStatus('✅ Email sent to devbooth1@yahoo.com')
            } else {
                setEmailNotificationStatus('⚠️ Email service unavailable - claim updated locally')
            }

            // Clear status after 3 seconds
            setTimeout(() => setEmailNotificationStatus(''), 3000)

        } catch (error) {
            console.error('Failed to send email:', error)
            setEmailNotificationStatus('⚠️ Email failed - claim updated locally')
            setTimeout(() => setEmailNotificationStatus(''), 3000)
        }
    }

    const filteredClaims = claims.filter(claim =>
        filter === 'all' || claim.status === filter
    )

    const formatClaimType = (type) => {
        return type === 'hole_in_one' ? 'Hole-in-One' : 'Birdie'
    }

    const formatPrizeAmount = (amount) => {
        return `$${(amount / 100).toFixed(2)}`
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'verified': return 'bg-green-100 text-green-800'
            case 'denied': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getClaimTypeColor = (type) => {
        return type === 'hole_in_one'
            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
            : 'bg-blue-100 text-blue-800 border-blue-200'
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading claims...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Prize Claims Management</h1>
                        <p className="text-gray-600">
                            Real-time birdie and hole-in-one claims from the Par3 Challenge app
                        </p>

                        {emailNotificationStatus && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-blue-800 text-sm">{emailNotificationStatus}</p>
                            </div>
                        )}
                    </div>

                    {/* Filter Tabs */}
                    <div className="mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8">
                                {[
                                    { key: 'all', label: 'All Claims', count: claims.length },
                                    { key: 'pending', label: 'Pending', count: claims.filter(c => c.status === 'pending').length },
                                    { key: 'verified', label: 'Verified', count: claims.filter(c => c.status === 'verified').length },
                                    { key: 'denied', label: 'Denied', count: claims.filter(c => c.status === 'denied').length }
                                ].map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setFilter(tab.key)}
                                        className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${filter === tab.key
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        {tab.label} ({tab.count})
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="text-2xl">🏆</div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500">Hole-in-One Claims</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {claims.filter(c => c.claimType === 'hole_in_one').length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="text-2xl">🐦</div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500">Birdie Claims</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {claims.filter(c => c.claimType === 'birdie').length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="text-2xl">⏱️</div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500">Pending Review</p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {claims.filter(c => c.status === 'pending').length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="text-2xl">💰</div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500">Total Prizes</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        ${(claims.filter(c => c.status === 'verified').reduce((sum, c) => sum + c.prizeAmount, 0) / 100).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Claims Table */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {filteredClaims.length === 0 ? (
                                <li className="p-8 text-center text-gray-500">
                                    No claims found for the selected filter.
                                </li>
                            ) : (
                                filteredClaims.map((claim) => (
                                    <li key={claim.id} className="p-6 hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center space-x-3">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getClaimTypeColor(claim.claimType)}`}>
                                                            {formatClaimType(claim.claimType)}
                                                        </span>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                                                            {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                                                        </span>
                                                        <span className="text-lg font-bold text-green-600">
                                                            {formatPrizeAmount(claim.prizeAmount)}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(claim.submittedAt).toLocaleString()}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-900 mb-2">{claim.playerName}</h3>
                                                        <div className="space-y-1 text-sm text-gray-600">
                                                            <p><strong>Email:</strong> {claim.playerEmail}</p>
                                                            <p><strong>Phone:</strong> {claim.playerPhone || 'Not provided'}</p>
                                                            <p><strong>Course:</strong> {claim.courseId} - Hole {claim.hole}</p>
                                                            <p><strong>Tee Time:</strong> {claim.teeTime}</p>
                                                            <p><strong>Payment Method:</strong> {claim.paymentMethod}</p>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="font-medium text-gray-900 mb-2">Player Outfit Description</h4>
                                                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border">
                                                            {claim.outfitDescription}
                                                        </p>
                                                        {claim.notes && (
                                                            <div className="mt-3">
                                                                <h4 className="font-medium text-gray-900 mb-1">Admin Notes</h4>
                                                                <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded border">
                                                                    {claim.notes}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {claim.status === 'pending' && (
                                                    <div className="mt-4 flex space-x-3">
                                                        <button
                                                            onClick={() => {
                                                                const notes = prompt('Add verification notes (optional):') || ''
                                                                updateClaimStatus(claim.id, 'verified', notes)
                                                            }}
                                                            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                        >
                                                            ✅ Verify & Pay
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const notes = prompt('Add denial reason:') || 'Claim denied'
                                                                updateClaimStatus(claim.id, 'denied', notes)
                                                            }}
                                                            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                        >
                                                            ❌ Deny Claim
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>

                    {/* Refresh Button */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={fetchClaims}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            🔄 Refresh Claims
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
