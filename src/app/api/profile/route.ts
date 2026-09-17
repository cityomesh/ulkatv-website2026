// // app/api/profile/route.ts
import { NextResponse } from "next/server";
import { ULKA_API_URL, ulkaHeaders } from "../../../lib/ulkaConfig";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subscriberId = searchParams.get("subscriber_id");
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!subscriberId || !token) {
    return NextResponse.json(
      { success: false, message: "Missing subscriber_id or token" },
      { status: 400 }
    );
  }

  const response = await fetch(
    `${ULKA_API_URL}/subscriber/profile/${subscriberId}`,
    {
      method: "GET",
      headers: ulkaHeaders(token),   // ✅ token + authkey + content-type
    }
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
