import React, { useState, useEffect } from 'react';
import { useMission } from '../context/MissionContext';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  TrendingDown,
  TrendingUp,
  Info,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Route,
  Zap,
  Activity,
  Users,
  Truck,
  BarChart2,
  MapPin,
  ChevronRight,
  Brain,
  FlaskConical,
  TriangleAlert,
  CircleCheck,
  Navigation,
  Compass
} from 'lucide-react';

/* ─────────────────────────────────────────────
   MOCK DATA — All values simulated
───────────────────────────────────────────── */
const ORIGINAL = {
  planId: 'RP-2026-CHN-094',
  route: 'Kathipara Arterial Overpass → NH-844 South → Zone-C Survivor Cluster',
  travelTime: '67 min',
  riskScore: 91,
  reliability: '54%',
  resourceUsage: '88%',
  hazardExposure: '3 Active Zones',
  survivorReach: '62%',
  routeDistance: '12.4 km',
  rescueTeams: 4,
  vehicles: 6,
  status: 'FAILED UNDER SIMULATION',
};

const ALTERNATIVE = {
  planId: 'RP-2026-CHN-094-ALT',
  route: 'Elevated Coastal Corridor (ECR Bypass) → GST Road Elevated → Pallavaram Dry Ridge',
  travelTime: '38 min',
  riskScore: 29,
  reliability: '96%',
  resourceUsage: '54%',
  hazardExposure: '0 Active Zones',
  survivorReach: '98%',
  routeDistance: '9.1 km',
  rescueTeams: 4,
  vehicles: 5,
  status: 'AI RECOMMENDED',
};

const COMPARISON_METRICS = [
  {
    label: 'Risk Score',
    original: 91,
    alternative: 29,
    unit: '/100',
    direction: 'lower_better',
    origColor: 'text-crimson-400',
    altColor: 'text-emerald-400',
    origBar: 'bg-crimson-500',
    altBar: 'bg-emerald-500',
    diff: '−62 pts',
    diffGood: true,
  },
  {
    label: 'Reliability',
    original: 54,
    alternative: 96,
    unit: '%',
    direction: 'higher_better',
    origColor: 'text-crimson-400',
    altColor: 'text-emerald-400',
    origBar: 'bg-crimson-500',
    altBar: 'bg-emerald-500',
    diff: '+42 pts',
    diffGood: true,
  },
  {
    label: 'Resource Usage',
    original: 88,
    alternative: 54,
    unit: '%',
    direction: 'lower_better',
    origColor: 'text-amber-400',
    altColor: 'text-emerald-400',
    origBar: 'bg-amber-500',
    altBar: 'bg-emerald-500',
    diff: '−34%',
    diffGood: true,
  },
  {
    label: 'Survivor Reach',
    original: 62,
    alternative: 98,
    unit: '%',
    direction: 'higher_better',
    origColor: 'text-crimson-400',
    altColor: 'text-emerald-400',
    origBar: 'bg-crimson-500',
    altBar: 'bg-emerald-500',
    diff: '+36%',
    diffGood: true,
  },
];

