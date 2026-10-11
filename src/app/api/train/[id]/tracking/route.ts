import { ok, fail } from "@/lib/api";
import { getTracking } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tracking = getTracking(id);
    if (!tracking) {
      return fail(404, "NOT_FOUND", "Train not found");
    }
    return ok(tracking);
  } catch (error) {
    console.error("GET /api/train/[id]/tracking failed:", error);
    return fail(500, "INTERNAL_ERROR", "Something went wrong.");
  }
}
