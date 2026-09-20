import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Activity, 
  Clock, 
  MapPin, 
  Zap, 
  Battery, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Cpu, 
  Radio, 
  Users, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import WorkflowStepper from '../components/common/WorkflowStepper';
import MetricCard from '../components/common/MetricCard';
import RouteVisualizer from '../components/common/RouteVisualizer';
import StatusIndicator from '../components/common/StatusIndicator';
import { useMission } from '../context/MissionContext';

export default function PlanAnalysisPage() {
  const navigate = useNavigate();
  const { currentPlan } = useMission();

  return (
    <div className="min-h-screen bg-[#080A0F] text-slate-100 font-sans pb-16">
      <WorkflowStepper />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* TOP HEADER & STATUS BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-cyan-400 font-bold tracking-wider uppercase">
                MISSION BRIEFING & VECTOR AUDIT
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400">
                DISASTER: {currentPlan.disaster.type.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                Rescue Plan #{currentPlan.id}
              </h1>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 shadow-cyan-glow">
                READY FOR STRESS TEST
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Mission: {currentPlan.name} • Target Zone: {currentPlan.disaster.zone}
            </p>
          </div>

          {/* Action CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/stress-test')}
              className="px-6 py-3 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-crimson-glow flex items-center gap-2 group"
            >
              <Zap className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
              <span>START STRESS TEST</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* METRICS ROW (5 CORE METRICS) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          <MetricCard
            label="Risk Score"
            value={currentPlan.metrics.riskScore}
            unit="/100"
            variant={currentPlan.metrics.riskScore > 70 ? "crimson" : "amber"}
            icon={ShieldAlert}
            progress={currentPlan.metrics.riskScore}
            subtext="Calculated based on terrain water velocity & overpass stress."
          />

          <MetricCard
            label="Reliability Score"
            value={currentPlan.metrics.reliabilityScore}
            unit="%"
            variant="cyan"
            icon={Activity}
            progress={currentPlan.metrics.reliabilityScore}
            subtext="Baseline Monte Carlo certainty before stress injection."
          />

          <MetricCard
            label="Est. Rescue Time"
            value={currentPlan.metrics.estimatedTime}
            unit="min"
            variant="cyan"
            icon={Clock}
            subtext={`Survival margin: ${currentPlan.metrics.evacuationWindow}`}
          />

          <MetricCard
            label="Route Distance"
            value={currentPlan.metrics.routeDistance}
            unit="km"
            variant="cyan"
            icon={MapPin}
            subtext="Traversing low-ground corridor Sector B."
          />

          <MetricCard
            label="Resource Utilization"
            value={currentPlan.metrics.resourceUtilization}
            unit="%"
            variant="emerald"
            icon={Battery}
            progress={currentPlan.metrics.resourceUtilization}
            subtext="UGV battery & emergency medical payload reserve."
          />

        </div>

        {/* MAIN ANALYSIS CONTENT: ROUTE VISUALIZER + TELEMETRY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Route Visualizer Panel */}
          <div className="lg:col-span-8">
            <RouteVisualizer
              mode="standard"
              title="PRIMARY INGRESS & EGRESS VECTOR (BASELINE PLAN)"
              interactive={true}
            />
          </div>

          {/* Right Column: Mission Parameters & Tactical Fleet Status */}
          <div className="lg:col-span-4 space-y-4 font-mono">
            
            {/* Mission Telemetry Card */}
            <div className="p-5 rounded-xl bg-[#0D121D] border border-white/10 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-bold text-white tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  FIELD SENSORS & ASSETS
                </span>
                <StatusIndicator status="Operational" size="sm" showLabel={false} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-slate-400">SURVIVORS TARGETED</span>
                  <strong className="text-amber-400">{currentPlan.mission.survivorCount} Civilians</strong>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-slate-400">LEAD VEHICLE</span>
                  <span className="text-cyan-300 font-semibold">UGV-01 Amphibious</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-slate-400">AERIAL RECON</span>
                  <span className="text-cyan-300 font-semibold">UAV-12 Thermal Locked</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-slate-400">WATER FLOW VELOCITY</span>
                  <span className="text-amber-400 font-semibold">3.4 m/s (Near Overpass)</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-white/5">
                  <span className="text-slate-400">COMMS STATUS</span>
                  <span className="text-emerald-400 font-semibold">Mesh Stable (92%)</span>
                </div>
              </div>

              {/* Stress Test Warning Callout */}
              <div className="mt-4 p-3 rounded-lg bg-amber-950/30 border border-amber-600/30 text-[11px] text-amber-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  UNVERIFIED AGAINST DISASTER VARIANCE
                </div>
                <p className="text-amber-200/80 leading-relaxed font-sans">
                  This baseline plan assumes current road stability. Sudden overpass collapse or water surge may cause critical failure.
                </p>
              </div>
            </div>

            {/* Quick action button to proceed to stress testing */}
            <button
              onClick={() => navigate('/stress-test')}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-crimson-glow flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>ENGAGE STRESS TEST LAB</span>
            </button>
          </div>

        </div>

        {/* PLAN SUMMARY SECTION */}
        <div className="p-6 rounded-xl bg-[#0D121D] border border-white/10 shadow-command relative font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Plan Summary & Operational Orders
              </h2>
            </div>
            <span className="text-[10px] text-slate-500 bg-black/40 px-2 py-0.5 rounded border border-white/5">
              SYNTHESIZED BY AI STRATEGY ENGINE
            </span>
          </div>

          <p className="mt-4 text-sm text-slate-300 leading-relaxed font-sans bg-black/30 p-4 rounded-lg border border-white/5">
            “{currentPlan.planSummary}”
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 rounded bg-white/5 border border-white/5">
              <span className="text-slate-400 text-[10px] uppercase block">EVACUATION CORRIDOR</span>
              <strong className="text-white mt-0.5 block">Northern Lowland Overpass (Sector B)</strong>
            </div>
            <div className="p-3 rounded bg-white/5 border border-white/5">
              <span className="text-slate-400 text-[10px] uppercase block">MEDICAL PAYLOAD</span>
              <strong className="text-emerald-400 mt-0.5 block">{currentPlan.mission.medicalSupplies}</strong>
            </div>
            <div className="p-3 rounded bg-white/5 border border-white/5">
              <span className="text-slate-400 text-[10px] uppercase block">RISK MITIGATION STATUS</span>
              <strong className="text-amber-400 mt-0.5 block">Pending Stress Simulation</strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
