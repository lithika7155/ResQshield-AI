import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import TopHeader from '../components/layout/TopHeader';
import Sidebar from '../components/layout/Sidebar';
import AlertAndKpiRow from '../components/dashboard/AlertAndKpiRow';
import LeftPanel from '../components/dashboard/LeftPanel';
import CenterMap from '../components/dashboard/CenterMap';
import RescuePlanWorkflowBar from '../components/dashboard/RescuePlanWorkflowBar';
import AIRiskAnalysisCard from '../components/dashboard/AIRiskAnalysisCard';
import RescuePlanCard from '../components/dashboard/RescuePlanCard';
import StressTestingCard from '../components/dashboard/StressTestingCard';
import StressTestFailureModal from '../components/modals/StressTestFailureModal';
import HumanApprovalModal from '../components/modals/HumanApprovalModal';
import RescuePlanningPage from './RescuePlanningPage';
import PlanAnalysisPage from './PlanAnalysisPage';
import StressTestPage from './StressTestPage';

export default function ResQShieldDashboard() {
  const [activeNav, setActiveNav] = useState('Home');
  const [activeMapTab, setActiveMapTab] = useState('Live Map');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [currentPlanData, setCurrentPlanData] = useState(null);

  const [showStressModal, setShowStressModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const handleRunSimulation = () => {
    setShowStressModal(true);
    setActiveMapTab('Simulation');
  };

  const handleApplyAlternative = () => {
    setShowStressModal(false);
    setActiveMapTab('Rescue Plan');
  };

  const handleProceedToApproval = () => {
    setShowStressModal(false);
    setShowApprovalModal(true);
  };

  const handleExecutePlan = () => {
    setShowApprovalModal(true);
  };

  const handleApprovalConfirmed = () => {
    setShowApprovalModal(false);
    setActiveNav('Home');
  };

  return (
    <div className="h-screen flex flex-col bg-[#080A0F] text-slate-100 overflow-hidden font-sans select-none">
      
      {/* ── TOP HEADER (full-width) ── */}
      <TopHeader />

      {/* ── BODY: SIDEBAR + MAIN CONTENT ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT SIDEBAR */}
        <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 space-y-3">

          {activeNav === 'Rescue Planning' ? (
            <RescuePlanningPage 
              onBack={() => setActiveNav('Home')}
              onRunStressTest={() => setActiveNav('Stress Testing')}
              onExecutePlan={handleExecutePlan}
              onPlanGenerated={(plan) => {
                setCurrentPlanData(plan);
                setActiveNav('Plan Analysis');
              }}
            />
          ) : activeNav === 'Plan Analysis' ? (
            <PlanAnalysisPage
              planData={currentPlanData}
              onRunStressTest={() => setActiveNav('Stress Testing')}
              onEditPlan={() => setActiveNav('Rescue Planning')}
              onBack={() => setActiveNav('Home')}
            />
          ) : activeNav === 'Stress Testing' ? (
            <StressTestPage
              planData={currentPlanData}
              onNavigateToAlternative={() => setShowStressModal(true)}
              onBack={() => setActiveNav('Plan Analysis')}
            />
          ) : (
            <>
              {/* ROW 1: ALERT + KPI CARDS */}
              <AlertAndKpiRow onAlertClick={() => setSelectedIncident(null)} />

              {/* ROW 2: LEFT PANEL + CENTER MAP + RIGHT PANEL */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
                
                {/* LEFT PANEL — Incidents + Updates */}
                <div className="lg:col-span-3 flex flex-col gap-3 min-h-0">
                  <LeftPanel
                    selectedIncident={selectedIncident}
                    setSelectedIncident={setSelectedIncident}
                  />
                </div>

                {/* CENTER — Map + Workflow Bar stacked */}
                <div className="lg:col-span-6 flex flex-col gap-3 min-h-0">
                  {/* Map takes up most of the center space */}
                  <div className="flex-1 min-h-0" style={{ minHeight: '380px' }}>
                    <CenterMap
                      selectedIncident={selectedIncident}
                      activeTab={activeMapTab}
                      setActiveTab={setActiveMapTab}
                    />
                  </div>

                  {/* Rescue Plan Workflow Bar - below map */}
                  <RescuePlanWorkflowBar
                    onExecuteClick={handleExecutePlan}
                    onStressTestClick={handleRunSimulation}
                    onGeneratePlanClick={() => setActiveNav('Rescue Planning')}
                  />
                </div>

                {/* RIGHT PANEL — AI Risk + Rescue Plan + Stress Testing */}
                <div className="lg:col-span-3 flex flex-col gap-3 min-h-0">
                  <AIRiskAnalysisCard />
                  <RescuePlanCard onViewPlan={() => setActiveNav('Rescue Planning')} />
                  <StressTestingCard onRunSimulation={handleRunSimulation} />

                  {/* Bottom emergency alert banner (reference bottom-right) */}
                  <div className="rounded-lg bg-amber-950/30 border border-amber-500/30 px-3 py-2.5 flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <p className="text-[11px] text-amber-200 font-sans leading-snug">
                      Stay alert. Follow official updates and evacuation instructions.
                    </p>
                  </div>
                </div>

              </div>
            </>
          )}

        </main>
      </div>

      {/* ── MODALS ── */}
      {showStressModal && (
        <StressTestFailureModal
          onClose={() => setShowStressModal(false)}
          onApplyAlternative={handleApplyAlternative}
          onHumanApproval={handleProceedToApproval}
        />
      )}

      {showApprovalModal && (
        <HumanApprovalModal
          onClose={() => setShowApprovalModal(false)}
          onApprove={handleApprovalConfirmed}
          onSendBack={() => setShowApprovalModal(false)}
        />
      )}

    </div>
  );
}
