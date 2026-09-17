// app/api/operator/route.ts
import { NextResponse } from "next/server";
import { ULKA_API_URL, ulkaHeaders } from "../../../lib/ulkaConfig";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const operatorId = searchParams.get("operator_id");
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!operatorId || !token) {
    return NextResponse.json(
      { success: false, message: "Missing operator_id or token" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${ULKA_API_URL}/operator/${operatorId}`,
      {
        method: "GET",
        headers: ulkaHeaders(token),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Operator proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch operator details" },
      { status: 500 }
    );
  }
}
