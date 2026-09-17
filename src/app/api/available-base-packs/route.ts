// app/api/available-base-packs/route.ts
import { NextResponse } from "next/server";
import { ULKA_API_URL, ulkaHeaders } from "../../../lib/ulkaConfig";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get("account_id");
  const brandId = searchParams.get("brand_id");
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  // ✅ Only account_id and token required
  if (!accountId || !token) {
    return NextResponse.json(
      { success: false, message: "Missing account_id or token" },
      { status: 400 }
    );
  }

  try {
    // ✅ Base packs master list
    let url = `${ULKA_API_URL}/bouque/list?fields=id,name,description,mrp,rate&expand=type_lbl,boxtype_lbl&filter[type]=1&filter[is_online_app]=1`;

    // ✅ notfilter uses ACCOUNT ID (50556), not subscriberId
    url += `&notfilter[account_id]=${accountId}`;

    // ✅ Optional brand filter
    if (brandId) {
      url += `&filter[brand_id]=${brandId}`;
    }

    console.log("[available-base-packs] URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: ulkaHeaders(token),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Available base packs proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch available base packs" },
      { status: 500 }
    );
  }
}
