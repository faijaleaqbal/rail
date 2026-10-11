-- 001_initial_schema.sql
-- RailYatra — initial database schema
-- Run: psql $DATABASE_URL -f supabase/migrations/001_initial_schema.sql

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE train_type AS ENUM ('express', 'metro', 'local');
CREATE TYPE running_status_enum AS ENUM ('on_time', 'late', 'early', 'delayed', 'cancelled', 'diverted', 'rescheduled', 'unknown');
CREATE TYPE status_source_enum AS ENUM ('ntes', 'crowdsourced', 'cell_tower', 'estimated');
CREATE TYPE coach_type_enum AS ENUM ('sleeper', 'ac_3', 'ac_2', 'ac_1', 'general', 'ladies', 'pantry', 'engine', 'luggage');
CREATE TYPE berth_type_enum AS ENUM ('lower', 'middle', 'upper', 'side_lower', 'side_upper');

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS stations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  normalized_name text NOT NULL,
  lat double precision,
  lon double precision,
  city text,
  state text,
  is_metro boolean NOT NULL DEFAULT false,
  is_bus_stop boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS trains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL UNIQUE,
  name text NOT NULL,
  type train_type NOT NULL,
  source_station_id uuid NOT NULL REFERENCES stations(id) ON DELETE RESTRICT,
  dest_station_id uuid NOT NULL REFERENCES stations(id) ON DELETE RESTRICT,
  runs_on_days smallint[] NOT NULL DEFAULT '{}',
  departure_time time NOT NULL,
  arrival_time time NOT NULL,
  duration_minutes int NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS route_stops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  train_id uuid NOT NULL REFERENCES trains(id) ON DELETE CASCADE,
  station_id uuid NOT NULL REFERENCES stations(id) ON DELETE RESTRICT,
  seq int NOT NULL,
  arrival_time time,
  departure_time time,
  halt_minutes int,
  distance_from_source_km int,
  platform text,
  day int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (train_id, seq),
  CONSTRAINT positive_seq CHECK (seq > 0)
);

CREATE TABLE IF NOT EXISTS running_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  train_id uuid NOT NULL REFERENCES trains(id) ON DELETE CASCADE,
  date date NOT NULL,
  current_station_id uuid REFERENCES stations(id) ON DELETE SET NULL,
  next_station_id uuid REFERENCES stations(id) ON DELETE SET NULL,
  status running_status_enum NOT NULL DEFAULT 'unknown',
  delay_minutes int NOT NULL DEFAULT 0,
  eta_next timestamptz,
  distance_to_next_km double precision,
  distance_to_dest_km double precision,
  last_updated_at timestamptz NOT NULL DEFAULT now(),
  source status_source_enum NOT NULL DEFAULT 'estimated',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (train_id, date),
  CONSTRAINT non_negative_delay CHECK (delay_minutes >= 0)
);

CREATE TABLE IF NOT EXISTS coach_layouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  train_id uuid REFERENCES trains(id) ON DELETE CASCADE,
  coach_code text NOT NULL,
  coach_type coach_type_enum NOT NULL,
  position_in_rake int NOT NULL,
  total_coaches int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS berths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_layout_id uuid NOT NULL REFERENCES coach_layouts(id) ON DELETE CASCADE,
  berth_number int NOT NULL,
  berth_type berth_type_enum NOT NULL,
  is_booked boolean NOT NULL DEFAULT false,
  pnr_number text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (coach_layout_id, berth_number),
  CONSTRAINT positive_berth CHECK (berth_number > 0)
);

CREATE TABLE IF NOT EXISTS pnr_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  pnr_number text NOT NULL CHECK (pnr_number ~ '^\d{10}$'),
  train_id uuid REFERENCES trains(id) ON DELETE SET NULL,
  journey_date date,
  status jsonb NOT NULL DEFAULT '{}',
  last_checked_at timestamptz NOT NULL DEFAULT now(),
  auto_update boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS seat_availability_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  train_id uuid NOT NULL REFERENCES trains(id) ON DELETE CASCADE,
  class_code text NOT NULL,
  journey_date date NOT NULL,
  quota text NOT NULL,
  availability text NOT NULL,
  fetched_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (train_id, class_code, journey_date, quota)
);

CREATE TABLE IF NOT EXISTS saved_trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  train_id uuid NOT NULL REFERENCES trains(id) ON DELETE CASCADE,
  from_station_id uuid NOT NULL REFERENCES stations(id) ON DELETE RESTRICT,
  to_station_id uuid NOT NULL REFERENCES stations(id) ON DELETE RESTRICT,
  journey_date date,
  alarm_station_id uuid REFERENCES stations(id) ON DELETE SET NULL,
  alarm_mins_before int,
  share_token text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS schedule_bundles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text NOT NULL UNIQUE,
  effective_from date NOT NULL,
  effective_to date,
  bundle_url text NOT NULL,
  checksum text NOT NULL,
  size_bytes int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Stripe webhook events (idempotency)
CREATE TABLE IF NOT EXISTS stripe_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id text UNIQUE,
  type text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Crowdsourced train location reports
CREATE TABLE IF NOT EXISTS crowdsourced_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  train_id uuid REFERENCES trains(id) ON DELETE SET NULL,
  user_id uuid,
  lat double precision NOT NULL,
  lon double precision NOT NULL,
  cell_tower_ids text[],
  speed_kmh double precision,
  reported_at timestamptz NOT NULL DEFAULT now(),
  is_offline boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_stations_name ON stations (normalized_name);
CREATE INDEX IF NOT EXISTS idx_stations_code ON stations (code);
CREATE INDEX IF NOT EXISTS idx_stations_trgm ON stations USING gin (normalized_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_trains_number ON trains (number);
CREATE INDEX IF NOT EXISTS idx_trains_name ON trains (name);
CREATE INDEX IF NOT EXISTS idx_trains_type ON trains (type);
CREATE INDEX IF NOT EXISTS idx_trains_name_trgm ON trains USING gin (name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_route_stops_train ON route_stops (train_id, seq);
CREATE INDEX IF NOT EXISTS idx_route_stops_station ON route_stops (station_id);

CREATE INDEX IF NOT EXISTS idx_running_status_train ON running_status (train_id, date);
CREATE INDEX IF NOT EXISTS idx_running_status_next ON running_status (next_station_id);
CREATE INDEX IF NOT EXISTS idx_running_status_updated ON running_status (last_updated_at);

CREATE INDEX IF NOT EXISTS idx_coach_layouts_train ON coach_layouts (train_id);
CREATE INDEX IF NOT EXISTS idx_coach_layouts_type ON coach_layouts (coach_type);

CREATE INDEX IF NOT EXISTS idx_berths_coach ON berths (coach_layout_id);
CREATE INDEX IF NOT EXISTS idx_berths_pnr ON berths (pnr_number) WHERE pnr_number IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_pnr_queries_user ON pnr_queries (user_id);
CREATE INDEX IF NOT EXISTS idx_pnr_queries_pnr ON pnr_queries (pnr_number);
CREATE INDEX IF NOT EXISTS idx_pnr_queries_auto ON pnr_queries (auto_update) WHERE auto_update = true;

CREATE INDEX IF NOT EXISTS idx_seat_avail_train ON seat_availability_cache (train_id, journey_date);
CREATE INDEX IF NOT EXISTS idx_seat_avail_fetched ON seat_availability_cache (fetched_at);

CREATE INDEX IF NOT EXISTS idx_saved_trips_user ON saved_trips (user_id);
CREATE INDEX IF NOT EXISTS idx_saved_trips_share ON saved_trips (share_token);

CREATE INDEX IF NOT EXISTS idx_crowdsourced_train ON crowdsourced_reports (train_id, reported_at);
CREATE INDEX IF NOT EXISTS idx_stripe_events_id ON stripe_events (stripe_event_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_stations_updated_at ON stations;
CREATE TRIGGER trg_stations_updated_at BEFORE UPDATE ON stations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_trains_updated_at ON trains;
CREATE TRIGGER trg_trains_updated_at BEFORE UPDATE ON trains
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_route_stops_updated_at ON route_stops;
CREATE TRIGGER trg_route_stops_updated_at BEFORE UPDATE ON route_stops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_pnr_queries_updated_at ON pnr_queries;
CREATE TRIGGER trg_pnr_queries_updated_at BEFORE UPDATE ON pnr_queries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_saved_trips_updated_at ON saved_trips;
CREATE TRIGGER trg_saved_trips_updated_at BEFORE UPDATE ON saved_trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Share token auto-generate
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.share_token IS NULL THEN
    NEW.share_token = encode(gen_random_bytes(16), 'hex');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_saved_trips_share_token ON saved_trips;
CREATE TRIGGER trg_saved_trips_share_token BEFORE INSERT ON saved_trips
  FOR EACH ROW EXECUTE FUNCTION generate_share_token();
