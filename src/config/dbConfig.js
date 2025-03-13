import mongoose from 'mongoose';

const dbConfig = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable not set');
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Database');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
};

export default dbConfig;
