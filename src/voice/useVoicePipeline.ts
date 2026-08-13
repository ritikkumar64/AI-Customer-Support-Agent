import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseVoicePipelineOptions {
  onFinalTranscript?: (text: string) => void;
}

export function useVoicePipeline(options?: UseVoicePipelineOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [voiceSupported, setVoiceSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        startAudioVisualizer();
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        if (event.results[0].isFinal) {
          if (options?.onFinalTranscript && currentTranscript.trim()) {
            options.onFinalTranscript(currentTranscript.trim());
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        stopAudioVisualizer();
      };

      recognition.onend = () => {
        setIsListening(false);
        stopAudioVisualizer();
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Failed to initialize Web Speech API:', e);
      setVoiceSupported(false);
    }

    return () => {
      stopAudioVisualizer();
    };
  }, []);

  const startAudioVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioCtx();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 64;
      microphone.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((average / 128) * 100)));
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (err) {
      // Fallback simulated wave animation if mic stream restricted
      simulateAudioWave();
    }
  };

  const simulateAudioWave = () => {
    const update = () => {
      setAudioLevel(Math.floor(20 + Math.random() * 60));
      animFrameRef.current = requestAnimationFrame(update);
    };
    update();
  };

  const stopAudioVisualizer = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }
    audioContextRef.current = null;
    analyserRef.current = null;
    setAudioLevel(0);
  };

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      setTranscript('');
      recognitionRef.current.start();
    } catch (e) {
      console.warn('Recognition start error:', e);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (e) {
      console.warn('Recognition stop error:', e);
    }
  }, []);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // stop any ongoing speech

    // Clean markdown formatting for speech
    const cleanText = text
      .replace(/[*#_`~]/g, '')
      .replace(/\n+/g, ' ')
      .replace(/https?:\/\/\S+/g, 'link');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Pick pleasant natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen')));
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onstart = () => {
      setIsSpeaking(true);
      simulateAudioWave();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      stopAudioVisualizer();
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      stopAudioVisualizer();
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    stopAudioVisualizer();
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    audioLevel,
    voiceSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking
  };
}
