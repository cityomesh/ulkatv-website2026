// app/api/modify-base-pack/route.ts
import { NextResponse } from "next/server";
import { ULKA_API_URL, ulkaHeaders } from "../../../lib/ulkaConfig";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { old_bouque_id, new_bouque_id, rperiod_id, account_id } = body;
    const token = request.headers
      .get("authorization")
      ?.replace("Bearer ", "");

    if (
      !old_bouque_id ||
      !new_bouque_id ||
      !rperiod_id ||
      !account_id ||
      !token
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const operatorId = request.headers.get("x-operator-id") || "";
    const pairingId = request.headers.get("x-pairing-id") || "50694";
    const params = new URLSearchParams();
    if (operatorId) params.append("operator_id", operatorId);
    if (pairingId) params.append("pairing_id", pairingId);
    params.append("account_id", account_id);
    params.append("vr", "web1.0");

    const url = `${ULKA_API_URL}/recharge-period/${old_bouque_id}/mview?${params.toString()}`;

    console.log("[modify-base-pack] URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...ulkaHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        remark: "Modify bouquet",
        account_id: account_id,
        action: 2,
        bouque_id: new_bouque_id,
        old_bouque_id: old_bouque_id,
        rperiod_id: Number(rperiod_id),
      }),
    });

    const data = await response.json();
    console.log("[modify-base-pack] Response:", data);
    // The provider can return business errors in a successful HTTP response.
    if (!response.ok || data?.success === false) {
      return NextResponse.json(
        { ...data, success: false },
        { status: response.ok ? 502 : response.status }
      );
    }
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Modify base pack error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to modify base pack" },
      { status: 500 }
    );
  }
}
