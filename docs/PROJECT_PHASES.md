# StayHub - Online House Rental Web Application
A full-stack MERN application connecting property owners, tenants, and administrators.

---

## 📌 Phase 1: Planning, Requirements & System Architecture

### 1.1 Problem Statement
Traditional house rental processes involve intermediaries, lack centralized listings, and present communication gaps between house owners and prospective tenants. StayHub provides an end-to-end digital rental portal with role-based dashboard access, real-time listing management, and transparent booking inquiries.

### 1.2 User Roles & Specifications
- **Tenant / Renter:**
  - Browse verified properties with keyword, city, and category filters.
  - View individual property details (pricing, images, amenities, address).
  - Submit booking inquiries and contact requests directly to property owners.
  - Track booking inquiry statuses via Renter Dashboard.
- **Owner:**
  - Create, edit, and publish residential or commercial rental listings.
  - Upload multiple property images and set pricing terms.
  - Manage all active properties and incoming tenant booking inquiries via Owner Dashboard.
- **Administrator:**
  - Complete control over user management, property listing verification, and system audits.

### 1.3 Tech Stack Selection
- **Frontend:** React.js, React Router DOM, Axios, Modern Responsive CSS.
- **Backend:** Node.js, Express.js (ES Module architecture).
- **Database:** MongoDB Atlas (Mongoose ODM).
- **Hosting & CI/CD:** Vercel (Frontend), Render (Backend), GitHub Actions.

---

## 📌 Phase 2: Database Schema & Backend Architecture

### 2.1 Database Models
- **User Model:** Name, Email, Password (hashed via bcrypt), Role (`user`, `owner`, `admin`), Timestamps.
- **Property Model:** Title, Description, Address, Amount/Rent, Property Type (`Residential`, `Commercial`), Ad Type (`Rent`, `Sale`), Images, Owner Reference (`x-user-id` / `ownerId`), Verification Status.
- **Booking Model:** Property ID, Tenant ID, Owner ID, Move-in Date, Message, Booking Status (`Pending`, `Approved`, `Rejected`).

### 2.2 RESTful API Endpoints
All core endpoints follow the `/api` standard routing:
- **Authentication:**
  - `POST /api/auth/register` - User registration with role selection.
  - `POST /api/auth/login` - Authenticate user and issue JWT token.
- **Properties:**
  - `GET /api/properties` - Retrieve all verified property listings.
  - `POST /api/properties` - Add new property (Requires Owner authentication).
  - `GET /api/properties/my-properties?ownerId=:id` - Fetch listings created by specific owner.
- **Bookings:**
  - `POST /api/bookings` - Submit rental inquiry.
  - `GET /api/bookings/owner-bookings?ownerId=:id` - Fetch inquiries received for owner's properties.
  - `PATCH /api/bookings/:id` - Update booking status.

### 2.3 Cross-Origin Resource Sharing (CORS) Configuration
Configured dynamic origin whitelisting (`localhost:5173`, `localhost:3000`, `house-rent-jaydip18.vercel.app`) along with preflight options and custom header validation (`x-user-id`, `Authorization`, `Content-Type`).

---

## 📌 Phase 3: Frontend Implementation & Integration

### 3.1 Modular Component Hierarchy
- `App.jsx`: Global routing, navigation bar, and route protection.
- `Home.jsx`: Dynamic listing catalogue, search inputs, and category filters.
- `OwnerDashboard.jsx`: Tab-based interface for property creation form, listed inventory, and incoming requests.
- `RenterDashboard.jsx`: Active inquiry tracker for tenants.
- `api.js`: Axios instance configured with base URL and request interceptors appending Bearer tokens.

### 3.2 State Management & Network Layer
- Implemented `useEffect` and React state hooks for responsive data fetching and immediate UI synchronization.
- Centralized Axios interceptors for handling authentication headers (`Authorization: Bearer <token>`) and custom tracking (`x-user-id`).

---

## 📌 Phase 4: Testing, Cloud Deployment & DevOps

### 4.1 Testing & Issue Resolution
- **ES Module Alignment:** Migrated CommonJS syntax to ES Modules (`import`/`export`) in compliance with `"type": "module"` specifications.
- **CORS Preflight Clearance:** Resolved preflight restrictions for custom headers by explicitly enabling `x-user-id` in CORS policy.
- **Environment Parity:** Replaced local development endpoints (`http://localhost:5000`) with cloud endpoints to eliminate connection errors.

### 4.2 Production Deployment Pipeline
- **Backend Deployment:** Hosted on Render (`https://houserent-ayjz.onrender.com`) connected to MongoDB Atlas.
- **Frontend Deployment:** Hosted on Vercel (`https://house-rent-jaydip18.vercel.app`) with continuous integration linked to the GitHub repository.