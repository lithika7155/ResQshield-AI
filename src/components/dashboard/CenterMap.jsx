import React, { useState } from 'react';
import { 
  Plus, Minus, Crosshair, Layers, Cloud, Home,
  AlertTriangle, Navigation, ShieldAlert, MapPin, Compass
} from 'lucide-react';
import { mapWaypointsData, mapShelters, mapRescueTeams, recentIncidentsList } from '../../data/resqshieldData';

const MAP_TABS = ['Live Map', 'Rescue Plan', 'Simulation', 'AI Analysis'];

const TAB_ICONS = {
  'Live Map': Layers,
  'Rescue Plan': Navigation,
  'Simulation': ShieldAlert,
  'AI Analysis': Compass,
};

export default function CenterMap({ selectedIncident, activeTab, setActiveTab }) {
  const [zoom, setZoom] = useState(1);
  const [showLayers, setShowLayers] = useState(true);

  // Flood area zones (SVG polygon paths expressed as % of viewBox 0 0 100 100)
  const floodZones = [
    { id: 'fz-1', d: 'M 52,38 Q 62,30 72,35 L 74,50 Q 65,56 55,52 Z', color: '#EF444488', border: '#EF4444' },
    { id: 'fz-2', d: 'M 44,54 Q 54,48 58,55 L 56,68 Q 46,70 42,62 Z', color: '#EF444466', border: '#EF4444' },
    { id: 'fz-3', d: 'M 28,26 Q 38,22 42,30 L 40,42 Q 30,44 26,36 Z', color: '#EF444455', border: '#B91C1C' },
  ];

  // Affected zone (less severe, shown in dark red)
  const affectedZones = [
    { id: 'az-1', d: 'M 40,36 Q 52,30 58,38 L 62,54 Q 50,60 40,56 Q 34,50 38,40 Z', color: '#B91C1C44', border: '#B91C1C' },
  ];

  // Primary rescue route (blocked), alternative bypass
  const primaryRoute = 'M 26,36 L 34,42 L 42,46 L 50,44 L 58,48 L 64,54 L 68,62 L 66,72';
  const altBypassRoute = 'M 26,36 L 32,30 L 44,28 L 56,32 L 64,38 L 68,46 L 68,62 L 66,72';
  const mainRoad1 = 'M 10,50 L 30,48 L 58,48 L 80,46 L 96,44';
  const mainRoad2 = 'M 50,10 L 52,30 L 58,48 L 60,70 L 64,88';
  const coastLine = 'M 80,10 Q 84,28 86,48 Q 88,68 84,88';

  const showAlternate = activeTab === 'Rescue Plan' || activeTab === 'Simulation';
  const showHeatmap = activeTab === 'AI Analysis';

  return (
    <div className="flex flex-col rounded-xl bg-[#060A10] border border-white/10 overflow-hidden shadow-2xl select-none relative flex-1">
      
      {/* Map Tab Bar */}
      <div className="flex items-center gap-1 px-3 py-2.5 border-b border-white/10 bg-[#080C14]">
        {MAP_TABS.map((tab) => {
          const Icon = TAB_ICONS[tab];
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-crimson-600 text-white shadow-crimson-glow font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{tab}</span>
            </button>
          );
        })}

        {/* Weather Widget */}
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs font-mono">
          <Cloud className="w-4 h-4 text-slate-400" />
          <span className="text-white font-bold">26°C</span>
          <span className="text-slate-400">Heavy Rain</span>
        </div>
      </div>

      {/* Main Map SVG Canvas */}
      <div className="relative flex-1 overflow-hidden" style={{ minHeight: '340px' }}>
        
        {/* Dark topographic map background */}
        <div className="absolute inset-0 bg-[#09111A]">
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id="incidentGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="heatGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.2" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Coastline / Bay of Bengal */}
          <path d={coastLine} fill="none" stroke="#1E3A5F" strokeWidth="4" strokeLinecap="round" />
          <path d="M 76,0 L 80,10 Q 84,28 86,48 Q 88,68 84,88 L 76,100 L 100,100 L 100,0 Z" fill="#0C1F35" opacity="0.9" />
          <text x="88" y="50" fill="#2563EB" fontSize="2.5" fontFamily="monospace" opacity="0.7" textAnchor="middle">Bay of Bengal</text>

          {/* AI Heatmap overlay for AI Analysis tab */}
          {showHeatmap && (
            <g opacity="0.7">
              <circle cx="58" cy="44" r="16" fill="url(#heatGlow)" />
              <circle cx="32" cy="34" r="10" fill="url(#heatGlow)" />
              <circle cx="50" cy="62" r="12" fill="url(#heatGlow)" />
            </g>
          )}

          {/* Affected Zones */}
          {affectedZones.map(z => (
            <path key={z.id} d={z.d} fill={z.color} stroke={z.border} strokeWidth="0.5" strokeDasharray="1.5 1" />
          ))}

          {/* Flood Zones */}
          {floodZones.map(z => (
            <g key={z.id}>
              <path d={z.d} fill={z.color} stroke={z.border} strokeWidth="0.6" />
            </g>
          ))}

          {/* Main Roads */}
          <path d={mainRoad1} fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />
          <path d={mainRoad2} fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 16,62 L 38,58 L 50,62 L 62,72 L 68,82" fill="none" stroke="#374151" strokeWidth="1.2" strokeLinecap="round" />

          {/* Primary Rescue Route (blocked/original) */}
          <path 
            d={primaryRoute} 
            fill="none" 
            stroke={showAlternate ? '#EF4444' : '#3B82F6'} 
            strokeWidth={showAlternate ? '1.2' : '2'} 
            strokeLinecap="round" 
            strokeDasharray={showAlternate ? '2 1.5' : 'none'}
            opacity={showAlternate ? 0.6 : 1}
          />

          {/* Alternative Bypass Route (shown in Rescue Plan + Simulation tabs) */}
          {showAlternate && (
            <path 
              d={altBypassRoute} 
              fill="none" 
              stroke="#10B981" 
              strokeWidth="2.2" 
              strokeLinecap="round"
              strokeDasharray="3 1.5"
              filter="url(#glow)"
            />
          )}

          {/* City Labels */}
          {mapWaypointsData.map((city) => (
            <g key={city.id}>
              {city.isEpicenter && (
                <circle cx={city.x} cy={city.y} r="6" fill="#EF4444" opacity="0.15" />
              )}
              <circle cx={city.x} cy={city.y} r={city.isEpicenter ? 1.5 : 1} 
                fill={city.isEpicenter ? '#EF4444' : '#6B7280'} />
              <text x={city.x + 2} y={city.y - 2} fill={city.isEpicenter ? '#F87171' : '#9CA3AF'} 
                fontSize={city.isEpicenter ? '3.5' : '3'} fontFamily="Inter, sans-serif" fontWeight={city.isEpicenter ? '700' : '400'}>
                {city.name}
              </text>
            </g>
          ))}

          {/* Incident Markers */}
          {recentIncidentsList.map((inc) => {
            const isSelected = selectedIncident?.id === inc.id;
            return (
              <g key={inc.id} filter={isSelected ? 'url(#glow)' : ''}>
                {/* Pulsing glow ring for selected */}
                {isSelected && (
                  <circle cx={inc.coords.x} cy={inc.coords.y} r="5" fill="none" stroke="#EF4444" strokeWidth="0.8" opacity="0.6" />
                )}
                {/* Incident triangle marker */}
                <polygon 
                  points={`${inc.coords.x},${inc.coords.y - 3.5} ${inc.coords.x - 3},${inc.coords.y + 1.5} ${inc.coords.x + 3},${inc.coords.y + 1.5}`}
                  fill="#EF4444" 
                  stroke="#DC2626" 
                  strokeWidth="0.5"
                  opacity="0.9"
                />
              </g>
            );
          })}

          {/* Shelter Markers */}
          {mapShelters.map((sh) => (
            <g key={sh.id}>
              <rect x={sh.x - 2} y={sh.y - 2} width="4" height="4" rx="0.8" fill="#10B981" opacity="0.9" />
              <text x={sh.x + 3} y={sh.y + 1} fill="#34D399" fontSize="2.5" fontFamily="monospace">{sh.name.split(' ')[0]}</text>
            </g>
          ))}

          {/* Rescue Team Markers */}
          {mapRescueTeams.map((rt) => (
            <g key={rt.id}>
              <circle cx={rt.x} cy={rt.y} r="2.5" fill="#06B6D4" opacity="0.85" stroke="#0891B2" strokeWidth="0.5" />
              <text x={rt.x + 3.5} y={rt.y + 1} fill="#22D3EE" fontSize="2.5" fontFamily="monospace">
                {rt.name.split(' ').slice(0, 2).join(' ')}
              </text>
            </g>
          ))}

          {/* Blocked Road X mark (near primary route midpoint) */}
          {showAlternate && (
            <g>
              <line x1="48" y1="43" x2="52" y2="47" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="52" y1="43" x2="48" y2="47" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="44" y="39" width="12" height="12" rx="2" fill="none" stroke="#EF4444" strokeWidth="0.5" strokeDasharray="1 0.5" opacity="0.5" />
            </g>
          )}
        </svg>

        {/* Map Controls: Zoom + Layers */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button onClick={() => setZoom(z => Math.min(z + 0.2, 2))} className="w-7 h-7 rounded-lg bg-[#0D121D]/90 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white hover:border-white/30 transition-all">
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} className="w-7 h-7 rounded-lg bg-[#0D121D]/90 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white hover:border-white/30 transition-all">
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button className="w-7 h-7 rounded-lg bg-[#0D121D]/90 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white hover:border-white/30 transition-all">
            <Crosshair className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setShowLayers(l => !l)} className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${showLayers ? 'bg-cyan-600/30 border-cyan-500/50 text-cyan-400' : 'bg-[#0D121D]/90 border-white/15 text-slate-300'}`}>
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Legend */}
        {showLayers && (
          <div className="absolute bottom-3 left-3 bg-[#080C14]/92 backdrop-blur border border-white/15 rounded-lg p-2.5 text-[10px] font-mono z-10 space-y-1.5">
            <div className="flex items-center gap-2"><span className="w-3 h-2 bg-crimson-500 rounded opacity-80 block" /> Flood Area</div>
            <div className="flex items-center gap-2"><span className="w-3 h-2 bg-crimson-800 rounded opacity-60 block" /> Affected Zone</div>
            <div className="flex items-center gap-2"><span className="w-4 h-0.5 bg-blue-500 block" /> Rescue Route</div>
            {showAlternate && <div className="flex items-center gap-2"><span className="w-4 h-0.5 bg-emerald-500 block" /> Alt. Bypass</div>}
            <div className="flex items-center gap-2"><span className="w-3 h-2 bg-emerald-500 rounded opacity-80 block" /> Shelter</div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-cyan-500 rounded-full block" /> Rescue Team</div>
            <div className="flex items-center gap-2">
              <svg width="10" height="9" viewBox="0 0 10 9"><polygon points="5,0 0,8 10,8" fill="#EF4444"/></svg>
              Incident
            </div>
          </div>
        )}

        {/* Scale bar */}
        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-400 flex items-end gap-1 z-10">
          <div className="flex items-center gap-0.5 bg-[#080C14]/80 px-2 py-1 rounded border border-white/10">
            <div className="flex items-end gap-0 h-3">
              <span className="w-6 h-0.5 bg-slate-400 block mb-1" />
            </div>
            <span>0  5  10  20 km</span>
          </div>
        </div>

        {/* Selected Incident Popup */}
        {selectedIncident && (
          <div className="absolute top-3 left-3 max-w-[200px] bg-[#0D121D]/95 border border-crimson-600/50 rounded-lg p-3 text-xs z-20 shadow-xl">
            <div className="font-bold text-crimson-400 text-[11px] uppercase tracking-wider mb-1">{selectedIncident.title}</div>
            <div className="text-slate-300 text-[11px] leading-relaxed">{selectedIncident.description}</div>
            <div className="text-slate-500 text-[10px] mt-1 font-mono">{selectedIncident.location}</div>
          </div>
        )}

        {/* AI Analysis Overlay */}
        {activeTab === 'AI Analysis' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-12 right-16 bg-[#0D121D]/90 border border-cyan-500/40 rounded p-2 text-[10px] font-mono text-cyan-300">
              87% Risk Confidence
            </div>
            <div className="absolute bottom-20 left-24 bg-[#0D121D]/90 border border-amber-500/40 rounded p-2 text-[10px] font-mono text-amber-300">
              Surge: +9.2 cm/hr
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
