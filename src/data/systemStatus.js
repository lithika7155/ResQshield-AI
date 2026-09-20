// System Status and Health Telemetry for RescuePlan AI

export const systemStatusData = {
  overallHealth: "OPERATIONAL",
  lastCheck: "2026-09-20T10:45:32Z",
  uptime: "99.98%",
  activeSimulations: 4,
  plansAnalyzed: 142,
  scenariosTested: 586,
  averageLatencyMs: 42,
  services: [
    {
      id: "ai-engine",
      name: "AI Strategy Engine",
      role: "Tactical plan generator & failure hypothesis model",
      status: "Operational",
      health: 100,
      latency: "38ms",
      load: "41% GPU Utilization",
      version: "v4.8.2-tactical",
      nodes: "8 / 8 Active"
    },
    {
      id: "sim-engine",
      name: "Monte Carlo Disaster Simulation Engine",
      role: "Multi-failure stress-testing & trajectory perturbator",
      status: "Operational",
      health: 98,
      latency: "64ms",
      load: "76% Compute Cluster",
      version: "v3.1.0-simcore",
      nodes: "16 / 16 Nodes Active"
    },
    {
      id: "route-engine",
      name: "Dynamic Route & Terrain Engine",
      role: "Topological gradient analysis & elevation safety solver",
      status: "Operational",
      health: 100,
      latency: "22ms",
      load: "28% CPU Utilization",
      version: "v2.9.4-gis",
      nodes: "6 / 6 Active"
    },
    {
      id: "database",
      name: "Disaster Vector Database & Incident Ledger",
      role: "Encrypted mission state, plan hashes, and audit chains",
      status: "Operational",
      health: 100,
      latency: "8ms",
      load: "19% I/O Capacity",
      version: "v15.3-replicated",
      nodes: "3 Replicas Synced"
    },
    {
      id: "emergency-feed",
      name: "Emergency Sensor & Satellite Telemetry Feed",
      role: "Live Doppler radar, river gauge, UAV thermal streams",
      status: "Operational",
      health: 96,
      latency: "112ms",
      load: "840 msg/sec Ingestion",
      version: "v5.2-telemetry",
      nodes: "4 Satellite Uplinks Active"
    }
  ],
  infrastructureMetrics: {
    cpuTotalUsage: 48,
    memoryUsage: "24.6 GB / 64 GB",
    activeDronesConnected: 19,
    satelliteFeedsLocked: 4,
    failoverReadiness: "100% Hot Standby"
  }
};
