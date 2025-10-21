import 'dotenv/config';

import mongoose from 'mongoose';

const DB_URL = process.env.DB_URL as string;

// Connect to MongoDB
mongoose
  .connect(DB_URL, {})
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
  })
  .catch((err: unknown) => {
    console.error('Could not connect to MongoDB:', err);
  });

export default mongoose;
