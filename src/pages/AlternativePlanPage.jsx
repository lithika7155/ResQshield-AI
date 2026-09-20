import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GitFork, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  Battery, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Info, 
  ArrowRight,
  TrendingDown,
  TrendingUp,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import WorkflowStepper from '../components/common/WorkflowStepper';
import RouteVisualizer from '../components/common/RouteVisualizer';
import { useMission } from '../context/MissionContext';
import { alternativePlanData } from '../data/scenarios';

export default function AlternativePlanPage() {
  const navigate = useNavigate();
  const { currentPlan, alternativePlan, rejectPlan } = useMission();
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const plan = alternativePlan || {
    ...alternativePlanData,
    basedOn: currentPlan.id,
    id: `${currentPlan.id}-ALT`
  };

  const handleApprove = () => {
    navigate('/approval');
  };

  const handleConfirmReject = () => {
    rejectPlan(rejectReason || "Operator requested alternative corridor recalculation.");
    setShowRejectModal(false);
    navigate('/analysis');
  };

  return (
    <div className="min-h-screen bg-[#080A0F] text-slate-100 font-sans pb-16">
      <WorkflowStepper />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI RESILIENCE SYNTHESIS COMPLETE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight flex items-center gap-3">
              <span>Alternative Rescue Plan</span>
              <span className="text-xs px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono shadow-emerald-glow">
                #{plan.id}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
              Calculated to bypass simulated failure points on Plan #{plan.basedOn}.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 font-mono">
            <button
              onClick={() => setShowRejectModal(true)}
              className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-crimson-950/40 hover:border-crimson-600/50 border border-white/10 text-xs text-slate-300 hover:text-crimson-300 transition-all flex items-center gap-2"
            >
              <XCircle className="w-4 h-4 text-crimson-400" />
              <span>REJECT & RECALCULATE</span>
            </button>

            <button
              onClick={handleApprove}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-emerald-glow flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>APPROVE PLAN</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SIMULATION VALUE DISCLAIMER BANNER */}
        <div className="p-3.5 rounded-lg bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between gap-3 text-xs font-mono text-cyan-300">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>NOTICE:</strong> All comparison metrics represent simulated values generated via Monte Carlo perturbations and GIS elevation mapping.
            </span>
          </div>
          <span className="text-[10px] text-slate-400 uppercase hidden md:inline">
            CONFIDENCE: 94.8%
          </span>
        </div>

        {/* SIDE-BY-SIDE COMPARISON: ORIGINAL PLAN vs ALTERNATIVE PLAN */}
        <div className="rounded-xl bg-[#0D121D] border border-white/10 overflow-hidden shadow-command font-mono">
          <div className="p-4 bg-black/40 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              TACTICAL COMPARISON: ORIGINAL PLAN vs. ALTERNATIVE PLAN
            </span>
            <span className="text-[10px] text-slate-400">
              OPTIMIZED FOR MAXIMUM SURVIVOR SAFETY MARGIN
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
            
            {/* ORIGINAL PLAN COLUMN */}
            <div className="p-6 space-y-5 bg-[#10141d]/50">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-crimson-500" />
                  <span className="text-sm font-bold text-slate-300">ORIGINAL PLAN (#{plan.basedOn})</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-crimson-950/60 border border-crimson-600/40 text-crimson-400 uppercase font-bold">
                  FAILED UNDER STRESS
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-3 rounded bg-black/40 border border-white/5">
                  <span className="text-slate-400 text-[10px] uppercase block">Assigned Corridor</span>
                  <span className="text-slate-200 font-semibold mt-0.5 block">{plan.comparison.route.original}</span>
                  <span className="text-crimson-400 text-[10px] mt-1 block">Submerged at 1.8m water level</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded bg-black/40 border border-white/5">
                    <span className="text-slate-400 text-[10px] uppercase block">Risk Score</span>
                    <div className="text-xl font-bold text-crimson-400 mt-0.5">
                      {plan.comparison.riskScore.original}
                    </div>
                    <span className="text-slate-400 text-[10px]">Unacceptable</span>
                  </div>

                  <div className="p-3 rounded bg-black/40 border border-white/5">
                    <span className="text-slate-400 text-[10px] uppercase block">Reliability</span>
                    <div className="text-xl font-bold text-crimson-400 mt-0.5">
                      {plan.comparison.reliability.original}
                    </div>
                    <span className="text-slate-400 text-[10px]">Below threshold</span>
                  </div>

                  <div className="p-3 rounded bg-black/40 border border-white/5">
                    <span className="text-slate-400 text-[10px] uppercase block">Est. Time to Extract</span>
                    <div className="text-xl font-bold text-slate-300 mt-0.5">
                      {plan.comparison.estimatedTime.original}
                    </div>
                    <span className="text-crimson-400 text-[10px]">+19m delay</span>
                  </div>

                  <div className="p-3 rounded bg-black/40 border border-white/5">
                    <span className="text-slate-400 text-[10px] uppercase block">Resource Draw</span>
                    <div className="text-xl font-bold text-amber-400 mt-0.5">
                      {plan.comparison.resourceUsage.original}
                    </div>
                    <span className="text-slate-400 text-[10px]">Critical battery draw</span>
                  </div>
                </div>

                <div className="p-3 rounded bg-black/40 border border-white/5">
                  <span className="text-slate-400 text-[10px] uppercase block">Hazard Exposure</span>
                  <span className="text-crimson-400 font-semibold mt-0.5 block">{plan.comparison.hazardExposure.original}</span>
                </div>
              </div>
            </div>

            {/* ALTERNATIVE PLAN COLUMN */}
            <div className="p-6 space-y-5 bg-gradient-to-b from-[#0c1817]/40 to-[#0d141e]/70">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-sm font-bold text-emerald-300">ALTERNATIVE PLAN (#{plan.id})</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 uppercase font-bold shadow-emerald-glow">
                  RECOMMENDED BY AI
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-3 rounded bg-black/40 border border-emerald-500/30">
                  <span className="text-emerald-400 text-[10px] uppercase block">Assigned Corridor</span>
                  <span className="text-white font-semibold mt-0.5 block">{plan.comparison.route.alternative}</span>
                  <span className="text-emerald-400 text-[10px] mt-1 block">Elevated dry grade (18m ASL)</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded bg-black/40 border border-emerald-500/20">
                    <span className="text-slate-400 text-[10px] uppercase block">Risk Score</span>
                    <div className="text-xl font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                      <span>{plan.comparison.riskScore.alternative}</span>
                      <TrendingDown className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-emerald-400 text-[10px]">{plan.comparison.riskScore.diff}</span>
                  </div>

                  <div className="p-3 rounded bg-black/40 border border-emerald-500/20">
                    <span className="text-slate-400 text-[10px] uppercase block">Reliability</span>
                    <div className="text-xl font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                      <span>{plan.comparison.reliability.alternative}</span>
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-emerald-400 text-[10px]">{plan.comparison.reliability.diff}</span>
                  </div>

                  <div className="p-3 rounded bg-black/40 border border-emerald-500/20">
                    <span className="text-slate-400 text-[10px] uppercase block">Est. Time to Extract</span>
                    <div className="text-xl font-bold text-white mt-0.5 flex items-center gap-1">
                      <span>{plan.comparison.estimatedTime.alternative}</span>
                      <TrendingDown className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-emerald-400 text-[10px]">{plan.comparison.estimatedTime.diff}</span>
                  </div>

                  <div className="p-3 rounded bg-black/40 border border-emerald-500/20">
                    <span className="text-slate-400 text-[10px] uppercase block">Resource Draw</span>
                    <div className="text-xl font-bold text-emerald-400 mt-0.5">
                      {plan.comparison.resourceUsage.alternative}
                    </div>
                    <span className="text-emerald-400 text-[10px]">{plan.comparison.resourceUsage.diff}</span>
                  </div>
                </div>

                <div className="p-3 rounded bg-black/40 border border-emerald-500/20">
                  <span className="text-slate-400 text-[10px] uppercase block">Hazard Exposure</span>
                  <span className="text-emerald-400 font-semibold mt-0.5 block">{plan.comparison.hazardExposure.alternative}</span>
                  <span className="text-slate-400 text-[10px]">{plan.comparison.hazardExposure.diff}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* WHY THIS PLAN CHANGED SECTION */}
        <div className="p-6 rounded-xl bg-[#0D121D] border border-white/10 shadow-command font-mono relative overflow-hidden">
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-2">
            <Info className="w-4 h-4" />
            <span>WHY THIS PLAN CHANGED (AI RATIONALE)</span>
          </div>

          <p className="text-sm text-slate-200 font-sans leading-relaxed bg-black/40 p-4 rounded-lg border border-white/5">
            “{plan.whyPlanChanged}”
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded bg-white/5 border border-white/5">
              <span className="text-slate-400 text-[10px] uppercase block">TERRAIN STABILITY</span>
              <strong className="text-emerald-400 mt-0.5 block">100% Paved Rail Embankment</strong>
            </div>
            <div className="p-3 rounded bg-white/5 border border-white/5">
              <span className="text-slate-400 text-[10px] uppercase block">BATTERY SAVINGS</span>
              <strong className="text-cyan-400 mt-0.5 block">+41% Reserve Retained</strong>
            </div>
            <div className="p-3 rounded bg-white/5 border border-white/5">
              <span className="text-slate-400 text-[10px] uppercase block">SURVIVOR MARGIN</span>
              <strong className="text-emerald-400 mt-0.5 block">{plan.survivorSafetyMargin}</strong>
            </div>
          </div>
        </div>

        {/* ROUTE COMPARISON VISUALIZER */}
        <RouteVisualizer
          mode="comparison"
          title="VECTOR COMPARISON (ORIGINAL BLOCKED VS. ALTERNATIVE BYPASS)"
          interactive={true}
        />

        {/* FINAL ACTION BAR */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono">
          <div className="text-xs text-slate-400">
            Next step: Human Verification Gate. AI requires operator signature before field dispatch.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRejectModal(true)}
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-slate-300 font-bold uppercase tracking-wider"
            >
              REJECT & RECALCULATE
            </button>

            <button
              onClick={handleApprove}
              className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-emerald-glow flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>PROCEED TO HUMAN APPROVAL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* REJECTION MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono select-none">
          <div className="w-full max-w-md bg-[#0D121D] border border-crimson-600/50 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-crimson-400 font-bold text-sm mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span>REJECT ALTERNATIVE PLAN</span>
            </div>
            <p className="text-xs text-slate-400 font-sans mb-4">
              Specify reason for rejecting this alternative corridor. The AI will re-evaluate parameters.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Tactical constraints require prioritizing watercraft extraction..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 rounded bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-crimson-500 mb-4"
            />
            <div className="flex items-center justify-end gap-3 text-xs">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded bg-crimson-600 hover:bg-crimson-500 text-white font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
