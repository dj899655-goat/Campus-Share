import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp";
import { createUser } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, otp, name, dob } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and 6-digit OTP code are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const verification = verifyOtp(normalizedEmail, otp);

    if (!verification.valid) {
      return NextResponse.json(
        { error: verification.error || "Invalid OTP code." },
        { status: 400 }
      );
    }

    // Create or retrieve user account in database
    const studentName = name || verification.metadata?.name || normalizedEmail.split("@")[0];
    const studentDob = dob || verification.metadata?.dob || "";

    const user = createUser({
      name: studentName,
      email: normalizedEmail,
      dob: studentDob,
    });

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful! Welcome to CampusShare.",
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
    console.error("verify-otp error:", err);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}

