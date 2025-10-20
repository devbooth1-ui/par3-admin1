// Test script to check available payment endpoints on par3-admin1
// Run this in browser console to see payment storage options

console.log('🔍 Testing Payment Endpoints...');

const testEndpoints = [
    '/api/payments',
    '/api/payment', 
    '/api/players',
    '/api/transactions',
    '/api/orders'
];

const testEndpoint = async (endpoint) => {
    try {
        console.log(`\n📍 Testing GET ${endpoint}...`);
        const getResponse = await fetch(`https://par3-admin1.vercel.app${endpoint}`);
        console.log(`GET ${endpoint}: ${getResponse.status}`);
        
        if (getResponse.status === 200) {
            const getData = await getResponse.json();
            console.log(`✅ GET ${endpoint} data:`, getData);
        }
        
        console.log(`📍 Testing POST ${endpoint}...`);
        const postResponse = await fetch(`https://par3-admin1.vercel.app${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ test: 'payment data' })
        });
        console.log(`POST ${endpoint}: ${postResponse.status}`);
        
        if (postResponse.status !== 404) {
            const postData = await postResponse.json();
            console.log(`✅ POST ${endpoint} response:`, postData);
        }
        
    } catch (error) {
        console.error(`❌ Error testing ${endpoint}:`, error);
    }
};

// Test all endpoints
testEndpoints.forEach(endpoint => testEndpoint(endpoint));

console.log('\n🎯 Payment Storage Analysis:');
console.log('- Check which endpoints return 200 vs 404');
console.log('- Look for endpoints that accept payment data');
console.log('- Current setup uses /api/players with payment info embedded');
