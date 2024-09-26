import { Schema, model, Document } from "mongoose";

interface TransportedWasteEntry extends Document {
    timeAndDateOfCollection: Date;
    amountCollectedKg: number;
    contractorId: string;
    typeOfWaste: string;
    designatedSTS: string;
    vehicleUsed: string;
}

const transportedWasteEntrySchema = new Schema<TransportedWasteEntry>({
    timeAndDateOfCollection: { type: Date },
    amountCollectedKg: { type: Number },
    contractorId: { type: String },
    typeOfWaste: { type: String },
    designatedSTS: { type: String },
    vehicleUsed: { type: String }
});

export default model<TransportedWasteEntry>(
    "TransportedWasteEntry",
    transportedWasteEntrySchema
);
