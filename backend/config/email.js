const nodemailer = require('nodemailer');

// Email configuration
const emailConfig = {
  // Gmail configuration (most common for development)
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use App Password for Gmail
  },
  
  // Alternative configuration for other services
  /*
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  */
};

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter(emailConfig);
};

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email server is ready to take our messages');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error.message);
    console.log('💡 For Gmail, make sure:');
    console.log('1. You have enabled 2-factor authentication');
    console.log('2. You have created an App Password');
    console.log('3. EMAIL_USER and EMAIL_PASS are set in .env');
    return false;
  }
};

// Email templates
const emailTemplates = {
  orderConfirmation: (order, user) => {
    return {
      subject: `Order Confirmation - #${order.orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #007bff; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
            .order-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .item { border-bottom: 1px solid #eee; padding: 10px 0; }
            .total { font-weight: bold; font-size: 18px; color: #007bff; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank you for your order!</h1>
              <p>Order #${order.orderId}</p>
            </div>
            <div class="content">
              <p>Hello ${user.name},</p>
              <p>Your order has been confirmed and is being processed.</p>
              
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
              
              <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
              <p>We'll notify you when your order ships. If you have any questions, please contact our support team.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 FashionStore. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  },
  
  welcomeEmail: (user) => {
    return {
      subject: 'Welcome to FashionStore!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 5px; }
            .content { padding: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to FashionStore!</h1>
            </div>
            <div class="content">
              <p>Hello ${user.name},</p>
              <p>Thank you for registering with FashionStore. We're excited to have you as a member!</p>
              <p>Start exploring our latest clothing collections and enjoy a seamless shopping experience.</p>
              <p>Happy shopping! 🛍️</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 FashionStore. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  }
};

module.exports = {
  emailConfig,
  createTransporter,
  verifyEmailConfig,
  emailTemplates
};