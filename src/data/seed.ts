// Seed data for RailYatra — clean-room rebuild, from recon map observations

export interface Station {
  id: string;
  code: string;
  name: string;
  normalizedName: string;
  city: string;
  state: string;
  lat?: number;
  lon?: number;
}

export interface Train {
  id: string;
  number: string;
  name: string;
  type: "express" | "metro" | "local";
  sourceStationId: string;
  destStationId: string;
  runsOnDays: number[]; // 0=Mon, 1=Tue, ..., 6=Sun
  departureTime: string; // "HH:MM"
  arrivalTime: string; // "HH:MM"
  durationMinutes: number;
  isActive: boolean;
}

export interface RouteStop {
  id: string;
  trainId: string;
  stationId: string;
  seq: number;
  arrivalTime: string;
  departureTime: string;
  haltMinutes: number;
  distanceKm: number;
  platform: string | null;
  day: number;
}

export interface RunningStatus {
  id: string;
  trainId: string;
  date: string; // ISO date
  currentStationId: string | null;
  nextStationId: string | null;
  status: "on_time" | "late" | "early" | "delayed" | "cancelled" | "unknown";
  delayMinutes: number;
  etaNext: string | null;
  distanceToNextKm: number;
  distanceToDestKm: number;
  lastUpdated: string;
  source: "ntes" | "crowdsourced" | "cell_tower" | "estimated";
}

export interface CoachLayout {
  id: string;
  trainId: string | null; // null = generic
  coachCode: string;
  coachType: "sleeper" | "ac_3" | "ac_2" | "ac_1" | "general";
  positionInRake: number;
  totalCoaches: number;
}

export interface Berth {
  id: string;
  coachLayoutId: string;
  berthNumber: number;
  berthType: "lower" | "middle" | "upper" | "side_lower" | "side_upper";
  isBooked: boolean;
}

export const stations: Station[] = [
  { id: "st-sbc", code: "SBC", name: "KSR Bengaluru City Junction", normalizedName: "ksr bengaluru city junction", city: "Bengaluru", state: "Karnataka", lat: 12.9783, lon: 77.5738 },
  { id: "st-bnc", code: "BNC", name: "Bengaluru Cantonment", normalizedName: "bengaluru cantonment", city: "Bengaluru", state: "Karnataka", lat: 13.0067, lon: 77.6208 },
  { id: "st-hosur", code: "HSR", name: "Hosur", normalizedName: "hosur", city: "Hosur", state: "Tamil Nadu", lat: 12.7351, lon: 77.8290 },
  { id: "st-cbe", code: "CBE", name: "Coimbatore Junction", normalizedName: "coimbatore junction", city: "Coimbatore", state: "Tamil Nadu", lat: 11.0168, lon: 77.0200 },
  { id: "st-edu", code: "ED", name: "Erode Junction", normalizedName: "erode junction", city: "Erode", state: "Tamil Nadu", lat: 11.3410, lon: 77.7172 },
  { id: "st-tpj", code: "TPJ", name: "Tiruchirappalli Junction", normalizedName: "tiruchirappalli junction", city: "Tiruchirappalli", state: "Tamil Nadu", lat: 10.8200, lon: 78.6800 },
  { id: "st-mdu", code: "MDU", name: "Madurai Junction", normalizedName: "madurai junction", city: "Madurai", state: "Tamil Nadu", lat: 9.9252, lon: 78.1198 },
  { id: "st-guv", code: "GHY", name: "Guwahati", normalizedName: "guwahati", city: "Guwahati", state: "Assam", lat: 26.1806, lon: 91.7519 },
  { id: "st-ghy", code: "NGC", name: "New Guwahati", normalizedName: "new guwahati", city: "Guwahati", state: "Assam", lat: 26.1200, lon: 91.6900 },
  { id: "st-ndls", code: "NDLS", name: "New Delhi", normalizedName: "new delhi", city: "Delhi", state: "Delhi", lat: 28.6420, lon: 77.2190 },
  { id: "st-asm", code: "ASR", name: "Amritsar Junction", normalizedName: "amritsar junction", city: "Amritsar", state: "Punjab", lat: 31.6340, lon: 74.8723 },
  { id: "st-bct", code: "BCT", name: "Mumbai Central", normalizedName: "mumbai central", city: "Mumbai", state: "Maharashtra", lat: 18.9697, lon: 72.8194 },
  { id: "st-mmct", code: "MMCT", name: "Mumbai Central", normalizedName: "mumbai central", city: "Mumbai", state: "Maharashtra", lat: 18.9697, lon: 72.8194 },
  { id: "st-adi", code: "ADI", name: "Ahmedabad Junction", normalizedName: "ahmedabad junction", city: "Ahmedabad", state: "Gujarat", lat: 23.0216, lon: 72.6025 },
  { id: "st-bpl", code: "BPL", name: "Bhopal Junction", normalizedName: "bhopal junction", city: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lon: 77.4126 },
  { id: "st-lko", code: "LKO", name: "Lucknow Charbagh", normalizedName: "lucknow charbagh", city: "Lucknow", state: "Uttar Pradesh", lat: 26.8303, lon: 80.9213 },
  { id: "st-gkp", code: "GKP", name: "Gorakhpur Junction", normalizedName: "gorakhpur junction", city: "Gorakhpur", state: "Uttar Pradesh", lat: 26.7606, lon: 83.3732 },
];

