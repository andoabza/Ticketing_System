# Role-Based Ticketing System

A full-stack web application for managing support tickets with role-based access control (RBAC). Built with Node.js/Express backend and React frontend.

## Features

### Backend
- 🛡️ JWT Authentication
- 👥 Role-based access (Admin/Staff/User)
- 🎫 Ticket management (Create/View)
- 🔒 Protected API endpoints
- 📦 MongoDB data storage
- 🔑 Password hashing with bcrypt

### Frontend
- 🚀 React-based UI with Bootstrap
- 🔐 Login/Logout functionality
- 📋 Ticket listing and creation
- 👮♂️ Role-specific views
- 📱 Responsive design
- 🔄 Context API for state management

## Technologies Used

- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **Frontend**: React, React Router, Axios, Bootstrap
- **Tools**: Postman, MongoDB Compass

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- NPM/Yarn

### Backend Setup
```
# Clone repository
git clone https://github.com/yourusername/ticketing-system.git
cd ticketing-system/backend

# Install dependencies
npm install

# Create .env file
echo "PORT=5000
MONGODB_URI=mongodb://localhost:27017/ticketing_system
JWT_SECRET=your_jwt_secret_key" > .env

# Start server
npm start