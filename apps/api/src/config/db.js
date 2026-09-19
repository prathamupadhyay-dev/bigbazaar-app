import mongoose from 'mongoose';
import dns from 'dns';

// ISP DNS blocks SRV lookups for *.mongodb.net — use Google DNS instead
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bigbazaar';
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000 // Fail fast after 10s
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;