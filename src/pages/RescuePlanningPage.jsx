import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Clock, 
  Radio, 
  Users, 
  Truck, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Zap, 
  Flame, 
  Waves, 
  Activity, 
  Wind, 
  Mountain, 
  Factory, 
  Battery, 
  Cross, 
  Compass,
  Layers,
  ChevronRight,
  RefreshCw,
  Copy,
  Check,
  Navigation
} from 'lucide-react';

const DISASTER_TYPES = [
  { id: 'Flood', label: 'Flood', icon: Waves, color: 'text-blue-400', border: 'border-blue-500/40', activeBg: 'bg-blue-950/60' },
  { id: 'Earthquake', label: 'Earthquake', icon: Activity, color: 'text-amber-400', border: 'border-amber-500/40', activeBg: 'bg-amber-950/60' },
  { id: 'Cyclone', label: 'Cyclone', icon: Wind, color: 'text-cyan-400', border: 'border-cyan-500/40', activeBg: 'bg-cyan-950/60' },
  { id: 'Landslide', label: 'Landslide', icon: Mountain, color: 'text-orange-400', border: 'border-orange-500/40', activeBg: 'bg-orange-950/60' },
  { id: 'Wildfire', label: 'Wildfire', icon: Flame, color: 'text-red-400', border: 'border-red-500/40', activeBg: 'bg-red-950/60' },
  { id: 'Industrial Accident', label: 'Industrial Accident', icon: Factory, color: 'text-purple-400', border: 'border-purple-500/40', activeBg: 'bg-purple-950/60' },
];

