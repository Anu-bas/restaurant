const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verifies the JWT and loads the user onto req.user
const protect = async (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    res.status(401);
    return next(new Error('Please login to continue.'));
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401);
      return next(new Error('Session expired. Please login again.'));
    }
    req.user = user;
    next();
  } catch (e) {
    res.status(401);
    next(new Error('Session expired. Please login again.'));
  }
};

// Blocks anyone who is not an admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403);
  next(new Error('Admin access only.'));
};

// Blocks admins from customer-only flows (cart, reservations)
const customerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'customer') return next();
  res.status(403);
  next(new Error('This action is available to customer accounts only.'));
};

module.exports = { protect, adminOnly, customerOnly };
