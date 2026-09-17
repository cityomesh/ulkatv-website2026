// app/api/recharge-periods/route.ts
import { NextResponse } from "next/server";
import { ULKA_API_URL, ulkaHeaders } from "../../../lib/ulkaConfig";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ids, account_id } = body;
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!ids || !Array.isArray(ids) || ids.length === 0 || !account_id || !token) {
      return NextResponse.json(
        { success: false, message: "Missing ids, account_id or token" },
        { status: 400 }
      );
    }

    const url = `${ULKA_API_URL}/recharge-period/${ids.join("-")}/mview`;

    const response = await fetch(url, {
      method: "POST",
      headers: ulkaHeaders(token),
      body: JSON.stringify({ account_id }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Recharge period proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch recharge periods" },
      { status: 500 }
    );
  }
}
