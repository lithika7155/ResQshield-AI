import React from 'react';

export default function MetricCard({ 
  label, 
  value, 
  subtext, 
  unit = "", 
  variant = "cyan", 
  icon: Icon,
  progress = null,
  delta = null 
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'crimson':
        return {
          bg: 'bg-gradient-to-b from-[#180e14] to-[#0d121d]',
          border: 'border-crimson-600/30 hover:border-crimson-500/50',
          text: 'text-crimson-400',
          badge: 'text-crimson-400 bg-crimson-950/60 border-crimson-800/50',
          bar: 'bg-crimson-500'
        };
      case 'amber':
        return {
          bg: 'bg-gradient-to-b from-[#18140e] to-[#0d121d]',
          border: 'border-amber-500/30 hover:border-amber-500/50',
          text: 'text-amber-400',
          badge: 'text-amber-400 bg-amber-950/60 border-amber-800/50',
          bar: 'bg-amber-500'
        };
      case 'emerald':
        return {
          bg: 'bg-gradient-to-b from-[#0e1814] to-[#0d121d]',
          border: 'border-emerald-500/30 hover:border-emerald-500/50',
          text: 'text-emerald-400',
          badge: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/50',
          bar: 'bg-emerald-500'
        };
      default:
        return {
          bg: 'bg-gradient-to-b from-[#0f172a]/60 to-[#0d121d]',
          border: 'border-cyan-500/25 hover:border-cyan-500/40',
          text: 'text-cyan-400',
          badge: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/50',
          bar: 'bg-cyan-500'
        };
    }
  };

  const v = getVariantStyles();

  return (
    <div className={`p-4 rounded-lg border ${v.border} ${v.bg} backdrop-blur-md relative overflow-hidden transition-all duration-300 shadow-command group`}>
      {/* Top row: Label and Icon */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-medium text-slate-400 tracking-wider uppercase">
          {label}
        </span>
        {Icon && <Icon className={`w-4 h-4 ${v.text} opacity-80 group-hover:scale-110 transition-transform`} />}
      </div>

      {/* Main Value and Unit */}
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
          {value}
        </span>
        {unit && <span className="text-xs font-mono text-slate-400 font-semibold">{unit}</span>}
        
        {delta && (
          <span className={`ml-auto text-[11px] font-mono px-2 py-0.5 rounded border ${v.badge}`}>
            {delta}
          </span>
        )}
      </div>

      {/* Progress Bar (if provided) */}
      {progress !== null && (
        <div className="mt-3 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-700 ${v.bar}`} 
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} 
          />
        </div>
      )}

      {/* Subtext */}
      {subtext && (
        <p className="mt-2 text-[11px] text-slate-400 leading-snug line-clamp-2">
          {subtext}
        </p>
      )}

      {/* Subtle HUD corner marks */}
      <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-white/20 pointer-events-none" />
      <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-white/20 pointer-events-none" />
    </div>
  );
}
