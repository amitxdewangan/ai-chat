import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

if (!MONGO_URI) {
  throw new Error("Please add your Mongo URI to .env");
}

// Global cache object across hot reloads & serverless invocations
let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) {
    console.log("Using cached MongoDB connection");
    return cached.conn; // return existing connection
  }

  if (!cached.promise) {
    console.log("Creating new MongoDB connection...");
    cached.promise = mongoose
      .connect(MONGO_URI, {
        bufferCommands: false, // disables mongoose buffering
      })
      .then((mongoose) => {
        console.log("MongoDB connected successfully");
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // reset if connection failed
    console.error("MongoDB connection error:", error);
    throw error;
  }

  (global as any).mongoose = cached; // save in global
  return cached.conn;
}
