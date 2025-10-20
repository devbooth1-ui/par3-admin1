// Test script to explore accounting/course structure options
// Run this in browser console

console.log('🏌️ Testing Course/Accounting Structure...');

const testAccountingEndpoints = async () => {
    const endpoints = [
        '/api/transactions',
        '/api/accounting', 
        '/api/course-transactions',
        '/api/payments',
        '/api/revenue'
    ];
    
    for (const endpoint of endpoints) {
        try {
            console.log(`\n📊 Testing ${endpoint}...`);
            
            const response = await fetch(`https://par3-admin1.vercel.app${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    course_id: 'wentworth-gc',
                    transaction_type: 'game_payment',
                    amount: 15.00,
                    player_email: 'test@example.com',
                    payment_method: 'card',
                    timestamp: new Date().toISOString()
                })
            });
            
            console.log(`${endpoint}: ${response.status}`);
            
            if (response.status !== 404) {
                const data = await response.json();
                console.log(`✅ ${endpoint} response:`, data);
            }
            
        } catch (error) {
            console.error(`❌ Error with ${endpoint}:`, error);
        }
    }
};

// Test course structure
const testCourseStructure = async () => {
    console.log('\n🏌️ Testing Course Data Structure...');
    
    try {
        const response = await fetch('https://par3-admin1.vercel.app/api/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                course_id: 'wentworth-gc',
                course_name: 'Wentworth Golf Club',
                location: 'Surrey, UK',
                accounting: {
                    total_revenue: 0,
                    transactions_count: 0,
                    last_updated: new Date().toISOString()
                },
                transaction_types: ['game_payment', 'event_payment', 'merchandise', 'other']
            })
        });
        
        console.log('Course structure test:', response.status);
        const data = await response.json();
        console.log('Course response:', data);
        
    } catch (error) {
        console.error('Course test error:', error);
    }
};

testAccountingEndpoints();
testCourseStructure();
