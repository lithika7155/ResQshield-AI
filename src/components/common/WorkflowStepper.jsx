import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FileEdit, 
  Layers, 
  Zap, 
  AlertOctagon, 
  GitFork, 
  UserCheck, 
  ChevronRight 
} from 'lucide-react';
import { useMission } from '../../context/MissionContext';

export default function WorkflowStepper() {
  const navigate = useNavigate();
  const location = useLocation();
  const { stressResult, alternativePlan, approvalStatus } = useMission();

  const steps = [
    { 
      id: "create", 
      label: "1. CREATE PLAN", 
      path: "/create-plan", 
      icon: FileEdit,
      status: "ready"
    },
    { 
      id: "analyze", 
      label: "2. ANALYZE", 
      path: "/analysis", 
      icon: Layers,
      status: "ready"
    },
    { 
      id: "stress-test", 
      label: "3. STRESS TEST", 
      path: "/stress-test", 
      icon: Zap,
      status: "ready"
    },
    { 
      id: "failure", 
      label: "4. FAILURE DETECTED", 
      path: "/stress-test/result", 
      icon: AlertOctagon,
      status: stressResult ? "active" : "pending",
      danger: true
    },
    { 
      id: "alternative", 
      label: "5. ALTERNATIVE PLAN", 
      path: "/alternative-plan", 
      icon: GitFork,
      status: alternativePlan ? "ready" : "pending"
    },
    { 
      id: "approval", 
      label: "6. HUMAN APPROVAL", 
      path: "/approval", 
      icon: UserCheck,
      status: approvalStatus === "VERIFIED" ? "verified" : "ready"
    }
  ];

  // Helper to determine active step
  const currentPath = location.pathname;

  return (
    <div className="w-full bg-[#090D15]/80 backdrop-blur border-y border-white/5 py-2.5 px-4 overflow-x-auto">
      <div className="max-w-7xl mx-auto flex items-center justify-between min-w-[760px] gap-2">
        {steps.map((step, idx) => {
          const isActive = currentPath === step.path;
          const isVerified = step.id === "approval" && approvalStatus === "VERIFIED";

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => navigate(step.path)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono transition-all duration-200
                  ${isActive 
                    ? step.danger 
                      ? 'bg-crimson-950/60 border border-crimson-500 text-crimson-400 font-bold shadow-crimson-glow' 
                      : 'bg-cyan-950/60 border border-cyan-500 text-cyan-300 font-bold shadow-cyan-glow'
                    : isVerified
                      ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                  }
                `}
              >
                <step.icon className={`w-3.5 h-3.5 ${isActive ? (step.danger ? 'text-crimson-400' : 'text-cyan-400') : 'text-slate-500'}`} />
                <span className="tracking-wide whitespace-nowrap">{step.label}</span>
              </button>

              {idx < steps.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
