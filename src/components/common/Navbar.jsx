import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Activity, 
  FilePlus, 
  BarChart3, 
  Zap, 
  GitFork, 
  Radio, 
  Server, 
  Bell, 
  User, 
  Menu, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  Layers
} from 'lucide-react';
import StatusIndicator from './StatusIndicator';
import { useMission } from '../../context/MissionContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, currentPlan, approvalStatus } = useMission();

  const navLinks = [
    { to: "/", label: "Home", icon: ShieldAlert },
    { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { to: "/create-plan", label: "Create Plan", icon: FilePlus },
    { to: "/analysis", label: "Plan Analysis", icon: Layers },
    { to: "/stress-test", label: "Stress Test", icon: Zap },
    { to: "/alternative-plan", label: "Alternative Plan", icon: GitFork },
    { to: "/incidents", label: "Incidents", icon: Radio },
    { to: "/system-status", label: "System Status", icon: Server },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#080A0F]/90 backdrop-blur-md border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Tagline Pill */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-crimson-950/80 border border-crimson-600/40 flex items-center justify-center text-crimson-500 group-hover:border-crimson-500 transition-all shadow-crimson-glow">
                <ShieldAlert className="w-5 h-5 transition-transform group-hover:scale-110" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold tracking-wider text-base text-white font-mono">
                    RESCUEPLAN
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-crimson-600 text-white font-bold tracking-widest font-mono">
                    AI
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono tracking-tight -mt-0.5 hidden sm:block">
                  TACTICAL STRESS SIMULATOR
                </span>
              </div>
            </Link>

            {/* Active Plan Pill Indicator */}
            {currentPlan && (
              <div className="hidden xl:flex items-center gap-2 ml-4 pl-3 border-l border-white/10 py-1">
                <span className="text-[11px] font-mono text-slate-400">ACTIVE:</span>
                <span className="text-xs font-mono font-medium text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                  #{currentPlan.id}
                </span>
                {approvalStatus === "VERIFIED" ? (
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                    STAGE: {currentPlan.status.slice(0, 16)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Desktop Global Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium font-mono transition-all
                  ${isActive 
                    ? 'bg-white/10 text-white border border-white/15 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }
                `}
              >
                <item.icon className="w-3.5 h-3.5 opacity-70" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Utilities (Status, Notifications, Operator) */}
          <div className="flex items-center space-x-3">
            {/* System Status Pill */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-black/40 border border-white/10">
              <StatusIndicator status="Operational" size="sm" showLabel={false} />
              <span className="text-[11px] font-mono text-slate-300">AI CORES 100%</span>
            </div>

            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Telemetry Alerts"
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-crimson-600 text-[10px] font-bold text-white flex items-center justify-center font-mono">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-[#0D121D] border border-white/15 rounded-lg shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs font-mono font-semibold text-slate-200 tracking-wider">
                      TACTICAL NOTIFICATIONS
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {notifications.length} Unread
                    </span>
                  </div>
                  <div className="mt-2 space-y-2 max-h-64 overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2 rounded bg-white/5 border border-white/5 text-xs">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-200">
                          <span className="flex items-center gap-1">
                            {n.type === 'warning' ? (
                              <AlertTriangle className="w-3 h-3 text-amber-400" />
                            ) : (
                              <Activity className="w-3 h-3 text-cyan-400" />
                            )}
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Operator Profile */}
            <div className="hidden md:flex items-center gap-2 pl-2 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                <User className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-medium text-slate-200 leading-tight">Cmdr. A. Chen</span>
                <span className="text-[10px] font-mono text-emerald-400 leading-tight">OPERATOR ACTIVE</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A0E17] border-b border-white/10 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-2 px-3 py-2.5 rounded text-sm font-mono
                ${isActive 
                  ? 'bg-crimson-950/40 text-crimson-400 border border-crimson-800/40' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400 px-3">
            <span>Operator: Cmdr. A. Chen</span>
            <StatusIndicator status="Operational" size="sm" />
          </div>
        </div>
      )}
    </header>
  );
}
