import React, { useState } from 'react';
import { useMission } from '../context/MissionContext';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Lock,
  Check,
  ArrowLeft,
  ArrowRight,
  Clock,
  Users,
  Truck,
  Radio,
  MapPin,
  Activity,
  Brain,
  FileCheck2,
  Info,
  Zap,
  BadgeCheck,
  UserCheck,
  Sparkles,
  Navigation,
  HeartPulse,
  Wifi,
  CircleCheck,
  ExternalLink,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────── */
const PLAN_META = {
  planId: 'RP-2026-CHN-094',
  altPlanId: 'RP-2026-CHN-094-ALT',
  disaster: 'Flood — Category 3',
  location: 'Kathipara Junction, Chennai',
  generatedAt: '20 Sep 2026, 12:24 IST',
};

const DECISION_METRICS = [
  { label: 'Risk Score', value: '29 / 100', sub: 'Low — within threshold', color: 'text-emerald-400', bar: 29, barColor: 'bg-emerald-500' },
  { label: 'Reliability', value: '96%', sub: 'High confidence', color: 'text-emerald-400', bar: 96, barColor: 'bg-emerald-500' },
  { label: 'Est. Rescue Time', value: '38 min', sub: 'Optimised route', color: 'text-cyan-400', bar: 62, barColor: 'bg-cyan-500' },
  { label: 'Hazard Exposure', value: '0 Zones', sub: 'Fully clear corridor', color: 'text-emerald-400', bar: 0, barColor: 'bg-emerald-500' },
  { label: 'Resource Availability', value: '54%', sub: 'Sufficient for mission', color: 'text-amber-400', bar: 54, barColor: 'bg-amber-500' },
];

const PLAN_SUMMARY_ITEMS = [
  { icon: Navigation, label: 'Selected Route', value: 'ECR Bypass → Pallavaram Dry Ridge', sub: '9.1 km • Elevated 18m ASL', color: 'text-cyan-400' },
  { icon: Users, label: 'Rescue Teams', value: '4 Teams (18 personnel)', sub: 'Alpha, Bravo, Charlie, Delta', color: 'text-white' },
  { icon: Truck, label: 'Vehicles', value: '5 Units', sub: '3× UGV-01 • 2× RIB Watercraft', color: 'text-white' },
  { icon: MapPin, label: 'Survivor Count', value: '247 Survivors', sub: 'Cluster Zone-C • GPS locked', color: 'text-amber-400' },
  { icon: ShieldCheck, label: 'Safe Location', value: 'Pallavaram Evacuation Centre', sub: 'Capacity: 600 • Active medical staff', color: 'text-emerald-400' },
  { icon: HeartPulse, label: 'Medical Resources', value: '4 Class-A Trauma Kits', sub: 'Hypothermia packs • Defibrillators', color: 'text-crimson-400' },
  { icon: Wifi, label: 'Communication Status', value: 'SATCOM Active', sub: 'UGV-01 · USV-04 · Triage Echo', color: 'text-emerald-400' },
];

const STRESS_TEST_SCENARIOS = [
  { scenario: 'Route Blocked — Kathipara Arterial', result: 'BYPASSED', detail: 'ECR alternate corridor selected. Passability: 100% on alternative.', passed: true },
  { scenario: 'Low Battery — Vehicle Fleet', result: 'MANAGED', detail: 'Pre-positioned battery trailer at staging zone. Margin: +41%.', passed: true },
  { scenario: 'Signal Loss — SATCOM Dropout', result: 'MITIGATED', detail: 'Mesh radio fallback activated. Autonomous waypoint navigation engaged.', passed: true },
  { scenario: 'New Hazard — Structural Collapse Risk', result: 'CLEAR', detail: 'ECR Bypass has no at-risk structures. GIS structural audit passed.', passed: true },
  { scenario: 'Survivor Location Error — ±200m GPS Drift', result: 'COMPENSATED', detail: 'Thermal UAV sweep confirmed cluster coordinates ±12m accuracy.', passed: true },
];

