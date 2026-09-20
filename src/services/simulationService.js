// Simulation Service for RescuePlan AI
// Prepares clean API abstraction for Python FastAPI integration

import { stressScenarios, alternativePlanData } from '../data/scenarios';
import { initialPlan } from '../data/plans';

export const simulationService = {
  // Generate a new rescue plan from parameters
  async generateRescuePlan(parameters, onProgress) {
    const steps = [
      "Analyzing disaster conditions & hydraulic velocity...",
      "Evaluating passable corridors & terrain gradients...",
      "Checking available fleet resources, battery reserves & payload...",
      "Synthesizing baseline rescue trajectory & waypoint safety envelopes..."
    ];

    for (let i = 0; i < steps.length; i++) {
      if (onProgress) onProgress(steps[i], (i + 1) * 25);
      await new Promise(res => setTimeout(res, 650));
    }

    const randomId = `RP-${Math.floor(2050 + Math.random() * 50)}`;
    const newPlan = {
      ...initialPlan,
      id: randomId,
      name: `${parameters.disasterType} Tactical Response (${parameters.disasterZone || 'Sector 4'})`,
      disaster: {
        ...initialPlan.disaster,
        type: parameters.disasterType || "Flood",
        severity: parameters.severity || "Critical",
        zone: parameters.disasterZone || "Sector 4 Lowland Basin",
        weather: parameters.weather || "Degraded visibility, localized storm surge"
      },
      mission: {
        ...initialPlan.mission,
        survivorLocation: parameters.survivorLocation || "Logistics Terminal 4B",
        survivorCount: parseInt(parameters.survivorCount, 10) || 12,
        priorityLevel: parameters.priorityLevel || "Urgent Priority 1",
        rescueTeamLocation: parameters.teamLocation || "Forward Base Alpha",
        teamCapacity: `${parameters.teamCapacity || 15} Personnel Maximum`
      },
      metrics: {
        riskScore: parameters.severity === "Critical" ? 72 : 58,
        riskLevel: parameters.severity === "Critical" ? "CRITICAL RISK" : "MODERATE RISK",
        reliabilityScore: 78,
        estimatedTime: 42,
        routeDistance: 8.4,
        resourceUtilization: 64,
        hazardExposureDuration: "14 min",
        evacuationWindow: "60 min before surge peak"
      },
      status: "READY FOR STRESS TEST"
    };

    return newPlan;
  },

  // Run a single or multi-scenario stress test
  async runStressTest(scenarioIds, onProgress) {
    const steps = [
      "Injecting environmental perturbations into Monte Carlo engine...",
      "Simulating telemetry loss & structural failure dynamics...",
      "Measuring fleet power degradation & rescue delay cascading chains...",
      "Calculating robustness threshold & survival probability..."
    ];

    for (let i = 0; i < steps.length; i++) {
      if (onProgress) onProgress(steps[i], (i + 1) * 25);
      await new Promise(res => setTimeout(res, 550));
    }

    const isMulti = scenarioIds.length > 1;
    const primaryScenario = stressScenarios.find(s => s.id === scenarioIds[0]) || stressScenarios[0];

    // Compute compound stress metrics
    const baseRisk = isMulti ? Math.min(96, 68 + (scenarioIds.length * 11)) : 88;
    const reliability = isMulti ? Math.max(16, 42 - (scenarioIds.length * 9)) : 42;
    const robustness = isMulti ? Math.max(12, 38 - (scenarioIds.length * 8)) : 38;

    let failureChain = primaryScenario.failureChain;
    let failureDetected = primaryScenario.failureDetected;

    if (isMulti) {
      failureDetected = `Compound failure detected: ${scenarioIds.map(id => stressScenarios.find(s => s.id === id)?.title || id).join(" + ")} causing simultaneous corridor collapse and fleet power starvation.`;
      failureChain = [
        { step: 1, title: "Compound Shock Injected", desc: `${scenarioIds.length} simultaneous disaster stressors triggered along northern vector`, severity: "critical" },
        { step: 2, title: "Primary Route Impassable", desc: "Overpass collapse coupled with environmental hazards blocks extraction", severity: "critical" },
        { step: 3, title: "Command Link Degraded", desc: "Autonomous units drop to fallback safe mode, stalling forward movement", severity: "high" },
        { step: 4, title: "Critical Battery Bleed", desc: "Protracted route correction drains reserves below 18%", severity: "critical" },
        { step: 5, title: "Medical Golden Hour Breached", desc: "Projected extraction delay exceeds survivor survival window", severity: "critical" },
        { step: 6, title: "Catastrophic Mission Failure", desc: "Total plan reliability collapses to " + reliability + "% under simulation", severity: "critical" }
      ];
    }

    return {
      scenarioIds,
      isMulti,
      status: "FAILED UNDER SIMULATION",
      riskLevel: "CRITICAL",
      riskScore: baseRisk,
      reliabilityScore: reliability,
      robustnessScore: robustness,
      timeDelayMinutes: isMulti ? 28 : 19,
      failureDetected,
      failureChain,
      recommendedAction: "Recalculate the route using the Eastern Access Corridor via Ridge Causeway to bypass compromised overpass and waterborne hazards."
    };
  },

  // Generate an alternative plan
  async generateAlternativePlan(basePlan, stressResult, onProgress) {
    const steps = [
      "Querying topological GIS elevation data for dry-grade corridors...",
      "Synthesizing high-ground bypass via Eastern Ridge Embankment...",
      "Simulating battery draw on elevated asphalt vs swamp grade...",
      "Alternative plan validated with 86% simulated reliability..."
    ];

    for (let i = 0; i < steps.length; i++) {
      if (onProgress) onProgress(steps[i], (i + 1) * 25);
      await new Promise(res => setTimeout(res, 500));
    }

    return {
      ...alternativePlanData,
      basedOn: basePlan.id,
      id: `${basePlan.id}-ALT`
    };
  }
};
