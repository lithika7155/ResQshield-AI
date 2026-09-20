import React from 'react';
import { 
  Server, 
  Cpu, 
  Activity, 
  Database, 
  Radio, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  HardDrive, 
  Zap, 
  Layers 
} from 'lucide-react';
import StatusIndicator from '../components/common/StatusIndicator';
import MetricCard from '../components/common/MetricCard';
import { systemStatusData } from '../data/systemStatus';

export default function SystemStatusPage() {
  const { uptime, activeSimulations, plansAnalyzed, scenariosTested, services, infrastructureMetrics } = systemStatusData;

  const getServiceIcon = (id) => {
    switch (id) {
      case 'ai-engine': return Cpu;
      case 'sim-engine': return Zap;
      case 'route-engine': return Layers;
      case 'database': return Database;
      case 'emergency-feed': return Radio;
      default: return Server;
    }
  };

  return (
    <div className="min-h-screen bg-[#080A0F] text-slate-100 font-sans pb-16 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CORE INFRASTRUCTURE TELEMETRY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              System Health & Engine Status
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
              Real-time operational status for AI simulation nodes, GIS routing solvers, and satellite feeds.
            </p>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs">
            <StatusIndicator status="Operational" size="md" />
            <span className="text-emerald-300 font-bold">ALL SUBSYSTEMS NOMINAL</span>
          </div>
        </div>

        {/* 4 CORE OPERATIONAL METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <MetricCard
            label="System Uptime"
            value={uptime}
            variant="emerald"
            icon={Clock}
            subtext="Hot-standby redundant clusters active."
          />

          <MetricCard
            label="Active Simulations"
            value={activeSimulations}
            variant="cyan"
            icon={Zap}
            subtext="Concurrent Monte Carlo stress tests."
          />

          <MetricCard
            label="Plans Analyzed"
            value={plansAnalyzed}
            variant="cyan"
            icon={Layers}
            subtext="Disaster rescue strategies processed."
          />

          <MetricCard
            label="Scenarios Tested"
            value={scenariosTested}
            variant="cyan"
            icon={Cpu}
            subtext="Perturbation failure modes injected."
          />

        </div>

        {/* SUBSYSTEM HEALTH CARDS */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Autonomous AI Subsystems & Microservices
            </h2>
            <span className="text-xs text-slate-500">POLLING INTERVAL: 1000ms</span>
          </div>

          <div className="space-y-3">
            {services.map((svc) => {
              const Icon = getServiceIcon(svc.id);

              return (
                <div 
                  key={svc.id}
                  className="p-5 rounded-xl bg-[#0D121D] border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-command"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white tracking-tight">
                          {svc.name}
                        </h3>
                        <span className="text-[10px] text-slate-500 font-mono">[{svc.version}]</span>
                      </div>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">
                        {svc.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-xs border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">LATENCY</span>
                      <span className="text-cyan-300 font-bold">{svc.latency}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">WORKLOAD</span>
                      <span className="text-slate-300 font-semibold">{svc.load}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">NODES</span>
                      <span className="text-slate-300 font-semibold">{svc.nodes}</span>
                    </div>

                    <div className="pl-2 border-l border-white/10">
                      <StatusIndicator status={svc.status} size="sm" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* INFRASTRUCTURE HARDWARE & SATELLITE TELEMETRY */}
        <div className="p-6 rounded-xl bg-[#0B0F17] border border-white/10 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              EDGE COMPUTE NODES & SATELLITE LINKS
            </span>
            <span className="text-emerald-400">HOT STANDBY READY</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 rounded bg-black/40 border border-white/5">
              <span className="text-slate-400 text-[10px] uppercase block">Cluster CPU Utilization</span>
              <strong className="text-white text-sm block mt-0.5">{infrastructureMetrics.cpuTotalUsage}%</strong>
              <span className="text-emerald-400 text-[10px]">Normal operating range</span>
            </div>

            <div className="p-3 rounded bg-black/40 border border-white/5">
              <span className="text-slate-400 text-[10px] uppercase block">RAM Allocation</span>
              <strong className="text-white text-sm block mt-0.5">{infrastructureMetrics.memoryUsage}</strong>
              <span className="text-cyan-400 text-[10px]">High-performance DDR5</span>
            </div>

            <div className="p-3 rounded bg-black/40 border border-white/5">
              <span className="text-slate-400 text-[10px] uppercase block">Connected Field Units</span>
              <strong className="text-amber-400 text-sm block mt-0.5">{infrastructureMetrics.activeDronesConnected} Autonomous Nodes</strong>
              <span className="text-slate-400 text-[10px]">9 UGVs • 4 USVs • 6 UAVs</span>
            </div>

            <div className="p-3 rounded bg-black/40 border border-white/5">
              <span className="text-slate-400 text-[10px] uppercase block">Satellite Ingestion</span>
              <strong className="text-emerald-400 text-sm block mt-0.5">{infrastructureMetrics.satelliteFeedsLocked} Downlinks Locked</strong>
              <span className="text-emerald-400 text-[10px]">Zero telemetry packet drop</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
