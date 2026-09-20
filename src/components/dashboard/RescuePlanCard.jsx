import React from 'react';
import { ChevronRight, Users, Home, Truck, TrendingUp } from 'lucide-react';
import { rescuePlanCapacity } from '../../data/resqshieldData';

export default function RescuePlanCard({ onViewPlan }) {
  const d = rescuePlanCapacity;

  const metrics = [
    {
      label: 'Total Evacuations',
      value: d.totalEvacuations,
      delta: d.evacuationsDelta,
      deltaPositive: true,
      icon: Users,
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-950/60 border-cyan-800/40',
    },
    {
      label: 'Safe Locations',
      value: d.safeLocations,
      delta: d.safeLocationsDelta,
      deltaPositive: true,
      icon: Home,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-950/60 border-emerald-800/40',
    },
    {
      label: 'Available Vehicles',
      value: d.availableVehicles,
      delta: d.vehiclesInTransit,
      deltaPositive: false,
      icon: Truck,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-950/60 border-amber-800/40',
    },
  ];

  return (
    <div className="rounded-xl bg-[#0D121D] border border-white/10 shadow-command overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h3 className="text-sm font-bold text-white tracking-wide">Rescue Plan</h3>
        <button
          onClick={onViewPlan}
          className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 transition-colors"
        >
          View Plan <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 space-y-3">
        
        {/* 3 Metrics Grid */}
        <div className="grid grid-cols-3 gap-3">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="text-center">
                <div className={`w-8 h-8 rounded-lg border mx-auto mb-1.5 flex items-center justify-center ${m.iconBg} ${m.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-base font-bold text-white font-mono leading-tight">{m.value}</div>
                <div className={`text-[10px] font-mono leading-tight flex items-center justify-center gap-0.5 mt-0.5 ${m.deltaPositive ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {m.deltaPositive && <TrendingUp className="w-2.5 h-2.5" />}
                  {m.delta}
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5 leading-tight">{m.label}</div>
              </div>
            );
          })}
        </div>

        {/* Estimated Completion */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono">
          <span className="text-slate-400">Est. Completion Time</span>
          <span className="text-cyan-300 font-bold">{d.estimatedCompletion}</span>
        </div>

      </div>
    </div>
  );
}
