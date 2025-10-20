// Dynamic Pricing System Test
// Run this in browser console to test and change pricing

console.log('🏷️ Testing Dynamic Pricing System...');

// Test current pricing
const testCurrentPricing = async () => {
    try {
        console.log('\n💰 Getting Current Pricing...');
        
        const response = await fetch('https://par3-admin1.vercel.app/api/courses');
        if (response.ok) {
            const courses = await response.json();
            const wentworth = courses.find(c => c.course_id === 'wentworth-gc');
            
            if (wentworth?.pricing) {
                console.log('✅ Current Pricing Found:', wentworth.pricing);
                console.log(`🎯 Game Fee: $${wentworth.pricing.game_fee}`);
            } else {
                console.log('⚠️ No pricing set - using default $8.00');
            }
        }
    } catch (error) {
        console.error('❌ Failed to get pricing:', error);
    }
};

// Test pricing update (admin function)
const testPricingUpdate = async (newPrice) => {
    try {
        console.log(`\n🔄 Updating Price to $${newPrice}...`);
        
        const response = await fetch('https://par3-admin1.vercel.app/api/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                course_id: 'wentworth-gc',
                course_name: 'Wentworth Golf Club',
                pricing: {
                    game_fee: parseFloat(newPrice),
                    currency: 'USD',
                    last_updated: new Date().toISOString()
                },
                action: 'updatePricing'
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log(`✅ Price Updated to $${newPrice}:`, result);
            console.log('🔄 Refresh your payment page to see the new price!');
        } else {
            console.log(`❌ Failed to update price: ${response.status}`);
        }
        
    } catch (error) {
        console.error('❌ Pricing update failed:', error);
    }
};

// Demo: Change pricing
const demoPricingChanges = async () => {
    console.log('\n🎬 Demo: Changing Game Prices...');
    
    // Test different prices
    const testPrices = [12.00, 20.00, 15.00, 8.00];
    
    for (let i = 0; i < testPrices.length; i++) {
        const price = testPrices[i];
        console.log(`\n📍 Step ${i + 1}: Setting price to $${price}`);
        
        await testPricingUpdate(price);
        
        // Wait 2 seconds between changes
        if (i < testPrices.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    console.log('\n🎉 Demo Complete! Final price set back to default $8.00');
};

// Usage instructions
console.log('\n📋 USAGE INSTRUCTIONS:');
console.log('1. testCurrentPricing() - Check current game price');
console.log('2. testPricingUpdate(12.00) - Change price to $12.00');
console.log('3. demoPricingChanges() - Run demo with multiple price changes');
console.log('');
console.log('🔧 To change price permanently:');
console.log('testPricingUpdate(YOUR_NEW_PRICE)');
console.log('');
console.log('Example: testPricingUpdate(25.00) sets price to $25.00');

// Run initial test
testCurrentPricing();

// Make functions available globally
window.testCurrentPricing = testCurrentPricing;
window.testPricingUpdate = testPricingUpdate;
window.demoPricingChanges = demoPricingChanges;
