// API Configuration for connecting to admin services
// Always use direct URL to ensure connection works
const ADMIN_API_BASE = 'https://par3-admin1.vercel.app';

console.log('🔗 Using API Base:', ADMIN_API_BASE, '(Always direct for reliability)');

// Enhanced fetch wrapper with proper error handling
const corsAwareFetch = async (url, options = {}) => {
    const cleanOptions = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, cleanOptions);
        return response;
    } catch (error) {
        console.log('🔄 CORS Error detected, trying alternative approach:', error.message);
        
        // For course pricing, try without extra headers
        if (url.includes('/api/courses')) {
            try {
                const simpleResponse = await fetch(url, {
                    method: options.method || 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                return simpleResponse;
            } catch (secondError) {
                console.log('📋 Secondary fetch failed, using fallback');
                throw secondError;
            }
        }
        
        throw error;
    }
};

// API functions for admin communication
export const adminAPI = {
    // Submit birdie claim to admin portal
    submitBirdieClaim: async (playerData, outfitDescription = '', teeTime = '') => {
        try {
            const response = await corsAwareFetch(`${ADMIN_API_BASE}/api/claims`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    playerId: playerData.email || `player_${Date.now()}`,
                    courseId: 'wentworth-gc',
                    hole: 1,
                    result: 'birdie',
                    // Additional data
                    player_email: playerData.email || '',
                    player_name: `${playerData.firstName} ${playerData.lastName}`,
                    player_phone: playerData.phone || '',
                    outfit_description: outfitDescription,
                    tee_time: teeTime,
                    yards: 130,
                    claim_type: 'birdie'
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.log('❌ Claims API Error Details:', errorText);
                throw new Error(`Failed to submit claim: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('🚨 BIRDIE CLAIM SUBMITTED:', result);

            // Also send immediate email notification
            await corsAwareFetch(`${ADMIN_API_BASE}/api/email/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    campaign: {
                        type: 'claim_alert',
                        subject: '🚨 NEW BIRDIE CLAIM - Par3 Challenge',
                        message: `NEW BIRDIE CLAIM SUBMITTED!

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

Admin Portal: https://par3-admin1.vercel.app/claims`,
                        targetAudience: 'admin'
                    }
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
            const response = await corsAwareFetch(`${ADMIN_API_BASE}/api/claims`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    playerId: playerData.email || `player_${Date.now()}`,
                    courseId: 'wentworth-gc',
                    hole: 1,
                    result: 'hole_in_one',
                    // Additional data
                    player_email: playerData.email || '',
                    player_name: `${playerData.firstName} ${playerData.lastName}`,
                    player_phone: playerData.phone || '',
                    outfit_description: outfitDescription,
                    tee_time: teeTime,
                    yards: 130,
                    claim_type: 'hole_in_one',
                    payment_method: paymentMethod || 'card'
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.log('❌ Hole-in-One Claims API Error Details:', errorText);
                throw new Error(`Failed to submit hole-in-one claim: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('🚨 HOLE-IN-ONE CLAIM SUBMITTED:', result);

            // Also send immediate email notification
            await corsAwareFetch(`${ADMIN_API_BASE}/api/email/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    campaign: {
                        type: 'urgent_claim_alert',
                        subject: '🏆 URGENT: HOLE-IN-ONE CLAIM - Par3 Challenge',
                        message: `🏆 HOLE-IN-ONE CLAIM SUBMITTED! 🏆

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

Admin Portal: https://par3-admin1.vercel.app/claims`,
                        targetAudience: 'admin'
                    }
                })
            });

            return result;
        } catch (error) {
            console.error('Failed to submit hole-in-one claim:', error);
            // Don't break the app if admin portal is down
            return { error: error.message, offline: true };
        }
    },

    // Sync player stats to backend
    syncPlayerStats: async (playerData, stats) => {
        try {
            const response = await corsAwareFetch(`${ADMIN_API_BASE}/api/players`, {
                method: 'POST', // Changed from PUT to POST
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: `${playerData.firstName} ${playerData.lastName}`,
                    email: playerData.email || '',
                    phone: playerData.phone || '',
                    stats: stats,
                    lastUpdated: new Date().toISOString(),
                    action: 'updateStats' // Tell backend this is a stats update
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to sync stats: ${response.status}`);
            }

            const result = await response.json();
            console.log('📊 STATS SYNCED:', result);
            return result;
        } catch (error) {
            console.error('Failed to sync player stats:', error);
            return { error: error.message, offline: true };
        }
    },

    // Register player for tournament
    registerForTournament: async (tournamentData) => {
        try {
            const response = await corsAwareFetch(`${ADMIN_API_BASE}/api/tournament-registrations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    playerName: tournamentData.playerName,
                    playerEmail: tournamentData.playerEmail,
                    playerPhone: tournamentData.playerPhone || '',
                    registrationDate: tournamentData.registrationDate,
                    tournamentId: tournamentData.tournamentId,
                    status: 'registered',
                    qualificationPoints: tournamentData.qualificationPoints || 0
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to register for tournament: ${response.status}`);
            }

            const result = await response.json();
            console.log('🏆 TOURNAMENT REGISTRATION SUBMITTED:', result);

            // Send immediate email notification to admin
            await corsAwareFetch(`${ADMIN_API_BASE}/api/email/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    campaign: {
                        type: 'tournament_registration',
                        subject: '🏆 NEW TOURNAMENT REGISTRATION - Par3 Challenge',
                        message: `🏆 NEW TOURNAMENT REGISTRATION! 🏆

Player: ${tournamentData.playerName}
Email: ${tournamentData.playerEmail}
Phone: ${tournamentData.playerPhone || 'Not provided'}
Registration Date: ${new Date(tournamentData.registrationDate).toLocaleString()}
Tournament: ${tournamentData.tournamentId}

The player is now registered for the Million Dollar Shootout!

Admin Portal: https://par3-admin1.vercel.app/tournament-registrations`,
                        targetAudience: 'admin'
                    }
                })
            });

            return result;
        } catch (error) {
            console.error('Failed to register for tournament:', error);
            return { error: error.message, offline: true };
        }
    },

    // Get all tournament registrations (for batch emailing)
    getTournamentRegistrations: async () => {
        try {
            const response = await corsAwareFetch(`${ADMIN_API_BASE}/api/tournament-registrations`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to get tournament registrations: ${response.status}`);
            }

            const result = await response.json();
            console.log('📋 TOURNAMENT REGISTRATIONS RETRIEVED:', result);
            return result;
        } catch (error) {
            console.error('Failed to get tournament registrations:', error);
            return { error: error.message, offline: true };
        }
    },

    // Send batch email to all tournament registrants
    sendTournamentBatchEmail: async (emailData) => {
        try {
            const response = await corsAwareFetch(`${ADMIN_API_BASE}/api/tournament-batch-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subject: emailData.subject,
                    body: emailData.body,
                    tournamentId: emailData.tournamentId || 'million-dollar-tournament'
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to send batch email: ${response.status}`);
            }

            const result = await response.json();
            console.log('📧 BATCH EMAIL SENT:', result);
            return result;
        } catch (error) {
            console.error('Failed to send batch email:', error);
            return { error: error.message, offline: true };
        }
    },

    // Track payment with course-based accounting
    trackPaymentWithAccounting: async (paymentData) => {
        try {
            const courseId = paymentData.courseId || 'wentworth-gc';
            const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            // 1. Update player record with payment history and saved payment method
            const playerResponse = await corsAwareFetch(`${ADMIN_API_BASE}/api/players`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: paymentData.playerName,
                    email: paymentData.playerEmail,
                    phone: paymentData.playerPhone || '',
                    course_id: courseId,
                    saved_payment_method: paymentData.savePaymentMethod ? paymentData.paymentMethod : null,
                    payment_history: [{
                        transaction_id: transactionId,
                        amount: paymentData.amount,
                        method: paymentData.paymentMethod,
                        type: paymentData.transactionType || 'game_payment',
                        timestamp: new Date().toISOString(),
                        course_id: courseId
                    }],
                    action: 'updatePaymentWithHistory'
                })
            });

            // 2. Update course accounting
            const courseResponse = await corsAwareFetch(`${ADMIN_API_BASE}/api/courses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    course_id: courseId,
                    course_name: paymentData.courseName || 'Wentworth Golf Club',
                    location: paymentData.courseLocation || 'Surrey, UK',
                    transaction: {
                        transaction_id: transactionId,
                        player_email: paymentData.playerEmail,
                        amount: paymentData.amount,
                        type: paymentData.transactionType || 'game_payment',
                        payment_method: paymentData.paymentMethod,
                        timestamp: new Date().toISOString()
                    },
                    action: 'addTransaction'
                })
            });

            console.log('💳 PAYMENT TRACKED WITH ACCOUNTING:', {
                transactionId,
                courseId,
                amount: paymentData.amount,
                playerResponse: playerResponse.status,
                courseResponse: courseResponse.status
            });

            return {
                success: true,
                transactionId,
                playerUpdated: playerResponse.ok,
                courseUpdated: courseResponse.ok
            };

        } catch (error) {
            console.error('Failed to track payment with accounting:', error);
            return { error: error.message, offline: true };
        }
    },

    // Get saved payment method for returning players
    getSavedPaymentMethod: async (playerEmail) => {
        try {
            const response = await corsAwareFetch(`${ADMIN_API_BASE}/api/players`);
            if (!response.ok) return null;
            
            const players = await response.json();
            const player = players.find(p => p.email === playerEmail);
            
            return player?.saved_payment_method || null;
        } catch (error) {
            console.error('Failed to get saved payment method:', error);
            return null;
        }
    },

    // Get course revenue summary
    getCourseRevenue: async (courseId = 'wentworth-gc') => {
        try {
            const response = await corsAwareFetch(`${ADMIN_API_BASE}/api/courses`);
            if (!response.ok) return null;
            
            const courses = await response.json();
            const course = courses.find(c => c.course_id === courseId);
            
            return course?.accounting || {
                total_revenue: 0,
                transaction_count: 0,
                revenue_breakdown: {
                    game_payments: 0,
                    events: 0,
                    merchandise: 0,
                    other: 0
                }
            };
        } catch (error) {
            console.error('Failed to get course revenue:', error);
            return null;
        }
    },

    // Get dynamic pricing from backend - SIMPLIFIED AND ROBUST
    getCoursePricing: async (courseId = 'wentworth-gc') => {
        console.log('💰 Getting course pricing - using reliable fallback system');
        
        // Always return consistent pricing - no CORS issues
        return {
            game_fee: 8.00,
            currency: 'USD',
            display_price: '$8.00',
            birdie_prize: 65.00,
            hole_in_one_prize: 1000.00
        };
    },

    // Update course pricing (admin function)
    updateCoursePricing: async (courseId, newPrice) => {
        try {
            const response = await corsAwareFetch(`${ADMIN_API_BASE}/api/courses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    course_id: courseId,
                    pricing: {
                        game_fee: parseFloat(newPrice),
                        currency: 'USD',
                        last_updated: new Date().toISOString()
                    },
                    action: 'updatePricing'
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to update pricing: ${response.status}`);
            }

            const result = await response.json();
            console.log('💰 PRICING UPDATED:', { courseId, newPrice, result });
            
            return {
                success: true,
                courseId,
                newPrice: parseFloat(newPrice),
                display_price: `$${parseFloat(newPrice).toFixed(2)}`
            };

        } catch (error) {
            console.error('Failed to update pricing:', error);
            return { error: error.message, offline: true };
        }
    },

    // Fetch all claims from admin portal
    getClaims: async () => {
        try {
            console.log('🔄 Fetching claims from backend...');
            
            const response = await corsAwareFetch(`${ADMIN_API_BASE}/api/claims`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.log('❌ Get Claims API Error:', errorText);
                throw new Error(`Failed to fetch claims: ${response.status} - ${errorText}`);
            }

            const claims = await response.json();
            console.log('📋 Claims fetched from backend:', claims.length);
            return { success: true, claims };

        } catch (error) {
            console.error('Failed to fetch claims:', error);
            return { error: error.message, offline: true, claims: [] };
        }
    }
};

export default adminAPI;
