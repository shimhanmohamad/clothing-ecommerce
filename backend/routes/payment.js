// routes/payment.js
const express = require('express');
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const User = require('../models/User');
const stripePkg = require('stripe');
const nodemailer = require('nodemailer');

const router = express.Router();

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

// Validate Stripe key
if (!STRIPE_SECRET) {
  console.error('❌ STRIPE_SECRET_KEY is missing from environment variables');
}

const stripe = stripePkg(STRIPE_SECRET);

// Enhanced email transporter with better configuration
const createTransporter = () => {
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn('⚠️ SMTP credentials not configured - emails will not be sent');
    return null;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify transporter configuration
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Email transporter verification failed:', error);
      } else {
        console.log('✅ Email transporter is ready to send messages');
      }
    });

    return transporter;
  } catch (error) {
    console.error('❌ Failed to create email transporter:', error);
    return null;
  }
};

const transporter = createTransporter();

// Helper functions
const toCents = (amount) => Math.round(Number(amount || 0) * 100);
const fromCents = (cents) => (Number(cents || 0) / 100).toFixed(2);

// Enhanced email sending function
const sendOrderEmail = async (user, order) => {
  if (!transporter) {
    console.log('📧 Email transporter not configured - skipping email');
    return false;
  }

  if (!user?.email) {
    console.warn('⚠️ No user email found - skipping email');
    return false;
  }

  try {
    const mailOptions = {
      from: `"FashionStore" <${SMTP_USER}>`,
      to: user.email,
      subject: `Order Confirmation #${order._id.toString().slice(-8)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #333; margin: 0;">FashionStore</h1>
            <p style="color: #666; margin: 5px 0;">Order Confirmation</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h2 style="color: #333; margin: 0 0 10px 0;">Thank you for your order, ${user.name}!</h2>
            <p style="margin: 5px 0; color: #666;">Your order <strong>#${order._id.toString().slice(-8)}</strong> has been successfully placed and paid.</p>
          </div>
          
          <h3 style="color: #555; border-bottom: 2px solid #eee; padding-bottom: 10px;">Order Details:</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 12px; text-align: left; border: 1px solid #ddd; font-weight: bold;">Product</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #ddd; font-weight: bold;">Size</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #ddd; font-weight: bold;">Qty</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #ddd; font-weight: bold;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td style="padding: 12px; border: 1px solid #ddd;">${item.name}</td>
                  <td style="padding: 12px; border: 1px solid #ddd;">${item.size}</td>
                  <td style="padding: 12px; border: 1px solid #ddd;">${item.quantity}</td>
                  <td style="padding: 12px; border: 1px solid #ddd;">$${item.price}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin: 5px 0; font-size: 18px;"><strong>Total Amount: $${order.totalAmount}</strong></p>
          </div>
          
          <div style="background: #f0f8ff; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
            <h4 style="margin: 0 0 10px 0; color: #333;">Shipping Address:</h4>
            <p style="margin: 5px 0; color: #666;">
              ${order.shippingAddress.name}<br>
              ${order.shippingAddress.address}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
              ${order.shippingAddress.country}
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #666; margin: 5px 0;">You can view your order details in your account dashboard.</p>
            <p style="color: #666; margin: 5px 0;">Thank you for shopping with FashionStore!</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent to:', user.email, 'Message ID:', info.messageId);
    return true;
  } catch (emailError) {
    console.error('❌ Failed to send email:', emailError);
    return false;
  }
};

// Create Stripe Checkout Session
router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    console.log('🔄 Creating checkout session for user:', req.user._id);
    const { shippingAddress = {} } = req.body;

    // Validate shipping address
    if (!shippingAddress.name || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
      return res.status(400).json({ 
        message: 'Please fill in all shipping address fields' 
      });
    }

    // Get user with populated cart
    const user = await User.findById(req.user._id).populate('cart.product');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('📦 User cart items:', user.cart?.length);

    // Validate cart
    if (!Array.isArray(user.cart) || user.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate cart items
    const validCartItems = user.cart.filter(item => 
      item.product && item.quantity > 0
    );

    if (validCartItems.length === 0) {
      return res.status(400).json({ message: 'No valid items in cart' });
    }

    console.log('✅ Valid cart items:', validCartItems.length);

    // Create line items for Stripe
    const line_items = validCartItems.map(item => {
      const priceCents = toCents(item.product.price);
      console.log(`📝 Product: ${item.product.name}, Price: $${item.product.price}, Cents: ${priceCents}, Qty: ${item.quantity}`);
      
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            images: item.product.imageUrl ? [item.product.imageUrl] : [],
            metadata: {
              productId: item.product._id.toString(),
              size: item.size || 'N/A'
            }
          },
          unit_amount: priceCents,
        },
        quantity: item.quantity,
      };
    });

    // Calculate server-side total
    const serverTotalCents = validCartItems.reduce((sum, item) => {
      return sum + (toCents(item.product.price) * item.quantity);
    }, 0);

    console.log('💰 Server total cents:', serverTotalCents);

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      metadata: {
        userId: req.user._id.toString(),
        serverTotalCents: serverTotalCents.toString(),
        shipping: JSON.stringify(shippingAddress),
        cartItems: JSON.stringify(validCartItems.map(item => ({
          productId: item.product._id.toString(),
          name: item.product.name,
          quantity: item.quantity,
          size: item.size,
          price: item.product.price
        })))
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'LK'],
      },
      customer_email: user.email,
      success_url: `${FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/checkout`,
    });

    console.log('✅ Stripe session created:', session.id);

    // Create pending payment record
    await Payment.create({
      user: req.user._id,
      stripeSessionId: session.id,
      amount: fromCents(serverTotalCents),
      status: 'pending',
      shippingAddress: shippingAddress
    });

    res.json({ 
      url: session.url, 
      id: session.id,
      amount: fromCents(serverTotalCents)
    });

  } catch (error) {
    console.error('❌ Error creating Stripe session:', error);
    res.status(500).json({ 
      message: 'Failed to create checkout session',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Complete checkout and verify payment
router.post('/complete-checkout', auth, async (req, res) => {
  let session;
  try {
    const { session_id } = req.body;
    
    console.log('🔄 Completing checkout for session:', session_id);
    
    if (!session_id) {
      return res.status(400).json({ message: 'session_id is required' });
    }

    // Retrieve Stripe session with expanded data
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['payment_intent', 'line_items.data.price.product']
    });

    if (!session) {
      return res.status(404).json({ message: 'Stripe session not found' });
    }

    console.log('📊 Session status:', {
      payment_status: session.payment_status,
      status: session.status,
      amount_total: session.amount_total
    });

    // Verify payment status
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ 
        message: `Payment not completed. Status: ${session.payment_status}` 
      });
    }

    // Check if order already exists
    const existingOrder = await Order.findOne({ stripeSessionId: session_id });
    if (existingOrder) {
      console.log('✅ Order already exists:', existingOrder._id);
      return res.status(200).json({ 
        message: 'Order already processed', 
        order: existingOrder 
      });
    }

    const userId = session.metadata.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('👤 Processing order for user:', user.email);

    // Parse metadata
    const serverTotalCents = parseInt(session.metadata.serverTotalCents) || 0;
    let shippingAddress = {};
    let cartItemsFromMeta = [];
    
    try {
      shippingAddress = JSON.parse(session.metadata.shipping || '{}');
      cartItemsFromMeta = JSON.parse(session.metadata.cartItems || '[]');
    } catch (parseError) {
      console.warn('⚠️ Error parsing metadata:', parseError);
    }

    // Verify we have cart items
    if (cartItemsFromMeta.length === 0) {
      return res.status(400).json({ message: 'No items found in order' });
    }

    console.log('📦 Cart items from metadata:', cartItemsFromMeta.length);

    // Verify payment amount matches
    const stripeAmount = session.amount_total;
    if (stripeAmount !== serverTotalCents) {
      console.warn(`⚠️ Amount mismatch: Stripe=${stripeAmount}, Server=${serverTotalCents}`);
      // Continue with Stripe amount as it's the authoritative source
    }

    // Create order items from metadata
    const orderItems = cartItemsFromMeta.map(item => ({
      product: item.productId,
      name: item.name,
      size: item.size,
      quantity: item.quantity,
      price: item.price
    }));

    // Use Stripe's collected address if available, otherwise use submitted address
    const finalShippingAddress = session.shipping_details ? {
      name: session.shipping_details.name,
      address: `${session.shipping_details.address.line1} ${session.shipping_details.address.line2 || ''}`.trim(),
      city: session.shipping_details.address.city,
      postalCode: session.shipping_details.address.postal_code,
      country: session.shipping_details.address.country,
    } : shippingAddress;

    // Create order
    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount: fromCents(stripeAmount),
      shippingAddress: finalShippingAddress,
      paymentStatus: 'paid',
      stripeSessionId: session_id,
      stripePaymentIntent: session.payment_intent?.id
    });

    await order.save();
    console.log('✅ Order created:', order._id);

    // Update payment record
    await Payment.findOneAndUpdate(
      { stripeSessionId: session_id },
      {
        status: 'paid',
        order: order._id,
        stripePaymentIntent: session.payment_intent?.id,
        amount: fromCents(stripeAmount)
      },
      { new: true }
    );

    // Clear user's cart
    await User.findByIdAndUpdate(userId, { cart: [] });
    console.log('✅ User cart cleared');

    // Send confirmation email
    const emailSent = await sendOrderEmail(user, order);
    if (!emailSent) {
      console.warn('⚠️ Order created but email failed to send');
    }

    res.status(201).json({
      message: 'Order created successfully',
      order: order,
      payment: {
        id: session.payment_intent?.id,
        status: 'paid',
        amount: order.totalAmount
      },
      emailSent: emailSent
    });

  } catch (error) {
    console.error('❌ Error completing checkout:', error);
    
    // Update payment status to failed if we have a session
    if (session) {
      await Payment.findOneAndUpdate(
        { stripeSessionId: session.id },
        { status: 'failed', error: error.message }
      );
    }

    res.status(500).json({ 
      message: 'Failed to complete checkout',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get payment status
router.get('/status/:sessionId', auth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    console.log('🔄 Checking payment status for session:', sessionId);
    
    const payment = await Payment.findOne({ 
      stripeSessionId: sessionId,
      user: req.user._id 
    }).populate('order');
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // If payment is pending, check with Stripe for latest status
    if (payment.status === 'pending') {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === 'paid') {
          payment.status = 'paid';
          await payment.save();
        }
      } catch (stripeError) {
        console.warn('⚠️ Could not verify payment status with Stripe:', stripeError.message);
      }
    }

    res.json(payment);
  } catch (error) {
    console.error('❌ Error fetching payment status:', error);
    res.status(500).json({ message: 'Failed to fetch payment status' });
  }
});

// Webhook endpoint for Stripe (recommended for production)
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('💰 Payment succeeded via webhook:', session.id);
    
    // Update payment status
    await Payment.findOneAndUpdate(
      { stripeSessionId: session.id },
      { status: 'paid' }
    );
  }

  res.json({received: true});
});

module.exports = router;