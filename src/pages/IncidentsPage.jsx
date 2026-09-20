import React, { useState } from 'react';
import { 
  Radio, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Search, 
  Filter, 
  Clock, 
  Calendar, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import StatusIndicator from '../components/common/StatusIndicator';
import { useMission } from '../context/MissionContext';

export default function IncidentsPage() {
  const { incidents } = useMission();
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIncident, setSelectedIncident] = useState(null);

  const filters = ["All", "Critical", "Warning", "Resolved"];

  const filteredIncidents = incidents.filter(inc => {
    const matchesFilter = filter === "All" || inc.severity.toLowerCase() === filter.toLowerCase();
    const matchesSearch = searchQuery === "" || 
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.planId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getSeverityBadge = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-crimson-950/80 border-crimson-600/50 text-crimson-300 shadow-crimson-glow';
      case 'warning':
        return 'bg-amber-950/80 border-amber-500/50 text-amber-300';
      case 'resolved':
        return 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-emerald-glow';
      default:
        return 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300';
    }
  };

  return (
    <div className="min-h-screen bg-[#080A0F] text-slate-100 font-sans pb-16 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 uppercase tracking-wider mb-1">
              <Radio className="w-3.5 h-3.5" />
              <span>LIVE INCIDENT & EVENT STREAM</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Mission Incidents & Disaster Audit
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
              Chronological log of disaster perturbations, stress-test failures, and tactical plan authorizations.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400">FEED STATUS:</span>
            <StatusIndicator status="Operational" size="sm" />
            <span className="text-slate-500 text-[11px]">(840 msg/sec)</span>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#0D121D] border border-white/10 text-xs">
          
          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
            <span className="text-slate-400 text-[11px] uppercase mr-2 hidden sm:inline">Filter:</span>
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  filter === f 
                    ? f === 'Critical' 
                      ? 'bg-crimson-950 border-crimson-500 text-crimson-300 font-bold' 
                      : f === 'Warning'
                        ? 'bg-amber-950 border-amber-500 text-amber-300 font-bold'
                        : f === 'Resolved'
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search plan ID, route, event..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

        </div>

        {/* TIMELINE LIST */}
        <div className="relative border-l-2 border-white/10 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-6">
          {filteredIncidents.map((incident) => {
            const isSelected = selectedIncident?.id === incident.id;

            return (
              <div 
                key={incident.id} 
                onClick={() => setSelectedIncident(incident)}
                className={`relative group cursor-pointer transition-all duration-200 ${
                  isSelected ? 'scale-[1.01]' : ''
                }`}
              >
                {/* Timeline node icon on the line */}
                <div className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-6 h-6 rounded-full border flex items-center justify-center text-[10px] ${
                  incident.severity === 'Critical' 
                    ? 'bg-crimson-950 border-crimson-500 text-crimson-400 shadow-crimson-glow' 
                    : incident.severity === 'Warning'
                      ? 'bg-amber-950 border-amber-500 text-amber-400'
                      : 'bg-emerald-950 border-emerald-500 text-emerald-400 shadow-emerald-glow'
                }`}>
                  {incident.severity === 'Critical' ? '!' : incident.severity === 'Warning' ? '▲' : '✓'}
                </div>

                {/* Event Card */}
                <div className={`p-5 rounded-xl bg-[#0D121D] border transition-all ${
                  isSelected 
                    ? 'border-cyan-500 bg-[#111827] shadow-cyan-glow' 
                    : 'border-white/10 hover:border-white/20 hover:bg-[#0f1522]'
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="text-cyan-400 font-bold text-xs bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                        {incident.planId}
                      </span>
                      <span className="text-slate-400 text-xs truncate max-w-xs sm:max-w-md">
                        {incident.missionName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getSeverityBadge(incident.severity)}`}>
                        {incident.severity}
                      </span>
                      <span className="text-slate-400 text-[11px] flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {incident.time}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white tracking-wide">
                    {incident.title}
                  </h3>

                  <p className="text-xs text-slate-300 font-sans mt-1.5 leading-relaxed">
                    {incident.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                    <span>CATEGORY: <strong className="text-slate-400">{incident.category}</strong></span>
                    <span>STATUS: <strong className={incident.resolved ? "text-emerald-400" : "text-amber-400"}>{incident.status}</strong></span>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredIncidents.length === 0 && (
            <div className="p-8 text-center bg-white/5 rounded-xl border border-white/10 text-slate-400">
              No incidents matching active query or severity filters.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
