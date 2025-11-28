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

// Create order with mock checkout
router.post('/', auth, async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    const user = await User.findById(req.user._id).populate('cart.product');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!Array.isArray(user.cart) || user.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Ensure all cart products still exist (populated). If any product was removed,
    // return a clear error instead of throwing when accessing properties.
    const missing = user.cart.filter(item => !item.product);
    if (missing.length > 0) {
      return res.status(400).json({ message: 'Some items in the cart are no longer available', missingCount: missing.length });
    }

    // Calculate total and prepare order items
    let totalAmount = 0;
    const orderItems = user.cart.map(item => {
      // At this point item.product should exist due to the earlier check.
      const price = item.product.price || 0;
      const itemTotal = price * item.quantity;
      totalAmount += itemTotal;

      return {
        product: item.product._id,
        name: item.product.name || 'Unknown product',
        size: item.size,
        quantity: item.quantity,
        price
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
      await sendOrderConfirmationEmail(order, user);
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

// Email sending function
async function sendOrderConfirmationEmail(order, user) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Order Confirmation - #${order.orderId}`,
    html: generateOrderEmailTemplate(order, user)
  };

  await transporter.sendMail(mailOptions);
  console.log(`Order confirmation email sent to ${user.email}`);
}

// Email template
function generateOrderEmailTemplate(order, user) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px;
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white; 
          padding: 30px; 
          text-align: center; 
          border-radius: 10px 10px 0 0;
        }
        .content { 
          background: #f9f9f9; 
          padding: 30px; 
          border-radius: 0 0 10px 10px;
        }
        .order-details { 
          background: white; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0; 
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .item { 
          border-bottom: 1px solid #eee; 
          padding: 15px 0; 
          display: flex; 
          justify-content: space-between;
        }
        .item:last-child { border-bottom: none; }
        .total { 
          font-weight: bold; 
          font-size: 18px; 
          color: #667eea; 
          text-align: right; 
          margin-top: 20px;
        }
        .footer { 
          text-align: center; 
          margin-top: 30px; 
          color: #666; 
          font-size: 12px;
        }
        .order-info {
          background: white;
          padding: 15px;
          border-radius: 8px;
          margin: 15px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Thank you for your order!</h1>
        <p>Your order has been confirmed and is being processed</p>
      </div>
      
      <div class="content">
        <div class="order-info">
          <h3>Order Information</h3>
          <p><strong>Order ID:</strong> #${order.orderId}</p>
          <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
          <p><strong>Customer:</strong> ${user.name}</p>
        </div>
        
        <div class="order-details">
          <h3>Order Summary</h3>
          ${order.items.map(item => `
            <div class="item">
              <div>
                <strong>${item.name}</strong><br>
                <small>Size: ${item.size} | Quantity: ${item.quantity}</small>
              </div>
              <div>$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          `).join('')}
          
          <div class="total">
            Total Amount: $${order.totalAmount.toFixed(2)}
          </div>
        </div>
        
        <div class="order-info">
          <h3>Shipping Address</h3>
          <p>${order.shippingAddress.name}<br>
          ${order.shippingAddress.address}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
          ${order.shippingAddress.country}</p>
        </div>
        
        <p>We'll send you a shipping confirmation email when your order ships.</p>
        <p>If you have any questions, please contact our customer service.</p>
      </div>
      
      <div class="footer">
        <p>&copy; 2024 FashionStore. All rights reserved.</p>
        <p>This is a mock order confirmation for demonstration purposes.</p>
      </div>
    </body>
    </html>
  `;
}

module.exports = router;