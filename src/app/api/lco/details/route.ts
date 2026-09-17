  //lco/details/route.ts
  import { NextRequest, NextResponse } from "next/server";

  const API_BASE = "https://partners.ulka.tv/api/railtel.php/v1";
  export const dynamic = "force-dynamic"; 
  export async function GET(req: NextRequest) {
    try {
      const subscriberId = req.nextUrl.searchParams.get("subscriber_id");
      if (!subscriberId) {
        return NextResponse.json({ error: "Missing subscriber_id" }, { status: 400 });
      }

      const token = req.headers.get("authorization")?.replace("Bearer ", "");
      if (!token) {
        return NextResponse.json({ error: "Missing authorization token" }, { status: 401 });
      }

      const response = await fetch(
        `${API_BASE}/lco/details?subscriber_id=${subscriberId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error("Proxy error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }
