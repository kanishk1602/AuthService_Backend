const express = require('express');
const router = express.Router();

const Product = require('../models/Product');
const { auth, isAdmin } = require('../middlewares/auth');

// GET /api/v1/products - fetch all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/v1/products/:id - fetch single product
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/v1/products - create product (admin only)
router.post('/products', auth, isAdmin, async (req, res) => {
  try {
    console.log('Creating product with data:', req.body);
    console.log('User:', req.user);
    
    const newProduct = new Product(req.body);
    await newProduct.save();
    
    console.log('Product created:', newProduct);
    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    console.error('Product creation error:', err);
    res.status(400).json({ 
      success: false, 
      message: err.message || 'Invalid data',
      details: err.errors ? Object.keys(err.errors).map(key => ({ field: key, message: err.errors[key].message })) : null
    });
  }
});

// PUT /api/v1/products/:id - update product (admin only)
router.put('/products/:id', auth, isAdmin, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product: updated });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: 'Invalid data' });
  }
});

// DELETE /api/v1/products/:id - delete product (admin only)
router.delete('/products/:id', auth, isAdmin, async (req, res) => {
  try {
    const removed = await Product.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
