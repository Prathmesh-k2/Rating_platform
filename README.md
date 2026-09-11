# Online Rating Platform

A full-stack role-based rating system where users can browse stores and submit ratings/reviews, store owners can monitor feedback, and admins can manage users/stores.

## Tech Stack

- **Frontend:** React, React Router, Axios, Vite
- **Backend:** Node.js, Express, JWT, Joi, bcrypt, mysql2
- **Database:** MySQL

## Repository Structure

```text
Rating_platform/
├── Backend/
│   ├── createAdmin.js
│   ├── server.js
│   ├── package.json
│   └── src/
│       ├── config/
│       │   ├── database.js
│       │   ├── db.js
│       │   └── store_rating_db_erd.png
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       └── validators/
├── Frontend/
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── services/
│       ├── context/
│       └── components/
└── README.md
```

## Detailed File Guide

### Root

- **`README.md`**: Project overview, setup, and file-level documentation.

---

### Backend

#### Entry and scripts

- **`Backend/server.js`**
  - Initializes Express app.
  - Configures CORS and JSON middleware.
  - Mounts API routes under `/api/*`.
  - Starts server and checks DB connectivity.

- **`Backend/createAdmin.js`**
  - Creates or updates a default admin user in the database.
  - Useful for first-time setup/testing.

- **`Backend/package.json`**
  - Dependencies and scripts.
  - Main script: `npm start`.

#### Config

- **`Backend/src/config/database.js`**
  - MySQL pool configuration using environment variables.
  - Exposes `pool` and a reusable `query()` helper.

- **`Backend/src/config/db.js`**
  - SQL schema reference kept as commented SQL (users, stores, ratings, indexes).

- **`Backend/src/config/store_rating_db_erd.png`**
  - Database ER diagram image.

#### Routes (`Backend/src/routes`)

- **`auth.js`**: Auth endpoints.
  - `POST /api/auth/signup`
  - `POST /api/auth/login`

- **`admin.js`**: Admin-protected endpoints.
  - Dashboard, user CRUD, store CRUD.

- **`stores.js`**: Store listing/search for users.
  - `GET /api/stores`
  - `GET /api/stores/search`

- **`ratings.js`**: Rating create/update endpoint.
  - `POST /api/ratings`

- **`storeOwner.js`**: Store-owner dashboard endpoint.
  - `GET /api/store-owner/dashboard`

#### Controllers (`Backend/src/controllers`)

- **`authController.js`**: Signup/login logic, password hashing, JWT issuance.
- **`adminController.js`**: Admin dashboard metrics, user management, store management.
- **`storeController.js`**: Store fetch/search with aggregate rating data.
- **`ratingController.js`**: Upsert user rating per store.
- **`storeOwnerController.js`**: Owner dashboard (owned stores + recent feedback).

#### Middleware (`Backend/src/middleware`)

- **`auth.js`**: JWT verification middleware, attaches `req.user`.
- **`authorize.js`**: Role-based authorization helper.

#### Validators (`Backend/src/validators`)

- **`authValidator.js`**: Joi validation for signup payload.
- **`userValidator.js`**: Basic user payload validation helper.

---

### Frontend

#### Entry and app shell

- **`Frontend/src/main.jsx`**: React app bootstrap.
- **`Frontend/src/App.jsx`**: Main routing configuration (login/signup/admin/owner/user routes).
- **`Frontend/src/index.css`**: Global and component-level styling.
- **`Frontend/package.json`**: Frontend scripts and dependencies (`dev`, `build`, `preview`).

#### Services and state

- **`Frontend/src/services/api.js`**
  - Shared Axios client.
  - Adds JWT token from localStorage in request interceptor.

- **`Frontend/src/context/AuthContext.jsx`**
  - Global auth state provider.
  - Exposes `login`, `signup`, `logout`, `user`, `token`.

#### Components (`Frontend/src/components`)

- **Auth**
  - `Auth/Login.jsx`: Login form and role-based post-login navigation.
  - `Auth/Signup.jsx`: Signup form with client-side validation.
  - `Auth/ProtectedRoute.jsx`: Route guard with role checks.

- **Admin**
  - `Admin/AdminLayout.jsx`: Admin shell layout using Navbar/Footer.
  - `Admin/Dashboard.jsx`: Platform totals + recent activity.
  - `Admin/UserManagement.jsx`: User listing/filtering/sorting/delete.
  - `Admin/UserForm.jsx`: Create/edit user modal form.
  - `Admin/StoreManagement.jsx`: Store listing/sorting/create/edit/delete.

- **Owner**
  - `Owner/StoreOwnerDashboard.jsx`: Owner stores + recent feedback view.

- **User**
  - `User/StoreList.jsx`: Browse stores and submit/update ratings.

- **Common**
  - `Common/Navbar.jsx`: Top navigation with links and logout.
  - `Common/Footer.jsx`: Shared footer.

- **`components/ProtectedRoute.jsx`**
  - Alternative/legacy protected-route implementation.
  - Current app imports `components/Auth/ProtectedRoute.jsx` from `App.jsx`.

## Authentication and Roles

Roles used across backend and frontend:

- `admin`
- `owner`
- `user`

Access is enforced with JWT auth middleware on backend and protected routes on frontend.

## Local Setup

## 1) Prerequisites

- Node.js 18+
- MySQL server

## 2) Backend setup

1. Go to backend:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` in `Backend/`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=store_rating_platform
   JWT_SECRET=your_jwt_secret
   ```
4. Create database tables using SQL from `src/config/db.js`.
5. (Optional) Create default admin:
   ```bash
   node createAdmin.js
   ```
6. Run backend:
   ```bash
   npm start
   ```

## 3) Frontend setup

1. Open a new terminal and go to frontend:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run frontend:
   ```bash
   npm run dev
   ```
4. Open the Vite URL shown in terminal (typically `http://localhost:5173`).

## Notes

- CORS in backend currently allows local frontend origins (`http://localhost:5173`, `http://localhost:3000`).
- API base URL in frontend is currently hardcoded to `http://localhost:5000/api`.
