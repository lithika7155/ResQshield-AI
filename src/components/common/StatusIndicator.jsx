import React from 'react';

export default function StatusIndicator({ status = "Operational", size = "md", showLabel = true }) {
  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      case 'operational':
      case 'verified':
      case 'safe':
        return {
          dot: 'bg-emerald-500 shadow-emerald-glow',
          ping: 'bg-emerald-400',
          text: 'text-emerald-400',
          border: 'border-emerald-500/30'
        };
      case 'warning':
      case 'degraded':
      case 'simulated failure':
      case 'moderate':
        return {
          dot: 'bg-amber-500',
          ping: 'bg-amber-400',
          text: 'text-amber-400',
          border: 'border-amber-500/30'
        };
      case 'critical':
      case 'failed':
      case 'blocked':
      case 'danger':
        return {
          dot: 'bg-crimson-500 shadow-crimson-glow',
          ping: 'bg-crimson-400',
          text: 'text-crimson-400',
          border: 'border-crimson-500/40'
        };
      default:
        return {
          dot: 'bg-cyan-500 shadow-cyan-glow',
          ping: 'bg-cyan-400',
          text: 'text-cyan-400',
          border: 'border-cyan-500/30'
        };
    }
  };

  const s = getStatusStyles();
  const sizeClasses = size === "sm" ? "w-2 h-2" : size === "lg" ? "w-3 h-3" : "w-2.5 h-2.5";

  return (
    <div className="inline-flex items-center gap-2 font-mono text-xs">
      <span className="relative flex items-center justify-center">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${s.ping}`} />
        <span className={`relative inline-flex rounded-full ${sizeClasses} ${s.dot}`} />
      </span>
      {showLabel && (
        <span className={`uppercase font-medium tracking-wider ${s.text}`}>
          {status}
        </span>
      )}
    </div>
  );
}
