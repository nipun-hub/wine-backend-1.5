import mongoose from 'mongoose';

const dbConfig = async () => {
  // const mongoUri = process.env.MONGODB_URI;
  const mongoUri = 'mongodb+srv://AventureIT123:AventureIT123@cluster0.6lvjymw.mongodb.net/Central_Dev?retryWrites=true&w=majority&appName=Cluster0';
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable not set');
  }

  try {
    await mongoose.connect(mongoUri);
    // console.log('Connected to MongoDB Database');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
};

export default dbConfig;
