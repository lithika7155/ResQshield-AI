import React, { useState, useRef } from 'react';
import { useMission } from '../context/MissionContext';
import { 
  Zap, 
  ShieldAlert, 
  BatteryWarning, 
  Radio, 
  AlertTriangle, 
  Compass, 
  ArrowRight, 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Flame, 
  Crosshair, 
  Layers, 
  Cpu, 
  Clock, 
  Truck, 
  Users, 
  Sliders, 
  CheckSquare, 
  Square,
  AlertOctagon,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Navigation,
  ArrowDown
} from 'lucide-react';

const WHAT_IF_SCENARIOS = [
  {
    id: 'route_blocked',
    name: 'ROUTE BLOCKED',
    icon: ShieldAlert,
    desc: 'Simulate a critical road becoming unavailable due to flood surge or debris.',
    severity: 'Critical',
    severityBadge: 'bg-crimson-950/80 border-crimson-500/80 text-crimson-300 shadow-crimson-glow',
    iconColor: 'text-crimson-400',
    iconBg: 'bg-crimson-950/60 border-crimson-800/50',
    impact: '+25 min detour, 1.8m water chokepoint'
  },
  {
    id: 'low_battery',
    name: 'LOW BATTERY',
    icon: BatteryWarning,
    desc: 'Simulate reduced vehicle/rescue equipment battery and energy depletion.',
    severity: 'High',
    severityBadge: 'bg-amber-950/80 border-amber-500/80 text-amber-300',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-950/60 border-amber-800/50',
    impact: 'Battery reserves collapse from 92% to 18%'
  },
  {
    id: 'signal_loss',
    name: 'SIGNAL LOSS',
    icon: Radio,
    desc: 'Simulate communication failure and RF blackout with ground rescue teams.',
    severity: 'Moderate',
    severityBadge: 'bg-blue-950/80 border-blue-500/80 text-blue-300',
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-950/60 border-cyan-800/50',
    impact: 'Telemetry latency +14s, GPS degradation'
  },
  {
    id: 'new_hazard',
    name: 'NEW HAZARD',
    icon: AlertTriangle,
    desc: 'Introduce a new hazard into the rescue zone such as downed high-voltage lines.',
    severity: 'High',
    severityBadge: 'bg-orange-950/80 border-orange-500/80 text-orange-300',
    iconColor: 'text-orange-400',
    iconBg: 'bg-orange-950/60 border-orange-800/50',
    impact: 'Zone 4 perimeter expanded by 1.8 km'
  },
  {
    id: 'survivor_error',
    name: 'SURVIVOR LOCATION ERROR',
    icon: Crosshair,
    desc: 'Simulate incorrect or outdated survivor coordinates due to evacuation shift.',
    severity: 'Moderate',
    severityBadge: 'bg-purple-950/80 border-purple-500/80 text-purple-300',
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-950/60 border-purple-800/50',
    impact: 'Search radius extended +600m perimeter'
  },
];

const SIMULATION_STEPS = [
  "Preparing simulation environment & Monte Carlo seeds...",
  "Applying disaster changes & hazard injection...",
  "Recalculating routes & elevation bypass vectors...",
  "Checking resource availability & thruster drain...",
  "Evaluating rescue feasibility & survival margins...",
  "Analysing failure propagation & compound collapse..."
];

