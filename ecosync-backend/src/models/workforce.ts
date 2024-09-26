import { Schema, model, Document } from "mongoose";

interface Workforce extends Document {
    employeeId: string;
    fullName: string;
    dateOfBirth: Date;
    dateOfHire: Date;
    jobTitle: string;
    paymentRatePerHour: number;
    phoneNumber: string;
    address: string;
    assignedCollectionRoute: string;
}

const workforceSchema = new Schema<Workforce>({
    employeeId: { type: String, unique: true },
    fullName: { type: String },
    dateOfBirth: { type: Date },
    dateOfHire: { type: Date, default: Date.now },
    jobTitle: { type: String },
    paymentRatePerHour: { type: Number },
    phoneNumber: { type: String },
    address: { type: String },
    assignedCollectionRoute: { type: String },
});

export default model<Workforce>("Workforce", workforceSchema);
