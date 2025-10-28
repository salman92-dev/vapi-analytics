// app/api/vapi-usage/route.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 🔐 Securely read your API key from environment variables
    const apiKey = "34cdb75e-9048-4976-aa53-a3c0d60caafd";

    if (!apiKey) {
      return NextResponse.json(
        { error: "VAPI_API_KEY is missing in environment variables" },
        { status: 500 }
      );
    }

    // 🧠 Replace this with the actual Vapi API endpoint for usage data
    // Example endpoint (replace if your endpoint differs)
    const res = await fetch("https://api.vapi.ai/call", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Vapi API responded with status ${res.status}`);
    }

    const data = await res.json();


   
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Vapi usage:", error);
    return NextResponse.json(
      { error: "Failed to fetch Vapi usage data" },
      { status: 500 }
    );
  }
}
