const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Food name is required'], trim: true },
    image: { type: String, required: [true, 'Food image URL is required'] },
    description: { type: String, default: '' },
    category: {
      type: String,
      required: true,
      enum: ['Starter', 'Main Course', 'Biryani', 'Breads', 'Dessert', 'Beverage'],
    },
    price: { type: Number, required: true, min: 0 },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
