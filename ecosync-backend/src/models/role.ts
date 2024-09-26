import { Schema, model, Document } from "mongoose";

interface Role extends Document {
  displayName: string;
  name: string;
  permissions: string[];
}

const roleSchema = new Schema<Role>({
  displayName: { type: String, required: true },
  name: { type: String, required: true },
  permissions: [{ type: String, required: true }],
});

export default model<Role>("Role", roleSchema);
