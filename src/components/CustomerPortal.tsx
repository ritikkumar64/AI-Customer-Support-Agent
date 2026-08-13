import React, { useState, useRef, useEffect } from 'react';
import { MOCK_CUSTOMERS, SCENARIO_PRESETS } from '../data/crmData';
import { Customer, Order, RefundDecision, ReasoningStep, ScenarioPreset } from '../agent/types';
import { runAgentLoop, AgentExecutionProgress } from '../agent/agentEngine';
import { useVoicePipeline } from '../voice/useVoicePipeline';
import { VoiceVisualizer } from './VoiceVisualizer';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  UserCheck,
  Package,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Zap,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  decision?: RefundDecision;
  steps?: ReasoningStep[];
  isThinking?: boolean;
}

interface CustomerPortalProps {
  onAgentExecution: (steps: ReasoningStep[], decision?: RefundDecision) => void;
  onNavigateToAdmin: () => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({ onAgentExecution, onNavigateToAdmin }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('CUST-1001');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('ORD-8821');
  const [inputText, setInputText] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: 'Hello! I am AuraSupport, your autonomous e-commerce refund validation assistant. Select a scenario preset below or type/speak your refund request to get started!',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice Pipeline Hook
  const voice = useVoicePipeline({
    onFinalTranscript: (text) => {
      setInputText(text);
      handleSendMessage(text);
    }
  });

  const selectedCustomer = MOCK_CUSTOMERS.find(c => c.id === selectedCustomerId) || MOCK_CUSTOMERS[0];
  const selectedOrder = selectedCustomer.activeOrders.find(o => o.orderId === selectedOrderId) || selectedCustomer.activeOrders[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isExecuting]);

  const handleSelectCustomer = (cust: Customer) => {
    setSelectedCustomerId(cust.id);
    if (cust.activeOrders.length > 0) {
      setSelectedOrderId(cust.activeOrders[0].orderId);
    }
  };

  const handleApplyPreset = (preset: ScenarioPreset) => {
    setSelectedCustomerId(preset.customerId);
    setSelectedOrderId(preset.orderId);
    setInputText(preset.promptText);
    handleSendMessage(preset.promptText, preset.customerId, preset.orderId);
  };

  const handleSendMessage = async (textToSend?: string, custIdOverride?: string, orderIdOverride?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isExecuting) return;

