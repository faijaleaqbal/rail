-- seed.sql — realistic seed data for RailYatra
-- All data is fictional/anonymized for development purposes

-- ============================================================
-- STATIONS
-- ============================================================

INSERT INTO stations (id, code, name, normalized_name, lat, lon, city, state, is_metro) VALUES
  ('st-sbc', 'SBC', 'KSR Bengaluru City Junction', 'ksr bengaluru city junction', 12.9783, 77.5738, 'Bengaluru', 'Karnataka', false),
  ('st-bnc', 'BNC', 'Bengaluru Cantonment', 'bengaluru cantonment', 13.0067, 77.6208, 'Bengaluru', 'Karnataka', false),
  ('st-hosur', 'HSR', 'Hosur', 'hosur', 12.7351, 77.8290, 'Hosur', 'Tamil Nadu', false),
  ('st-cbe', 'CBE', 'Coimbatore Junction', 'coimbatore junction', 11.0168, 77.0200, 'Coimbatore', 'Tamil Nadu', false),
  ('st-edu', 'ED', 'Erode Junction', 'erode junction', 11.3410, 77.7172, 'Erode', 'Tamil Nadu', false),
  ('st-tpj', 'TPJ', 'Tiruchirappalli Junction', 'tiruchirappalli junction', 10.8200, 78.6800, 'Tiruchirappalli', 'Tamil Nadu', false),
  ('st-mdu', 'MDU', 'Madurai Junction', 'madurai junction', 9.9252, 78.1198, 'Madurai', 'Tamil Nadu', false),
  ('st-guv', 'GHY', 'Guwahati', 'guwahati', 26.1806, 91.7519, 'Guwahati', 'Assam', false),
  ('st-ghy', 'NGC', 'New Guwahati', 'new guwahati', 26.1200, 91.6900, 'Guwahati', 'Assam', false),
  ('st-ndls', 'NDLS', 'New Delhi', 'new delhi', 28.6420, 77.2190, 'Delhi', 'Delhi', false),
  ('st-asm', 'ASR', 'Amritsar Junction', 'amritsar junction', 31.6340, 74.8723, 'Amritsar', 'Punjab', false),
  ('st-bct', 'BCT', 'Mumbai Central', 'mumbai central', 18.9697, 72.8194, 'Mumbai', 'Maharashtra', false),
  ('st-adi', 'ADI', 'Ahmedabad Junction', 'ahmedabad junction', 23.0216, 72.6025, 'Ahmedabad', 'Gujarat', false),
  ('st-bpl', 'BPL', 'Bhopal Junction', 'bhopal junction', 23.2599, 77.4126, 'Bhopal', 'Madhya Pradesh', false),
  ('st-lko', 'LKO', 'Lucknow Charbagh', 'lucknow charbagh', 26.8303, 80.9213, 'Lucknow', 'Uttar Pradesh', false),
  ('st-gkp', 'GKP', 'Gorakhpur Junction', 'gorakhpur junction', 26.7606, 83.3732, 'Gorakhpur', 'Uttar Pradesh', false),
  ('st-hwh', 'HWH', 'Howrah Junction', 'howrah junction', 22.5850, 88.3468, 'Howrah', 'West Bengal', false),
  ('st-mas', 'MAS', 'MGR Chennai Central', 'mgr chennai central', 13.0827, 80.2707, 'Chennai', 'Tamil Nadu', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- TRAINS
-- ============================================================

INSERT INTO trains (id, number, name, type, source_station_id, dest_station_id, runs_on_days, departure_time, arrival_time, duration_minutes, is_active) VALUES
  ('tr-12658', '12658', 'Chennai Central Mail', 'express', 'st-sbc', 'st-cbe', '{0,1,2,3,4,5,6}', '17:15', '23:45', 390, true),
  ('tr-12657', '12657', 'Chennai Mail', 'express', 'st-cbe', 'st-sbc', '{0,1,2,3,4,5,6}', '19:30', '02:10', 400, true),
  ('tr-22913', '22913', 'Bandra Terminus–Amritsar Superfast', 'express', 'st-bct', 'st-asm', '{1,4}', '14:30', '06:45', 975, true),
  ('tr-15666', '15666', 'Guwahati Jan Shatabdi Express', 'express', 'st-guv', 'st-ghy', '{0,1,2,3,4,5,6}', '09:20', '10:30', 70, true),
  ('tr-15418', '15418', 'Alipurduar Raja Rani Express', 'express', 'st-guv', 'st-ghy', '{2,5}', '22:45', '00:15', 90, true),
  ('tr-12002', '12002', 'Bhopal Shatabdi Express', 'express', 'st-ndls', 'st-bpl', '{0,1,2,3,4,5,6}', '06:00', '08:30', 150, true),
  ('tr-12951', '12951', 'Mumbai Rajdhani Express', 'express', 'st-bct', 'st-ndls', '{0,1,2,3,4,5,6}', '17:00', '08:32', 932, true),
  ('tr-12615', '12615', 'Grand Trunk Express', 'express', 'st-asm', 'st-bct', '{0,1,2,3,4,5,6}', '18:40', '07:15', 755, true),
  ('tr-12723', '12723', 'Telangana Express', 'express', 'st-ndls', 'st-sbc', '{0,1,2,3,4,5,6}', '06:25', '13:40', 1755, true),
  ('tr-16345', '16345', 'Netravati Express', 'express', 'st-bct', 'st-sbc', '{0,1,2,3,4,5,6}', '19:00', '10:30', 930, true),
  ('tr-metro-01', 'M1', 'Purple Line', 'metro', 'st-sbc', 'st-bnc', '{0,1,2,3,4,5,6}', '05:00', '23:00', 1080, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ROUTE STOPS
-- ============================================================

INSERT INTO route_stops (id, train_id, station_id, seq, arrival_time, departure_time, halt_minutes, distance_from_source_km, platform, day) VALUES
  -- Chennai Central Mail — SBC → CBE
  ('rs-12658-1', 'tr-12658', 'st-sbc', 1, '17:15', '17:15', 0, 0, '2', 1),
  ('rs-12658-2', 'tr-12658', 'st-bnc', 2, '17:25', '17:29', 4, 4, '2', 1),
  ('rs-12658-3', 'tr-12658', 'st-hosur', 3, '18:23', '18:25', 2, 37, '1', 1),
  ('rs-12658-4', 'tr-12658', 'st-edu', 4, '20:10', '20:15', 5, 127, '2', 1),
  ('rs-12658-5', 'tr-12658', 'st-tpj', 5, '21:45', '21:50', 5, 270, '3', 1),
  ('rs-12658-6', 'tr-12658', 'st-cbe', 6, '23:45', '23:45', 0, 492, '1', 1),

  -- Guwahati Jan Shatabdi — GHY → NGC
  ('rs-15666-1', 'tr-15666', 'st-guv', 1, '09:20', '09:20', 0, 0, '1', 1),
  ('rs-15666-2', 'tr-15666', 'st-ghy', 2, '10:30', '10:30', 0, 7, '2', 1),

  -- Alipurduar Raja Rani — GHY → NGC
  ('rs-15418-1', 'tr-15418', 'st-guv', 1, '22:45', '22:45', 0, 0, '2', 1),
  ('rs-15418-2', 'tr-15418', 'st-ghy', 2, '00:15', '00:15', 0, 7, '1', 2),

  -- Mumbai Rajdhani — BCT → NDLS
  ('rs-12951-1', 'tr-12951', 'st-bct', 1, '17:00', '17:00', 0, 0, '3', 1),
  ('rs-12951-2', 'tr-12951', 'st-adi', 2, '21:40', '21:45', 5, 492, '2', 1),
  ('rs-12951-3', 'tr-12951', 'st-bpl', 3, '01:30', '01:35', 5, 780, '1', 2),
  ('rs-12951-4', 'tr-12951', 'st-lko', 4, '04:15', '04:25', 10, 1100, '4', 2),
  ('rs-12951-5', 'tr-12951', 'st-ndls', 5, '08:32', '08:32', 0, 1384, '2', 2),

  -- Amritsar–Bandra Superfast — ASR → BCT
  ('rs-22913-1', 'tr-22913', 'st-asm', 1, '06:45', '06:45', 0, 0, '1', 1),
  ('rs-22913-2', 'tr-22913', 'st-ndls', 2, '12:30', '12:40', 10, 450, '3', 1),
  ('rs-22913-3', 'tr-22913', 'st-bpl', 3, '17:15', '17:20', 5, 830, '2', 1),
  ('rs-22913-4', 'tr-22913', 'st-adi', 4, '20:30', '20:35', 5, 1020, '1', 1),
  ('rs-22913-5', 'tr-22913', 'st-bct', 5, '14:30', '14:30', 0, 1390, '4', 2)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- RUNNING STATUS (today's data)
-- ============================================================

INSERT INTO running_status (id, train_id, date, current_station_id, next_station_id, status, delay_minutes, eta_next, distance_to_next_km, distance_to_dest_km, source) VALUES
  ('rs-12658-today', 'tr-12658', CURRENT_DATE, 'st-bnc', 'st-hosur', 'on_time', 0, '18:23', 33, 488, 'ntes'),
  ('rs-15666-today', 'tr-15666', CURRENT_DATE, NULL, 'st-guv', 'unknown', 0, NULL, 0, 7, 'estimated'),
  ('rs-22913-today', 'tr-22913', CURRENT_DATE, 'st-ndls', 'st-bpl', 'late', 20, '17:35', 330, 560, 'crowdsourced')
ON CONFLICT (train_id, date) DO NOTHING;

-- ============================================================
-- COACH LAYOUTS
-- ============================================================

INSERT INTO coach_layouts (id, train_id, coach_code, coach_type, position_in_rake, total_coaches) VALUES
  ('cl-12658-1', 'tr-12658', 'ENG', 'engine', 1, 7),
  ('cl-12658-2', 'tr-12658', 'GS', 'general', 2, 7),
  ('cl-12658-3', 'tr-12658', 'S1', 'sleeper', 3, 7),
  ('cl-12658-4', 'tr-12658', 'S2', 'sleeper', 4, 7),
  ('cl-12658-5', 'tr-12658', 'S3', 'sleeper', 5, 7),
  ('cl-12658-6', 'tr-12658', 'B1', 'ac_3', 6, 7),
  ('cl-12658-7', 'tr-12658', 'GEN', 'general', 7, 7)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- BERTHS (S1 Sleeper — 72 berths)
-- ============================================================

INSERT INTO berths (id, coach_layout_id, berth_number, berth_type, is_booked, pnr_number)
SELECT
  'berth-s1-' || n,
  'cl-12658-3',
  n,
  CASE
    WHEN n % 9 = 1 THEN 'lower'
    WHEN n % 9 = 2 THEN 'middle'
    WHEN n % 9 = 3 THEN 'upper'
    WHEN n % 9 = 8 THEN 'side_lower'
    WHEN n % 9 = 7 THEN 'side_upper'
    ELSE 'lower'
  END::berth_type_enum,
  (n = 37 OR n = 38),
  CASE WHEN n = 37 THEN '1234567890' WHEN n = 38 THEN '1234567890' ELSE NULL END
FROM generate_series(1, 72) AS n
ON CONFLICT (coach_layout_id, berth_number) DO NOTHING;

-- ============================================================
-- SCHEDULE BUNDLE
-- ============================================================

INSERT INTO schedule_bundles (id, version, effective_from, effective_to, bundle_url, checksum, size_bytes) VALUES
  ('sb-2026-10', '2026-10', '2026-10-01', '2026-12-31', 'https://storage.railyatra.app/bundles/2026-10.json.gz', 'sha256:abc123', 18000000)
ON CONFLICT (version) DO NOTHING;
