import { Schema, model, Document } from "mongoose";

interface STS extends Document {
  wardNumber: string;
  capacity: number;
  location: {
    latitude: number;
    longitude: number;
  };
  managers: string[];
  trucks: string[];
  stsId: string;
}

const stsSchema = new Schema<STS>({
  wardNumber: { type: String, required: true },
  capacity: { type: Number, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  managers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  trucks: [{ type: Schema.Types.ObjectId, ref: "Vehicle" }],
  stsId: { type: String, required: true, unique: true },
});

export default model<STS>("STS", stsSchema);
