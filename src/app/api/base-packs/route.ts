// app/api/base-packs/route.ts
import { NextResponse } from "next/server";
import { ULKA_API_URL, ulkaHeaders } from "../../../lib/ulkaConfig";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subscriberId = searchParams.get("subscriber_id");
  const accountId = searchParams.get("account_id");
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!subscriberId || !accountId || !token) {
    return NextResponse.json(
      { success: false, message: "Missing subscriber_id, account_id or token" },
      { status: 400 }
    );
  }

  try {
    // ✅ Old app URL exactly — account-bouque (all packs for account)
    const url = `${ULKA_API_URL}/account-bouque?expand=amount_charged&sort=activation_date&filter[account_id]=${accountId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: ulkaHeaders(token),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Base packs proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch packs" },
      { status: 500 }
    );
  }
}
