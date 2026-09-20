import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { activeStressSimulation } from '../../data/resqshieldData';

export default function StressTestingCard({ onRunSimulation }) {
  const sim = activeStressSimulation;
  const [progress, setProgress] = useState(sim.progressPercent);
  const [isRunning, setIsRunning] = useState(true);
  const [subtext, setSubtext] = useState(sim.subtext);

  // Animate progress bar slowly when "running"
  useEffect(() => {
    if (!isRunning) return;
    const subtexts = [
      'Evaluating route feasibility...',
      'Simulating battery depletion...',
      'Checking signal availability...',
      'Running failure propagation...',
    ];
    let i = 0;
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + 1;
        if (next >= 98) { clearInterval(interval); setIsRunning(false); return 98; }
        return next;
      });
      i = (i + 1) % subtexts.length;
      setSubtext(subtexts[i]);
    }, 300);
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="rounded-xl bg-[#0D121D] border border-white/10 shadow-command overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h3 className="text-sm font-bold text-white tracking-wide">Stress Testing</h3>
        <button
          onClick={onRunSimulation}
          className="text-[11px] font-mono text-crimson-400 hover:text-crimson-300 flex items-center gap-0.5 transition-colors"
        >
          Run Simulation <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 space-y-4">

        {/* Active Scenario */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-700/40 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] text-slate-400 font-mono">Scenario:</div>
            <div className="text-xs font-bold text-white leading-snug">{sim.scenarioTitle}</div>

            {/* Progress bar with label */}
            <div className="mt-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span className={isRunning ? 'text-amber-300 animate-pulse' : 'text-emerald-300'}>
                  {isRunning ? `In Progress — ${progress}%` : 'Simulation Complete'}
                </span>
                {isRunning && <RefreshCw className="w-3 h-3 animate-spin text-slate-500" />}
              </div>
              <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    background: isRunning
                      ? 'linear-gradient(90deg, #F59E0B, #EF4444)'
                      : 'linear-gradient(90deg, #10B981, #06B6D4)'
                  }}
                />
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-1">{subtext}</div>
            </div>
          </div>
        </div>

        {/* Quick Scenario List */}
        <div className="space-y-1.5">
          {['Route Blocked', 'Low Battery', 'Signal Loss', 'New Hazard', 'Survivor Location Error'].map((scenario, idx) => {
            const statuses = ['Critical', 'High', 'Active', 'Pending', 'Pending'];
            const colors = [
              'text-crimson-400 bg-crimson-950/60 border-crimson-700/40',
              'text-amber-400 bg-amber-950/60 border-amber-700/40',
              'text-amber-400 bg-amber-950/60 border-amber-700/40',
              'text-slate-400 bg-white/5 border-white/10',
              'text-slate-400 bg-white/5 border-white/10',
            ];
            return (
              <div key={scenario} className="flex items-center justify-between text-[11px] py-1 border-b border-white/5 last:border-0">
                <span className="text-slate-300 font-sans">{scenario}</span>
                <span className={`px-2 py-0.5 rounded border font-mono text-[10px] font-bold ${colors[idx]}`}>
                  {statuses[idx]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Run Full Simulation CTA */}
        <button
          onClick={onRunSimulation}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-crimson-600/20 hover:bg-crimson-600/30 border border-crimson-600/40 text-crimson-300 font-bold text-xs uppercase tracking-wider transition-all duration-200 font-mono group"
        >
          <Zap className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          View Full Failure Analysis
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>

      </div>
    </div>
  );
}
