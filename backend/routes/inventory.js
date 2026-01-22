const express = require('express');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/inventory
// @desc    Get inventory overview
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { lowStock = 10 } = req.query;

    const totalProducts = await Product.countDocuments({ status: 'active' });
    const lowStockProducts = await Product.find({
      status: 'active',
      stock: { $lte: parseInt(lowStock) }
    });
    const outOfStockProducts = await Product.find({
      status: 'active',
      stock: 0
    });

    const totalValue = await Product.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$stock', '$cost'] } }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length,
        totalValue: totalValue[0]?.totalValue || 0,
        lowStockProducts: lowStockProducts.map(p => ({
          id: p._id,
          name: p.name,
          sku: p.sku,
          stock: p.stock,
          minStock: lowStock
        })),
        outOfStockProducts: outOfStockProducts.map(p => ({
          id: p._id,
          name: p.name,
          sku: p.sku
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/inventory/:id/stock
// @desc    Update product stock
// @access  Private (Admin, Manager, Employee)
router.put('/:id/stock', [
  protect,
  authorize('admin', 'manager', 'employee')
], async (req, res) => {
  try {
    const { stock, operation } = req.body; // operation: 'set', 'add', 'subtract'

    if (!stock && stock !== 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock value is required'
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    let newStock;
    switch (operation) {
      case 'add':
        newStock = product.stock + parseInt(stock);
        break;
      case 'subtract':
        newStock = Math.max(0, product.stock - parseInt(stock));
        break;
      case 'set':
      default:
        newStock = Math.max(0, parseInt(stock));
    }

    product.stock = newStock;
    await product.save();

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
