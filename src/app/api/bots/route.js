// 📁 src/app/api/bots/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

// 🟡 Fetch All Bots
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        bots.id,
        bots.email,
        users.full_name,
        bots.assistant_id,
        bots.vapi_private_api_key,
        bots.created_at
      FROM bots
      INNER JOIN users ON bots.email = users.email
      ORDER BY bots.created_at DESC;
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching bots:", error);
    return NextResponse.json({ error: "Failed to fetch bots" }, { status: 500 });
  }
}
