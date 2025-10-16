const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Route for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html_files/index.html'));
});

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

// Example model and route (start small)
const ProductSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  quantity: Number
});
const Product = mongoose.model('Product', ProductSchema);

// JSON APIs under /api/*
app.get('/api/products', async (req, res) => {
  const products = await Product.find().limit(50);
  res.json(products);
});

// Start the server
app.listen(PORT, () => {
    console.log(`🌱 AgroConnect server is running on http://localhost:${PORT}`);
    console.log('📂 Serving files from:', __dirname);
});