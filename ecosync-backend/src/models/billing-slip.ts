import { Schema, model, Document } from "mongoose";

interface BillingSlip extends Document {
  stsId: string;
  landfillId: string;
  vehicleId: string;
  timeOfTransport: Date;
  weightOfWaste: number;
  fuelAllocation: number;
}

const billingSlipSchema = new Schema<BillingSlip>({
  stsId: { type: String, required: true },
  landfillId: { type: String, required: true },
  vehicleId: { type: String, required: true },
  timeOfTransport: { type: Date, required: true },
  weightOfWaste: { type: Number, required: true },
  fuelAllocation: { type: Number, required: true },
});

export default model<BillingSlip>("BillingSlip", billingSlipSchema);
