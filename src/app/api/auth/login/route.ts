import { ok, fail, parseBody } from "@/lib/api";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const parsed = await parseBody(request, loginSchema);
    if ("response" in parsed) return parsed.response;

    const { email, password } = parsed.data;

    // In production: call Supabase Auth API
    // const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    // const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    // Stub: return success with mock session
    return ok({
      user: { id: "usr_" + Math.random().toString(36).slice(2), email },
      session: { access_token: "mock_token", refresh_token: "mock_refresh" },
    });
  } catch (error) {
    console.error("POST /api/auth/login failed:", error);
    return fail(500, "INTERNAL_ERROR", "Something went wrong during login.");
  }
}
