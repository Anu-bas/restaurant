const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Table = require('../models/Table');
const Reservation = require('../models/Reservation');
const User = require('../models/User');

// GET /api/stats  (admin dashboard summary)
exports.getStats = async (req, res, next) => {
  try {
    const [restaurants, foods, tables, reservations, pending, customers] = await Promise.all([
      Restaurant.countDocuments(),
      MenuItem.countDocuments(),
      Table.countDocuments(),
      Reservation.countDocuments(),
      Reservation.countDocuments({ status: 'Pending' }),
      User.countDocuments({ role: 'customer' }),
    ]);
    const recent = await Reservation.find()
      .populate('restaurant', 'name')
      .populate('table', 'tableNumber')
      .sort('-createdAt')
      .limit(5);
    res.json({ restaurants, foods, tables, reservations, pending, customers, recent });
  } catch (err) {
    next(err);
  }
};
