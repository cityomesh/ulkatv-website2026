// app/api/addon/list/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://partners.ulka.tv/api/index.php/v1";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const subscriberId = req.nextUrl.searchParams.get("subscriber_id");
    const accountId = req.nextUrl.searchParams.get("account_id");

    if (!subscriberId || !accountId) {
      return NextResponse.json(
        { error: "Missing subscriber_id or account_id" },
        { status: 400 }
      );
    }

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }

    // Determine the pack type from the route path
    let typeFilter = "2"; // addon
    if (req.url.includes("/alacarte/list")) typeFilter = "3";
    else if (req.url.includes("/bouquet/list")) typeFilter = "1"; // base

    // Build query parameters exactly like the mobile app
    const params = new URLSearchParams();
    params.append("fields", "id,name,description,mrp");
    params.append("expand", "type_lbl,boxtype_lbl,name_lbl,alacarte,package");
    params.append("filter[type]", typeFilter);
    params.append("notfilter[account_id]", accountId);
    params.append("filter[is_online_app]", "1");
    params.append("filter[brand_id]", "2");

    const url = `${API_BASE}/bouque/list?${params.toString()}`;
    console.log("[Proxy] Fetching add-ons URL:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[Proxy] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
