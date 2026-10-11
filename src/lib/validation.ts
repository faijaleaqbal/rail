import { z } from "zod";

/** Shared primitives — station/train ids accept both UUIDs and legacy seed ids. */

export const stationIdSchema = z
  .string()
  .trim()
  .min(1, "station id is required")
  .max(64, "station id is too long");

export const trainIdSchema = z
  .string()
  .trim()
  .min(1, "train id is required")
  .max(64, "train id is too long");

const dateStringSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "journey_date must be YYYY-MM-DD")
  .refine(
    (v) => {
      const d = new Date(`${v}T00:00:00Z`);
      return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
    },
    { message: "journey_date is not a valid calendar date" },
  );

/** GET /api/search/stations?q=&limit= */
export const stationSearchQuerySchema = z.object({
  q: z
    .string()
    .trim()
    .min(1, "q is required")
    .max(100, "q must be at most 100 characters"),
  limit: z.coerce.number().int().min(1).max(50).default(8).optional(),
});

export type StationSearchQuery = z.infer<typeof stationSearchQuerySchema>;

/** POST /api/search/trains-between { from_station_id, to_station_id } */
export const trainsBetweenSchema = z.object({
  from_station_id: stationIdSchema,
  to_station_id: stationIdSchema,
});

export type TrainsBetweenInput = z.infer<typeof trainsBetweenSchema>;

/** POST /api/auth/signup { email, password } */
export const signupSchema = z.object({
  email: z.string().trim().email("valid email is required").max(254),
  password: z.string().min(8, "password must be at least 8 characters").max(128),
});

export type SignupInput = z.infer<typeof signupSchema>;

/** POST /api/auth/login { email, password } */
export const loginSchema = z.object({
  email: z.string().trim().email("valid email is required").max(254),
  password: z.string().min(1, "password is required").max(128),
});

export type LoginInput = z.infer<typeof loginSchema>;

/** POST /api/search/train-by-number { query } */
export const trainByNumberSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, "query is required")
    .max(100, "query must be at most 100 characters"),
});

export type TrainByNumberInput = z.infer<typeof trainByNumberSchema>;

/** POST /api/station/departures { station_id, limit? } */
export const stationDeparturesSchema = z.object({
  station_id: stationIdSchema,
  limit: z.coerce.number().int().min(1).max(50).default(20).optional(),
});

export type StationDeparturesInput = z.infer<typeof stationDeparturesSchema>;

/** GET /api/train/[id]/... — route param */
export const trainIdParamSchema = z.object({
  id: trainIdSchema,
});

export type TrainIdParam = z.infer<typeof trainIdParamSchema>;

/** POST /api/pnr/check { pnr } */
export const pnrCheckSchema = z.object({
  pnr: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "pnr must be exactly 10 digits"),
});

export type PnrCheckInput = z.infer<typeof pnrCheckSchema>;

/** POST /api/seat/check { train_id, class_code, journey_date, quota? } */
export const seatCheckSchema = z.object({
  train_id: trainIdSchema,
  class_code: z
    .string()
    .trim()
    .min(1, "class_code is required")
    .max(10, "class_code must be at most 10 characters")
    .transform((v) => v.toUpperCase()),
  journey_date: dateStringSchema,
  quota: z.string().trim().min(1).max(10).default("GN").optional(),
});

export type SeatCheckInput = z.infer<typeof seatCheckSchema>;

/** Format zod issues into a compact, client-friendly payload. */
export function formatZodError(error: z.ZodError): { field: string; message: string }[] {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "body",
    message: issue.message,
  }));
}
