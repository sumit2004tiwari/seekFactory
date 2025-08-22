import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// In-memory user store for development when MongoDB is unavailable
class InMemoryUser {
  constructor(userData) {
    this._id = crypto.randomUUID();
    this.name = userData.name;
    this.email = userData.email;
    this.password = userData.password; // Will be hashed
    this.role = userData.role || 'supplier';
    this.companyName = userData.companyName;
    this.phone = userData.phone;
    this.businessType = userData.businessType || 'manufacturer';
    this.isVerified = false;
    this.isEmailVerified = false;
    this.isActive = true;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    this.lastLogin = null;
  }

  // Hash password before saving
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
  }

  // Compare password method
  async comparePassword(candidatePassword) {
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      throw error;
    }
  }

  // Get user without sensitive information
  toJSON() {
    const userObject = { ...this };
    delete userObject.password;
    return userObject;
  }
}

// In-memory storage
const users = new Map();

// Static methods to mimic Mongoose
InMemoryUser.findOne = async (query) => {
  if (query.email) {
    for (let user of users.values()) {
      if (user.email === query.email) {
        return user;
      }
    }
  }
  return null;
};

InMemoryUser.findById = async (id) => {
  return users.get(id) || null;
};

InMemoryUser.create = async (userData) => {
  // Check if user exists
  const existingUser = await InMemoryUser.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await InMemoryUser.hashPassword(userData.password);
  
  // Create user
  const user = new InMemoryUser({
    ...userData,
    password: hashedPassword
  });

  // Store user
  users.set(user._id, user);
  
  return user;
};

InMemoryUser.findByIdAndUpdate = async (id, updateData, options = {}) => {
  const user = users.get(id);
  if (!user) return null;

  // Update fields
  Object.keys(updateData).forEach(key => {
    if (updateData[key] !== undefined) {
      user[key] = updateData[key];
    }
  });
  
  user.updatedAt = new Date().toISOString();
  
  return user;
};

export default InMemoryUser;
