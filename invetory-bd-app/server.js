const express = require('express');
const connectDB = require('./db');

const app = express();
connectDB();

app.use(express.json());

app.use('/supplier', require('./routes/supplierRoutes'));
app.use('/inventory', require('./routes/inventoryRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));