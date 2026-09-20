import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  ShieldAlert, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Layers, 
  Flame, 
  Radio,
  FileText
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import MetricCard from '../components/common/MetricCard';
import StatusIndicator from '../components/common/StatusIndicator';
import { presetMissions } from '../data/plans';
import { useMission } from '../context/MissionContext';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentPlan, loadPresetMission } = useMission();

  // Recharts Mock Data: Risk Score Distribution across active sectors
  const riskDistributionData = [
    { zone: "Sector 1 (Harbor)", risk: 42, threshold: 50 },
    { zone: "Sector 2 (Industrial)", risk: 54, threshold: 50 },
    { zone: "Sector 3 (Highland)", risk: 36, threshold: 50 },
    { zone: "Sector 4 (Lowland)", risk: 88, threshold: 50 },
    { zone: "Sector 5 (Downtown)", risk: 81, threshold: 50 },
    { zone: "Sector 6 (Ridge)", risk: 74, threshold: 50 }
  ];

  // Recharts Mock Data: Stress Test Simulation Outcomes
  const stressTestOutcomeData = [
    { name: "Failed Under Stress (Detour Required)", value: 29, color: "#EF4444" },
    { name: "Passed Robustness (Direct Pass)", value: 14, color: "#10B981" },
    { name: "Warning / Degraded Margin", value: 5, color: "#F59E0B" }
  ];

  // Active Rescue Operations in Theater
  const activeOperations = [
    {
      id: "OP-441",
      mission: "Sector 4 Lowland Basin Surge",
      planId: "RP-2048",
      status: "Ready for Stress Test",
      leadUnit: "Team Alpha (UGV-01)",
      survivors: 14,
      risk: "CRITICAL (88)",
      riskColor: "text-crimson-400"
    },
    {
      id: "OP-440",
      mission: "North Ridge Wildfire Perimeter",
      planId: "RP-2049",
      status: "Stress Test Passed",
      leadUnit: "Helo Recon 2",
      survivors: 8,
      risk: "HIGH (74)",
      riskColor: "text-amber-400"
    },
    {
      id: "OP-439",
      mission: "Downtown Seismic Sector 12",
      planId: "RP-2050",
      status: "Verified & Dispatched",
      leadUnit: "K9 Search Fleet",
      survivors: 26,
      risk: "VERIFIED (22)",
      riskColor: "text-emerald-400"
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0D121D] border border-white/20 p-2.5 rounded shadow-2xl text-xs font-mono">
          <p className="text-white font-bold">{label || payload[0].name}</p>
          <p className="text-cyan-400">
            {payload[0].value} {payload[0].name ? "Plans" : "Risk Score"}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#080A0F] text-slate-100 font-sans pb-16 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 uppercase tracking-wider mb-1">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>COMMAND OVERVIEW & TELEMETRY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Disaster Response Operations Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
              High-level overview of active disaster plans, simulated perturbation stress tests, and field deployments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/create-plan')}
              className="px-5 py-2.5 rounded-lg bg-crimson-600 hover:bg-crimson-500 text-white font-bold text-xs uppercase tracking-wider shadow-crimson-glow flex items-center gap-2"
            >
              <span>Create Rescue Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 CORE METRIC STAT CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <MetricCard
            label="Active Rescue Plans"
            value="12"
            variant="cyan"
            icon={Layers}
            subtext="Tactical plans currently staged in theater."
          />

          <MetricCard
            label="Stress Tests Executed"
            value="48"
            variant="cyan"
            icon={Zap}
            subtext="Perturbations and compound failure simulations."
          />

          <MetricCard
            label="High-Risk Plans"
            value="4"
            variant="crimson"
            icon={AlertTriangle}
            delta="FAILURES DETECTED"
            subtext="Require alternative corridor synthesis."
          />

          <MetricCard
            label="Verified Plans"
            value="31"
            variant="emerald"
            icon={CheckCircle2}
            delta="HUMAN AUTHORIZED"
            subtext="Dispatched to field teams and robotic fleet."
          />

        </div>

        {/* RECHARTS SECTION: RISK DISTRIBUTION & STRESS TEST RESULTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Chart 1: Risk Distribution Chart */}
          <div className="lg:col-span-7 p-6 rounded-xl bg-[#0D121D] border border-white/10 shadow-command">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Disaster Sector Risk Distribution
                </span>
                <span className="text-[10px] text-slate-400 font-sans">
                  Composite risk score across monitored municipal zones
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-crimson-950/60 border border-crimson-800/40 text-crimson-400">
                CRITICAL THRESHOLD: 50
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis 
                    dataKey="zone" 
                    stroke="#64748B" 
                    fontSize={10} 
                    tickLine={false}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis 
                    stroke="#64748B" 
                    fontSize={10} 
                    domain={[0, 100]} 
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="risk" 
                    radius={[4, 4, 0, 0]}
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.risk > 70 ? '#EF4444' : entry.risk > 50 ? '#F59E0B' : '#06B6D4'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Stress-Test Outcomes (Pass vs Fail under Simulation) */}
          <div className="lg:col-span-5 p-6 rounded-xl bg-[#0D121D] border border-white/10 shadow-command flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">
                    Stress-Test Simulation Outcomes
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans">
                    48 Total Monte Carlo Perturbation Runs
                  </span>
                </div>
              </div>

              <div className="h-56 sm:h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stressTestOutcomeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {stressTestOutcomeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5 text-[11px]">
              {stressTestOutcomeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 truncate max-w-[200px]">{item.name}</span>
                  </div>
                  <strong className="text-white">{item.value} plans</strong>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ACTIVE RESCUE OPERATIONS IN THEATER */}
        <div className="p-6 rounded-xl bg-[#0D121D] border border-white/10 shadow-command">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Active Tactical Rescue Operations
              </span>
              <span className="text-[10px] text-slate-400 font-sans">
                Real-time status of assigned field units and mission plans
              </span>
            </div>
            <button 
              onClick={() => navigate('/analysis')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View Active Plan #{currentPlan.id}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-500 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Operation ID</th>
                  <th className="py-2.5 px-3">Mission Name</th>
                  <th className="py-2.5 px-3">Rescue Plan</th>
                  <th className="py-2.5 px-3">Lead Unit</th>
                  <th className="py-2.5 px-3">Survivors</th>
                  <th className="py-2.5 px-3">Stress Risk Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {activeOperations.map((op) => (
                  <tr key={op.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 font-bold text-cyan-400">{op.id}</td>
                    <td className="py-3 px-3 text-white font-semibold">{op.mission}</td>
                    <td className="py-3 px-3 text-slate-300">{op.planId}</td>
                    <td className="py-3 px-3 text-slate-400">{op.leadUnit}</td>
                    <td className="py-3 px-3 text-amber-300">{op.survivors} Civilians</td>
                    <td className={`py-3 px-3 font-bold ${op.riskColor}`}>{op.risk}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          loadPresetMission(op.planId);
                          navigate('/analysis');
                        }}
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[11px]"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
