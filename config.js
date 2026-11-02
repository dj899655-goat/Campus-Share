export const CONFIG = {
  APP_NAME: "CampusShare",
  ALLOWED_EMAIL_DOMAINS: [
    "gmail.com"
  ],
  // Restricted strictly to @gmail.com email addresses
  DEMO_ACCEPT_ANY_EMAIL: false,
  // When true, displays the OTP on screen with an autofill button (real email is still sent)
  DEMO_SHOW_OTP_ON_SCREEN: true,
  SESSION_COOKIE_NAME: "campus_session",
  SESSION_SECRET: "campus-share-2026-auth-session-super-secret-key",
  SESSION_DURATION_DAYS: 7,
};

