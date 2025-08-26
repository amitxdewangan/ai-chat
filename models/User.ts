import mongoose, { Schema, Document, models } from "mongoose";

export interface User extends Document {
  email: string;
  name?: string;
  avatar?: string;
  role: "user" | "admin";
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<User>(
  {
    email: { 
      type: String, 
      required: true,
      unique: true
    },
    name: { 
      type: String 
    },
    avatar: { 
      type: String 
    }, // profile picture (optional, Cloudinary URL)
    role: { 
      type: String, 
      enum: ["user", "admin"], 
      default: "user" 
    },
    password: { 
      type: String, 
      required: true, 
      minlength: 6 
    },
  },
  { timestamps: true }
);

export default models.User || mongoose.model<User>("User", UserSchema);
