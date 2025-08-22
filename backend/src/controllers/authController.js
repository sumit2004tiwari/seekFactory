import User from '../models/User.js';
import InMemoryUser from '../models/InMemoryUser.js';
import { sendTokenResponse } from '../utils/jwt.js';

// Check if MongoDB is available
const isMongoAvailable = () => {
  try {
    return User.db && User.db.readyState === 1;
  } catch (error) {
    return false;
  }
};

// Get the appropriate User model
const getUserModel = () => {
  if (isMongoAvailable()) {
    return User;
  } else {
    console.log('🔄 Using in-memory storage (MongoDB unavailable)');
    return InMemoryUser;
  }
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, companyName, phone, businessType, role = 'supplier' } = req.body;
    const UserModel = getUserModel();

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = await UserModel.create({
      name,
      email,
      password,
      companyName,
      phone,
      businessType,
      role
    });

    // Update last login
    user.lastLogin = new Date();
    if (isMongoAvailable()) {
      await user.save();
    }

    sendTokenResponse(user, 201, res, 'User registered successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const UserModel = getUserModel();

    // Check for user
    let user;
    if (isMongoAvailable()) {
      user = await UserModel.findOne({ email }).select('+password');
    } else {
      user = await UserModel.findOne({ email });
    }

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    if (isMongoAvailable()) {
      await user.save();
    }

    sendTokenResponse(user, 200, res, 'Login successful');
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const UserModel = getUserModel();
    const user = await UserModel.findById(req.user.id);

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      companyName: req.body.companyName,
      phone: req.body.phone,
      businessType: req.body.businessType,
      website: req.body.website,
      description: req.body.description,
      address: req.body.address,
      categories: req.body.categories
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};
