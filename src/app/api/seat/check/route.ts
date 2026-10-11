import { ok, fail, parseBody, appUrl } from "@/lib/api";
import { seatCheckSchema } from "@/lib/validation";
import { checkSeatAvailability } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const parsed = await parseBody(request, seatCheckSchema);
    if ("response" in parsed) return parsed.response;

    const { train_id, class_code, journey_date, quota } = parsed.data;
    const result = checkSeatAvailability(train_id, class_code, journey_date, quota ?? "GN");

    if ("error" in result) {
      return fail(400, "INVALID_REQUEST", result.error!);
    }

    return ok({
      ...result,
      url: appUrl(`/track/${train_id}`),
    });
  } catch (error) {
    console.error("POST /api/seat/check failed:", error);
    return fail(500, "INTERNAL_ERROR", "Something went wrong while checking seat availability.");
  }
}
