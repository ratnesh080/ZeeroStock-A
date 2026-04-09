require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use the variable from your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;