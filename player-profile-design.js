// Player Profile Data Structure - Complete View
// This shows what data should be displayed on the detailed player page

const playerProfileStructure = {
    // HEADER SECTION - Quick Overview
    basicInfo: {
        name: "John Doe",
        email: "john@email.com", 
        phone: "555-123-4567",
        memberSince: "2025-01-15",
        totalPoints: 250,
        status: "Active",
        avatar: "/avatars/john-doe.jpg"
    },

    // GAMING ACTIVITY - Left Column
    gameActivity: {
        totalGamesPlayed: 15,
        coursesPlayed: [
            {
                courseId: "wentworth-gc",
                courseName: "Wentworth Golf Club",
                gamesPlayed: 12,
                totalSpent: 96.00,
                bestScore: "Birdie",
                lastPlayed: "2025-10-19"
            },
            {
                courseId: "royal-oak",
                courseName: "Royal Oak Golf",
                gamesPlayed: 3,
                totalSpent: 24.00,
                bestScore: "Par", 
                lastPlayed: "2025-10-10"
            }
        ],
        achievements: [
            { type: "birdie", count: 3, points: 600 },
            { type: "hole_in_one", count: 1, points: 800 },
            { type: "par", count: 11, points: 550 }
        ]
    },

    // FINANCIAL HISTORY - Center Column  
    financialActivity: {
        totalSpent: 120.00,
        averagePerGame: 8.00,
        paymentMethods: [
            { method: "card", usage: 80, saved: true },
            { method: "apple_pay", usage: 20, saved: false }
        ],
        recentTransactions: [
            {
                date: "2025-10-19",
                amount: 8.00,
                type: "game_payment",
                course: "Wentworth GC",
                method: "card"
            },
            {
                date: "2025-10-15", 
                amount: 50.00,
                type: "tournament_entry",
                course: "Wentworth GC",
                method: "apple_pay"
            }
        ]
    },

    // TOURNAMENT & EVENTS - Right Column
    tournamentActivity: {
        tournamentsEntered: 2,
        tournamentsWon: 0,
        currentQualificationPoints: 250,
        qualificationStatus: "Qualified for Million Dollar Shootout",
        upcomingEvents: [
            {
                eventName: "Million Dollar Shootout",
                date: "2025-11-15",
                status: "qualified",
                entryFee: 0
            }
        ],
        pastEvents: [
            {
                eventName: "October Challenge", 
                date: "2025-10-01",
                placement: "5th",
                winnings: 0
            }
        ]
    },

    // CLAIMS & VERIFICATION - Bottom Section
    claimsActivity: {
        totalClaims: 4,
        verifiedClaims: 3,
        pendingClaims: 1,
        claimHistory: [
            {
                claimId: "claim_123",
                type: "birdie",
                date: "2025-10-19",
                course: "Wentworth GC", 
                hole: 1,
                status: "verified",
                prize: "$65 Club Card"
            },
            {
                claimId: "claim_124",
                type: "hole_in_one", 
                date: "2025-10-15",
                course: "Wentworth GC",
                hole: 1,
                status: "pending_verification",
                prize: "$1000 Cash"
            }
        ]
    },

    // CUSTOMER SERVICE - Action Items
    adminActions: {
        notes: "VIP customer - responds well to email promos",
        tags: ["high_value", "tournament_player", "returning_customer"],
        communicationPreferences: {
            email: true,
            sms: false, 
            push: true
        },
        quickActions: [
            "Send Tournament Invitation",
            "Apply Bonus Points",
            "Verify Pending Claims",
            "Send Course Specials"
        ]
    }
};

// UI LAYOUT STRUCTURE
const playerProfileLayout = `
┌─────────────────────────────────────────────────────────────────┐
│ 👤 JOHN DOE                    📧 john@email.com    🏆 250 pts │
│ Member Since: Jan 2025         📱 555-123-4567      ✅ Active  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 🎮 GAME ACTIVITY    │  💳 FINANCIALS     │  🏆 TOURNAMENTS    │
│                     │                    │                     │
│ • 15 Games Played   │  • $120 Total      │  • 2 Entered       │
│ • 2 Courses         │  • $8 Average      │  • Qualified ✅    │
│ • 3 Birdies 🥇     │  • Card Saved 💳   │  • Next: Nov 15     │
│ • 1 Hole-in-One 🏆  │  • 80% Card Usage  │  • 250 Qual Points │
│                     │                    │                     │
│ [View Course Stats] │  [Payment History] │  [Tournament Log]   │
├─────────────────────────────────────────────────────────────────┤
│ 📋 RECENT CLAIMS                                               │
│ • Oct 19: Birdie @ Wentworth - ✅ Verified - $65 Club Card    │
│ • Oct 15: Hole-in-One @ Wentworth - ⏳ Pending - $1000 Cash  │
│                                           [Verify Claims]      │
├─────────────────────────────────────────────────────────────────┤
│ 🛠️ ADMIN ACTIONS                                              │
│ [Send Invite] [Add Points] [Verify Claims] [Send Specials]     │
└─────────────────────────────────────────────────────────────────┘
`;

console.log('Player Profile Structure:', playerProfileStructure);
console.log('Layout Design:', playerProfileLayout);
