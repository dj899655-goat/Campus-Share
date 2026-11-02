export const CONFIG = {
  APP_NAME: "CampusShare",
  ALLOWED_EMAIL_DOMAINS: [
    "gmail.com",
    "aitpune.edu.in",
    "aitpune.in"
  ],
  // When false, only allowed domains (e.g. @gmail.com, @aitpune.edu.in) are allowed
  DEMO_ACCEPT_ANY_EMAIL: false,
  // When true, displays the OTP on screen with an autofill button (real email is still sent)
  DEMO_SHOW_OTP_ON_SCREEN: true,
  SESSION_COOKIE_NAME: "campus_session",
  SESSION_SECRET: "campus-share-2026-auth-session-super-secret-key",
  SESSION_DURATION_DAYS: 7,
};

