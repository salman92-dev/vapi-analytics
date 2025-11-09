// /app/api/user-bots/[email]/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req, { params }) {
  const { email } =await params;

  try {
    // Fetch all bots linked to this user's email
    const result = await pool.query(
      `SELECT * 
       FROM bots  
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "No bots found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching user bots:", error);
    return NextResponse.json(
      { error: "Failed to fetch user bots" },
      { status: 500 }
    );
  }
}