const AI_REASONING_STEPS = [
  {
    step: 1,
    icon: ShieldAlert,
    color: 'crimson',
    title: 'FAILURE POINT IDENTIFICATION',
    body: 'Primary route (Kathipara Arterial) flagged inoperative due to 1.8 m surge inundation. Structural sonar confirmed 3.4 m/s crosscurrent exceeding vehicle passability threshold. Zero ingress probability.',
  },
  {
    step: 2,
    icon: Brain,
    color: 'cyan',
    title: 'TERRAIN GRAPH RE-ROUTING',
    body: 'GIS elevation model queried across 14 alternative corridors. ECR Bypass selected as highest-ASL (18 m) paved dry path. Rail embankment provides full structural stability with no submersion risk within 72-hour flood forecast.',
  },
  {
    step: 3,
    icon: FlaskConical,
    color: 'amber',
    title: 'MONTE CARLO STRESS VALIDATION',
    body: 'Alternative plan subjected to 1,200 randomised perturbation scenarios (surge acceleration, comms dropout, battery degradation). Failure rate: 3.8%. Confidence score: 96.2%. Risk score stabilises at 29/100 across all scenario bands.',
  },
  {
    step: 4,
    icon: Zap,
    color: 'emerald',
    title: 'RESOURCE REOPTIMISATION',
    body: 'Vehicle count reduced by 1 unit (lighter ECR terrain). Battery trailer pre-positioned at Pallavaram Staging Zone. Net energy draw reduced 34%. All 4 rescue teams repositioned to eastern egress points adjacent to survivor cluster.',
  },
  {
    step: 5,
    icon: CircleCheck,
    color: 'emerald',
    title: 'ALTERNATIVE PLAN APPROVED FOR HUMAN REVIEW',
    body: 'All thresholds satisfied: Risk < 35, Reliability > 90%, Hazard Exposure = 0 zones. Plan forwarded to Human Operator Approval Gate. Field dispatch blocked pending authorization signature.',
  },
];

const ROBUSTNESS_CHECKS = [
  { label: 'Flood Surge Resilience', value: 'PASS', pct: 100, color: 'emerald' },
  { label: 'Battery Envelope Check', value: 'PASS', pct: 98, color: 'emerald' },
  { label: 'Comms Link Stability', value: 'PASS', pct: 94, color: 'emerald' },
  { label: 'Vehicle Terrain Rating', value: 'PASS', pct: 100, color: 'emerald' },
  { label: 'Medical Payload Integrity', value: 'PASS', pct: 96, color: 'emerald' },
  { label: 'Route Structural Score', value: 'PASS', pct: 100, color: 'emerald' },
];

const RESOURCE_DIFF = [
  { label: 'Rescue Teams', original: 4, alternative: 4, icon: Users, change: 'same' },
  { label: 'Ground Vehicles', original: 6, alternative: 5, icon: Truck, change: 'down' },
  { label: 'Route Distance', original: '12.4 km', alternative: '9.1 km', icon: Route, change: 'down' },
  { label: 'Est. Rescue Time', original: '67 min', alternative: '38 min', icon: Clock, change: 'down' },
  { label: 'Hazard Zones', original: 3, alternative: 0, icon: TriangleAlert, change: 'down' },
  { label: 'Survivor Reach', original: '62%', alternative: '98%', icon: ShieldCheck, change: 'up' },
];

