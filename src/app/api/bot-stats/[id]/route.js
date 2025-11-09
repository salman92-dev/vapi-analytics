// /app/api/bots/[id]/stats/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req, { params }) {
  const { id } =await  params;

  try {
    // Step 1: Fetch bot record from database
    const result = await pool.query("SELECT * FROM bots WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }

    const bot = result.rows[0];
    const { vapi_private_api_key, assistant_id } = bot;

    // Step 2: Validate bot credentials
    if (!vapi_private_api_key || !assistant_id) {
      return NextResponse.json(
        { error: "Bot credentials are missing" },
        { status: 400 }
      );
    }

    // Step 3: Call Vapi API to get bot data (replace endpoint with actual one)
    const vapiRes = await fetch(`https://api.vapi.ai/chat?assistantId=${assistant_id}`, {
      headers: {
        Authorization: `Bearer ${vapi_private_api_key}`,
        "Content-Type": "application/json",
      },
    });

    if (!vapiRes.ok) {
      throw new Error(`Vapi API error: ${vapiRes.status}`);
    }

    const vapiData = await vapiRes.json();

    // Step 4: Return both local + Vapi info
    return NextResponse.json({
      bot: {
        id: bot.id,
        email: bot.email,
        assistant_id: bot.assistant_id,
      },
      vapiData,
    });
  } catch (err) {
    console.error("Error fetching bot stats:", err);
    return NextResponse.json(
      { error: "Failed to fetch bot stats" },
      { status: 500 }
    );
  }
}
