import React from 'react';
import { 
  AlertTriangle, 
  ArrowDown, 
  BatteryWarning, 
  Clock, 
  HeartCrack, 
  Navigation2, 
  ShieldAlert, 
  Radio 
} from 'lucide-react';

export default function FailureChainVisualizer({ chain, summary }) {
  const getIconForTitle = (title) => {
    const t = title.toLowerCase();
    if (t.includes('route') || t.includes('block') || t.includes('shock')) return ShieldAlert;
    if (t.includes('detour') || t.includes('halt')) return Navigation2;
    if (t.includes('time') || t.includes('delay')) return Clock;
    if (t.includes('battery') || t.includes('power')) return BatteryWarning;
    if (t.includes('medical') || t.includes('arrival') || t.includes('hypothermia')) return HeartCrack;
    if (t.includes('signal') || t.includes('relay')) return Radio;
    return AlertTriangle;
  };

  return (
    <div className="rounded-xl bg-[#090D15] border border-crimson-900/40 p-5 sm:p-6 shadow-2xl relative overflow-hidden font-mono">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-crimson-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between pb-3 border-b border-crimson-900/30">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-crimson-500 animate-ping" />
          <span className="text-xs font-bold text-crimson-400 tracking-wider">
            CASCADING FAILURE SEQUENCE (MONTE CARLO SIMULATION)
          </span>
        </div>
        <span className="text-[10px] text-slate-500 bg-black/40 px-2 py-0.5 rounded border border-white/5">
          FAILURE DEPTH: {chain.length} STEPS
        </span>
      </div>

      {summary && (
        <div className="mt-3 p-3 rounded bg-crimson-950/30 border border-crimson-800/40 text-xs text-crimson-200">
          <strong className="text-crimson-400">Trigger Root Cause: </strong> {summary}
        </div>
      )}

      {/* Failure Chain Connected Nodes */}
      <div className="mt-6 relative">
        <div className="space-y-3">
          {chain.map((node, index) => {
            const Icon = getIconForTitle(node.title);
            const isLast = index === chain.length - 1;
            const isFirst = index === 0;

            let borderStyle = "border-crimson-900/50 bg-gradient-to-r from-crimson-950/40 to-[#0c101a]";
            let badgeStyle = "bg-crimson-900/40 text-crimson-400 border-crimson-700/50";
            
            if (node.severity === "high") {
              borderStyle = "border-amber-900/50 bg-gradient-to-r from-amber-950/30 to-[#0c101a]";
              badgeStyle = "bg-amber-900/40 text-amber-400 border-amber-700/50";
            } else if (node.severity === "moderate") {
              borderStyle = "border-slate-700/50 bg-gradient-to-r from-slate-900/40 to-[#0c101a]";
              badgeStyle = "bg-slate-800 text-slate-300 border-slate-700";
            }

            return (
              <div key={index} className="flex flex-col items-center">
                {/* Chain Step Node Card */}
                <div className={`w-full p-3.5 rounded-lg border ${borderStyle} transition-all duration-300 hover:border-crimson-500/60 shadow-lg relative group`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isLast ? 'bg-crimson-600 text-white shadow-crimson-glow animate-pulse' : 'bg-white/5 border border-white/10 text-crimson-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-bold">STAGE 0{node.step || index + 1}</span>
                          <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                            {node.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                          {node.desc}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[9px] uppercase px-2 py-0.5 rounded border font-semibold shrink-0 ${badgeStyle}`}>
                      {node.severity || "Critical"}
                    </span>
                  </div>
                </div>

                {/* Downward Cascading Connector Arrow */}
                {!isLast && (
                  <div className="my-1.5 flex flex-col items-center">
                    <div className="w-0.5 h-3 bg-gradient-to-b from-crimson-500 to-crimson-700 opacity-60" />
                    <ArrowDown className="w-3.5 h-3.5 text-crimson-500 opacity-80" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Terminal Outcome Banner */}
      <div className="mt-6 p-4 rounded-lg bg-crimson-950/60 border border-crimson-600/50 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-crimson-400 shrink-0" />
          <div>
            <div className="font-bold text-white uppercase tracking-wider">
              CATASTROPHIC PLAN INVIABILITY
            </div>
            <p className="text-[11px] text-crimson-200 mt-0.5">
              Current rescue plan cannot survive this disaster perturbation without immediate corridor reroute.
            </p>
          </div>
        </div>
        <div className="px-3 py-1 rounded bg-crimson-900 text-white font-bold text-[11px] tracking-wider uppercase border border-crimson-500 shadow-crimson-glow">
          ACTION REQUIRED: ALTERNATIVE
        </div>
      </div>
    </div>
  );
}
