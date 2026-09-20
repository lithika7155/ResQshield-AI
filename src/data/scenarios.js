// Stress Test Scenarios and Simulation Failures for RescuePlan AI

export const stressScenarios = [
  {
    id: "route_blocked",
    code: "SCEN-01",
    title: "ROUTE BLOCKED",
    icon: "ShieldAlert",
    category: "Infrastructure",
    description: "Simulate sudden route obstruction caused by collapsing infrastructure or flash surge.",
    stressParameter: "Simulated complete roadblock at Flooded Overpass Sector B (Grid 44-Nord)",
    impactSummary: "Forces ground/amphibious fleet to execute an unmapped 4.2km detour",
    severity: "CRITICAL",
    probability: "84%",
    estimatedTimeDelay: "+19 minutes",
    batteryPenalty: "-28%",
    failureDetected: "Primary rescue route becomes inaccessible after simulated road blockage at Sector B overpass.",
    failureChain: [
      { step: 1, title: "Route Blocked", desc: "Flooded Overpass Sector B collapses under 3.2 m/s hydraulic pressure", severity: "critical" },
      { step: 2, title: "Vehicle Detour", desc: "UGV-01 and USV-04 forced into unmapped 4.2 km swamp detour", severity: "high" },
      { step: 3, title: "Travel Time Increased", desc: "Estimated arrival shifts from 42 min to 61 min (+19 min delay)", severity: "high" },
      { step: 4, title: "Battery Consumption Increased", desc: "Rough current navigation drains fleet reserves to critical 19%", severity: "critical" },
      { step: 5, title: "Medical Arrival Delayed", desc: "Hypothermic survivors exceed stabilization window (threshold 50m)", severity: "critical" },
      { step: 6, title: "Mission Risk Surge", desc: "Catastrophic failure probability spikes to 58%", severity: "critical" }
    ],
    recommendedAction: "Recalculate the route using the Eastern Access Corridor via Ridge Causeway."
  },
  {
    id: "low_battery",
    code: "SCEN-02",
    title: "LOW BATTERY / FUEL DEPLETION",
    icon: "BatteryWarning",
    category: "Power Systems",
    description: "Simulate sudden degradation of autonomous vehicle/robot battery packs due to cold water immersion.",
    stressParameter: "Sudden 35% battery loss on lead amphibious drone UGV-01",
    impactSummary: "Reduces autonomous payload speed and risks mid-mission stranding",
    severity: "HIGH",
    probability: "62%",
    estimatedTimeDelay: "+14 minutes",
    batteryPenalty: "-35%",
    failureDetected: "Lead UGV power drops below emergency recovery threshold before reaching extraction point.",
    failureChain: [
      { step: 1, title: "Sub-zero Water Shock", desc: "Battery cell thermal drop reduces overall capacity by 35%", severity: "high" },
      { step: 2, title: "Thruster Power Throttled", desc: "Autonomous rover enters low-power survival mode (5 km/h)", severity: "high" },
      { step: 3, title: "Payload Drag Increase", desc: "Stretcher tow rig drains remaining reserve at 2x rate", severity: "critical" },
      { step: 4, title: "Return Trip Unviable", desc: "Rover lacks energy to reach Safe Zone Echo without midway recharge", severity: "critical" }
    ],
    recommendedAction: "Deploy secondary battery tender drone or reallocate payload to USV-04."
  },
  {
    id: "signal_loss",
    code: "SCEN-03",
    title: "SIGNAL LOSS / COMMS BLACKOUT",
    icon: "RadioOff",
    category: "Communications",
    description: "Simulate complete telemetry and command link loss across the forward canyon corridor.",
    stressParameter: "Drop RF link & mesh repeater 2 degradation below 15% SNR",
    impactSummary: "Autonomous fleet loses dynamic obstacle avoidance feed and operator override",
    severity: "HIGH",
    probability: "73%",
    estimatedTimeDelay: "+11 minutes",
    batteryPenalty: "-8%",
    failureDetected: "Autonomous navigation systems revert to conservative failsafe crawl without central telemetry.",
    failureChain: [
      { step: 1, title: "Relay Mast Inundated", desc: "Submerged base station cuts UHF tactical mesh link", severity: "high" },
      { step: 2, title: "Tele-operation Severed", desc: "Operators lose real-time visual feed of survivor haven", severity: "high" },
      { step: 3, title: "Autonomous Halt Protocol", desc: "Fleet pauses for 8 minutes attempting satellite link handshake", severity: "critical" },
      { step: 4, title: "Coordination Desync", desc: "Watercraft and ground rover lose mutual position tracking", severity: "critical" }
    ],
    recommendedAction: "Activate high-altitude airborne UAV-12 relay loiter pattern over waypoint Bravo."
  },
  {
    id: "new_hazard",
    code: "SCEN-04",
    title: "NEW HAZARD / LIVE POWER GRID LEAK",
    icon: "ZapOff",
    category: "Environmental",
    description: "Introduce sudden downed high-voltage power lines electrifying flood waters along primary access.",
    stressParameter: "13.8 kV distribution line breach into flood corridor Grid 44-B",
    impactSummary: "Water current electrified; lethal proximity zone extended 300m radius",
    severity: "CRITICAL",
    probability: "55%",
    estimatedTimeDelay: "+22 minutes",
    batteryPenalty: "-15%",
    failureDetected: "Lethal electrical gradient detected in approach waters; immediate vector abort required.",
    failureChain: [
      { step: 1, title: "Substation Surge Breach", desc: "Downed transformer discharges 13.8 kV into standing flood zone", severity: "critical" },
      { step: 2, title: "Hull Conductivity Risk", desc: "Watercraft sensors detect high-risk voltage arc within 280m", severity: "critical" },
      { step: 3, title: "No-Go Zone Triggered", desc: "Primary corridor declared lethal to both rescue teams and survivors", severity: "critical" },
      { step: 4, title: "Complete Vector Abort", desc: "Team Alpha ordered to reverse trajectory immediately", severity: "critical" }
    ],
    recommendedAction: "Reroute along high-elevation railway embankment outside flooded grid sector."
  },
  {
    id: "location_error",
    code: "SCEN-05",
    title: "SURVIVOR LOCATION ERROR",
    icon: "Compass",
    category: "Intelligence",
    description: "Simulate inaccurate survivor coordinates due to cell tower triangulation drift.",
    stressParameter: "Simulate 650m eastward GPS discrepancy from reported rooftop coordinate",
    impactSummary: "Rescue team arrives at vacant structure; thermal sweep delay required",
    severity: "MODERATE",
    probability: "48%",
    estimatedTimeDelay: "+16 minutes",
    batteryPenalty: "-18%",
    failureDetected: "Target coordinates vacant; search radius expansion exhausts allocated mission reserve.",
    failureChain: [
      { step: 1, title: "Triangulation Drift", desc: "Cellular ping reflection skewed coordinates by 650 meters", severity: "moderate" },
      { step: 2, title: "False Arrival Target", desc: "Fleet arrives at submerged Terminal 4A instead of Haven 4B", severity: "high" },
      { step: 3, title: "Recon Search Expansion", desc: "UAV-12 forced into low-altitude emergency spiral search grid", severity: "high" },
      { step: 4, title: "Surge Window Erosion", desc: "Search delay reduces remaining safety margin to under 15 minutes", severity: "critical" }
    ],
    recommendedAction: "Integrate multi-spectral thermal signature lock before departure."
  }
];

