import { NextResponse } from "next/server";
import { searchStations } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const limit = Number(searchParams.get("limit") ?? "8");

  if (!q.trim()) {
    return NextResponse.json({ success: true, data: [] });
  }

  const results = searchStations(q, limit);
  return NextResponse.json({ success: true, data: results });
}
