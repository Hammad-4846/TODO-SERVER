import mongoose from "mongoose";

export const connectDatabase = async () => {
  const mongoUri =
      "mongodb+srv://curious_4846:8FJ9hcvPzU2uasrU@cluster0.konyvse.mongodb.net/?retryWrites=true&w=majority";

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
