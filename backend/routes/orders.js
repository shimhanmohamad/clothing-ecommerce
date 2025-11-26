const express = require('express');
const nodemailer = require('nodemailer');
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

const router = express.Router();

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    const user = await User.findById(req.user._id).populate('cart.product');

    if (user.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total and prepare order items
    let totalAmount = 0;
    const orderItems = user.cart.map(item => {
      const itemTotal = item.product.price * item.quantity;
      totalAmount += itemTotal;

      return {
        product: item.product._id,
        name: item.product.name,
        size: item.size,
        quantity: item.quantity,
        price: item.product.price
      };
    });

    // Create order
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress
    });

    await order.save();
    await order.populate('items.product');

    // Clear user's cart
    user.cart = [];
    await user.save();

    // Send confirmation email
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Order Confirmation - #${order.orderId}`,
        html: generateOrderEmail(order, user)
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the order if email fails
    }

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ orderDate: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Email template
function generateOrderEmail(order, user) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; }
        .order-details { margin: 20px 0; }
        .item { border-bottom: 1px solid #eee; padding: 10px 0; }
        .total { font-weight: bold; font-size: 18px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank you for your order!</h1>
          <p>Order #${order.orderId}</p>
        </div>
        <div class="order-details">
          <h3>Order Summary</h3>
          ${order.items.map(item => `
            <div class="item">
              <p><strong>${item.name}</strong> (Size: ${item.size})</p>
              <p>Quantity: ${item.quantity} × $${item.price} = $${(item.quantity * item.price).toFixed(2)}</p>
            </div>
          `).join('')}
          <div class="total">
            <p>Total Amount: $${order.totalAmount.toFixed(2)}</p>
          </div>
        </div>
        <p>Order Date: ${new Date(order.orderDate).toLocaleDateString()}</p>
        <p>We'll notify you when your order ships.</p>
      </div>
    </body>
    </html>
  `;
}

module.exports = router;