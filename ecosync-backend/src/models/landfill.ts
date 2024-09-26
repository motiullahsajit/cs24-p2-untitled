import { Schema, model, Document } from "mongoose";

interface Landfill extends Document {
  name: string;
  capacity: number;
  operationalTimespan: string;
  location: {
    latitude: number;
    longitude: number;
  };
  managers: string[];
  landfillId: string;
}

const landfillSchema = new Schema<Landfill>({
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  operationalTimespan: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  managers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  landfillId: { type: String, required: true, unique: true },
});

export default model<Landfill>("Landfill", landfillSchema);
