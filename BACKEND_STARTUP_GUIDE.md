# 🚀 Start MongoDB Backend Server

## ⚡ Quick Start (Copy & Paste)

**Open a new terminal and run:**

```bash
cd backend && npm run dev
```

## 📋 Step-by-Step Instructions

### 1. **Open Terminal**
- **Windows**: Press `Win + R`, type `cmd`, press Enter
- **Mac**: Press `Cmd + Space`, type "Terminal", press Enter  
- **Linux**: Press `Ctrl + Alt + T`

### 2. **Navigate to Backend Directory**
```bash
cd backend
```

### 3. **Start the Server**
```bash
npm run dev
```

### 4. **Success Indicators**
You should see:
```
🚀 Server running on port 5000
🌍 Environment: development  
✅ MongoDB Connected: seekfactory.m8efxko.mongodb.net
```

## 🔍 Expected Behavior

### **When Backend Starts Successfully:**
- ✅ Green alert: "MongoDB Backend Connected"
- ✅ Authentication forms become functional
- ✅ User registration saves to MongoDB database
- ✅ Login retrieves data from MongoDB

### **If Backend Fails to Start:**
- ❌ Check if port 5000 is already in use
- ❌ Verify MongoDB connection string
- ❌ Ensure all dependencies are installed

## 🚨 Troubleshooting

### **Port Already in Use:**
```bash
# Kill any existing process on port 5000
npx kill-port 5000
# Then restart
npm run dev
```

### **Missing Dependencies:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### **MongoDB Connection Error:**
- Verify your IP is whitelisted in MongoDB Atlas
- Check internet connection
- Verify MongoDB URI in `backend/.env`

## ✅ Test Authentication

Once backend is running:

### **"Join as a Supplier" Test:**
1. **Go to**: `/auth` 
2. **Register**: Fill supplier registration form
3. **Login**: Use the credentials you created
4. **Verify**: Check MongoDB database for user record

### **Database Verification:**
Your user data will appear in:
- **Database**: SeekFactory
- **Collection**: users  
- **Document**: Contains your registration info

---

**🎯 The frontend will automatically detect when the backend is available!**
