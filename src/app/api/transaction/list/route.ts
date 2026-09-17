// app/api/transaction/list/route.ts
import { NextResponse } from "next/server";
import { ULKA_API_URL, ulkaHeaders } from "../../../../lib/ulkaConfig"; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get("account_id");
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!accountId || !token) {
    return NextResponse.json(
      { success: false, message: "Missing account_id or token" },
      { status: 400 }
    );
  }

  try {
    // ✅ Exact old app URL
    const url =
      `${ULKA_API_URL}/subscriber-transaction` +
      `?filter[account_id]=${accountId}` +
      `&expand=name_lbl,operator_id_lbl,discount_lbl,created_by_lbl,notes_lbl,transactionfor_lbl` +
      `&per-page=100&page=1`;

    console.log("[Transactions] URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: ulkaHeaders(token),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Transaction proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}