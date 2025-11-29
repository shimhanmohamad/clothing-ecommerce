// routes/payment.js
const express = require("express");
const auth = require("../middleware/auth");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const User = require("../models/User");
const stripePkg = require("stripe");
const nodemailer = require("nodemailer");

const router = express.Router();

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

// Validate Stripe key
if (!STRIPE_SECRET) {
  console.error("❌ STRIPE_SECRET_KEY is missing from environment variables");
}

const stripe = stripePkg(STRIPE_SECRET);

// Enhanced email transporter with better configuration
// Enhanced email configuration
// Enhanced email configuration with detailed debugging
const createTransporter = () => {
  console.log("\n📧 ===== INITIALIZING EMAIL TRANSPORTER =====");

  // Check each environment variable individually
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = process.env.SMTP_PORT || 587;

  console.log("📧 Environment Variables Check:");
  console.log("   SMTP_USER:", smtpUser ? `"${smtpUser}"` : "❌ NOT SET");
  console.log("   SMTP_PASS:", smtpPass ? "*** (set)" : "❌ NOT SET");
  console.log("   SMTP_HOST:", smtpHost);
  console.log("   SMTP_PORT:", smtpPort);

  // Check if credentials are missing
  if (!smtpUser || !smtpPass) {
    console.error("❌ CRITICAL: SMTP credentials are missing!");
    console.error("   Please check your .env file and ensure:");
    console.error("   SMTP_USER=your-email@gmail.com");
    console.error("   SMTP_PASS=your-app-password");
    return null;
  }

  // Check if it's a Gmail address and provide specific instructions
  if (smtpUser.includes("@gmail.com") && !smtpPass.startsWith("http")) {
    console.log(
      "📧 Detected Gmail address - make sure you use an App Password, not your regular Gmail password!"
    );
  }

  const smtpConfig = {
    host: smtpHost,
    port: smtpPort,
    secure: false, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
    debug: true,
    logger: true,
  };

  console.log("📧 SMTP Configuration:", {
    host: smtpConfig.host,
    port: smtpConfig.port,
    user: smtpConfig.auth.user,
    secure: smtpConfig.secure,
  });

  try {
    const transporter = nodemailer.createTransport(smtpConfig);

    // Verify transporter configuration with timeout
    console.log("🔄 Verifying email transporter...");

    transporter.verify((error, success) => {
      if (error) {
        console.error("❌ Email transporter verification FAILED:");
        console.error("   Error:", error.message);
        console.error("   Code:", error.code);
        console.error("   Command:", error.command);

        // Provide specific solutions for common errors
        if (error.code === "EAUTH") {
          console.error("\n🔧 SOLUTION: Authentication failed!");
          console.error("   For Gmail:");
          console.error("   1. Enable 2-Factor Authentication");
          console.error(
            "   2. Generate an App Password at: https://myaccount.google.com/apppasswords"
          );
          console.error(
            "   3. Use the 16-character App Password, not your regular password"
          );
        } else if (error.code === "ECONNECTION") {
          console.error("\n🔧 SOLUTION: Connection failed!");
          console.error("   Check your SMTP host and port settings");
          console.error(
            "   Make sure your firewall allows outbound SMTP connections"
          );
        }
      } else {
        console.log("✅ Email transporter verification SUCCESSFUL!");
        console.log("✅ Ready to send emails");
      }
    });

    return transporter;
  } catch (error) {
    console.error("❌ Failed to create email transporter:", error);
    return null;
  }
};

const transporter = createTransporter();

// Helper functions
const toCents = (amount) => Math.round(Number(amount || 0) * 100);
const fromCents = (cents) => (Number(cents || 0) / 100).toFixed(2);

