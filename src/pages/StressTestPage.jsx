import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  ShieldAlert, 
  BatteryWarning, 
  Radio, 
  Flame, 
  Compass, 
  AlertTriangle, 
  Layers, 
  CheckSquare, 
  Square, 
  Activity, 
  ArrowRight,
  FlameKindling,
  Cpu
} from 'lucide-react';
import WorkflowStepper from '../components/common/WorkflowStepper';
import { stressScenarios } from '../data/scenarios';
import { useMission } from '../context/MissionContext';

export default function StressTestPage() {
  const navigate = useNavigate();
  const { currentPlan, runStressTest, isSimulating } = useMission();

  // Selected scenarios for multi-failure testing
  const [selectedScenarios, setSelectedScenarios] = useState([
    "route_blocked",
    "signal_loss",
    "new_hazard"
  ]);

  const toggleScenarioSelection = (id) => {
    setSelectedScenarios(prev => {
      if (prev.includes(id)) {
        // Keep at least one selected
        if (prev.length === 1) return prev;
        return prev.filter(x => x !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSingleScenarioTest = async (scenarioId) => {
    await runStressTest([scenarioId]);
    navigate('/stress-test/result');
  };

  const handleMultiScenarioTest = async () => {
    await runStressTest(selectedScenarios);
    navigate('/stress-test/result');
  };

  const getScenarioIcon = (iconName) => {
    switch (iconName) {
      case 'BatteryWarning': return BatteryWarning;
      case 'RadioOff': return Radio;
      case 'ZapOff': return Flame;
      case 'Compass': return Compass;
      default: return ShieldAlert;
    }
  };

  // Calculate dynamic compound risk estimate based on selected count
  const compoundRisk = Math.min(98, 65 + (selectedScenarios.length * 11));
  const compoundReliability = Math.max(14, 52 - (selectedScenarios.length * 12));

  return (
    <div className="min-h-screen bg-[#080A0F] text-slate-100 font-sans pb-16">
      <WorkflowStepper />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-crimson-400 uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>CORE TACTICAL STRESS SIMULATOR</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
              Rescue Plan Stress Test
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
              Simulate conditions that could cause the current rescue plan (#{currentPlan.id}) to fail.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-slate-400">PLAN:</span>
            <span className="px-2 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-bold">
              #{currentPlan.id}
            </span>
            <span className="px-2 py-1 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300">
              UNTESTED
            </span>
          </div>
        </div>

        {/* PROMINENT MULTI-FAILURE SIMULATION CONSOLE (USER HIGHLIGHTED REQUIREMENT) */}
        <div className="relative rounded-2xl bg-gradient-to-b from-[#190c12] via-[#120f18] to-[#0d121d] border-2 border-crimson-600/60 p-6 sm:p-8 shadow-2xl overflow-hidden font-mono">
          
          {/* Crimson ambient glow in corner */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-crimson-600/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-crimson-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-crimson-600 text-white flex items-center justify-center shadow-crimson-glow">
                  <Zap className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-crimson-400 tracking-widest uppercase">
                      FEATURED SIMULATION ENGINE
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-crimson-900/60 text-crimson-200 border border-crimson-500/50 uppercase">
                      HIGH-IMPACT
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                    MULTI-FAILURE SIMULATION
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Selected Failure Vectors</span>
                  <strong className="text-crimson-300 text-sm">{selectedScenarios.length} Scenarios Armored</strong>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-sans mt-3 max-w-3xl leading-relaxed">
              Disasters rarely fail in isolation. Test how compounding secondary hazards (such as an overpass collapse 
              coinciding with radio loss and submerged electrical leaks) trigger cascading failures across autonomous rescue fleets.
            </p>

            {/* Checkbox Scenario Selector Matrix */}
            <div className="mt-6">
              <span className="text-xs text-slate-400 uppercase tracking-wider block mb-3 font-semibold">
                Toggle Compound Failure Vectors:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {stressScenarios.map((scen) => {
                  const isChecked = selectedScenarios.includes(scen.id);
                  return (
                    <div
                      key={scen.id}
                      onClick={() => toggleScenarioSelection(scen.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 flex items-center justify-between gap-3 ${
                        isChecked 
                          ? 'bg-crimson-950/70 border-crimson-500 text-white shadow-crimson-glow' 
                          : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-crimson-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <div className="truncate">
                          <span className="text-xs font-bold block truncate">{scen.title}</span>
                          <span className="text-[10px] text-slate-400 block truncate">{scen.category}</span>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-crimson-400 shrink-0">
                        {scen.estimatedTimeDelay}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Projected Compound Metrics & Main Trigger Button */}
            <div className="mt-6 pt-5 border-t border-crimson-900/40 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Simulated Compound Risk</span>
                  <div className="text-2xl font-bold text-crimson-400">
                    {compoundRisk}<span className="text-xs text-slate-400">/100</span>
                  </div>
                </div>

                <div className="h-8 w-px bg-white/10" />

                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Projected Reliability</span>
                  <div className="text-2xl font-bold text-amber-400">
                    {compoundReliability}%
                  </div>
                </div>

                <div className="h-8 w-px bg-white/10 hidden sm:block" />

                <div className="hidden sm:block">
                  <span className="text-[10px] text-slate-400 uppercase">Cascade Outcome</span>
                  <div className="text-xs font-bold text-crimson-300 mt-1">
                    MULTIPLE CRITICAL FAILURES EXPECTED
                  </div>
                </div>
              </div>

              <button
                onClick={handleMultiScenarioTest}
                disabled={isSimulating || selectedScenarios.length === 0}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-mono font-bold text-sm uppercase tracking-wider transition-all duration-200 shadow-crimson-glow flex items-center justify-center gap-3 disabled:opacity-50 group"
              >
                <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>RUN COMBINED STRESS TEST</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </div>

        {/* INDIVIDUAL SCENARIO CARDS SECTION */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                INDIVIDUAL PERTURBATION VECTORS
              </span>
              <h2 className="text-xl font-bold text-white font-mono mt-0.5">
                Isolated Scenario Stress Tests
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              5 Independent Failure Modes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
            {stressScenarios.map((scenario) => {
              const Icon = getScenarioIcon(scenario.icon);

              return (
                <div
                  key={scenario.id}
                  className="rounded-xl bg-[#0D121D] border border-white/10 hover:border-crimson-600/40 p-6 flex flex-col justify-between transition-all duration-300 shadow-command group relative overflow-hidden"
                >
                  <div>
                    {/* Top row: Code and Category */}
                    <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-crimson-500" />
                        <span className="text-slate-400 font-bold">{scenario.code}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 uppercase">
                        {scenario.category}
                      </span>
                    </div>

                    {/* Title and Icon */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-crimson-950/60 border border-crimson-800/40 flex items-center justify-center text-crimson-400 shrink-0 group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white tracking-tight uppercase leading-snug">
                          {scenario.title}
                        </h3>
                        <span className="text-[11px] text-amber-400 font-semibold">
                          Probability: {scenario.probability}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">
                      {scenario.description}
                    </p>

                    {/* Simulation Parameters Snippet */}
                    <div className="p-3 rounded bg-black/40 border border-white/5 text-[11px] space-y-1.5 mb-5">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">DELAY IMPACT:</span>
                        <span className="text-crimson-400 font-bold">{scenario.estimatedTimeDelay}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">BATTERY PENALTY:</span>
                        <span className="text-amber-400 font-bold">{scenario.batteryPenalty}</span>
                      </div>
                      <div className="text-slate-400 text-[10px] pt-1 border-t border-white/5 truncate">
                        {scenario.stressParameter}
                      </div>
                    </div>
                  </div>

                  {/* Individual Test Button */}
                  <button
                    onClick={() => handleSingleScenarioTest(scenario.id)}
                    disabled={isSimulating}
                    className="w-full py-2.5 px-3 rounded-lg bg-white/5 hover:bg-crimson-950/60 hover:border-crimson-600 border border-white/10 text-slate-200 hover:text-crimson-300 font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                  >
                    <Zap className="w-3.5 h-3.5 text-crimson-400 group-hover/btn:scale-110 transition-transform" />
                    <span>TEST SCENARIO</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