export const trains: Train[] = [
  {
    id: "tr-12658",
    number: "12658",
    name: "Chennai Central Mail",
    type: "express",
    sourceStationId: "st-sbc",
    destStationId: "st-cbe",
    runsOnDays: [0, 1, 2, 3, 4, 5, 6],
    departureTime: "17:15",
    arrivalTime: "23:45",
    durationMinutes: 390,
    isActive: true,
  },
  {
    id: "tr-12657",
    number: "12657",
    name: "Chennai Mail",
    type: "express",
    sourceStationId: "st-cbe",
    destStationId: "st-sbc",
    runsOnDays: [0, 1, 2, 3, 4, 5, 6],
    departureTime: "19:30",
    arrivalTime: "02:10",
    durationMinutes: 400,
    isActive: true,
  },
  {
    id: "tr-22913",
    number: "22913",
    name: "Bandra Terminus–Amritsar Superfast",
    type: "express",
    sourceStationId: "st-bct",
    destStationId: "st-asm",
    runsOnDays: [1, 4],
    departureTime: "14:30",
    arrivalTime: "06:45",
    durationMinutes: 975,
    isActive: true,
  },
  {
    id: "tr-15666",
    number: "15666",
    name: "Guwahati Jan Shatabdi Express",
    type: "express",
    sourceStationId: "st-guv",
    destStationId: "st-ghy",
    runsOnDays: [0, 1, 2, 3, 4, 5, 6],
    departureTime: "09:20",
    arrivalTime: "10:30",
    durationMinutes: 70,
    isActive: true,
  },
  {
    id: "tr-15418",
    number: "15418",
    name: "Alipurduar Raja Rani Express",
    type: "express",
    sourceStationId: "st-guv",
    destStationId: "st-ghy",
    runsOnDays: [2, 5],
    departureTime: "22:45",
    arrivalTime: "00:15",
    durationMinutes: 90,
    isActive: true,
  },
  {
    id: "tr-12002",
    number: "12002",
    name: "Bhopal Shatabdi Express",
    type: "express",
    sourceStationId: "st-ndls",
    destStationId: "st-bpl",
    runsOnDays: [0, 1, 2, 3, 4, 5, 6],
    departureTime: "06:00",
    arrivalTime: "08:30",
    durationMinutes: 150,
    isActive: true,
  },
  {
    id: "tr-12951",
    number: "12951",
    name: "Mumbai Rajdhani Express",
    type: "express",
    sourceStationId: "st-bct",
    destStationId: "st-ndls",
    runsOnDays: [0, 1, 2, 3, 4, 5, 6],
    departureTime: "17:00",
    arrivalTime: "08:32",
    durationMinutes: 932,
    isActive: true,
  },
  {
    id: "tr-12615",
    number: "12615",
    name: "Grand Trunk Express",
    type: "express",
    sourceStationId: "st-asm",
    destStationId: "st-bct",
    runsOnDays: [0, 1, 2, 3, 4, 5, 6],
    departureTime: "18:40",
    arrivalTime: "07:15",
    durationMinutes: 755,
    isActive: true,
  },
  {
    id: "tr-12723",
    number: "12723",
    name: "Telangana Express",
    type: "express",
    sourceStationId: "st-ndls",
    destStationId: "st-sbc",
    runsOnDays: [0, 1, 2, 3, 4, 5, 6],
    departureTime: "06:25",
    arrivalTime: "13:40",
    durationMinutes: 1755,
    isActive: true,
  },
  {
    id: "tr-16345",
    number: "16345",
    name: "Netravati Express",
    type: "express",
    sourceStationId: "st-bct",
    destStationId: "st-sbc",
    runsOnDays: [0, 1, 2, 3, 4, 5, 6],
    departureTime: "19:00",
    arrivalTime: "10:30",
    durationMinutes: 930,
    isActive: true,
  },
  {
    id: "tr-metro-01",
    number: "M1",
    name: "Purple Line",
    type: "metro",
    sourceStationId: "st-sbc",
    destStationId: "st-bnc",
    runsOnDays: [0, 1, 2, 3, 4, 5, 6],
    departureTime: "05:00",
    arrivalTime: "23:00",
    durationMinutes: 1080,
    isActive: true,
  },
];

