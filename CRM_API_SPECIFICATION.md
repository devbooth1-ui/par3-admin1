# CRM API Specification for par3-admin1.vercel.app

## Overview
The CRM system should be implemented in par3-admin1.vercel.app backend with the following endpoints:

## Required API Endpoints

### 1. Players Management
```
GET /api/players
- Returns all players from game activities
- Players auto-populate from payment submissions and gameplay

POST /api/players 
- Manually add a player (admin only)

PUT /api/players/:id
- Update player information

DELETE /api/players/:id  
- Remove player from system
```

### 2. Courses Management (CRM Source)
```
GET /api/courses
- Returns all golf courses

POST /api/courses
- Add new golf course (this populates CRM)
- Body: {
    name: string,
    location: string, 
    contact_name: string,
    contact_email: string,
    contact_phone: string,
    pricing_model: 'standard' | 'custom',
    notes: string
  }

PUT /api/courses/:id
- Update course information

DELETE /api/courses/:id
- Remove course
```

### 3. CRM/Customers (from Course entries)
```
GET /api/customers
- Returns customers (derived from course contact info)

POST /api/customers
- Manually add customer

PUT /api/customers/:id  
- Update customer

DELETE /api/customers/:id
- Remove customer
```

### 4. Data Flow

#### Players Population:
- Auto-created when payment is processed
- Auto-updated when claims are submitted  
- Auto-tracked during gameplay sessions

#### CRM Population:
- Manual entry via "Add Course" form
- Course contact becomes CRM customer
- Pricing models tracked per course

#### Communications Test:
- Payment submissions → Player records
- Birdie claims → Claim records + Player updates
- Course additions → CRM customer records

## Current Communication Status
✅ Claims submission working
✅ Player data recording working  
❌ CRM functions need to be implemented in par3-admin1
❌ Course management needs backend implementation

## Next Steps
1. Implement these endpoints in par3-admin1.vercel.app
2. Test player population from game activities
3. Test CRM population from course additions
4. Verify edit/delete functionality works
5. Ensure proper data relationships between players and courses
