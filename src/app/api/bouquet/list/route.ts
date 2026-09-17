// // app/api/bouquet/list/route.ts
// import { NextRequest, NextResponse } from "next/server";

// const API_BASE = "https://partners.ulka.tv/api/index.php/v1";
// export const dynamic = "force-dynamic";
// export async function GET(req: NextRequest) {
//   try {
//     const subscriberId = req.nextUrl.searchParams.get("subscriber_id");
//     const accountId = req.nextUrl.searchParams.get("account_id");

//     if (!subscriberId || !accountId) {
//       return NextResponse.json(
//         { error: "Missing subscriber_id or account_id" },
//         { status: 400 }
//       );
//     }

//     const token = req.headers.get("authorization")?.replace("Bearer ", "");
//     if (!token) {
//       return NextResponse.json({ error: "Missing token" }, { status: 401 });
//     }

//     // Base packs = type 1 (but could also be all types for "renew packs")
//     // In mobile app, RenewPackScreen shows both active and upcoming packs
//     // They use the same `bouque/list` without filtering by type? Actually they use the same endpoint with filter[type]=1 for base.
//     // For renewal, we want to show all packs (including add-ons and alacarte) that are active/upcoming.
//     // But the mobile app's RenewPackScreen uses the basePackReducer which gets data from getBouquesForAccount (probably also type=1).
//     // Let's keep it as type=1 to match base packs.
//     const params = new URLSearchParams();
//     params.append("fields", "id,name,description,mrp");
//     params.append("expand", "type_lbl,boxtype_lbl,name_lbl,alacarte,package");
//     params.append("filter[type]", "1"); // Base packs
//     params.append("notfilter[account_id]", accountId);
//     params.append("filter[is_online_app]", "1");
//     params.append("filter[brand_id]", "2");

//     const url = `${API_BASE}/bouque/list?${params.toString()}`;
//     console.log("[Proxy] Fetching bouquet URL:", url);

//     const response = await fetch(url, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         Accept: "application/json",
//       },
//     });

//     const data = await response.json();
//     return NextResponse.json(data, { status: response.status });
//   } catch (error) {
//     console.error("[Proxy] Bouquet error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }



// app/api/bouquet/list/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ULKA_TOKEN } from "../../../../lib/ulkaToken";

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

    // Header lo token unte adi vaadu, lekapote hardcoded token vaadu
    const headerToken = req.headers
      .get("authorization")
      ?.replace("Bearer ", "");

    const token = headerToken || ULKA_TOKEN;

    const params = new URLSearchParams();
    params.append("fields", "id,name,description,mrp");
    params.append(
      "expand",
      "type_lbl,boxtype_lbl,name_lbl,alacarte,package"
    );
    params.append("filter[type]", "1");
    params.append("notfilter[account_id]", accountId);
    params.append("filter[is_online_app]", "1");
    params.append("filter[brand_id]", "2");

    const url = `${API_BASE}/bouque/list?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[Proxy] Bouquet error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
