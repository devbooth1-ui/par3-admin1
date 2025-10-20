// ===== PAR3-ADMIN1 BACKEND TEST =====
// Copy and paste this entire block into your browser console

console.log('🧪 Testing par3-admin1 backend...');

// Test 1: Check what GET /api/players returns
console.log('\n📋 Test 1: GET /api/players');
fetch('https://par3-admin1.vercel.app/api/players')
  .then(response => {
    console.log('✅ GET Status:', response.status);
    return response.text();
  })
  .then(data => {
    console.log('📄 Raw GET Response:', data);
    try {
      const parsed = JSON.parse(data);
      console.log('📊 Parsed GET Data:', parsed);
    } catch(e) {
      console.log('⚠️ Not JSON format');
    }
  })
  .catch(err => console.log('❌ GET Error:', err));

// Test 2: Send test player data
console.log('\n🚀 Test 2: POST test player');
fetch('https://par3-admin1.vercel.app/api/players', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Console Test Player',
    email: 'console@test.com',
    phone: '555-0000',
    action: 'test'
  })
})
.then(response => {
  console.log('✅ POST Status:', response.status);
  return response.json();
})
.then(result => {
  console.log('📝 POST Result:', result);
  
  // Immediately check if data appears
  console.log('\n🔍 Test 3: Check if test player appears');
  return fetch('https://par3-admin1.vercel.app/api/players');
})
.then(response => response.text())
.then(data => {
  console.log('📄 After POST - Raw Response:', data);
  try {
    const parsed = JSON.parse(data);
    console.log('📊 After POST - Parsed Data:', parsed);
  } catch(e) {
    console.log('⚠️ Still not JSON format');
  }
})
.catch(err => console.log('❌ POST/Check Error:', err));

console.log('\n⏳ Tests running... check results above ^');
