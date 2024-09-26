import { Schema, model, Document } from 'mongoose';

interface Tracker extends Document {
    mac: string;
    name: string;
    count: number;
}

const trackerSchema = new Schema<Tracker>({
    mac: { type: String },
    name: { type: String },
    count: { type: Number },
});

export default model<Tracker>('Tracker', trackerSchema);
