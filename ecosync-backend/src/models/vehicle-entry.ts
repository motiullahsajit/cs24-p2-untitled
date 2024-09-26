import { Schema, model, Document } from "mongoose";

interface VehicleEntry extends Document {
  stsId: string;
  vehicleNumber: string;
  weightOfWaste: number;
  timeOfArrival: Date;
  timeOfDeparture: Date;
}

const vehicleEntrySchema = new Schema<VehicleEntry>({
  stsId: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  weightOfWaste: { type: Number, required: true },
  timeOfArrival: { type: Date, required: true },
  timeOfDeparture: { type: Date, required: true },
});

export default model<VehicleEntry>("VehicleEntry", vehicleEntrySchema);
