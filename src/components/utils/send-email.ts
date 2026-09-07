// utils/send-email.ts
export async function sendEmail(data: {
  first_name: string;
  last_name: string;
  dob?: string;
  user_email: string;
  phone?: string;
  address?: string;
  message: string;
  to_email?: string; // ➕ ఎవరికి పంపాలి
}) {
  try {
    const response = await fetch("/api/sendMail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Email sending failed");
    }

    console.log("✅ Email sent successfully to:", data.to_email || process.env.EMAIL_RECEIVER);
    return result;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
}