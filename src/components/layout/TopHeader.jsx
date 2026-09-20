import React from 'react';
import { 
  Radio, 
  MapPin, 
  Clock, 
  Calendar, 
  Activity, 
  ShieldAlert,
  ChevronDown
} from 'lucide-react';

export default function TopHeader({ onToggleLiveFeed, isLiveFeed = true }) {
  return (
    <header className="relative w-full bg-[#080A0F] border-b border-white/10 px-4 sm:px-6 py-3 select-none">
      {/* Subtle crimson laser accent line across bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-crimson-600/40 to-transparent" />

      <div className="flex items-center justify-between gap-4">
        
        {/* Left Side: Brand Logo & Tagline + Live Feed Badge */}
        <div className="flex items-center gap-6">
          
          {/* ResQShield AI Brand Logo */}
          <div className="flex items-center gap-2.5">
            {/* Shield with ECG / Heartbeat line */}
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-b from-crimson-900/60 to-black border border-crimson-600/60 flex items-center justify-center text-crimson-500 shadow-crimson-glow">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M7 12h2.5l1.5-3 2 6 1.5-3H17" stroke="#EF4444" strokeWidth="2" />
              </svg>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1 leading-tight">
                <span className="font-extrabold text-base tracking-wide text-white font-sans">
                  ResQShield
                </span>
                <span className="font-extrabold text-base tracking-wider text-crimson-500 font-mono">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider -mt-0.5">
                Detect • Analyse • Plan • Protect
              </span>
            </div>
          </div>

          {/* Live Disaster Feed Status Indicator Pill */}
          <button
            onClick={onToggleLiveFeed}
            className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson-950/40 border border-crimson-600/50 hover:border-crimson-500 transition-all text-crimson-400 font-mono text-xs shadow-crimson-glow cursor-pointer"
            title="Toggle Live Telemetry Stream"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-crimson-500" />
            </span>
            <span className="text-[11px] font-bold tracking-wide">
              Live Disaster Feed
            </span>
          </button>

        </div>

        {/* Right Side: Timestamp + Location Pin + Response Unit Profile */}
        <div className="flex items-center gap-4 sm:gap-6 font-mono text-xs">
          
          {/* Date & Time */}
          <div className="hidden lg:flex items-center gap-2 text-slate-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            <span className="text-slate-200 font-medium">May 4, 2025</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 font-bold">05:22 AM</span>
          </div>

          {/* Location Pin */}
          <div className="hidden sm:flex items-center gap-1.5 text-slate-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            <MapPin className="w-3.5 h-3.5 text-crimson-400" />
            <span className="text-slate-200 font-semibold">Chennai, India</span>
          </div>

          {/* Emergency Response Unit Operator Profile */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-4 sm:border-l border-white/10">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-crimson-500/40 bg-slate-800 shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                alt="Response Unit Commander" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-200 text-xs font-bold font-mono">
                RQ
              </div>
            </div>

            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-white font-sans">
                Team ResQShield
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Emergency Response Unit
              </span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
