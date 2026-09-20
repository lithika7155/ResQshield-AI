import React from 'react';
import { ShieldAlert, Cpu, Activity, Database } from 'lucide-react';
import { useMission } from '../../context/MissionContext';

export default function SimulationModal() {
  const { isSimulating, simProgress } = useMission();

  if (!isSimulating) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-mono select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0D121D] border border-cyan-500/40 rounded-xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Subtle glowing radial background */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-crimson-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Tactical Crosshair corner marks */}
        <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />

        {/* Center Animated Tactical AI Core */}
        <div className="flex flex-col items-center text-center">
          <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
            {/* Spinning radar rings */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/50 animate-[spin_6s_linear_infinite]" />
            <div className="absolute inset-2 rounded-full border border-cyan-400/30 animate-[spin_10s_linear_infinite_reverse]" />
            
            {/* Core Icon */}
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-400/60 flex items-center justify-center text-cyan-300 shadow-cyan-glow animate-pulse">
              <Cpu className="w-6 h-6" />
            </div>
          </div>

          <span className="text-[10px] tracking-widest text-cyan-400 uppercase font-semibold">
            AI TACTICAL ENGINE EXECUTING
          </span>
          
          <h3 className="text-lg font-bold text-white mt-1">
            Computing Disaster Trajectory
          </h3>

          <p className="text-xs text-slate-300 mt-2 min-h-[32px] transition-all duration-300">
            {simProgress.message || "Simulating environmental perturbation envelopes..."}
          </p>

          {/* Progress bar */}
          <div className="w-full mt-6 bg-black/60 border border-white/10 rounded-full h-2 overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${Math.min(100, Math.max(8, simProgress.percent))}%` }}
            />
          </div>

          {/* Telemetry Status Line */}
          <div className="mt-3 w-full flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-cyan-400 animate-spin" />
              MONTE CARLO PROBES
            </span>
            <span className="text-cyan-400 font-bold">{simProgress.percent}%</span>
            <span className="flex items-center gap-1">
              <Database className="w-3 h-3 text-slate-400" />
              GIS TILES SYNCED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
