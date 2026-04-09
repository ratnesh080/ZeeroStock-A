const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 6001;

app.use(cors());

// Data Source: In-memory array
const inventory = [
  { id: 1, name: "Steel Bolts", category: "Hardware", price: 10 },
  { id: 2, name: "Copper Wire", category: "Electrical", price: 55 },
  { id: 3, name: "Work Boots", category: "Safety", price: 120 },
  { id: 4, name: "Safety Goggles", category: "Safety", price: 15 },
  { id: 5, name: "Power Drill", category: "Tools", price: 89 },
  { id: 6, name: "LED Bulbs", category: "Electrical", price: 5 },
  { id: 7, name: "Hammer", category: "Tools", price: 25 },
  { id: 8, name: "Hard Hat", category: "Safety", price: 40 },
  { id: 9, name: "Screwdriver Set", category: "Tools", price: 30 },
  { id: 10, name: "Extension Cord", category: "Electrical", price: 20 }
];

app.get('/search', (req, res) => {
  let { q, category, minPrice, maxPrice } = req.query;
  let filteredResults = [...inventory];

  // 1. Text Search (Partial & Case-insensitive)
  if (q) {
    filteredResults = filteredResults.filter(item => 
      item.name.toLowerCase().includes(q.toLowerCase())
    );
  }

  // 2. Category Filter
  if (category && category !== "All") {
    filteredResults = filteredResults.filter(item => 
      item.category.toLowerCase() === category.toLowerCase()
    );
  }

  // 3. Price Range Filter
  const min = parseFloat(minPrice);
  const max = parseFloat(maxPrice);

  if (!isNaN(min)) {
    filteredResults = filteredResults.filter(item => item.price >= min);
  }
  if (!isNaN(max)) {
    // Edge case: if max is less than min, this naturally returns []
    filteredResults = filteredResults.filter(item => item.price <= max);
  }

  res.json(filteredResults);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));