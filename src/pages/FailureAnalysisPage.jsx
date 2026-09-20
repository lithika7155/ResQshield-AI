import React, { useState, useEffect } from 'react';
import { useMission } from '../context/MissionContext';
import { 
  ShieldAlert, 
  AlertOctagon, 
  AlertTriangle, 
  Clock, 
  BatteryWarning, 
  Radio, 
  Truck, 
  Users, 
  Activity, 
  ArrowRight, 
  ArrowLeft, 
  ArrowDown, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Compass, 
  Cpu, 
  Flame, 
  Layers, 
  TrendingUp, 
  TrendingDown, 
  CornerDownRight, 
  Info, 
  Sliders, 
  ExternalLink 
} from 'lucide-react';

export default function FailureAnalysisPage({ 
  planData, 
  onNavigateToAlternative, 
  onBackToStressTest, 
  onBackToDashboard 
}) {
  const { 
    apiPlanId, 
    apiStressTestId, 
    apiAnalysisId, 
    apiAnalysisData, 
    apiStressData, 
    runFailureAnalysis, 
    currentPlan 
  } = useMission();

  // Auto-run failure analysis if not already fetched
  useEffect(() => {
    if (!apiAnalysisData) {
      runFailureAnalysis().catch(err => {
        console.warn('[ResQShield API] Failure analysis notice:', err.message);
      });
    }
  }, [apiAnalysisData, runFailureAnalysis]);

  // Plan and test metadata
  const meta = {
    planId: apiPlanId || planData?.planId || currentPlan?.id || "RP-2026-CHN-094",
    stressTestId: apiAnalysisData?.stress_test_id || apiStressTestId || "ST-001",
    analysisId: apiAnalysisData?.analysis_id || apiAnalysisId || "FA-001",
    testStatus: apiAnalysisData?.status || apiStressData?.status || "FAILED",
    scenariosTested: 3,
    scenarioNames: ["Route Blocked", "Low Battery", "New Hazard"],
    completedAt: "2026-09-20 12:12:40 IST",
    originalRisk: apiStressData?.original_risk ?? 68,
    simulatedRisk: apiStressData?.simulated_risk ?? 91,
    originalReliability: apiStressData?.original_reliability ?? 82,
    simulatedReliability: apiStressData?.simulated_reliability ?? 54,
    originalTime: apiStressData?.original_time ?? 42,
    simulatedTime: apiStressData?.simulated_time ?? 67
  };

  // State for active stage click/inspect in Failure Chain
  const [selectedChainIndex, setSelectedChainIndex] = useState(0);

  const failureChainStages = [
    {
      step: 1,
      id: "route_blocked",
      title: "ROUTE BLOCKED",
      summary: "Primary route became unavailable.",
      detail: "Kathipara arterial overpass completely submerged under 1.8m rapid surge waters. Structural sonar reports 3.4 m/s cross-current tearing barrier railings. Ingress passability drops to 0%.",
      impactLevel: "Critical",
      icon: ShieldAlert,
      metric: "Passability: 0%",
      telemetry: "Elevation: -1.2m below flood line • Velocity: 3.4 m/s"
    },
    {
      step: 2,
      id: "detour_required",
      title: "DETOUR REQUIRED",
      summary: "Rescue team was redirected to secondary route.",
      detail: "Field units UGV-01 and 4 RIB watercraft forced to abort paved highway approach and divert onto unmapped 4.2 km southern low-lying drainage bypass corridor.",
      impactLevel: "High",
      icon: AlertTriangle,
      metric: "+4.2 km Detour",
      telemetry: "Corridor: Southern Drainage Trail • Surface: Unpaved Clay"
    },
    {
      step: 3,
      id: "travel_time_increased",
      title: "TRAVEL TIME INCREASED",
      summary: "Estimated travel time increased by 25 minutes.",
      detail: "Heavy mud drag, debris obstacles, and reduced visibility extended total travel duration from 42 minutes to 67 minutes, critically compressing operational time buffers.",
      impactLevel: "High",
      icon: Clock,
      metric: "42 min → 67 min (+25m)",
      telemetry: "Speed Drop: 38 km/h → 14 km/h • Time Buffer: -33 min"
    },
    {
      step: 4,
      id: "battery_consumption_increased",
      title: "BATTERY CONSUMPTION INCREASED",
      summary: "Additional travel exceeded the planned battery margin.",
      detail: "Overcoming continuous 3.4 m/s water drag and deep mud thruster resistance demanded 98% sustained peak power, depleting fleet energy envelopes from 92% down to 4%.",
      impactLevel: "Critical",
      icon: BatteryWarning,
      metric: "92% → 4% Reserve",
      telemetry: "Peak Torque: 98% • Energy Deficit: 2.8 kWh per unit"
    },
    {
      step: 5,
      id: "medical_arrival_delayed",
      title: "MEDICAL ARRIVAL DELAYED",
      summary: "Medical resources could not reach the target within the required time.",
      detail: "Triage units failed to reach the 18 critical casualties within the mandated 45-minute hypothermia and trauma stabilization window, arriving at 67 minutes (+22m breach).",
      impactLevel: "Critical",
      icon: AlertOctagon,
      metric: "+22 min Window Breach",
      telemetry: "Golden Hour Target: 45 min • Arrival: 67 min (18 Patients At Risk)"
    },
    {
      step: 6,
      id: "mission_risk_increased",
      title: "MISSION RISK INCREASED",
      summary: "Overall rescue reliability dropped below the safe threshold.",
      detail: "Compound propagation of terrain obstacles, energy collapse, and delayed medical stabilization forced mission risk from 68 to 91, collapsing plan reliability down to 54%.",
      impactLevel: "Critical",
      icon: XCircle,
      metric: "Risk: 91 / Reliability: 54%",
      telemetry: "Failure Probability: 46% • Mission Abort Threshold: Exceeded"
    }
  ];

  // Dynamic failure chain from real API if present
  const displayChainStages = apiAnalysisData?.failure_chain?.length
    ? apiAnalysisData.failure_chain.map((stageName, idx) => {
        const fallback = failureChainStages[idx] || {};
        return {
          step: idx + 1,
          id: typeof stageName === 'string' ? stageName.toLowerCase().replace(/\s+/g, '_') : (fallback.id || `stage_${idx+1}`),
          title: typeof stageName === 'string' ? stageName.toUpperCase() : (fallback.title || `STAGE 0${idx+1}`),
          summary: fallback.summary || `${stageName} identified in causal propagation chain.`,
          detail: fallback.detail || `${stageName} triggered cascading operational failure on mission resources.`,
          impactLevel: fallback.impactLevel || (idx === 0 ? "Critical" : "High"),
          icon: fallback.icon || AlertOctagon,
          metric: fallback.metric || (idx === 0 ? "Passability: 0%" : idx === apiAnalysisData.failure_chain.length - 1 ? `Risk: ${meta.simulatedRisk} / Rel: ${meta.simulatedReliability}%` : "Cascading Impact"),
          telemetry: fallback.telemetry || "Causality propagation confidence: 98.2%"
        };
      })
    : failureChainStages;

  const impactedResources = [
    {
      name: "Rescue Teams",
      icon: Users,
      status: "Compromised",
      statusColor: "text-crimson-400 bg-crimson-950/60 border-crimson-500/50",
      before: "12 / 16 Specialists Deployed (Nominal)",
      after: "12 Specialists Pinned at Sector B",
      impact: "Personnel immobilized at flooded culvert; unable to advance without high-anchor winch support."
    },
    {
      name: "Vehicles & Watercraft",
      icon: Truck,
      status: "Severely Impeded",
      statusColor: "text-amber-400 bg-amber-950/60 border-amber-500/50",
      before: "6 / 8 Active (2 UGVs + 4 RIB Boats)",
      after: "2 UGVs Stalled in Mud, 2 RIBs Impeded",
      impact: "Thruster motor overheating warnings triggered; average extraction velocity reduced by 65%."
    },
    {
      name: "Battery / Fuel Reserves",
      icon: BatteryWarning,
      status: "Critical Exhaustion",
      statusColor: "text-crimson-400 bg-crimson-950/60 border-crimson-500/50",
      before: "92% Reserve (2.4 kWh per unit)",
      after: "4% Residual (Zero Return Margin)",
      impact: "Fleet has zero reserve to perform patient return sorties to IIT Madras camp without emergency field recharge."
    },
    {
      name: "Medical Supplies & Triage",
      icon: Activity,
      status: "Deadline Missed",
      statusColor: "text-crimson-400 bg-crimson-950/60 border-crimson-500/50",
      before: "16 Class-A Trauma Kits, 6 Resuscitators",
      after: "Supplies Intact, Arrival +22m Late",
      impact: "Delayed arrival past the hypothermia golden hour directly jeopardizes survival for 18 critical casualties."
    },
    {
      name: "Field Communication",
      icon: Radio,
      status: "Attenuated",
      statusColor: "text-amber-400 bg-amber-950/60 border-amber-500/50",
      before: "89% Tactical UHF Mesh Link",
      after: "42% Intermittent (24s Latency)",
      impact: "Heavy torrential rainfall and ridge obstruction created significant RF nulls along the southern bypass."
    }
  ];

  const riskBreakdown = [
    { name: "Route Risk", before: 54, after: 96, delta: "+42%", level: "CRITICAL", color: "text-crimson-400", bar: "bg-crimson-500" },
    { name: "Resource Risk", before: 22, after: 88, delta: "+66%", level: "CRITICAL", color: "text-crimson-400", bar: "bg-crimson-500" },
    { name: "Time Risk", before: 18, after: 84, delta: "+66%", level: "HIGH", color: "text-amber-400", bar: "bg-amber-500" },
    { name: "Communication Risk", before: 48, after: 72, delta: "+24%", level: "HIGH", color: "text-amber-400", bar: "bg-amber-500" },
    { name: "Hazard Exposure", before: 78, after: 95, delta: "+17%", level: "CRITICAL", color: "text-crimson-400", bar: "bg-crimson-600" },
  ];

  return (
    <div className="space-y-4 max-w-7xl mx-auto font-sans pb-16 text-slate-100">
      
      {/* ── WORKFLOW STAGES STEPPER ── */}
      <div className="rounded-xl bg-[#0D121D] border border-white/10 px-4 py-3 shadow-command flex items-center justify-between overflow-x-auto text-xs font-mono">
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <span className="flex items-center gap-1 text-slate-400">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center text-[10px] font-bold">✓</span>
            <span>1. Create Plan</span>
          </span>

          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

          <span className="flex items-center gap-1 text-slate-400">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center text-[10px] font-bold">✓</span>
            <span>2. Plan Analysis</span>
          </span>

          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

          <button 
            onClick={onBackToStressTest}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
          >
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center text-[10px] font-bold">✓</span>
            <span>3. Stress Test</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

          {/* ACTIVE STAGE */}
          <div className="flex items-center gap-1.5 text-crimson-300 font-bold bg-crimson-950/70 px-2.5 py-1 rounded-lg border border-crimson-500/50 shadow-crimson-glow">
            <span className="w-5 h-5 rounded-full bg-crimson-600 text-white flex items-center justify-center text-[10px] font-black">4</span>
            <span>4. Failure Analysis (Investigation)</span>
          </div>

          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

          <button 
            onClick={onNavigateToAlternative}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <span className="w-5 h-5 rounded-full bg-black/50 border border-slate-800 text-slate-600 flex items-center justify-center text-[10px]">5</span>
            <span>5. Alternative Plan</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-5 h-5 rounded-full bg-black/50 border border-slate-900 text-slate-700 flex items-center justify-center text-[10px]">6</span>
            <span>6. Human Approval</span>
          </span>
        </div>

        <button
          onClick={onBackToDashboard}
          className="text-slate-400 hover:text-cyan-400 text-xs font-mono flex items-center gap-1 ml-4 transition-colors shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </button>
      </div>

      {/* ── PAGE HEADER ── */}
      <div className="rounded-xl bg-[#0D121D] border border-white/10 p-5 shadow-command">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-crimson-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5" />
                MISSION POST-MORTEM & CAUSALITY ENGINE
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400">
                AUDIT LOG #{meta.stressTestId}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                Failure Analysis
              </h1>
              <span className="px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider bg-crimson-950/90 border border-crimson-500/80 text-crimson-300 shadow-crimson-glow animate-pulse flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-crimson-400" />
                TEST STATUS: {meta.testStatus}
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
              Understand how changing disaster conditions affected the rescue plan.
            </p>
          </div>

          {/* Dossier Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-black/50 border border-white/10">
              <span className="text-[10px] text-slate-500 uppercase block">TARGET PLAN</span>
              <strong className="text-white tracking-wider">{meta.planId}</strong>
            </div>

            <div className="p-2.5 rounded-lg bg-black/50 border border-white/10">
              <span className="text-[10px] text-slate-500 uppercase block">SCENARIOS TESTED</span>
              <strong className="text-amber-400">{meta.scenariosTested} Compound Vectors</strong>
            </div>

            <div className="p-2.5 rounded-lg bg-black/50 border border-white/10 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-500 uppercase block">ANALYSIS COMPLETED</span>
              <span className="text-slate-300 truncate block">{meta.completedAt}</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── SECTION 1 — FAILURE SUMMARY PANEL ── */}
      <div className="rounded-xl bg-gradient-to-r from-[#200B10] via-[#2D0D14] to-[#1E0A0F] border-2 border-crimson-600/70 p-5 sm:p-6 shadow-crimson-glow space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-crimson-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-crimson-600/30 border border-crimson-500 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-crimson-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white font-mono tracking-wide uppercase text-crimson-100">
                RESCUE PLAN FAILED UNDER SIMULATION
              </h2>
              <span className="text-[11px] text-crimson-300/80 font-mono">
                Compound failure injection exceeded baseline safety thresholds
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-crimson-400 bg-black/50 px-3 py-1 rounded border border-crimson-500/40">
            NON-EXECUTABLE
          </span>
        </div>

        {/* 3 Core Visual Comparison Cards (Before vs After) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          
          {/* Card 1: Risk Score Comparison */}
          <div className="p-4 rounded-xl bg-black/60 border border-crimson-500/40 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="uppercase tracking-wider">RISK SCORE INDEX</span>
              <ShieldAlert className="w-4 h-4 text-crimson-400" />
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">ORIGINAL</span>
                <span className="text-2xl font-bold text-slate-400">{meta.originalRisk}</span>
              </div>
              <ArrowRight className="w-5 h-5 text-crimson-400 self-center" />
              <div className="text-right">
                <span className="text-[10px] text-crimson-400 block font-bold">SIMULATED</span>
                <span className="text-3xl font-black text-crimson-400">{meta.simulatedRisk}</span>
              </div>
            </div>

            <div className="w-full bg-black/80 h-2 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-gradient-to-r from-amber-500 to-crimson-500" style={{ width: '91%' }} />
            </div>

            <div className="text-[11px] text-crimson-300 flex items-center justify-between font-sans">
              <span>Delta: +23 points</span>
              <span className="font-bold uppercase text-crimson-400">[Critical Surge]</span>
            </div>
          </div>

          {/* Card 2: Reliability Comparison */}
          <div className="p-4 rounded-xl bg-black/60 border border-crimson-500/40 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="uppercase tracking-wider">MISSION RELIABILITY</span>
              <Activity className="w-4 h-4 text-amber-400" />
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">ORIGINAL</span>
                <span className="text-2xl font-bold text-slate-400">{meta.originalReliability}%</span>
              </div>
              <ArrowRight className="w-5 h-5 text-amber-400 self-center" />
              <div className="text-right">
                <span className="text-[10px] text-amber-400 block font-bold">SIMULATED</span>
                <span className="text-3xl font-black text-amber-400">{meta.simulatedReliability}%</span>
              </div>
            </div>

            <div className="w-full bg-black/80 h-2 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-amber-500" style={{ width: '54%' }} />
            </div>

            <div className="text-[11px] text-amber-300 flex items-center justify-between font-sans">
              <span>Delta: -28% drop</span>
              <span className="font-bold uppercase text-amber-400">[Severe Collapse]</span>
            </div>
          </div>

          {/* Card 3: Rescue Time Comparison */}
          <div className="p-4 rounded-xl bg-black/60 border border-crimson-500/40 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="uppercase tracking-wider">TOTAL RESCUE TIME</span>
              <Clock className="w-4 h-4 text-crimson-400" />
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">ORIGINAL</span>
                <span className="text-2xl font-bold text-slate-400">{meta.originalTime} min</span>
              </div>
              <ArrowRight className="w-5 h-5 text-crimson-400 self-center" />
              <div className="text-right">
                <span className="text-[10px] text-crimson-400 block font-bold">SIMULATED</span>
                <span className="text-3xl font-black text-crimson-400">{meta.simulatedTime} min</span>
              </div>
            </div>

            <div className="w-full bg-black/80 h-2 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-crimson-500" style={{ width: '89%' }} />
            </div>

            <div className="text-[11px] text-crimson-300 flex items-center justify-between font-sans">
              <span>Delta: +25 min delay</span>
              <span className="font-bold uppercase text-crimson-400">[Golden Hour Breached]</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── SECTION 2 — PRIMARY ROOT CAUSE PANEL ── */}
      <div className="rounded-xl bg-[#0D121D] border border-crimson-500/40 p-5 shadow-command space-y-3.5">
        <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-crimson-400" />
            <h2 className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider">
              2. Primary Failure Cause
            </h2>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-crimson-950/80 border border-crimson-500/60 text-crimson-300 font-bold">
            SEVERITY: {meta.testStatus}
          </span>
        </div>

        {/* Highlighted Cause Statement */}
        <div className="p-3.5 rounded-lg bg-crimson-950/30 border border-crimson-500/30">
          <p className="text-sm font-semibold text-white font-sans">
            “{apiAnalysisData?.root_cause || "Critical route became unavailable during the simulation."}”
          </p>
          <p className="text-xs text-slate-300 font-sans mt-1 leading-relaxed">
            {apiAnalysisData?.operational_impact || "Primary arterial overpass at Kathipara Junction was inundated by rapid 1.8m surge waters and fallen structural debris, severing the single ingress line."}
          </p>
        </div>

        {/* Root Cause Technical Diagnostics Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono pt-1">
          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <span className="text-[9px] text-slate-500 uppercase block">AFFECTED ROUTE</span>
            <strong className="text-white mt-0.5 block truncate" title="North Arterial Kathipara Ramp">
              Kathipara High-Level Ramp
            </strong>
            <span className="text-[10px] text-crimson-400">Sector B Chokepoint (Submerged)</span>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <span className="text-[9px] text-slate-500 uppercase block">AFFECTED TEAMS</span>
            <strong className="text-white mt-0.5 block truncate">
              NDRF 04 Battalion & Watercraft
            </strong>
            <span className="text-[10px] text-amber-400">18 Personnel + 2 Amphibious UGVs</span>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <span className="text-[9px] text-slate-500 uppercase block">ESTIMATED IMPACT</span>
            <strong className="text-crimson-400 mt-0.5 block">
              +{meta.simulatedTime - meta.originalTime} min Total Traversal Delay
            </strong>
            <span className="text-[10px] text-slate-400">Forced unmapped 4.2 km detour</span>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <span className="text-[9px] text-slate-500 uppercase block">FAILURE PROPAGATION</span>
            <strong className="text-amber-400 mt-0.5 block">
              Battery Depleted to 4%
            </strong>
            <span className="text-[10px] text-slate-400">Thruster energy drain in deep mud</span>
          </div>
        </div>
      </div>

      {/* ── SECTION 3 — FAILURE CHAIN (MAIN VISUAL FEATURE) ── */}
      <div className="rounded-xl bg-[#0D121D] border border-white/10 p-5 sm:p-6 shadow-command space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm sm:text-base font-bold text-white font-mono uppercase tracking-wider">
                3. Cascading Failure Chain (Interactive Flow)
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
              Click any node to inspect specific sensor readings, telemetry metrics, and causality impact.
            </p>
          </div>
          <span className="text-[11px] font-mono text-crimson-400 font-bold self-start sm:self-auto">
            {displayChainStages.length} STAGES • DIRECT CAUSALITY LINK
          </span>
        </div>

        {/* Visual Interactive Chain Nodes */}
        <div className="space-y-2.5 max-w-4xl mx-auto">
          {displayChainStages.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = selectedChainIndex === idx;

            return (
              <React.Fragment key={stage.step}>
                <div
                  onClick={() => setSelectedChainIndex(idx)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 font-mono select-none ${
                    isSelected 
                      ? 'bg-gradient-to-r from-crimson-950/70 to-[#120B13] border-crimson-500 shadow-crimson-glow ring-1 ring-crimson-500/50' 
                      : 'bg-black/40 border-white/10 hover:border-white/20 hover:bg-white/5 opacity-80'
                  }`}
                >
                  <div className="flex items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected 
                          ? 'bg-crimson-600 border-crimson-400 text-white shadow-sm' 
                          : 'bg-black/60 border-slate-700 text-slate-400'
                      }`}>
                        0{stage.step}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs sm:text-sm font-black text-white tracking-wide">
                            {stage.title}
                          </h3>
                          <span className="text-[9px] font-bold px-2 py-0.2 rounded bg-crimson-950/80 border border-crimson-800 text-crimson-400 uppercase">
                            {stage.impactLevel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-sans mt-0.5 font-medium">
                          “{stage.summary}”
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-crimson-300 bg-crimson-950/80 px-2.5 py-1 rounded border border-crimson-700/50">
                        {stage.metric}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Telemetry Details */}
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-crimson-800/40 text-xs font-sans text-slate-300 space-y-1.5 animate-in fade-in duration-200">
                      <p className="leading-relaxed bg-black/40 p-2.5 rounded-lg border border-crimson-950">
                        {stage.detail}
                      </p>
                      <div className="flex items-center justify-between text-[11px] font-mono text-crimson-400 pt-0.5">
                        <span>{stage.telemetry}</span>
                        <span className="text-slate-400">Causality Weight: 98.2%</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Connecting Downward Illuminated Arrow */}
                {idx < displayChainStages.length - 1 && (
                  <div className="flex justify-center py-0.5">
                    <ArrowDown className="w-4 h-4 text-crimson-500 animate-bounce" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 4 — IMPACTED RESOURCES TABLE ── */}
      <div className="rounded-xl bg-[#0D121D] border border-white/10 p-5 shadow-command space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider">
              4. Impacted Resources Audit
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {apiAnalysisData?.affected_resources ? `${apiAnalysisData.affected_resources.length} DETECTED` : "5 CRITICAL ASSET VECTORS TRACKED"}
          </span>
        </div>

        {/* Real API Detected Affected Resources Banner */}
        {apiAnalysisData?.affected_resources && apiAnalysisData.affected_resources.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-crimson-950/40 border border-crimson-500/30 text-xs font-mono">
            <span className="text-crimson-300 font-bold">API AFFECTED RESOURCES:</span>
            {apiAnalysisData.affected_resources.map((resName, i) => (
              <span key={i} className="px-2.5 py-0.5 rounded bg-crimson-900/60 border border-crimson-500/40 text-crimson-200 font-semibold">
                ● {resName}
              </span>
            ))}
          </div>
        )}

        <div className="space-y-2.5">
          {impactedResources.map((res, idx) => {
            const Icon = res.icon;
            return (
              <div 
                key={idx}
                className="p-3.5 rounded-xl bg-black/40 border border-white/5 hover:border-white/15 transition-all text-xs font-mono grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
              >
                {/* Resource Name + Status */}
                <div className="md:col-span-3 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{res.name}</div>
                    <span className={`px-2 py-0.2 rounded text-[9px] font-bold uppercase border inline-block mt-0.5 ${res.statusColor}`}>
                      {res.status}
                    </span>
                  </div>
                </div>

                {/* Before vs After */}
                <div className="md:col-span-4 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-black/60 border border-white/5">
                    <span className="text-[9px] text-slate-500 uppercase block">BEFORE</span>
                    <span className="text-slate-300 font-sans">{res.before}</span>
                  </div>
                  <div className="p-2 rounded bg-crimson-950/30 border border-crimson-500/20">
                    <span className="text-[9px] text-crimson-400 uppercase block font-bold">AFTER</span>
                    <span className="text-crimson-200 font-sans">{res.after}</span>
                  </div>
                </div>

                {/* Impact Statement */}
                <div className="md:col-span-5 text-[11px] font-sans text-slate-400 bg-white/5 p-2 rounded-lg border border-white/5">
                  <span className="text-slate-500 font-mono text-[9px] uppercase block">CONSEQUENCE:</span>
                  <span className="text-slate-300">{res.impact}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 2-COLUMN SPLIT: AI EXPLANATION + RISK BREAKDOWN ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* ── SECTION 5 — AI EXPLANATION (7 COLS) ── */}
        <div className="lg:col-span-7 rounded-xl bg-[#0D121D] border border-cyan-500/30 p-5 shadow-command space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider">
                  5. AI Failure Explanation
                </h2>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-500/40">
                Confidence: 91%
              </span>
            </div>

            {/* Core Explanation Quote */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 font-sans">
              <p className="text-xs sm:text-sm text-cyan-100 italic leading-relaxed">
                “{apiAnalysisData?.operational_impact || "The stress test introduced a blocked primary route. The resulting detour increased travel time and resource consumption beyond the available safety margin. This caused a delay in medical response and reduced overall mission reliability."}”
              </p>
            </div>

            {/* Strategic Analysis Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans text-xs pt-3">
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                <span className="font-bold text-white font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-crimson-400" />
                  Route Fragility
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Single-corridor dependence meant any bridge closure triggered compound failure with no high-ground bypass.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                <span className="font-bold text-white font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Energy Tolerance
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  The baseline plan assumed calm terrain. Water current resistance surged battery consumption by 320%.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                <span className="font-bold text-white font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-crimson-400" />
                  Golden Hour Miss
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  A 25-minute detour breached the 45-minute stabilization margin for 18 critical casualties.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Causality Factor: Overpass Submersion (78.4% Weight)</span>
            <span className="text-cyan-400 font-bold">Synthesized by Neural Strategy Auditor</span>
          </div>
        </div>

        {/* ── SECTION 6 — RISK BREAKDOWN (5 COLS) ── */}
        <div className="lg:col-span-5 rounded-xl bg-[#0D121D] border border-white/10 p-5 shadow-command space-y-3.5 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-crimson-400" />
              <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                6. Risk Factor Breakdown
              </h2>
            </div>
            <span className="text-[10px] text-crimson-400 bg-crimson-950/60 px-2 py-0.5 rounded border border-crimson-500/30">
              AUDITED DELTA
            </span>
          </div>

          <div className="space-y-3">
            {riskBreakdown.map((r, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">{r.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[11px]">{r.before}% →</span>
                    <span className={`font-bold ${r.color}`}>{r.after}% ({r.delta})</span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-black/60 border border-white/10 ${r.color}`}>
                      {r.level}
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-black/70 overflow-hidden border border-white/5">
                  <div className={`h-full ${r.bar}`} style={{ width: `${r.after}%` }} />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-slate-500 font-sans pt-1">
            Risk scores exceed acceptable deployment thresholds. Plan authorization cannot proceed.
          </p>
        </div>

      </div>

      {/* ── SECTION 7 — RECOMMENDED ACTION (BOTTOM COMMAND BAR) ── */}
      <div className="rounded-xl bg-gradient-to-r from-[#1A0B0F] via-[#240C12] to-[#1A0B0F] border-2 border-crimson-500 p-5 shadow-crimson-glow flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-3 z-30 backdrop-blur-lg">
        
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-crimson-400 font-bold uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-crimson-500 animate-ping" />
            <span>7. RECOMMENDED ACTION</span>
          </div>
          <p className="text-sm font-bold text-white font-sans">
            “{apiAnalysisData?.recommendation || "Generate an alternative rescue plan using a safer route and updated resource allocation."}”
          </p>
          <p className="text-xs text-slate-300 font-sans">
            Bypasses Kathipara lowlands via the Elevated Coastal Corridor (ECR bypass) with pre-positioned battery trailers.
          </p>
        </div>

        {/* Action CTA Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end shrink-0">
          <button
            type="button"
            onClick={onBackToStressTest}
            className="px-4 py-2.5 rounded-xl bg-black/60 hover:bg-white/10 border border-white/15 text-slate-300 font-mono text-xs transition-colors"
          >
            Return to Stress Test
          </button>

          <button
            type="button"
            onClick={onNavigateToAlternative}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-crimson-600 via-crimson-700 to-crimson-800 hover:from-crimson-500 hover:via-crimson-600 hover:to-crimson-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-crimson-glow flex items-center gap-2 group active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>Generate Alternative Plan →</span>
          </button>
        </div>

      </div>

    </div>
  );
}
