// Test script for Course-Based Accounting System
// Run this in browser console at localhost:5173

console.log('🏌️ Testing Course-Based Payment & Accounting System...');

// Test the new payment tracking with course accounting
const testCoursePayment = async () => {
    try {
        console.log('\n💳 Testing Payment with Course Accounting...');
        
        const response = await fetch('https://par3-admin1.vercel.app/api/players', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Player Course',
                email: 'testcourse@example.com',
                phone: '555-123-4567',
                course_id: 'wentworth-gc',
                saved_payment_method: 'card',
                payment_history: [{
                    transaction_id: 'txn_test_course_123',
                    amount: 15.00,
                    method: 'card',
                    type: 'game_payment',
                    timestamp: new Date().toISOString(),
                    course_id: 'wentworth-gc'
                }],
                action: 'updatePaymentWithHistory'
            })
        });
        
        console.log(`Player payment tracking: ${response.status}`);
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Player payment data:', data);
        }
        
    } catch (error) {
        console.error('❌ Player payment test failed:', error);
    }
};

// Test course accounting update
const testCourseAccounting = async () => {
    try {
        console.log('\n📊 Testing Course Accounting...');
        
        const response = await fetch('https://par3-admin1.vercel.app/api/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                course_id: 'wentworth-gc',
                course_name: 'Wentworth Golf Club',
                location: 'Surrey, UK',
                transaction: {
                    transaction_id: 'txn_test_course_123',
                    player_email: 'testcourse@example.com',
                    amount: 15.00,
                    type: 'game_payment',
                    payment_method: 'card',
                    timestamp: new Date().toISOString()
                },
                action: 'addTransaction'
            })
        });
        
        console.log(`Course accounting: ${response.status}`);
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Course accounting data:', data);
        }
        
    } catch (error) {
        console.error('❌ Course accounting test failed:', error);
    }
};

// Test different transaction types for revenue tracking
const testRevenueTypes = async () => {
    console.log('\n💰 Testing Different Revenue Types...');
    
    const transactionTypes = [
        { type: 'game_payment', amount: 15.00, description: 'Standard game fee' },
        { type: 'event_payment', amount: 50.00, description: 'Tournament entry' },
        { type: 'merchandise', amount: 25.00, description: 'Pro shop purchase' },
        { type: 'other', amount: 10.00, description: 'Misc income' }
    ];
    
    for (const txn of transactionTypes) {
        try {
            const response = await fetch('https://par3-admin1.vercel.app/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    course_id: 'wentworth-gc',
                    transaction: {
                        transaction_id: `txn_${txn.type}_${Date.now()}`,
                        player_email: 'testrevenue@example.com',
                        amount: txn.amount,
                        type: txn.type,
                        payment_method: 'card',
                        timestamp: new Date().toISOString(),
                        description: txn.description
                    },
                    action: 'addTransaction'
                })
            });
            
            console.log(`${txn.type}: ${response.status} - ${txn.description} ($${txn.amount})`);
            
        } catch (error) {
            console.error(`❌ ${txn.type} test failed:`, error);
        }
    }
};

// Run all tests
console.log('🚀 Running Course-Based Accounting Tests...');
testCoursePayment();
setTimeout(testCourseAccounting, 1000);
setTimeout(testRevenueTypes, 2000);

console.log('\n📈 Expected Benefits:');
console.log('• Individual course revenue tracking');
console.log('• Saved payment methods for returning players');
console.log('• Transaction history by course');
console.log('• Revenue breakdown by type (games, events, merchandise)');
console.log('• Complete accounting trail for each golf course');
