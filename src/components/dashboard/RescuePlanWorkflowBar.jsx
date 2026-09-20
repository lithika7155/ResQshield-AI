import React from 'react';
import { ArrowRight } from 'lucide-react';

const WORKFLOW_STEPS = [
  {
    id: 1,
    title: '1. Analyse Data',
    sub: 'Weather + Reports + Sensors',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    color: 'text-cyan-400',
    border: 'border-cyan-800/40',
    bg: 'bg-cyan-950/40'
  },
  {
    id: 2,
    title: '2. Generate Plan',
    sub: 'Optimal routes & resources',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    color: 'text-blue-400',
    border: 'border-blue-800/40',
    bg: 'bg-blue-950/40'
  },
  {
    id: 3,
    title: '3. Stress Test',
    sub: 'What-if scenarios',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    color: 'text-amber-400',
    border: 'border-amber-800/40',
    bg: 'bg-amber-950/40'
  },
  {
    id: 4,
    title: '4. Human Approval',
    sub: 'Final validation',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    color: 'text-emerald-400',
    border: 'border-emerald-800/40',
    bg: 'bg-emerald-950/40'
  },
];

export default function RescuePlanWorkflowBar({ onExecuteClick, onStressTestClick, onGeneratePlanClick }) {
  return (
    <div className="rounded-xl bg-[#0D121D] border border-white/10 px-4 py-3.5 shadow-command">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-bold text-white tracking-wide">Rescue Plan Overview</h3>
        <button 
          onClick={onGeneratePlanClick}
          className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 transition-colors"
        >
          View Full Plan <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {WORKFLOW_STEPS.map((step, idx) => (
          <React.Fragment key={step.id}>
            <button
              onClick={
                step.id === 1 || step.id === 2 
                  ? onGeneratePlanClick 
                  : step.id === 3 
                  ? onStressTestClick 
                  : step.id === 4 
                  ? onExecuteClick 
                  : undefined
              }
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border min-w-[140px] transition-all duration-200 hover:opacity-90 active:scale-95 ${step.bg} ${step.border} group shrink-0`}
            >
              <div className={`shrink-0 ${step.color} group-hover:scale-110 transition-transform`}>
                {step.icon}
              </div>
              <div className="text-left min-w-0">
                <div className={`text-xs font-bold ${step.color} leading-tight`}>{step.title}</div>
                <div className="text-[10px] text-slate-400 leading-tight mt-0.5 truncate">{step.sub}</div>
              </div>
            </button>

            {idx < WORKFLOW_STEPS.length - 1 && (
              <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
            )}
          </React.Fragment>
        ))}

        {/* Execute Plan Button */}
        <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
        <button
          onClick={onExecuteClick}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-crimson-600 hover:bg-crimson-500 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-crimson-glow shrink-0 group"
        >
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          Execute Plan
        </button>
      </div>
    </div>
  );
}
