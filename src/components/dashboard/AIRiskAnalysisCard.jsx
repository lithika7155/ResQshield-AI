import React from 'react';
import { ChevronRight, Flame, Waves, Wind, Mountain } from 'lucide-react';
import { aiRiskBreakdown } from '../../data/resqshieldData';

// Donut ring component
function DonutRing({ value, size = 96, stroke = 10, color = '#EF4444' }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const cx = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      {/* Track */}
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="#1F2937" strokeWidth={stroke} />
      {/* Progress */}
      <circle
        cx={cx} cy={cx} r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color}88)`, transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  );
}

const riskBreakdownItems = [
  { label: 'Flood Risk', key: 'floodRisk', color: '#EF4444', icon: Waves, textColor: 'text-crimson-400' },
  { label: 'Landslide Risk', key: 'landslideRisk', color: '#F59E0B', icon: Mountain, textColor: 'text-amber-400' },
  { label: 'Cyclone Risk', key: 'cycloneRisk', color: '#F59E0B', icon: Wind, textColor: 'text-amber-400' },
  { label: 'Fire Risk', key: 'fireRisk', color: '#10B981', icon: Flame, textColor: 'text-emerald-400' },
];

export default function AIRiskAnalysisCard() {
  const data = aiRiskBreakdown;

  return (
    <div className="rounded-xl bg-[#0D121D] border border-white/10 shadow-command overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h3 className="text-sm font-bold text-white tracking-wide">AI Risk Analysis</h3>
        <button className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 transition-colors">
          View Details <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        
        {/* Overall Risk Donut + Risk Breakdown side by side */}
        <div className="flex items-center gap-4">
          
          {/* Donut Gauge */}
          <div className="relative shrink-0">
            <DonutRing value={data.overallRisk} size={90} stroke={9} color="#EF4444" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-xl font-black text-white font-mono leading-tight">{data.overallRisk}%</span>
              <span className="text-[9px] text-slate-400 font-mono leading-tight">Overall</span>
              <span className="text-[9px] text-slate-400 font-mono">Risk</span>
            </div>
          </div>

          {/* Risk Breakdown List */}
          <div className="flex-1 space-y-1.5 min-w-0">
            {riskBreakdownItems.map((item) => {
              const Icon = item.icon;
              const val = data[item.key];
              return (
                <div key={item.key} className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Icon className={`w-3 h-3 ${item.textColor} shrink-0`} />
                    <span className="text-slate-300 truncate">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Mini progress bar */}
                    <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${val}%`, backgroundColor: item.color }}
                      />
                    </div>
                    <span className={`font-mono font-bold text-[11px] w-7 text-right ${item.textColor}`}>{val}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="p-3 rounded-lg bg-black/40 border border-white/5">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded bg-blue-950/80 border border-blue-700/40 flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M12 8v4l3 3"/>
              </svg>
            </div>
            <span className="text-[10px] font-bold text-slate-300 font-mono uppercase tracking-wider">AI Insight</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            {data.insight}
          </p>
        </div>

      </div>
    </div>
  );
}
