import React, { useState } from 'react';
import { REFUND_POLICY_RULES, REFUND_POLICY_MARKDOWN } from '../data/refundPolicy';
import { FileText, ShieldAlert, CheckCircle2, AlertOctagon, Sparkles, BookOpen } from 'lucide-react';

export const PolicyViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'markdown'>('rules');

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Strict Refund Policy & Guardrails Document (v4.2)</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Deterministic rule evaluation set consumed by the agent's <code className="text-indigo-400">verify_policy_compliance</code> tool.
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'rules' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Structured Policy Rules
          </button>
          <button
            onClick={() => setActiveTab('markdown')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'markdown' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Full Policy Markdown Doc
          </button>
        </div>
      </div>

      {/* Structured Rules View */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REFUND_POLICY_RULES.map(rule => (
            <div
              key={rule.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/30">
                    {rule.id}
                  </span>
                  <h3 className="text-sm font-bold text-white">{rule.title}</h3>
                </div>

                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  rule.enforcement === 'STRICT_DENY' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                  rule.enforcement === 'STANDARD_APPROVE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                  rule.enforcement === 'DISCRETIONARY_OVERRIDE' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                  'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                }`}>
                  {rule.enforcement}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {rule.description}
              </p>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-emerald-400">
                <span className="text-slate-500 font-sans font-bold">Rule Logic: </span>
                {rule.condition}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Markdown Document View */}
      {activeTab === 'markdown' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
          <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
            {REFUND_POLICY_MARKDOWN}
          </pre>
        </div>
      )}

    </div>
  );
};
