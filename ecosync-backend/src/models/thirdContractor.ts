import { Schema, model, Document } from "mongoose";

interface thirdContractor extends Document {
  companyName: string;
  contractId: string;
  registrationId: string;
  registrationDate: Date;
  tin: string;
  contactNumber: string;
  workforceSize: number;
  paymentPerTonnage: number;
  requiredAmountPerDay: number;
  contractDuration: number; // Duration in months or years
  areaOfCollection: string;
  designatedSTS: string; // ID of the designated STS
}

const thirdContractorSchema = new Schema<thirdContractor>({
  companyName: { type: String, },
  contractId: { type: String, },
  registrationId: { type: String, },
  registrationDate: { type: Date, },
  tin: { type: String, },
  contactNumber: { type: String, },
  workforceSize: { type: Number, },
  paymentPerTonnage: { type: Number, },
  requiredAmountPerDay: { type: Number, },
  contractDuration: { type: Number, },
  areaOfCollection: { type: String, },
  designatedSTS: { type: String },
});

export default model<thirdContractor>("thirdContractor", thirdContractorSchema);
