import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FilePlus, 
  ShieldAlert, 
  Navigation, 
  Battery, 
  CloudRain, 
  Radio, 
  Users, 
  Cpu, 
  Sparkles,
  CheckCircle2,
  AlertOctagon,
  ArrowRight
} from 'lucide-react';
import WorkflowStepper from '../components/common/WorkflowStepper';
import { useMission } from '../context/MissionContext';

export default function CreatePlanPage() {
  const navigate = useNavigate();
  const { createPlan, isSimulating } = useMission();

  const [formData, setFormData] = useState({
    // Disaster Information
    disasterType: "Flood",
    severity: "Critical",
    disasterZone: "Sector 4 Lowland Basin (Grid 44-Nord)",
    
    // Mission Information
    survivorLocation: "Logistics Terminal 4B - Rooftop Haven",
    teamLocation: "Forward Base Alpha (Highland Staging)",
    survivorCount: 14,
    priorityLevel: "Urgent Priority 1",
    availableVehicles: "UGV-01 Amphibious Rover, USV-04 Watercraft, UAV-12 Recon Quad",

    // Resource Information
    batteryFuelReserve: "94% Mission Reserve (2.4 kWh per unit)",
    medicalSupplies: "Class-A Trauma Packs, 4 Stretchers, Hypothermia Blankets",
    commAvailability: "Mesh UHF Relay 3 + SATCOM Uplink (92% Link)",
    teamCapacity: "18 Personnel Maximum Payload",

    // Environmental Conditions
    blockedRoads: "Flooded Overpass Sector B (1.8m submerged water)",
    activeHazards: "Current velocity 3.4 m/s, live power line leaks reported",
    weatherCondition: "Heavy Rain (45mm/hr), Wind SSE 48 km/h, Temp 18°C",
    commStatus: "Stable on High Ground; Degraded in Canyon"
  });

  const disasterTypes = [
    "Flood",
    "Earthquake",
    "Wildfire",
    "Cyclone",
    "Landslide",
    "Industrial Accident"
  ];

  const severityLevels = ["Low", "Moderate", "High", "Critical"];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyPreset = (type) => {
    if (type === 'wildfire') {
      setFormData({
        disasterType: "Wildfire",
        severity: "High",
        disasterZone: "Ridge Valley National Forest Sector 9",
        survivorLocation: "Lookout Station Ridge Crest",
        teamLocation: "Highway Outpost West",
        survivorCount: 8,
        priorityLevel: "Urgent Priority 1",
        availableVehicles: "Tracked ATV-3, Fire-Suppression Drone Alpha",
        batteryFuelReserve: "85% Fuel / Battery",
        medicalSupplies: "Burn Kits, Smoke Inhalation Respirators",
        commAvailability: "Radio Mesh Stable",
        teamCapacity: "12 Personnel Capacity",
        blockedRoads: "Ridge Road 4 blocked by fallen burning timber",
        activeHazards: "Dense smoke plume, wind gusts 55 km/h",
        weatherCondition: "Dry 34°C, Wind gusts 55 km/h NNW",
        commStatus: "Thermal interference on RF"
      });
    } else if (type === 'earthquake') {
      setFormData({
        disasterType: "Earthquake",
        severity: "Critical",
        disasterZone: "Downtown Metro Sector 12",
        survivorLocation: "Collapsed Civic Center Basement",
        teamLocation: "City Park Heliport",
        survivorCount: 26,
        priorityLevel: "Urgent Priority 1",
        availableVehicles: "Heavy Extraction UGV, Search K9 Units, Quadcopter Fleet",
        batteryFuelReserve: "90% Electric Reserve",
        medicalSupplies: "Trauma Resuscitation, Crush Injury Tourniquets",
        commAvailability: "Cell Towers Down; Tactical SATCOM Active",
        teamCapacity: "30 Personnel Capacity",
        blockedRoads: "Main Ave Overpass buckled; Rubble blockages",
        activeHazards: "Aftershock risk 72%, broken gas mains",
        weatherCondition: "Clear, 16°C",
        commStatus: "Underground penetration limited"
      });
    } else {
      // Default flood
      setFormData({
        disasterType: "Flood",
        severity: "Critical",
        disasterZone: "Sector 4 Lowland Basin (Grid 44-Nord)",
        survivorLocation: "Logistics Terminal 4B - Rooftop Haven",
        teamLocation: "Forward Base Alpha (Highland Staging)",
        survivorCount: 14,
        priorityLevel: "Urgent Priority 1",
        availableVehicles: "UGV-01 Amphibious Rover, USV-04 Watercraft, UAV-12 Recon Quad",
        batteryFuelReserve: "94% Mission Reserve",
        medicalSupplies: "Class-A Trauma Packs, 4 Stretchers, Hypothermia Blankets",
        commAvailability: "Mesh UHF Relay 3 + SATCOM Uplink (92% Link)",
        teamCapacity: "18 Personnel Maximum Payload",
        blockedRoads: "Flooded Overpass Sector B (1.8m submerged water)",
        activeHazards: "Current velocity 3.4 m/s, live power line leaks reported",
        weatherCondition: "Heavy Rain (45mm/hr), Wind SSE 48 km/h, Temp 18°C",
        commStatus: "Stable on High Ground; Degraded in Canyon"
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPlan(formData);
    navigate('/analysis');
  };

  return (
    <div className="min-h-screen bg-[#080A0F] text-slate-100 font-sans pb-16">
      <WorkflowStepper />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>TACTICAL MISSION PARAMETER BUILDER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
              Create Rescue Plan
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
              Define the current disaster conditions and mission parameters.
            </p>
          </div>

          {/* Quick Preset Fillers */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 mr-1 hidden sm:inline">PRESETS:</span>
            <button
              type="button"
              onClick={() => handleApplyPreset('flood')}
              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-cyan-300"
            >
              Coastal Flood
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('wildfire')}
              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-amber-300"
            >
              Wildfire
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('earthquake')}
              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-slate-300"
            >
              Seismic Collapse
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-8 font-mono">
          
          {/* SECTION 1: DISASTER INFORMATION */}
          <div className="p-6 rounded-xl bg-[#0D121D] border border-white/10 shadow-command relative overflow-hidden">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-white/10">
              <ShieldAlert className="w-4 h-4 text-crimson-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                1. Disaster Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
              
              {/* Disaster Type */}
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">
                  Disaster Type
                </label>
                <select
                  value={formData.disasterType}
                  onChange={(e) => handleInputChange('disasterType', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-white/15 text-white focus:border-cyan-500 focus:outline-none"
                >
                  {disasterTypes.map(t => (
                    <option key={t} value={t} className="bg-slate-900 text-white">{t}</option>
                  ))}
                </select>
              </div>

              {/* Severity */}
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">
                  Severity
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {severityLevels.map(sev => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => handleInputChange('severity', sev)}
                      className={`py-2 px-1 text-center rounded text-[11px] border font-bold transition-all ${
                        formData.severity === sev 
                          ? sev === 'Critical' 
                            ? 'bg-crimson-950 border-crimson-500 text-crimson-300 shadow-crimson-glow' 
                            : 'bg-cyan-950 border-cyan-500 text-cyan-300'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Disaster Zone */}
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">
                  Disaster Zone
                </label>
                <input
                  type="text"
                  value={formData.disasterZone}
                  onChange={(e) => handleInputChange('disasterZone', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-white/15 text-white focus:border-cyan-500 focus:outline-none text-xs"
                />
              </div>

            </div>
          </div>

          {/* SECTION 2: MISSION INFORMATION */}
          <div className="p-6 rounded-xl bg-[#0D121D] border border-white/10 shadow-command relative overflow-hidden">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-white/10">
              <Navigation className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                2. Mission Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">
                  Survivor Location
                </label>
                <input
                  type="text"
                  value={formData.survivorLocation}
                  onChange={(e) => handleInputChange('survivorLocation', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-white/15 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">
                  Rescue Team Location
                </label>
                <input
                  type="text"
                  value={formData.teamLocation}
                  onChange={(e) => handleInputChange('teamLocation', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-white/15 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">
                  Number of Survivors
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.survivorCount}
                  onChange={(e) => handleInputChange('survivorCount', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-white/15 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">
                  Priority Level
                </label>
                <select
                  value={formData.priorityLevel}
                  onChange={(e) => handleInputChange('priorityLevel', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-white/15 text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Urgent Priority 1">Urgent Priority 1 (Immediate Threat to Life)</option>
                  <option value="Priority 2">Priority 2 (Stable but Threatened)</option>
                  <option value="Priority 3">Priority 3 (Resource Extraction)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-400 mb-1.5 font-medium">
                  Available Vehicles / Autonomous Fleet
                </label>
                <input
                  type="text"
                  value={formData.availableVehicles}
                  onChange={(e) => handleInputChange('availableVehicles', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-white/15 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

            </div>
          </div>

          {/* SECTION 3: RESOURCE INFORMATION */}
          <div className="p-6 rounded-xl bg-[#0D121D] border border-white/10 shadow-command relative overflow-hidden">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-white/10">
              <Battery className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                3. Resource Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">
                  Battery / Fuel Reserves
                </label>
                <input
                  type="text"
                  value={formData.batteryFuelReserve}
                  onChange={(e) => handleInputChange('batteryFuelReserve', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-white/15 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">
                  Medical Supplies
                </label>
                <input
                  type="text"
                  value={formData.medicalSupplies}
                  onChange={(e) => handleInputChange('medicalSupplies', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-white/15 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">
                  Communication Availability
                </label>
                <input
                  type="text"
                  value={formData.commAvailability}
                  onChange={(e) => handleInputChange('commAvailability', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-white/15 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">
                  Team Capacity
                </label>
                <input
                  type="text"
                  value={formData.teamCapacity}
                  onChange={(e) => handleInputChange('teamCapacity', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-white/15 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

            </div>
          </div>

          {/* SECTION 4: ENVIRONMENTAL CONDITIONS */}
          <div className="p-6 rounded-xl bg-[#0D121D] border border-white/10 shadow-command relative overflow-hidden">
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-white/10">
              <CloudRain className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                4. Environmental Conditions
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">
                  Blocked Roads / Infrastructure Failures
                </label>
                <input
                  type="text"
                  value={formData.blockedRoads}
                  onChange={(e) => handleInputChange('blockedRoads', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-white/15 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">
                  Active Hazards
                </label>
                <input
                  type="text"
                  value={formData.activeHazards}
                  onChange={(e) => handleInputChange('activeHazards', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-white/15 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">
                  Weather Condition
                </label>
                <input
                  type="text"
                  value={formData.weatherCondition}
                  onChange={(e) => handleInputChange('weatherCondition', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-white/15 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">
                  Communication Status
                </label>
                <input
                  type="text"
                  value={formData.commStatus}
                  onChange={(e) => handleInputChange('commStatus', e.target.value)}
                  className="w-full px-3 py-2 rounded bg-black/60 border border-white/15 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 flex items-center justify-between">
            <div className="text-xs text-slate-500 font-mono hidden sm:block">
              AI will simulate passable vectors and score baseline risk before stress injection.
            </div>

            <button
              type="submit"
              disabled={isSimulating}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-mono font-bold text-sm uppercase tracking-wider transition-all duration-200 shadow-crimson-glow flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <Cpu className="w-5 h-5" />
              <span>GENERATE RESCUE PLAN</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
