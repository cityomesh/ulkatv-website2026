// // app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { ULKA_API_URL , ulkaHeaders} from "../../../../lib/ulkaConfig";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(`${ULKA_API_URL}/user/login`, {
      method: "POST",
      headers: ulkaHeaders(),   // ✅ authkey + content-type అన్నీ వస్తాయి
      body: JSON.stringify({
        LoginForm: {
          username: body.username,
          password: body.password,
        },
      }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Login proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
