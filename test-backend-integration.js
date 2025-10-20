// Test Backend Integration - Paste in Browser Console

// 1. Test Player Stats Sync
const testStatsSync = async () => {
  const { adminAPI } = await import('./src/utils/adminAPI.js');
  const playerData = {
    firstName: "Test",
    lastName: "Player", 
    email: "test@example.com",
    phone: "555-0123"
  };
  const stats = {
    totalPoints: 150,
    totalRounds: 3,
    lastReward: "Birdie",
    lastDate: new Date().toLocaleDateString()
  };
  const result = await adminAPI.syncPlayerStats(playerData, stats);
  console.log("Stats sync result:", result);
};

// 2. Test Tournament Registration
const testTournamentReg = async () => {
  const { adminAPI } = await import('./src/utils/adminAPI.js');
  const tournamentData = {
    playerName: "Test Player",
    playerEmail: "test@example.com",
    playerPhone: "555-0123",
    registrationDate: new Date().toISOString(),
    tournamentId: "million-dollar-tournament",
    qualificationPoints: 800
  };
  const result = await adminAPI.registerForTournament(tournamentData);
  console.log("Tournament registration result:", result);
};

// 3. Test Birdie Claim
const testBirdieClaim = async () => {
  const { adminAPI } = await import('./src/utils/adminAPI.js');
  const playerData = {
    firstName: "Test",
    lastName: "Player",
    email: "test@example.com", 
    phone: "555-0123"
  };
  const result = await adminAPI.submitBirdieClaim(playerData, "Red shirt, blue pants", "2025-10-19 2:30 PM");
  console.log("Birdie claim result:", result);
};

// Run tests
console.log("Backend integration test functions loaded!");
console.log("Run: testStatsSync(), testTournamentReg(), or testBirdieClaim()");
