import { ok, fail, parseBody } from "@/lib/api";
import { z } from "zod";

const emailSchema = z.object({
  to: z.string().email("valid email is required"),
  subject: z.string().min(1, "subject is required").max(200),
  text: z.string().min(1, "text is required").max(10000),
});

export async function POST(request: Request) {
  try {
    const parsed = await parseBody(request, emailSchema);
    if ("response" in parsed) return parsed.response;

    const { to, subject, text } = parsed.data;

    // In production: send via Resend
    // const resend = new Resend(process.env.RESEND_API_KEY!);
    // await resend.emails.send({
    //   from: process.env.EMAIL_FROM!,
    //   to,
    //   subject,
    //   text,
    // });

    // Stub: log and return success
    console.log(`[EMAIL] To: ${to} | Subject: ${subject}`);

    return ok({
      message: "Email queued for delivery",
      to,
      subject,
    });
  } catch (error) {
    console.error("POST /api/email/send failed:", error);
    return fail(500, "INTERNAL_ERROR", "Something went wrong sending email.");
  }
}
