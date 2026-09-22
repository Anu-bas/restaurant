const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema(
  {
    tableNumber: { type: String, required: [true, 'Table number is required'], trim: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    capacity: { type: Number, required: true, min: 1, max: 20 },
    image: { type: String, required: true },
    section: { type: String, default: 'Indoor' },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

tableSchema.index({ restaurant: 1, tableNumber: 1 }, { unique: true });

module.exports = mongoose.model('Table', tableSchema);
