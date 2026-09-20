// Incident Event Log and Disaster Telemetry Feed

export const initialIncidents = [
  {
    id: "INC-8891",
    planId: "RP-2048",
    missionName: "Sector-4 Coastal Surge Evacuation",
    time: "10:45 AM",
    date: "Today",
    severity: "Critical",
    category: "Approval Protocol",
    title: "Human approval requested for RP-2048-ALT",
    description: "Stress test completed with failure chain triggered. AI generated Eastern Causeway alternative. Final execution authority handed to Mission Commander.",
    status: "Pending Approval",
    resolved: false
  },
  {
    id: "INC-8890",
    planId: "RP-2048",
    missionName: "Sector-4 Coastal Surge Evacuation",
    time: "10:44 AM",
    date: "Today",
    severity: "Warning",
    category: "AI Rerouting",
    title: "Alternative route generated (Eastern Causeway Bypass)",
    description: "AI Route Engine calculated 31-minute bypass route, reducing projected mission risk from 88 to 24.",
    status: "Generated",
    resolved: true
  },
  {
    id: "INC-8889",
    planId: "RP-2048",
    missionName: "Sector-4 Coastal Surge Evacuation",
    time: "10:42 AM",
    date: "Today",
    severity: "Critical",
    category: "Stress Test Failure",
    title: "Route obstruction detected under simulation",
    description: "Simulated structural failure at Flooded Overpass Sector B resulted in mission failure chain and severe battery depletion.",
    status: "Simulated Failure",
    resolved: true
  },
  {
    id: "INC-8888",
    planId: "RP-2048",
    missionName: "Sector-4 Coastal Surge Evacuation",
    time: "10:38 AM",
    date: "Today",
    severity: "Warning",
    category: "Environmental",
    title: "Secondary surge water rise +8 cm/hr detected",
    description: "Telemetry buoy 12-North reported acceleration in water flow speed to 3.4 m/s in lowland channel.",
    status: "Active Alert",
    resolved: false
  },
  {
    id: "INC-8885",
    planId: "RP-2047",
    missionName: "Ridge Valley Wildfire Containment",
    time: "09:18 AM",
    date: "Today",
    severity: "Warning",
    category: "Telemetry",
    title: "Signal loss scenario tested on RP-2047",
    description: "Synthetic RF attenuation stress test passed with UAV mesh failover protocol intact. Robustness score: 82%.",
    status: "Resolved",
    resolved: true
  },
  {
    id: "INC-8882",
    planId: "RP-2046",
    missionName: "Industrial Chemical Leak Containment",
    time: "08:42 AM",
    date: "Today",
    severity: "Resolved",
    category: "Mission Complete",
    title: "Human operator approved alternative deployment RP-2046-ALT",
    description: "Autonomous hazardous containment team evacuated 6 plant technicians with zero casualties. Mission verified and closed.",
    status: "Resolved",
    resolved: true
  },
  {
    id: "INC-8879",
    planId: "RP-2045",
    missionName: "Alpine Landslide Recon",
    time: "07:15 AM",
    date: "Today",
    severity: "Resolved",
    category: "Simulation Passed",
    title: "Stress test passed on RP-2045 (Unstable Scree Mode)",
    description: "Rover traction model sustained 35° incline stability. Approved for mountain rescue dispatch.",
    status: "Resolved",
    resolved: true
  }
];
