import React from 'react';
import { ChevronRight, Waves, Mountain, Wind, Flame, Activity } from 'lucide-react';
import { recentIncidentsList, latestUpdatesList } from '../../data/resqshieldData';

const typeConfig = {
  flood: {
    icon: Waves,
    colors: {
      Critical: 'bg-crimson-950/80 border-crimson-600/60 text-crimson-300',
      High: 'bg-crimson-950/50 border-crimson-800/40 text-crimson-400',
      Moderate: 'bg-amber-950/50 border-amber-800/40 text-amber-400',
    },
    iconColor: 'text-blue-400',
    dot: { Critical: 'bg-crimson-500', High: 'bg-crimson-600', Moderate: 'bg-amber-500' }
  },
  landslide: {
    icon: Mountain,
    colors: {
      High: 'bg-crimson-950/50 border-crimson-800/40 text-crimson-400',
      Moderate: 'bg-amber-950/50 border-amber-800/40 text-amber-400',
    },
    iconColor: 'text-amber-400',
    dot: { High: 'bg-amber-500', Moderate: 'bg-amber-500' }
  },
  cyclone: {
    icon: Wind,
    colors: {
      Moderate: 'bg-amber-950/50 border-amber-800/40 text-amber-400',
      High: 'bg-crimson-950/50 border-crimson-800/40 text-crimson-400'
    },
    iconColor: 'text-blue-400',
    dot: { Moderate: 'bg-amber-500', High: 'bg-crimson-500' }
  },
  fire: {
    icon: Flame,
    colors: {
      Moderate: 'bg-amber-950/50 border-amber-800/40 text-amber-400',
      High: 'bg-crimson-950/50 border-crimson-800/40 text-crimson-400'
    },
    iconColor: 'text-orange-400',
    dot: { Moderate: 'bg-amber-500', High: 'bg-crimson-500' }
  }
};

const updateIconColors = { route: 'bg-emerald-500', team: 'bg-amber-500', weather: 'bg-cyan-500' };

export default function LeftPanel({ selectedIncident, setSelectedIncident }) {
  return (
    <div className="flex flex-col gap-3 select-none font-sans min-w-0">
      
      {/* RECENT INCIDENTS */}
      <div className="rounded-xl bg-[#0D121D] border border-white/10 overflow-hidden shadow-command flex-1">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h3 className="text-sm font-bold text-white tracking-wide">Recent Incidents</h3>
          <button className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 transition-colors">
            View All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-white/5">
          {recentIncidentsList.map((inc) => {
            const cfg = typeConfig[inc.type] || typeConfig.flood;
            const Icon = cfg.icon;
            const isSelected = selectedIncident?.id === inc.id;
            const severityColorClass = (cfg.colors[inc.severity] || 'bg-white/5 border-white/10 text-slate-300');
            const dotColor = (cfg.dot?.[inc.severity] || 'bg-slate-500');

            return (
              <button
                key={inc.id}
                onClick={() => setSelectedIncident(isSelected ? null : inc)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-200 hover:bg-white/5 ${isSelected ? 'bg-crimson-950/30 border-l-2 border-crimson-500' : 'border-l-2 border-transparent'}`}
              >
                {/* Type Icon */}
                <div className={`w-8 h-8 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center shrink-0 ${cfg.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-white truncate">{inc.title}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border whitespace-nowrap font-mono ${severityColorClass}`}>
                      {inc.severity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[11px] text-slate-400 truncate">{inc.location}</span>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap font-mono ml-2">
                      Conf: {inc.confidence}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{inc.time}</div>
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* LATEST UPDATES */}
      <div className="rounded-xl bg-[#0D121D] border border-white/10 shadow-command">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h3 className="text-sm font-bold text-white tracking-wide">Latest Updates</h3>
          <button className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 transition-colors">
            View All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="px-4 py-3 space-y-3">
          {latestUpdatesList.map((upd) => (
            <div key={upd.id} className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${updateIconColors[upd.type] || 'bg-slate-500'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-200 leading-snug">{upd.title}</p>
                <span className="text-[10px] text-slate-500 font-mono">{upd.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
