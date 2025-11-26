const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Remove deprecated options
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Check if MONGODB_URI is correct in your .env file');
    console.log('2. Verify your MongoDB Atlas username and password');
    console.log('3. Check if your IP is whitelisted in MongoDB Atlas');
    console.log('4. Ensure your database user has correct permissions');
    
    // If it's an authentication error, provide specific guidance
    if (error.message.includes('authentication failed')) {
      console.log('\n🔐 Authentication Failed - Check:');
      console.log('• Database username and password in connection string');
      console.log('• Special characters in password should be URL encoded');
      console.log('• Database user has read/write permissions');
    }
    
    process.exit(1);
  }
};

// MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.log('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('👋 MongoDB connection closed through app termination');
  process.exit(0);
});

module.exports = connectDB;