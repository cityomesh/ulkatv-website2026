// //api/ulka//bouquets//route.ts
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

// ======================================================
// ✅ OPERATOR ID (FIXED)
// ======================================================
const OPERATOR_ID = "3021";

// ======================================================
// ✅ MULTI-ENDPOINT FALLBACK
// ======================================================
// channelapi token ki railtel.php endpoint valid.
// Kani bouquet endpoint path confirm cheyyaleka,
// 3 possible URLs try chestamu — edi success aithe adi use chestamu.
// ======================================================

interface EndpointDef {
  name: string;
  url: string;
}

const buildEndpoints = (): EndpointDef[] => {
  const expand = "boxtype_lbl,type_lbl,status_lbl,created_by_lbl,rate";

  return [
    // 1. railtel.php + operator-bouque (channelapi token ki best guess)
    {
      name: "railtel-operator-bouque",
      url:
        `https://partners.ulka.tv/api/railtel.php/v1/operator-bouque` +
        `?expand=${expand}` +
        `&filter[operator_id]=${OPERATOR_ID}` +
        `&per-page=5000` +
        `&vr=railtel1.1`,
    },

    // 2. railtel.php + bouque/list
    {
      name: "railtel-bouque-list",
      url:
        `https://partners.ulka.tv/api/railtel.php/v1/bouque/list` +
        `?expand=${expand}` +
        `&filter[operator_id]=${OPERATOR_ID}` +
        `&per-page=5000` +
        `&vr=railtel1.1`,
    },

    // 3. index.php + operator-bouque (browser verified, but channelapi may 403)
    {
      name: "index-operator-bouque",
      url:
        `https://partners.ulka.tv/api/index.php/v1/operator-bouque` +
        `?expand=${expand}` +
        `&filter[operator_id]=${OPERATOR_ID}` +
        `&per-page=5000` +
        `&vr=web1.0`,
    },
  ];
};

// ======================================================
// CACHE
// ======================================================
const CACHE_TTL = 5 * 60 * 1000;

interface BouquetCache {
  data: unknown[];
  timestamp: number;
  source: string;
}

const globalForUlka = globalThis as typeof globalThis & {
  __ulkaBouquetCacheV3?: BouquetCache;
};

// ======================================================
// FETCH ONE ENDPOINT
// ======================================================

interface FetchResult {
  ok: boolean;
  status: number;
  items: Record<string, unknown>[];
  message?: string;
}

async function tryEndpoint(
  endpoint: EndpointDef,
  authorization: string
): Promise<FetchResult> {
  console.log(`[Bouquet] Trying: ${endpoint.name}`);
  console.log(`[Bouquet] URL: ${endpoint.url}`);

  try {
    const response = await fetch(endpoint.url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: authorization,
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/148.0.0.0 Safari/537.36",
        Referer: "https://partners.ulka.tv/",
        Origin: "https://partners.ulka.tv",
      },
      cache: "no-store",
    });

    const responseText = await response.text();

    console.log(
      `[Bouquet] ${endpoint.name} status:`,
      response.status,
      "body (first 300):",
      responseText.slice(0, 300)
    );

    // --------------------------------------------------
    // NON-2XX
    // --------------------------------------------------
    if (!response.ok) {
      let errMsg = responseText;
      try {
        const errJson = JSON.parse(responseText);
        errMsg =
          errJson?.data?.message ||
          errJson?.message ||
          responseText;
      } catch {
        /* keep raw */
      }

      return {
        ok: false,
        status: response.status,
        items: [],
        message: errMsg.slice(0, 300),
      };
    }

    // --------------------------------------------------
    // PARSE JSON
    // --------------------------------------------------
    let parsed: {
      success?: boolean;
      data?: unknown;
      message?: string;
    };

    try {
      parsed = JSON.parse(responseText);
    } catch {
      return {
        ok: false,
        status: response.status,
        items: [],
        message: "Invalid JSON response",
      };
    }

    if (parsed.success !== true) {
      return {
        ok: false,
        status: response.status,
        items: [],
        message: parsed.message || "API returned success=false",
      };
    }

    // --------------------------------------------------
    // EXTRACT ARRAY
    // --------------------------------------------------
    const items = Array.isArray(parsed.data)
      ? parsed.data.filter(
          (item): item is Record<string, unknown> =>
            typeof item === "object" &&
            item !== null &&
            !Array.isArray(item)
        )
      : [];

    return {
      ok: true,
      status: response.status,
      items,
    };
  } catch (error: unknown) {
    return {
      ok: false,
      status: 0,
      items: [],
      message:
        error instanceof Error ? error.message : "Unknown fetch error",
    };
  }
}

// ======================================================
// GET
// ======================================================

export async function GET(request: NextRequest) {
  const startedAt = Date.now();

  try {
    console.log("========================================");
    console.log("ULKA BOUQUET API START (operator_id=3021)");
    console.log("========================================");

    // --------------------------------------------------
    // CACHE
    // --------------------------------------------------
    const cached = globalForUlka.__ulkaBouquetCacheV3;
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(
        `Returning bouquets from CACHE (${cached.source}):`,
        cached.data.length
      );
      return NextResponse.json(
        {
          success: true,
          status: 200,
          operator_id: OPERATOR_ID,
          count: cached.data.length,
          data: cached.data,
          source: cached.source,
          cached: true,
        },
        { status: 200 }
      );
    }

    // --------------------------------------------------
    // AUTH
    // --------------------------------------------------
    const authorization = request.headers.get("authorization");
    if (!authorization) {
      return NextResponse.json(
        {
          success: false,
          status: 401,
          message: "ULKA access token is missing. Please login again.",
        },
        { status: 401 }
      );
    }

    // --------------------------------------------------
    // TRY ENDPOINTS SEQUENTIALLY (first success wins)
    // --------------------------------------------------
    const endpoints = buildEndpoints();
    const failures: Array<{ name: string; status: number; message?: string }> =
      [];

    for (const endpoint of endpoints) {
      const result = await tryEndpoint(endpoint, authorization);

      if (result.ok) {
        console.log(
          `✅ ${endpoint.name} SUCCESS — ${result.items.length} bouquets`
        );

        // Save cache
        globalForUlka.__ulkaBouquetCacheV3 = {
          data: result.items,
          timestamp: Date.now(),
          source: endpoint.name,
        };

        console.log(
          `Total time: ${Date.now() - startedAt}ms | Source: ${endpoint.name}`
        );
        console.log("========================================");

        return NextResponse.json(
          {
            success: true,
            status: 200,
            operator_id: OPERATOR_ID,
            count: result.items.length,
            data: result.items,
            source: endpoint.name,
            cached: false,
          },
          { status: 200 }
        );
      }

      // Failure — log and continue
      console.warn(
        `❌ ${endpoint.name} FAILED (status ${result.status}): ${result.message}`
      );
      failures.push({
        name: endpoint.name,
        status: result.status,
        message: result.message,
      });
    }

    // --------------------------------------------------
    // ALL FAILED
    // --------------------------------------------------
    const summary = failures
      .map((f) => `${f.name} → ${f.status} ${f.message || ""}`)
      .join(" | ");

    throw new Error(
      `All bouquet endpoints failed for operator_id=${OPERATOR_ID}. ${summary}`
    );
  } catch (error: unknown) {
    console.error("Bouquet API Error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch ULKA bouquet data";

    return NextResponse.json(
      {
        success: false,
        status: 500,
        operator_id: OPERATOR_ID,
        message,
        data: null,
      },
      { status: 500 }
    );
  }
}
