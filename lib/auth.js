import crypto from "crypto";
import { CONFIG } from "@/config";

/**
 * Creates a signed session token using Node.js HMAC-SHA256
 * @param {object} user - User payload { id, email, name }
 * @returns {string} Signed token: payloadBase64.signatureHex
 */
export function createSessionToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    exp: Date.now() + CONFIG.SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
  };

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", CONFIG.SESSION_SECRET)
    .update(payloadStr)
    .digest("hex");

  return `${payloadStr}.${signature}`;
}

/**
 * Verifies a signed session token
 * @param {string} token 
 * @returns {object|null} Decoded user payload or null if invalid/expired
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadStr, signature] = parts;

  // Verify HMAC signature using timing-safe comparison
  const expectedSignature = crypto
    .createHmac("sha256", CONFIG.SESSION_SECRET)
    .update(payloadStr)
    .digest("hex");

  try {
    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );

    if (!isSignatureValid) return null;

    const payload = JSON.parse(Buffer.from(payloadStr, "base64url").toString("utf8"));

    // Check expiration
    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies the session user from a Next.js Request or NextRequest
 * @param {Request} request 
 * @returns {object|null}
 */
export function getSessionUser(request) {
  try {
    let token = null;

    // Next.js NextRequest has .cookies.get()
    if (request.cookies && typeof request.cookies.get === "function") {
      const cookieObj = request.cookies.get(CONFIG.SESSION_COOKIE_NAME);
      token = cookieObj?.value || null;
    } else {
      // Standard Request headers
      const cookieHeader = request.headers.get("cookie") || "";
      const match = cookieHeader
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith(`${CONFIG.SESSION_COOKIE_NAME}=`));

      if (match) {
        token = match.substring(CONFIG.SESSION_COOKIE_NAME.length + 1);
      }
    }

    if (!token) return null;
    return verifySessionToken(token);
  } catch (err) {
    console.error("Error reading session user:", err);
    return null;
  }
}

/**
 * Attaches the session cookie to a NextResponse object
 * @param {import('next/server').NextResponse} response 
 * @param {object} user 
 */
export function setSessionCookie(response, user) {
  const token = createSessionToken(user);
  response.cookies.set({
    name: CONFIG.SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CONFIG.SESSION_DURATION_DAYS * 24 * 60 * 60, // seconds
  });
  return response;
}

/**
 * Clears the session cookie from a NextResponse object
 * @param {import('next/server').NextResponse} response 
 */
export function clearSessionCookie(response) {
  response.cookies.set({
    name: CONFIG.SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

