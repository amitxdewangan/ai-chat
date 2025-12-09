import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/user";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const reqBody = await req.json();
    const { email, password, name } = reqBody as { email: string; password: string; name: string };

    // Basic validation - enhance this using a library like Zod or Yup
    // Add more robust validation as needed like regex for email, password strength, length, etc.
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "email, password, and name are required" }, 
        { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (user) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name: name ?? undefined,
    });

    const safeUser = newUser.toObject();
    delete safeUser.password;

    return NextResponse.json({
      message: "User registered successfully",
      success: true,
      user: safeUser,
    }, { status: 201 });
    
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
