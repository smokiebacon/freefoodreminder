import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://smokiebacon:123456Abe123%23@linkful.ztcq2ri.mongodb.net/?retryWrites=true&w=majority&appName=Linkful"
    );
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
