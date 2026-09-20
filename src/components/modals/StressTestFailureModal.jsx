import React from 'react';
import { X, ArrowDown, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { activeStressSimulation } from '../../data/resqshieldData';

export default function StressTestFailureModal({ onClose, onApplyAlternative, onHumanApproval }) {
  const sim = activeStressSimulation;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-sans">
      <div className="relative w-full max-w-2xl bg-[#0D121D] border border-crimson-600/50 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-crimson-950/80 to-[#0D121D] border-b border-crimson-800/40">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-crimson-500 animate-ping" />
            <h2 className="text-base font-black text-white tracking-tight">
              STRESS TEST — FAILURE ANALYSIS
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Failure Status */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-crimson-950/50 border border-crimson-600/40">
            <AlertTriangle className="w-10 h-10 text-crimson-400 shrink-0" />
            <div>
              <div className="text-sm font-bold text-white">PLAN FAILED UNDER SIMULATION</div>
              <div className="text-xs text-crimson-200 mt-0.5">Scenario: {sim.scenarioTitle}</div>
              <div className="flex items-center gap-4 mt-2 text-xs font-mono">
                <span>Risk: <strong className="text-crimson-400">HIGH (88/100)</strong></span>
                <span>Reliability: <strong className="text-crimson-400">42%</strong></span>
                <span>Robustness: <strong className="text-amber-400">38%</strong></span>
              </div>
            </div>
          </div>

          {/* Failure Chain */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-3">
              Cascading Failure Sequence
            </h3>
            <div className="space-y-2">
              {sim.failureChain.map((node, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`w-full px-4 py-3 rounded-lg border flex items-center gap-3 ${
                    node.severity === 'critical'
                      ? 'bg-crimson-950/50 border-crimson-700/50'
                      : 'bg-amber-950/30 border-amber-800/40'
                  }`}>
                    <div className={`w-6 h-6 rounded text-[11px] font-bold font-mono flex items-center justify-center shrink-0 ${
                      node.severity === 'critical' ? 'bg-crimson-600 text-white' : 'bg-amber-700 text-white'
                    }`}>
                      {node.step}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${node.severity === 'critical' ? 'text-crimson-300' : 'text-amber-300'}`}>
                        {node.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-sans leading-snug">{node.desc}</div>
                    </div>
                  </div>
                  {idx < sim.failureChain.length - 1 && (
                    <div className="flex flex-col items-center my-1">
                      <div className="w-0.5 h-2 bg-crimson-700/60" />
                      <ArrowDown className="w-3.5 h-3.5 text-crimson-500 opacity-70" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Alternative Plan */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider font-mono">Alternative Plan Recommended</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed mb-3">{sim.recommendedAction}</p>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2 rounded bg-black/40 border border-white/5">
                <span className="text-slate-500 text-[10px] block">PLAN ID</span>
                <strong className="text-emerald-400">{sim.alternativePlan.id}</strong>
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/5">
                <span className="text-slate-500 text-[10px] block">RELIABILITY</span>
                <strong className="text-emerald-400">{sim.alternativePlan.reliability}</strong>
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/5">
                <span className="text-slate-500 text-[10px] block">EST. TIME</span>
                <strong className="text-white">{sim.alternativePlan.estimatedTime}</strong>
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/5">
                <span className="text-slate-500 text-[10px] block">BATTERY SAVED</span>
                <strong className="text-cyan-400">{sim.alternativePlan.batterySavings}</strong>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2 border-t border-white/10">
            <button
              onClick={onApplyAlternative}
              className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-emerald-glow flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Apply Alternative Plan
            </button>
            <button
              onClick={onHumanApproval}
              className="flex-1 py-3 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-crimson-glow flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" /> Proceed to Human Approval
            </button>
          </div>

          {/* Safety Rule Notice */}
          <div className="text-center text-[10px] text-slate-500 font-mono border-t border-white/5 pt-3">
            ⚠ AI will NEVER automatically execute a rescue plan. Human approval is mandatory before field dispatch.
          </div>
        </div>
      </div>
    </div>
  );
}