const FAILURE_CHAIN = [
  {
    step: 1,
    title: "ROUTE BLOCKED",
    subtitle: "Primary Kathipara Overpass inundated under 1.8m surge waters",
    metric: "Passability: 0%",
    severity: "critical"
  },
  {
    step: 2,
    title: "DETOUR REQUIRED",
    subtitle: "UGV-01 and watercraft forced into unmapped 4.2 km muddy bypass",
    metric: "+4.2 km detour",
    severity: "high"
  },
  {
    step: 3,
    title: "TRAVEL TIME INCREASED",
    subtitle: "Extraction arrival delayed by +25 minutes beyond golden hour window",
    metric: "42 min → 67 min",
    severity: "high"
  },
  {
    step: 4,
    title: "BATTERY CONSUMPTION INCREASED",
    subtitle: "Deep mud thruster torque drains fleet reserves down to critical 4%",
    metric: "Reserve: 4%",
    severity: "critical"
  },
  {
    step: 5,
    title: "MEDICAL ARRIVAL DELAYED",
    subtitle: "18 critical casualties exceed hypothermia stabilization deadline",
    metric: "+22 min golden hour breach",
    severity: "critical"
  },
  {
    step: 6,
    title: "MISSION RISK INCREASED",
    subtitle: "Overall plan reliability collapses from 82% down to 54%",
    metric: "Risk: 91 / 100",
    severity: "critical"
  },
];

