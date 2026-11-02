import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getUserById } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const session = getSessionUser(request);
    if (!session || !session.id) {
      return NextResponse.json({ user: null });
    }

    const user = getUserById(session.id);
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        dob: user.dob,
      },
    });
  } catch (err) {
    console.error("auth/me error:", err);
    return NextResponse.json({ user: null });
  }
}