    const userMsgId = `user_${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString()
    };

    const agentThinkingMsgId = `agent_${Date.now()}`;
    const agentThinkingMsg: ChatMessage = {
      id: agentThinkingMsgId,
      sender: 'agent',
      text: 'Analyzing request against refund policy and CRM records...',
      timestamp: new Date().toLocaleTimeString(),
      isThinking: true
    };

    setMessages(prev => [...prev, userMsg, agentThinkingMsg]);
    setInputText('');
    setIsExecuting(true);

    try {
      const activeCust = custIdOverride || selectedCustomerId;
      const activeOrd = orderIdOverride || selectedOrderId;

      const { steps, decision } = await runAgentLoop(
        query,
        activeCust,
        activeOrd,
        (progress: AgentExecutionProgress) => {
          onAgentExecution(progress.steps, progress.finalDecision);
          
          setMessages(prev => prev.map(msg => {
            if (msg.id === agentThinkingMsgId) {
              return {
                ...msg,
                text: progress.currentThought || 'Evaluating policies...',
                steps: progress.steps
              };
            }
            return msg;
          }));
        }
      );

      // Final update to message
      setMessages(prev => prev.map(msg => {
        if (msg.id === agentThinkingMsgId) {
          return {
            ...msg,
            text: decision.customerNotificationMessage,
            decision,
            steps,
            isThinking: false
          };
        }
        return msg;
      }));

      // Speak final message if TTS enabled
      if (ttsEnabled && decision.customerNotificationMessage) {
        voice.speak(decision.customerNotificationMessage);
      }

    } catch (error) {
      console.error('Agent execution error:', error);
      setMessages(prev => prev.map(msg => {
        if (msg.id === agentThinkingMsgId) {
          return {
            ...msg,
            text: 'System encountered an execution exception during policy validation. Escalating session.',
            isThinking: false
          };
        }
        return msg;
      }));
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT COLUMN: Customer CRM Selector & Presets (4 Cols) */}
      <div className="lg:col-span-4 space-y-5">
        
        {/* Scenario Presets Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Live Demo Preset Scenarios
            </h2>
            <span className="text-[10px] text-slate-500">1-Click Test</span>
          </div>

          <div className="space-y-2">
            {SCENARIO_PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                disabled={isExecuting}
                className="w-full text-left p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850/80 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300">
                    {preset.title}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${preset.badgeColor}`}>
                    {preset.expectedOutcome}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                  {preset.description}
                </p>
                <div className="mt-1.5 flex items-center text-[10px] text-indigo-400 font-mono">
                  <span>{preset.keyRule}</span>
                  <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Customer Profile Inspector */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
          
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              Active Customer Profile
            </h2>
            {/* Customer Dropdown */}
            <select
              value={selectedCustomerId}
              onChange={(e) => {
                const cust = MOCK_CUSTOMERS.find(c => c.id === e.target.value);
                if (cust) handleSelectCustomer(cust);
              }}
              className="bg-slate-950 border border-slate-700 text-xs font-medium text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {MOCK_CUSTOMERS.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.tier})
                </option>
              ))}
            </select>
          </div>

          {/* Profile Card */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <div className="flex items-center gap-3">
              <img
                src={selectedCustomer.avatar}
                alt={selectedCustomer.name}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/30"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white truncate">{selectedCustomer.name}</h3>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                    selectedCustomer.tier === 'VIP' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    selectedCustomer.tier === 'Gold' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' :
                    selectedCustomer.tier === 'High-Risk' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {selectedCustomer.tier}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedCustomer.id} • {selectedCustomer.email}</p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-center">
              <div className="p-2 rounded-lg bg-slate-900/60">
                <div className="text-[10px] text-slate-400">Lifetime Value</div>
                <div className="text-xs font-bold text-emerald-400 mt-0.5">${selectedCustomer.lifetimeSpend.toLocaleString()}</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60">
                <div className="text-[10px] text-slate-400">Return Rate</div>
                <div className={`text-xs font-bold mt-0.5 ${selectedCustomer.returnRate > 0.5 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {(selectedCustomer.returnRate * 100).toFixed(0)}%
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60">
                <div className="text-[10px] text-slate-400">Risk Score</div>
                <div className={`text-xs font-bold mt-0.5 ${selectedCustomer.fraudRiskScore >= 75 ? 'text-rose-400' : 'text-indigo-400'}`}>
                  {selectedCustomer.fraudRiskScore}/100
                </div>
              </div>
            </div>

            {/* CRM Notes */}
            <div className="mt-2.5 p-2 rounded-lg bg-slate-900/40 text-[11px] text-slate-400 italic">
              "{selectedCustomer.notes}"
            </div>
          </div>

          {/* Active Order Details */}
          {selectedOrder && (
            <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-indigo-400" />
                  Order #{selectedOrder.orderId}
                </span>
                <span className="font-mono text-emerald-400">${selectedOrder.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-3">
                {selectedOrder.items[0]?.image && (
                  <img
                    src={selectedOrder.items[0].image}
                    alt={selectedOrder.items[0].name}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                  />
                )}
                <div className="flex-1 min-w-0 text-xs">
                  <div className="font-semibold text-slate-200 truncate">{selectedOrder.items[0]?.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Delivered: <strong className="text-slate-300">{selectedOrder.deliveryDate}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* RIGHT COLUMN: Customer Support & Voice Agent Chat (8 Cols) */}
      <div className="lg:col-span-8 flex flex-col h-[750px] bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden">
        
        {/* Chat Top Bar */}
        <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <div className="w-3 h-3 rounded-full bg-emerald-500 absolute top-0 left-0" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">Customer Support & Voice Terminal</h2>
              <p className="text-[11px] text-slate-400">Directly interacting with AuraSupport Agent Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Admin Reasoning Link */}
            <button
              onClick={onNavigateToAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold hover:bg-indigo-500/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              View Admin Reasoning Stream
            </button>

            {/* TTS Audio Voice Toggle */}
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              title={ttsEnabled ? 'Disable Agent Voice Synthesis' : 'Enable Agent Voice Synthesis'}
              className={`p-2 rounded-lg border transition-all ${
                ttsEnabled
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Live Audio Visualizer Banner */}
        <VoiceVisualizer
          isListening={voice.isListening}
          isSpeaking={voice.isSpeaking}
          audioLevel={voice.audioLevel}
        />

        {/* Chat Messages Feed */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1">
                <span>{msg.sender === 'user' ? selectedCustomer.name : 'AuraSupport AI Agent'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-2xl rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-lg ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {/* Agent Thinking State */}
                {msg.isThinking && (
                  <div className="flex items-center gap-3 py-1 text-indigo-300 font-mono">
                    <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                    <span>{msg.text}</span>
                  </div>
                )}

                {/* Normal Message Text */}
                {!msg.isThinking && <div className="whitespace-pre-wrap">{msg.text}</div>}

                {/* Final Decision Card Badge */}
                {msg.decision && (
                  <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Agent Tool Execution Receipt
                      </span>
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 ${
                        msg.decision.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                        msg.decision.status === 'DENIED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {msg.decision.status === 'APPROVED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {msg.decision.status === 'DENIED' && <XCircle className="w-3.5 h-3.5" />}
                        {msg.decision.status === 'ESCALATED' && <AlertTriangle className="w-3.5 h-3.5" />}
                        DECISION: {msg.decision.status}
                      </span>
                    </div>

                    {/* Applied Rules Summary */}
                    <div className="p-2 rounded-lg bg-slate-900/60 font-mono text-[10px] text-slate-300 space-y-1">
                      <div className="text-slate-400 font-sans">Applied Guardrails:</div>
                      {msg.decision.appliedPolicyRules.map((rule, idx) => (
                        <div key={idx} className="flex items-center gap-1 text-indigo-300">
                          <span>✓</span> {rule}
                        </div>
                      ))}
                      {msg.decision.overrideApplied && (
                        <div className="text-amber-400 font-semibold pt-1 border-t border-slate-800">
                          ★ Discretionary VIP Exception Applied
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input & Microphone Control Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Microphone Button */}
            <button
              type="button"
              onClick={() => {
                if (voice.isListening) {
                  voice.stopListening();
                } else {
                  voice.startListening();
                }
              }}
              disabled={isExecuting}
              className={`p-3 rounded-xl border transition-all duration-200 ${
                voice.isListening
                  ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/40 animate-pulse'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
              }`}
              title={voice.isListening ? 'Stop Listening' : 'Start Voice Input (Microphone)'}
            >
              {voice.isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Input Text Box */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={voice.isListening ? 'Listening to voice...' : `Ask for refund for order #${selectedOrderId}...`}
              disabled={isExecuting}
              className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={isExecuting || !inputText.trim()}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>Submit</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
