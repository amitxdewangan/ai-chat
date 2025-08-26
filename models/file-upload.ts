import mongoose, { Schema, Document, models } from "mongoose";

export interface FileUpload extends Document {
  userId: mongoose.Types.ObjectId;
  chatId: mongoose.Types.ObjectId;
  messageId?: mongoose.Types.ObjectId;
  url: string;
  publicId: string;
  type: "image" | "document";
  originalName: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

const FileUploadSchema = new Schema<FileUpload>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true
    },
    messageId: {
      type: Schema.Types.ObjectId,
      ref: "Message"
    }, // optional
    url: {
      type: String,
      required: true
    }, // Cloudinary file URL
    publicId: {
      type: String,
      required: true
    }, // Cloudinary file ID
    type: {
      type: String,
      enum: ["image", "document"],
      required: true
    },
    originalName: { type: String, required: true },
    size: { type: Number, required: true }, // in bytes
  },
  { timestamps: true }
);

export default models.FileUpload || mongoose.model<FileUpload>("FileUpload", FileUploadSchema);
