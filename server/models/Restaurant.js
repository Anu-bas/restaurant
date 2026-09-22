const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Restaurant name is required'], trim: true },
    image: { type: String, required: [true, 'Restaurant image URL is required'] },
    description: { type: String, required: true },
    cuisine: { type: String, required: true },
    address: { type: String, required: true },
    openingHours: { type: String, default: '11:00 AM - 11:00 PM' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
