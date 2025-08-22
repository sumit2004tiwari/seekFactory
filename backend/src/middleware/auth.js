import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import InMemoryUser from '../models/InMemoryUser.js';

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
    return InMemoryUser;
  }
};

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      const UserModel = getUserModel();
      const user = await UserModel.findById(decoded.id);
      
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Token is valid but user no longer exists'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          status: 'error',
          message: 'User account is deactivated'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        status: 'error',
        message: 'Token is not valid'
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Server error in authentication'
    });
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. Please authenticate first.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }

    next();
  };
};
