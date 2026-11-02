import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getRequests } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const session = getSessionUser(request);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const incoming = getRequests({ lenderId: session.id });
    const outgoing = getRequests({ borrowerId: session.id });

    return NextResponse.json({
      incoming,
      outgoing,
    });
  } catch (err) {
    console.error("GET /api/requests error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve requests." },
      { status: 500 }
    );
  }
}

