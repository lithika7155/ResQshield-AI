import React from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Target, 
  Users, 
  ShieldCheck, 
  DollarSign, 
  TrendingUp, 
  Settings2,
  Activity
} from 'lucide-react';
import { disasterAlertData, kpiMetrics } from '../../data/resqshieldData';

export default function AlertAndKpiRow({ onAlertClick }) {
  const getKpiIcon = (type) => {
    switch (type) {
      case 'target': return Target;
      case 'users': return Users;
      case 'shield': return ShieldCheck;
      case 'impact': return Settings2;
      default: return Activity;
    }
  };

  const getKpiStyles = (badgeType) => {
    switch (badgeType) {
      case 'crimson':
        return {
          iconBox: 'bg-crimson-950/70 border-crimson-800/50 text-crimson-400',
          badgeText: 'text-slate-400'
        };
      case 'cyan':
        return {
          iconBox: 'bg-blue-950/70 border-blue-800/50 text-blue-400',
          badgeText: 'text-emerald-400 font-semibold'
        };
      case 'teal':
        return {
          iconBox: 'bg-teal-950/70 border-teal-800/50 text-teal-400',
          badgeText: 'text-slate-400'
        };
      case 'amber':
        return {
          iconBox: 'bg-amber-950/70 border-amber-800/50 text-amber-400',
          badgeText: 'text-slate-400'
        };
      default:
        return {
          iconBox: 'bg-white/5 border-white/10 text-white',
          badgeText: 'text-slate-400'
        };
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 select-none font-sans">
      
      {/* TOP LEFT: SEVERE FLOOD ALERT CARD */}
      <div 
        onClick={onAlertClick}
        className="lg:col-span-4 rounded-xl bg-gradient-to-r from-[#1E0B10] to-[#12080C] border border-crimson-700/50 p-4 flex items-center gap-4 shadow-crimson-glow cursor-pointer hover:border-crimson-500 transition-all duration-300 relative overflow-hidden group"
      >
        {/* Glowing red triangle icon in square */}
        <div className="w-12 h-12 rounded-xl bg-crimson-950/80 border border-crimson-600/70 flex items-center justify-center text-crimson-500 shrink-0 shadow-lg group-hover:scale-105 transition-transform">
          <AlertTriangle className="w-6 h-6 animate-pulse" />
        </div>

        {/* Text and Badge */}
        <div className="flex-1 min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
            {disasterAlertData.title}
          </h2>

          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1 text-slate-300 text-xs">
              <MapPin className="w-3 h-3 text-crimson-400" />
              <span className="truncate">{disasterAlertData.location}</span>
            </div>

            <span className="px-2 py-0.5 rounded bg-crimson-600 text-white text-[10px] font-bold font-mono tracking-wider uppercase shadow-sm">
              {disasterAlertData.status}
            </span>
          </div>
        </div>

        {/* Corner laser accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-crimson-600/10 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* TOP RIGHT: 4 KPI CARDS ROW */}
      <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpiMetrics.map((kpi) => {
          const Icon = getKpiIcon(kpi.iconType);
          const styles = getKpiStyles(kpi.badgeType);

          return (
            <div
              key={kpi.id}
              className="rounded-xl bg-[#0D121D] border border-white/10 p-3.5 flex items-center gap-3 shadow-command hover:border-white/20 transition-all"
            >
              {/* Metric Icon Square */}
              <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${styles.iconBox}`}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Metric Values */}
              <div className="min-w-0 flex-1">
                <span className="text-[11px] text-slate-400 block leading-tight truncate">
                  {kpi.title}
                </span>

                <div className="text-xl font-bold text-white font-mono leading-tight mt-0.5">
                  {kpi.value}
                </div>

                <div className={`text-[10px] font-mono leading-tight mt-0.5 truncate flex items-center gap-1 ${styles.badgeText}`}>
                  {kpi.deltaPositive && <TrendingUp className="w-2.5 h-2.5" />}
                  <span>{kpi.subBadge}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
