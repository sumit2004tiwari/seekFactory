import jwt from 'jsonwebtoken';

// Generate JWT token
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Send token response
export const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  // Create token
  const token = generateToken({ id: user._id });

  const options = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      status: 'success',
      message,
      token,
      data: {
        user: user.toJSON()
      }
    });
};
