const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  supplier_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Supplier', 
    required: true 
  },
  product_name: { type: String, required: true },
  quantity: { type: Number, required: true, min: [0, 'Quantity cannot be negative'] },
  price: { type: Number, required: true, min: [0.01, 'Price must be greater than 0'] }
});

// Optimization: Index supplier_id for faster lookups/joins
InventorySchema.index({ supplier_id: 1 });

module.exports = mongoose.model('Inventory', InventorySchema);