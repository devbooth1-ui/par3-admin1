// Prize configuration for PAR3 Challenge
// Update values here and they will be reflected throughout the app

export const PRIZE_CONFIG = {
    // Prize amounts
    BIRDIE_AMOUNT: 65,
    HOLE_IN_ONE_AMOUNT: 1000,
    PAR_POINTS: 50,
    BIRDIE_POINTS: 200,
    HOLE_IN_ONE_POINTS: 1000,

    // Prize descriptions
    BIRDIE_DESCRIPTION: "$65 Club Card + 200 Points + Towards $1Million Dollar Tournament",
    HOLE_IN_ONE_DESCRIPTION: "$1,000 CASH* + Instant Qualification for the $1 Million Tournament",
    PAR_DESCRIPTION: "50 Points + Towards $1Million Dollar Tournament",
    BOGEY_DESCRIPTION: "50 Points + Towards $1Million Dollar Tournament",

    // Formatted display strings
    get BIRDIE_PRIZE_DISPLAY() {
        return `$${this.BIRDIE_AMOUNT} Club Card`;
    },

    get HOLE_IN_ONE_PRIZE_DISPLAY() {
        return `$${this.HOLE_IN_ONE_AMOUNT} CASH*`;
    },

    get BIRDIE_FULL_DISPLAY() {
        return `$${this.BIRDIE_AMOUNT} Club Card + ${this.BIRDIE_POINTS} Points + Towards $1Million Dollar Tournament`;
    },

    get HOLE_IN_ONE_FULL_DISPLAY() {
        return `$${this.HOLE_IN_ONE_AMOUNT} CASH* + Instant Qualification for the $1 Million Tournament`;
    }
};

export default PRIZE_CONFIG;
