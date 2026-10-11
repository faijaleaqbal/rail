import { NextResponse } from "next/server";
import { ZodError } from "zod";

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export function ok<T>(data: T, status = 200): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function fail(
  status: number,
  code: string,
  message: string
): NextResponse<ApiError> {
  return NextResponse.json(
    { success: false, error: { code, message } },
    { status }
  );
}

export async function parseBody<T>(
  request: Request,
  schema: { parse: (data: unknown) => T }
): Promise<
  | { data: T; response?: never }
  | { data?: never; response: NextResponse<ApiError> }
> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { data };
  } catch (error) {
    if (error instanceof ZodError) {
      const first = error.issues[0];
      return {
        response: fail(400, "VALIDATION_ERROR", `${first.path.join(".")}: ${first.message}`),
      };
    }
    return { response: fail(400, "INVALID_JSON", "Request body is not valid JSON") };
  }
}

export function appUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}${path}`;
}

export function isDatabaseAvailable(): boolean {
  return !!process.env.DATABASE_URL;
}
