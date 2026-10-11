import { ok, fail, parseBody, appUrl } from "@/lib/api";
import { pnrCheckSchema } from "@/lib/validation";
import { checkPnr } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const parsed = await parseBody(request, pnrCheckSchema);
    if ("response" in parsed) return parsed.response;

    const { pnr } = parsed.data;
    const result = checkPnr(pnr);

    if ("error" in result) {
      return fail(400, "INVALID_PNR", result.error!);
    }

    return ok({
      ...result,
      url: appUrl(`/pnr?pnr=${pnr}`),
    });
  } catch (error) {
    console.error("POST /api/pnr/check failed:", error);
    return fail(500, "INTERNAL_ERROR", "Something went wrong while checking the PNR.");
  }
}
