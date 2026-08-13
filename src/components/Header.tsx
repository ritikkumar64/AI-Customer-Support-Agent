import React from 'react';
import { ShieldCheck, Cpu, Mic, Database, FileText, Video, Sparkles, Activity } from 'lucide-react';

interface HeaderProps {
  activeTab: 'chat' | 'admin' | 'crm' | 'policy';
  setActiveTab: (tab: 'chat' | 'admin' | 'crm' | 'policy') => void;
  openLoomGuide: () => void;
  logCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, openLoomGuide, logCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-4 lg:px-8 py-3.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <ShieldCheck className="w-6 h-6 text-white" />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                AuraSupport
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 rounded-full uppercase">
                AI Agent v4.2
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Autonomous E-Commerce Refund Verification Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'chat'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            Customer & Voice Chat
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 relative ${
              activeTab === 'admin'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Admin Reasoning Logs
            {logCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-emerald-500 text-slate-950">
                {logCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('crm')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'crm'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            CRM Profiles (15)
          </button>

          <button
            onClick={() => setActiveTab('policy')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'policy'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            Refund Policy
          </button>
        </nav>

        {/* Action Button: Loom Video Demo Script */}
        <div className="flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Agent Engine: <strong className="text-emerald-400">Tool Calling Active</strong></span>
          </div>

          <button
            onClick={openLoomGuide}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl shadow-lg shadow-amber-400/20 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Video className="w-4 h-4 text-slate-900" />
            Loom Demo Recording Script
          </button>
        </div>

      </div>
    </header>
  );
};
