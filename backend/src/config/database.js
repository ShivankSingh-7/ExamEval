import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // MongoDB connection options to handle SSL issues
    const options = {
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      ssl: true,
      tlsAllowInvalidCertificates: true, // For development only
      retryWrites: true,
      w: 'majority'
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    console.log(`📊 MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('📊 MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('📊 MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    // If it's an SSL error, provide helpful message
    if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.error('💡 SSL Connection Issue - Try these solutions:');
      console.error('1. Check your MongoDB Atlas network access settings');
      console.error('2. Ensure your IP address is whitelisted (try 0.0.0.0/0 for testing)');
      console.error('3. Update Node.js and MongoDB drivers to latest versions');
    }
    
    process.exit(1);
  }
};

export default connectDB;