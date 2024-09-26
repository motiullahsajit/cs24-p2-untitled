import { Schema, model, Document } from "mongoose";

interface UserSessionSchema extends Document {
  userId: string;
  token: string;
}

const userSessionSchema = new Schema<UserSessionSchema>({
  userId: { type: String, required: true },
  token: { type: String, required: true },
});
export default model<UserSessionSchema>("UserSession", userSessionSchema);
