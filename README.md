# HouseRent - MERN Full-Stack Project

A house rental management system built for a MERN stack internship project.

## Features
- User registration and JWT login
- Role-based User/Admin access
- Property listing and browsing
- Search and filters by location, type and price
- Owner property management (CRUD)
- Admin property approval/rejection
- Booking/request system
- User and admin dashboards
- MongoDB with Mongoose
- React + Bootstrap responsive UI

## Requirements
- Node.js 18+
- MongoDB local or MongoDB Atlas
- Git

## 1. Backend setup

```bash
cd backend
npm install
```

Create `.env` from `.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/house_rent
JWT_SECRET=change_this_to_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

Start backend:

```bash
npm run dev
```

Create the demo admin:

```bash
npm run create-admin
```

Admin login:
- Email: admin@houserent.com
- Password: Admin@12345

Change the password before using the project publicly.

## 2. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL shown by Vite, normally:
`http://localhost:5173`

## 3. Recommended demo flow
1. Register a normal user.
2. Login.
3. Add a property from Dashboard.
4. Login as admin and approve the property.
5. Open Home and search/filter the approved property.
6. Login as another user and create a booking request.
7. Open the owner's dashboard to see the booking.

## Folder structure

```text
HouseRent-MERN/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── server.js
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

## GitHub upload

From the project root:

```bash
git init
git add .
git commit -m "Initial HouseRent MERN project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/house-rent-mern.git
git push -u origin main
```

Do NOT upload `.env` or real passwords/secrets.
