// In-memory OTP store with 10-minute expiry
// Attached to global to persist during Next.js hot-reloads in development
if (!global.__campus_otp_store) {
  global.__campus_otp_store = new Map();
}

const otpStore = global.__campus_otp_store;

/**
 * Generate a 6-digit OTP for an email address
 * @param {string} email 
 * @param {object} metadata - optional student data (name, dob)
 * @returns {string} 6-digit OTP code
 */
export function generateOtp(email, metadata = {}) {
  const normalizedEmail = email.trim().toLowerCase();
  
  // Generate random 6-digit number
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(normalizedEmail, {
    otp,
    expiresAt,
    metadata,
    attempts: 0,
  });

  return otp;
}

/**
 * Verify an OTP for an email address
 * @param {string} email 
 * @param {string} code 
 * @returns {{ valid: boolean, error?: string, metadata?: object }}
 */
export function verifyOtp(email, code) {
  const normalizedEmail = email.trim().toLowerCase();
  const entry = otpStore.get(normalizedEmail);

  if (!entry) {
    return { valid: false, error: "No OTP requested for this email or it has expired." };
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(normalizedEmail);
    return { valid: false, error: "OTP has expired. Please request a new one." };
  }

  if (entry.otp !== code.trim()) {
    entry.attempts = (entry.attempts || 0) + 1;
    if (entry.attempts >= 5) {
      otpStore.delete(normalizedEmail);
      return { valid: false, error: "Too many incorrect attempts. Please request a new OTP." };
    }
    return { valid: false, error: "Incorrect OTP. Please check the code and try again." };
  }

  // Valid OTP: remove from store to prevent replay
  otpStore.delete(normalizedEmail);
  return { valid: true, metadata: entry.metadata };
}

/**
 * Helper to inspect the current OTP (for demo environments)
 */
export function getStoredOtp(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const entry = otpStore.get(normalizedEmail);
  if (entry && Date.now() <= entry.expiresAt) {
    return entry.otp;
  }
  return null;
}

