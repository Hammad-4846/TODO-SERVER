import mongoose from "mongoose";

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGO_URI

  try {
      const connect = await mongoose.connect(mongoUri, {
          useUnifiedTopology: true,
          useNewUrlParser: true,
      });

      console.log(`MongoDB connected: ${connect.connection.host}`);
  } catch (error) {
      console.log(error);
      process.exit(1);
  }
};
