const MenuItem = require('../models/MenuItem');

exports.getMenu = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.restaurant) filter.restaurant = req.query.restaurant;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) filter.name = { $regex: req.query.search, $options: 'i' };
    if (req.query.available === 'true') filter.isAvailable = true;
    const items = await MenuItem.find(filter).populate('restaurant', 'name cuisine').sort('-createdAt');
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.getMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('restaurant', 'name cuisine address');
    if (!item) {
      res.status(404);
      throw new Error('Food item not found.');
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.createMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json(await item.populate('restaurant', 'name cuisine'));
  } catch (err) {
    next(err);
  }
};

exports.updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('restaurant', 'name cuisine');
    if (!item) {
      res.status(404);
      throw new Error('Food item not found.');
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Food item not found.');
    }
    res.json({ message: 'Food item deleted.' });
  } catch (err) {
    next(err);
  }
};
