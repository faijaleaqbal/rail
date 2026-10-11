import { ok, fail } from "@/lib/api";
import { getCoachLayout } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const layout = getCoachLayout(id);
    if (!layout) {
      return fail(404, "NOT_FOUND", "coach layout not available for this train.");
    }
    return ok(layout);
  } catch (error) {
    console.error("GET /api/train/[id]/coach-layout failed:", error);
    return fail(500, "INTERNAL_ERROR", "Something went wrong.");
  }
}
