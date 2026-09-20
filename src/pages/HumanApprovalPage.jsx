import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserCheck, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Lock, 
  Key, 
  Check, 
  Radio, 
  Send,
  ArrowRight,
  FileCheck2
} from 'lucide-react';
import WorkflowStepper from '../components/common/WorkflowStepper';
import { useMission } from '../context/MissionContext';
import { alternativePlanData } from '../data/scenarios';

export default function HumanApprovalPage() {
  const navigate = useNavigate();
  const { currentPlan, alternativePlan, approvePlan, rejectPlan, approvalStatus } = useMission();

  const [operatorName, setOperatorName] = useState("Commander Alex Chen");
  const [operatorId, setOperatorId] = useState("TAC-AI-881");
  const [authorizationNotes, setAuthorizationNotes] = useState("Corridor verified via UAV-12 thermal feed. Ground team dispatched on Eastern Causeway.");
  const [checklist, setChecklist] = useState({
    hazardClearance: true,
    batteryEnvelope: true,
    medicalPayload: true,
    failsafeComms: true,
    humanCommandOverride: true
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const plan = alternativePlan || {
    ...alternativePlanData,
    id: `${currentPlan.id}-ALT`
  };

  const allChecked = Object.values(checklist).every(Boolean);

  const handleApprove = () => {
    approvePlan(authorizationNotes);
    setShowSuccessModal(true);
  };

  const handleSendBack = () => {
    rejectPlan("Sent back by operator during final verification gate.");
    navigate('/create-plan');
  };

  const toggleCheck = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#080A0F] text-slate-100 font-sans pb-16 font-mono">
      <WorkflowStepper />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* TOP HEADER */}
        <div className="pb-6 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>FINAL MISSION AUTHORIZATION GATE</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Human Verification Required
          </h1>

          {/* CRITICAL HUMAN-IN-THE-LOOP DISCLAIMER */}
          <div className="mt-3 p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs sm:text-sm font-sans flex items-start gap-3 shadow-md">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-mono block mb-0.5">
                “AI analysis completed. Final execution requires human approval.”
              </strong>
              <p className="text-amber-200/90 text-xs leading-relaxed">
                Autonomous AI algorithms simulate risks and propose optimal detours, but life-critical disaster 
                deployments never execute automatically. Human command authority remains final and legally accountable.
              </p>
            </div>
          </div>
        </div>

        {/* VERIFICATION DOSSIER CARD */}
        <div className="p-6 rounded-xl bg-[#0D121D] border border-white/10 shadow-command space-y-6">
          
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
            <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-cyan-400" />
              MISSION AUTHORIZATION DOSSIER: #{plan.id}
            </span>
            <span className="text-[10px] text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 font-bold">
              AI CONFIDENCE: 94.8%
            </span>
          </div>

          {/* Key Parameters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            {/* Current Plan */}
            <div className="p-3.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase block">CURRENT PLAN IDENTIFIER</span>
              <strong className="text-white text-sm block">#{plan.id} (Alternative Bypass)</strong>
              <span className="text-slate-400 text-[11px] block">Derived from baseline #{currentPlan.id}</span>
            </div>

            {/* Alternative Route */}
            <div className="p-3.5 rounded-lg bg-black/40 border border-emerald-500/30 space-y-1">
              <span className="text-emerald-400 text-[10px] uppercase block">AUTHORIZED ROUTE CORRIDOR</span>
              <strong className="text-white text-sm block">Eastern Elevated Causeway Bypass</strong>
              <span className="text-emerald-400 text-[11px] block">18m above peak flood surge level</span>
            </div>

            {/* Detected Failures */}
            <div className="p-3.5 rounded-lg bg-black/40 border border-crimson-600/30 space-y-1">
              <span className="text-crimson-400 text-[10px] uppercase block">DETECTED STRESS FAILURES</span>
              <strong className="text-crimson-300 text-xs block">
                Primary Overpass Sector B Impassable (1.8m water)
              </strong>
              <span className="text-slate-400 text-[10px] block">
                Bypassed via high-elevation rail embankment
              </span>
            </div>

            {/* Main Risks */}
            <div className="p-3.5 rounded-lg bg-black/40 border border-amber-500/30 space-y-1">
              <span className="text-amber-400 text-[10px] uppercase block">RESIDUAL MITIGATED RISKS</span>
              <strong className="text-amber-300 text-xs block">
                Minor Crosswinds (48 km/h) on Eastern Ridge
              </strong>
              <span className="text-slate-400 text-[10px] block">
                Within UGV gyro stability safety margins
              </span>
            </div>

            {/* Remaining Resources */}
            <div className="p-3.5 rounded-lg bg-black/40 border border-white/5 space-y-1 sm:col-span-2">
              <span className="text-slate-400 text-[10px] uppercase block">REMAINING RESOURCES & PAYLOAD</span>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <div>
                  <span className="text-[10px] text-slate-500 block">BATTERY RESERVE</span>
                  <span className="text-emerald-400 font-bold">52% Reserve Retained</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">TEAM CAPACITY</span>
                  <span className="text-white font-bold">18 Max Civilians</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">MEDICAL PACKS</span>
                  <span className="text-white font-bold">Class-A Trauma / 4 Beds</span>
                </div>
              </div>
            </div>

          </div>

          {/* HUMAN COMMANDER MANDATORY PRE-FLIGHT CHECKLIST */}
          <div className="pt-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-3">
              Mandatory Operator Verification Protocol:
            </span>

            <div className="space-y-2 text-xs">
              
              <label 
                onClick={() => toggleCheck('hazardClearance')}
                className="flex items-center gap-3 p-2.5 rounded bg-black/40 border border-white/5 hover:border-white/20 cursor-pointer"
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                  checklist.hazardClearance ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-500'
                }`}>
                  {checklist.hazardClearance && <Check className="w-3 h-3" />}
                </div>
                <span className="text-slate-200">
                  I have confirmed that the Eastern Causeway route has zero active high-voltage power hazards.
                </span>
              </label>

              <label 
                onClick={() => toggleCheck('batteryEnvelope')}
                className="flex items-center gap-3 p-2.5 rounded bg-black/40 border border-white/5 hover:border-white/20 cursor-pointer"
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                  checklist.batteryEnvelope ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-500'
                }`}>
                  {checklist.batteryEnvelope && <Check className="w-3 h-3" />}
                </div>
                <span className="text-slate-200">
                  Fleet battery capacity exceeds minimum return-to-safe-zone threshold (+35% margin).
                </span>
              </label>

              <label 
                onClick={() => toggleCheck('medicalPayload')}
                className="flex items-center gap-3 p-2.5 rounded bg-black/40 border border-white/5 hover:border-white/20 cursor-pointer"
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                  checklist.medicalPayload ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-500'
                }`}>
                  {checklist.medicalPayload && <Check className="w-3 h-3" />}
                </div>
                <span className="text-slate-200">
                  Hypothermia trauma kits allocated for all 14 tagged survivors on Haven 4B.
                </span>
              </label>

              <label 
                onClick={() => toggleCheck('humanCommandOverride')}
                className="flex items-center gap-3 p-2.5 rounded bg-black/40 border border-white/5 hover:border-white/20 cursor-pointer"
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                  checklist.humanCommandOverride ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-500'
                }`}>
                  {checklist.humanCommandOverride && <Check className="w-3 h-3" />}
                </div>
                <span className="text-slate-200 font-semibold text-emerald-300">
                  I am executing human command authority to authorize mission dispatch under protocol RESCUE-STD-10.
                </span>
              </label>

            </div>
          </div>

          {/* OPERATOR SIGN-OFF FORM */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">COMMANDING OPERATOR</label>
              <input
                type="text"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="w-full px-3 py-2 rounded bg-black/60 border border-white/15 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">AUTHORIZATION KEY ID</label>
              <input
                type="text"
                value={operatorId}
                onChange={(e) => setOperatorId(e.target.value)}
                className="w-full px-3 py-2 rounded bg-black/60 border border-white/15 text-cyan-400 font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1">COMMAND DISPATCH NOTES</label>
              <input
                type="text"
                value={authorizationNotes}
                onChange={(e) => setAuthorizationNotes(e.target.value)}
                className="w-full px-3 py-2 rounded bg-black/60 border border-white/15 text-white"
              />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handleSendBack}
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>SEND BACK FOR REANALYSIS</span>
            </button>

            <button
              onClick={handleApprove}
              disabled={!allChecked}
              className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-emerald-glow flex items-center gap-2 disabled:opacity-40"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>APPROVE RESCUE PLAN</span>
            </button>
          </div>

        </div>

      </div>

      {/* DISPATCH SUCCESS CONFIRMATION MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 font-mono select-none">
          <div className="w-full max-w-lg bg-[#0C1518] border-2 border-emerald-500/60 rounded-2xl p-8 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-emerald-glow animate-bounce">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-emerald-400 tracking-widest uppercase font-bold">
                OPERATIONAL STATUS: VERIFIED & AUTHORIZED
              </span>
              <h2 className="text-xl font-extrabold text-white">
                Rescue Plan Dispatched to Field Units
              </h2>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Mission #{plan.id} has been signed off by {operatorName}. Encrypted vector coordinates 
              transmitted to UGV-01, USV-04, and Triage Team Echo via SATCOM link.
            </p>

            <div className="p-3 rounded-lg bg-black/50 border border-emerald-500/30 text-xs text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">AUTHORIZATION HASH:</span>
                <span className="text-emerald-300 font-mono">0x88A2...F91C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">DEPLOYMENT TIME:</span>
                <span className="text-white font-mono">{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">SURVIVORS TARGETED:</span>
                <span className="text-amber-400 font-mono">14 Civilians</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/incidents');
                }}
                className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold uppercase tracking-wider"
              >
                View Incident Timeline
              </button>

              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/dashboard');
                }}
                className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-emerald-glow"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