/* ─────────────────────────────────────────────
   ROUTE VISUALIZER — Pure SVG map
───────────────────────────────────────────── */
function RouteComparisonMap() {
  const [hover, setHover] = useState(null);

  // SVG landmarks
  const nodes = {
    start: { x: 30, y: 60, label: 'RESCUE BASE', sub: 'UGV-01 · RIB-04' },
    blocked: { x: 115, y: 58, label: 'BLOCKED', sub: 'Kathipara' },
    disasterZone: { x: 195, y: 40, label: 'DISASTER ZONE', sub: '247 survivors' },
    safeZone: { x: 195, y: 90, label: 'SAFE ZONE', sub: 'Pallavaram Ridge' },
    altMid: { x: 115, y: 90, label: 'ECR BYPASS', sub: '18m ASL' },
  };

  return (
    <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-[#070C14] relative" style={{ minHeight: '260px' }}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 bg-black/40 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase tracking-wider">
          <Navigation className="w-4 h-4 text-cyan-400" />
          <span>VECTOR COMPARISON — ORIGINAL vs ALTERNATIVE ROUTE</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-5 h-0.5 bg-crimson-500" />
            <span className="text-crimson-400">BLOCKED ROUTE</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-5 h-0.5 bg-emerald-500" />
            <span className="text-emerald-400">ALTERNATIVE ROUTE</span>
          </span>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <svg viewBox="0 0 240 130" className="w-full" style={{ minHeight: '200px' }} preserveAspectRatio="xMidYMid meet">
        {/* Background */}
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#0C1829" stopOpacity="1" />
            <stop offset="100%" stopColor="#070C14" stopOpacity="1" />
          </radialGradient>
          <filter id="glowRed">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glowGreen">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <pattern id="gridPat" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M 12 0 L 0 0 0 12" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4"/>
          </pattern>
          <marker id="arrowRed" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
            <polygon points="0 0, 5 2, 0 4" fill="#DC2626" opacity="0.8" />
          </marker>
          <marker id="arrowGreen" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
            <polygon points="0 0, 5 2, 0 4" fill="#10B981" opacity="0.9" />
          </marker>
        </defs>

        <rect width="240" height="130" fill="url(#mapGlow)" />
        <rect width="240" height="130" fill="url(#gridPat)" />

        {/* Elevation zones */}
        <ellipse cx="115" cy="55" rx="28" ry="18" fill="#7f1d1d" opacity="0.15" />
        <text x="115" y="58" textAnchor="middle" fontSize="4.5" fill="#ef4444" opacity="0.7" fontFamily="monospace">FLOOD ZONE</text>
        <ellipse cx="115" cy="90" rx="20" ry="12" fill="#064e3b" opacity="0.25" />

        {/* ORIGINAL ROUTE (crimson, dashed strikethrough) */}
        <line
          x1={nodes.start.x} y1={nodes.start.y}
          x2={nodes.blocked.x} y2={nodes.blocked.y}
          stroke="#DC2626" strokeWidth="1.5" strokeDasharray="4,2.5"
          opacity="0.6" filter="url(#glowRed)" markerEnd="url(#arrowRed)"
        />
        {/* Blocked X marker */}
        <line x1={nodes.blocked.x - 7} y1={nodes.blocked.y - 7} x2={nodes.blocked.x + 7} y2={nodes.blocked.y + 7} stroke="#DC2626" strokeWidth="2" opacity="0.9" filter="url(#glowRed)" />
        <line x1={nodes.blocked.x + 7} y1={nodes.blocked.y - 7} x2={nodes.blocked.x - 7} y2={nodes.blocked.y + 7} stroke="#DC2626" strokeWidth="2" opacity="0.9" filter="url(#glowRed)" />
        <text x={nodes.blocked.x} y={nodes.blocked.y - 11} textAnchor="middle" fontSize="4" fill="#EF4444" fontFamily="monospace" fontWeight="bold">BLOCKED</text>

        {/* ALTERNATIVE ROUTE (emerald, solid) */}
        {/* Segment 1: start → altMid */}
        <path
          d={`M ${nodes.start.x} ${nodes.start.y} Q 70,100 ${nodes.altMid.x} ${nodes.altMid.y}`}
          stroke="#10B981" strokeWidth="2" fill="none"
          opacity="0.85" filter="url(#glowGreen)" markerEnd="url(#arrowGreen)"
        />
        {/* Segment 2: altMid → safeZone */}
        <path
          d={`M ${nodes.altMid.x} ${nodes.altMid.y} Q 155,95 ${nodes.safeZone.x} ${nodes.safeZone.y}`}
          stroke="#10B981" strokeWidth="2" fill="none"
          opacity="0.85" filter="url(#glowGreen)" markerEnd="url(#arrowGreen)"
        />

        {/* Elevation label */}
        <text x="115" y="104" textAnchor="middle" fontSize="4" fill="#34D399" opacity="0.8" fontFamily="monospace">18m ASL • ELEVATED DRY</text>

        {/* NODE: Rescue Base */}
        <circle cx={nodes.start.x} cy={nodes.start.y} r="5.5" fill="#0D121D" stroke="#38BDF8" strokeWidth="1.5" />
        <text x={nodes.start.x} y={nodes.start.y + 1} textAnchor="middle" fontSize="4.5" fill="#38BDF8" fontFamily="monospace" fontWeight="bold">B</text>
        <text x={nodes.start.x} y={nodes.start.y + 11} textAnchor="middle" fontSize="3.8" fill="#94A3B8" fontFamily="monospace">{nodes.start.label}</text>

        {/* NODE: Alt Mid */}
        <circle cx={nodes.altMid.x} cy={nodes.altMid.y} r="4.5" fill="#0D121D" stroke="#10B981" strokeWidth="1.5" />
        <text x={nodes.altMid.x} y={nodes.altMid.y + 1} textAnchor="middle" fontSize="4" fill="#10B981" fontFamily="monospace" fontWeight="bold">↑</text>
        <text x={nodes.altMid.x} y={nodes.altMid.y + 11} textAnchor="middle" fontSize="3.5" fill="#6EE7B7" fontFamily="monospace">{nodes.altMid.label}</text>

        {/* NODE: Disaster Zone */}
        <circle cx={nodes.disasterZone.x} cy={nodes.disasterZone.y} r="6" fill="#7f1d1d" stroke="#EF4444" strokeWidth="1.5" />
        <text x={nodes.disasterZone.x} y={nodes.disasterZone.y + 1.5} textAnchor="middle" fontSize="4.5" fill="#FECACA" fontFamily="monospace" fontWeight="bold">!</text>
        <text x={nodes.disasterZone.x} y={nodes.disasterZone.y + 12} textAnchor="middle" fontSize="3.5" fill="#FCA5A5" fontFamily="monospace">{nodes.disasterZone.label}</text>
        <text x={nodes.disasterZone.x} y={nodes.disasterZone.y + 16.5} textAnchor="middle" fontSize="3} " fill="#94A3B8" fontFamily="monospace">{nodes.disasterZone.sub}</text>

        {/* NODE: Safe Zone */}
        <circle cx={nodes.safeZone.x} cy={nodes.safeZone.y} r="6" fill="#022c22" stroke="#10B981" strokeWidth="1.5" />
        <text x={nodes.safeZone.x} y={nodes.safeZone.y + 2} textAnchor="middle" fontSize="4.5" fill="#6EE7B7" fontFamily="monospace" fontWeight="bold">✓</text>
        <text x={nodes.safeZone.x} y={nodes.safeZone.y + 12} textAnchor="middle" fontSize="3.5" fill="#34D399" fontFamily="monospace">{nodes.safeZone.label}</text>

        {/* Distance / time annotation */}
        <rect x="5" y="5" width="62" height="17" rx="3" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <text x="10" y="13" fontSize="4" fill="#94A3B8" fontFamily="monospace">ALT ROUTE: 9.1 km • 38 min</text>
        <text x="10" y="19" fontSize="4" fill="#64748B" fontFamily="monospace">Risk: 29/100 • 0 Hazard Zones</text>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function AlternativePlanPage({
  planData,
  onNavigateToApproval,
  onBackToFailureAnalysis,
  onBackToDashboard,
}) {
  const { 
    apiAltPlanId, 
    apiAltPlanData, 
    apiPlanId, 
    generateAlternative, 
    rejectPlan, 
    currentPlan 
  } = useMission();

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedReason, setSelectedChainIndex] = useState(null);

  // Auto-generate alternative plan if not already fetched
  useEffect(() => {
    if (!apiAltPlanData) {
      generateAlternative().catch(err => {
        console.warn('[ResQShield API] Generate alternative plan notice:', err.message);
      });
    }
  }, [apiAltPlanData, generateAlternative]);

  const origPlanId = apiPlanId || planData?.planId || currentPlan?.id || ORIGINAL.planId;
  const altPlanId = apiAltPlanData?.alternative_plan_id || apiAltPlanId || ALTERNATIVE.planId;
  const altRoute = apiAltPlanData?.recommended_route ? `${apiAltPlanData.recommended_route} via Elevated Bypass` : ALTERNATIVE.route;
  const altRisk = apiAltPlanData?.risk_score ?? ALTERNATIVE.riskScore;
  const altReliability = apiAltPlanData ? `${apiAltPlanData.reliability}%` : ALTERNATIVE.reliability;
  const altTravelTime = apiAltPlanData ? `${apiAltPlanData.estimated_time} min` : ALTERNATIVE.travelTime;
  const altStatus = apiAltPlanData?.status || ALTERNATIVE.status;

  const generatedTime = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });

  return (
    <div className="min-h-full text-slate-100 font-sans pb-20 space-y-5">

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          {/* Breadcrumb chip */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI RESILIENCE SYNTHESIS COMPLETE</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            Alternative Rescue Plan
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-sans max-w-lg">
            AI-generated resilient response after stress-test failure. Review, compare, and approve before field dispatch.
          </p>

          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400">
              ORIGINAL: <span className="text-white font-bold">{origPlanId}</span>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
              ALTERNATIVE: <span className="text-emerald-300 font-bold">{altPlanId}</span>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400">
              GENERATED: {generatedTime} IST
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/40 text-[10px] font-mono text-emerald-400 font-bold uppercase">
              ✓ {altStatus}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 font-mono shrink-0">
          <button
            onClick={() => onBackToFailureAnalysis?.()}
            className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-slate-300 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Failure Analysis</span>
          </button>
          <button
            onClick={() => setShowRejectModal(true)}
            className="px-4 py-2.5 rounded-lg bg-crimson-950/40 hover:bg-crimson-900/50 border border-crimson-600/40 text-xs text-crimson-300 transition-all flex items-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            <span>REJECT & RECALCULATE</span>
          </button>
          <button
            onClick={() => onNavigateToApproval?.()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>PROCEED TO HUMAN APPROVAL</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── NOTICE BANNER ── */}
      <div className="p-3.5 rounded-lg bg-cyan-950/30 border border-cyan-500/25 flex items-start sm:items-center justify-between gap-3 text-xs font-mono text-cyan-300">
        <div className="flex items-start sm:items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong>NOTICE:</strong> All comparison metrics are simulated via Monte Carlo perturbation (1,200 runs) and GIS elevation model.
            Real-world values subject to operator verification.
          </span>
        </div>
        <span className="text-[10px] text-slate-400 uppercase shrink-0 hidden md:inline">CONFIDENCE: 96.2%</span>
      </div>

      {/* ── SECTION 1 — SIDE-BY-SIDE PLAN COMPARISON ── */}
      <div className="rounded-xl bg-[#0D121D] border border-white/10 overflow-hidden font-mono">
        <div className="px-4 py-3 bg-black/40 border-b border-white/10 flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">1. PLAN COMPARISON — ORIGINAL vs ALTERNATIVE</span>
          <span className="text-[10px] text-slate-400">OPTIMISED FOR MAXIMUM SURVIVOR SAFETY MARGIN</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">

          {/* ── ORIGINAL PLAN ── */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-crimson-500" />
                <span className="text-sm font-bold text-slate-300">ORIGINAL PLAN ({origPlanId})</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-crimson-950/60 border border-crimson-600/40 text-crimson-400 uppercase font-bold">
                FAILED UNDER STRESS
              </span>
            </div>

            {/* Route */}
            <div className="p-3 rounded bg-black/50 border border-white/5">
              <span className="text-slate-400 text-[10px] uppercase block mb-1">Rescue Corridor</span>
              <span className="text-slate-200 text-xs font-semibold block leading-relaxed">{ORIGINAL.route}</span>
              <span className="text-crimson-400 text-[10px] mt-1 block">⚠ Submerged at 1.8m surge</span>
            </div>

            {/* Grid metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { label: 'Risk Score', val: ORIGINAL.riskScore + '/100', sub: 'Unacceptable', col: 'text-crimson-400' },
                { label: 'Reliability', val: ORIGINAL.reliability, sub: 'Below threshold', col: 'text-crimson-400' },
                { label: 'Est. Rescue Time', val: ORIGINAL.travelTime, sub: '+29 min delay', col: 'text-amber-400' },
                { label: 'Resource Usage', val: ORIGINAL.resourceUsage, sub: 'Critical draw', col: 'text-amber-400' },
                { label: 'Survivor Reach', val: ORIGINAL.survivorReach, sub: '38% unreached', col: 'text-crimson-400' },
                { label: 'Hazard Zones', val: ORIGINAL.hazardExposure, sub: 'High exposure', col: 'text-crimson-400' },
              ].map((m, i) => (
                <div key={i} className="p-3 rounded bg-black/40 border border-white/5">
                  <span className="text-slate-400 text-[10px] uppercase block">{m.label}</span>
                  <div className={`text-lg font-bold mt-0.5 ${m.col}`}>{m.val}</div>
                  <span className="text-slate-400 text-[10px]">{m.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── ALTERNATIVE PLAN ── */}
          <div className="p-6 space-y-4 bg-gradient-to-b from-emerald-950/10 to-transparent">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-sm font-bold text-emerald-300">ALTERNATIVE PLAN ({altPlanId})</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 uppercase font-bold">
                ✓ {altStatus}
              </span>
            </div>

            {/* Route */}
            <div className="p-3 rounded bg-black/50 border border-emerald-500/20">
              <span className="text-emerald-400 text-[10px] uppercase block mb-1">Rescue Corridor</span>
              <span className="text-white text-xs font-semibold block leading-relaxed">{altRoute}</span>
              <span className="text-emerald-400 text-[10px] mt-1 block">✓ Elevated dry grade — 18m ASL</span>
            </div>

            {/* Grid metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { label: 'Risk Score', val: altRisk + '/100', sub: '−62 pts improved', col: 'text-emerald-400', icon: TrendingDown },
                { label: 'Reliability', val: altReliability, sub: '+42 pts improved', col: 'text-emerald-400', icon: TrendingUp },
                { label: 'Est. Rescue Time', val: altTravelTime, sub: '−29 min faster', col: 'text-emerald-400', icon: TrendingDown },
                { label: 'Resource Usage', val: ALTERNATIVE.resourceUsage, sub: '−34% conserved', col: 'text-emerald-400', icon: TrendingDown },
                { label: 'Survivor Reach', val: ALTERNATIVE.survivorReach, sub: '+36% coverage', col: 'text-emerald-400', icon: TrendingUp },
                { label: 'Hazard Zones', val: ALTERNATIVE.hazardExposure, sub: 'Fully clear', col: 'text-emerald-400', icon: CheckCircle2 },
              ].map((m, i) => {
                const Icon = m.icon;
                return (
                  <div key={i} className="p-3 rounded bg-black/40 border border-emerald-500/20">
                    <span className="text-slate-400 text-[10px] uppercase block">{m.label}</span>
                    <div className={`text-lg font-bold mt-0.5 ${m.col} flex items-center gap-1`}>
                      {m.val}
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-emerald-400 text-[10px]">{m.sub}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ── SECTION 2 — METRIC BAR COMPARISON ── */}
      <div className="rounded-xl bg-[#0D121D] border border-white/10 overflow-hidden font-mono">
        <div className="px-4 py-3 bg-black/40 border-b border-white/10 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">2. METRIC DELTA COMPARISON</span>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {COMPARISON_METRICS.map((m, i) => (
            <div key={i} className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-semibold uppercase text-[10px]">{m.label}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${m.diffGood ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-600/30' : 'text-crimson-400 bg-crimson-950/40 border border-crimson-600/30'}`}>
                  {m.diff}
                </span>
              </div>

              {/* Original bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Original</span>
                  <span className={m.origColor}>{m.original}{m.unit}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-white/5">
                  <div className={`h-full ${m.origBar} transition-all duration-700`} style={{ width: `${m.original}%` }} />
                </div>
              </div>

              {/* Alternative bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-emerald-400/70">Alternative</span>
                  <span className={m.altColor}>{m.alternative}{m.unit}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-emerald-500/10">
                  <div className={`h-full ${m.altBar} transition-all duration-700`} style={{ width: `${m.alternative}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 3 — ROUTE COMPARISON MAP ── */}
      <div className="rounded-xl bg-[#0D121D] border border-white/10 overflow-hidden font-mono">
        <div className="px-4 py-3 bg-black/40 border-b border-white/10 flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">3. ROUTE VECTOR MAP — ORIGINAL vs ALTERNATIVE</span>
        </div>
        <div className="p-4">
          <RouteComparisonMap />
        </div>
      </div>

      {/* ── SECTION 4 — RESOURCE ALLOCATION DIFF ── */}
      <div className="rounded-xl bg-[#0D121D] border border-white/10 overflow-hidden font-mono">
        <div className="px-4 py-3 bg-black/40 border-b border-white/10 flex items-center gap-2">
          <Truck className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">4. RESOURCE ALLOCATION COMPARISON</span>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {RESOURCE_DIFF.map((r, i) => {
            const Icon = r.icon;
            const isUp = r.change === 'up';
            const isSame = r.change === 'same';
            return (
              <div key={i} className="p-4 rounded-lg bg-black/40 border border-white/8 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">{r.label}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-crimson-400 text-xs line-through opacity-70">{r.original}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                      <span className={`text-sm font-bold ${isUp ? 'text-emerald-400' : isSame ? 'text-cyan-400' : 'text-emerald-400'}`}>
                        {r.alternative}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                  isUp ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-600/30' :
                  isSame ? 'text-cyan-400 bg-cyan-950/30 border border-cyan-600/30' :
                  'text-emerald-400 bg-emerald-950/40 border border-emerald-600/30'
                }`}>
                  {isUp ? '↑ IMPROVED' : isSame ? '= SAME' : '↓ REDUCED'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 5 — AI REASONING CHAIN ── */}
      <div className="rounded-xl bg-[#0D121D] border border-white/10 overflow-hidden font-mono">
        <div className="px-4 py-3 bg-black/40 border-b border-white/10 flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">5. AI REASONING CHAIN — WHY THIS PLAN WAS GENERATED</span>
        </div>

        {/* API Synthesized Rationale Banner */}
        {apiAltPlanData?.reasoning && (
          <div className="p-4 mx-5 mt-4 rounded-xl bg-purple-950/30 border border-purple-500/30">
            <span className="text-[10px] uppercase font-bold text-purple-400 block mb-1">API SYNTHESIZED RATIONALE:</span>
            <p className="text-xs text-purple-100 font-sans leading-relaxed">
              "{apiAltPlanData.reasoning}"
            </p>
          </div>
        )}

        <div className="p-5 space-y-3">
          {AI_REASONING_STEPS.map((step, i) => {
            const Icon = step.icon;
            const colors = {
              crimson: { border: 'border-crimson-600/40', icon: 'text-crimson-400', bg: 'bg-crimson-950/30', num: 'bg-crimson-500' },
              cyan: { border: 'border-cyan-600/40', icon: 'text-cyan-400', bg: 'bg-cyan-950/20', num: 'bg-cyan-500' },
              amber: { border: 'border-amber-600/40', icon: 'text-amber-400', bg: 'bg-amber-950/20', num: 'bg-amber-500' },
              emerald: { border: 'border-emerald-600/40', icon: 'text-emerald-400', bg: 'bg-emerald-950/20', num: 'bg-emerald-500' },
            }[step.color];

            return (
              <div key={i} className={`flex gap-4 p-4 rounded-lg border ${colors.border} ${colors.bg}`}>
                {/* Step number + icon */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <span className={`w-6 h-6 rounded-full ${colors.num} flex items-center justify-center text-white text-[10px] font-bold`}>
                    {step.step}
                  </span>
                  {i < AI_REASONING_STEPS.length - 1 && (
                    <div className="w-px flex-1 bg-white/10 mt-1" style={{ minHeight: '20px' }} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider mb-1.5 ${colors.icon}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{step.title}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">{step.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 6 — ROBUSTNESS VERIFICATION ── */}
      <div className="rounded-xl bg-[#0D121D] border border-white/10 overflow-hidden font-mono">
        <div className="px-4 py-3 bg-black/40 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">6. ROBUSTNESS VERIFICATION — MONTE CARLO RESULTS</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">ALL CHECKS PASSED ✓</span>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ROBUSTNESS_CHECKS.map((check, i) => (
            <div key={i} className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">{check.label}</span>
                <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> PASS ({check.pct}%)
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden border border-white/5">
                <div
                  className="h-full bg-emerald-500 transition-all duration-700"
                  style={{ width: `${check.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 pb-5 pt-1">
          <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-[10px] font-mono text-emerald-300">
            <Info className="w-3.5 h-3.5 inline mr-1.5 text-emerald-400" />
            Plan validated across 1,200 Monte Carlo scenarios. Failure rate: <strong>3.8%</strong>. All deployment thresholds satisfied.
            Risk &lt; 35 · Reliability &gt; 90% · Hazard Zones = 0. Cleared for human approval gate.
          </div>
        </div>
      </div>

      {/* ── SECTION 7 — HUMAN APPROVAL GATE ── */}
      <div className="rounded-xl bg-gradient-to-r from-[#0A1A10] via-[#0C1D14] to-[#0A1A10] border-2 border-emerald-500/50 p-5 flex flex-col sm:flex-row items-center justify-between gap-5 font-mono shadow-lg">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>HUMAN APPROVAL REQUIRED</span>
          </div>
          <p className="text-base font-bold text-white font-sans">
            Alternative plan ready for operator authorization.
          </p>
          <p className="text-xs text-slate-400 font-sans">
            AI has completed all automated checks. Field dispatch is blocked until a verified human operator authorizes this plan.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={() => setShowRejectModal(true)}
            className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-slate-300 font-bold uppercase tracking-wider transition-all w-full sm:w-auto"
          >
            REJECT & RECALCULATE
          </button>
          <button
            onClick={() => onNavigateToApproval?.()}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-600 hover:from-emerald-500 hover:to-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>PROCEED TO HUMAN APPROVAL</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── REJECT MODAL ── */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 font-mono">
          <div className="w-full max-w-md bg-[#0D121D] border border-crimson-600/50 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-crimson-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>REJECT ALTERNATIVE PLAN</span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Provide a reason for rejection. The AI will re-evaluate parameters and generate a new corridor.
            </p>
            <div className="space-y-2 text-[10px]">
              {[
                'Tactical constraints require watercraft-only extraction',
                'Elevated route exceeds vehicle payload limit',
                'Command HQ override — mandate original corridor',
                'Resource count insufficient for alternative scope',
              ].map((preset, i) => (
                <button
                  key={i}
                  onClick={() => setRejectReason(preset)}
                  className={`w-full text-left px-3 py-2 rounded border transition-all ${
                    rejectReason === preset
                      ? 'bg-crimson-950/60 border-crimson-500/60 text-crimson-300'
                      : 'bg-white/3 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            <textarea
              rows={2}
              placeholder="Or type a custom reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 rounded bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-crimson-500 resize-none font-sans"
            />
            <div className="flex items-center justify-end gap-3 text-xs pt-1">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowRejectModal(false);
                  try {
                    await rejectPlan(rejectReason || 'Operator requested recalculation', 'Rescue Commander');
                  } catch (err) {
                    console.warn('[ResQShield API] Alternative plan rejection warning:', err.message);
                  }
                  onBackToFailureAnalysis?.();
                }}
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
