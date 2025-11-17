import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const connectDB = async () => {
  try {
    const baseUri = process.env.MONGODB_URI?.trim();
    const uri = `${baseUri}/chat-app`;
   

    if (!uri) throw new Error("MONGODB_URI is undefined or empty.");

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(" MongoDB connected successfully");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error.message);
  }
};
