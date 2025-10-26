// API Configuration for connecting to admin services
const ADMIN_API_BASE = process.env.NODE_ENV === 'production'
    ? 'https://par3-admin1.vercel.app' // <-- your actual Vercel admin portal URL
    : 'http://localhost:3001';

// API functions for admin communication
export const adminAPI = {
    // Submit birdie claim to admin portal
    submitBirdieClaim: async (playerData, outfitDescription = '', teeTime = '') => {
        try {
            const response = await fetch(`${ADMIN_API_BASE}/api/claims`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    claimType: 'birdie',
                    playerName: `${playerData.firstName} ${playerData.lastName}`,
                    playerEmail: playerData.email || '',
                    playerPhone: playerData.phone || '',
                    outfitDescription: outfitDescription,
                    teeTime: teeTime,
                    courseId: 'wentworth-gc',
                    hole: '1',
                    paymentMethod: 'card'
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to submit claim: ${response.status}`);
            }

            const result = await response.json();
            console.log('🚨 BIRDIE CLAIM SUBMITTED:', result);

            // Also send immediate email notification
            await fetch(`${ADMIN_API_BASE}/api/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: 'devbooth1@yahoo.com',
                    subject: '🚨 NEW BIRDIE CLAIM - Par3 Challenge',
                    body: `
NEW BIRDIE CLAIM SUBMITTED!

Player: ${playerData.firstName} ${playerData.lastName}
Email: ${playerData.email}
Phone: ${playerData.phone || 'Not provided'}
Prize: $65 Club Card + 200 Points

VERIFICATION DETAILS:
Outfit: ${outfitDescription || 'Not provided'}
Tee Time: ${teeTime || 'Not specified'}
Course: wentworth-gc
Hole: 1
Submitted: ${new Date().toLocaleString()}

Please verify this claim in the admin portal immediately!

Admin Portal: https://par3-admin1.vercel.app/claims
                    `
                })
            });

            return result;
        } catch (error) {
            console.error('Failed to submit birdie claim:', error);
            // Don't break the app if admin portal is down
            return { error: error.message, offline: true };
        }
    },

    // Submit hole-in-one claim to admin portal
    submitHoleInOneClaim: async (playerData, paymentMethod, outfitDescription = '', teeTime = '') => {
        try {
            const response = await fetch(`${ADMIN_API_BASE}/api/claims`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    claimType: 'hole_in_one',
                    playerName: `${playerData.firstName} ${playerData.lastName}`,
                    playerEmail: playerData.email || '',
                    playerPhone: playerData.phone || '',
                    outfitDescription: outfitDescription,
                    teeTime: teeTime,
                    courseId: 'wentworth-gc',
                    hole: '1',
                    paymentMethod: paymentMethod || 'card'
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to submit hole-in-one claim: ${response.status}`);
            }

            const result = await response.json();
            console.log('🚨 HOLE-IN-ONE CLAIM SUBMITTED:', result);

            // Also send immediate email notification
            await fetch(`${ADMIN_API_BASE}/api/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: 'devbooth1@yahoo.com',
                    subject: '🏆 URGENT: HOLE-IN-ONE CLAIM - Par3 Challenge',
                    body: `
🏆 HOLE-IN-ONE CLAIM SUBMITTED! 🏆

Player: ${playerData.firstName} ${playerData.lastName}
Email: ${playerData.email}
Phone: ${playerData.phone || 'Not provided'}
Prize: $1,000 CASH + Tournament Qualification

VERIFICATION DETAILS:
Outfit: ${outfitDescription || 'Not provided'}
Tee Time: ${teeTime || 'Not specified'}
Course: wentworth-gc
Hole: 1
Payment Method: ${paymentMethod}
Submitted: ${new Date().toLocaleString()}

*** URGENT VERIFICATION REQUIRED ***
Please verify this claim in the admin portal immediately!

Admin Portal: https://par3-admin1.vercel.app/claims
                    `
                })
            });

            return result;
        } catch (error) {
            console.error('Failed to submit hole-in-one claim:', error);
            // Don't break the app if admin portal is down
            return { error: error.message, offline: true };
        }
    }
};

export default adminAPI;
