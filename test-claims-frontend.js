// Test script to verify claims submission from frontend
// Run this in browser console on localhost:5173

console.log('🧪 Testing Frontend Claims Submission...');

// Test birdie claim
const testBirdieClaimData = {
    firstName: 'John',
    lastName: 'Doe', 
    email: 'johndoe@example.com',
    phone: '555-123-4567'
};

const testBirdieClaim = async () => {
    try {
        const response = await fetch('https://par3-admin1.vercel.app/api/claims', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                player_email: testBirdieClaimData.email,
                course_id: 'wentworth-gc',
                hole: 1,
                yards: 130,
                claim_type: 'birdie',
                player_name: `${testBirdieClaimData.firstName} ${testBirdieClaimData.lastName}`,
                player_phone: testBirdieClaimData.phone,
                outfit_description: 'Blue polo, khaki shorts',
                tee_time: '2:30 PM'
            })
        });

        const result = await response.json();
        console.log('✅ Birdie Claim Test Result:', result);
        return result;
    } catch (error) {
        console.error('❌ Birdie Claim Test Failed:', error);
    }
};

// Test hole-in-one claim
const testHoleInOneClaim = async () => {
    try {
        const response = await fetch('https://par3-admin1.vercel.app/api/claims', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                player_email: testBirdieClaimData.email,
                course_id: 'wentworth-gc',
                hole: 1,
                yards: 130,
                claim_type: 'hole_in_one',
                player_name: `${testBirdieClaimData.firstName} ${testBirdieClaimData.lastName}`,
                player_phone: testBirdieClaimData.phone,
                outfit_description: 'White polo, navy shorts',
                tee_time: '3:15 PM',
                payment_method: 'credit_card'
            })
        });

        const result = await response.json();
        console.log('🏆 Hole-in-One Claim Test Result:', result);
        return result;
    } catch (error) {
        console.error('❌ Hole-in-One Claim Test Failed:', error);
    }
};

// Run tests
console.log('Running claims tests...');
testBirdieClaim();
testHoleInOneClaim();
