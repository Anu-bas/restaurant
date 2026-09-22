const Reservation = require('../models/Reservation');
const Table = require('../models/Table');

// POST /api/reservations  (customer)
exports.createReservation = async (req, res, next) => {
  try {
    const { table, date, time, guests, customerName, notes } = req.body;
    if (!table || !date || !time || !guests) {
      res.status(400);
      throw new Error('Table, date, time and number of guests are required.');
    }

    const tableDoc = await Table.findById(table);
    if (!tableDoc) {
      res.status(404);
      throw new Error('Table not found.');
    }
    if (!tableDoc.isAvailable) {
      res.status(400);
      throw new Error('This table is not available for booking.');
    }
    if (Number(guests) > tableDoc.capacity) {
      res.status(400);
      throw new Error(`This table seats ${tableDoc.capacity} guests. Pick a larger table.`);
    }
    if (new Date(`${date}T${time}`) < new Date()) {
      res.status(400);
      throw new Error('Choose a date and time in the future.');
    }

    const clash = await Reservation.findOne({
      table: tableDoc._id,
      date,
      time,
      status: { $ne: 'Cancelled' },
    });
    if (clash) {
      res.status(400);
      throw new Error('That table is already booked for this date and time.');
    }

    const reservation = await Reservation.create({
      customer: req.user._id,
      customerName: customerName || req.user.name,
      restaurant: tableDoc.restaurant,
      table: tableDoc._id,
      date,
      time,
      guests,
      notes: notes || '',
    });

    res.status(201).json(
      await reservation.populate([
        { path: 'restaurant', select: 'name address' },
        { path: 'table', select: 'tableNumber capacity image section' },
      ])
    );
  } catch (err) {
    next(err);
  }
};

// GET /api/reservations/my  (customer)
exports.getMyReservations = async (req, res, next) => {
  try {
    const list = await Reservation.find({ customer: req.user._id })
      .populate('restaurant', 'name address')
      .populate('table', 'tableNumber capacity image section')
      .sort('-createdAt');
    res.json(list);
  } catch (err) {
    next(err);
  }
};

// PUT /api/reservations/my/:id/cancel  (customer cancels own booking)
exports.cancelMyReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findOne({ _id: req.params.id, customer: req.user._id });
    if (!reservation) {
      res.status(404);
      throw new Error('Reservation not found.');
    }
    reservation.status = 'Cancelled';
    await reservation.save();
    res.json(
      await reservation.populate([
        { path: 'restaurant', select: 'name address' },
        { path: 'table', select: 'tableNumber capacity image section' },
      ])
    );
  } catch (err) {
    next(err);
  }
};

// GET /api/reservations  (admin)
exports.getAllReservations = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.restaurant) filter.restaurant = req.query.restaurant;
    const list = await Reservation.find(filter)
      .populate('customer', 'name email phone')
      .populate('restaurant', 'name address')
      .populate('table', 'tableNumber capacity section')
      .sort('-createdAt');
    res.json(list);
  } catch (err) {
    next(err);
  }
};

// PUT /api/reservations/:id  (admin updates status)
exports.updateReservationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
      res.status(400);
      throw new Error('Status must be Pending, Confirmed or Cancelled.');
    }
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('customer', 'name email phone')
      .populate('restaurant', 'name address')
      .populate('table', 'tableNumber capacity section');
    if (!reservation) {
      res.status(404);
      throw new Error('Reservation not found.');
    }
    res.json(reservation);
  } catch (err) {
    next(err);
  }
};