// Combined Multi-Failure Simulation Matrix
export const multiFailureScenarios = [
  {
    id: "compound_disaster_alpha",
    name: "COMPOUND COLLAPSE: Route Blocked + Signal Loss + New Hazard",
    description: "Simulate simultaneous bridge failure, communication blackout, and electrified flood currents.",
    selectedScenarios: ["route_blocked", "signal_loss", "new_hazard"],
    stressLevel: "EXTREME CATASTROPHIC",
    projectedReliability: 18,
    projectedRisk: 94,
    failureDetected: "Complete breakdown of primary and secondary ingress vectors; total autonomous loss imminent without manual abort and corridor switch."
  },
  {
    id: "power_and_grid_decay",
    name: "POWER & NAVIGATION FAILURE: Low Battery + Survivor Drift",
    description: "Simulate severe battery degradation alongside coordinates error.",
    selectedScenarios: ["low_battery", "location_error"],
    stressLevel: "SEVERE",
    projectedReliability: 34,
    projectedRisk: 82,
    failureDetected: "Fleet power insufficient to complete expanded search grid and return safely to triage."
  }
];

// Realistic Alternative Plan Data
export const alternativePlanData = {
  id: "RP-2048-ALT",
  basedOn: "RP-2048",
  name: "Sector-4 Eastern Causeway Bypass (Alternative)",
  status: "PENDING HUMAN APPROVAL",
  createdAt: "2026-09-20T10:44:12Z",
  comparison: {
    route: {
      original: "Northern Lowland Overpass (Sector B)",
      alternative: "Eastern Elevated Causeway via Ridge Embankment",
      statusChange: "Overpass avoided entirely"
    },
    estimatedTime: {
      original: "42 min (61 min stressed)",
      alternative: "31 min",
      diff: "-11 min faster",
      better: true
    },
    riskScore: {
      original: "68 (88 stressed)",
      alternative: "24",
      diff: "-44 lower risk",
      better: true
    },
    reliability: {
      original: "42% (under stress)",
      alternative: "86%",
      diff: "+44% reliability",
      better: true
    },
    resourceUsage: {
      original: "89% battery depleted",
      alternative: "48% battery consumed",
      diff: "+41% reserve saved",
      better: true
    },
    hazardExposure: {
      original: "19 min in hydro hazard",
      alternative: "4 min in hazard zone",
      diff: "78% less exposure",
      better: true
    }
  },
  whyPlanChanged: "The Eastern Causeway route avoids the compromised Overpass Sector B entirely by utilizing an elevated rail embankment that sits 18m above current surge levels. Despite a slight initial detour, the paved dry grade enables full-speed transit (32 km/h vs 9 km/h through water), consuming 41% less battery and staying clear of submerged high-voltage zones.",
  waypoints: [
    { id: "alt-1", label: "Base Alpha", coords: "34.142° N, 118.291° W", type: "START", status: "Active" },
    { id: "alt-2", label: "Eastern Rail Depot (Elevated)", coords: "34.148° N, 118.265° W", type: "CHECKPOINT", status: "Dry Grade" },
    { id: "alt-3", label: "Highland Causeway Bypass", coords: "34.162° N, 118.252° W", type: "SAFE_CORRIDOR", status: "Zero Hazard" },
    { id: "alt-4", label: "Haven 4B Skybridge Ramp", coords: "34.175° N, 118.261° W", type: "SURVIVOR", status: "Secured Approach" },
    { id: "alt-5", label: "Triage Zone Echo", coords: "34.182° N, 118.242° W", type: "SAFE_ZONE", status: "Direct Ingress" }
  ],
  aiConfidence: "94.8% Probabilistic Confidence",
  survivorSafetyMargin: "+34 minutes buffer before surge crest"
};
