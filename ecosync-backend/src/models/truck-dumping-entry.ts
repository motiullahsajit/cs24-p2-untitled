import { Schema, model, Document } from "mongoose";

interface TruckDumpingEntry extends Document {
  landfillId: string;
  weightOfWaste: number;
  timeOfArrival: Date;
  timeOfDeparture: Date;
}

const truckDumpingEntrySchema = new Schema<TruckDumpingEntry>({
  landfillId: { type: String, required: true },
  weightOfWaste: { type: Number, required: true },
  timeOfArrival: { type: Date, required: true },
  timeOfDeparture: { type: Date, required: true },
});

export default model<TruckDumpingEntry>(
  "TruckDumpingEntry",
  truckDumpingEntrySchema
);