const SEVERITY_LEVELS = [
  { id: 'Low', label: 'Low', badge: 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400' },
  { id: 'Moderate', label: 'Moderate', badge: 'bg-amber-950/60 border-amber-500/50 text-amber-400' },
  { id: 'High', label: 'High', badge: 'bg-orange-950/60 border-orange-500/50 text-orange-400' },
  { id: 'Critical', label: 'Critical', badge: 'bg-crimson-950/80 border-crimson-500/80 text-crimson-300 shadow-crimson-glow' },
];

const PRIORITY_LEVELS = ['Critical', 'High', 'Medium', 'Low'];

const ROAD_CONDITIONS = ['Clear', 'Partially Blocked', 'Blocked'];
const WEATHER_OPTIONS = ['Normal', 'Heavy Rain', 'Storm', 'Extreme'];
const COMM_STATUSES = ['Stable', 'Intermittent', 'Lost'];

const HAZARDS_LIST = [
  'Flood Water',
  'Landslide',
  'Fire',
  'Structural Damage',
  'Power Failure'
];

export default function RescuePlanningPage({ onBack, onRunStressTest, onExecutePlan }) {
  // Plan metadata
  const [planId, setPlanId] = useState('RP-2026-CHN-094');
  const [currentTime, setCurrentTime] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  // Form State
  const [disasterType, setDisasterType] = useState('Flood');
  const [severity, setSeverity] = useState('Critical');
  const [disasterZone, setDisasterZone] = useState('Velachery Lowland Basin & Madipakkam Lowlands, Sector 4');
  const [peopleAffected, setPeopleAffected] = useState(1450);
  const [priority, setPriority] = useState('Critical');

  // Rescue Resources
  const [rescueTeams, setRescueTeams] = useState('NDRF 04 Battalion, SDRF Swift Water Unit 2');
  const [vehicles, setVehicles] = useState('2 Amphibious UGVs, 4 RIB Rescue Boats, 2 High-Water Unimogs');
  const [dronesRobots, setDronesRobots] = useState('DJI Matrice 300 RTK (FLIR Thermal), Submersible Sonar ROV-1');
  const [fuelBattery, setFuelBattery] = useState(92);
  const [medicalSupplies, setMedicalSupplies] = useState('Class-A Trauma Packs (x16), Portable Resuscitators (x6), Hypothermia Blankets (x120)');
  const [resourceCommStatus, setResourceCommStatus] = useState('Stable');

  // Current Conditions
  const [roadCondition, setRoadCondition] = useState('Partially Blocked');
  const [weatherCondition, setWeatherCondition] = useState('Heavy Rain');
  const [commStatus, setCommStatus] = useState('Intermittent');
  const [activeHazards, setActiveHazards] = useState(['Flood Water', 'Power Failure']);

  // Survivor Information
  const [survivorLocation, setSurvivorLocation] = useState('Velachery Lake View Towers & Metro concourse');
  const [estimatedCount, setEstimatedCount] = useState(340);
  const [criticalPatients, setCriticalPatients] = useState(18);
  const [evacuationPriority, setEvacuationPriority] = useState('Critical');
  const [nearestSafeZone, setNearestSafeZone] = useState('IIT Madras High-Ground Relief Staging Camp (3.2 km)');

  // Flow State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [isPlanGenerated, setIsPlanGenerated] = useState(false);

  // Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true, 
        timeZoneName: 'short' 
      };
      setCurrentTime(now.toLocaleString('en-US', options));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyId = () => {
    navigator.clipboard?.writeText(planId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1500);
  };

  const handleHazardToggle = (hazard) => {
    setActiveHazards(prev => 
      prev.includes(hazard) 
        ? prev.filter(h => h !== hazard)
        : [...prev, hazard]
    );
  };

  const handleApplyPreset = (presetKey) => {
    if (presetKey === 'flood') {
      setDisasterType('Flood');
      setSeverity('Critical');
      setDisasterZone('Velachery Lowland Basin & Madipakkam Lowlands, Sector 4');
      setPeopleAffected(1450);
      setPriority('Critical');
      setRescueTeams('NDRF 04 Battalion, SDRF Swift Water Unit 2');
      setVehicles('2 Amphibious UGVs, 4 RIB Rescue Boats, 2 High-Water Unimogs');
      setDronesRobots('DJI Matrice 300 RTK (FLIR Thermal), Submersible Sonar ROV-1');
      setFuelBattery(92);
      setMedicalSupplies('Class-A Trauma Packs (x16), Portable Resuscitators (x6), Hypothermia Blankets (x120)');
      setResourceCommStatus('Stable');
      setRoadCondition('Partially Blocked');
      setWeatherCondition('Heavy Rain');
      setCommStatus('Intermittent');
      setActiveHazards(['Flood Water', 'Power Failure']);
      setSurvivorLocation('Velachery Lake View Towers & Metro concourse');
      setEstimatedCount(340);
      setCriticalPatients(18);
      setEvacuationPriority('Critical');
      setNearestSafeZone('IIT Madras High-Ground Relief Staging Camp (3.2 km)');
    } else if (presetKey === 'earthquake') {
      setDisasterType('Earthquake');
      setSeverity('Critical');
      setDisasterZone('Downtown Metro Sector 12 - Civic Commercial Grid');
      setPeopleAffected(2840);
      setPriority('Critical');
      setRescueTeams('NDRF Heavy Urban SAR Unit 6, K-9 Acoustic Search Team');
      setVehicles('Heavy Concrete Cutters, 3 Armored Extraction UGVs');
      setDronesRobots('Skydio Autonomous Acoustic Mapping Quadcopters');
      setFuelBattery(88);
      setMedicalSupplies('Crush Injury Trauma Sets, Blood Transfusion Units (x20)');
      setResourceCommStatus('Intermittent');
      setRoadCondition('Blocked');
      setWeatherCondition('Normal');
      setCommStatus('Lost');
      setActiveHazards(['Structural Damage', 'Fire', 'Power Failure']);
      setSurvivorLocation('Civic Tower Sub-Basement Parking B2');
      setEstimatedCount(520);
      setCriticalPatients(45);
      setEvacuationPriority('Critical');
      setNearestSafeZone('Nehru Stadium Triage & Field Hospital (2.8 km)');
    } else if (presetKey === 'industrial') {
      setDisasterType('Industrial Accident');
      setSeverity('High');
      setDisasterZone('Manali Petrochemical Complex - Tank Farm 4');
      setPeopleAffected(960);
      setPriority('High');
      setRescueTeams('HazMat Containment Squad Alpha, Fire Rescue Unit 8');
      setVehicles('Chemical Foam Tenders (x3), Positive Pressure Ambulances');
      setDronesRobots('Thermal Gas-Sniffing Drone UAV-09 (VOC & Ammonia)');
      setFuelBattery(95);
      setMedicalSupplies('Cyanide Antidotes, Chemical Burn Sterile Irrigators');
      setResourceCommStatus('Stable');
      setRoadCondition('Clear');
      setWeatherCondition('Extreme');
      setCommStatus('Stable');
      setActiveHazards(['Fire', 'Power Failure']);
      setSurvivorLocation('Refinery Control Bunker 3 (West Perimeter)');
      setEstimatedCount(85);
      setCriticalPatients(12);
      setEvacuationPriority('High');
      setNearestSafeZone('Tiruvottiyur Decontamination Zone (4.5 km)');
    } else if (presetKey === 'landslide') {
      setDisasterType('Landslide');
      setSeverity('High');
      setDisasterZone('Kodaikanal Ghat Pass - Mile 14 Mudflow Corridor');
      setPeopleAffected(320);
      setPriority('High');
      setRescueTeams('Mountain Rescue Team Bravo, SDRF Rope Extraction');
      setVehicles('All-Terrain Tracked Hagglunds, 2 Off-Road 4x4s');
      setDronesRobots('LiDAR Topography Scanning Hexacopter');
      setFuelBattery(79);
      setMedicalSupplies('Fracture Splints, Hypothermia Body Pods (x30)');
      setResourceCommStatus('Intermittent');
      setRoadCondition('Blocked');
      setWeatherCondition('Heavy Rain');
      setCommStatus('Intermittent');
      setActiveHazards(['Landslide', 'Flood Water']);
      setSurvivorLocation('Ghat Bus Stand Shelter & Stranded Vehicles');
      setEstimatedCount(64);
      setCriticalPatients(7);
      setEvacuationPriority('High');
      setNearestSafeZone('Batlagundu Valley Foothill Camp (8.1 km)');
    }
  };

  // Generation Sequence Animation
  const handleStartGeneration = () => {
    setIsGenerating(true);
    setGenerationStep(0);

    const stepIntervals = [
      { step: 1, delay: 600 },   // Analysing disaster conditions...
      { step: 2, delay: 1400 },  // Checking available resources...
      { step: 3, delay: 2300 },  // Calculating rescue routes...
      { step: 4, delay: 3200 },  // Evaluating hazards...
      { step: 5, delay: 4100 },  // Generating rescue plan...
    ];

    stepIntervals.forEach(({ step, delay }) => {
      setTimeout(() => {
        setGenerationStep(step);
      }, delay);
    });

    // Complete and show plan
    setTimeout(() => {
      setIsGenerating(false);
      setIsPlanGenerated(true);
    }, 4900);
  };

  const stepsList = [
    { title: "Analysing disaster conditions...", desc: `Processing ${disasterType} telemetry, water velocity & rainfall rates` },
    { title: "Checking available resources...", desc: `Allocating ${rescueTeams.split(',')[0]} • ${fuelBattery}% reserves` },
    { title: "Calculating rescue routes...", desc: "Synthesizing 3 candidate extraction corridors via neural graph" },
    { title: "Evaluating hazards...", desc: `Auditing ${activeHazards.join(', ')} choke points & overpasses` },
    { title: "Generating rescue plan...", desc: "Finalizing Ingress / Egress protocol and survival margins" },
  ];

  return (
    <div className="space-y-4 max-w-7xl mx-auto font-sans pb-10">
      
      {/* ── 1. PAGE HEADER ── */}
      <div className="rounded-xl bg-[#0D121D] border border-white/10 p-4 sm:p-5 shadow-command">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <button 
                onClick={onBack}
                className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors mr-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
              </button>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1.5 text-xs font-mono text-crimson-400 font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>MISSION VECTOR CONFIGURATOR</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Create Rescue Plan</span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 text-amber-400">
                ● DRAFT
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Configure disaster conditions and generate an AI-assisted rescue plan.
            </p>
          </div>

          {/* Telemetry & Metadata Pills */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-mono">
            {/* Plan ID */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-slate-300">
              <span className="text-slate-500">ID:</span>
              <span className="font-bold text-white tracking-wider">{planId}</span>
              <button 
                onClick={handleCopyId}
                title="Copy Plan ID"
                className="text-slate-400 hover:text-cyan-400 ml-1 transition-colors"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Current Location */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span className="truncate max-w-[170px] sm:max-w-[210px]">Chennai Ops HQ, Zone 4</span>
            </div>

            {/* Current Time */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentTime || '2026-09-20 11:45 AM IST'}</span>
            </div>
          </div>

        </div>

        {/* Quick Presets Bar */}
        <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mr-1">
            QUICK PRESETS:
          </span>
          <button
            type="button"
            onClick={() => handleApplyPreset('flood')}
            className="px-2.5 py-1 rounded bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/30 text-[11px] font-mono text-blue-300 flex items-center gap-1.5 transition-all"
          >
            <Waves className="w-3 h-3 text-blue-400" />
            <span>Chennai Coastal Flood</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('earthquake')}
            className="px-2.5 py-1 rounded bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 text-[11px] font-mono text-amber-300 flex items-center gap-1.5 transition-all"
          >
            <Activity className="w-3 h-3 text-amber-400" />
            <span>Urban Seismic Collapse</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('industrial')}
            className="px-2.5 py-1 rounded bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-[11px] font-mono text-purple-300 flex items-center gap-1.5 transition-all"
          >
            <Factory className="w-3 h-3 text-purple-400" />
            <span>Industrial Hazmat Leak</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('landslide')}
            className="px-2.5 py-1 rounded bg-orange-950/40 hover:bg-orange-900/50 border border-orange-500/30 text-[11px] font-mono text-orange-300 flex items-center gap-1.5 transition-all"
          >
            <Mountain className="w-3 h-3 text-orange-400" />
            <span>Ghat Mudslide Corridor</span>
          </button>
        </div>
      </div>

      {/* ── CONDITIONAL RENDER: GENERATED PLAN VIEW OR INPUT FORM ── */}
      {isPlanGenerated ? (
        /* ── GENERATED PLAN ANALYSIS VIEW ── */
        <div className="space-y-4 animate-in fade-in duration-300">
          
          {/* Plan Synthesized Alert Banner */}
          <div className="rounded-xl bg-gradient-to-r from-emerald-950/50 via-[#0D121D] to-cyan-950/50 border border-emerald-500/40 p-4 shadow-emerald-glow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    PLAN SYNTHESIZED BY AI ENGINE
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs font-mono text-slate-400">MISSION: OPERATION CHENNAI SURGE SHIELD</span>
                </div>
                <h2 className="text-lg font-bold text-white font-mono">
                  {planId} — Primary Evacuation Vector Active
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
              <button
                onClick={() => setIsPlanGenerated(false)}
                className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 transition-colors"
              >
                Modify Parameters
              </button>
              <button
                onClick={onRunStressTest}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-crimson-glow flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Stress-Test Plan</span>
              </button>
            </div>
          </div>

          {/* Metrics Row (5 Core KPI Cards) */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-xl bg-[#0D121D] border border-crimson-500/30 font-mono">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">AI Risk Score</div>
              <div className="text-2xl font-black text-crimson-400">78<span className="text-xs text-slate-500 font-normal">/100</span></div>
              <div className="text-[10px] text-amber-400 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 shrink-0" /> High Inundation
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D121D] border border-cyan-500/30 font-mono">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Reliability Base</div>
              <div className="text-2xl font-black text-cyan-400">68<span className="text-xs text-slate-500 font-normal">%</span></div>
              <div className="text-[10px] text-cyan-300 mt-1">Unverified Stress Risk</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D121D] border border-white/10 font-mono">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Est. Rescue Time</div>
              <div className="text-2xl font-black text-white">42 <span className="text-xs text-slate-500 font-normal">min</span></div>
              <div className="text-[10px] text-emerald-400 mt-1">Golden Window: 75m</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D121D] border border-white/10 font-mono">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Corridor Distance</div>
              <div className="text-2xl font-black text-white">6.8 <span className="text-xs text-slate-500 font-normal">km</span></div>
              <div className="text-[10px] text-slate-400 mt-1">Via Kathipara Link</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D121D] border border-white/10 font-mono col-span-2 md:col-span-1">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Resource Reserve</div>
              <div className="text-2xl font-black text-emerald-400">{fuelBattery}<span className="text-xs text-slate-500 font-normal">%</span></div>
              <div className="text-[10px] text-emerald-300 mt-1">2.4 kWh / Vehicle</div>
            </div>
          </div>

          {/* Grid Layout: Map & Tactical Route + Action Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Left: GIS Route Vector Preview */}
            <div className="lg:col-span-7 rounded-xl bg-[#0D121D] border border-white/10 p-4 shadow-command flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                    PRIMARY EXTRACTION VECTOR & ELEVATION AUDIT
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">
                  CORRIDOR ALPHA
                </span>
              </div>

              {/* Tactical SVG Map Graphic */}
              <div className="relative w-full h-64 sm:h-72 rounded-lg overflow-hidden border border-white/10 bg-[#05070A] flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 500 300" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <defs>
                    <pattern id="gridPatternPlan" width="25" height="25" patternUnits="userSpaceOnUse">
                      <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#1E293B" strokeWidth="0.5" opacity="0.4" />
                    </pattern>
                  </defs>
                  <rect width="500" height="300" fill="url(#gridPatternPlan)" />

                  {/* Water Body / Flood Inundation Zone */}
                  <path d="M 120,60 Q 220,110 280,180 T 450,220 L 500,300 L 80,300 Z" fill="#0C4A6E" opacity="0.25" />
                  <path d="M 200,120 Q 260,160 320,190" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.6" />

                  {/* Route Corridor Vector */}
                  <path 
                    d="M 60,80 L 160,130 L 260,140 L 360,200 L 440,240" 
                    fill="none" 
                    stroke="#EF4444" 
                    strokeWidth="3.5" 
                    strokeDasharray="6 4"
                  />
                  <path 
                    d="M 60,80 L 160,130 L 260,140 L 360,200 L 440,240" 
                    fill="none" 
                    stroke="#F87171" 
                    strokeWidth="1.5" 
                    opacity="0.8"
                  />

                  {/* Hazard Zone Highlight (Kathipara bottleneck) */}
                  <circle cx="260" cy="140" r="30" fill="#DC2626" opacity="0.15" />
                  <circle cx="260" cy="140" r="18" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />

                  {/* Waypoint 1: Staging Base */}
                  <circle cx="60" cy="80" r="7" fill="#065F46" stroke="#10B981" strokeWidth="2" />
                  <text x="75" y="85" fill="#34D399" fontSize="11" fontFamily="monospace" fontWeight="bold">Forward Base Alpha</text>

                  {/* Waypoint 2: Hazard Chokepoint */}
                  <circle cx="260" cy="140" r="7" fill="#991B1B" stroke="#EF4444" strokeWidth="2" />
                  <text x="275" y="135" fill="#FCA5A5" fontSize="11" fontFamily="monospace" fontWeight="bold">Kathipara Overpass (1.8m surge)</text>

                  {/* Waypoint 3: Survivor Haven */}
                  <circle cx="360" cy="200" r="8" fill="#B45309" stroke="#F59E0B" strokeWidth="2" />
                  <text x="310" y="225" fill="#FCD34D" fontSize="11" fontFamily="monospace" fontWeight="bold">Velachery Survivors ({estimatedCount})</text>

                  {/* Waypoint 4: Safe Zone Haven */}
                  <circle cx="440" cy="240" r="7" fill="#065F46" stroke="#10B981" strokeWidth="2" />
                  <text x="365" y="260" fill="#6EE7B7" fontSize="10" fontFamily="monospace">IIT Madras Haven</text>
                </svg>

                {/* Legend Overlay */}
                <div className="absolute bottom-2 left-2 px-2.5 py-1.5 rounded bg-black/80 border border-white/10 text-[10px] font-mono text-slate-300 flex items-center gap-3 backdrop-blur-sm">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Base
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-crimson-500 inline-block" /> Hazard Node
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Target Survivors
                  </div>
                </div>
              </div>

              {/* Waypoint Telemetry List */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <div className="text-[9px] text-slate-500 uppercase">INGRESS STAGE</div>
                  <div className="text-slate-200 font-semibold mt-0.5">Base → Kathipara</div>
                  <div className="text-[10px] text-cyan-400">12 min • Clear Terrain</div>
                </div>
                <div className="p-2 rounded bg-crimson-950/20 border border-crimson-500/20">
                  <div className="text-[9px] text-crimson-400 uppercase">BOTTLENECK NODE</div>
                  <div className="text-slate-200 font-semibold mt-0.5">Kathipara Overpass</div>
                  <div className="text-[10px] text-crimson-300">Water Flow 3.4 m/s</div>
                </div>
                <div className="p-2 rounded bg-black/40 border border-white/5">
                  <div className="text-[9px] text-slate-500 uppercase">TRIAGE EGRESS</div>
                  <div className="text-slate-200 font-semibold mt-0.5">Lake View → IIT Camp</div>
                  <div className="text-[10px] text-emerald-400">18 min • Priority Transfer</div>
                </div>
              </div>

            </div>

            {/* Right: Operational Orders & AI Vulnerability Notice */}
            <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
              
              {/* Operational Summary */}
              <div className="rounded-xl bg-[#0D121D] border border-white/10 p-4 shadow-command space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    AI TACTICAL STRATEGY
                  </span>
                  <span className="text-[10px] text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                    CONCURRENT MULTI-VECTOR
                  </span>
                </div>

                <div className="space-y-2 text-slate-300 leading-relaxed font-sans text-xs">
                  <p className="p-2.5 rounded bg-black/40 border border-white/5">
                    <strong className="text-cyan-300 font-mono">PHASE 1 (RECON):</strong> Deploy DJI Matrice 300 FLIR quadcopter along northern contour to track rooftop survivor signals.
                  </p>
                  <p className="p-2.5 rounded bg-black/40 border border-white/5">
                    <strong className="text-amber-300 font-mono">PHASE 2 (TRIAGE):</strong> UGV-01 amphibian breaches Kathipara overpass. 4 RIB boats extract {criticalPatients} critical patients first.
                  </p>
                  <p className="p-2.5 rounded bg-black/40 border border-white/5">
                    <strong className="text-emerald-300 font-mono">PHASE 3 (EVAC):</strong> Transport 340 survivors to IIT Madras High Ground staging facility with continuous medical stabilization.
                  </p>
                </div>
              </div>

              {/* Stress-Test Vulnerability Alert (The Core Philosophy of ResQShield AI) */}
              <div className="rounded-xl bg-amber-950/30 border border-amber-500/40 p-4 font-mono text-xs space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>UNVERIFIED RESCUE PLAN DETECTED</span>
                </div>
                <p className="text-amber-200/90 font-sans text-xs leading-relaxed">
                  This AI plan relies on the <strong>Kathipara Overpass corridor</strong>. If water surge accelerates past 3.5 m/s or the bridge is fully blocked, vehicles will become stranded.
                </p>
                <div className="text-[11px] text-amber-300/80 font-mono pt-1">
                  Recommendation: Stress-test this plan against increased rainfall & route blockage before human authorization.
                </div>
              </div>

              {/* Direct Actions */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={onRunStressTest}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-crimson-glow flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>ENGAGE STRESS TEST LAB</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={onExecutePlan}
                    className="py-2.5 px-3 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Human Approval</span>
                  </button>

                  <button
                    onClick={onBack}
                    className="py-2.5 px-3 rounded-lg bg-black/60 hover:bg-white/5 border border-white/10 text-slate-300 font-mono text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Back to Dashboard</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* ── CREATE PLAN FORM ── */
        <div className="space-y-4">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* ── LEFT COLUMN: DISASTER INFO & RESOURCES ── */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* ── 2. DISASTER INFORMATION ── */}
              <div className="rounded-xl bg-[#0D121D] border border-white/10 p-4 sm:p-5 shadow-command space-y-4">
                <div className="flex items-center gap-2 pb-2.5 border-b border-white/10">
                  <ShieldAlert className="w-4 h-4 text-crimson-400" />
                  <h2 className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider">
                    2. Disaster Information
                  </h2>
                </div>

                {/* Disaster Type (6 Options) */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-2 font-medium">
                    DISASTER TYPE
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {DISASTER_TYPES.map((type) => {
                      const Icon = type.icon;
                      const isSelected = disasterType === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setDisasterType(type.id)}
                          className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all font-mono text-xs ${
                            isSelected 
                              ? `${type.activeBg} ${type.border} text-white shadow-sm ring-1 ring-white/20` 
                              : 'bg-black/30 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5'
                          }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${type.color}`} />
                          <span className="truncate">{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Severity (4 Levels) */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-2 font-medium">
                    SEVERITY LEVEL
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {SEVERITY_LEVELS.map((sev) => {
                      const isSelected = severity === sev.id;
                      return (
                        <button
                          key={sev.id}
                          type="button"
                          onClick={() => setSeverity(sev.id)}
                          className={`py-2 px-1 rounded-lg border text-center font-mono text-xs transition-all ${
                            isSelected 
                              ? sev.badge 
                              : 'bg-black/30 border-white/5 text-slate-400 hover:bg-white/5 hover:text-slate-200'
                          }`}
                        >
                          {sev.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Disaster Zone Input */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 font-medium">
                    DISASTER ZONE / SECTOR
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={disasterZone}
                      onChange={(e) => setDisasterZone(e.target.value)}
                      placeholder="e.g. Velachery Lowland Basin & Madipakkam, Sector 4"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white font-sans text-xs focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                {/* People Affected & Priority Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5 font-medium">
                      PEOPLE AFFECTED
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        type="number"
                        min="1"
                        value={peopleAffected}
                        onChange={(e) => setPeopleAffected(Number(e.target.value))}
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5 font-medium">
                      MISSION PRIORITY
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                    >
                      {PRIORITY_LEVELS.map(p => (
                        <option key={p} value={p} className="bg-slate-900 text-white">{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>

              {/* ── 3. RESCUE RESOURCES ── */}
              <div className="rounded-xl bg-[#0D121D] border border-white/10 p-4 sm:p-5 shadow-command space-y-4">
                <div className="flex items-center gap-2 pb-2.5 border-b border-white/10">
                  <Truck className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider">
                    3. Rescue Resources
                  </h2>
                </div>

                <div className="space-y-3">
                  {/* Rescue Teams */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5 font-medium">
                      RESCUE TEAMS ON GROUND
                    </label>
                    <input
                      type="text"
                      value={rescueTeams}
                      onChange={(e) => setRescueTeams(e.target.value)}
                      placeholder="e.g. NDRF 04 Battalion, SDRF Water Unit 2"
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white font-sans text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  {/* Vehicles */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5 font-medium">
                      AVAILABLE VEHICLES & WATERCRAFT
                    </label>
                    <input
                      type="text"
                      value={vehicles}
                      onChange={(e) => setVehicles(e.target.value)}
                      placeholder="e.g. 2 Amphibious UGVs, 4 RIB Rescue Boats"
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white font-sans text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  {/* Drones / Autonomous Robots */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5 font-medium">
                      DRONES & AUTONOMOUS ROBOTS
                    </label>
                    <input
                      type="text"
                      value={dronesRobots}
                      onChange={(e) => setDronesRobots(e.target.value)}
                      placeholder="e.g. DJI Matrice 300 RTK (FLIR Thermal)"
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white font-sans text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  {/* Fuel / Battery Slider */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Battery className="w-3.5 h-3.5 text-emerald-400" />
                        FLEET FUEL / BATTERY RESERVE
                      </span>
                      <span className={`font-bold ${fuelBattery > 60 ? 'text-emerald-400' : fuelBattery > 30 ? 'text-amber-400' : 'text-crimson-400'}`}>
                        {fuelBattery}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="100"
                      value={fuelBattery}
                      onChange={(e) => setFuelBattery(Number(e.target.value))}
                      className="w-full h-1.5 bg-black/60 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  {/* Medical Supplies */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5 font-medium">
                      MEDICAL & TRAUMA SUPPLIES
                    </label>
                    <input
                      type="text"
                      value={medicalSupplies}
                      onChange={(e) => setMedicalSupplies(e.target.value)}
                      placeholder="e.g. Class-A Trauma Packs, Hypothermia Blankets"
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white font-sans text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  {/* Communication Status */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5 font-medium">
                      FLEET COMMS UPLINK
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {COMM_STATUSES.map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setResourceCommStatus(status)}
                          className={`py-1.5 rounded-lg border text-center font-mono text-xs transition-all ${
                            resourceCommStatus === status
                              ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                              : 'bg-black/30 border-white/5 text-slate-400 hover:bg-white/5'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN: CONDITIONS & SURVIVOR INFO ── */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* ── 4. CURRENT CONDITIONS ── */}
              <div className="rounded-xl bg-[#0D121D] border border-white/10 p-4 sm:p-5 shadow-command space-y-4">
                <div className="flex items-center gap-2 pb-2.5 border-b border-white/10">
                  <Wind className="w-4 h-4 text-amber-400" />
                  <h2 className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider">
                    4. Current Conditions
                  </h2>
                </div>

                <div className="space-y-3.5">
                  {/* Road Conditions */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5 font-medium">
                      ROAD CONDITIONS
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {ROAD_CONDITIONS.map((cond) => {
                        const isSelected = roadCondition === cond;
                        let badgeClass = 'bg-black/30 border-white/5 text-slate-400 hover:bg-white/5';
                        if (isSelected) {
                          if (cond === 'Clear') badgeClass = 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400';
                          else if (cond === 'Partially Blocked') badgeClass = 'bg-amber-950/60 border-amber-500/50 text-amber-400';
                          else badgeClass = 'bg-crimson-950/80 border-crimson-500/80 text-crimson-300';
                        }
                        return (
                          <button
                            key={cond}
                            type="button"
                            onClick={() => setRoadCondition(cond)}
                            className={`py-1.5 px-2 rounded-lg border text-center font-mono text-xs transition-all ${badgeClass}`}
                          >
                            {cond}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Weather Condition */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5 font-medium">
                      WEATHER STATUS
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {WEATHER_OPTIONS.map((w) => {
                        const isSelected = weatherCondition === w;
                        return (
                          <button
                            key={w}
                            type="button"
                            onClick={() => setWeatherCondition(w)}
                            className={`py-1.5 rounded-lg border text-center font-mono text-xs transition-all ${
                              isSelected 
                                ? 'bg-blue-950/70 border-blue-500/50 text-blue-300' 
                                : 'bg-black/30 border-white/5 text-slate-400 hover:bg-white/5'
                            }`}
                          >
                            {w}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Communication */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5 font-medium">
                      FIELD COMMUNICATION MESH
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {COMM_STATUSES.map((c) => {
                        const isSelected = commStatus === c;
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setCommStatus(c)}
                            className={`py-1.5 rounded-lg border text-center font-mono text-xs transition-all ${
                              isSelected 
                                ? 'bg-amber-950/60 border-amber-500/50 text-amber-300' 
                                : 'bg-black/30 border-white/5 text-slate-400 hover:bg-white/5'
                            }`}
                          >
                            {c}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Hazards (Multi-select) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-mono text-slate-400 font-medium">
                        ACTIVE HAZARDS (MULTI-SELECT)
                      </label>
                      <span className="text-[10px] font-mono text-slate-500">
                        {activeHazards.length} selected
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {HAZARDS_LIST.map((hazard) => {
                        const isChecked = activeHazards.includes(hazard);
                        return (
                          <button
                            key={hazard}
                            type="button"
                            onClick={() => handleHazardToggle(hazard)}
                            className={`flex items-center gap-2 p-2 rounded-lg border text-left font-mono text-xs transition-all ${
                              isChecked
                                ? 'bg-crimson-950/50 border-crimson-500/50 text-crimson-300 shadow-sm'
                                : 'bg-black/30 border-white/5 text-slate-400 hover:bg-white/5'
                            }`}
                          >
                            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                              isChecked ? 'bg-crimson-600 border-crimson-500 text-white' : 'border-slate-600'
                            }`}>
                              {isChecked && <Check className="w-2.5 h-2.5" />}
                            </div>
                            <span className="truncate">{hazard}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>

              {/* ── 5. SURVIVOR INFORMATION ── */}
              <div className="rounded-xl bg-[#0D121D] border border-white/10 p-4 sm:p-5 shadow-command space-y-4">
                <div className="flex items-center gap-2 pb-2.5 border-b border-white/10">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider">
                    5. Survivor Information
                  </h2>
                </div>

                <div className="space-y-3">
                  {/* Survivor Location */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5 font-medium">
                      SURVIVOR LOCATION / LANDMARK
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        type="text"
                        value={survivorLocation}
                        onChange={(e) => setSurvivorLocation(e.target.value)}
                        placeholder="e.g. Velachery Lake View Towers & Metro station"
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white font-sans text-xs focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Estimated Count & Critical Patients Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5 font-medium">
                        ESTIMATED COUNT
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={estimatedCount}
                        onChange={(e) => setEstimatedCount(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5 font-medium">
                        CRITICAL PATIENTS
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={criticalPatients}
                        onChange={(e) => setCriticalPatients(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-crimson-500/40 text-crimson-300 font-mono text-xs focus:border-crimson-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Evacuation Priority */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5 font-medium">
                      EVACUATION PRIORITY
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {PRIORITY_LEVELS.map((p) => {
                        const isSelected = evacuationPriority === p;
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setEvacuationPriority(p)}
                            className={`py-1.5 rounded-lg border text-center font-mono text-xs transition-all ${
                              isSelected 
                                ? 'bg-crimson-950/70 border-crimson-500/60 text-crimson-300 font-bold' 
                                : 'bg-black/30 border-white/5 text-slate-400 hover:bg-white/5'
                            }`}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Nearest Safe Zone */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5 font-medium">
                      NEAREST SAFE ZONE / EXTRACTION HAVEN
                    </label>
                    <input
                      type="text"
                      value={nearestSafeZone}
                      onChange={(e) => setNearestSafeZone(e.target.value)}
                      placeholder="e.g. IIT Madras High-Ground Relief Camp (3.2 km)"
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white font-sans text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                </div>
              </div>

              {/* ── 6. GENERATE PLAN BUTTON (CTA) ── */}
              <div className="rounded-xl bg-gradient-to-b from-[#0D121D] to-[#120D15] border border-crimson-900/40 p-4 shadow-command space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>AI Engine Readiness: <strong className="text-emerald-400">ONLINE</strong></span>
                  <span>Parameters: <strong className="text-cyan-400">14 Verified</strong></span>
                </div>

                <button
                  type="button"
                  onClick={handleStartGeneration}
                  disabled={isGenerating}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-crimson-600 via-crimson-700 to-crimson-800 hover:from-crimson-500 hover:via-crimson-600 hover:to-crimson-700 text-white font-mono font-bold text-sm uppercase tracking-wider transition-all duration-200 shadow-crimson-glow flex items-center justify-center gap-3 group active:scale-[0.99] disabled:opacity-60"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                  <span>Generate AI Rescue Plan</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-[11px] text-center text-slate-500 font-mono">
                  Synthesizes dynamic multi-vector corridors & alerts on single points of failure.
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ── 7. LOADING SEQUENCE MODAL (ANIMATED PROGRESS) ── */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#0D121D] border border-crimson-600/50 shadow-2xl p-6 space-y-6 font-mono relative overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-crimson-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-crimson-500/20 border border-crimson-500/40 flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-crimson-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    AI Rescue Plan Synthesis
                  </h3>
                  <div className="text-[11px] text-slate-400">
                    Plan Code: <span className="text-cyan-400">{planId}</span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                PROCESSING
              </span>
            </div>

            {/* Step-by-Step Progress List */}
            <div className="space-y-3.5">
              {stepsList.map((step, idx) => {
                const stepNum = idx + 1;
                const isCompleted = generationStep > stepNum;
                const isCurrent = generationStep === stepNum;
                const isPending = generationStep < stepNum;

                return (
                  <div 
                    key={idx} 
                    className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all duration-300 ${
                      isCurrent 
                        ? 'bg-crimson-950/40 border-crimson-500/40 shadow-sm' 
                        : isCompleted 
                        ? 'bg-emerald-950/20 border-emerald-500/20 opacity-90' 
                        : 'bg-black/20 border-white/5 opacity-40'
                    }`}
                  >
                    {/* Status Icon */}
                    <div className="mt-0.5 shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <RefreshCw className="w-4 h-4 text-crimson-400 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[9px] text-slate-500">
                          {stepNum}
                        </div>
                      )}
                    </div>

                    {/* Step Text */}
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-bold ${
                        isCurrent ? 'text-white' : isCompleted ? 'text-emerald-300' : 'text-slate-500'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-sans truncate mt-0.5">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overall Animated Progress Bar */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Neural Graph Convergence</span>
                <span className="text-cyan-300 font-bold">{Math.min(100, generationStep * 20)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 via-amber-500 to-crimson-500 transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(100, generationStep * 20)}%` }}
                />
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
