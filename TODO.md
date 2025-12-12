# Modex Assessment Alignment - TODO List

## Backend Updates (Node.js + Express + Postgres)

### 1. Database Integration
- [ ] Install pg (PostgreSQL client) dependency
- [ ] Create database connection module
- [ ] Create database schema (shows, bookings tables)
- [ ] Update seed function to use database
- [ ] Replace in-memory Maps with database queries

### 2. Admin Endpoints
- [ ] POST /api/admin/shows - Create new show/trip
- [ ] GET /api/admin/shows - List all shows with admin details
- [ ] PUT /api/admin/shows/:id - Update show details
- [ ] DELETE /api/admin/shows/:id - Delete show

### 3. Booking Status & Expiry
- [ ] Update booking schema to include status (PENDING, CONFIRMED, FAILED)
- [ ] Update booking creation to set PENDING initially
- [ ] Add booking confirmation logic
- [ ] Implement booking expiry (mark FAILED after 2 minutes)
- [ ] Add background job/cleanup for expired bookings

### 4. Show Schema Updates
- [ ] Add start_time field to shows
- [ ] Update seed data with start times
- [ ] Update API responses to include start_time

### 5. API Documentation
- [ ] Create Postman collection JSON file
- [ ] Update README with API documentation

## Frontend Updates (React + TypeScript)

### 6. TypeScript Conversion
- [ ] Rename .jsx files to .tsx
- [ ] Add TypeScript interfaces for API responses
- [ ] Update component props with proper typing
- [ ] Fix any TypeScript compilation errors

### 7. Routing Implementation
- [ ] Install react-router-dom
- [ ] Create routing structure (/ , /admin, /booking/:id)
- [ ] Update App component to use Router
- [ ] Create separate pages for each route

### 8. Context API State Management
- [ ] Create AppContext for global state
- [ ] Implement authentication context (mock)
- [ ] Add show/trip data context
- [ ] Add booking state context

### 9. Detailed Booking Page
- [ ] Create BookingPage component (/booking/:id)
- [ ] Implement seat selection grid for bus/movie
- [ ] Add DOM manipulation for seat highlighting
- [ ] Add booking confirmation flow

### 10. Admin Dashboard Enhancements
- [ ] Add form for creating new shows
- [ ] Add list of all shows with edit/delete
- [ ] Implement form validation
- [ ] Add error handling for API calls

### 11. Error Handling & UI Improvements
- [ ] Add loading states for all API calls
- [ ] Implement error boundaries
- [ ] Add user-friendly error messages
- [ ] Add empty states for lists
- [ ] Make responsive design

## Deployment & Documentation

### 12. Backend Deployment
- [ ] Choose hosting platform (Render/Railway)
- [ ] Set up Postgres database
- [ ] Deploy backend with environment variables
- [ ] Test deployed API endpoints

### 13. Frontend Deployment
- [ ] Choose hosting platform (Vercel/Netlify)
- [ ] Build and deploy frontend
- [ ] Configure API base URL for deployed backend
- [ ] Test deployed frontend

### 14. System Design Document
- [ ] Write scaling document (architecture, database design, concurrency, caching)
- [ ] Include basic architecture diagram
- [ ] Document production considerations

### 15. Video Submission Preparation
- [ ] Record deployment explanation video
- [ ] Record feature walkthrough video
- [ ] Upload videos to YouTube/drive
- [ ] Test video links

## Testing & Validation

### 16. Final Testing
- [ ] Test all booking flows
- [ ] Test concurrency with load testing
- [ ] Test admin functionality
- [ ] Validate deployed URLs work
- [ ] Ensure no console errors

### 17. Documentation Updates
- [ ] Update README with deployment URLs
- [ ] Add screenshots/GIFs
- [ ] Final submission checklist
