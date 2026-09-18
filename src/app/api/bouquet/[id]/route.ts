// src/app/api/bouquet/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const API_BASE = "https://partners.ulka.tv/api/index.php/v1";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Bouquet id missing" },
        { status: 400 }
      );
    }

    const token = req.headers
      .get("authorization")
      ?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Missing token" },
        { status: 401 }
      );
    }

    const url =
      `${API_BASE}/bouque/${encodeURIComponent(id)}` +
      `?fields=id,name&expand=channels`;

    console.log("[Bouquet Details] URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/148.0.0.0 Safari/537.36",
        Referer: "https://partners.ulka.tv/",
        Origin: "https://partners.ulka.tv",
      },
      cache: "no-store",
    });

    const text = await response.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { success: false, message: text };
    }

    if (!response.ok) {
      const d = data as {
        data?: { message?: string };
        message?: string;
      };
      console.error("[Bouquet Details] Failed:", response.status, data);
      return NextResponse.json(
        {
          success: false,
          message:
            d?.data?.message ||
            d?.message ||
            `Failed to fetch bouquet details (${response.status})`,
          data: null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[Bouquet Details] Exception:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", data: null },
      { status: 500 }
    );
  }
}
