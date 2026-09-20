import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Activity, 
  Layers, 
  Compass, 
  AlertTriangle,
  PlayCircle,
  Database,
  Radio
} from 'lucide-react';
import RouteVisualizer from '../components/common/RouteVisualizer';
import { presetMissions } from '../data/plans';
import { useMission } from '../context/MissionContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { currentPlan, loadPresetMission } = useMission();

  return (
    <div className="relative min-h-screen bg-[#080A0F] text-slate-100 font-sans pb-16">
      
      {/* Background radial ambient lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-crimson-vignette pointer-events-none" />
      <div className="absolute top-36 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14">
        
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Hero Copy & Actions */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Small Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson-950/80 border border-crimson-600/40 text-crimson-400 font-mono text-xs tracking-wider uppercase shadow-crimson-glow">
              <span className="w-2 h-2 rounded-full bg-crimson-500 animate-ping" />
              AI-POWERED DISASTER RESPONSE
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
              “Before a rescue plan is executed,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-crimson-400 via-amber-400 to-white">
                test whether it can survive
              </span>{" "}
              the disaster.”
            </h1>

            {/* Supporting Text */}
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-sans max-w-xl">
              RescuePlan AI stress-tests rescue strategies against changing disaster conditions, 
              identifies failure points, and generates safer alternatives before deployment.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate('/create-plan')}
                className="px-6 py-3 rounded-lg bg-crimson-600 hover:bg-crimson-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-crimson-glow flex items-center gap-2 group"
              >
                <span>Create Rescue Plan</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/stress-test')}
                className="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 font-mono font-semibold text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Run Stress Test</span>
              </button>
            </div>

            {/* Live Operational Ticker */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>ACTIVE FLEET: <strong className="text-white">19 UNITS</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>SIMULATION CLUSTER: <strong className="text-cyan-300">ONLINE</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>ALERT LEVEL: <strong className="text-amber-300">SURGE ELEVATED</strong></span>
              </div>
            </div>
          </div>

          {/* Right Column: Sophisticated Tactical Vector Route Visual */}
          <div className="lg:col-span-6">
            <RouteVisualizer 
              mode="standard" 
              title="Tactical Evacuation Trajectory (Simulated)" 
              interactive={true} 
            />
          </div>
        </div>

        {/* 3 MAJOR CAPABILITIES PILLARS */}
        <div className="mt-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase">
              MISSION LIFECYCLE ASSURANCE
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">
              End-to-End Tactical Resilience Pipeline
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Capability 1: PLAN */}
            <div className="p-6 rounded-xl bg-[#0C111C] border border-white/10 hover:border-cyan-500/40 transition-all duration-300 shadow-command group relative overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400 font-semibold uppercase">
                <span>STAGE 01</span>
                <span>•</span>
                <span>SYNTHESIS</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1 mb-2 font-mono">
                PLAN
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                Generate a structured rescue strategy based on real-time environmental hazards, fleet payloads, battery envelopes, and survivor telemetry.
              </p>
              <button 
                onClick={() => navigate('/create-plan')}
                className="text-xs font-mono text-cyan-300 hover:text-cyan-200 flex items-center gap-1 group-hover:underline"
              >
                <span>Initialize new plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Capability 2: STRESS TEST */}
            <div className="p-6 rounded-xl bg-[#0C111C] border border-crimson-900/30 hover:border-crimson-600/50 transition-all duration-300 shadow-command group relative overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-crimson-950/60 border border-crimson-800/40 flex items-center justify-center text-crimson-400 mb-4 group-hover:scale-110 transition-transform shadow-crimson-glow">
                <Zap className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-crimson-400 font-semibold uppercase">
                <span>STAGE 02</span>
                <span>•</span>
                <span>SIMULATION</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1 mb-2 font-mono">
                STRESS TEST
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                Simulate changing disaster conditions: sudden road collapses, communication dropouts, battery drops, and compound multi-failure cascades.
              </p>
              <button 
                onClick={() => navigate('/stress-test')}
                className="text-xs font-mono text-crimson-400 hover:text-crimson-300 flex items-center gap-1 group-hover:underline"
              >
                <span>Launch simulation lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Capability 3: VERIFY */}
            <div className="p-6 rounded-xl bg-[#0C111C] border border-emerald-900/30 hover:border-emerald-600/50 transition-all duration-300 shadow-command group relative overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform shadow-emerald-glow">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 font-semibold uppercase">
                <span>STAGE 03</span>
                <span>•</span>
                <span>HUMAN AUTHORIZATION</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1 mb-2 font-mono">
                VERIFY
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                Analyze failure risk, inspect AI-generated bypass alternatives, and require mandatory human operator sign-off before field deployment.
              </p>
              <button 
                onClick={() => navigate('/approval')}
                className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group-hover:underline"
              >
                <span>Review verification gate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

        {/* QUICK MISSION SELECTOR DECK */}
        <div className="mt-16 p-6 rounded-xl bg-[#0B0F17] border border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">PRE-LOADED DISASTER SCENARIOS</span>
              <h3 className="text-base font-bold text-white font-mono">Active Command Theater Plans</h3>
            </div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View Full Operations Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {presetMissions.map((mission) => (
              <div
                key={mission.id}
                onClick={() => {
                  loadPresetMission(mission.id);
                  navigate('/analysis');
                }}
                className="p-3.5 rounded-lg bg-white/5 border border-white/5 hover:border-cyan-500/40 hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-cyan-400 font-bold">#{mission.id}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-slate-300">
                    {mission.type}
                  </span>
                </div>
                <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {mission.name}
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Survivors: <strong className="text-slate-200">{mission.survivors}</strong></span>
                  <span>Risk: <strong className="text-amber-400">{mission.risk}/100</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
