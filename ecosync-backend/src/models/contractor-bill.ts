import { Schema, model, Document } from "mongoose";

interface ContractorBill extends Document {
  stsId: Schema.Types.ObjectId;
  contractorName: string;
  weightCollected: number;
  requiredWeight: number;
  paymentPerTon: number;
  fineRate: number;
  basicPay: number;
  deficit: number;
  fine: number;
  totalBill: number;
  date?: Date;
}

const contractorBillSchema = new Schema<ContractorBill>({
  stsId: { type: Schema.Types.ObjectId, ref: "STS", required: true },
  contractorName: { type: String, required: true },
  weightCollected: { type: Number, required: true },
  requiredWeight: { type: Number, required: true },
  paymentPerTon: { type: Number, required: true },
  fineRate: { type: Number, required: true },
  basicPay: { type: Number, required: true },
  deficit: { type: Number, required: true },
  fine: { type: Number, required: true },
  totalBill: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

export default model<ContractorBill>("ContractorBill", contractorBillSchema);
