import { NextResponse } from "next/server";
import { createUser } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, dob } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required to log in." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const studentName = name && name.trim() ? name.trim() : normalizedEmail.split("@")[0];
    const studentDob = dob && dob.trim() ? dob.trim() : "";

    // Create or retrieve user in JSON database
    const user = createUser({
      name: studentName,
      email: normalizedEmail,
      dob: studentDob,
    });

    const response = NextResponse.json({
      success: true,
      message: `Welcome to CampusShare, ${user.name}!`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        dob: user.dob,
      },
    });

    // Attach signed HTTP-only session cookie (7 days)
    setSessionCookie(response, user);

    return response;
  } catch (err) {
    console.error("Direct login error:", err);
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
