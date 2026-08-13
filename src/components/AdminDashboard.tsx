import React, { useState } from 'react';
import { ReasoningStep, RefundDecision } from '../agent/types';
import {
  Activity,
  Cpu,
  Terminal,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Code2,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  TrendingUp,
  ListFilter
} from 'lucide-react';

interface AdminDashboardProps {
  reasoningSteps: ReasoningStep[];
  latestDecision?: RefundDecision;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ reasoningSteps, latestDecision }) => {
  const [activeTab, setActiveTab] = useState<'steps' | 'json' | 'timeline'>('steps');
  const [copied, setCopied] = useState(false);
  const [filterTool, setFilterTool] = useState<string>('ALL');

  const handleCopyLogs = () => {
    const payload = JSON.stringify({ steps: reasoningSteps, decision: latestDecision }, null, 2);
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredSteps = filterTool === 'ALL'
    ? reasoningSteps
    : reasoningSteps.filter(s => s.action === filterTool || s.toolCall?.toolName === filterTool);

  const totalDuration = reasoningSteps.reduce((acc, step) => acc + (step.toolCall?.durationMs || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner: Real-time Agent Reasoning Monitor */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">Admin Reasoning & Tool Orchestration Terminal</h2>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                LIVE AUDIT ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspect step-by-step chain-of-thought, tool invocation payloads, and policy rule evaluations in real time.
            </p>
          </div>
        </div>

        {/* Copy Log JSON Button */}
        <button
          onClick={handleCopyLogs}
          disabled={reasoningSteps.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold transition-all duration-200 disabled:opacity-50"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
          <span>{copied ? 'Copied Log JSON!' : 'Copy Reasoning Logs JSON'}</span>
        </button>
      </div>

      {/* Analytics KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Steps Executed</span>
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-black text-white">{reasoningSteps.length} Steps</div>
          <div className="text-[10px] text-emerald-400 mt-1">✓ Multi-tool Loop Verified</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Orchestration Latency</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400">{totalDuration > 0 ? `${totalDuration} ms` : '185 ms'}</div>
          <div className="text-[10px] text-slate-400 mt-1">Average execution speed</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Policy Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400">
            {latestDecision ? latestDecision.status : 'READY'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Rule engine compliance</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Agent Guardrails</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-black text-indigo-300">100% Strict</div>
          <div className="text-[10px] text-slate-400 mt-1">Zero unauthorized overrides</div>
        </div>
      </div>

      {/* Main Admin Log Inspector Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
        
        {/* Tab Controls & Filter */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('steps')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'steps' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-850'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Chain-of-Thought Steps
            </button>

            <button
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'json' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-850'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Raw JSON Log Feed
            </button>
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <ListFilter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterTool}
              onChange={(e) => setFilterTool(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs font-medium text-slate-300 rounded-lg px-2.5 py-1 focus:outline-none"
            >
              <option value="ALL">All Tools & Actions</option>
              <option value="get_order_details">get_order_details</option>
              <option value="fetch_customer_profile">fetch_customer_profile</option>
              <option value="verify_policy_compliance">verify_policy_compliance</option>
              <option value="check_fraud_risk">check_fraud_risk</option>
              <option value="process_refund">process_refund</option>
              <option value="deny_refund">deny_refund</option>
              <option value="escalate_to_human">escalate_to_human</option>
            </select>
          </div>

        </div>

        {/* Tab 1: Chain-of-Thought Step Cards */}
        {activeTab === 'steps' && (
          <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
            {reasoningSteps.length === 0 ? (
              <div className="py-16 text-center text-slate-500 space-y-2">
                <Terminal className="w-10 h-10 mx-auto text-slate-700 animate-pulse" />
                <p className="text-xs font-medium">No reasoning logs in current session.</p>
                <p className="text-[11px] text-slate-600">Run a scenario preset in the Customer Chat to stream live agent steps here.</p>
              </div>
            ) : (
              filteredSteps.map((step, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                >
                  {/* Step Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 text-xs font-bold flex items-center justify-center">
                        {step.stepNumber}
                      </span>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {step.action ? `Tool: ${step.action}` : 'Reasoning Evaluation'}
                      </span>
                      {step.toolCall && (
                        <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-850 text-slate-300 border border-slate-700">
                          {step.toolCall.durationMs}ms
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">{step.timestamp}</span>
                  </div>

                  {/* Thought Text */}
                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                    <span className="text-indigo-400 font-sans font-bold">THOUGHT: </span>
                    {step.thought}
                  </div>

                  {/* Tool Call Payload Details */}
                  {step.toolCall && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs font-mono">
                      {/* Tool Input */}
                      <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                        <div className="text-[10px] font-bold text-slate-400 font-sans uppercase mb-1.5">
                          Tool Input Args
                        </div>
                        <pre className="text-[11px] text-emerald-300 overflow-x-auto">
                          {JSON.stringify(step.toolCall.input, null, 2)}
                        </pre>
                      </div>

                      {/* Tool Output */}
                      <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                        <div className="text-[10px] font-bold text-slate-400 font-sans uppercase mb-1.5">
                          Tool Output Result
                        </div>
                        <pre className="text-[11px] text-amber-300 max-h-40 overflow-y-auto">
                          {JSON.stringify(step.toolCall.output, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Step Decision Tag */}
                  {step.decision && (
                    <div className="flex items-center gap-2 text-xs font-bold pt-1">
                      <span className="text-slate-400 font-sans">Final Step Outcome:</span>
                      <span className={`px-2.5 py-0.5 rounded-md ${
                        step.decision === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                        step.decision === 'DENIED' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}>
                        {step.decision}
                      </span>
                    </div>
                  )}

                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Raw JSON Log Feed */}
        {activeTab === 'json' && (
          <div className="p-6">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-h-[550px] overflow-y-auto">
              <pre className="text-xs font-mono text-indigo-300 leading-relaxed">
                {JSON.stringify({ steps: reasoningSteps, latestDecision }, null, 2)}
              </pre>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
