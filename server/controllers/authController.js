const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
});

// POST /api/auth/register  (customer accounts only)
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Name, email and password are all required.');
    }
    if (password.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters.');
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      res.status(400);
      throw new Error('An account already exists with this email.');
    }
    const user = await User.create({ name, email, password, phone, role: 'customer' });
    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login  — body may carry role ('customer' | 'admin') to lock the portal
exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('Enter your email and password.');
    }
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error('Email or password is incorrect.');
    }
    if (role && user.role !== role) {
      res.status(403);
      throw new Error(
        role === 'admin'
          ? 'This account is not an admin account.'
          : 'Admin accounts must sign in from the admin portal.'
      );
    }
    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/profile
exports.getProfile = async (req, res) => {
  res.json(publicUser(req.user));
};

// PUT /api/auth/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.name = req.body.name ?? user.name;
    user.phone = req.body.phone ?? user.phone;
    if (req.body.password) {
      if (req.body.password.length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters.');
      }
      user.password = req.body.password;
    }
    await user.save();
    res.json(publicUser(user));
  } catch (err) {
    next(err);
  }
};
