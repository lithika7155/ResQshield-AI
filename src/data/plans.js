// Mock Rescue Plans for RescuePlan AI Platform

export const initialPlan = {
  id: "RP-2048",
  name: "Sector-4 Coastal Surge Evacuation",
  status: "READY FOR STRESS TEST",
  createdAt: "2026-09-20T10:30:00Z",
  disaster: {
    type: "Flood",
    severity: "Critical",
    zone: "Sector 4 Lowland Basin (Grid 44-Nord)",
    secondaryHazards: ["Submerged Roadways", "Live Power Grid Leaks", "Current Velocity 3.4 m/s"],
    weather: "Heavy Rain (45mm/hr), Wind SSE 48 km/h, Temp 18°C",
    waterLevelTrend: "+8 cm/hour",
    visibility: "1.2 km (Severely Degraded)"
  },
  mission: {
    survivorLocation: "Logistics Terminal 4B - Rooftop Haven",
    survivorCount: 14,
    survivorDetails: "14 civilians (3 critical hypothermia, 2 minors, 9 stabilized)",
    rescueTeamLocation: "Forward Base Alpha (Highland Staging)",
    priorityLevel: "Urgent Priority 1",
    assignedFleet: [
      { id: "UGV-01", name: "Amphibious Drone Rover", battery: 94, status: "Active" },
      { id: "USV-04", name: "Tactical Watercraft Bravo", fuel: 88, status: "Active" },
      { id: "UAV-12", name: "Thermal Recon Quad", battery: 78, status: "Airborne" }
    ],
    teamCapacity: "18 Personnel Maximum Payload",
    medicalSupplies: "Class-A Trauma Packs, 4 Stretchers, Hypothermia Blankets",
    commStatus: "Mesh Radio Primary / SATCOM Fallback (92% Link)",
    fuelBatteryRemaining: "89% Mission Reserve"
  },
  metrics: {
    riskScore: 68, // out of 100
    riskLevel: "MODERATE-HIGH",
    reliabilityScore: 78, // %
    estimatedTime: 42, // minutes
    routeDistance: 8.4, // km
    resourceUtilization: 64, // %
    hazardExposureDuration: "14 min",
    evacuationWindow: "65 min before surge crest"
  },
  routeWaypoints: [
    {
      id: "wp-start",
      type: "START",
      label: "Forward Base Alpha",
      coords: "34.142° N, 118.291° W",
      status: "Operational",
      elevation: "45m ASL",
      description: "Primary staging area. Fast deployment ramp clear."
    },
    {
      id: "wp-chk1",
      type: "CHECKPOINT",
      label: "Ridge Outpost 3",
      coords: "34.150° N, 118.283° W",
      status: "Safe",
      elevation: "32m ASL",
      description: "Telemetry relay station. Fleet health diagnostic checkpoint."
    },
    {
      id: "wp-hz1",
      type: "HAZARD_ZONE",
      label: "Flooded Overpass Sector B",
      coords: "34.161° N, 118.274° W",
      status: "Critical Water Level",
      elevation: "11m ASL",
      waterDepth: "1.8 meters",
      description: "Severe hydro-blockage. Current moving at 3.2 m/s."
    },
    {
      id: "wp-surv",
      type: "SURVIVOR",
      label: "Terminal 4B Rooftop Haven",
      coords: "34.175° N, 118.261° W",
      status: "Isolated",
      elevation: "18m ASL",
      description: "14 survivors tagged via IR thermal UAV-12."
    },
    {
      id: "wp-safe",
      type: "SAFE_ZONE",
      label: "Triage Zone Echo (Highland Hospital)",
      coords: "34.182° N, 118.242° W",
      status: "Standby Prepared",
      elevation: "62m ASL",
      description: "Medical emergency team prepped with 15 intensive trauma beds."
    }
  ],
  planSummary: "Team Alpha will approach the survivor zone from the northern access route utilizing amphibious UGV-01 and USV-04. Medical resources are sufficient for the current survivor count. Communication availability is stable across mesh relay #3. Evacuation window remains estimated at 65 minutes before crest.",
  auditTrail: [
    { timestamp: "10:30 AM", user: "AI Route Engine", action: "Generated baseline trajectory via Northern Corridor" },
    { timestamp: "10:32 AM", user: "Resource Validator", action: "Allocated 3 autonomous fleet units & medical supply pack A" },
    { timestamp: "10:35 AM", user: "System", action: "Initial risk scoring completed: 68/100" }
  ]
};

export const presetMissions = [
  {
    id: "RP-2048",
    name: "Coastal Flood Evacuation - Sector 4",
    type: "Flood",
    severity: "Critical",
    zone: "Sector 4 Lowland Basin",
    survivors: 14,
    risk: 68,
    status: "Ready for Stress Test"
  },
  {
    id: "RP-2049",
    name: "Wildfire Perimeter Evac - Ridge Valley",
    type: "Wildfire",
    severity: "High",
    zone: "North Ridge National Forest Sector 9",
    survivors: 8,
    risk: 74,
    status: "Stress Test Passed"
  },
  {
    id: "RP-2050",
    name: "Urban Seismic Collapse - Metro Zone B",
    type: "Earthquake",
    severity: "Critical",
    zone: "Downtown Financial District Grid 12",
    survivors: 26,
    risk: 81,
    status: "Verified & Dispatched"
  },
  {
    id: "RP-2051",
    name: "Chemical Facility Vapor Leak - Harbor Pier 7",
    type: "Industrial Accident",
    severity: "Moderate",
    zone: "Harbor Industrial Complex Gate 3",
    survivors: 6,
    risk: 54,
    status: "Ready for Stress Test"
  }
];
