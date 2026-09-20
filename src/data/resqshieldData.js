// ResQShield AI - Central Command Center Data & Telemetry

export const disasterAlertData = {
  title: "Severe Flood Alert",
  location: "Chennai, Tamil Nadu",
  status: "HIGH RISK",
  severity: "Critical",
  coordinates: "13.0827° N, 80.2707° E",
  riverBasin: "Cooum & Adyar Rivers",
  waterRiseRate: "+9.2 cm/hr",
  affectedRadiusKm: 28.4,
  alertTimestamp: "May 4, 2025 | 05:22 AM"
};

export const kpiMetrics = [
  {
    id: "active-incidents",
    title: "Active Incidents",
    value: 7,
    subBadge: "3 Critical | 4 Moderate",
    badgeType: "crimson",
    iconType: "target"
  },
  {
    id: "people-affected",
    title: "People Affected",
    value: "54,280",
    subBadge: "+12% since last update",
    badgeType: "cyan",
    deltaPositive: true,
    iconType: "users"
  },
  {
    id: "teams-deployed",
    title: "Rescue Teams Deployed",
    value: 12,
    subBadge: "Teams on ground",
    badgeType: "teal",
    iconType: "shield"
  },
  {
    id: "est-impact",
    title: "Est. Impact",
    value: "$34.2M",
    subBadge: "Infrastructure & property",
    badgeType: "amber",
    iconType: "impact"
  }
];

export const recentIncidentsList = [
  {
    id: "inc-1",
    title: "Flooding",
    location: "Chennai, Tamil Nadu",
    time: "May 4, 04:50 AM",
    confidence: "92%",
    severity: "Critical",
    type: "flood",
    coords: { x: 58, y: 48 },
    description: "Flooded arterial overpass at Anna Salai / Kathipara junction. Water current 3.4 m/s."
  },
  {
    id: "inc-2",
    title: "Landslide",
    location: "Kodaikanal, Tamil Nadu",
    time: "May 4, 03:20 AM",
    confidence: "87%",
    severity: "High",
    type: "landslide",
    coords: { x: 38, y: 72 },
    description: "Ghat road blockage, mudflow triggered by persistent torrential rainfall."
  },
  {
    id: "inc-3",
    title: "Cyclone Alert",
    location: "Bay of Bengal",
    time: "May 4, 02:10 AM",
    confidence: "76%",
    severity: "Moderate",
    type: "cyclone",
    coords: { x: 88, y: 35 },
    description: "Deep depression tracking 140km off Chennai coastline. Wind gusts reaching 85 km/h."
  },
  {
    id: "inc-4",
    title: "Forest Fire",
    location: "Nilgiris, Tamil Nadu",
    time: "May 3, 11:45 PM",
    confidence: "68%",
    severity: "Moderate",
    type: "fire",
    coords: { x: 22, y: 64 },
    description: "Dry ridge lightning strike; fire perimeter expanding 2.1 hectares/hr."
  },
  {
    id: "inc-5",
    title: "Flooding",
    location: "Tiruvallur, Tamil Nadu",
    time: "May 3, 10:15 PM",
    confidence: "82%",
    severity: "High",
    type: "flood",
    coords: { x: 32, y: 32 },
    description: "Reservoir discharge channel cresting overflow embankment. Evacuation in progress."
  }
];

export const latestUpdatesList = [
  {
    id: "upd-1",
    title: "New evacuation route available for Chennai",
    time: "2 min ago",
    type: "route",
    color: "emerald"
  },
  {
    id: "upd-2",
    title: "Rescue team 3 reached affected area",
    time: "12 min ago",
    type: "team",
    color: "amber"
  },
  {
    id: "upd-3",
    title: "Weather alert: Heavy rainfall expected",
    time: "28 min ago",
    type: "weather",
    color: "cyan"
  }
];

export const aiRiskBreakdown = {
  overallRisk: 87,
  floodRisk: 92,
  landslideRisk: 68,
  cycloneRisk: 54,
  fireRisk: 21,
  insight: "Heavy rainfall is expected to continue for the next 12 hours. Prioritize evacuation in low-lying areas and monitor river levels."
};

export const rescuePlanCapacity = {
  totalEvacuations: "3,240",
  evacuationsDelta: "+12%",
  safeLocations: 18,
  safeLocationsDelta: "+3 new",
  availableVehicles: 24,
  vehiclesInTransit: "6 in transit",
  estimatedCompletion: "42 min"
};

export const activeStressSimulation = {
  scenarioTitle: "Increased Rainfall (2x) + Route Blocked",
  progressPercent: 68,
  status: "In Progress — 68%",
  subtext: "Evaluating route feasibility & battery envelopes...",
  failureChain: [
    { step: 1, title: "Route Blocked", desc: "Primary Kathipara Overpass inundated under 1.8m surge waters", severity: "critical" },
    { step: 2, title: "Vehicle Detour", desc: "UGV-01 and USV-04 forced into unmapped 4.2 km muddy bypass", severity: "high" },
    { step: 3, title: "Travel Time Increased", desc: "Extraction arrival delayed by +19 minutes beyond golden hour", severity: "high" },
    { step: 4, title: "Battery Consumption Increased", desc: "Deep mud thruster torque bleeds fleet reserves down to 18%", severity: "critical" },
    { step: 5, title: "Medical Arrival Delayed", desc: "Hypothermia trauma kits exceed critical stabilization threshold", severity: "critical" },
    { step: 6, title: "Mission Risk Increased", desc: "Plan reliability collapses from 78% down to 42%", severity: "critical" }
  ],
  recommendedAction: "Bypass low-lying overpass via the Elevated Eastern Coastal Corridor (ECR bypass). Saves 11 minutes and 41% battery reserve.",
  alternativePlan: {
    id: "RP-CHENNAI-ALT",
    corridorName: "Elevated Coastal Bypass (ECR Corridor)",
    estimatedTime: "31 min",
    reliability: "86%",
    riskScore: 24,
    batterySavings: "+41% reserve preserved"
  }
};

export const mapWaypointsData = [
  { id: "chennai-center", name: "Chennai Center", x: 58, y: 48, type: "city", isEpicenter: true },
  { id: "tiruvallur", name: "Tiruvallur", x: 26, y: 32, type: "city" },
  { id: "avadi", name: "Avadi", x: 44, y: 42, type: "city" },
  { id: "poonamallee", name: "Poonamallee", x: 34, y: 52, type: "city" },
  { id: "tambaram", name: "Tambaram", x: 48, y: 66, type: "city" },
  { id: "guduvanchery", name: "Guduvanchery", x: 42, y: 80, type: "city" },
  { id: "mahabalipuram", name: "Mahabalipuram", x: 68, y: 88, type: "city" }
];

export const mapShelters = [
  { id: "sh-1", name: "Adyar Highland Shelter", x: 62, y: 38, capacity: "450 / 600" },
  { id: "sh-2", name: "Avadi High School Haven", x: 42, y: 46, capacity: "280 / 400" },
  { id: "sh-3", name: "Tambaram Community Hall", x: 52, y: 64, capacity: "310 / 500" },
  { id: "sh-4", name: "Kovalam Coast Haven", x: 64, y: 76, capacity: "190 / 300" }
];

export const mapRescueTeams = [
  { id: "rt-1", name: "Rescue Team Alpha (UGV-01)", x: 38, y: 40, status: "En Route" },
  { id: "rt-2", name: "Rescue Team Bravo (Boat 2)", x: 56, y: 32, status: "Extracting" },
  { id: "rt-3", name: "Rescue Team Charlie (Helo 4)", x: 52, y: 54, status: "Awaiting Clearance" }
];
