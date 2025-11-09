// 📁 src/app/api/bots/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

// 🟢 Add Bot (Assign Bot to User)
export async function POST(req) {
  try {
    const {bot_name, email, vapi_private_api_key, assistant_id } = await req.json();

    if (!email || !vapi_private_api_key || !assistant_id || !bot_name) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO bots (bot_name,email, vapi_private_api_key, assistant_id)
       VALUES ($1, $2, $3, $4);`,
      [bot_name,email, vapi_private_api_key, assistant_id]
    );

    return NextResponse.json({
      success: true,
      message: "Bot assigned successfully!",
      bot: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error assigning bot:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