// Enhanced email sending function
// Enhanced email sending function with better logging
// Enhanced sendOrderEmail function with proper calculations
const sendOrderEmail = async (user, order) => {
  if (!transporter || !user?.email) {
    console.log("📧 Email not sent - transporter or user email not available");
    return false;
  }

  try {
    // Calculate charges from order items
    const calculateOrderCharges = (orderItems) => {
      // Calculate subtotal from all items
      const subtotal = orderItems.reduce((total, item) => {
        return total + parseFloat(item.price) * parseInt(item.quantity);
      }, 0);

      // Define your business rules
      const shippingCost = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
      const taxRate = 0.1; // 10% tax
      const taxAmount = subtotal * taxRate;
      const finalTotal = subtotal + shippingCost + taxAmount;

      return {
        subtotal: parseFloat(subtotal.toFixed(2)),
        shippingCost: parseFloat(shippingCost.toFixed(2)),
        taxRate: parseFloat(taxRate.toFixed(3)),
        taxAmount: parseFloat(taxAmount.toFixed(2)),
        finalTotal: parseFloat(finalTotal.toFixed(2)),
      };
    };

    // Calculate charges
    const charges = calculateOrderCharges(order.items);

    console.log("💰 Calculated charges:", charges);

    const mailOptions = {
      from: `"FashionStore" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: `Order Confirmation #${order._id.toString().slice(-8)}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { 
                    font-family: 'Arial', sans-serif; 
                    line-height: 1.6; 
                    color: #333; 
                    max-width: 600px; 
                    margin: 0 auto; 
                    padding: 20px;
                    background-color: #f9f9f9;
                }
                .header { 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white; 
                    padding: 30px; 
                    text-align: center; 
                    border-radius: 10px 10px 0 0;
                }
                .content { 
                    background: white; 
                    padding: 30px; 
                    border-radius: 0 0 10px 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .order-number { 
                    background: #f8f9fa; 
                    padding: 15px; 
                    border-radius: 5px; 
                    text-align: center; 
                    margin: 20px 0;
                    border-left: 4px solid #667eea;
                }
                .section { 
                    margin: 25px 0; 
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                }
                .section-title { 
                    color: #2d3748; 
                    border-bottom: 2px solid #667eea; 
                    padding-bottom: 10px; 
                    margin-bottom: 15px;
                    font-size: 18px;
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin: 15px 0;
                }
                th { 
                    background: #667eea; 
                    color: white; 
                    padding: 12px; 
                    text-align: left;
                }
                td { 
                    padding: 12px; 
                    border-bottom: 1px solid #e2e8f0;
                }
                .total-table { 
                    background: #f0fff4; 
                    border: 2px solid #48bb78;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .total-row { 
                    font-weight: bold; 
                    font-size: 16px;
                }
                .shipping-address { 
                    background: #fff; 
                    padding: 15px; 
                    border-radius: 5px; 
                    border: 1px solid #e2e8f0;
                    margin-top: 10px;
                }
                .footer { 
                    text-align: center; 
                    margin-top: 30px; 
                    padding-top: 20px; 
                    border-top: 1px solid #e2e8f0; 
                    color: #718096;
                }
                .thank-you { 
                    font-size: 20px; 
                    color: #2d3748; 
                    margin-bottom: 10px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🎉 Order Confirmed!</h1>
                <p>Thank you for shopping with FashionStore</p>
            </div>
            
            <div class="content">
                <div class="order-number">
                    <h2 style="margin: 0; color: #2d3748;">Order #${order._id
                      .toString()
                      .slice(-8)
                      .toUpperCase()}</h2>
                    <p style="margin: 5px 0 0 0; color: #718096;">Placed on ${new Date(
                      order.createdAt || Date.now()
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</p>
                </div>

                <!-- Customer Greeting -->
                <div style="text-align: center; margin-bottom: 20px;">
                    <p class="thank-you">Hello, ${user.name}!</p>
                    <p>Thank you for your order. We're getting it ready for shipment.</p>
                </div>

                <!-- Order Items Section -->
                <div class="section">
                    <h3 class="section-title">📦 Order Items</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Size</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items
                              .map(
                                (item) => `
                                <tr>
                                    <td><strong>${item.name}</strong></td>
                                    <td>${item.size || "N/A"}</td>
                                    <td>${item.quantity}</td>
                                    <td>$${parseFloat(item.price || 0).toFixed(
                                      2
                                    )}</td>
                                    <td>$${(
                                      (item.quantity || 1) *
                                      parseFloat(item.price || 0)
                                    ).toFixed(2)}</td>
                                </tr>
                            `
                              )
                              .join("")}
                        </tbody>
                    </table>
                </div>

                <!-- Bill Summary Section -->
                <div class="section">
                    <h3 class="section-title">💰 Order Summary</h3>
                    <table class="total-table">
                        <tr>
                            <td>Subtotal:</td>
                            <td>$${charges.subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Shipping:</td>
                            <td>$${charges.shippingCost.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Tax (${(charges.taxRate * 100).toFixed(
                              0
                            )}%):</td>
                            <td>$${charges.taxAmount.toFixed(2)}</td>
                        </tr>
                        <tr class="total-row" style="background: #e6fffa;">
                            <td><strong>Grand Total:</strong></td>
                            <td><strong>$${charges.finalTotal.toFixed(
                              2
                            )}</strong></td>
                        </tr>
                    </table>
                </div>

                <!-- Shipping Address Section -->
                <div class="section">
                    <h3 class="section-title">🏠 Shipping Address</h3>
                    <div class="shipping-address">
                        <p style="margin: 0 0 10px 0;"><strong>${
                          order.shippingAddress?.name || "Not provided"
                        }</strong></p>
                        <p style="margin: 5px 0;">${
                          order.shippingAddress?.address || "Not provided"
                        }</p>
                        <p style="margin: 5px 0;">
                            ${order.shippingAddress?.city || ""}, ${
        order.shippingAddress?.postalCode || ""
      }
                        </p>
                        <p style="margin: 5px 0;">${
                          order.shippingAddress?.country || ""
                        }</p>
                    </div>
                </div>

                <!-- Payment Method Section -->
                <div class="section">
                    <h3 class="section-title">💳 Payment Information</h3>
                    <p><strong>Payment Method:</strong> Credit Card (Stripe)</p>
                    <p><strong>Payment Status:</strong> <span style="color: #48bb78; font-weight: bold;">Paid</span></p>
                    <p><strong>Transaction ID:</strong> ${
                      order.stripePaymentIntent ||
                      order.stripeSessionId ||
                      "N/A"
                    }</p>
                </div>

                <!-- Next Steps -->
                <div class="section" style="background: #e6f7ff; border-left: 4px solid #1890ff;">
                    <h3 class="section-title" style="color: #1890ff;">📬 What's Next?</h3>
                    <p><strong>Order Processing:</strong> We'll process your order within 24 hours.</p>
                    <p><strong>Shipping:</strong> You'll receive a tracking number once your order ships.</p>
                    <p><strong>Delivery:</strong> Expected delivery in 3-5 business days.</p>
                </div>

                <div class="footer">
                    <p class="thank-you">Thank you for your purchase!</p>
                    <p>You can track your order status in your <a href="${
                      process.env.FRONTEND_URL
                    }/orders" style="color: #667eea;">account dashboard</a>.</p>
                    <p>If you have any questions, please contact our support team.</p>
                    <p style="margin-top: 20px;">
                        <strong>FashionStore Team</strong><br>
                        <a href="mailto:support@fashionstore.com" style="color: #667eea;">support@fashionstore.com</a>
                    </p>
                </div>
            </div>
        </body>
        </html>
      `,
      // Text version for email clients that don't support HTML
      text: `
ORDER CONFIRMATION - FASHIONSTORE
=================================

Thank you for your order, ${user.name}!

Order Details:
--------------
Order Number: ${order._id.toString().slice(-8).toUpperCase()}
Order Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString()}

Items Ordered:
${order.items
  .map(
    (item) =>
      `- ${item.name} (Size: ${item.size || "N/A"}) - ${item.quantity} x $${
        item.price
      } = $${((item.quantity || 1) * parseFloat(item.price || 0)).toFixed(2)}`
  )
  .join("\n")}

Order Summary:
--------------
Subtotal: $${charges.subtotal.toFixed(2)}
Shipping: $${charges.shippingCost.toFixed(2)}
Tax (${(charges.taxRate * 100).toFixed(0)}%): $${charges.taxAmount.toFixed(2)}
Grand Total: $${charges.finalTotal.toFixed(2)}

Shipping Address:
-----------------
${order.shippingAddress?.name || "Not provided"}
${order.shippingAddress?.address || "Not provided"}
${order.shippingAddress?.city || ""}, ${order.shippingAddress?.postalCode || ""}
${order.shippingAddress?.country || ""}

Payment Information:
-------------------
Payment Method: Credit Card
Payment Status: Paid
Transaction ID: ${order.stripePaymentIntent || order.stripeSessionId || "N/A"}

What's Next?
------------
- Order Processing: We'll process your order within 24 hours
- Shipping: You'll receive a tracking number once your order ships
- Delivery: Expected delivery in 3-5 business days

You can track your order status in your account dashboard: ${
        process.env.FRONTEND_URL
      }/orders

Thank you for shopping with FashionStore!

Best regards,
FashionStore Team
support@fashionstore.com
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Order confirmation email sent successfully!");
    console.log("📧 Message ID:", info.messageId);
    console.log("📧 To:", user.email);
    console.log("💰 Order Total: $" + charges.finalTotal.toFixed(2));

    return true;
  } catch (emailError) {
    console.error("❌ Email sending failed:");
    console.error("   Error:", emailError.message);
    console.error("   Stack:", emailError.stack);

    return false;
  }
};

// Create Stripe Checkout Session
router.post("/create-checkout-session", auth, async (req, res) => {
  try {
    console.log("🔄 Creating checkout session for user:", req.user._id);
    const { shippingAddress = {} } = req.body;

    // Validate shipping address
    if (
      !shippingAddress.name ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({
        message: "Please fill in all shipping address fields",
      });
    }

    // Get user with populated cart
    const user = await User.findById(req.user._id).populate("cart.product");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("📦 User cart items:", user.cart?.length);

    // Validate cart
    if (!Array.isArray(user.cart) || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Validate cart items
    const validCartItems = user.cart.filter(
      (item) => item.product && item.quantity > 0
    );

    if (validCartItems.length === 0) {
      return res.status(400).json({ message: "No valid items in cart" });
    }

    console.log("✅ Valid cart items:", validCartItems.length);

    // Create line items for Stripe
    const line_items = validCartItems.map((item) => {
      const priceCents = toCents(item.product.price);
      console.log(
        `📝 Product: ${item.product.name}, Price: $${item.product.price}, Cents: ${priceCents}, Qty: ${item.quantity}`
      );

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name,
            images: item.product.imageUrl ? [item.product.imageUrl] : [],
            metadata: {
              productId: item.product._id.toString(),
              size: item.size || "N/A",
            },
          },
          unit_amount: priceCents,
        },
        quantity: item.quantity,
      };
    });

    // Calculate server-side total
    const serverTotalCents = validCartItems.reduce((sum, item) => {
      return sum + toCents(item.product.price) * item.quantity;
    }, 0);

    console.log("💰 Server total cents:", serverTotalCents);

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      metadata: {
        userId: req.user._id.toString(),
        serverTotalCents: serverTotalCents.toString(),
        shipping: JSON.stringify(shippingAddress),
        cartItems: JSON.stringify(
          validCartItems.map((item) => ({
            productId: item.product._id.toString(),
            name: item.product.name,
            quantity: item.quantity,
            size: item.size,
            price: item.product.price,
          }))
        ),
      },
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "LK"],
      },
      customer_email: user.email,
      success_url: `${FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/checkout`,
    });

    console.log("✅ Stripe session created:", session.id);

    // Create pending payment record
    await Payment.create({
      user: req.user._id,
      stripeSessionId: session.id,
      amount: fromCents(serverTotalCents),
      status: "pending",
      shippingAddress: shippingAddress,
    });

    res.json({
      url: session.url,
      id: session.id,
      amount: fromCents(serverTotalCents),
    });
  } catch (error) {
    console.error("❌ Error creating Stripe session:", error);
    res.status(500).json({
      message: "Failed to create checkout session",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Complete checkout and verify payment
// Complete checkout and verify payment - FIXED VERSION
// Complete checkout and verify payment - ULTRA ROBUST VERSION
router.post("/complete-checkout", auth, async (req, res) => {
  let session;
  let orderCreated = false;

  try {
    const { session_id } = req.body;

    console.log("🔄 Completing checkout for session:", session_id);

    if (!session_id) {
      return res.status(400).json({ message: "session_id is required" });
    }

    // Check if order already exists FIRST (idempotency check)
    const existingOrder = await Order.findOne({ stripeSessionId: session_id });
    if (existingOrder) {
      console.log("✅ Order already exists:", existingOrder._id);
      return res.status(200).json({
        message: "Order already processed",
        order: existingOrder,
      });
    }

    // Retrieve Stripe session with expanded data
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent", "line_items.data.price.product"],
    });

    if (!session) {
      return res.status(404).json({ message: "Stripe session not found" });
    }

    console.log("📊 Session status:", {
      payment_status: session.payment_status,
      status: session.status,
      amount_total: session.amount_total,
    });

    // Verify payment status
    if (session.payment_status !== "paid") {
      return res.status(400).json({
        message: `Payment not completed. Status: ${session.payment_status}`,
      });
    }

    const userId = session.metadata.userId;

    // Parse metadata
    const serverTotalCents = parseInt(session.metadata.serverTotalCents) || 0;
    let shippingAddress = {};
    let cartItemsFromMeta = [];

    try {
      shippingAddress = JSON.parse(session.metadata.shipping || "{}");
      cartItemsFromMeta = JSON.parse(session.metadata.cartItems || "[]");
    } catch (parseError) {
      console.warn("⚠️ Error parsing metadata:", parseError);
    }

    // Verify we have cart items
    if (cartItemsFromMeta.length === 0) {
      return res.status(400).json({ message: "No items found in order" });
    }

    console.log("📦 Cart items from metadata:", cartItemsFromMeta.length);

    // Create order items from metadata
    const orderItems = cartItemsFromMeta.map((item) => ({
      product: item.productId,
      name: item.name,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
    }));

    // Use Stripe's collected address if available
    const finalShippingAddress = session.shipping_details
      ? {
          name: session.shipping_details.name,
          address: `${session.shipping_details.address.line1} ${
            session.shipping_details.address.line2 || ""
          }`.trim(),
          city: session.shipping_details.address.city,
          postalCode: session.shipping_details.address.postal_code,
          country: session.shipping_details.address.country,
        }
      : shippingAddress;

    // Create order
    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount: fromCents(session.amount_total),
      shippingAddress: finalShippingAddress,
      paymentStatus: "paid",
      stripeSessionId: session_id,
      stripePaymentIntent: session.payment_intent?.id,
    });

    await order.save();
    orderCreated = true;
    console.log("✅ Order created:", order._id);

    // Update payment record
    await Payment.findOneAndUpdate(
      { stripeSessionId: session_id },
      {
        status: "paid",
        order: order._id,
        stripePaymentIntent: session.payment_intent?.id,
        amount: fromCents(session.amount_total),
      },
      { new: true }
    );

    // FIXED: Ultra-robust cart clearing with multiple fallbacks
    console.log("🔄 Clearing cart for user:", userId);
    let cartCleared = false;

    try {
      // Method 1: Direct atomic update (most reliable)
      const result = await User.findByIdAndUpdate(
        userId,
        {
          $set: { cart: [] },
          $inc: { __v: 1 },
        },
        {
          new: true,
          runValidators: false,
        }
      );

      if (result) {
        cartCleared = true;
        console.log("✅ User cart cleared successfully (Method 1)");
      }
    } catch (cartError1) {
      console.warn("⚠️ Method 1 failed, trying fallback...");

      try {
        // Method 2: Using $pull with empty array (alternative approach)
        await User.updateOne(
          { _id: userId },
          {
            $pull: { cart: { $exists: true } }, // Remove all cart items
            $inc: { __v: 1 },
          }
        );
        cartCleared = true;
        console.log("✅ User cart cleared successfully (Method 2)");
      } catch (cartError2) {
        console.warn("⚠️ Method 2 failed, trying final fallback...");

        try {
          // Method 3: Direct MongoDB driver operation (bypass Mongoose)
          const db = mongoose.connection.db;
          await db
            .collection("users")
            .updateOne(
              { _id: new mongoose.Types.ObjectId(userId) },
              { $set: { cart: [] } }
            );
          cartCleared = true;
          console.log("✅ User cart cleared successfully (Method 3)");
        } catch (cartError3) {
          console.error("❌ All cart clearing methods failed:", cartError3);
        }
      }
    }

    if (!cartCleared) {
      console.warn(
        "⚠️ Order created but cart clearing failed. Manual cleanup may be needed."
      );
    }

    // Send confirmation email
    const user = await User.findById(userId);
    if (user && transporter) {
      try {
        const calculateOrderCharges = (orderItems) => {
          // Calculate subtotal from all items
          const subtotal = orderItems.reduce((total, item) => {
            return total + parseFloat(item.price) * parseInt(item.quantity);
          }, 0);

          // Define your business rules
          const shippingCost = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
          const taxRate = 0.1; // 10% tax
          const taxAmount = subtotal * taxRate;
          const finalTotal = subtotal + shippingCost + taxAmount;

          return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            shippingCost: parseFloat(shippingCost.toFixed(2)),
            taxRate: parseFloat(taxRate.toFixed(3)),
            taxAmount: parseFloat(taxAmount.toFixed(2)),
            finalTotal: parseFloat(finalTotal.toFixed(2)),
          };
        };

        // Calculate charges
        const charges = calculateOrderCharges(order.items);

        console.log("💰 Calculated charges:", charges);
        console.log("📧 Attempting to send order confirmation email...");
        const mailOptions = {
          from: `"FashionStore" <${process.env.SMTP_USER}>`,
          to: user.email,
          subject: `Order Confirmation #${order._id.toString().slice(-8)}`,
          html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { 
                    font-family: 'Arial', sans-serif; 
                    line-height: 1.6; 
                    color: #333; 
                    max-width: 600px; 
                    margin: 0 auto; 
                    padding: 20px;
                    background-color: #f9f9f9;
                }
                .header { 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white; 
                    padding: 30px; 
                    text-align: center; 
                    border-radius: 10px 10px 0 0;
                }
                .content { 
                    background: white; 
                    padding: 30px; 
                    border-radius: 0 0 10px 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .order-number { 
                    background: #f8f9fa; 
                    padding: 15px; 
                    border-radius: 5px; 
                    text-align: center; 
                    margin: 20px 0;
                    border-left: 4px solid #667eea;
                }
                .section { 
                    margin: 25px 0; 
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                }
                .section-title { 
                    color: #2d3748; 
                    border-bottom: 2px solid #667eea; 
                    padding-bottom: 10px; 
                    margin-bottom: 15px;
                    font-size: 18px;
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin: 15px 0;
                }
                th { 
                    background: #667eea; 
                    color: white; 
                    padding: 12px; 
                    text-align: left;
                }
                td { 
                    padding: 12px; 
                    border-bottom: 1px solid #e2e8f0;
                }
                .total-table { 
                    background: #f0fff4; 
                    border: 2px solid #48bb78;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .total-row { 
                    font-weight: bold; 
                    font-size: 16px;
                }
                .shipping-address { 
                    background: #fff; 
                    padding: 15px; 
                    border-radius: 5px; 
                    border: 1px solid #e2e8f0;
                    margin-top: 10px;
                }
                .footer { 
                    text-align: center; 
                    margin-top: 30px; 
                    padding-top: 20px; 
                    border-top: 1px solid #e2e8f0; 
                    color: #718096;
                }
                .thank-you { 
                    font-size: 20px; 
                    color: #2d3748; 
                    margin-bottom: 10px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🎉 Order Confirmed!</h1>
                <p>Thank you for shopping with FashionStore</p>
            </div>
            
            <div class="content">
                <div class="order-number">
                    <h2 style="margin: 0; color: #2d3748;">Order #${order._id
                      .toString()
                      .slice(-8)
                      .toUpperCase()}</h2>
                    <p style="margin: 5px 0 0 0; color: #718096;">Placed on ${new Date(
                      order.createdAt || Date.now()
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</p>
                </div>

                <!-- Customer Greeting -->
                <div style="text-align: center; margin-bottom: 20px;">
                    <p class="thank-you">Hello, ${user.name}!</p>
                    <p>Thank you for your order. We're getting it ready for shipment.</p>
                </div>

                <!-- Order Items Section -->
                <div class="section">
                    <h3 class="section-title">📦 Order Items</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Size</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items
                              .map(
                                (item) => `
                                <tr>
                                    <td><strong>${item.name}</strong></td>
                                    <td>${item.size || "N/A"}</td>
                                    <td>${item.quantity}</td>
                                    <td>$${parseFloat(item.price || 0).toFixed(
                                      2
                                    )}</td>
                                    <td>$${(
                                      (item.quantity || 1) *
                                      parseFloat(item.price || 0)
                                    ).toFixed(2)}</td>
                                </tr>
                            `
                              )
                              .join("")}
                        </tbody>
                    </table>
                </div>

                <!-- Bill Summary Section -->
                <div class="section">
                    <h3 class="section-title">💰 Order Summary</h3>
                    <table class="total-table">
                        <tr>
                            <td>Subtotal:</td>
                            <td>$${charges.subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Shipping:</td>
                            <td>$${charges.shippingCost.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Tax (${(charges.taxRate * 100).toFixed(
                              0
                            )}%):</td>
                            <td>$${charges.taxAmount.toFixed(2)}</td>
                        </tr>
                        <tr class="total-row" style="background: #e6fffa;">
                            <td><strong>Grand Total:</strong></td>
                            <td><strong>$${charges.finalTotal.toFixed(
                              2
                            )}</strong></td>
                        </tr>
                    </table>
                </div>

                <!-- Shipping Address Section -->
                <div class="section">
                    <h3 class="section-title">🏠 Shipping Address</h3>
                    <div class="shipping-address">
                        <p style="margin: 0 0 10px 0;"><strong>${
                          order.shippingAddress?.name || "Not provided"
                        }</strong></p>
                        <p style="margin: 5px 0;">${
                          order.shippingAddress?.address || "Not provided"
                        }</p>
                        <p style="margin: 5px 0;">
                            ${order.shippingAddress?.city || ""}, ${
            order.shippingAddress?.postalCode || ""
          }
                        </p>
                        <p style="margin: 5px 0;">${
                          order.shippingAddress?.country || ""
                        }</p>
                    </div>
                </div>

                <!-- Payment Method Section -->
                <div class="section">
                    <h3 class="section-title">💳 Payment Information</h3>
                    <p><strong>Payment Method:</strong> Credit Card (Stripe)</p>
                    <p><strong>Payment Status:</strong> <span style="color: #48bb78; font-weight: bold;">Paid</span></p>
                    <p><strong>Transaction ID:</strong> ${
                      order.stripePaymentIntent ||
                      order.stripeSessionId ||
                      "N/A"
                    }</p>
                </div>

                <!-- Next Steps -->
                <div class="section" style="background: #e6f7ff; border-left: 4px solid #1890ff;">
                    <h3 class="section-title" style="color: #1890ff;">📬 What's Next?</h3>
                    <p><strong>Order Processing:</strong> We'll process your order within 24 hours.</p>
                    <p><strong>Shipping:</strong> You'll receive a tracking number once your order ships.</p>
                    <p><strong>Delivery:</strong> Expected delivery in 3-5 business days.</p>
                </div>

                <div class="footer">
                    <p class="thank-you">Thank you for your purchase!</p>
                    <p>You can track your order status in your <a href="${
                      process.env.FRONTEND_URL
                    }/orders" style="color: #667eea;">account dashboard</a>.</p>
                    <p>If you have any questions, please contact our support team.</p>
                    <p style="margin-top: 20px;">
                        <strong>FashionStore Team</strong><br>
                        <a href="mailto:support@fashionstore.com" style="color: #667eea;">support@fashionstore.com</a>
                    </p>
                </div>
            </div>
        </body>
        </html>
      `,
          // Text version for email clients that don't support HTML
          text: `
ORDER CONFIRMATION - FASHIONSTORE
=================================

Thank you for your order, ${user.name}!

Order Details:
--------------
Order Number: ${order._id.toString().slice(-8).toUpperCase()}
Order Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString()}

Items Ordered:
${order.items
  .map(
    (item) =>
      `- ${item.name} (Size: ${item.size || "N/A"}) - ${item.quantity} x $${
        item.price
      } = $${((item.quantity || 1) * parseFloat(item.price || 0)).toFixed(2)}`
  )
  .join("\n")}

Order Summary:
--------------
Subtotal: $${charges.subtotal.toFixed(2)}
Shipping: $${charges.shippingCost.toFixed(2)}
Tax (${(charges.taxRate * 100).toFixed(0)}%): $${charges.taxAmount.toFixed(2)}
Grand Total: $${charges.finalTotal.toFixed(2)}

Shipping Address:
-----------------
${order.shippingAddress?.name || "Not provided"}
${order.shippingAddress?.address || "Not provided"}
${order.shippingAddress?.city || ""}, ${order.shippingAddress?.postalCode || ""}
${order.shippingAddress?.country || ""}

Payment Information:
-------------------
Payment Method: Credit Card
Payment Status: Paid
Transaction ID: ${order.stripePaymentIntent || order.stripeSessionId || "N/A"}

What's Next?
------------
- Order Processing: We'll process your order within 24 hours
- Shipping: You'll receive a tracking number once your order ships
- Delivery: Expected delivery in 3-5 business days

You can track your order status in your account dashboard: ${
            process.env.FRONTEND_URL
          }/orders

Thank you for shopping with FashionStore!

Best regards,
FashionStore Team
support@fashionstore.com
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(
          "✅ Order confirmation email sent! Message ID:",
          info.messageId
        );
      } catch (emailError) {
        console.error("❌ Email sending failed:", emailError.message);
        // Don't fail the request if email fails
      }
    } else if (!transporter) {
      console.warn("⚠️ Email transporter not available - skipping email");
    }

    res.status(201).json({
      message: "Order created successfully",
      order: order,
      cartCleared: cartCleared,
      payment: {
        id: session.payment_intent?.id,
        status: "paid",
        amount: order.totalAmount,
      },
    });
  } catch (error) {
    console.error("❌ Error completing checkout:", error);

    // Update payment status to failed if we have a session
    if (session && orderCreated) {
      await Payment.findOneAndUpdate(
        { stripeSessionId: session.id },
        { status: "failed", error: error.message }
      );
    }

    res.status(500).json({
      message: "Failed to complete checkout",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get payment status
router.get("/status/:sessionId", auth, async (req, res) => {
  try {
    const { sessionId } = req.params;

    console.log("🔄 Checking payment status for session:", sessionId);

    const payment = await Payment.findOne({
      stripeSessionId: sessionId,
      user: req.user._id,
    }).populate("order");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // If payment is pending, check with Stripe for latest status
    if (payment.status === "pending") {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status === "paid") {
          payment.status = "paid";
          await payment.save();
        }
      } catch (stripeError) {
        console.warn(
          "⚠️ Could not verify payment status with Stripe:",
          stripeError.message
        );
      }
    }

    res.json(payment);
  } catch (error) {
    console.error("❌ Error fetching payment status:", error);
    res.status(500).json({ message: "Failed to fetch payment status" });
  }
});

// Webhook endpoint for Stripe (recommended for production)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("💰 Payment succeeded via webhook:", session.id);

      // Update payment status
      await Payment.findOneAndUpdate(
        { stripeSessionId: session.id },
        { status: "paid" }
      );
    }

    res.json({ received: true });
  }
);

module.exports = router;
