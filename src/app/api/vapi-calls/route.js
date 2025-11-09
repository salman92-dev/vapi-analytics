// app/api/vapi-usage/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
  try {
    const { bot_id } = await req.json();

    if (!bot_id) {
      return NextResponse.json(
        { error: "Bot ID is required." },
        { status: 400 }
      );
    }

    // Fetch bot credentials securely
    const { rows } = await pool.query(
      "SELECT vapi_private_api_key, assistant_id FROM bots WHERE id = $1 LIMIT 1",
      [bot_id]
    );

    if (!rows.length) {
      return NextResponse.json(
        { error: "Bot not found." },
        { status: 404 }
      );
    }

    const { vapi_private_api_key } = rows[0];

    if (!vapi_private_api_key) {
      return NextResponse.json(
        { error: "This bot has no API key assigned." },
        { status: 500 }
      );
    }

    // Request usage data from Vapi API
    const res = await fetch("https://api.vapi.ai/call", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${vapi_private_api_key}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Vapi API error: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("❌ VAPI Usage Route Error:", error);

    return NextResponse.json(
      { error: "Server error while fetching usage data." },
      { status: 500 }
    );
  }
}
