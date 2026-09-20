import React, { useState } from 'react';
import { X, ShieldCheck, AlertTriangle, Check, Lock } from 'lucide-react';

const CHECKLIST = [
  { id: 'hazard', label: 'Hazard-free corridor verified via UAV-12 thermal imaging' },
  { id: 'battery', label: 'Fleet battery reserve exceeds minimum safe return threshold (+35% margin)' },
  { id: 'medical', label: 'Trauma kits allocated for all 54,280 affected civilians' },
  { id: 'comms', label: 'SATCOM uplink active; Mesh relay 3 stable at 92% link quality' },
  { id: 'authority', label: 'I confirm human command authority and authorize field deployment under protocol RESCUE-STD-10' },
];

export default function HumanApprovalModal({ onClose, onApprove, onSendBack }) {
  const [checked, setChecked] = useState({});
  const [notes, setNotes] = useState('Corridor confirmed via UAV-12. Team Alpha dispatched on ECR bypass.');
  const [approved, setApproved] = useState(false);

  const allChecked = CHECKLIST.every(c => checked[c.id]);

  const handleApprove = () => {
    setApproved(true);
    setTimeout(() => {
      onApprove?.();
      onClose?.();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-sans">
      <div className="relative w-full max-w-lg bg-[#0D121D] border border-amber-600/40 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950/60 to-[#0D121D] border-b border-amber-800/30">
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-black text-white tracking-tight uppercase">
              Human Verification Required
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {approved ? (
          <div className="p-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-400 flex items-center justify-center animate-bounce">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-lg font-black text-white">Rescue Plan Authorized</h3>
            <p className="text-xs text-slate-300 font-sans">Field units dispatched. Mission #{Math.floor(2048 + Math.random() * 10)} authorized.</p>
          </div>
        ) : (
          <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">

            {/* Warning Banner */}
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-mono">AI analysis complete. Final execution requires human approval.</strong>
                <p className="text-amber-200/80 mt-1 font-sans leading-relaxed">
                  ResQShield AI will NEVER automatically execute a rescue plan. You are the final authority.
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 text-xs font-mono text-center">
              <div className="p-2 rounded bg-black/40 border border-white/5">
                <span className="text-slate-400 block text-[10px]">AI Confidence</span>
                <strong className="text-emerald-400">94.8%</strong>
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/5">
                <span className="text-slate-400 block text-[10px]">Plan Risk</span>
                <strong className="text-emerald-400">LOW (24)</strong>
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/5">
                <span className="text-slate-400 block text-[10px]">Alt. Reliability</span>
                <strong className="text-emerald-400">86%</strong>
              </div>
            </div>

            {/* Operator Checklist */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono mb-2">
                Mandatory Pre-Deployment Checklist
              </h4>
              <div className="space-y-2">
                {CHECKLIST.map(item => (
                  <label
                    key={item.id}
                    onClick={() => setChecked(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-black/40 border border-white/5 hover:border-white/15 cursor-pointer transition-all"
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                      checked[item.id] ? 'bg-emerald-600 border-emerald-500' : 'border-slate-500'
                    }`}>
                      {checked[item.id] && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-xs text-slate-200 font-sans leading-snug">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Authorization Notes</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onSendBack}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider hover:bg-white/5 transition-all"
              >
                Send Back for Reanalysis
              </button>
              <button
                onClick={handleApprove}
                disabled={!allChecked}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-emerald-glow disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" /> Approve Rescue Plan
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
