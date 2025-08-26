import mongoose, { Schema, Document, models } from "mongoose";

export interface Chat extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  status: "active" | "archived" | "deleted";
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<Chat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      default: "New Chat"
    },
    status: {
      type: String,
      enum: ["active", "archived", "deleted"],
      default: "active"
    },
  },
  { timestamps: true }
);

export default models.Chat || mongoose.model<Chat>("Chat", ChatSchema);