export default function StressTestPage({ 
  planData, 
  onNavigateToAlternative, 
  onNavigateToFailureAnalysis,
  onBack 
}) {
  const { apiPlanId, apiStressData, runStressTest, currentPlan } = useMission();

  // Baseline plan data - incorporates active plan from context when available
  const baseline = {
    planId: apiPlanId || planData?.planId || currentPlan?.id || "RP-2026-CHN-094",
    route: currentPlan?.name || "North Arterial via Kathipara High-Level Ramp (8.6 km)",
    estimatedTime: currentPlan?.metrics?.estimatedTime ? `${currentPlan.metrics.estimatedTime} min` : "42 min",
    riskScore: currentPlan?.metrics?.riskScore ?? 68,
    reliability: currentPlan?.metrics?.reliabilityScore ?? 82,
    rescueTeams: planData?.rescueTeams || currentPlan?.mission?.teamCapacity || "NDRF 04 Battalion (18 Specialists)",
    vehicles: planData?.vehicles || "2 Amphibious UGVs, 4 RIB Boats",
    survivorCount: planData?.estimatedCount ? `${planData.estimatedCount} Civilians` : (currentPlan?.mission?.survivorCount ? `${currentPlan.mission.survivorCount} Civilians` : "340 Civilians"),
    criticalPatients: planData?.criticalPatients || 18,
    status: "READY FOR SIMULATION"
  };

  // State: selected scenarios (allow multiple)
  const [selectedScenarios, setSelectedScenarios] = useState([
    'route_blocked',
    'low_battery',
    'new_hazard'
  ]);

  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);

  // Ref to scroll to results
  const resultsRef = useRef(null);

  // Computed API-driven metrics with graceful fallbacks
  const displayRiskOrig = apiStressData?.original_risk ?? baseline.riskScore;
  const displayRiskSim = apiStressData?.simulated_risk ?? 91;
  const displayRiskDelta = displayRiskSim - displayRiskOrig;

  const displayRelOrig = apiStressData?.original_reliability ?? baseline.reliability;
  const displayRelSim = apiStressData?.simulated_reliability ?? 54;
  const displayRelDelta = displayRelOrig - displayRelSim;

  const displayTimeOrig = apiStressData?.original_time ?? 42;
  const displayTimeSim = apiStressData?.simulated_time ?? 67;
  const displayTimeDelta = displayTimeSim - displayTimeOrig;

  const displayTestId = apiStressData?.stress_test_id || "ST-001";
  const displayFailureStatus = apiStressData?.status || "FAILED";

  const displayFailureChain = apiStressData?.failure_chain?.length
    ? apiStressData.failure_chain.map((item, idx) => {
        const fallback = FAILURE_CHAIN[idx] || {};
        return {
          step: idx + 1,
          title: typeof item === 'string' ? item.toUpperCase() : (item.title || fallback.title || `STAGE 0${idx+1}`),
          subtitle: fallback.subtitle || `Cascading impact stage ${idx + 1} observed during stress simulation`,
          metric: fallback.metric || (idx === 0 ? "Passability: 0%" : idx === apiStressData.failure_chain.length - 1 ? `Risk: ${displayRiskSim} / 100` : "Impact Detected"),
          severity: fallback.severity || "critical"
        };
      })
    : FAILURE_CHAIN;

  const displayResourceImpact = apiStressData?.resource_impact || 
    "Navigating the muddy bypass demanded maximum torque from UGV thrusters, leaving only 4% reserve.";

  const toggleScenario = (id) => {
    setSelectedScenarios(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // keep at least 1
        return prev.filter(s => s !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(0);
    setTestCompleted(false);

    // Call real FastAPI backend in background
    const apiCallPromise = runStressTest(selectedScenarios).catch(err => {
      console.warn('[ResQShield API] Stress test call warning:', err.message);
    });

    // Run through 6 steps
    const stepDelays = [400, 1100, 1800, 2500, 3200, 3900];
    stepDelays.forEach((delay, idx) => {
      setTimeout(() => {
        setSimulationStep(idx + 1);
      }, delay);
    });

    // Complete simulation after animations and API finish
    setTimeout(async () => {
      await apiCallPromise;
      setIsSimulating(false);
      setTestCompleted(true);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 4700);
  };

  const handleModifyScenarios = () => {
    setTestCompleted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto font-sans pb-16 text-slate-100">
      
      {/* ── WORKFLOW STAGES STEPPER ── */}
      <div className="rounded-xl bg-[#0D121D] border border-white/10 px-4 py-3 shadow-command flex items-center justify-between overflow-x-auto text-xs font-mono">
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button 
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
              ✓
            </div>
            <span>1. Create Plan</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

          <button 
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
              ✓
            </div>
            <span>2. Plan Analysis</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

          {/* ACTIVE STAGE */}
          <div className="flex items-center gap-1.5 text-crimson-300 font-bold bg-crimson-950/60 px-2.5 py-1 rounded-lg border border-crimson-500/40 shadow-crimson-glow">
            <div className="w-5 h-5 rounded-full bg-crimson-500 text-white flex items-center justify-center text-[10px] font-black">
              3
            </div>
            <span>3. Stress Testing (Active)</span>
          </div>

          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

          <button 
            onClick={onNavigateToAlternative}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-black/50 border border-slate-800 text-slate-600 flex items-center justify-center text-[10px]">
              4
            </div>
            <span>4. Alternative Plan</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

          <div className="flex items-center gap-1.5 text-slate-600">
            <div className="w-5 h-5 rounded-full bg-black/50 border border-slate-900 text-slate-700 flex items-center justify-center text-[10px]">
              5
            </div>
            <span>5. Human Approval</span>
          </div>
        </div>

        <button
          onClick={onBack}
          className="text-slate-400 hover:text-cyan-400 text-xs font-mono flex items-center gap-1 ml-4 transition-colors shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Analysis
        </button>
      </div>

      {/* ── PAGE HEADER ── */}
      <div className="rounded-xl bg-[#0D121D] border border-white/10 p-5 shadow-command">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-crimson-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                FAILURE SIMULATION & ROBUSTNESS AUDIT LAB
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400">
                PLAN: {baseline.planId}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                Rescue Plan Stress Test
              </h1>
              <span className="px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider bg-amber-950/80 border border-amber-500/50 text-amber-300 shadow-sm animate-pulse">
                ● {baseline.status}
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
              Test the rescue plan against possible disaster changes before execution.
            </p>
          </div>

          {/* Quick Info Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-slate-300">
              <span className="text-slate-500">ENGINE:</span> <strong className="text-cyan-400">Monte Carlo (10K Iterations)</strong>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-slate-300">
              <span className="text-slate-500">GATE:</span> <strong className="text-amber-400">Pre-Execution Mandatory</strong>
            </div>
          </div>

        </div>
      </div>

      {/* ── SECTION 1 — ORIGINAL PLAN SUMMARY ── */}
      <div className="rounded-xl bg-[#0D121D] border border-white/10 p-4 sm:p-5 shadow-command">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3.5">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider">
              1. Original Plan Dossier
            </h2>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-bold uppercase tracking-wider">
            BASELINE PLAN
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-black/40 border border-white/5 col-span-2 sm:col-span-4 lg:col-span-2">
            <span className="text-[9px] text-slate-500 uppercase block">CURRENT ROUTE</span>
            <strong className="text-white font-sans text-xs mt-0.5 truncate block" title={baseline.route}>
              {baseline.route}
            </strong>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <span className="text-[9px] text-slate-500 uppercase block">EST. TIME</span>
            <strong className="text-emerald-400 text-sm mt-0.5 block">{baseline.estimatedTime}</strong>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <span className="text-[9px] text-slate-500 uppercase block">RISK SCORE</span>
            <strong className="text-amber-400 text-sm mt-0.5 block">{baseline.riskScore} / 100</strong>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <span className="text-[9px] text-slate-500 uppercase block">RELIABILITY</span>
            <strong className="text-cyan-400 text-sm mt-0.5 block">{baseline.reliability}%</strong>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <span className="text-[9px] text-slate-500 uppercase block">RESCUE TEAMS</span>
            <strong className="text-slate-200 text-xs mt-0.5 truncate block" title={baseline.rescueTeams}>
              {baseline.rescueTeams.split('(')[0]}
            </strong>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-white/5">
            <span className="text-[9px] text-slate-500 uppercase block">SURVIVORS</span>
            <strong className="text-amber-300 text-sm mt-0.5 block">{baseline.survivorCount}</strong>
          </div>
        </div>
      </div>

      {/* ── SECTION 2 — WHAT-IF SCENARIOS ── */}
      <div className="rounded-xl bg-[#0D121D] border border-white/10 p-4 sm:p-5 shadow-command space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-crimson-400" />
              <h2 className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider">
                2. What-If Scenarios (Multi-Selectable)
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
              Select one or multiple failure vectors to stress-test simultaneously against the baseline plan.
            </p>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 font-bold self-start sm:self-auto">
            {selectedScenarios.length} SCENARIOS ARMED
          </span>
        </div>

        {/* 5 Scenario Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {WHAT_IF_SCENARIOS.map((scen) => {
            const Icon = scen.icon;
            const isSelected = selectedScenarios.includes(scen.id);

            return (
              <div
                key={scen.id}
                onClick={() => toggleScenario(scen.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between select-none relative group ${
                  isSelected 
                    ? 'bg-gradient-to-b from-[#140D15] to-[#0D121D] border-crimson-500/70 shadow-crimson-glow ring-1 ring-crimson-500/40' 
                    : 'bg-black/30 border-white/10 hover:border-white/20 hover:bg-white/5 opacity-70'
                }`}
              >
                <div>
                  {/* Top Bar: Icon + Checkbox + Severity */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${scen.iconBg} ${scen.iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${scen.severityBadge}`}>
                        {scen.severity}
                      </span>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-crimson-600 border-crimson-400 text-white' : 'border-slate-600 bg-black/40'
                      }`}>
                        {isSelected && <span className="text-[10px] font-bold">✓</span>}
                      </div>
                    </div>
                  </div>

                  {/* Scenario Name & Description */}
                  <h3 className="text-xs font-bold text-white font-mono tracking-wide mb-1">
                    {scen.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-sans leading-snug">
                    {scen.desc}
                  </p>
                </div>

                {/* Simulated Impact Tag */}
                <div className="mt-3 pt-2.5 border-t border-white/5 text-[10px] font-mono text-slate-400">
                  <span className="text-slate-500 block">IMPACT VECTOR:</span>
                  <span className={isSelected ? 'text-amber-300 font-semibold' : 'text-slate-500'}>
                    {scen.impact}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 3 — COMBINED STRESS TEST PANEL ── */}
      <div className="rounded-xl bg-gradient-to-r from-[#0D121D] via-[#160D18] to-[#0D121D] border border-crimson-500/50 p-5 shadow-command space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-crimson-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              COMPOUND MULTI-FAILURE ENGINE
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white font-mono">
              Combined Scenario Simulation
            </h2>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-mono text-slate-400">Testing Vector:</span>
              {selectedScenarios.map((id, index) => {
                const s = WHAT_IF_SCENARIOS.find(x => x.id === id);
                return (
                  <React.Fragment key={id}>
                    <span className="px-2.5 py-1 rounded-md bg-black/60 border border-crimson-500/40 text-xs font-mono text-crimson-300 font-bold">
                      {s?.name}
                    </span>
                    {index < selectedScenarios.length - 1 && (
                      <span className="text-amber-400 font-black font-mono text-sm">+</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Primary CTA Button */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-crimson-600 via-crimson-700 to-crimson-800 hover:from-crimson-500 hover:via-crimson-600 hover:to-crimson-700 text-white font-mono font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-crimson-glow flex items-center justify-center gap-3 group active:scale-95 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
              <span>Run Combined Stress Test</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </div>

      {/* ── SIMULATION LOADING MODAL ── */}
      {isSimulating && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#0D121D] border border-crimson-600/60 shadow-2xl p-6 space-y-6 font-mono relative overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-crimson-500/20 border border-crimson-500/50 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-amber-300 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    STRESS INJECTION IN PROGRESS
                  </h3>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Testing {selectedScenarios.length} compound failures against Plan {baseline.planId}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-crimson-400 bg-crimson-950/80 px-2.5 py-1 rounded border border-crimson-500/40">
                ACTIVE
              </span>
            </div>

            {/* Step list */}
            <div className="space-y-2.5">
              {SIMULATION_STEPS.map((stepText, idx) => {
                const stepNum = idx + 1;
                const isCompleted = simulationStep > stepNum;
                const isCurrent = simulationStep === stepNum;

                return (
                  <div 
                    key={idx}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                      isCurrent 
                        ? 'bg-crimson-950/40 border-crimson-500/50 shadow-sm text-white' 
                        : isCompleted 
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
                        : 'bg-black/20 border-white/5 text-slate-600'
                    }`}
                  >
                    <div className="shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <RefreshCw className="w-4 h-4 text-crimson-400 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px]">
                          {stepNum}
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-sans truncate">{stepText}</span>
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-sans">Simulation Convergence</span>
                <span className="text-crimson-400 font-bold">{Math.round((simulationStep / 6) * 100)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/70 overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 via-crimson-500 to-crimson-600 transition-all duration-300" 
                  style={{ width: `${(simulationStep / 6) * 100}%` }}
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── SECTIONS 4, 5, 6, 7, 8: POST-SIMULATION DIAGNOSTICS & RESULTS ── */}
      {testCompleted && (
        <div ref={resultsRef} className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-500">
          
          {/* ── SECTION 5 — TEST RESULT BANNER ── */}
          <div className="rounded-xl bg-gradient-to-r from-[#1E0B0F] via-[#2A0E13] to-[#1E0B0F] border-2 border-crimson-600 p-5 shadow-crimson-glow relative overflow-hidden">
            
            {/* Ambient Red Glow */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-crimson-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 relative z-10">
              
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-crimson-600/20 border-2 border-crimson-500 flex items-center justify-center shrink-0 shadow-crimson-glow animate-pulse">
                  <XCircle className="w-8 h-8 text-crimson-400" />
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-crimson-400 font-bold uppercase tracking-wider mb-1">
                    <span>STRESS TEST RESULT (#{displayTestId})</span>
                    <span className="text-slate-600">•</span>
                    <span>{displayFailureStatus}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight text-crimson-200">
                    PLAN FAILED UNDER SIMULATION
                  </h2>
                  <p className="text-xs text-slate-300 font-sans mt-0.5">
                    Critical route failure and energy exhaustion render this rescue plan unviable in the field.
                  </p>
                </div>
              </div>

              {/* 3 Core Deterioration Metrics */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4 font-mono text-center">
                {/* Risk Delta */}
                <div className="p-3 rounded-xl bg-black/60 border border-crimson-500/40 shadow-sm">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Risk Score</div>
                  <div className="text-lg sm:text-2xl font-black text-crimson-400 flex items-center justify-center gap-1">
                    <span className="text-slate-400 text-sm font-normal line-through">{displayRiskOrig}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-crimson-400" />
                    <span>{displayRiskSim}</span>
                  </div>
                  <div className="text-[9px] text-crimson-300 font-bold mt-0.5">+{displayRiskDelta} pts (Critical)</div>
                </div>

                {/* Reliability Delta */}
                <div className="p-3 rounded-xl bg-black/60 border border-crimson-500/40 shadow-sm">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Reliability</div>
                  <div className="text-lg sm:text-2xl font-black text-amber-400 flex items-center justify-center gap-1">
                    <span className="text-slate-400 text-sm font-normal line-through">{displayRelOrig}%</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                    <span>{displayRelSim}%</span>
                  </div>
                  <div className="text-[9px] text-amber-300 font-bold mt-0.5">-{displayRelDelta}% Collapse</div>
                </div>

                {/* Time Delta */}
                <div className="p-3 rounded-xl bg-black/60 border border-crimson-500/40 shadow-sm">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Est. Time</div>
                  <div className="text-lg sm:text-2xl font-black text-crimson-400 flex items-center justify-center gap-1">
                    <span className="text-slate-400 text-sm font-normal line-through">{displayTimeOrig}m</span>
                    <ArrowRight className="w-3.5 h-3.5 text-crimson-400" />
                    <span>{displayTimeSim}m</span>
                  </div>
                  <div className="text-[9px] text-crimson-300 font-bold mt-0.5">+{displayTimeDelta} min Delay</div>
                </div>
              </div>

            </div>

          </div>

          {/* ── SECTION 4 — LIVE SIMULATION (ORIGINAL VS SIMULATED ROUTE) ── */}
          <div className="rounded-xl bg-[#0D121D] border border-white/10 p-4 sm:p-5 shadow-command space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider">
                    4. Live Simulation: Original Route vs. Simulated Detour
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Visual comparison showing the Kathipara road blockage and forced unmapped detour.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Original Route (8.6 km)
                </span>
                <span className="flex items-center gap-1.5 text-crimson-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-crimson-500" /> Simulated Detour (12.8 km)
                </span>
              </div>
            </div>

            {/* Route Comparison SVG */}
            <div className="relative w-full h-72 sm:h-80 rounded-xl overflow-hidden border border-white/10 bg-[#06080E] flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 600 320" preserveAspectRatio="none">
                <defs>
                  <pattern id="stressMapGrid" width="25" height="25" patternUnits="userSpaceOnUse">
                    <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#1E293B" strokeWidth="0.5" opacity="0.3" />
                  </pattern>
                </defs>
                <rect width="600" height="320" fill="url(#stressMapGrid)" />

                {/* Inundation Flood Zone */}
                <path d="M 160,80 Q 280,120 340,180 T 520,280 L 460,320 L 100,320 Z" fill="#0C4A6E" opacity="0.25" />

                {/* ORIGINAL ROUTE (Faded / Blocked Vector) */}
                <path 
                  d="M 60,80 L 140,90 L 220,110 L 280,130 L 360,170 L 440,220" 
                  fill="none" 
                  stroke="#06B6D4" 
                  strokeWidth="2.5" 
                  strokeDasharray="4 4"
                  opacity="0.4"
                />

                {/* BLOCKADE AT KATHIPARA RAMP */}
                <circle cx="280" cy="130" r="18" fill="#DC2626" fillOpacity="0.2" stroke="#DC2626" strokeWidth="1.5" />
                <circle cx="280" cy="130" r="8" fill="#7F1D1D" stroke="#EF4444" strokeWidth="1.5" />
                <text x="276" y="134" fill="#FFFFFF" fontSize="10" fontWeight="bold">✕</text>
                <text x="225" y="105" fill="#F87171" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  ROAD BLOCKED (1.8m SURGE)
                </text>

                {/* SIMULATED FORCED DETOUR (Bright Crimson Dashed Path) */}
                <path 
                  d="M 220,110 L 210,180 L 250,240 L 340,260 L 400,245 L 440,220" 
                  fill="none" 
                  stroke="#EF4444" 
                  strokeWidth="3.5" 
                  strokeDasharray="6 3"
                />

                {/* Staging Base */}
                <circle cx="60" cy="80" r="8" fill="#065F46" stroke="#10B981" strokeWidth="2" />
                <text x="75" y="85" fill="#34D399" fontSize="10" fontFamily="monospace" fontWeight="bold">Base Alpha</text>

                {/* Survivor Target */}
                <circle cx="440" cy="220" r="9" fill="#B45309" stroke="#F59E0B" strokeWidth="2" />
                <text x="390" y="240" fill="#FCD34D" fontSize="10" fontFamily="monospace" fontWeight="bold">Survivors (340)</text>

                {/* Detour Annotation */}
                <text x="260" y="280" fill="#FCA5A5" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  FORCED LOWLAND DETOUR (+4.2 km in heavy mud)
                </text>
              </svg>

              {/* Status pill on map */}
              <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/80 border border-crimson-500/50 text-[11px] font-mono text-crimson-300 backdrop-blur-md flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-crimson-400" />
                <span>Primary Route Severed • Egress Compromised</span>
              </div>
            </div>

            {/* 5 Live Simulation Indicator Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs font-mono pt-1">
              
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 block">TRAVEL TIME</span>
                <div className="text-crimson-400 font-bold text-sm">+{displayTimeDelta} min ({displayTimeSim}m total)</div>
                <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-crimson-500" style={{ width: '92%' }} />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 block">RISK EXPONENTIAL</span>
                <div className="text-crimson-400 font-bold text-sm">{displayRiskSim} / 100</div>
                <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-crimson-500" style={{ width: `${Math.min(displayRiskSim, 100)}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 block">RELIABILITY DROP</span>
                <div className="text-amber-400 font-bold text-sm">{displayRelSim}% (-{displayRelDelta}%)</div>
                <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${Math.min(displayRelSim, 100)}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 block">RESOURCE USAGE</span>
                <div className="text-crimson-400 font-bold text-sm">96% (Over capacity)</div>
                <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-crimson-500" style={{ width: '96%' }} />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 block">HAZARD EXPOSURE</span>
                <div className="text-crimson-400 font-bold text-sm">CRITICAL (3.4 m/s)</div>
                <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-crimson-600" style={{ width: '98%' }} />
                </div>
              </div>

            </div>

          </div>

          {/* ── SECTION 6 — FAILURE CHAIN DETECTED ── */}
          <div className="rounded-xl bg-[#0D121D] border border-crimson-500/40 p-5 shadow-command space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-crimson-400" />
                <h3 className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider">
                  6. Cascading Failure Chain Detected
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-crimson-950/80 border border-crimson-500/40 text-crimson-300">
                {displayFailureChain.length} PROPAGATION STAGES
              </span>
            </div>

            {/* Vertical Flow Diagram with Connecting Arrows */}
            <div className="space-y-2 max-w-4xl mx-auto">
              {displayFailureChain.map((item, idx) => (
                <React.Fragment key={item.step}>
                  <div className="p-3 rounded-xl bg-black/50 border border-crimson-500/30 flex items-center justify-between gap-4 font-mono shadow-sm hover:border-crimson-500/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-crimson-950/80 border border-crimson-500/60 flex items-center justify-center font-bold text-xs text-crimson-400 shrink-0">
                        0{item.step}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
                          <span>{item.title}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded uppercase bg-crimson-950 text-crimson-400 border border-crimson-800">
                            {item.severity}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-crimson-400 bg-crimson-950/60 px-2.5 py-1 rounded border border-crimson-800/40">
                        {item.metric}
                      </span>
                    </div>
                  </div>

                  {idx < displayFailureChain.length - 1 && (
                    <div className="flex justify-center py-0.5">
                      <ArrowDown className="w-4 h-4 text-crimson-500 animate-bounce" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

          </div>

          {/* ── SECTION 7 — AI EXPLANATION ("Why did the plan fail?") ── */}
          <div className="rounded-xl bg-[#0D121D] border border-white/10 p-5 shadow-command space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  7. AI Explanation: Why Did The Plan Fail?
                </h3>
              </div>
              <span className="text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                ROOT-CAUSE ANALYSIS
              </span>
            </div>

            {/* Core Explanation Quote */}
            <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/30">
              <p className="text-xs sm:text-sm text-amber-100 font-sans italic leading-relaxed">
                “The primary route became unavailable during simulation. The resulting detour increased travel time and battery consumption beyond the available resource margin, causing the medical response to become delayed.”
              </p>
            </div>

            {/* Technical Root-Cause Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans text-xs">
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                <span className="font-bold text-white font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-crimson-500" />
                  No Secondary Overpass
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Kathipara Ramp served as a single point of failure with zero topological elevation redundancy.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                <span className="font-bold text-white font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Resource Margin Depleted
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {displayResourceImpact}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                <span className="font-bold text-white font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-crimson-500" />
                  Golden Hour Breach
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Total extraction time exceeded safe limits by +22 minutes, risking survivability for 18 critical casualties.
                </p>
              </div>
            </div>
          </div>

          {/* ── SECTION 8 — NEXT ACTION (BOTTOM COMMAND BAR) ── */}
          <div className="rounded-xl bg-gradient-to-r from-[#1A0B0F] via-[#240C12] to-[#1A0B0F] border-2 border-crimson-500 p-4 shadow-crimson-glow flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-3 z-30 backdrop-blur-lg">
            
            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="w-3 h-3 rounded-full bg-crimson-500 animate-ping shrink-0" />
              <div>
                <div className="text-white font-bold tracking-wide">
                  RECOMMENDED ACTION: SYNTHESIZE ALTERNATIVE CORRIDOR
                </div>
                <div className="text-[11px] text-slate-400 font-sans">
                  Current plan cannot be authorized. An alternative high-ground bypass is required.
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
              {/* Secondary Action */}
              <button
                type="button"
                onClick={handleModifyScenarios}
                className="px-3.5 py-2.5 rounded-xl bg-black/60 hover:bg-white/10 border border-white/15 text-slate-300 font-mono text-xs transition-colors"
              >
                Modify Scenarios
              </button>

              {/* Failure Analysis Button */}
              <button
                type="button"
                onClick={onNavigateToFailureAnalysis}
                className="px-4 py-2.5 rounded-xl bg-crimson-950/80 hover:bg-crimson-900/80 border border-crimson-500/50 text-crimson-300 font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
              >
                <AlertOctagon className="w-3.5 h-3.5 text-crimson-400" />
                <span>Failure Analysis →</span>
              </button>

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={onNavigateToAlternative}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-crimson-600 via-crimson-700 to-crimson-800 hover:from-crimson-500 hover:via-crimson-600 hover:to-crimson-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-crimson-glow flex items-center gap-2 group active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>Alternative Plan →</span>
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
