const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Table = require('../models/Table');

exports.getRestaurants = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.search) filter.name = { $regex: req.query.search, $options: 'i' };
    if (req.query.cuisine) filter.cuisine = req.query.cuisine;
    res.json(await Restaurant.find(filter).sort('-createdAt'));
  } catch (err) {
    next(err);
  }
};

exports.getRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      res.status(404);
      throw new Error('Restaurant not found.');
    }
    const [menu, tables] = await Promise.all([
      MenuItem.find({ restaurant: restaurant._id }).populate('restaurant', 'name'),
      Table.find({ restaurant: restaurant._id }).populate('restaurant', 'name').sort('tableNumber'),
    ]);
    res.json({ restaurant, menu, tables });
  } catch (err) {
    next(err);
  }
};

exports.createRestaurant = async (req, res, next) => {
  try {
    res.status(201).json(await Restaurant.create(req.body));
  } catch (err) {
    next(err);
  }
};

exports.updateRestaurant = async (req, res, next) => {
  try {
    const updated = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      res.status(404);
      throw new Error('Restaurant not found.');
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      res.status(404);
      throw new Error('Restaurant not found.');
    }
    await Promise.all([
      MenuItem.deleteMany({ restaurant: restaurant._id }),
      Table.deleteMany({ restaurant: restaurant._id }),
      restaurant.deleteOne(),
    ]);
    res.json({ message: 'Restaurant deleted along with its food items and tables.' });
  } catch (err) {
    next(err);
  }
};
