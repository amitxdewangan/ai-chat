import mongoose, { Schema, Document, models } from "mongoose";

export interface Message extends Document {
  chatId: mongoose.Types.ObjectId;
  sender: "user" | "assistant" | "system";
  content: string;
  edited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<Message>(
  {
    chatId: { 
      type: Schema.Types.ObjectId, 
      ref: "Chat",
      required: true 
    },
    sender: { 
      type: String,
      enum: ["user", "assistant", "system"],
      required: true 
    },
    content: { 
      type: String, 
      required: true 
    },
    edited: { 
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true }
);

export default models.Message || mongoose.model<Message>("Message", MessageSchema);
