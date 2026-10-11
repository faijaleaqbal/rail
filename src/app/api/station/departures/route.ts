import { ok, fail, parseBody } from "@/lib/api";
import { stationDeparturesSchema } from "@/lib/validation";
import { getStationDepartures } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const parsed = await parseBody(request, stationDeparturesSchema);
    if ("response" in parsed) return parsed.response;

    const departures = getStationDepartures(parsed.data.station_id);
    return ok(departures);
  } catch (error) {
    console.error("POST /api/station/departures failed:", error);
    return fail(500, "INTERNAL_ERROR", "Something went wrong.");
  }
}
