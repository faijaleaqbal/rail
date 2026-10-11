import { ok, fail } from "@/lib/api";

export async function POST() {
  try {
    // In production: clear Supabase session
    // const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    // await supabase.auth.signOut();

    return ok({ message: "Signed out" });
  } catch (error) {
    console.error("POST /api/auth/logout failed:", error);
    return fail(500, "INTERNAL_ERROR", "Something went wrong during logout.");
  }
}
