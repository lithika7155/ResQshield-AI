import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  AlertOctagon, 
  Activity, 
  GitFork, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw,
  Navigation,
  Layers,
  Sparkles
} from 'lucide-react';
import WorkflowStepper from '../components/common/WorkflowStepper';
import MetricCard from '../components/common/MetricCard';
import FailureChainVisualizer from '../components/common/FailureChainVisualizer';
import RouteVisualizer from '../components/common/RouteVisualizer';
import { useMission } from '../context/MissionContext';
import { stressScenarios } from '../data/scenarios';

export default function StressTestResultPage() {
  const navigate = useNavigate();
  const { currentPlan, stressResult, generateAlternative, isSimulating } = useMission();

  // Fallback to default route blocked result if none executed in this session
  const defaultScenario = stressScenarios[0];
  const activeResult = stressResult || {
    status: "FAILED UNDER SIMULATION",
    riskLevel: "HIGH",
    riskScore: 88,
    reliabilityScore: 42,
    robustnessScore: 38,
    timeDelayMinutes: 19,
    failureDetected: "Primary rescue route becomes inaccessible after simulated road blockage at Flooded Overpass Sector B.",
    failureChain: defaultScenario.failureChain,
    recommendedAction: "Recalculate the route using the Eastern Access Corridor via Ridge Causeway."
  };

  const handleGenerateAlternative = async () => {
    await generateAlternative();
    navigate('/alternative-plan');
  };

  return (
    <div className="min-h-screen bg-[#080A0F] text-slate-100 font-sans pb-16">
      <WorkflowStepper />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* HEADER & CRITICAL FAILURE BANNER */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-crimson-950/70 via-[#150a0f] to-[#0d121d] border border-crimson-600/50 shadow-crimson-glow font-mono">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-crimson-400 font-bold uppercase tracking-wider mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-crimson-500 animate-ping" />
                <span>MONTE CARLO DISASTER STRESS TEST COMPLETE</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                STRESS TEST RESULT:{" "}
                <span className="text-crimson-500 underline decoration-crimson-600">
                  {activeResult.status}
                </span>
              </h1>
              
              <p className="text-xs sm:text-sm text-slate-300 font-sans mt-2 max-w-2xl">
                Plan #{currentPlan.id} was subjected to simulated disaster perturbations. 
                The primary vector fails to maintain minimum survival margins.
              </p>
            </div>

            {/* Top CTA to Alternative */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/stress-test')}
                className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-run Simulation</span>
              </button>

              <button
                onClick={handleGenerateAlternative}
                disabled={isSimulating}
                className="px-6 py-3 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-crimson-glow flex items-center gap-2"
              >
                <GitFork className="w-4 h-4" />
                <span>GENERATE ALTERNATIVE PLAN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 SIMULATION IMPACT METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
          
          <MetricCard
            label="Plan Status"
            value="FAILED"
            variant="crimson"
            icon={AlertOctagon}
            delta="UNSAFE"
            subtext="Primary corridor breached under simulated hydro pressure."
          />

          <MetricCard
            label="Simulated Risk"
            value={activeResult.riskScore}
            unit="/100"
            variant="crimson"
            icon={ShieldAlert}
            progress={activeResult.riskScore}
            delta="+20 SURGE"
            subtext="Risk surges from 68 to 88 due to forced detour."
          />

          <MetricCard
            label="Reliability"
            value={`${activeResult.reliabilityScore}%`}
            variant="crimson"
            icon={Activity}
            progress={activeResult.reliabilityScore}
            delta="-36% LOSS"
            subtext="Baseline was 78%. Plunged under perturbation."
          />

          <MetricCard
            label="Robustness Index"
            value={`${activeResult.robustnessScore}%`}
            variant="amber"
            icon={Clock}
            progress={activeResult.robustnessScore}
            subtext="Inability to withstand unexpected corridor loss."
          />

        </div>

        {/* FAILURE DETECTED SECTION */}
        <div className="p-6 rounded-xl bg-[#0F1420] border-l-4 border-crimson-500 border-y border-r border-white/10 shadow-command font-mono">
          <div className="flex items-center gap-2 text-xs text-crimson-400 font-bold uppercase tracking-wider mb-2">
            <AlertOctagon className="w-4 h-4" />
            <span>PRIMARY FAILURE DETECTED</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            “{activeResult.failureDetected}”
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-2 leading-relaxed">
            The autonomous UGV and support watercraft cannot navigate the 1.8-meter submerged rubble at Overpass Sector B. 
            Attempting this crossing risks vehicle rollover and complete electrical failure.
          </p>
        </div>

        {/* CASCADING FAILURE CHAIN & VECTOR VISUALIZER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Failure Chain Visual Flow */}
          <div className="lg:col-span-6">
            <FailureChainVisualizer 
              chain={activeResult.failureChain} 
              summary="Overpass Sector B structural failure & current velocity surge"
            />
          </div>

          {/* Right Column: Route Map showing Blockage */}
          <div className="lg:col-span-6 space-y-6">
            <RouteVisualizer
              mode="blocked"
              title="FAILED VECTOR INSPECTION (OBSTRUCTION POINT)"
              interactive={true}
            />

            {/* RECOMMENDED ACTION CARD */}
            <div className="p-6 rounded-xl bg-gradient-to-r from-cyan-950/40 via-[#0e1624] to-[#0a111a] border border-cyan-500/40 shadow-cyan-glow font-mono">
              <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>RECOMMENDED ACTION</span>
              </div>
              
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                “{activeResult.recommendedAction}”
              </h3>

              <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
                The Eastern Access Corridor utilizes an elevated railway embankment (18m above water crest), 
                bypassing all submerged live grid zones and reducing projected transit time by 11 minutes.
              </p>

              <div className="mt-5 pt-4 border-t border-cyan-800/30 flex flex-wrap items-center justify-between gap-4">
                <div className="text-[11px] text-cyan-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Alternative route verified passable via UAV-12 IR</span>
                </div>

                <button
                  onClick={handleGenerateAlternative}
                  disabled={isSimulating}
                  className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
                >
                  <span>GENERATE ALTERNATIVE PLAN</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
