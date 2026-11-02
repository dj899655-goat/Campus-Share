export const CONFIG = {
  APP_NAME: "CampusShare",
  ALLOWED_EMAIL_DOMAINS: [
    "aitpune.in",
    "aitpune.edu.in"
  ],
  // When false, only college email addresses (e.g. @aitpune.in) are allowed
  DEMO_ACCEPT_ANY_EMAIL: false,
  // OTP is strictly sent to the student's college Outlook email inbox
  DEMO_SHOW_OTP_ON_SCREEN: false,
  SESSION_COOKIE_NAME: "campus_session",
  SESSION_SECRET: "campus-share-2026-auth-session-super-secret-key",
  SESSION_DURATION_DAYS: 7,
};

