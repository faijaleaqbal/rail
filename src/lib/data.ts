import {
  stations,
  trains,
  routeStops,
  runningStatuses,
  coachLayouts,
  berths,
  type Berth,
  type CoachLayout,
  type RunningStatus,
  type RouteStop,
  type Station,
  type Train,
} from "@/data/seed";

export { stations, trains, routeStops, runningStatuses, coachLayouts, berths };
export type { Berth, CoachLayout, RunningStatus, RouteStop, Station, Train };

export type TrainsBetweenResult = ReturnType<typeof searchTrainsBetween>[number];
export type DepartureBoardEntry = ReturnType<typeof getStationDepartures>[number];
export type TrackingData = NonNullable<ReturnType<typeof getTracking>>;
export type CoachLayoutData = ReturnType<typeof getCoachLayout>;
export type TrainWithStations = ReturnType<typeof searchTrainByNumber>[number];

// Fuzzy search on stations
export function searchStations(query: string, limit = 8): Station[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const scored = stations
    .map((s) => {
      let score = 0;
      const name = s.normalizedName;
      if (name.startsWith(q)) score = 100;
      else if (name.includes(q)) score = 50;
      else if (s.code.toLowerCase().startsWith(q)) score = 40;
      else {
        const chars = new Set(q.split(""));
        const match = name.split("").filter((c) => chars.has(c)).length;
        score = (match / q.length) * 10;
      }
      return { station: s, score };
    })
    .filter((r) => r.score >= 30)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((r) => r.station);
}

// Search trains between two stations
export function searchTrainsBetween(fromStationId: string, toStationId: string) {
  return trains
    .filter((t) => {
      const stops = routeStops
        .filter((rs) => rs.trainId === t.id)
        .sort((a, b) => a.seq - b.seq);
      const fromIdx = stops.findIndex((s) => s.stationId === fromStationId);
      const toIdx = stops.findIndex((s) => s.stationId === toStationId);
      return fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx;
    })
    .map((t) => {
      const stops = routeStops
        .filter((rs) => rs.trainId === t.id)
        .sort((a, b) => a.seq - b.seq);
      const fromStop = stops.find((s) => s.stationId === fromStationId);
      const toStop = stops.find((s) => s.stationId === toStationId);
      const source = stations.find((s) => s.id === t.sourceStationId);
      const dest = stations.find((s) => s.id === t.destStationId);
      return {
        train: t,
        source,
        dest,
        fromDeparture: fromStop?.departureTime,
        toArrival: toStop?.arrivalTime,
        distanceKm: (toStop?.distanceKm ?? 0) - (fromStop?.distanceKm ?? 0),
        durationMinutes:
          fromStop && toStop
            ? calculateDuration(fromStop.departureTime, toStop.arrivalTime, fromStop.day, toStop.day)
            : t.durationMinutes,
      };
    });
}

// Find train by number or name
export function searchTrainByNumber(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return trains
    .filter((t) => t.number.includes(q) || t.name.toLowerCase().includes(q))
    .map((t) => {
      const source = stations.find((s) => s.id === t.sourceStationId);
      const dest = stations.find((s) => s.id === t.destStationId);
      return { train: t, source, dest };
    });
}

// Station departure board
export function getStationDepartures(stationId: string) {
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  const departures = routeStops
    .filter((rs) => rs.stationId === stationId && rs.departureTime >= currentTime)
    .sort((a, b) => a.departureTime.localeCompare(b.departureTime))
    .slice(0, 20);

  return departures.map((rs) => {
    const train = trains.find((t) => t.id === rs.trainId);
    const dest = train ? stations.find((s) => s.id === train.destStationId) : null;
    const running = runningStatuses.find((r) => r.trainId === rs.trainId && r.date === now.toISOString().split("T")[0]);
    return {
      routeStop: rs,
      train,
      dest,
      delayMinutes: running?.delayMinutes ?? 0,
      status: running?.status ?? "unknown",
      platform: rs.platform ?? "TBD",
    };
  });
}

