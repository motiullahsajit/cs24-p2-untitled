import { Schema, model, Document } from "mongoose";

interface LoggedWorkingHours extends Document {
    logInTime: Date;
    logOutTime: Date;
    totalHoursWorked: number;
    overtimeHours: number;
    absencesAndLeaves: string;
}

const loggedWorkingHoursSchema = new Schema<LoggedWorkingHours>({
    logInTime: { type: Date, required: true },
    logOutTime: { type: Date, required: true },
    totalHoursWorked: { type: Number, required: true },
    overtimeHours: { type: Number, required: true },
    absencesAndLeaves: { type: String, required: true }
});

export default model<LoggedWorkingHours>("LoggedWorkingHours", loggedWorkingHoursSchema);
