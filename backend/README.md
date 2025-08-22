# SeekFactory Backend API

## Overview
This is the backend API for the SeekFactory platform, built with Express.js and MongoDB.

## Features
- User authentication (register/login)
- JWT-based authorization
- MongoDB integration with Mongoose
- Input validation and sanitization
- Security middleware (helmet, cors, rate limiting)
- Error handling
- User profile management

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance

### Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   PORT=5000
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/register`
Register a new user (buyer or supplier)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "role": "supplier",
  "companyName": "Acme Corp",
  "businessType": "Manufacturing",
  "phone": "+1234567890"
}
```

#### POST `/api/auth/login`
Login existing user

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### GET `/api/auth/me`
Get current user profile (Protected)

#### POST `/api/auth/logout`
Logout user (Protected)

#### PUT `/api/auth/profile`
Update user profile (Protected)

## Project Structure
```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   ├── utils/
│   │   ├── jwt.js
│   │   └── validation.js
│   └── server.js
├── .env
├── package.json
├── nodemon.json
└── README.md
```

## Security Features
- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Security headers with Helmet
- Error handling without sensitive data exposure

## Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRES_IN`: JWT token expiration time
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
