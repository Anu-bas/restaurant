const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');

const loadCart = async (customerId) => {
  let cart = await Cart.findOne({ customer: customerId }).populate({
    path: 'items.menuItem',
    populate: { path: 'restaurant', select: 'name' },
  });
  if (!cart) cart = await Cart.create({ customer: customerId, items: [] });
  return cart;
};

const shape = (cart) => {
  const items = cart.items
    .filter((i) => i.menuItem) // drop items whose food was deleted
    .map((i) => ({
      menuItem: i.menuItem,
      quantity: i.quantity,
      subtotal: Number((i.menuItem.price * i.quantity).toFixed(2)),
    }));
  return {
    _id: cart._id,
    items,
    totalItems: items.reduce((n, i) => n + i.quantity, 0),
    total: Number(items.reduce((n, i) => n + i.subtotal, 0).toFixed(2)),
  };
};

// GET /api/cart
exports.getCart = async (req, res, next) => {
  try {
    res.json(shape(await loadCart(req.user._id)));
  } catch (err) {
    next(err);
  }
};

// POST /api/cart  { menuItemId, quantity }
exports.addToCart = async (req, res, next) => {
  try {
    const { menuItemId, quantity = 1 } = req.body;
    const food = await MenuItem.findById(menuItemId);
    if (!food) {
      res.status(404);
      throw new Error('Food item not found.');
    }
    if (!food.isAvailable) {
      res.status(400);
      throw new Error('This item is sold out right now.');
    }
    const cart = await loadCart(req.user._id);
    const line = cart.items.find((i) => String(i.menuItem._id || i.menuItem) === String(menuItemId));
    if (line) line.quantity += Number(quantity);
    else cart.items.push({ menuItem: menuItemId, quantity: Number(quantity) });
    await cart.save();
    res.status(201).json(shape(await loadCart(req.user._id)));
  } catch (err) {
    next(err);
  }
};

// PUT /api/cart/:itemId   (:itemId is the menu item id) { quantity }
exports.updateCartItem = async (req, res, next) => {
  try {
    const quantity = Number(req.body.quantity);
    const cart = await loadCart(req.user._id);
    const line = cart.items.find((i) => String(i.menuItem._id || i.menuItem) === req.params.itemId);
    if (!line) {
      res.status(404);
      throw new Error('That item is not in your cart.');
    }
    if (quantity < 1) cart.items = cart.items.filter((i) => i !== line);
    else line.quantity = quantity;
    await cart.save();
    res.json(shape(await loadCart(req.user._id)));
  } catch (err) {
    next(err);
  }
};

// DELETE /api/cart/:itemId
exports.removeCartItem = async (req, res, next) => {
  try {
    const cart = await loadCart(req.user._id);
    cart.items = cart.items.filter(
      (i) => String(i.menuItem._id || i.menuItem) !== req.params.itemId
    );
    await cart.save();
    res.json(shape(await loadCart(req.user._id)));
  } catch (err) {
    next(err);
  }
};

// DELETE /api/cart
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await loadCart(req.user._id);
    cart.items = [];
    await cart.save();
    res.json(shape(await loadCart(req.user._id)));
  } catch (err) {
    next(err);
  }
};
