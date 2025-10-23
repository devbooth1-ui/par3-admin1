# Par3 Challenge - Dual Development Setup

This workspace allows you to develop both the player frontend and admin backend simultaneously.

## Architecture

- **Player Frontend** (main folder): React/Vite player-facing golf game
- **Admin Backend** (par3-admin1/): Express.js admin system with API endpoints

## Quick Start

1. **Open the workspace:**
   ```bash
   code par3-dual-workspace.code-workspace
   ```

2. **Install dependencies for both projects:**
   ```bash
   # Player frontend
   npm install
   
   # Admin backend  
   cd par3-admin1
   npm install
   cd ..
   ```

3. **Start both projects:**
   - Use VS Code Command Palette: `Tasks: Run Task` → `Start Both (Player + Admin)`
   - Or manually:
     ```bash
     # Terminal 1 - Player Frontend (port 5173)
     npm run dev
     
     # Terminal 2 - Admin Backend (port 3001)  
     cd par3-admin1
     npm run dev
     ```

## URLs

- **Player Game**: http://localhost:5173
- **Admin Backend**: http://localhost:3001  
- **Health Check**: http://localhost:3001/api/health

## Communication Flow

```
Player Frontend (5173) → Admin Backend (3001) → Database
```

- Player makes birdie → Frontend sends to /api/claims → Backend processes
- Admin adds course → Backend updates → Frontend gets geofencing data
- Tournament updates → Backend notifies → Frontend shows to player

## Development

- **Frontend changes**: Edit files in main folder
- **Backend changes**: Edit files in par3-admin1/ folder
- **API changes**: Update adminAPI.js (frontend) and server.js (backend)

Both projects auto-reload on changes.