export const routeStops: RouteStop[] = [
  // Chennai Central Mail — SBC → CBE
  { id: "rs-12658-1", trainId: "tr-12658", stationId: "st-sbc", seq: 1, arrivalTime: "17:15", departureTime: "17:15", haltMinutes: 0, distanceKm: 0, platform: "2", day: 1 },
  { id: "rs-12658-2", trainId: "tr-12658", stationId: "st-bnc", seq: 2, arrivalTime: "17:25", departureTime: "17:29", haltMinutes: 4, distanceKm: 4, platform: "2", day: 1 },
  { id: "rs-12658-3", trainId: "tr-12658", stationId: "st-hosur", seq: 3, arrivalTime: "18:23", departureTime: "18:25", haltMinutes: 2, distanceKm: 37, platform: "1", day: 1 },
  { id: "rs-12658-4", trainId: "tr-12658", stationId: "st-edu", seq: 4, arrivalTime: "20:10", departureTime: "20:15", haltMinutes: 5, distanceKm: 127, platform: "2", day: 1 },
  { id: "rs-12658-5", trainId: "tr-12658", stationId: "st-tpj", seq: 5, arrivalTime: "21:45", departureTime: "21:50", haltMinutes: 5, distanceKm: 270, platform: "3", day: 1 },
  { id: "rs-12658-6", trainId: "tr-12658", stationId: "st-cbe", seq: 6, arrivalTime: "23:45", departureTime: "23:45", haltMinutes: 0, distanceKm: 492, platform: "1", day: 1 },

  // Guwahati Jan Shatabdi — GHY → NGC
  { id: "rs-15666-1", trainId: "tr-15666", stationId: "st-guv", seq: 1, arrivalTime: "09:20", departureTime: "09:20", haltMinutes: 0, distanceKm: 0, platform: "1", day: 1 },
  { id: "rs-15666-2", trainId: "tr-15666", stationId: "st-ghy", seq: 2, arrivalTime: "10:30", departureTime: "10:30", haltMinutes: 0, distanceKm: 7, platform: "2", day: 1 },

  // Alipurduar Raja Rani — GHY → NGC
  { id: "rs-15418-1", trainId: "tr-15418", stationId: "st-guv", seq: 1, arrivalTime: "22:45", departureTime: "22:45", haltMinutes: 0, distanceKm: 0, platform: "2", day: 1 },
  { id: "rs-15418-2", trainId: "tr-15418", stationId: "st-ghy", seq: 2, arrivalTime: "00:15", departureTime: "00:15", haltMinutes: 0, distanceKm: 7, platform: "1", day: 2 },

  // Mumbai Rajdhani — BCT → NDLS
  { id: "rs-12951-1", trainId: "tr-12951", stationId: "st-bct", seq: 1, arrivalTime: "17:00", departureTime: "17:00", haltMinutes: 0, distanceKm: 0, platform: "3", day: 1 },
  { id: "rs-12951-2", trainId: "tr-12951", stationId: "st-adi", seq: 2, arrivalTime: "21:40", departureTime: "21:45", haltMinutes: 5, distanceKm: 492, platform: "2", day: 1 },
  { id: "rs-12951-3", trainId: "tr-12951", stationId: "st-bpl", seq: 3, arrivalTime: "01:30", departureTime: "01:35", haltMinutes: 5, distanceKm: 780, platform: "1", day: 2 },
  { id: "rs-12951-4", trainId: "tr-12951", stationId: "st-lko", seq: 4, arrivalTime: "04:15", departureTime: "04:25", haltMinutes: 10, distanceKm: 1100, platform: "4", day: 2 },
  { id: "rs-12951-5", trainId: "tr-12951", stationId: "st-ndls", seq: 5, arrivalTime: "08:32", departureTime: "08:32", haltMinutes: 0, distanceKm: 1384, platform: "2", day: 2 },

  // Amritsar–Bandra Superfast — ASR → BCT
  { id: "rs-22913-1", trainId: "tr-22913", stationId: "st-asm", seq: 1, arrivalTime: "06:45", departureTime: "06:45", haltMinutes: 0, distanceKm: 0, platform: "1", day: 1 },
  { id: "rs-22913-2", trainId: "tr-22913", stationId: "st-ndls", seq: 2, arrivalTime: "12:30", departureTime: "12:40", haltMinutes: 10, distanceKm: 450, platform: "3", day: 1 },
  { id: "rs-22913-3", trainId: "tr-22913", stationId: "st-bpl", seq: 3, arrivalTime: "17:15", departureTime: "17:20", haltMinutes: 5, distanceKm: 830, platform: "2", day: 1 },
  { id: "rs-22913-4", trainId: "tr-22913", stationId: "st-adi", seq: 4, arrivalTime: "20:30", departureTime: "20:35", haltMinutes: 5, distanceKm: 1020, platform: "1", day: 1 },
  { id: "rs-22913-5", trainId: "tr-22913", stationId: "st-bct", seq: 5, arrivalTime: "14:30", departureTime: "14:30", haltMinutes: 0, distanceKm: 1390, platform: "4", day: 2 },
];