const CHECKLIST_ITEMS = [
  { key: 'routeReviewed', label: 'Route reviewed', desc: 'I have reviewed the ECR Bypass corridor and confirmed it is passable and cleared of hazards.' },
  { key: 'resourceReviewed', label: 'Resource allocation reviewed', desc: 'I have confirmed that vehicle count, personnel, and medical payload meet mission requirements.' },
  { key: 'hazardReviewed', label: 'Hazard conditions reviewed', desc: 'I have reviewed all active hazard zones and confirmed the selected route avoids them.' },
  { key: 'stressTestReviewed', label: 'Stress-test results reviewed', desc: 'I have reviewed the stress-test scenarios and verified the alternative plan passed all simulations.' },
  { key: 'altPlanReviewed', label: 'Alternative plan reviewed', desc: 'I have reviewed the AI-generated alternative plan and verified it against the original failed plan.' },
];

/* ─────────────────────────────────────────────
   APPROVAL CERTIFICATE SCREEN
───────────────────────────────────────────── */
function ApprovalCertificate({ 
  operatorName, 
  operatorId, 
  notes, 
  approvedAt, 
  altPlanId, 
  approvalData,
  location,
  onBackToDashboard 
}) {
  const authCode = approvalData?.approval_id || `ResQShield-AUTH-${Date.now().toString(36).toUpperCase()}`;
  const displayReviewer = approvalData?.reviewer || operatorName || 'Commander (Unnamed)';
  const displayStatus = approvalData?.status ? `${approvalData.decision} — ${approvalData.status}` : 'VERIFIED — HUMAN APPROVED';
  const displayPlanId = altPlanId || PLAN_META.altPlanId;
  const displayLocation = location || PLAN_META.location;

  return (
    <div className="min-h-full flex flex-col items-center justify-start pt-6 pb-20 space-y-6 font-mono">

      {/* Big success indicator */}
      <div className="flex flex-col items-center gap-4 text-center py-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-emerald-950/80 border-2 border-emerald-400 flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-12 h-12 text-emerald-400" />
          </div>
          <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
            <Check className="w-4 h-4 text-white" />
          </span>
        </div>
        <div>
          <div className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold mb-1">
            MISSION STATUS — VERIFIED & HUMAN APPROVED
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Rescue Plan Authorized
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-sans">
            ResQShield AI has logged your approval. Field teams may now be dispatched.
          </p>
        </div>
      </div>

      {/* Authorization certificate card */}
      <div className="w-full max-w-2xl rounded-xl bg-[#0D121D] border-2 border-emerald-500/40 overflow-hidden shadow-lg">
        <div className="px-5 py-3.5 bg-emerald-950/40 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <FileCheck2 className="w-4 h-4" />
            <span>AUTHORIZATION CERTIFICATE</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">{authCode}</span>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'PLAN ID', value: displayPlanId, col: 'text-white' },
              { label: 'APPROVAL STATUS', value: displayStatus, col: 'text-emerald-400' },
              { label: 'APPROVED BY', value: displayReviewer, col: 'text-white' },
              { label: 'OPERATOR ID', value: operatorId || 'TAC-UNSET', col: 'text-cyan-400' },
              { label: 'APPROVAL TIME', value: approvedAt, col: 'text-white' },
              { label: 'DISASTER ZONE', value: displayLocation, col: 'text-amber-400' },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded bg-black/50 border border-white/5">
                <span className="text-slate-400 text-[10px] uppercase block">{item.label}</span>
                <span className={`${item.col} font-bold mt-0.5 block`}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Notes */}
          {notes && (
            <div className="p-3 rounded bg-black/50 border border-white/5">
              <span className="text-slate-400 text-[10px] uppercase block mb-1">OPERATOR DECISION NOTES</span>
              <p className="text-slate-200 font-sans leading-relaxed">"{notes}"</p>
            </div>
          )}

          {/* Hash / audit trail */}
          <div className="p-3 rounded bg-emerald-950/30 border border-emerald-500/20 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-emerald-300 font-sans leading-relaxed">
              This authorization has been recorded in the ResQShield AI safety audit trail.
              {approvalData ? ` Backend Approval Record: ${approvalData.approval_id} (${approvalData.decision}).` : ' Simulated approval recorded.'}
              Encrypted dispatch commands queued for verified field units.
            </p>
          </div>

          {/* Verified summary */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'RISK SCORE', value: '29 / 100', col: 'text-emerald-400' },
              { label: 'RELIABILITY', value: '96%', col: 'text-emerald-400' },
              { label: 'SURVIVORS TARGETED', value: '247 civilians', col: 'text-amber-400' },
            ].map((s, i) => (
              <div key={i} className="p-2.5 rounded bg-black/40 border border-white/5 text-center">
                <span className="text-slate-400 text-[9px] uppercase block">{s.label}</span>
                <span className={`${s.col} font-bold text-sm block mt-0.5`}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onBackToDashboard}
        className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
      >
        <ShieldCheck className="w-4 h-4" />
        Return to Dashboard
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function HumanApprovalPage({
  planData,
  onBackToAlternativePlan,
  onBackToDashboard,
}) {
  const { 
    apiAltPlanId, 
    apiAltPlanData, 
    apiPlanId, 
    approvePlan, 
    rejectPlan, 
    apiApprovalData, 
    currentPlan 
  } = useMission();

  const [checklist, setChecklist] = useState({
    routeReviewed: false,
    resourceReviewed: false,
    hazardReviewed: false,
    stressTestReviewed: false,
    altPlanReviewed: false,
  });

  const [operatorName, setOperatorName] = useState('');
  const [operatorId, setOperatorId] = useState('');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approvalState, setApprovalState] = useState(null); // null | 'approved' | 'rejected'
  const [approvedAt, setApprovedAt] = useState('');

  const origId = apiPlanId || planData?.planId || currentPlan?.id || PLAN_META.planId;
  const altId = apiAltPlanId || apiAltPlanData?.alternative_plan_id || PLAN_META.altPlanId;
  const location = currentPlan?.disaster?.zone || currentPlan?.location || PLAN_META.location;
  const disaster = currentPlan?.disaster?.type ? `${currentPlan.disaster.type} — ${currentPlan.disaster.severity || 'Critical'}` : PLAN_META.disaster;

  const allChecked = Object.values(checklist).every(Boolean);
  const checkedCount = Object.values(checklist).filter(Boolean).length;

  const toggleCheck = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApprove = async () => {
    const now = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    });
    setApprovedAt(now + ' IST');

    try {
      await approvePlan(decisionNotes || 'Plan verified and approved for field execution', operatorName || 'Rescue Commander');
    } catch (err) {
      console.warn('[ResQShield API] Approval warning:', err.message);
    }
    setApprovalState('approved');
  };

  const handleRejectConfirm = async () => {
    setShowRejectModal(false);
    try {
      await rejectPlan(decisionNotes || 'Plan returned for operational recalculation', operatorName || 'Rescue Commander');
    } catch (err) {
      console.warn('[ResQShield API] Rejection warning:', err.message);
    }
    setApprovalState('rejected');
  };

  /* ── APPROVED STATE ── */
  if (approvalState === 'approved') {
    return (
      <ApprovalCertificate
        operatorName={operatorName}
        operatorId={operatorId}
        notes={decisionNotes}
        approvedAt={approvedAt}
        altPlanId={altId}
        approvalData={apiApprovalData}
        location={location}
        onBackToDashboard={onBackToDashboard}
      />
    );
  }

  /* ── REJECTED STATE ── */
  if (approvalState === 'rejected') {
    return (
      <div className="min-h-full flex flex-col items-center justify-start pt-10 pb-20 space-y-6 font-mono">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-20 h-20 rounded-full bg-crimson-950/80 border-2 border-crimson-500 flex items-center justify-center">
            <RotateCcw className="w-10 h-10 text-crimson-400" />
          </div>
          <div>
            <div className="text-[10px] text-crimson-400 uppercase tracking-widest font-bold mb-1">PLAN RETURNED FOR RE-ANALYSIS</div>
            <h1 className="text-2xl font-extrabold text-white">Plan Rejected & Returned</h1>
            <p className="text-sm text-slate-400 mt-1 font-sans max-w-md">
              The rescue plan has been returned for re-analysis. No operation was executed.
              Navigate back to generate a new alternative plan.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToAlternativePlan}
            className="px-6 py-3 rounded-xl bg-crimson-700 hover:bg-crimson-600 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Alternative Plan
          </button>
          <button
            onClick={onBackToDashboard}
            className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 font-bold text-xs uppercase tracking-wider transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  /* ── MAIN REVIEW STATE ── */
  return (
    <div className="min-h-full text-slate-100 font-sans pb-20 space-y-5">

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>FINAL MISSION AUTHORIZATION GATE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            Final Rescue Plan Review
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-sans max-w-lg">
            Human validation required before rescue execution. Review all evidence, complete the checklist, and authorize the plan.
          </p>

          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400">
              PLAN: <span className="text-white font-bold">{origId}</span>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-950/50 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
              ALT: <span className="text-emerald-300 font-bold">{altId}</span>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400">
              {disaster}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400">
              📍 {location}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-amber-950/50 border border-amber-500/30 text-[10px] font-mono text-amber-400 font-bold uppercase animate-pulse">
              ⏳ PENDING HUMAN APPROVAL
            </span>
          </div>
        </div>

        <button
          onClick={onBackToAlternativePlan}
          className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-slate-300 transition-all flex items-center gap-2 font-mono shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Alternative Plan
        </button>
      </div>

      {/* ── CRITICAL AI DISCLAIMER BANNER ── */}
      <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/35 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-white font-mono">
            "ResQShield AI does not automatically execute rescue operations."
          </p>
          <p className="text-xs text-amber-200/90 font-sans mt-1 leading-relaxed">
            All AI outputs are recommendations only. Life-critical disaster deployments require authorized human operator approval.
            Human command authority is legally accountable and always final.
          </p>
        </div>
      </div>

      {/* ── SECTION 1 — DECISION SUMMARY ── */}
      <div className="rounded-xl bg-[#0D121D] border border-white/10 overflow-hidden font-mono">
        <div className="px-4 py-3 bg-black/40 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">1. DECISION SUMMARY</span>
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-bold">
              ✓ STRESS TEST PASSED
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-bold">
              ✓ ALTERNATIVE PLAN VERIFIED
            </span>
          </div>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {DECISION_METRICS.map((m, i) => (
            <div key={i} className="p-4 rounded-lg bg-black/40 border border-white/8 space-y-2">
              <span className="text-slate-400 text-[10px] uppercase block">{m.label}</span>
              <div className={`text-xl font-extrabold ${m.color}`}>{m.value}</div>
              <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden border border-white/5">
                <div className={`h-full ${m.barColor} transition-all duration-700`} style={{ width: `${m.bar}%` }} />
              </div>
              <span className="text-[10px] text-slate-400 block">{m.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 2 — PLAN SUMMARY ── */}
      <div className="rounded-xl bg-[#0D121D] border border-white/10 overflow-hidden font-mono">
        <div className="px-4 py-3 bg-black/40 border-b border-white/10 flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">2. PLAN SUMMARY — {PLAN_META.altPlanId}</span>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PLAN_SUMMARY_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-lg bg-black/40 border border-white/8">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div className="min-w-0">
                  <span className="text-slate-400 text-[10px] uppercase block">{item.label}</span>
                  <span className={`text-xs font-bold ${item.color} block mt-0.5`}>{item.value}</span>
                  <span className="text-[10px] text-slate-500 block">{item.sub}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 3 — STRESS TEST EVIDENCE ── */}
      <div className="rounded-xl bg-[#0D121D] border border-white/10 overflow-hidden font-mono">
        <div className="px-4 py-3 bg-black/40 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">3. STRESS TEST EVIDENCE</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToAlternativePlan}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              View Full Alternative Plan
            </button>
          </div>
        </div>

        <div className="p-5 space-y-2">
          {STRESS_TEST_SCENARIOS.map((s, i) => (
            <div key={i} className={`flex items-start gap-3 p-3.5 rounded-lg border ${s.passed ? 'bg-emerald-950/15 border-emerald-500/20' : 'bg-crimson-950/20 border-crimson-500/30'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${s.passed ? 'bg-emerald-600' : 'bg-crimson-600'}`}>
                {s.passed ? <Check className="w-3 h-3 text-white" /> : <XCircle className="w-3 h-3 text-white" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-bold text-white">{s.scenario}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${s.passed ? 'bg-emerald-950/60 border border-emerald-600/40 text-emerald-400' : 'bg-crimson-950/60 border border-crimson-600/40 text-crimson-400'}`}>
                    {s.result}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">{s.detail}</p>
              </div>
            </div>
          ))}

          <div className="mt-3 p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-[11px] font-mono text-cyan-300">
            <Info className="w-3.5 h-3.5 inline mr-1.5" />
            Alternative plan remained feasible under all tested scenarios. 1,200 Monte Carlo perturbations run. Failure rate: 3.8%.
          </div>
        </div>
      </div>

      {/* ── SECTION 4 — AI RECOMMENDATION ── */}
      <div className="rounded-xl bg-gradient-to-r from-[#0E0D1F] via-[#0F0E22] to-[#0E0D1F] border border-purple-500/30 overflow-hidden font-mono">
        <div className="px-4 py-3 bg-black/40 border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">4. AI RECOMMENDATION</span>
          </div>
          <span className="text-[10px] text-purple-300 px-2 py-0.5 rounded bg-purple-950/50 border border-purple-500/30 font-bold">
            AI ADVISORY — NOT AUTOMATIC DECISION
          </span>
        </div>

        <div className="p-5 space-y-4">
          <div className="p-4 rounded-lg bg-black/50 border border-purple-500/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/60 rounded-l-lg" />
            <div className="pl-3">
              <div className="flex items-center gap-2 text-[10px] text-purple-400 font-bold uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                ResQShield AI — Analysis Output
              </div>
              <p className="text-sm text-slate-200 font-sans leading-relaxed">
                "The alternative rescue plan <strong className="text-white">significantly reduces simulated risk</strong> from 91 to 29/100
                and maintains sufficient resource availability under all tested scenarios. The ECR Bypass route provides
                an elevated, structurally stable corridor with zero active hazard zones. The plan is estimated to reach
                98% of survivor clusters within 38 minutes under normal execution conditions."
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {[
              { label: 'AI Confidence', value: '96.2%', color: 'text-emerald-400' },
              { label: 'Scenarios Passed', value: '5 / 5', color: 'text-emerald-400' },
              { label: 'Monte Carlo Runs', value: '1,200', color: 'text-cyan-400' },
              { label: 'Failure Rate', value: '3.8%', color: 'text-amber-400' },
            ].map((s, i) => (
              <div key={i} className="p-3 rounded bg-black/40 border border-purple-500/15 text-center">
                <span className="text-slate-400 text-[10px] uppercase block">{s.label}</span>
                <span className={`text-lg font-extrabold ${s.color} block mt-0.5`}>{s.value}</span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-amber-950/25 border border-amber-500/25 text-[10px] font-mono text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>IMPORTANT:</strong> This is an AI advisory output, not an automatic decision. All recommendations are simulations.
              The human operator retains full command authority and legal accountability.
            </span>
          </div>
        </div>
      </div>

      {/* ── SECTION 5 — HUMAN REVIEW CHECKLIST ── */}
      <div className="rounded-xl bg-[#0D121D] border border-white/10 overflow-hidden font-mono">
        <div className="px-4 py-3 bg-black/40 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">5. HUMAN REVIEW CHECKLIST</span>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full font-mono transition-all ${allChecked ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-400' : 'bg-amber-950/50 border border-amber-500/30 text-amber-400'}`}>
            {checkedCount} / {CHECKLIST_ITEMS.length} COMPLETED
          </span>
        </div>

        <div className="p-5 space-y-2.5">
          <p className="text-[11px] text-slate-400 font-sans mb-3">
            All items must be reviewed and confirmed before the Approve button becomes active.
            These confirmations serve as your operator accountability record.
          </p>

          {CHECKLIST_ITEMS.map((item) => {
            const isChecked = checklist[item.key];
            return (
              <label
                key={item.key}
                onClick={() => toggleCheck(item.key)}
                className={`flex items-start gap-3.5 p-4 rounded-lg border cursor-pointer transition-all select-none ${
                  isChecked
                    ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50'
                    : 'bg-black/30 border-white/8 hover:border-white/20'
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center border shrink-0 mt-0.5 transition-all ${
                  isChecked ? 'bg-emerald-600 border-emerald-500' : 'border-slate-500 bg-black/40'
                }`}>
                  {isChecked && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="min-w-0">
                  <span className={`text-xs font-bold block ${isChecked ? 'text-emerald-300' : 'text-slate-200'}`}>
                    {item.label}
                  </span>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </label>
            );
          })}

          {!allChecked && (
            <div className="flex items-center gap-2 text-[10px] text-amber-400 font-mono pt-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Complete all {CHECKLIST_ITEMS.length} checklist items to enable the Approve button.</span>
            </div>
          )}
          {allChecked && (
            <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono pt-1">
              <CircleCheck className="w-3.5 h-3.5" />
              <span>All items verified. You may now proceed to the final decision.</span>
            </div>
          )}
        </div>
      </div>

      {/* ── SECTION 6 — FINAL DECISION GATE ── */}
      <div className={`rounded-xl border-2 overflow-hidden font-mono transition-all duration-500 ${
        allChecked
          ? 'bg-gradient-to-br from-[#081A10] via-[#0B1D12] to-[#081A10] border-emerald-500/60 shadow-lg'
          : 'bg-[#0D121D] border-white/15'
      }`}>
        <div className={`px-4 py-3 border-b flex items-center justify-between ${allChecked ? 'bg-emerald-950/30 border-emerald-500/20' : 'bg-black/40 border-white/10'}`}>
          <div className="flex items-center gap-2">
            <UserCheck className={`w-4 h-4 ${allChecked ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span className="text-xs font-bold text-white uppercase tracking-wider">6. FINAL DECISION</span>
          </div>
          {!allChecked && (
            <span className="text-[10px] text-slate-500 font-mono">Complete checklist to unlock</span>
          )}
        </div>

        <div className="p-6 space-y-5">
          {/* Decision declaration */}
          <div className="text-center space-y-1.5">
            <div className={`text-xs font-bold uppercase tracking-widest font-mono ${allChecked ? 'text-emerald-400' : 'text-slate-500'}`}>
              HUMAN APPROVAL REQUIRED
            </div>
            <h2 className="text-xl font-extrabold text-white">
              {allChecked
                ? 'Ready for Authorization'
                : 'Awaiting Checklist Completion'}
            </h2>
            <p className="text-xs text-slate-400 font-sans max-w-lg mx-auto">
              ResQShield AI does not automatically execute rescue operations.
              Final execution requires authorized human approval and operator sign-off.
            </p>
          </div>

          {/* Operator info fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 text-[10px] uppercase mb-1.5">COMMANDING OPERATOR</label>
              <input
                type="text"
                placeholder="e.g. Commander Alex Chen"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-black/60 border border-white/15 text-white focus:outline-none focus:border-emerald-500 transition-colors text-xs font-sans"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[10px] uppercase mb-1.5">AUTHORIZATION KEY ID</label>
              <input
                type="text"
                placeholder="e.g. TAC-AI-881"
                value={operatorId}
                onChange={(e) => setOperatorId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-black/60 border border-white/15 text-cyan-400 font-mono focus:outline-none focus:border-emerald-500 transition-colors text-xs"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-400 text-[10px] uppercase mb-1.5">OPERATOR DECISION NOTES (optional)</label>
              <textarea
                rows={2}
                placeholder="e.g. Corridor verified via UAV-12 thermal feed. Ground team dispatched on Eastern Causeway."
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-black/60 border border-white/15 text-white focus:outline-none focus:border-emerald-500 transition-colors text-xs font-sans resize-none"
              />
            </div>
          </div>

          {/* Decision buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
            <button
              onClick={() => setShowRejectModal(true)}
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-crimson-950/40 hover:border-crimson-600/40 border border-white/15 text-xs text-slate-300 hover:text-crimson-300 font-bold uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reject & Recalculate
            </button>

            <button
              onClick={handleApprove}
              disabled={!allChecked}
              className={`px-10 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2.5 ${
                allChecked
                  ? 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-600 hover:from-emerald-500 hover:to-emerald-500 text-white shadow-lg cursor-pointer'
                  : 'bg-white/5 border border-white/10 text-slate-600 cursor-not-allowed'
              }`}
            >
              <ShieldCheck className={`w-5 h-5 ${allChecked ? 'text-white' : 'text-slate-600'}`} />
              <span>Approve Rescue Plan</span>
              {allChecked && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── REJECT MODAL ── */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 font-mono">
          <div className="w-full max-w-md bg-[#0D121D] border border-crimson-600/50 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-crimson-400 font-bold">
              <AlertTriangle className="w-5 h-5" />
              <span>REJECT & RETURN FOR RE-ANALYSIS</span>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Rejecting this plan will return it to the Alternative Plan stage for re-analysis.
              No rescue operation will be executed. The AI will be available to generate a revised plan.
            </p>
            <div className="p-3 rounded bg-crimson-950/30 border border-crimson-600/30 text-[11px] text-crimson-300 font-sans">
              Plan <strong>{PLAN_META.altPlanId}</strong> will be returned. Status will be set to
              "RETURNED FOR REANALYSIS".
            </div>
            <div className="flex items-center justify-end gap-3 text-xs pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-5 py-2 rounded bg-crimson-600 hover:bg-crimson-500 text-white font-bold transition-all"
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
