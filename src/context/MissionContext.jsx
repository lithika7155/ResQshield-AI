import React, { createContext, useContext, useState } from 'react';
import { initialPlan, presetMissions } from '../data/plans';
import { alternativePlanData } from '../data/scenarios';
import { initialIncidents } from '../data/incidents';
import { simulationService } from '../services/simulationService';

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

  // Create a new plan from form inputs
  const createPlan = async (formData) => {
    setIsSimulating(true);
    setSimProgress({ message: "Initializing AI Rescue Engine...", percent: 5 });

    try {
      const generated = await simulationService.generateRescuePlan(formData, (message, percent) => {
        setSimProgress({ message, percent });
      });

      setCurrentPlan(generated);
      setStressResult(null);
      setAlternativePlan(null);
      setApprovalStatus("UNAPPROVED");

      // Add to incident feed
      const newIncident = {
        id: `INC-${Math.floor(8900 + Math.random() * 99)}`,
        planId: generated.id,
        missionName: generated.name,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: "Today",
        severity: "Warning",
        category: "Plan Creation",
        title: `Plan ${generated.id} synthesized by AI`,
        description: `Mission parameters locked for ${generated.mission.survivorCount} survivors in ${generated.disaster.zone}. Staged for stress test.`,
        status: "Staged",
        resolved: false
      };
      setIncidents(prev => [newIncident, ...prev]);

      return generated;
    } finally {
      setIsSimulating(false);
      setSimProgress({ message: "", percent: 0 });
    }
  };

  // Run stress test on selected scenario(s)
  const runStressTest = async (scenarioIds) => {
    setIsSimulating(true);
    setSimProgress({ message: "Engaging Monte Carlo Multi-Perturbation Engine...", percent: 5 });

    try {
      const result = await simulationService.runStressTest(scenarioIds, (message, percent) => {
        setSimProgress({ message, percent });
      });

      setStressResult(result);

      // Add failure incident
      const newIncident = {
        id: `INC-${Math.floor(8900 + Math.random() * 99)}`,
        planId: currentPlan.id,
        missionName: currentPlan.name,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: "Today",
        severity: "Critical",
        category: "Stress Test Failure",
        title: `Failure detected in ${currentPlan.id} under simulation`,
        description: result.failureDetected,
        status: "Failed Simulation",
        resolved: false
      };
      setIncidents(prev => [newIncident, ...prev]);

      return result;
    } finally {
      setIsSimulating(false);
      setSimProgress({ message: "", percent: 0 });
    }
  };

  // Generate alternative plan
  const generateAlternative = async () => {
    setIsSimulating(true);
    setSimProgress({ message: "Calculating GIS dry-grade bypass corridor...", percent: 5 });

    try {
      const alt = await simulationService.generateAlternativePlan(currentPlan, stressResult, (message, percent) => {
        setSimProgress({ message, percent });
      });

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
        description: "Bypass route generated with 86% simulated reliability. Awaiting human commander sign-off.",
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

  // Approve plan
  const approvePlan = (notes) => {
    setApprovalStatus("VERIFIED");
    setCurrentPlan(prev => ({
      ...prev,
      status: "VERIFIED & AUTHORIZED",
      verifiedAt: new Date().toISOString(),
      authorizedBy: "Commander Alex Chen"
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
      description: `Mission Commander issued cryptographic authorization. Field units dispatched. Notes: ${notes || "Zero override required."}`,
      status: "Verified",
      resolved: true
    };
    setIncidents(prev => [newIncident, ...prev]);
  };

  // Reject and return to analysis
  const rejectPlan = (reason) => {
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
  };

  // Load a preset mission
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
  };

  return (
    <MissionContext.Provider
      value={{
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
        createPlan,
        runStressTest,
        generateAlternative,
        approvePlan,
        rejectPlan,
        loadPresetMission
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
