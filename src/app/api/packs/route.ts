// // app/api/packs/route.ts (updated)

import { NextResponse } from "next/server";
import { ULKA_API_URL, ulkaHeaders } from "../../../lib/ulkaConfig";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subscriberId = searchParams.get("subscriber_id");
  const accountId = searchParams.get("account_id");
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!subscriberId || !accountId) {
    return NextResponse.json(
      { success: false, message: "Missing subscriber or account ID" },
      { status: 400 }
    );
  }

  const response = await fetch(
    `${ULKA_API_URL}/account-bouque?expand=amount_charged&sort=activation_date&filter[account_id]=${accountId}`,
    {
      method: "GET",
      headers: ulkaHeaders(token),
    }
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
