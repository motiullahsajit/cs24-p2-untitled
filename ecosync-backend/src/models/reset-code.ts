import { Schema, model, Document } from "mongoose";

interface ResetCode extends Document {
  username: string;
  email: string;
  code: string;
  expirationTime: Date;
}

const resetCodeSchema = new Schema<ResetCode>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  code: { type: String, required: true },
  expirationTime: { type: Date, required: true },
});

export default model<ResetCode>("ResetCode", resetCodeSchema);
