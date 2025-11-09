import { NextResponse } from "next/server";
import pool from "@/lib/db";
// import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Basic validation
    if (!email || !password)
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );

    // Find user by email
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const user = result.rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email,role : user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      message: "Login successful",
      user: { id: user.id, email: user.email, role: user.role }
    });

    // Return token and user info
    
      
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;

  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
