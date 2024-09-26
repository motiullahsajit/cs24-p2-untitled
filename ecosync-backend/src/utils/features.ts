import mongoose from "mongoose";

export const connectDB = (uri: string) => {
  mongoose
    .connect(uri)
    .then((c) => console.log(`DB Connected to ${c.connection.host}`))
    .catch((e) => console.log("DB connection error: ", e));
};
