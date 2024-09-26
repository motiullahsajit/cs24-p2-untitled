import { Schema, Document, model } from "mongoose";

export interface UserSchema extends Document {
  username: string;
  password: string;
  role: string;
  email: string;
  name: string;
  phoneNumber: string;
  photoUrl: string;
}

const UserSchema = new Schema<UserSchema>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  phoneNumber: { type: String },
  photoUrl: { type: String },
});

export default model<UserSchema>("User", UserSchema);
