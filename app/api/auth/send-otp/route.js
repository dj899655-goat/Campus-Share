import { NextResponse } from "next/server";
import { CONFIG } from "@/config";
import { generateOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, dob } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid college email address is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const domain = normalizedEmail.split("@")[1];

    // Verify allowed email domains (@gmail.com or college email)
    if (!CONFIG.DEMO_ACCEPT_ANY_EMAIL) {
      const isAllowed = CONFIG.ALLOWED_EMAIL_DOMAINS.some(
        (allowed) => domain === allowed || domain.endsWith(`.${allowed}`)
      );
      if (!isAllowed) {
        return NextResponse.json(
          {
            error: `Please enter a valid email address (e.g. yourname@gmail.com or your college email).`,
          },
          { status: 400 }
        );
      }
    }

    // Generate 6-digit OTP
    const otp = generateOtp(normalizedEmail, { name, dob });

    console.log(`\n======================================================`);
    console.log(`[CampusShare] 🎓 OTP for ${normalizedEmail}: >>> ${otp} <<<`);
    console.log(`======================================================\n`);

    // Send real email delivery via nodemailer
    await sendOtpEmail({
      to: normalizedEmail,
      name,
      otp,
    });

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${normalizedEmail}. Please check your inbox (and spam folder).`,
      demoOtp: CONFIG.DEMO_SHOW_OTP_ON_SCREEN ? otp : null,
    });
  } catch (err) {
    console.error("send-otp error:", err);
    return NextResponse.json(
      { error: "Failed to generate OTP. Please try again." },
      { status: 500 }
    );
  }
}

