import { ok, fail } from "@/lib/api";
import { query } from "@/lib/db";

export async function GET() {
  try {
    // In production: get user from Supabase session cookie
    // For now, return anonymous
    return ok({
      user: null,
      message: "Not authenticated",
    });
  } catch (error) {
    console.error("GET /api/auth/session failed:", error);
    return fail(500, "INTERNAL_ERROR", "Something went wrong.");
  }
}
