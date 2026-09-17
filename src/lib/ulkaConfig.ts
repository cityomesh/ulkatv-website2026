// lib/ulkaConfig.ts
export const ULKA_API_URL = process.env.ULKA_API_URL!;
export const AUTH_KEY = "xqibzknznwb29de15s44";

export const ulkaHeaders = (token?: string) => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  authkey: AUTH_KEY,
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});
