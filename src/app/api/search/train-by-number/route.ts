import { ok, fail, parseBody } from "@/lib/api";
import { trainByNumberSchema } from "@/lib/validation";
import { searchTrainByNumber } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const parsed = await parseBody(request, trainByNumberSchema);
    if ("response" in parsed) return parsed.response;

    const { query } = parsed.data;
    const data = searchTrainByNumber(query);
    return ok(data);
  } catch (error) {
    console.error("POST /api/search/train-by-number failed:", error);
    return fail(500, "INTERNAL_ERROR", "Something went wrong.");
  }
}
