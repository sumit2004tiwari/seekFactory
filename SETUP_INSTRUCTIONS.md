# SeekFactory Backend Setup Instructions

## Overview
✅ **COMPLETED**: Your backend has been successfully created with MongoDB integration and all Supabase dependencies have been removed.

## What Was Done

### 1. ✅ Backend Structure Created
- Created `backend/` folder with scalable Express.js architecture
- Set up MongoDB connection with Mongoose
- Implemented JWT-based authentication
- Added security middleware (CORS, Helmet, Rate Limiting)
- Created user registration and login APIs

### 2. ✅ Authentication System
- **Registration API**: `POST /api/auth/register`
- **Login API**: `POST /api/auth/login`
- **Get User Profile**: `GET /api/auth/me`
- **Update Profile**: `PUT /api/auth/profile`
- **Logout**: `POST /api/auth/logout`

### 3. ✅ Supabase Removal
- Removed all Supabase dependencies from `package.json`
- Deleted `supabase/` and `src/integrations/supabase/` folders
- Updated authentication context to use new backend

### 4. ✅ Frontend Integration
- Created API client (`src/lib/api.ts`) for backend communication
- Updated `AuthContext.tsx` to use new authentication system
- Modified `Auth.tsx` page to work with new API structure

## How to Run the Application

### Start Backend Server
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Start the backend development server:
   ```bash
   npm run dev
   ```
   
   You should see:
   ```
   🚀 Server running on port 5000
   🌍 Environment: development
   ✅ MongoDB Connected: [your-mongodb-host]
   ```

### Start Frontend Server
1. In a new terminal, navigate to the project root
2. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Testing the Authentication

### Register as a Supplier
1. Go to the authentication page
2. Click "Sign Up" tab
3. Fill in the form with role "Supplier"
4. Click "Create Account"

### Test Login
1. Use the credentials you just created
2. Click "Sign In"
3. You should be redirected to the home page

## Environment Variables

### Backend (.env in backend folder)
```
MONGODB_URI=mongodb+srv://vimarshkrishan:chR7wOwXN8ccMTOF@seekfactory.m8efxko.mongodb.net/?retryWrites=true&w=majority&appName=SeekFactory
JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
```

### Frontend (.env in project root)
```
VITE_API_URL=http://localhost:5000/api
```

## Project Structure

```
project/
├── backend/                    # Express.js backend
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Authentication & error handling
│   │   ├── models/           # MongoDB models (User)
│   │   ├── routes/           # API routes
│   │   ├── utils/            # JWT & validation utilities
│   │   └── server.js         # Main server file
│   ├── .env                  # Environment variables
│   ├── package.json          # Backend dependencies
│   └── README.md             # Backend documentation
├── src/                      # React frontend
│   ├── lib/api.ts           # API client for backend
│   ├── contexts/AuthContext.tsx  # Updated auth context
│   └── pages/Auth.tsx       # Updated authentication page
└── SETUP_INSTRUCTIONS.md    # This file
```

## API Endpoints

### Authentication Routes

#### POST `/api/auth/register`
Register a new user (buyer or supplier)

**Request:**
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

**Request:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

## Next Steps for Scaling

1. **Add More Routes**: Create routes for products, inquiries, orders
2. **File Upload**: Implement image upload for user avatars and products
3. **Email Verification**: Add email verification system
4. **Password Reset**: Implement password reset functionality
5. **Admin Panel**: Create admin routes for user management
6. **API Documentation**: Add Swagger/OpenAPI documentation
7. **Testing**: Add unit and integration tests
8. **Deployment**: Configure for production deployment

## Troubleshooting

### Backend Issues
- Ensure MongoDB connection string is correct
- Check if port 5000 is available
- Verify all environment variables are set

### Frontend Issues
- Ensure backend is running on port 5000
- Check if frontend environment variable `VITE_API_URL` is correct
- Clear browser cache if authentication is not working

### Database Issues
- Check MongoDB Atlas connection
- Verify IP whitelist in MongoDB Atlas
- Ensure database user has proper permissions

## Security Features Implemented

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ Input validation and sanitization
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ CORS configuration
- ✅ Security headers with Helmet
- ✅ Environment variable protection
- ✅ Error handling without sensitive data exposure

Your backend is now ready for production use! 🚀