export const runningStatuses: RunningStatus[] = [
  {
    id: "rs-12658-today",
    trainId: "tr-12658",
    date: new Date().toISOString().split("T")[0],
    currentStationId: "st-bnc",
    nextStationId: "st-hosur",
    status: "on_time",
    delayMinutes: 0,
    etaNext: "18:23",
    distanceToNextKm: 33,
    distanceToDestKm: 488,
    lastUpdated: new Date().toISOString(),
    source: "ntes",
  },
  {
    id: "rs-15666-today",
    trainId: "tr-15666",
    date: new Date().toISOString().split("T")[0],
    currentStationId: null,
    nextStationId: "st-guv",
    status: "unknown",
    delayMinutes: 0,
    etaNext: null,
    distanceToNextKm: 0,
    distanceToDestKm: 7,
    lastUpdated: new Date().toISOString(),
    source: "estimated",
  },
  {
    id: "rs-22913-today",
    trainId: "tr-22913",
    date: new Date().toISOString().split("T")[0],
    currentStationId: "st-ndls",
    nextStationId: "st-bpl",
    status: "late",
    delayMinutes: 20,
    etaNext: "17:35",
    distanceToNextKm: 330,
    distanceToDestKm: 560,
    lastUpdated: new Date().toISOString(),
    source: "crowdsourced",
  },
];

export const coachLayouts: CoachLayout[] = [
  { id: "cl-12658-1", trainId: "tr-12658", coachCode: "ENG", coachType: "general", positionInRake: 1, totalCoaches: 7 },
  { id: "cl-12658-2", trainId: "tr-12658", coachCode: "GS", coachType: "general", positionInRake: 2, totalCoaches: 7 },
  { id: "cl-12658-3", trainId: "tr-12658", coachCode: "S1", coachType: "sleeper", positionInRake: 3, totalCoaches: 7 },
  { id: "cl-12658-4", trainId: "tr-12658", coachCode: "S2", coachType: "sleeper", positionInRake: 4, totalCoaches: 7 },
  { id: "cl-12658-5", trainId: "tr-12658", coachCode: "S3", coachType: "sleeper", positionInRake: 5, totalCoaches: 7 },
  { id: "cl-12658-6", trainId: "tr-12658", coachCode: "B1", coachType: "ac_3", positionInRake: 6, totalCoaches: 7 },
  { id: "cl-12658-7", trainId: "tr-12658", coachCode: "GEN", coachType: "general", positionInRake: 7, totalCoaches: 7 },
];

export const berths: Berth[] = [
  // S1 Sleeper layout (72 berths)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `berth-s1-lower-${i + 1}`,
    coachLayoutId: "cl-12658-3",
    berthNumber: i * 9 + 1,
    berthType: "lower" as const,
    isBooked: i === 4, // seat 5 booked
  })),
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `berth-s1-middle-${i + 1}`,
    coachLayoutId: "cl-12658-3",
    berthNumber: i * 9 + 2,
    berthType: "middle" as const,
    isBooked: i === 4, // seat 5 middle booked
  })),
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `berth-s1-upper-${i + 1}`,
    coachLayoutId: "cl-12658-3",
    berthNumber: i * 9 + 3,
    berthType: "upper" as const,
    isBooked: false,
  })),
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `berth-s1-side-lower-${i + 1}`,
    coachLayoutId: "cl-12658-3",
    berthNumber: i * 9 + 8,
    berthType: "side_lower" as const,
    isBooked: false,
  })),
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `berth-s1-side-upper-${i + 1}`,
    coachLayoutId: "cl-12658-3",
    berthNumber: i * 9 + 7,
    berthType: "side_upper" as const,
    isBooked: false,
  })),
];
