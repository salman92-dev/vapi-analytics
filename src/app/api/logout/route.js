import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Remove cookie
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: false,
    path: "/",
    expires: new Date(0), // expires immediately
  });

  return response;
}