// Get tracking data for a train
export function getTracking(trainId: string) {
  const train = trains.find((t) => t.id === trainId);
  if (!train) return null;

  const stops = routeStops
    .filter((rs) => rs.trainId === trainId)
    .sort((a, b) => a.seq - b.seq);

  const today = new Date().toISOString().split("T")[0];
  const running = runningStatuses.find((r) => r.trainId === trainId && r.date === today);

  const source = stations.find((s) => s.id === train.sourceStationId);
  const dest = stations.find((s) => s.id === train.destStationId);

  const currentStation = running?.currentStationId
    ? stations.find((s) => s.id === running.currentStationId)
    : null;
  const nextStation = running?.nextStationId
    ? stations.find((s) => s.id === running.nextStationId)
    : stops[1]
      ? stations.find((s) => s.id === stops[1].stationId)
      : null;

  return {
    train,
    source,
    dest,
    stops: stops.map((rs) => ({
      ...rs,
      station: stations.find((s) => s.id === rs.stationId)!,
    })),
    running,
    currentStation,
    nextStation,
    etaNext: running?.etaNext ?? stops[1]?.arrivalTime ?? null,
    distanceToNextKm: running?.distanceToNextKm ?? null,
    distanceToDestKm: running?.distanceToDestKm ?? null,
  };
}

// Get coach layout for a train
export function getCoachLayout(trainId: string) {
  const trainExists = trains.some((t) => t.id === trainId);
  if (!trainExists) {
    return null;
  }
  const layouts = coachLayouts.filter((cl) => cl.trainId === trainId);
  if (layouts.length === 0) {
    const genericRake = generateGenericRake();
    const genericBerths = generateGenericBerths("generic-sleeper");
    return {
      rake: genericRake,
      berths: genericRake.map((r) => ({
        coach: r,
        berths: genericBerths,
      })),
    };
  }

  const berthsForLayout = layouts.map((cl) => {
    const coachBerths = berths.filter((b) => b.coachLayoutId === cl.id);
    return {
      coach: cl,
      berths: coachBerths.length > 0 ? coachBerths : generateGenericBerths(cl.id),
    };
  });

  return {
    rake: layouts,
    berths: berthsForLayout,
  };
}

// Check PNR status
export function checkPnr(pnr: string) {
  if (!/^\d{10}$/.test(pnr)) {
    return { error: "PNR must be exactly 10 digits" };
  }
  return {
    pnr,
    train: "12658 — Chennai Central Mail",
    passengers: [
      { name: "Passenger 1", status: "CNF", coach: "S1", berth: "5 — Middle" },
      { name: "Passenger 2", status: "CNF", coach: "S1", berth: "6 — Upper" },
    ],
    chartStatus: "Chart Prepared",
  };
}

// Check seat availability
export function checkSeatAvailability(
  trainId: string,
  classCode: string,
  journeyDate: string,
  quota: string
) {
  const train = trains.find((t) => t.id === trainId);
  if (!train) {
    return { error: "Train not found" };
  }
  return {
    trainId,
    trainName: train.name,
    classCode,
    journeyDate,
    quota,
    availability: "AVAILABLE 12",
  };
}

function calculateDuration(depTime: string, arrTime: string, depDay: number, arrDay: number): number {
  const [depH, depM] = depTime.split(":").map(Number);
  const [arrH, arrM] = arrTime.split(":").map(Number);
  const dep = depH * 60 + depM;
  const arr = arrH * 60 + arrM;
  const dayDiff = arrDay - depDay;
  return arr - dep + dayDiff * 24 * 60;
}

function generateGenericRake(): CoachLayout[] {
  return [
    { id: "gen-eng", trainId: null, coachCode: "ENG", coachType: "general", positionInRake: 1, totalCoaches: 6 },
    { id: "gen-gs1", trainId: null, coachCode: "GS", coachType: "general", positionInRake: 2, totalCoaches: 6 },
    { id: "gen-s1", trainId: null, coachCode: "S1", coachType: "sleeper", positionInRake: 3, totalCoaches: 6 },
    { id: "gen-s2", trainId: null, coachCode: "S2", coachType: "sleeper", positionInRake: 4, totalCoaches: 6 },
    { id: "gen-s3", trainId: null, coachCode: "S3", coachType: "sleeper", positionInRake: 5, totalCoaches: 6 },
    { id: "gen-gen", trainId: null, coachCode: "GEN", coachType: "general", positionInRake: 6, totalCoaches: 6 },
  ];
}

function generateGenericBerths(layoutId: string): Berth[] {
  return Array.from({ length: 24 }, (_, i) => ({
    id: `${layoutId}-b${i + 1}`,
    coachLayoutId: layoutId,
    berthNumber: i + 1,
    berthType: (i % 3 === 0 ? "lower" : i % 3 === 1 ? "middle" : "upper") as "lower" | "middle" | "upper",
    isBooked: false,
  }));
}
