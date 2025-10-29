// app/api/vapi-usage/route.js
import { NextResponse } from "next/server";

let cachedData = null;           // 🧠 Last cached data
let lastFetchedTime = 0;         // ⏰ Last fetch timestamp
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in ms

export async function GET() {
  try {
    const now = Date.now();

    // ✅ If cache exists and still valid, return it
    if (cachedData && now - lastFetchedTime < CACHE_DURATION) {
      console.log("✅ Returning cached Vapi usage (still fresh)");
      return NextResponse.json(cachedData, {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=60",
        },
      });
    }

    // 🔐 Securely read API key
    const apiKey = process.env.VAPI_API_KEY || "34cdb75e-9048-4976-aa53-a3c0d60caafd";

    if (!apiKey) {
      return NextResponse.json(
        { error: "VAPI_API_KEY is missing in environment variables" },
        { status: 500 }
      );
    }

    // 🌐 Fetch fresh data
    const res = await fetch("https://api.vapi.ai/call", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Vapi API responded with status ${res.status}`);
    }

    const newData = await res.json();

    // 🧠 Compare with previous cache — if data same, don’t update
    const isSame = JSON.stringify(newData) === JSON.stringify(cachedData);

    if (isSame && cachedData) {
      console.log("⚙️ Data unchanged — returning existing cached data");
      return NextResponse.json(cachedData, {
        headers: {
          "Cache-Control": "public, s-maxage=900, stale-while-revalidate=60",
        },
      });
    }

    // 🆕 Data changed → update cache
    cachedData = newData;
    lastFetchedTime = now;

    console.log("♻️ New data detected — cache updated");
    return NextResponse.json(newData, {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("❌ Error fetching Vapi usage:", error);

    // 🚨 On error, still return previous cached data (if available)
    if (cachedData) {
      console.log("⚠️ API failed — serving cached data");
      return NextResponse.json(cachedData, { status: 200 });
    }

    // If no cache available, return error
    return NextResponse.json(
      { error: "Failed to fetch Vapi usage data" },
      { status: 500 }
    );
  }
}
