import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const secure = port === 465;
  const user = process.env.SMTP_USER ? process.env.SMTP_USER.trim() : null;
  const rawPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.trim() : null;
  // Automatically strip any spaces from Google 16-character App Passwords
  const pass = rawPass ? rawPass.replace(/\s+/g, "") : null;

  if (!user || !pass) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  return transporter;
}

/**
 * Sends a branded 6-digit OTP email to the student
 * @param {{ to: string, name?: string, otp: string }} params
 */
export async function sendOtpEmail({ to, name, otp }) {
  const mailer = getTransporter();

  // If credentials are not yet configured in .env.local, log clearly to console
  if (!mailer) {
    console.log(`\n==========================================================`);
    console.log(`[CampusShare Email] Notice: SMTP credentials not set in .env.local`);
    console.log(`To send real emails to ${to}, configure SMTP_USER & SMTP_PASS in .env.local.`);
    console.log(`Student : ${name || "Student"}`);
    console.log(`OTP Code: >>> ${otp} <<<`);
    console.log(`==========================================================\n`);
    return {
      success: true,
      deliveredLocally: true,
      message: "SMTP not configured yet; OTP printed to console.",
    };
  }

  const fromAddress =
    process.env.EMAIL_FROM || `"CampusShare (AIT Pune)" <${process.env.SMTP_USER}>`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        .card { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .badge { display: inline-block; background-color: #eef2ff; color: #4f46e5; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 9999px; letter-spacing: 0.5px; border: 1px solid #c7d2fe; }
        .otp-box { background: #f8fafc; border: 2px dashed #6366f1; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
        .otp-code { font-family: Courier, monospace; font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #312e81; }
        .footer { font-size: 11px; color: #94a3b8; text-align: center; margin-top: 24px; line-height: 1.5; border-top: 1px solid #f1f5f9; padding-top: 16px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div style="text-align: center; margin-bottom: 20px;">
          <span class="badge">AIT Pune • CampusShare</span>
          <h2 style="margin: 12px 0 6px 0; font-size: 22px; color: #0f172a;">Verify Your College Email</h2>
          <p style="margin: 0; font-size: 13px; color: #64748b;">Hello <strong>${name || "Student"}</strong>, here is your verification code to access peer lending and borrowing.</p>
        </div>

        <div class="otp-box">
          <div style="font-size: 11px; font-weight: bold; color: #4f46e5; text-transform: uppercase; margin-bottom: 6px;">Your 6-Digit OTP</div>
          <div class="otp-code">${otp}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 6px;">Valid for 10 minutes</div>
        </div>

        <p style="font-size: 12px; color: #475569; line-height: 1.6;">
          Enter this OTP code on CampusShare to verify your identity. If you did not request this OTP, please ignore this email.
        </p>

        <div class="footer">
          CampusShare — Army Institute of Technology (AIT), Pune<br>
          Peer-to-Peer College Item Sharing Network
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await mailer.sendMail({
      from: fromAddress,
      to,
      subject: `${otp} is your CampusShare verification code`,
      text: `Hello ${name || "Student"},\n\nYour 6-digit CampusShare verification OTP is: ${otp}\n\nThis code will expire in 10 minutes.\n\nCampusShare — AIT Pune`,
      html: htmlContent,
      priority: "high",
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "High",
      },
    });

    console.log(`[CampusShare Email] Successfully sent OTP to ${to} (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[CampusShare Email] Failed to send email to ${to}:`, error.message);
    // Backup logging to console so development/testing is never completely blocked
    console.log(`[CampusShare Email Backup] OTP for ${to}: >>> ${otp} <<<`);
    return { success: false, error: error.message };
  }
}

