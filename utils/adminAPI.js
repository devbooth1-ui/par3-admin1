// Duplicate utils/adminAPI.js - keep consistent with src/utils/adminAPI.js
const ADMIN_API_BASE = process.env.REACT_APP_ADMIN_API_BASE || 'https://par3-admin1.vercel.app';

export const adminAPI = {
    submitBirdieClaim: async (playerData, outfitDescription = '', teeTime = '') => {
        try {
            const response = await fetch(`${ADMIN_API_BASE}/api/claims`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    claimType: 'birdie',
                    playerName: `${playerData.firstName} ${playerData.lastName}`,
                    playerEmail: playerData.email || '',
                    playerPhone: playerData.phone || '',
                    outfitDescription,
                    teeTime,
                    courseId: 'wentworth-gc',
                    hole: '1',
                    paymentMethod: 'card'
                })
            });

            if (!response.ok) throw new Error(`Failed to submit claim: ${response.status}`);
            const result = await response.json();

            // best-effort send-email (non-blocking)
            try {
                await fetch(`${ADMIN_API_BASE}/api/send-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: 'devbooth1@yahoo.com',
                        subject: '🚨 NEW BIRDIE CLAIM - Par3 Challenge',
                        body: `Player: ${playerData.firstName} ${playerData.lastName} - ${playerData.email}`
                    })
                });
            } catch (e) {
                console.warn('send-email failed (non-blocking):', e);
            }

            return result;
        } catch (error) {
            console.error('Failed to submit birdie claim:', error);
            return { error: error.message, offline: true };
        }
    },

    submitHoleInOneClaim: async (playerData, paymentMethod, outfitDescription = '', teeTime = '') => {
        try {
            const response = await fetch(`${ADMIN_API_BASE}/api/claims`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    claimType: 'hole_in_one',
                    playerName: `${playerData.firstName} ${playerData.lastName}`,
                    playerEmail: playerData.email || '',
                    playerPhone: playerData.phone || '',
                    outfitDescription,
                    teeTime,
                    courseId: 'wentworth-gc',
                    hole: '1',
                    paymentMethod: paymentMethod || 'card'
                })
            });

            if (!response.ok) throw new Error(`Failed to submit hole-in-one claim: ${response.status}`);
            const result = await response.json();

            // email notify (non-blocking)
            try {
                await fetch(`${ADMIN_API_BASE}/api/send-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: 'devbooth1@yahoo.com',
                        subject: '🏆 URGENT: HOLE-IN-ONE CLAIM - Par3 Challenge',
                        body: `Player: ${playerData.firstName} ${playerData.lastName} - ${playerData.email}`
                    })
                });
            } catch (e) {
                console.warn('send-email failed (non-blocking):', e);
            }

            return result;
        } catch (error) {
            console.error('Failed to submit hole-in-one claim:', error);
            return { error: error.message, offline: true };
        }
    },
};

export default adminAPI;
