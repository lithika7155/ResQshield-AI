import React from 'react';
import { 
  Home, 
  ShieldAlert, 
  Radio, 
  Compass, 
  Activity,
  Zap, 
  AlertOctagon,
  Map, 
  FileText, 
  Users, 
  Settings,
  AlertTriangle,
  GitFork,
  UserCheck
} from 'lucide-react';

export default function Sidebar({ activeNav = "Home", setActiveNav }) {
  const navItems = [
    { id: "Home", label: "Home", icon: Home },
    { id: "Threat Monitor", label: "Threat Monitor", icon: ShieldAlert },
    { id: "Incidents", label: "Incidents", icon: Radio },
    { id: "Rescue Planning", label: "Rescue Planning", icon: Compass },
    { id: "Plan Analysis", label: "Plan Analysis", icon: Activity },
    { id: "Stress Testing", label: "Stress Testing", icon: Zap },
    { id: "Failure Analysis", label: "Failure Analysis", icon: AlertOctagon },
    { id: "Alternative Plan", label: "Alternative Plan", icon: GitFork },
    { id: "Human Approval", label: "Human Approval", icon: UserCheck },
    { id: "Maps & GIS", label: "Maps & GIS", icon: Map },
    { id: "Reports", label: "Reports", icon: FileText },
    { id: "Team", label: "Team", icon: Users },
    { id: "Settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-56 shrink-0 bg-[#080A0F] border-r border-white/10 flex flex-col justify-between select-none min-h-[calc(100vh-57px)] font-sans">
      
      {/* Top Navigation Links */}
      <div className="p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 text-left ${
                isActive 
                  ? 'bg-gradient-to-r from-crimson-600 to-crimson-700 text-white shadow-crimson-glow font-semibold' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Cinematic Mountain Landscape Graphic */}
      <div className="p-3 pt-6 relative overflow-hidden">
        
        {/* Landscape Graphic Container */}
        <div className="relative w-full h-32 rounded-xl overflow-hidden border border-crimson-900/30 bg-black/60 shadow-lg">
          
          {/* SVG Mountain Horizon with Crimson Dusk Sky & Water Reflection */}
          <svg className="w-full h-full" viewBox="0 0 200 130" preserveAspectRatio="none">
            <defs>
              {/* Crimson sunset radial */}
              <radialGradient id="skyGlow" cx="50%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#DC2626" stopOpacity="0.85" />
                <stop offset="40%" stopColor="#991B1B" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#080A0F" stopOpacity="1" />
              </radialGradient>

              {/* Water reflection grad */}
              <linearGradient id="waterReflect" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7F1D1D" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#080A0F" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Sky */}
            <rect width="200" height="130" fill="url(#skyGlow)" />

            {/* Glowing red sun on horizon */}
            <circle cx="100" cy="55" r="16" fill="#EF4444" opacity="0.6" filter="blur(2px)" />

            {/* Distant Mountain Peak */}
            <path d="M 0,80 L 45,45 L 80,68 L 105,38 L 135,62 L 170,42 L 200,75 L 200,130 L 0,130 Z" fill="#120A0E" opacity="0.9" />

            {/* Foreground Rugged Mountain */}
            <path d="M 0,95 L 30,70 L 60,85 L 90,65 L 125,90 L 165,72 L 200,95 L 200,130 L 0,130 Z" fill="#090508" />

            {/* Lake / Water River Shoreline */}
            <rect y="100" width="200" height="30" fill="url(#waterReflect)" />
            <path d="M 10,105 Q 60,102 110,105 T 190,106" stroke="#EF4444" strokeWidth="0.8" opacity="0.4" fill="none" />
            <path d="M 25,115 Q 80,112 135,115 T 180,116" stroke="#EF4444" strokeWidth="0.5" opacity="0.3" fill="none" />
          </svg>

          {/* Dark gradient vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080A0F] via-transparent to-transparent opacity-80" />
        </div>

        {/* Tagline under image */}
        <div className="mt-2.5 text-center font-sans">
          <p className="text-[11px] font-semibold text-slate-300 leading-tight">
            Safer Communities
          </p>
          <p className="text-[10px] text-slate-500 leading-tight">
            Stronger Tomorrow
          </p>
        </div>

      </div>

    </aside>
  );
}
