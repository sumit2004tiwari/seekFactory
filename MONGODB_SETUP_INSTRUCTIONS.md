# 🚀 MongoDB Backend Setup Instructions

## ✅ Frontend Updated - Ready for MongoDB!

Your frontend has been updated to connect directly to your MongoDB database instead of localStorage.

## 🔧 Start Your MongoDB Backend Server

**Open a new terminal and run:**

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 5000
🌍 Environment: development
✅ MongoDB Connected: seekfactory.m8efxko.mongodb.net
```

## 🗑️ Clear Old Demo Data (Optional)

If you want to start fresh and remove any localStorage demo data:

**Open browser DevTools → Console and run:**
```javascript
localStorage.removeItem('demo_users');
localStorage.removeItem('demo_current_user');
localStorage.removeItem('auth_token');
location.reload();
```

## ✅ Test MongoDB Authentication

### 1. **"Join as a Supplier" Flow:**
1. Go to `/auth` or click "Join as a Supplier"
2. Fill out the registration form:
   - **Name**: Your full name
   - **Company Name**: Your business name  
   - **Business Type**: e.g., "Manufacturing"
   - **Role**: Select "Supplier"
   - **Email**: Your email address
   - **Password**: Secure password (min 6 chars, uppercase, lowercase, number)
3. Click "Create Account"
4. User will be stored in MongoDB and auto-logged in

### 2. **Login with Registered Account:**
- Use the email and password you just created
- Data is retrieved from MongoDB database

## 🔍 Verify MongoDB Connection

### **Backend Console Logs:**
- `✅ MongoDB Connected: [connection host]`
- `User registered successfully`
- `Login successful`

### **Browser Console Logs:**
- `✅ MongoDB Backend connected successfully!`
- No localStorage fallback messages

### **Database Verification:**
Your users will be stored in MongoDB at:
- **Database**: SeekFactory
- **Collection**: users
- **Connection**: seekfactory.m8efxko.mongodb.net

## 🚨 Troubleshooting

### **"Backend server not available" Error:**
1. Make sure you're running `npm run dev` in the `backend` folder
2. Backend should be running on `http://localhost:5000`
3. Check that port 5000 is not blocked

### **MongoDB Connection Issues:**
1. Verify your IP is whitelisted in MongoDB Atlas
2. Check that the connection string is correct
3. Ensure your database user has proper permissions

### **CORS Issues:**
The backend is configured to accept connections from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative React port)

## 📊 Database Schema

**User Document Structure:**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ('buyer' | 'supplier'),
  companyName: String,
  businessType: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  isVerified: Boolean,
  isActive: Boolean,
  avatar: String,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 Next Steps

Once the backend is running:
1. ✅ Test user registration
2. ✅ Test user login
3. ✅ Test profile updates
4. ✅ Verify data persistence in MongoDB
5. ✅ Test role-based access (supplier vs buyer features)

---

**🎉 Your SeekFactory platform is now connected to MongoDB!**
