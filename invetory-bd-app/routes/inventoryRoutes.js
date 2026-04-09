const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const Supplier = require('../models/Supplier');

// POST /inventory
router.post('/', async (req, res) => {
  try {
    // Rule: Check if supplier exists
    const supplier = await Supplier.findById(req.body.supplier_id);
    if (!supplier) return res.status(404).json({ error: "Supplier ID not found" });

    const item = new Inventory(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /inventory: Grouped by Supplier, sorted by Total Value
router.get('/', async (req, res) => {
  try {
    const aggregation = await Inventory.aggregate([
      {
        $lookup: {
          from: "suppliers", // MongoDB collection names are lowercase/plural by default
          localField: "supplier_id",
          foreignField: "_id",
          as: "supplierDetails"
        }
      },
      { $unwind: "$supplierDetails" },
      {
        $group: {
          _id: "$supplier_id",
          supplier_name: { $first: "$supplierDetails.name" },
          total_value: { $sum: { $multiply: ["$quantity", "$price"] } },
          products: { $push: { name: "$product_name", qty: "$quantity", price: "$price" } }
        }
      },
      { $sort: { total_value: -1 } }
    ]);
    res.json(aggregation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;