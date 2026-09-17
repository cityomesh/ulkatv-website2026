// lib/ulkaToken.ts
export const ULKA_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3ODk2NDUzMDksImlzcyI6IiIsImF1ZCI6IiIsIm5iZiI6MTc4OTY0NTMwOSwiZXhwIjoyMTA1MjY0NTA5LCJleHRyYV9kYXRhIjpbXSwicmVzdHJpY3RfaXAiOltdLCJpc19hZ2dyZW1lbnRfdm9pZCI6MCwiYWxsb3dlZF9hcGlzIjpudWxsLCJkYXRhIjp7InVzZXJuYW1lIjoiY2hhbm5lbGFwaSIsInJvbGVMYWJlbCI6IkFkbWluaXN0cmF0b3IiLCJsYXN0TG9naW5BdCI6bnVsbCwic2Vzc2lvbl9pZCI6bnVsbCwiYXV0aF9rZXkiOiJIRE5QVGdMQlRSQ3NKSkZ4X2otdFlYSjR5c3g3bGEyRSJ9LCJqdGkiOjEwMDA5fQ.lcYbdtpeIY6PPmXK2WTzlSE_pM2MsIc6_tyYVPf629E";

/**
 * Authorization header build cheyyadam
 */
export const getAuthHeader = (): Record<string, string> => ({
  Accept: "application/json",
  Authorization: `Bearer ${ULKA_TOKEN}`,
});
