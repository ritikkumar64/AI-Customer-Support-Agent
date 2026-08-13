import React, { useState } from 'react';
import { Header } from './components/Header';
import { CustomerPortal } from './components/CustomerPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { CrmInspector } from './components/CrmInspector';
import { PolicyViewer } from './components/PolicyViewer';
import { LoomGuideModal } from './components/LoomGuideModal';
import { ReasoningStep, RefundDecision } from './agent/types';
import { ShieldCheck, Github, ExternalLink } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'admin' | 'crm' | 'policy'>('chat');
  const [isLoomGuideOpen, setIsLoomGuideOpen] = useState(false);
  const [reasoningSteps, setReasoningSteps] = useState<ReasoningStep[]>([]);
  const [latestDecision, setLatestDecision] = useState<RefundDecision | undefined>();

  const handleAgentExecution = (steps: ReasoningStep[], decision?: RefundDecision) => {
    setReasoningSteps(steps);
    if (decision) setLatestDecision(decision);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Brand Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openLoomGuide={() => setIsLoomGuideOpen(true)}
        logCount={reasoningSteps.length}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-12">
        {activeTab === 'chat' && (
          <CustomerPortal
            onAgentExecution={handleAgentExecution}
            onNavigateToAdmin={() => setActiveTab('admin')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            reasoningSteps={reasoningSteps}
            latestDecision={latestDecision}
          />
        )}

        {activeTab === 'crm' && <CrmInspector />}

        {activeTab === 'policy' && <PolicyViewer />}
      </main>

      {/* Loom Recording Guide Modal */}
      <LoomGuideModal
        isOpen={isLoomGuideOpen}
        onClose={() => setIsLoomGuideOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-850 py-6 px-4 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">AuraSupport AI Refund Agent</span>
            <span>— Production Ready E-Commerce Automation</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Mock CRM: 15 Profiles</span>
            <span>•</span>
            <span>Policy Rules: Strict v4.2</span>
            <span>•</span>
            <span>Voice Pipeline: Web Speech API</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
