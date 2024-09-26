import { Document, Schema, model } from "mongoose";

interface CollectionPlan extends Document {
    areaOfCollection: string;
    collectionStartTime: Date;
    duration: number;
    numberOfLaborers: number;
    numberOfVans: number;
    expectedWeightOfSolidWaste: number;
}

const collectionPlanSchema = new Schema<CollectionPlan>(
    {
        areaOfCollection: { type: String, required: true },
        collectionStartTime: { type: Date, required: true },
        duration: { type: Number, required: true },
        numberOfLaborers: { type: Number, required: true },
        numberOfVans: { type: Number, required: true },
        expectedWeightOfSolidWaste: { type: Number, required: true },
    },
    { timestamps: true }
);

const CollectionPlanModel = model<CollectionPlan>("CollectionPlan", collectionPlanSchema);

export default CollectionPlanModel;
