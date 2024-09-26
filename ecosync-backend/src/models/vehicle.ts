import { Schema, model, Document } from "mongoose";

interface Vehicle extends Document {
  registrationNumber: string;
  type: string;
  capacity: number;
  fuelCostPerKilometer: {
    fullyLoaded: number;
    unloaded: number;
  };
}

const vehicleSchema = new Schema<Vehicle>({
  registrationNumber: { type: String, required: true },
  type: { type: String, required: true },
  capacity: { type: Number, required: true },
  fuelCostPerKilometer: {
    fullyLoaded: { type: Number, required: true },
    unloaded: { type: Number, required: true },
  },
});

export default model<Vehicle>("Vehicle", vehicleSchema);
