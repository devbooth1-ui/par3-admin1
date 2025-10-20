// Quick test to verify $8.00 default pricing
// Run this in browser console at localhost:5173

console.log('💰 Verifying $8.00 Default Pricing...');

// Test that backend has correct default price
const verifyPricing = async () => {
    try {
        const response = await fetch('https://par3-admin1.vercel.app/api/courses');
        if (response.ok) {
            const courses = await response.json();
            const wentworth = courses.find(c => c.course_id === 'wentworth-gc');
            
            if (wentworth?.pricing) {
                const price = wentworth.pricing.game_fee;
                console.log(`✅ Backend Price: $${price}`);
                
                if (price === 8.00) {
                    console.log('🎉 CORRECT: Default price is $8.00');
                } else {
                    console.log(`⚠️ INCORRECT: Expected $8.00, got $${price}`);
                    console.log('Run: testPricingUpdate(8.00) to fix');
                }
            } else {
                console.log('⚠️ No pricing found - will use $8.00 default');
            }
        }
    } catch (error) {
        console.log('❌ Could not verify pricing:', error);
        console.log('Will use fallback default of $8.00');
    }
};

verifyPricing();

// Also provide quick fix function
window.fixPricingTo8Dollars = async () => {
    try {
        const response = await fetch('https://par3-admin1.vercel.app/api/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                course_id: 'wentworth-gc',
                pricing: {
                    game_fee: 8.00,
                    currency: 'USD',
                    last_updated: new Date().toISOString()
                },
                action: 'updatePricing'
            })
        });
        
        if (response.ok) {
            console.log('✅ Price fixed to $8.00! Refresh the page.');
        }
    } catch (error) {
        console.error('❌ Failed to fix pricing:', error);
    }
};

console.log('\n🔧 Quick Fix: If price is wrong, run fixPricingTo8Dollars()');
