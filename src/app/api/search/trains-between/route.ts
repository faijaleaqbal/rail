import { ok, fail, parseBody } from "@/lib/api";
import { trainsBetweenSchema } from "@/lib/validation";
import { searchTrainsBetween } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const parsed = await parseBody(request, trainsBetweenSchema);
    if ("response" in parsed) return parsed.response;

    const { from_station_id, to_station_id } = parsed.data;
    const data = searchTrainsBetween(from_station_id, to_station_id);
    return ok(data);
  } catch (error) {
    console.error("POST /api/search/trains-between failed:", error);
    return fail(500, "INTERNAL_ERROR", "Something went wrong.");
  }
}
