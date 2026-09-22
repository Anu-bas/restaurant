const Table = require('../models/Table');
const Reservation = require('../models/Reservation');

exports.getTables = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.restaurant) filter.restaurant = req.query.restaurant;
    if (req.query.available === 'true') filter.isAvailable = true;
    const tables = await Table.find(filter).populate('restaurant', 'name address').sort('tableNumber');
    res.json(tables);
  } catch (err) {
    next(err);
  }
};

exports.getTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id).populate('restaurant', 'name address');
    if (!table) {
      res.status(404);
      throw new Error('Table not found.');
    }
    res.json(table);
  } catch (err) {
    next(err);
  }
};

exports.createTable = async (req, res, next) => {
  try {
    const table = await Table.create(req.body);
    res.status(201).json(await table.populate('restaurant', 'name address'));
  } catch (err) {
    if (err.code === 11000) {
      res.status(400);
      return next(new Error('That table number already exists for this restaurant.'));
    }
    next(err);
  }
};

exports.updateTable = async (req, res, next) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('restaurant', 'name address');
    if (!table) {
      res.status(404);
      throw new Error('Table not found.');
    }
    res.json(table);
  } catch (err) {
    next(err);
  }
};

exports.deleteTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      res.status(404);
      throw new Error('Table not found.');
    }
    await Reservation.deleteMany({ table: table._id });
    await table.deleteOne();
    res.json({ message: 'Table deleted along with its reservations.' });
  } catch (err) {
    next(err);
  }
};
