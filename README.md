# Online Rating Platform

A full-stack web application designed for users to rate and review stores. The system features multi-role authentication consisting of Administrators, Store Owners, and Normal Users, providing a seamless overview and management system for various locations.

## 🛠 Project Structure

This project is separated into a frontend and a backend workspace.

- `/Frontend` - React-based user interface.
- `/Backend` - Node.js and Express backend API.

### Technology Stack

* **Frontend**: React.js, React Router
* **Backend**: Node.js, Express.js, bcrypt for password hashing
* **Database**: MySQL 

---

## 🚀 Key Features

### Admin Functionality
* Comprehensive Dashboard displaying active statistics and recent actions (newest users, stores, and ratings).
* Full User Management capabilities (Add, Edit, Delete, Categorize by Roles).
* Full Store Management capabilities (Link to Store Owners, Edit, Delete).

### Store Owner Functionality
* Personal Dashboard showing owned stores.
* View recent feedback and review scores given by users.

### User Functionality
* Browse a list of available stores.
* Leave scores and detailed text reviews for store services.

---

## 💻 Running the Application Locally

### Prerequisites
- Node.js (v18+)
- MySQL Server

### 1. Database Setup
1. Execute the database schema setup inside your MySQL environment (schema definitions are found internally).
2. Inside the `/Backend` directory, create a `.env` file containing your credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=store_rating_platform
```

### 2. Backend Server
1. Open a terminal and navigate to the `/Backend` folder.
2. Install dependencies: `npm install`
3. Optional: Run the seeder to populate sample data: `node src/seed2.js`
4. Start the server: `npm start` *(or `npm run dev` if nodemon is configured)*

### 3. Frontend Application
1. Open a second terminal window and navigate to the `/Frontend` folder.
2. Install dependencies: `npm install`
3. Start the application: `npm start` or `npm run dev`

The platform will launch in your browser, defaulting securely to the login screen.
