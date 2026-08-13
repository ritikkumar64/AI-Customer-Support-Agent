import React from 'react';
import { Mic, Volume2, Sparkles } from 'lucide-react';

interface VoiceVisualizerProps {
  isListening: boolean;
  isSpeaking: boolean;
  audioLevel: number;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ isListening, isSpeaking, audioLevel }) => {
  if (!isListening && !isSpeaking) return null;

  return (
    <div className="flex items-center justify-center p-4 my-3 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl backdrop-blur-md transition-all duration-300 animate-fadeIn">
      <div className="flex items-center gap-4">
        
        {/* Status Icon */}
        <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl ${
          isListening
            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 animate-pulse'
            : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40'
        }`}>
          {isListening ? <Mic className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-bounce" />}
        </div>

        {/* Text Status */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white tracking-wide">
              {isListening ? 'MICROPHONE ACTIVE - LISTENING...' : 'AGENT SPEAKING...'}
            </span>
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isListening ? 'bg-rose-400' : 'bg-emerald-400'} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isListening ? 'bg-rose-500' : 'bg-emerald-500'}`} />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            {isListening ? 'Speak your refund query clearly into your mic' : 'Synthesizing voice response'}
          </p>
        </div>

        {/* Audio Wave Visualizer Bars */}
        <div className="flex items-center gap-1 h-8 px-3 py-1 bg-slate-900/80 rounded-lg border border-slate-800">
          {[0.4, 0.8, 1.2, 0.6, 1.5, 0.9, 1.3, 0.5, 1.1].map((multiplier, i) => {
            const heightPercent = Math.max(15, Math.min(100, (audioLevel * multiplier) + 15));
            return (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all duration-75 ${
                  isListening ? 'bg-gradient-to-t from-rose-500 to-amber-400' : 'bg-gradient-to-t from-indigo-500 to-emerald-400'
                }`}
                style={{ height: `${heightPercent}%` }}
              />
            );
          })}
        </div>

      </div>
    </div>
  );
};
