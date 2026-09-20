import React, { createContext, useContext, useState } from 'react';
import { initialPlan, presetMissions } from '../data/plans';
import { alternativePlanData } from '../data/scenarios';
import { initialIncidents } from '../data/incidents';
import { simulationService } from '../services/simulationService';
import * as api from '../services/api';

const MissionContext = createContext(null);

export function MissionProvider({ children }) {
  const [currentPlan, setCurrentPlan] = useState(initialPlan);
  const [stressResult, setStressResult] = useState(null);
  const [alternativePlan, setAlternativePlan] = useState(null);
  const [selectedScenarios, setSelectedScenarios] = useState(["route_blocked"]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState({ message: "", percent: 0 });
  const [incidents, setIncidents] = useState(initialIncidents);
  const [approvalStatus, setApprovalStatus] = useState("UNAPPROVED"); // 'UNAPPROVED' | 'VERIFIED' | 'REJECTED'
  const [notifications, setNotifications] = useState([
    {
      id: "notif-1",
      title: "Plan RP-2048 Staged",
      message: "Baseline rescue plan ready for stress simulation.",
      time: "2m ago",
      type: "info"
    },
    {
      id: "notif-2",
      title: "Highland Telemetry Degraded",
      message: "Buoy 12-North reporting +8cm/hr surge rate.",
      time: "7m ago",
      type: "warning"
    }
  ]);

  // ── API state: real backend IDs and responses ──────────────────────────────
  const [apiPlanId, setApiPlanId] = useState(null);          // e.g. "RP-001"
  const [apiStressTestId, setApiStressTestId] = useState(null); // e.g. "ST-001"
  const [apiAnalysisId, setApiAnalysisId] = useState(null);    // e.g. "FA-001"
  const [apiAltPlanId, setApiAltPlanId] = useState(null);      // e.g. "AP-001"
  const [apiApprovalId, setApiApprovalId] = useState(null);    // e.g. "HA-001"

  // Real response data for pages to consume
  const [apiStressData, setApiStressData] = useState(null);
  const [apiAnalysisData, setApiAnalysisData] = useState(null);
  const [apiAltPlanData, setApiAltPlanData] = useState(null);
  const [apiApprovalData, setApiApprovalData] = useState(null);

  // API error messages
  const [apiError, setApiError] = useState(null);

  // ── Create a new plan from form inputs ────────────────────────────────────
  const createPlan = async (formData) => {
    setIsSimulating(true);
    setApiError(null);
    setSimProgress({ message: "Initializing AI Rescue Engine...", percent: 5 });

    try {
      // Run progress animation in parallel with API call
      const progressSteps = [
        { msg: "Analyzing disaster conditions & hydraulic velocity...", pct: 25 },
        { msg: "Evaluating passable corridors & terrain gradients...", pct: 50 },
        { msg: "Checking available fleet resources, battery reserves & payload...", pct: 75 },
        { msg: "Synthesizing baseline rescue trajectory & waypoint safety envelopes...", pct: 90 },
      ];

      let stepIdx = 0;
      const progressTimer = setInterval(() => {
        if (stepIdx < progressSteps.length) {
          const s = progressSteps[stepIdx++];
          setSimProgress({ message: s.msg, percent: s.pct });
        }
      }, 650);

      // Call real backend
      let apiResponse = null;
      try {
        apiResponse = await api.generatePlan(formData);
        setApiPlanId(apiResponse.plan_id);
        // Reset downstream IDs on new plan
        setApiStressTestId(null);
        setApiAnalysisId(null);
        setApiAltPlanId(null);
        setApiApprovalId(null);
        setApiStressData(null);
        setApiAnalysisData(null);
        setApiAltPlanData(null);
        setApiApprovalData(null);
      } catch (err) {
        setApiError('Generate Plan: ' + (err.message || 'Backend error'));
        console.warn('[ResQShield API] /api/generate-plan failed, using simulation fallback:', err.message);
      } finally {
        clearInterval(progressTimer);
      }

      // Build rich plan object (existing simulationService shape) enhanced with real metrics
      const randomId = apiResponse?.plan_id || `RP-${Math.floor(2050 + Math.random() * 50)}`;
      const newPlan = {
        ...initialPlan,
        id: randomId,
        name: `${formData.disasterType || formData.disaster_type} Tactical Response (${formData.disasterZone || 'Sector 4'})`,
        disaster: {
          ...initialPlan.disaster,
          type: formData.disasterType || "Flood",
          severity: formData.severity || "Critical",
          zone: formData.disasterZone || "Sector 4 Lowland Basin",
          weather: formData.weatherCondition || "Degraded visibility, localized storm surge"
        },
        mission: {
          ...initialPlan.mission,
          survivorLocation: formData.survivorLocation || "Logistics Terminal 4B",
          survivorCount: parseInt(formData.estimatedCount || formData.survivorCount, 10) || 12,
          priorityLevel: formData.priority || formData.priorityLevel || "Urgent Priority 1",
          rescueTeamLocation: formData.teamLocation || "Forward Base Alpha",
          teamCapacity: `${formData.teamCapacity || 15} Personnel Maximum`
        },
        metrics: {
          riskScore: apiResponse?.risk_score ?? (formData.severity === "Critical" ? 72 : 58),
          riskLevel: (apiResponse?.risk_score ?? 72) >= 75 ? "CRITICAL RISK" : "MODERATE RISK",
          reliabilityScore: apiResponse?.reliability ?? 78,
          estimatedTime: apiResponse?.estimated_time ?? 42,
          routeDistance: apiResponse?.route_distance ?? 8.4,
          resourceUtilization: 64,
          hazardExposureDuration: "14 min",
          evacuationWindow: "60 min before surge peak"
        },
        status: "READY FOR STRESS TEST",
        // Store raw API data for downstream pages
        _api: apiResponse
      };

      setCurrentPlan(newPlan);
      setStressResult(null);
      setAlternativePlan(null);
      setApprovalStatus("UNAPPROVED");

      // Add to incident feed
      const newIncident = {
        id: `INC-${Math.floor(8900 + Math.random() * 99)}`,
        planId: newPlan.id,
        missionName: newPlan.name,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: "Today",
        severity: "Warning",
        category: "Plan Creation",
        title: `Plan ${newPlan.id} synthesized by AI`,
        description: `Mission parameters locked for ${newPlan.mission.survivorCount} survivors in ${newPlan.disaster.zone}. Staged for stress test.`,
        status: "Staged",
        resolved: false
      };
      setIncidents(prev => [newIncident, ...prev]);

      return newPlan;
    } finally {
      setIsSimulating(false);
      setSimProgress({ message: "", percent: 0 });
    }
  };

  // ── Run stress test on selected scenario(s) ───────────────────────────────
  const runStressTest = async (scenarioIds) => {
    setIsSimulating(true);
    setApiError(null);
    setSimProgress({ message: "Engaging Monte Carlo Multi-Perturbation Engine...", percent: 5 });

    try {
      // Run local progress animation
      const steps = [
        { msg: "Injecting environmental perturbations into Monte Carlo engine...", pct: 20 },
        { msg: "Simulating telemetry loss & structural failure dynamics...", pct: 40 },
        { msg: "Measuring fleet power degradation & rescue delay cascading chains...", pct: 65 },
        { msg: "Calculating robustness threshold & survival probability...", pct: 85 },
      ];
      let i = 0;
      const timer = setInterval(() => {
        if (i < steps.length) { const s = steps[i++]; setSimProgress({ message: s.msg, percent: s.pct }); }
      }, 550);

      // Determine plan_id to use
      const planId = apiPlanId || currentPlan?.id || 'RP-001';

      // Call real backend
      let apiResponse = null;
      try {
        apiResponse = await api.runStressTest(planId, scenarioIds);
        setApiStressTestId(apiResponse.stress_test_id);
        setApiStressData(apiResponse);
        // Reset downstream
        setApiAnalysisId(null);
        setApiAltPlanId(null);
        setApiApprovalId(null);
        setApiAnalysisData(null);
        setApiAltPlanData(null);
        setApiApprovalData(null);
      } catch (err) {
        setApiError('Stress Test: ' + (err.message || 'Backend error'));
        console.warn('[ResQShield API] /api/stress-test failed, using simulation fallback:', err.message);
      } finally {
        clearInterval(timer);
      }

      // If API succeeded, merge real metrics into existing simulationService shape
      const simResult = await simulationService.runStressTest(scenarioIds);
      const merged = {
        ...simResult,
        scenarioIds,
        // Prefer real API values when available
        riskScore: apiResponse?.simulated_risk ?? simResult.riskScore,
        reliabilityScore: apiResponse?.simulated_reliability ?? simResult.reliabilityScore,
        timeDelayMinutes: apiResponse ? (apiResponse.simulated_time - apiResponse.original_time) : simResult.timeDelayMinutes,
        status: apiResponse?.status ?? simResult.status,
        failure_detected: apiResponse?.failure_detected ?? true,
        // Keep rich UI failure chain from simulation; real chain available on apiStressData
        _api: apiResponse
      };

      setStressResult(merged);

      const newIncident = {
        id: `INC-${Math.floor(8900 + Math.random() * 99)}`,
        planId: currentPlan.id,
        missionName: currentPlan.name,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: "Today",
        severity: "Critical",
        category: "Stress Test Failure",
        title: `Failure detected in ${currentPlan.id} under simulation`,
        description: simResult.failureDetected || 'Plan failed under stress simulation.',
        status: "Failed Simulation",
        resolved: false
      };
      setIncidents(prev => [newIncident, ...prev]);

      return merged;
    } finally {
      setIsSimulating(false);
      setSimProgress({ message: "", percent: 0 });
    }
  };

  // ── Failure Analysis ──────────────────────────────────────────────────────
  const runFailureAnalysis = async () => {
    setApiError(null);
    const stressTestId = apiStressTestId || 'ST-001';

    let apiResponse = null;
    try {
      apiResponse = await api.runFailureAnalysis(stressTestId);
      setApiAnalysisId(apiResponse.analysis_id);
      setApiAnalysisData(apiResponse);
    } catch (err) {
      setApiError('Failure Analysis: ' + (err.message || 'Backend error'));
      console.warn('[ResQShield API] /api/failure-analysis failed:', err.message);
    }

    return apiResponse;
  };

  // ── Generate alternative plan ─────────────────────────────────────────────
  const generateAlternative = async () => {
    setIsSimulating(true);
    setApiError(null);
    setSimProgress({ message: "Calculating GIS dry-grade bypass corridor...", percent: 5 });

    try {
      const steps = [
        { msg: "Querying topological GIS elevation data for dry-grade corridors...", pct: 25 },
        { msg: "Synthesizing high-ground bypass via Eastern Ridge Embankment...", pct: 50 },
        { msg: "Simulating battery draw on elevated asphalt vs swamp grade...", pct: 75 },
        { msg: "Alternative plan validated with 86%+ simulated reliability...", pct: 90 },
      ];
      let i = 0;
      const timer = setInterval(() => {
        if (i < steps.length) { const s = steps[i++]; setSimProgress({ message: s.msg, percent: s.pct }); }
      }, 500);

      // Ensure analysis exists first
      const stressId = apiStressTestId || 'ST-001';
      let analysisId = apiAnalysisId;
      if (!analysisId) {
        try {
          const faResult = await api.runFailureAnalysis(stressId);
          analysisId = faResult.analysis_id;
          setApiAnalysisId(analysisId);
          setApiAnalysisData(faResult);
        } catch (err) {
          console.warn('[ResQShield API] auto-failure-analysis failed:', err.message);
          analysisId = 'FA-001'; // fallback to pre-seeded
        }
      }

      let apiResponse = null;
      try {
        apiResponse = await api.generateAlternativePlan(stressId, analysisId);
        setApiAltPlanId(apiResponse.alternative_plan_id);
        setApiAltPlanData(apiResponse);
        setApiApprovalId(null);
        setApiApprovalData(null);
      } catch (err) {
        setApiError('Alternative Plan: ' + (err.message || 'Backend error'));
        console.warn('[ResQShield API] /api/alternative-plan failed:', err.message);
      } finally {
        clearInterval(timer);
      }

      // Merge real API data into the rich alternativePlanData structure
      const alt = {
        ...alternativePlanData,
        basedOn: currentPlan.id,
        id: apiResponse?.alternative_plan_id || `${currentPlan.id}-ALT`,
        status: apiResponse?.status || 'PENDING HUMAN APPROVAL',
        _api: apiResponse
      };

      setAlternativePlan(alt);

      const newIncident = {
        id: `INC-${Math.floor(8900 + Math.random() * 99)}`,
        planId: currentPlan.id,
        missionName: currentPlan.name,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: "Today",
        severity: "Warning",
        category: "AI Rerouting",
        title: `Alternative ${alt.id} generated`,
        description: apiResponse?.reasoning || "Bypass route generated. Awaiting human commander sign-off.",
        status: "Awaiting Approval",
        resolved: false
      };
      setIncidents(prev => [newIncident, ...prev]);

      return alt;
    } finally {
      setIsSimulating(false);
      setSimProgress({ message: "", percent: 0 });
    }
  };

  // ── Approve plan ──────────────────────────────────────────────────────────
  const approvePlan = async (notes, reviewer) => {
    setApiError(null);
    const altPlanId = apiAltPlanId || 'AP-001';

    let apiResponse = null;
    try {
      apiResponse = await api.approvePlan(altPlanId, 'APPROVE', reviewer || 'Rescue Commander', notes || '');
      setApiApprovalId(apiResponse.approval_id);
      setApiApprovalData(apiResponse);
    } catch (err) {
      setApiError('Approval: ' + (err.message || 'Backend error'));
      console.warn('[ResQShield API] /api/approve-plan APPROVE failed:', err.message);
    }

    // Always update local state
    setApprovalStatus("VERIFIED");
    setCurrentPlan(prev => ({
      ...prev,
      status: "VERIFIED & AUTHORIZED",
      verifiedAt: new Date().toISOString(),
      authorizedBy: reviewer || "Commander Alex Chen"
    }));

    const newIncident = {
      id: `INC-${Math.floor(8900 + Math.random() * 99)}`,
      planId: alternativePlan ? alternativePlan.id : currentPlan.id,
      missionName: currentPlan.name,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: "Today",
      severity: "Resolved",
      category: "Human Authorization",
      title: `Plan ${alternativePlan ? alternativePlan.id : currentPlan.id} APPROVED for deployment`,
      description: `Mission Commander issued authorization. Field units dispatched. Notes: ${notes || "Zero override required."}`,
      status: "Verified",
      resolved: true
    };
    setIncidents(prev => [newIncident, ...prev]);

    return apiResponse;
  };

  // ── Reject plan ───────────────────────────────────────────────────────────
  const rejectPlan = async (reason, reviewer) => {
    setApiError(null);
    const altPlanId = apiAltPlanId || 'AP-001';

    let apiResponse = null;
    try {
      apiResponse = await api.approvePlan(altPlanId, 'REJECT', reviewer || 'Rescue Commander', reason || '');
      setApiApprovalId(apiResponse.approval_id);
      setApiApprovalData(apiResponse);
    } catch (err) {
      setApiError('Rejection: ' + (err.message || 'Backend error'));
      console.warn('[ResQShield API] /api/approve-plan REJECT failed:', err.message);
    }

    setApprovalStatus("REJECTED");
    setCurrentPlan(prev => ({
      ...prev,
      status: "REJECTED BY OPERATOR"
    }));

    const newIncident = {
      id: `INC-${Math.floor(8900 + Math.random() * 99)}`,
      planId: currentPlan.id,
      missionName: currentPlan.name,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: "Today",
      severity: "Warning",
      category: "Human Rejection",
      title: `Plan ${currentPlan.id} rejected by operator`,
      description: `Returned for parameter adjustment: ${reason || "Tactical adjustments required by operator."}`,
      status: "Rejected",
      resolved: true
    };
    setIncidents(prev => [newIncident, ...prev]);

    return apiResponse;
  };

  // ── Load a preset mission ─────────────────────────────────────────────────
  const loadPresetMission = (presetId) => {
    const found = presetMissions.find(p => p.id === presetId);
    if (!found) return;

    setCurrentPlan({
      ...initialPlan,
      id: found.id,
      name: found.name,
      disaster: {
        ...initialPlan.disaster,
        type: found.type,
        severity: found.severity,
        zone: found.zone
      },
      mission: {
        ...initialPlan.mission,
        survivorCount: found.survivors
      },
      metrics: {
        ...initialPlan.metrics,
        riskScore: found.risk
      },
      status: found.status
    });
    setStressResult(null);
    setAlternativePlan(null);
    setApprovalStatus("UNAPPROVED");
    setApiPlanId(null);
    setApiStressTestId(null);
    setApiAnalysisId(null);
    setApiAltPlanId(null);
    setApiApprovalId(null);
    setApiStressData(null);
    setApiAnalysisData(null);
    setApiAltPlanData(null);
    setApiApprovalData(null);
  };

  return (
    <MissionContext.Provider
      value={{
        // Existing UI state (unchanged)
        currentPlan,
        setCurrentPlan,
        stressResult,
        setStressResult,
        alternativePlan,
        selectedScenarios,
        setSelectedScenarios,
        isSimulating,
        simProgress,
        incidents,
        approvalStatus,
        notifications,

        // Actions (now connected to real API)
        createPlan,
        runStressTest,
        runFailureAnalysis,
        generateAlternative,
        approvePlan,
        rejectPlan,
        loadPresetMission,

        // Real API data for pages that want to display it
        apiPlanId,
        apiStressTestId,
        apiAnalysisId,
        apiAltPlanId,
        apiApprovalId,
        apiStressData,
        apiAnalysisData,
        apiAltPlanData,
        apiApprovalData,
        apiError,
        setApiError,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
}

export function useMission() {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMission must be used within a MissionProvider');
  }
  return context;
}
