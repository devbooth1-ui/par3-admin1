// Backend Integration for Player Deletion
// Functions to connect the preview to actual par3-admin1 backend

import { adminAPI } from '../utils/adminAPI';

export const playerDeletionAPI = {
    // Delete single player from backend
    deletePlayer: async (playerEmail) => {
        try {
            console.log(`🗑️ Deleting player: ${playerEmail}`);
            
            const response = await fetch('https://par3-admin1.vercel.app/api/players', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: playerEmail,
                    action: 'deletePlayer',
                    confirmDelete: true
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Player deleted from backend:', result);
                return { success: true, result };
            } else {
                console.log('❌ Failed to delete from backend:', response.status);
                return { success: false, error: `Backend error: ${response.status}` };
            }
            
        } catch (error) {
            console.error('❌ Delete player error:', error);
            return { success: false, error: error.message };
        }
    },

    // Bulk delete multiple players
    bulkDeletePlayers: async (playerEmails) => {
        try {
            console.log(`🗑️ Bulk deleting ${playerEmails.length} players...`);
            
            const results = [];
            for (const email of playerEmails) {
                const result = await playerDeletionAPI.deletePlayer(email);
                results.push({ email, ...result });
                
                // Small delay between deletions to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            
            const successful = results.filter(r => r.success).length;
            const failed = results.filter(r => !r.success).length;
            
            console.log(`✅ Bulk delete complete: ${successful} successful, ${failed} failed`);
            
            return {
                success: failed === 0,
                successful,
                failed,
                results
            };
            
        } catch (error) {
            console.error('❌ Bulk delete error:', error);
            return { success: false, error: error.message };
        }
    },

    // Get current players from backend for testing
    getCurrentPlayers: async () => {
        try {
            const response = await fetch('https://par3-admin1.vercel.app/api/players');
            if (response.ok) {
                const players = await response.json();
                console.log(`📊 Current players in backend: ${players.length}`);
                return players;
            }
            return [];
        } catch (error) {
            console.error('❌ Failed to get players:', error);
            return [];
        }
    }
};

// Console commands for testing deletion
if (typeof window !== 'undefined') {
    // Make available in browser console for testing
    window.testPlayerDeletion = playerDeletionAPI;
    
    console.log(`
🧪 PLAYER DELETION TESTING COMMANDS:

// Get current players from backend
testPlayerDeletion.getCurrentPlayers()

// Delete a single player
testPlayerDeletion.deletePlayer('test@example.com')

// Bulk delete multiple players  
testPlayerDeletion.bulkDeletePlayers(['test1@example.com', 'test2@example.com'])

// Example usage:
testPlayerDeletion.getCurrentPlayers().then(players => {
    console.log('Current players:', players.map(p => p.email));
});
    `);
}
