// Clean API for player app to communicate with par3-admin1 backend
// ONLY handles: Course geofencing, Tournament updates, Specials/Events, Claims/Payments
const ADMIN_API_BASE = 'https://par3-admin1.vercel.app';

console.log('🔗 Player app connecting to admin backend:', ADMIN_API_BASE);

// Simple fetch wrapper
const apiFetch = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        return response;
    } catch (error) {
        console.log('❌ API Error:', error.message);
        throw error;
    }
};

export const adminAPI = {
    // ===== SEND TO BACKEND (Frontend → par3-admin1) =====
    
    // Submit birdie/hole-in-one claims
    submitBirdieClaim: async (playerData, outfitDescription = '', teeTime = '') => {
        try {
            const response = await apiFetch(`${ADMIN_API_BASE}/api/claims`, {
                method: 'POST',
                body: JSON.stringify({
                    playerId: playerData.email || `player_${Date.now()}`,
                    courseId: 'current-course',
                    hole: 1,
                    claim_type: 'birdie',
                    player_email: playerData.email || '',
                    player_name: `${playerData.firstName} ${playerData.lastName}`,
                    player_phone: playerData.phone || '',
                    outfit_description: outfitDescription,
                    tee_time: teeTime,
                    submitted_at: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error(`Claim submission failed: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Birdie claim submitted:', result);
            return { success: true, result };
        } catch (error) {
            console.log('❌ Claim submission error:', error.message);
            return { success: false, error: error.message };
        }
    },

    // Record payment completions
    recordPayment: async (paymentData) => {
        try {
            const response = await apiFetch(`${ADMIN_API_BASE}/api/payments`, {
                method: 'POST',
                body: JSON.stringify({
                    ...paymentData,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error(`Payment recording failed: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Payment recorded:', result);
            return { success: true, result };
        } catch (error) {
            console.log('❌ Payment recording error:', error.message);
            return { success: false, error: error.message };
        }
    },

    // Record course play activity
    recordCoursePlay: async (playerData, courseId) => {
        try {
            const response = await apiFetch(`${ADMIN_API_BASE}/api/course-plays`, {
                method: 'POST',
                body: JSON.stringify({
                    player_email: playerData.email,
                    player_name: `${playerData.firstName} ${playerData.lastName}`,
                    course_id: courseId,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error(`Course play recording failed: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Course play recorded:', result);
            return { success: true, result };
        } catch (error) {
            console.log('❌ Course play recording error:', error.message);
            return { success: false, error: error.message };
        }
    },

    // ===== GET FROM BACKEND (par3-admin1 → Frontend) =====
    
    // Get course geofencing data
    getCourseGeofencing: async () => {
        try {
            const response = await apiFetch(`${ADMIN_API_BASE}/api/courses/geofencing`);
            
            if (!response.ok) {
                throw new Error(`Geofencing data fetch failed: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Course geofencing data loaded:', data.courses?.length || 0, 'courses');
            return { success: true, courses: data.courses || [] };
        } catch (error) {
            console.log('❌ Geofencing fetch error:', error.message);
            return { success: false, error: error.message, courses: [] };
        }
    },

    // Get tournament updates
    getTournamentUpdates: async () => {
        try {
            const response = await apiFetch(`${ADMIN_API_BASE}/api/tournaments/updates`);
            
            if (!response.ok) {
                throw new Error(`Tournament updates fetch failed: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Tournament updates loaded:', data.tournaments?.length || 0, 'tournaments');
            return { success: true, tournaments: data.tournaments || [] };
        } catch (error) {
            console.log('❌ Tournament updates fetch error:', error.message);
            return { success: false, error: error.message, tournaments: [] };
        }
    },

    // Get specials/events for push notifications
    getSpecialsAndEvents: async (courseId = null) => {
        try {
            const url = courseId 
                ? `${ADMIN_API_BASE}/api/specials?courseId=${courseId}`
                : `${ADMIN_API_BASE}/api/specials`;
                
            const response = await apiFetch(url);
            
            if (!response.ok) {
                throw new Error(`Specials fetch failed: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Specials/Events loaded:', data.specials?.length || 0, 'items');
            return { success: true, specials: data.specials || [] };
        } catch (error) {
            console.log('❌ Specials fetch error:', error.message);
            return { success: false, error: error.message, specials: [] };
        }
    }
};

export default adminAPI;
