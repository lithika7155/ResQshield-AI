import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Crosshair, 
  Navigation, 
  Eye, 
  Zap, 
  Layers 
} from 'lucide-react';

export default function RouteVisualizer({ 
  mode = "standard", // "standard" | "blocked" | "alternative" | "comparison"
  title = "Tactical Vector Route Map",
  interactive = true 
}) {
  const [activeWaypoint, setActiveWaypoint] = useState(null);
  const [showContours, setShowContours] = useState(true);
  const [showTelemetry, setShowTelemetry] = useState(true);

  // Tactical Waypoints
  const waypoints = [
    {
      id: "wp-start",
      label: "START: Base Alpha",
      short: "START",
      x: 12,
      y: 78,
      type: "start",
      coords: "34.142° N, 118.291° W",
      status: "Base Staging Clear",
      elevation: "45m ASL"
    },
    {
      id: "wp-chk1",
      label: "CHECKPOINT: Ridge Outpost 3",
      short: "CHK-01",
      x: 32,
      y: 62,
      type: "checkpoint",
      coords: "34.150° N, 118.283° W",
      status: "Telemetry OK",
      elevation: "32m ASL"
    },
    {
      id: "wp-hz1",
      label: "HAZARD ZONE: Overpass Sector B",
      short: "HAZARD",
      x: 52,
      y: 48,
      type: "hazard",
      coords: "34.161° N, 118.274° W",
      status: mode === "standard" ? "Surge Warning (1.8m)" : "STRUCTURAL FAILURE / BLOCKED",
      elevation: "11m ASL (Lowland)",
      waterFlow: "3.4 m/s"
    },
    {
      id: "wp-surv",
      label: "SURVIVOR: Terminal 4B Rooftop",
      short: "SURVIVORS",
      x: 74,
      y: 35,
      type: "survivor",
      coords: "34.175° N, 118.261° W",
      status: "14 Civilians Isolated",
      elevation: "18m ASL"
    },
    {
      id: "wp-safe",
      label: "SAFE ZONE: Triage Echo",
      short: "SAFE ZONE",
      x: 92,
      y: 18,
      type: "safe",
      coords: "34.182° N, 118.242° W",
      status: "Emergency Trauma Hot",
      elevation: "62m ASL"
    }
  ];

  // Alternative corridor waypoints (bypassing the hazard zone to the east)
  const altWaypoints = [
    { id: "alt-start", x: 12, y: 78 },
    { id: "alt-ch1", x: 38, y: 84 },
    { id: "alt-ridge", x: 62, y: 72 },
    { id: "alt-bridge", x: 78, y: 48 },
    { id: "alt-surv", x: 74, y: 35 },
    { id: "alt-safe", x: 92, y: 18 }
  ];

  const isBlocked = mode === "blocked" || mode === "comparison";
  const showAlternative = mode === "alternative" || mode === "comparison";

  return (
    <div className="relative w-full rounded-xl bg-[#090D15] border border-white/10 overflow-hidden shadow-2xl p-4 sm:p-6 font-mono select-none">
      
      {/* Visualizer Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping" />
          <span className="font-bold text-white tracking-wider flex items-center gap-1.5">
            <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
            {title}
          </span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-400">
            GRID 44-NORD • SECTOR 4
          </span>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowContours(!showContours)}
            className={`px-2.5 py-1 rounded text-[11px] border transition-colors flex items-center gap-1 ${
              showContours 
                ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300' 
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Contours</span>
          </button>
          <button
            onClick={() => setShowTelemetry(!showTelemetry)}
            className={`px-2.5 py-1 rounded text-[11px] border transition-colors flex items-center gap-1 ${
              showTelemetry 
                ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300' 
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Telemetry</span>
          </button>
        </div>
      </div>

      {/* Main HUD Vector Canvas */}
      <div className="relative w-full h-80 sm:h-96 my-3 rounded-lg bg-[#06080D] border border-white/5 overflow-hidden">
        
        {/* Subtle Background Grid & Topo Lines */}
        <div className="absolute inset-0 bg-tactical-grid opacity-30 pointer-events-none" />
        
        {showContours && (
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Topographical contour elevation rings */}
            <path d="M 0,30 Q 30,20 60,35 T 100,25" fill="none" stroke="#38BDF8" strokeWidth="0.5" strokeDasharray="1 2" />
            <path d="M 0,55 Q 35,45 65,60 T 100,45" fill="none" stroke="#38BDF8" strokeWidth="0.5" strokeDasharray="1 2" />
            <path d="M 0,80 Q 40,75 70,85 T 100,75" fill="none" stroke="#38BDF8" strokeWidth="0.5" strokeDasharray="1 2" />
          </svg>
        )}

        {/* Hazard Exclusion Zone Circle (Flooded Sector B) */}
        <div 
          className="absolute rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-all"
          style={{
            left: '52%',
            top: '48%',
            width: isBlocked ? '160px' : '120px',
            height: isBlocked ? '160px' : '120px',
            background: isBlocked 
              ? 'radial-gradient(circle, rgba(239, 68, 68, 0.35) 0%, rgba(239, 68, 68, 0.05) 70%, transparent 100%)' 
              : 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(245, 158, 11, 0.05) 70%, transparent 100%)',
            border: isBlocked ? '1px dashed rgba(239, 68, 68, 0.6)' : '1px dashed rgba(245, 158, 11, 0.4)'
          }}
        >
          <div className="absolute top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider font-semibold whitespace-nowrap bg-black/60 border border-crimson-600/40 text-crimson-400">
            {isBlocked ? 'CRITICAL HAZARD: ROAD BLOCKED' : 'HYDRAULIC SURGE ZONE'}
          </div>
        </div>

        {/* SVG Route Trajectories */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="primaryRouteGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="40%" stopColor="#38BDF8" />
              <stop offset="60%" stopColor={isBlocked ? "#EF4444" : "#F59E0B"} />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            <linearGradient id="alternativeRouteGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* Primary Route Path */}
          <path
            d="M 12,78 L 32,62 L 52,48 L 74,35 L 92,18"
            fill="none"
            stroke={isBlocked ? "#EF4444" : "url(#primaryRouteGrad)"}
            strokeWidth={isBlocked ? "1.5" : "2"}
            strokeDasharray={isBlocked ? "3 2" : "none"}
            className="transition-all duration-500"
          />

          {/* Blocked Crosshair indicator on hazard waypoint */}
          {isBlocked && (
            <g transform="translate(52, 48)">
              <circle r="3.5" fill="#EF4444" fillOpacity="0.2" stroke="#EF4444" strokeWidth="0.8" />
              <line x1="-3" y1="-3" x2="3" y2="3" stroke="#EF4444" strokeWidth="1" />
              <line x1="3" y1="-3" x2="-3" y2="3" stroke="#EF4444" strokeWidth="1" />
            </g>
          )}

          {/* Alternative Route Corridor (if active) */}
          {showAlternative && (
            <path
              d="M 12,78 Q 38,88 62,72 T 74,35 L 92,18"
              fill="none"
              stroke="url(#alternativeRouteGrad)"
              strokeWidth="2.5"
              strokeDasharray="2 1"
              className="animate-pulse"
            />
          )}
        </svg>

        {/* Interactive Waypoint Nodes */}
        {waypoints.map((wp) => {
          const isSelected = activeWaypoint?.id === wp.id;
          let nodeColor = "bg-cyan-500 border-cyan-400";
          let badgeText = "text-cyan-300";

          if (wp.type === "hazard") {
            nodeColor = isBlocked ? "bg-crimson-500 border-crimson-400 animate-bounce" : "bg-amber-500 border-amber-400";
            badgeText = isBlocked ? "text-crimson-400" : "text-amber-400";
          } else if (wp.type === "survivor") {
            nodeColor = "bg-amber-400 border-amber-300 animate-pulse";
            badgeText = "text-amber-300";
          } else if (wp.type === "safe") {
            nodeColor = "bg-emerald-500 border-emerald-400";
            badgeText = "text-emerald-300";
          }

          return (
            <div
              key={wp.id}
              onClick={() => interactive && setActiveWaypoint(wp)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
              style={{ left: `${wp.x}%`, top: `${wp.y}%` }}
            >
              {/* Outer pulsing ring */}
              <div className={`w-6 h-6 -m-1 rounded-full border border-white/20 group-hover:scale-125 transition-transform flex items-center justify-center bg-black/40 backdrop-blur`}>
                <div className={`w-3 h-3 rounded-full border ${nodeColor} shadow-md`} />
              </div>

              {/* Waypoint Label Tag */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 px-2 py-0.5 rounded border border-white/10 text-[10px] font-mono group-hover:border-white/40 transition-colors">
                <span className={badgeText}>{wp.short}</span>
              </div>
            </div>
          );
        })}

        {/* Alternative Route Corridor Label (when shown) */}
        {showAlternative && (
          <div 
            className="absolute z-20 px-2 py-1 rounded bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-[10px] font-mono tracking-wide shadow-emerald-glow"
            style={{ left: '46%', top: '76%' }}
          >
            ✓ EASTERN CAUSEWAY BYPASS (RECOMMENDED)
          </div>
        )}

        {/* Rescue Team Alpha Tracker Drone Icon */}
        <div 
          className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none"
          style={{ left: '26%', top: '67%' }}
        >
          <div className="w-5 h-5 rounded-full bg-blue-600 border border-blue-300 flex items-center justify-center text-white shadow-lg shadow-blue-500/50 animate-telemetry">
            <Navigation className="w-3 h-3 transform rotate-45" />
          </div>
          <span className="text-[10px] font-mono bg-black/90 px-1.5 py-0.5 rounded border border-blue-500/50 text-blue-300">
            TEAM ALPHA (UGV-01)
          </span>
        </div>

        {/* Telemetry HUD Overlay in Bottom Left */}
        {showTelemetry && (
          <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur border border-white/10 p-2 rounded text-[10px] space-y-0.5 text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">CORRIDOR STATUS:</span>
              <span className={isBlocked ? "text-crimson-400 font-bold" : showAlternative ? "text-emerald-400 font-bold" : "text-cyan-400"}>
                {isBlocked ? "BLOCKED (OVERPASS DAMAGED)" : showAlternative ? "EASTERN BYPASS CLEAR" : "BASELINE PASSAGE"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">WATER FLOW:</span>
              <span className="text-white">3.4 m/s (Lowland Basin)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">AIR THERMAL:</span>
              <span className="text-white">UAV-12 Video Stream Locked</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected Waypoint Detail Bar */}
      {activeWaypoint ? (
        <div className="mt-2 p-3 rounded-lg bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="font-bold text-white font-mono">{activeWaypoint.label}</span>
              <span className="text-slate-400 text-[11px] ml-2 font-mono">[{activeWaypoint.coords}]</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-300 font-mono">
            <span>ELEVATION: <strong className="text-white">{activeWaypoint.elevation}</strong></span>
            <span>STATUS: <strong className="text-cyan-400">{activeWaypoint.status}</strong></span>
          </div>
        </div>
      ) : (
        <div className="mt-2 text-center text-[11px] text-slate-500 font-mono">
          Click any waypoint above to inspect elevation, telemetry coordinates, and hazard envelope.
        </div>
      )}

      {/* Step Sequence Flow Bar */}
      <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
        <span className="text-slate-500">TRAJECTORY SEQUENCE:</span>
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-800/40 text-cyan-300">START</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">CHECKPOINT</span>
          <span>→</span>
          <span className={`px-2 py-0.5 rounded border ${isBlocked ? 'bg-crimson-950/60 border-crimson-600 text-crimson-300 font-bold' : 'bg-amber-950/50 border-amber-800/40 text-amber-300'}`}>
            {isBlocked ? 'HAZARD (BLOCKED)' : 'HAZARD ZONE'}
          </span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-amber-950/50 border border-amber-800/40 text-amber-300">SURVIVOR</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-800/40 text-emerald-300">SAFE ZONE</span>
        </div>
      </div>
    </div>
  );
}
