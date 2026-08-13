import React from 'react';
import { Video, X, CheckCircle2, Play, Code2, Activity, Mic, ShieldCheck, FileText } from 'lucide-react';

interface LoomGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoomGuideModal: React.FC<LoomGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Loom / Google Drive Video Recording Script & Checklist</h2>
              <p className="text-xs text-slate-400">Step-by-step guide for your 7-10 minute presentation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Timeline Script */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5" />
            Recommended Video Presentation Script (7-10 Minutes)
          </h3>

          <div className="space-y-3">
            
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>Part 1: Project Overview & Architecture</span>
                <span className="font-mono text-slate-400">0:00 - 1:30</span>
              </div>
              <p className="text-xs text-slate-300">
                Introduce AuraSupport: Explain the agent loop architecture (LangGraph/Function calling), tool orchestration, 15-customer CRM database, strict policy engine, and voice pipeline.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-400">
                <span>Part 2: Live Demo - Standard Approved Refund</span>
                <span className="font-mono text-slate-400">1:30 - 3:30</span>
              </div>
              <p className="text-xs text-slate-300">
                Click <strong>"Standard Approved Refund"</strong> preset (Sarah Jenkins, UltraNoise Headphones). Show how the agent calls <code className="text-emerald-400">get_order_details</code>, <code className="text-emerald-400">fetch_customer_profile</code>, <code className="text-emerald-400">verify_policy_compliance</code>, and approves the refund. Switch to the <strong>Admin Reasoning Logs</strong> tab to highlight real-time thoughts!
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-rose-400">
                <span>Part 3: Live Demo - Policy Violation & Edge Cases</span>
                <span className="font-mono text-slate-400">3:30 - 6:00</span>
              </div>
              <p className="text-xs text-slate-300">
                1) Run <strong>"Digital License Denial"</strong> (Elena Rostova) to demonstrate software non-refundability denial.<br/>
                2) Run <strong>"VIP Overriding Edge Case"</strong> (David Kim - 32 days past delivery) to demonstrate discretionary grace overrides.<br/>
                3) Run <strong>"High-Risk Fraud Denial"</strong> (Marcus Vance - 82% return rate) to show risk guardrails.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                <span>Part 4: Live Interactive Voice Interaction</span>
                <span className="font-mono text-slate-400">6:00 - 7:30</span>
              </div>
              <p className="text-xs text-slate-300">
                Click the <strong>Microphone icon</strong>, speak a refund request aloud, and show the live soundwave animation and agent speech synthesis response!
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-purple-400">
                <span>Part 5: Code Walkthrough & Reasoning Logs</span>
                <span className="font-mono text-slate-400">7:30 - 10:00</span>
              </div>
              <p className="text-xs text-slate-300">
                Briefly show the code structure (<code className="text-indigo-300">agentEngine.ts</code>, <code className="text-indigo-300">tools.ts</code>, <code className="text-indigo-300">refundPolicy.ts</code>) and export raw reasoning logs JSON from the Admin Dashboard.
              </p>
            </div>

          </div>
        </div>

        {/* Evaluation Rubric Checklist */}
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Evaluation Criteria Checklist
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">✓ CRM database with 15 profiles</div>
            <div className="flex items-center gap-2">✓ Strict refund policy document</div>
            <div className="flex items-center gap-2">✓ Agent loop & dynamic tool calling</div>
            <div className="flex items-center gap-2">✓ Standard approved refund demo</div>
            <div className="flex items-center gap-2">✓ Edge case / policy violation denial</div>
            <div className="flex items-center gap-2">✓ Real-time admin reasoning logs</div>
            <div className="flex items-center gap-2">✓ Voice pipeline (Microphone & Synthesis)</div>
            <div className="flex items-center gap-2">✓ Public GitHub repo & README</div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
          >
            Got It! Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
