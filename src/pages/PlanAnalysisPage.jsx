import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Clock, 
  MapPin, 
  Zap, 
  Battery, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Cpu, 
  Radio, 
  Users, 
  ArrowRight, 
  ArrowLeft,
  Truck,
  HeartPulse,
  Compass,
  CornerDownRight,
  Eye,
  Crosshair,
  AlertOctagon,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Sliders,
  Check
} from 'lucide-react';

export default function PlanAnalysisPage({ 
  planData, 
  onRunStressTest, 
  onEditPlan, 
  onBack 
}) {
  // Default mock plan parameters if none passed from creator
  const defaultPlan = {
    planId: "RP-2026-CHN-094",
    generatedTime: "2026-09-20 12:00:15 IST",
    disasterType: "Flood (Critical)",
    location: "Velachery Lowland Basin, Chennai Zone 4",
    status: "READY FOR STRESS TEST",
    metrics: {
      riskScore: 68,
      reliability: 82,
      estimatedTime: 42,
      routeDistance: 8.6,
      goldenHourMargin: 75,
      survivorCount: 340,
      criticalPatients: 18
    },
    strategy: {
      primaryRoute: "North Arterial Corridor via Kathipara High-Level Ramp to ECR Link",
      teamAllocation: "NDRF 04 Battalion (18 Specialists) + SDRF Swift Water Unit 2",
      vehicleAllocation: "2 Amphibious UGVs, 4 Rigid Inflatable Boats (RIB), 2 High-Water Unimogs",
      medicalAllocation: "16 Class-A Trauma Packs, 6 Portable Resuscitators, Advanced Triage Kit",
      evacuationPriority: "Tier 1: 18 Critical Patients → Tier 2: 85 Vulnerable/Elderly → Tier 3: General Population"
    },
    resources: {
      teams: { used: 12, total: 16, percent: 75, status: "Optimal" },
      vehicles: { used: 6, total: 8, percent: 75, status: "Ready" },
      battery: { percent: 92, label: "2.4 kWh Reserve per UGV", status: "Healthy" },
      medical: { percent: 68, label: "Triage Capacity 40 Beds", status: "Adequate" },
      comm: { percent: 89, label: "Tactical Mesh UHF Signal", status: "Stable" }
    },
    risks: [
      { name: "Hazard Exposure", level: "High", score: 78, color: "text-crimson-400", bg: "bg-crimson-950/60 border-crimson-500/50", detail: "Fast-flowing flood current (3.4 m/s) along southern perimeter" },
      { name: "Route Risk", level: "Moderate", score: 54, color: "text-amber-400", bg: "bg-amber-950/60 border-amber-500/50", detail: "Single potential bottleneck at low-elevation drainage culvert" },
      { name: "Resource Risk", level: "Low", score: 22, color: "text-emerald-400", bg: "bg-emerald-950/60 border-emerald-500/50", detail: "UGV battery reserves exceed 3 return sortie requirements" },
      { name: "Communication Risk", level: "Moderate", score: 48, color: "text-amber-400", bg: "bg-amber-950/60 border-amber-500/50", detail: "RF signal attenuation possible through intense precipitation" },
      { name: "Time Risk", level: "Low", score: 18, color: "text-emerald-400", bg: "bg-emerald-950/60 border-emerald-500/50", detail: "33-minute survival safety margin before projected flood crest" },
    ],
    aiExplanation: "The proposed route minimizes hazard exposure while maintaining access to the nearest safe evacuation zone. Available rescue resources are sufficient for the current survivor estimate.",
    aiReasoningPoints: [
      {
        title: "Elevation Advantage",
        desc: "Bypasses the 2.4m deep low-basin flood trap by routing through the northern elevated arterial ridge."
      },
      {
        title: "Vehicle-Terrain Compatibility",
        desc: "Pairs amphibious UGVs with shallow-draft RIB watercraft for seamless water-to-road transitions."
      },
      {
        title: "Golden Hour Compliance",
        desc: "Total extraction timeline (42 min) remains well within the critical hypothermia stabilization window (75 min)."
      }
    ]
  };

  // Merge provided planData with default structured plan
  const plan = {
    ...defaultPlan,
    planId: planData?.planId || defaultPlan.planId,
    disasterType: planData?.disasterType ? `${planData.disasterType} (${planData.severity || 'Critical'})` : defaultPlan.disasterType,
    location: planData?.disasterZone || defaultPlan.location,
    strategy: {
      ...defaultPlan.strategy,
      teamAllocation: planData?.rescueTeams || defaultPlan.strategy.teamAllocation,
      vehicleAllocation: planData?.vehicles || defaultPlan.strategy.vehicleAllocation,
      medicalAllocation: planData?.medicalSupplies || defaultPlan.strategy.medicalAllocation,
      evacuationPriority: planData?.evacuationPriority ? `Priority ${planData.evacuationPriority}: Critical patients first` : defaultPlan.strategy.evacuationPriority
    },
    resources: {
      ...defaultPlan.resources,
      battery: {
        ...defaultPlan.resources.battery,
        percent: planData?.fuelBattery || 92
      }
    }
  };

  // Interactive map layer toggles
  const [activeLayers, setActiveLayers] = useState({
    hazards: true,
    blockedRoads: true,
    proposedRoute: true,
    safeZone: true,
    elevation: true
  });

  const toggleLayer = (layerKey) => {
    setActiveLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto font-sans pb-16 text-slate-100">
      
      {/* ── WORKFLOW STAGES STEPPER ── */}
      <div className="rounded-xl bg-[#0D121D] border border-white/10 px-4 py-3 shadow-command flex items-center justify-between overflow-x-auto text-xs font-mono">
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button 
            onClick={onEditPlan}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
              ✓
            </div>
            <span>1. Create Plan</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

          {/* ACTIVE CURRENT STAGE */}
          <div className="flex items-center gap-1.5 text-cyan-300 font-bold bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/40 shadow-cyan-glow">
            <div className="w-5 h-5 rounded-full bg-cyan-500 text-black flex items-center justify-center text-[10px] font-black">
              2
            </div>
            <span>2. Plan Analysis (Review)</span>
          </div>

          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

          <button 
            onClick={onRunStressTest}
            className="flex items-center gap-1.5 text-slate-400 hover:text-amber-300 transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-black/50 border border-slate-700 text-slate-400 flex items-center justify-center text-[10px]">
              3
            </div>
            <span>3. Stress Testing</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

          <div className="flex items-center gap-1.5 text-slate-500">
            <div className="w-5 h-5 rounded-full bg-black/50 border border-slate-800 text-slate-600 flex items-center justify-center text-[10px]">
              4
            </div>
            <span>4. Human Approval</span>
          </div>
        </div>

        <button
          onClick={onBack}
          className="text-slate-400 hover:text-cyan-400 text-xs font-mono flex items-center gap-1 ml-4 transition-colors shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </button>
      </div>

      {/* ── 1. HEADER ── */}
      <div className="rounded-xl bg-[#0D121D] border border-white/10 p-5 shadow-command">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                AI TACTICAL DECISION REVIEW WORKSPACE
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400">
                DISASTER: {plan.disasterType.toUpperCase()}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                Rescue Plan Analysis
              </h1>
              <span className="px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 shadow-cyan-glow animate-pulse">
                ● READY FOR STRESS TEST
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
              Review the AI-generated rescue strategy before stress testing.
            </p>
          </div>

          {/* Plan Meta Telemetry Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2 rounded-lg bg-black/50 border border-white/10">
              <span className="text-[10px] text-slate-500 uppercase block">PLAN ID</span>
              <strong className="text-white tracking-wider">{plan.planId}</strong>
            </div>

            <div className="p-2 rounded-lg bg-black/50 border border-white/10">
              <span className="text-[10px] text-slate-500 uppercase block">GENERATED TIME</span>
              <span className="text-slate-300 truncate block">{plan.generatedTime}</span>
            </div>

            <div className="p-2 rounded-lg bg-black/50 border border-white/10 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-500 uppercase block">TARGET LOCATION</span>
              <span className="text-cyan-300 truncate block" title={plan.location}>
                {plan.location.split(',')[0]}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ── 2. TOP METRICS (4 PROMINENT CARDS) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Metric 1: Risk Score */}
        <div className="p-4 rounded-xl bg-[#0D121D] border border-amber-500/30 shadow-command relative overflow-hidden group hover:border-amber-500/50 transition-colors">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span className="uppercase tracking-wider font-semibold">Risk Score</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">
              {plan.metrics.riskScore}
            </span>
            <span className="text-sm font-mono text-slate-500">/ 100</span>
          </div>
          <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden mt-3 border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-crimson-500" 
              style={{ width: `${plan.metrics.riskScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-sans leading-tight">
            Moderate-High terrain exposure due to fast-moving flood basin currents.
          </p>
        </div>

        {/* Metric 2: Reliability */}
        <div className="p-4 rounded-xl bg-[#0D121D] border border-cyan-500/30 shadow-command relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span className="uppercase tracking-wider font-semibold">Reliability</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono">
              {plan.metrics.reliability}
            </span>
            <span className="text-sm font-mono text-slate-500">%</span>
          </div>
          <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden mt-3 border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" 
              style={{ width: `${plan.metrics.reliability}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-sans leading-tight">
            Baseline Monte Carlo confidence under static disaster assumptions.
          </p>
        </div>

        {/* Metric 3: Estimated Rescue Time */}
        <div className="p-4 rounded-xl bg-[#0D121D] border border-white/10 shadow-command relative overflow-hidden group hover:border-white/20 transition-colors">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span className="uppercase tracking-wider font-semibold">Est. Rescue Time</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-3xl sm:text-4xl font-black text-white font-mono">
              {plan.metrics.estimatedTime}
            </span>
            <span className="text-sm font-mono text-emerald-400 font-bold">min</span>
          </div>
          <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden mt-3 border border-white/5">
            <div 
              className="h-full bg-emerald-500" 
              style={{ width: `${(plan.metrics.estimatedTime / plan.metrics.goldenHourMargin) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-emerald-400/90 mt-2 font-sans leading-tight">
            33 min safety buffer ahead of predicted golden-hour threshold (75 min).
          </p>
        </div>

        {/* Metric 4: Route Distance */}
        <div className="p-4 rounded-xl bg-[#0D121D] border border-white/10 shadow-command relative overflow-hidden group hover:border-white/20 transition-colors">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span className="uppercase tracking-wider font-semibold">Route Distance</span>
            <MapPin className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-3xl sm:text-4xl font-black text-white font-mono">
              {plan.metrics.routeDistance}
            </span>
            <span className="text-sm font-mono text-cyan-400 font-bold">km</span>
          </div>
          <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden mt-3 border border-white/5">
            <div 
              className="h-full bg-cyan-500" 
              style={{ width: '70%' }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-sans leading-tight">
            Optimized perimeter avoiding 4.2 km submerged highway chokepoints.
          </p>
        </div>

      </div>

      {/* ── MAIN REVIEW WORKSPACE (2-COLUMN ARCHITECTURE) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* ── LEFT COLUMN: MAIN RESCUE ROUTE & AI EXPLANATION (7 COLS) ── */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* ── 3. MAIN RESCUE ROUTE VISUALIZATION ── */}
          <div className="rounded-xl bg-[#0D121D] border border-white/10 p-4 sm:p-5 shadow-command flex flex-col">
            
            {/* Map Header & Interactive Layer Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3.5 border-b border-white/10 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    3. Main Rescue Route Visualization
                  </h2>
                </div>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Simulated GIS extraction corridor with terrain elevation contours and hazard nodes.
                </p>
              </div>

              {/* Layer Toggles */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => toggleLayer('hazards')}
                  className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${
                    activeLayers.hazards 
                      ? 'bg-crimson-950/70 border-crimson-500/50 text-crimson-300' 
                      : 'bg-black/40 border-white/10 text-slate-500'
                  }`}
                >
                  Hazards
                </button>
                <button
                  type="button"
                  onClick={() => toggleLayer('blockedRoads')}
                  className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${
                    activeLayers.blockedRoads 
                      ? 'bg-amber-950/70 border-amber-500/50 text-amber-300' 
                      : 'bg-black/40 border-white/10 text-slate-500'
                  }`}
                >
                  Blocked Roads
                </button>
                <button
                  type="button"
                  onClick={() => toggleLayer('proposedRoute')}
                  className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${
                    activeLayers.proposedRoute 
                      ? 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300' 
                      : 'bg-black/40 border-white/10 text-slate-500'
                  }`}
                >
                  Route Vector
                </button>
              </div>
            </div>

            {/* Simulated GIS Tactical Route Canvas */}
            <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-white/10 bg-[#05070B] shadow-inner flex items-center justify-center">
              
              <svg className="w-full h-full" viewBox="0 0 600 400" preserveAspectRatio="none">
                <defs>
                  {/* Grid Pattern */}
                  <pattern id="planGridMap" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1E293B" strokeWidth="0.6" opacity="0.4" />
                  </pattern>

                  {/* Radial Hazard Inundation Gradient */}
                  <radialGradient id="hazardGlowGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#DC2626" stopOpacity="0.4" />
                    <stop offset="60%" stopColor="#DC2626" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#080A0F" stopOpacity="0" />
                  </radialGradient>

                  {/* Water Surge Body Gradient */}
                  <linearGradient id="floodWaterGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0284C7" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#082F49" stopOpacity="0.1" />
                  </linearGradient>

                  {/* Proposed Route Neon Filter */}
                  <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Base Grid */}
                <rect width="600" height="400" fill="url(#planGridMap)" />

                {/* Elevation Topography Contours */}
                {activeLayers.elevation && (
                  <g opacity="0.35">
                    <ellipse cx="140" cy="120" rx="110" ry="70" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                    <ellipse cx="140" cy="120" rx="80" ry="50" fill="none" stroke="#334155" strokeWidth="0.8" />
                    <ellipse cx="460" cy="310" rx="120" ry="80" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                    <ellipse cx="460" cy="310" rx="80" ry="50" fill="none" stroke="#334155" strokeWidth="0.8" />
                  </g>
                )}

                {/* 1. DISASTER ZONE OVERLAY */}
                <path 
                  d="M 180,90 Q 320,130 380,220 T 520,340 L 420,390 L 150,380 L 120,240 Z" 
                  fill="url(#floodWaterGrad)" 
                  stroke="#0284C7" 
                  strokeWidth="1" 
                  strokeDasharray="4 4"
                />
                
                {/* 2. HAZARD AREAS */}
                {activeLayers.hazards && (
                  <g>
                    {/* Fast Current Inundation Center */}
                    <circle cx="280" cy="180" r="65" fill="url(#hazardGlowGrad)" />
                    <circle cx="280" cy="180" r="38" fill="none" stroke="#EF4444" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.8" />
                    
                    {/* Live Power Line Hazard Area */}
                    <circle cx="340" cy="120" r="30" fill="#F59E0B" fillOpacity="0.1" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="325" y="105" fill="#FBBF24" fontSize="9" fontFamily="monospace" fontWeight="bold">⚠ GRID LEAK</text>
                  </g>
                )}

                {/* 3. BLOCKED ROADS */}
                {activeLayers.blockedRoads && (
                  <g>
                    {/* Submerged Kathipara Main Pass */}
                    <line x1="230" y1="210" x2="310" y2="250" stroke="#DC2626" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
                    <line x1="230" y1="210" x2="310" y2="250" stroke="#FEE2E2" strokeWidth="2" strokeDasharray="3 3" />
                    
                    {/* Blocked Marker Icon */}
                    <circle cx="270" cy="230" r="9" fill="#7F1D1D" stroke="#EF4444" strokeWidth="1.5" />
                    <text x="266" y="234" fill="#FFFFFF" fontSize="10" fontWeight="black" fontFamily="sans-serif">✕</text>
                    <text x="210" y="268" fill="#FCA5A5" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      ROAD BLOCKED (1.8m Depth)
                    </text>
                  </g>
                )}

                {/* 4. PROPOSED RESCUE ROUTE */}
                {activeLayers.proposedRoute && (
                  <g>
                    {/* Ambient Route Glow Trace */}
                    <path 
                      d="M 80,100 L 160,110 L 220,130 L 260,110 L 370,140 L 420,210 L 460,250" 
                      fill="none" 
                      stroke="#06B6D4" 
                      strokeWidth="6" 
                      opacity="0.2"
                    />
                    
                    {/* Primary Route Path with Directional Dash */}
                    <path 
                      d="M 80,100 L 160,110 L 220,130 L 260,110 L 370,140 L 420,210 L 460,250" 
                      fill="none" 
                      stroke="#06B6D4" 
                      strokeWidth="3" 
                      strokeDasharray="8 4"
                      filter="url(#routeGlow)"
                    />

                    {/* Secondary Egress Vector (Survivor to Safe Zone) */}
                    <path 
                      d="M 420,210 L 480,240 L 530,300" 
                      fill="none" 
                      stroke="#10B981" 
                      strokeWidth="2.5" 
                      strokeDasharray="5 3"
                      opacity="0.8"
                    />
                  </g>
                )}

                {/* 5. RESCUE TEAM STARTING POINT */}
                <g>
                  <circle cx="80" cy="100" r="12" fill="#042F2E" stroke="#10B981" strokeWidth="2.5" />
                  <circle cx="80" cy="100" r="4" fill="#34D399" />
                  <text x="35" y="78" fill="#6EE7B7" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    START: Base Alpha
                  </text>
                  <text x="35" y="90" fill="#94A3B8" fontSize="8" fontFamily="monospace">
                    NDRF Battalion 04
                  </text>
                </g>

                {/* 6. SURVIVOR LOCATION */}
                <g>
                  {/* Pulsing Target Ring */}
                  <circle cx="420" cy="210" r="20" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                  <circle cx="420" cy="210" r="10" fill="#78350F" stroke="#F59E0B" strokeWidth="2" />
                  <circle cx="420" cy="210" r="3.5" fill="#FDE68A" />
                  <text x="440" y="205" fill="#FCD34D" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    SURVIVORS (340)
                  </text>
                  <text x="440" y="218" fill="#F87171" fontSize="9" fontFamily="monospace">
                    18 Critical Casualties
                  </text>
                </g>

                {/* 7. SAFE ZONE HAVEN */}
                {activeLayers.safeZone && (
                  <g>
                    <circle cx="530" cy="300" r="14" fill="#064E3B" stroke="#34D399" strokeWidth="2" />
                    <polygon points="530,292 538,304 522,304" fill="#34D399" />
                    <text x="475" y="328" fill="#34D399" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      SAFE ZONE HAVEN
                    </text>
                    <text x="475" y="339" fill="#94A3B8" fontSize="8" fontFamily="monospace">
                      IIT Madras Camp (High Ground)
                    </text>
                  </g>
                )}

              </svg>

              {/* Bottom Interactive Legend */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 p-2 rounded-lg bg-black/80 border border-white/10 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-300">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Starting Base
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Survivors (340)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> Proposed Route (8.6 km)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-crimson-500 inline-block" /> Blocked Road (1.8m)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Safe Zone
                  </span>
                </div>
                <div className="text-cyan-400 font-bold">
                  GIS Grid: Sector 4-Alpha
                </div>
              </div>

            </div>

            {/* Traversal Telemetry Segment Table */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                <div className="text-[9px] text-slate-500 uppercase">SEGMENT 1 • INGRESS</div>
                <div className="text-white font-semibold mt-0.5">Base → Kathipara Ramp</div>
                <div className="text-[10px] text-cyan-400 mt-1">2.4 km • 11 min (Paved High Ground)</div>
              </div>

              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                <div className="text-[9px] text-amber-400 uppercase">SEGMENT 2 • AMPHIBIOUS</div>
                <div className="text-white font-semibold mt-0.5">North Ridge → Lake View</div>
                <div className="text-[10px] text-amber-300 mt-1">3.8 km • 18 min (Water Transition)</div>
              </div>

              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                <div className="text-[9px] text-emerald-400 uppercase">SEGMENT 3 • EVACUATION</div>
                <div className="text-white font-semibold mt-0.5">Lake View → IIT Camp</div>
                <div className="text-[10px] text-emerald-300 mt-1">2.4 km • 13 min (Triage Corridor)</div>
              </div>
            </div>

          </div>

          {/* ── 7. AI EXPLANATION ("Why this plan?") ── */}
          <div className="rounded-xl bg-[#0D121D] border border-cyan-500/30 p-5 shadow-command space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  7. AI Explanation: Why This Plan?
                </h2>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">
                AI Confidence: 94.6%
              </span>
            </div>

            {/* Core Quote */}
            <div className="p-3.5 rounded-lg bg-cyan-950/20 border border-cyan-500/20">
              <p className="text-xs sm:text-sm text-cyan-100 font-sans italic leading-relaxed">
                “{plan.aiExplanation}”
              </p>
            </div>

            {/* Strategic Rationale Points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans">
              {plan.aiReasoningPoints.map((point, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                  <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    {point.title}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {point.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Evaluated against 14 alternative route candidates</span>
              <span className="text-amber-400 font-medium">Single Point of Failure: Culvert #4</span>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN: SUMMARY, RESOURCES & RISK (5 COLS) ── */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* ── 4. AI PLAN SUMMARY (RECOMMENDED STRATEGY) ── */}
          <div className="rounded-xl bg-[#0D121D] border border-white/10 p-4 sm:p-5 shadow-command space-y-3.5 font-mono text-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  4. Recommended Strategy
                </h2>
              </div>
              <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                STRATEGY VER. 1.2
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Primary Rescue Route */}
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase block mb-0.5">PRIMARY RESCUE ROUTE</span>
                <span className="text-white font-sans font-medium text-xs leading-snug block">
                  {plan.strategy.primaryRoute}
                </span>
              </div>

              {/* Team Allocation */}
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                <span className="text-[10px] text-cyan-400 uppercase block mb-0.5">TEAM ALLOCATION</span>
                <span className="text-slate-200 font-sans text-xs leading-snug block">
                  {plan.strategy.teamAllocation}
                </span>
              </div>

              {/* Vehicle Allocation */}
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                <span className="text-[10px] text-amber-400 uppercase block mb-0.5">VEHICLE ALLOCATION</span>
                <span className="text-slate-200 font-sans text-xs leading-snug block">
                  {plan.strategy.vehicleAllocation}
                </span>
              </div>

              {/* Medical Resource Allocation */}
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                <span className="text-[10px] text-emerald-400 uppercase block mb-0.5">MEDICAL RESOURCE ALLOCATION</span>
                <span className="text-slate-200 font-sans text-xs leading-snug block">
                  {plan.strategy.medicalAllocation}
                </span>
              </div>

              {/* Evacuation Priority */}
              <div className="p-2.5 rounded-lg bg-crimson-950/30 border border-crimson-500/30">
                <span className="text-[10px] text-crimson-300 uppercase block mb-0.5 font-bold">EVACUATION PRIORITY</span>
                <span className="text-slate-200 font-sans text-xs leading-snug block">
                  {plan.strategy.evacuationPriority}
                </span>
              </div>
            </div>
          </div>

          {/* ── 5. RESOURCE UTILIZATION ── */}
          <div className="rounded-xl bg-[#0D121D] border border-white/10 p-4 sm:p-5 shadow-command space-y-3.5 font-mono text-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  5. Resource Utilization
                </h2>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                CAPACITY ASSURED
              </span>
            </div>

            <div className="space-y-3">
              {/* Rescue Teams */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400">Rescue Teams ({plan.resources.teams.used}/{plan.resources.teams.total})</span>
                  <span className="text-emerald-400 font-bold">{plan.resources.teams.percent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-white/5">
                  <div className="h-full bg-emerald-500" style={{ width: `${plan.resources.teams.percent}%` }} />
                </div>
              </div>

              {/* Vehicles */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400">Vehicles & Watercraft ({plan.resources.vehicles.used}/{plan.resources.vehicles.total})</span>
                  <span className="text-cyan-400 font-bold">{plan.resources.vehicles.percent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-white/5">
                  <div className="h-full bg-cyan-500" style={{ width: `${plan.resources.vehicles.percent}%` }} />
                </div>
              </div>

              {/* Fuel / Battery */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400">Fuel & Battery Reserves</span>
                  <span className="text-emerald-400 font-bold">{plan.resources.battery.percent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-white/5">
                  <div className="h-full bg-emerald-500" style={{ width: `${plan.resources.battery.percent}%` }} />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">{plan.resources.battery.label}</span>
              </div>

              {/* Medical Supplies */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400">Medical Supplies</span>
                  <span className="text-amber-400 font-bold">{plan.resources.medical.percent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-white/5">
                  <div className="h-full bg-amber-500" style={{ width: `${plan.resources.medical.percent}%` }} />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">{plan.resources.medical.label}</span>
              </div>

              {/* Communication */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400">Tactical Communication Mesh</span>
                  <span className="text-cyan-400 font-bold">{plan.resources.comm.percent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-white/5">
                  <div className="h-full bg-cyan-500" style={{ width: `${plan.resources.comm.percent}%` }} />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">{plan.resources.comm.label}</span>
              </div>
            </div>
          </div>

          {/* ── 6. RISK ANALYSIS (5 CLEAR SEVERITY INDICATORS) ── */}
          <div className="rounded-xl bg-[#0D121D] border border-white/10 p-4 sm:p-5 shadow-command space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-crimson-400" />
                <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  6. Risk Analysis Breakdown
                </h2>
              </div>
              <span className="text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                AUDITED
              </span>
            </div>

            <div className="space-y-2">
              {plan.risks.map((risk, idx) => (
                <div key={idx} className={`p-2.5 rounded-lg border ${risk.bg} flex items-center justify-between gap-2`}>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white tracking-wide">{risk.name}</span>
                      <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded uppercase ${risk.color}`}>
                        [{risk.level}]
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-sans truncate mt-0.5">
                      {risk.detail}
                    </div>
                  </div>
                  <div className={`text-sm font-black font-mono shrink-0 ${risk.color}`}>
                    {risk.score}%
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ── 8. PRIMARY ACTION BAR (BOTTOM DOCKED COMMAND BAR) ── */}
      <div className="rounded-xl bg-gradient-to-r from-[#0D121D] via-[#120D16] to-[#0D121D] border border-crimson-500/40 p-4 shadow-command flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-3 z-30 backdrop-blur-lg">
        
        {/* Workflow State Reminder */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping shrink-0" />
          <div>
            <div className="text-white font-bold tracking-wider">
              STATUS: READY FOR STRESS TEST
            </div>
            <div className="text-[11px] text-slate-400 font-sans">
              AI plan synthesized. Verify resilience against changing disaster conditions.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Secondary Action */}
          <button
            type="button"
            onClick={onEditPlan}
            className="px-4 py-2.5 rounded-xl bg-black/60 hover:bg-white/10 border border-white/15 text-slate-300 font-mono text-xs transition-colors"
          >
            Edit Rescue Plan
          </button>

          {/* Primary Action (Prominent Button) */}
          <button
            type="button"
            onClick={onRunStressTest}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-crimson-600 via-crimson-700 to-crimson-800 hover:from-crimson-500 hover:via-crimson-600 hover:to-crimson-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-crimson-glow flex items-center gap-2 group active:scale-95"
          >
            <Zap className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
            <span>Run Stress Test →</span>
          </button>
        </div>

      </div>

    </div>
  );
}
