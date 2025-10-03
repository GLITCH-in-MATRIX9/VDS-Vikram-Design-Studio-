

import mongoose from 'mongoose';

const connectDB = async (mongoUri: string) => {
  if (!mongoUri) throw new Error('MONGO_URI not defined in .env');

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected:', mongoUri);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

export default connectDB;


