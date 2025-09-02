import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI as string;
    if (!uri) throw new Error('MONGO_URI is not defined');
    const conn = await mongoose.connect(uri);
    // eslint-disable-next-line no-console
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

