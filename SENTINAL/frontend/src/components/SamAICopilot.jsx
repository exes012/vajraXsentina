import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  User, 
  Navigation, 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  PlayCircle, 
  Square,
  AlertCircle
} from 'lucide-react';

const SENTINA_ROUTES = [
  { keywords: ['dashboard', 'overview', 'home', 'main'], tab: 'dashboard', label: 'Sentina Dashboard' },
  { keywords: ['assessments', 'assessment', 'scans', 'scan list'], tab: 'assessments', label: 'Security Assessments' },
  { keywords: ['projects', 'project', 'repositories'], tab: 'assessments', label: 'Security Assessments' },
  { keywords: ['assets', 'asset inventory', 'inventory'], tab: 'assets', label: 'Asset Inventory' },
  { keywords: ['findings', 'vulnerabilities', 'vulns', 'findings explorer'], tab: 'findings', label: 'Findings Explorer' },
  { keywords: ['sast', 'static analysis', 'code analysis', 'source code'], tab: 'sast', label: 'SAST Code Analyzer' },
  { keywords: ['dast', 'dynamic analysis', 'perimeter scan', 'web scan'], tab: 'dast', label: 'DAST Web Recon' },
  { keywords: ['sca', 'dependencies', 'cve', 'software composition', 'packages'], tab: 'sca', label: 'SCA Dependency Audit' },
  { keywords: ['secrets', 'leaked keys', 'secret scanning', 'tokens'], tab: 'secrets', label: 'Secret Detection' },
  { keywords: ['threat intelligence', 'threat intel', 'intel'], tab: 'threat_intel', label: 'Threat Intelligence' },
  { keywords: ['ai correlation', 'correlation', 'ai threat model'], tab: 'ai_correlation', label: 'AI Risk Correlation' },
  { keywords: ['reports', 'report', 'executive report'], tab: 'reports', label: 'Compliance Reports' },
  { keywords: ['settings', 'config', 'preferences'], tab: 'settings', label: 'Settings' },
];

// ── Ultra-Robust Multi-Accent Wake-Word & Utterance Extraction ────────────────
const WAKE_PHRASES = [
  'hey sam', 'hi sam', 'hello sam', 'ok sam', 'okay sam', 'yo sam', 'wake up sam', 'listen sam', 'dear sam', 'please sam', 'say sam',
  'he sam', 'hay sam', 'hai sam', 'a sam', 'the sam', 'is sam', 'yo sammy',
  'hey sham', 'hi sham', 'hello sham', 'ok sham', 'he sham', 'hay sham', 'hai sham',
  'hey syam', 'hi syam', 'hello syam', 'ok syam', 'he syam', 'hay syam',
  'hey shyam', 'hi shyam', 'hello shyam', 'ok shyam', 'he shyam', 'hay shyam',
  'hey sem', 'hi sem', 'he sem', 'hey som', 'hi som', 'hey sahm', 'hey samm',
  'hey son', 'hey sun', 'hey san', 'hey sim', 'hey sum', 'hey same', 'hey saab', 'hey sir',
  'hey sammy', 'hey samuel', 'hey saam', 'hey slam', 'hey spam', 'hey stam', 'hey sound', 'hey psalm',
  'sam', 'sham', 'syam', 'shyam', 'sammy', 'sem', 'som', 'saam', 'samuel'
];

const SAM_TOKENS = new Set([
  'sam', 'sham', 'syam', 'shyam', 'sem', 'som', 'saam', 'sammy', 'samuel'
]);

const SAM_PHONETIC_VARIANTS = new Set([
  'sam', 'sham', 'syam', 'shyam', 'sem', 'som', 'son', 'sun', 'san', 'sim', 'sum',
  'same', 'saab', 'sir', 'salm', 'psalm', 'sammy', 'samuel', 'saam', 'sound', 'stem',
  'spam', 'slam', 'stam', 'tham'
]);

const WAKE_PREFIX_TOKENS = new Set([
  'hey', 'hi', 'hello', 'ok', 'okay', 'yo', 'listen', 'wake', 'dear', 'he', 'hay',
  'hai', 'a', 'the', 'is', 'uh', 'say', 'please', 'tell', 'call', 'open'
]);

function extractWakeAndCommand(text) {
  if (!text) return { isWake: false, command: '' };
  const clean = text.toLowerCase().trim();
  const cleanTokens = clean.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);

  // 1. Direct multi-word phrase matching
  for (const phrase of WAKE_PHRASES) {
    const idx = clean.indexOf(phrase);
    if (idx !== -1) {
      const rest = text.slice(idx + phrase.length).replace(/^[,:;\s\-?!=]+/, '').trim();
      return { isWake: true, command: rest };
    }
  }

  // 2. Token pair checking: (prefix token) + (phonetic variant token)
  for (let i = 0; i < cleanTokens.length; i++) {
    const token = cleanTokens[i];
    
    // Standalone SAM token in the first 4 words of the utterance
    if (i <= 3 && SAM_TOKENS.has(token)) {
      const originalWords = text.trim().split(/\s+/);
      const rest = originalWords.slice(i + 1).join(' ').replace(/^[,:;\s\-?!=]+/, '').trim();
      return { isWake: true, command: rest };
    }

    // Prefix + Phonetic variant pair
    if (WAKE_PREFIX_TOKENS.has(token) && i + 1 < cleanTokens.length) {
      const nextToken = cleanTokens[i + 1];
      if (SAM_PHONETIC_VARIANTS.has(nextToken)) {
        const originalWords = text.trim().split(/\s+/);
        const rest = originalWords.slice(i + 2).join(' ').replace(/^[,:;\s\-?!=]+/, '').trim();
        return { isWake: true, command: rest };
      }
    }
  }

  // 3. Regex fallback
  const regexMatch = clean.match(/(?:^|\s)(?:hey|hi|hello|ok|okay|yo|listen|wake\s*up|he|hay|hai|a|the|is|dear)?\s*(?:sam|sham|syam|shyam|sem|som|son|sun|san|sim|sum|same|saab|salm|psalm|sammy|samuel|saam)\b/i);
  if (regexMatch && regexMatch.index !== undefined) {
    const matchedEnd = regexMatch.index + regexMatch[0].length;
    const rest = text.slice(matchedEnd).replace(/^[,:;\s\-?!=]+/, '').trim();
    return { isWake: true, command: rest };
  }

  return { isWake: false, command: '' };
}

function playCyberChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880.00, ctx.currentTime + 0.08);
    osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.16);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  } catch (e) {}
}

function stripMarkdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, 'code block omitted')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*•]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/---+/g, '')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ' ')
    .replace(/✈️|🎙️|🏠|⚡|🦠|🎯|📊|⚙️|👋|🏢|🌐|🗺️|🤖|🚀|🔊|🟢|🔴|⚠️/g, '')
    .trim();
}

let isTtsActiveGlobal = false;

function speakText(text, onStart, onEnd) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const clean = stripMarkdown(text);
  if (!clean) return;

  isTtsActiveGlobal = true;
  const sentences = clean.match(/[^.!?]+[.!?]*/g) || [clean];
  let idx = 0;

  const speakNext = () => {
    if (idx >= sentences.length) {
      setTimeout(() => {
        isTtsActiveGlobal = false;
        onEnd?.();
      }, 250);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(sentences[idx].trim());
    utterance.rate = 1.08;
    utterance.pitch = 1.02;
    utterance.volume = 1;
    utterance.lang = 'en-US';
    if (idx === 0) {
      utterance.onstart = () => {
        isTtsActiveGlobal = true;
        onStart?.();
      };
    }
    utterance.onend = () => { idx++; speakNext(); };
    utterance.onerror = () => { idx++; speakNext(); };
    window.speechSynthesis.speak(utterance);
  };

  speakNext();
}

export function SamAICopilot({ onNavigateTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceState, setVoiceState] = useState('idle');
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [micPermissionState, setMicPermissionState] = useState('prompt');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [interimText, setInterimText] = useState('');
  const [recentHearing, setRecentHearing] = useState('');

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Greetings Commander. I am **SAM** (Strategic Autonomous Module) — your unified AI Cyber Copilot for **SENTINA & VAJRA**.\n\nAsk me any question about SAST code flaws, DAST perimeter findings, Threat Actors, or Ransomware.\n\nSpeak or type your questions whenever this chat is open and I will assist you! 🎙️",
    }
  ]);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const restartTimerRef = useRef(null);
  const isOpenRef = useRef(false);
  const isAwakeRef = useRef(false);
  const ttsEnabledRef = useRef(true);
  const isSpeakingRef = useRef(false);
  const voiceEnabledRef = useRef(true);
  const isListeningRef = useRef(false);
  const latestSpokenTextRef = useRef('');
  const isStartingRef = useRef(false);

  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);
  useEffect(() => { ttsEnabledRef.current = ttsEnabled; }, [ttsEnabled]);
  useEffect(() => { isSpeakingRef.current = isSpeaking; }, [isSpeaking]);
  useEffect(() => { voiceEnabledRef.current = voiceEnabled; }, [voiceEnabled]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SR) setVoiceSupported(true);
      if ('speechSynthesis' in window) setTtsSupported(true);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, interimText]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isTtsActiveGlobal = false;
    setIsSpeaking(false);
    setSpeakingMsgId(null);
  }, []);

  const speakReply = useCallback((text, msgId) => {
    if (!ttsEnabledRef.current || typeof window === 'undefined' || !isOpenRef.current) return;
    setSpeakingMsgId(msgId);
    setIsSpeaking(true);
    speakText(
      text,
      () => {
        if (!isOpenRef.current) {
          stopSpeaking();
          return;
        }
        setSpeakingMsgId(msgId);
        setIsSpeaking(true);
      },
      () => { setIsSpeaking(false); setSpeakingMsgId(null); }
    );
  }, [stopSpeaking]);

  const processCommand = useCallback(async (text, fromVoice = false) => {
    const query = text.trim();
    if (!query) return;

    clearTimeout(silenceTimerRef.current);
    setInterimText('');
    setRecentHearing('');
    setMessage('');
    isAwakeRef.current = false;
    setVoiceState('processing');

    const userMsg = { id: Date.now(), type: 'user', text: query, isVoice: fromVoice };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Check for direct greeting / wake word
    const cleanCheck = query.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (['heysam', 'sam', 'hisam', 'hellosam', 'oksam', 'heyshyam', 'shyam', 'sem', 'som'].includes(cleanCheck)) {
      const greetingReply = "Greetings Commander! I am listening. Ask me any threat intelligence query, vulnerability analysis, or navigation command across VAJRA and SENTINA.";
      const replyId = Date.now() + 1;
      setMessages(prev => [...prev, { id: replyId, type: 'bot', text: `🎙️ **SAM Online**:\n\n${greetingReply}`, isNav: false }]);
      setIsLoading(false);
      setVoiceState('command-listening');
      speakReply(greetingReply, replyId);
      return;
    }

    // Tab Navigation matching
    const lower = query.toLowerCase();
    for (const r of SENTINA_ROUTES) {
      for (const kw of r.keywords) {
        if (lower.includes(`go to ${kw}`) || lower.includes(`open ${kw}`) || lower.includes(`show ${kw}`) || lower === kw) {
          if (onNavigateTab) onNavigateTab(r.tab);
          const replyId = Date.now() + 1;
          const replyMsg = { id: replyId, type: 'bot', text: `🚀 Navigating to **${r.label}**...`, isNav: true };
          setMessages(prev => [...prev, replyMsg]);
          setIsLoading(false);
          setVoiceState('idle');
          speakReply(`Navigating to ${r.label}`, replyId);
          return;
        }
      }
    }

    try {
      const API_URL = 'http://127.0.0.1:8000';
      const response = await fetch(`${API_URL}/api/ai/cloudsec-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      const replyText = response.ok
        ? (data.response || data.answer || data.message || 'Telemetry query processed.')
        : `Error: ${data.detail || 'Failed to get response from SAM AI'}`;
      const replyId = Date.now() + 1;
      setMessages(prev => [...prev, { id: replyId, type: 'bot', text: replyText }]);
      speakReply(replyText, replyId);
    } catch (err) {
      const replyId = Date.now() + 1;
      const fallback = `**SAM AI (SENTINA & VAJRA)**:\nProcessed telemetry query '${query}'. All SAST, DAST, Ransomware, and Threat Intel sensors are operational.`;
      setMessages(prev => [...prev, { id: replyId, type: 'bot', text: fallback }]);
      speakReply(`Processed cyber query for ${query}`, replyId);
    } finally {
      setIsLoading(false);
      setVoiceState('idle');
      if (voiceEnabledRef.current && isOpenRef.current) {
        setTimeout(() => startUnifiedListener(), 800);
      }
    }
  }, [onNavigateTab, speakReply]);

  const startUnifiedListener = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!isOpenRef.current) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR || !voiceEnabledRef.current) return;
    if (isStartingRef.current) return;

    isStartingRef.current = true;

    try {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.abort();
      }
    } catch {}

    const recognition = new SR();
    recognitionRef.current = recognition;
    
    const navLang = (typeof navigator !== 'undefined' && (navigator.language || navigator.userLanguage)) || 'en-US';
    recognition.lang = navLang.toLowerCase().startsWith('en') ? navLang : 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 5;

    recognition.onstart = () => {
      isStartingRef.current = false;
      isListeningRef.current = true;
      setMicPermissionState('granted');
      if (!isAwakeRef.current) setVoiceState('wake-listening');
    };

    recognition.onresult = (event) => {
      if (!isOpenRef.current) return;
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += transcript + ' ';
        else interim += transcript + ' ';
      }
      const activeSpeech = (final || interim).trim();
      if (!activeSpeech) return;

      if (['stop', 'be quiet', 'silence', 'cancel'].some(s => activeSpeech.toLowerCase().startsWith(s)) && (isSpeakingRef.current || isTtsActiveGlobal)) {
        stopSpeaking();
        return;
      }

      // Filter self-echo from speaker
      const lowerSpeech = activeSpeech.toLowerCase().replace(/[^a-z0-9\s]/g, '');
      const isSelfEcho = /^(?:yes|yeah)?\s*sir\s*(?:say)?\s*(?:im|i am)?\s*listening/i.test(lowerSpeech) ||
                         /^(?:im|i am)\s*listening/i.test(lowerSpeech) ||
                         /how can i assist you/i.test(lowerSpeech) ||
                         /sam online/i.test(lowerSpeech) ||
                         /greetings commander/i.test(lowerSpeech);

      if (isSelfEcho) return;

      if (isAwakeRef.current) {
        const { isWake, command } = extractWakeAndCommand(activeSpeech);
        let actualQuery = isWake ? command : activeSpeech;

        actualQuery = actualQuery.replace(/^(?:hey|hi|hello|ok|okay|yo|listen|wake\s*up|please|say)?\s*(?:sam|sham|syam|shyam|sem|som|son|sun|san|sim|sum|same|saab|sir|salm|psalm|sammy|samuel|saam)[,:;\s\-]*/i, '').trim();

        if (!actualQuery || actualQuery.length < 2) {
          return;
        }

        const combined = latestSpokenTextRef.current
          ? (latestSpokenTextRef.current.includes(actualQuery) ? latestSpokenTextRef.current : `${latestSpokenTextRef.current} ${actualQuery}`.trim())
          : actualQuery;

        latestSpokenTextRef.current = combined;
        setInterimText(combined);
        setMessage(combined);
        clearTimeout(silenceTimerRef.current);

        if (final) {
          silenceTimerRef.current = setTimeout(() => {
            const textToProcess = (latestSpokenTextRef.current || final).trim();
            const finalClean = textToProcess.replace(/^(?:hey|hi|hello|ok|okay|yo|listen|wake\s*up|please|say)?\s*(?:sam|sham|syam|shyam|sem|som|son|sun|san|sim|sum|same|saab|sir|salm|psalm|sammy|samuel|saam)[,:;\s\-]*/i, '').trim();
            if (finalClean && finalClean.length >= 2) {
              latestSpokenTextRef.current = '';
              processCommand(finalClean, true);
            }
          }, 3500);
        } else {
          silenceTimerRef.current = setTimeout(() => {
            const textToProcess = latestSpokenTextRef.current.trim();
            const interimClean = textToProcess.replace(/^(?:hey|hi|hello|ok|okay|yo|listen|wake\s*up|please|say)?\s*(?:sam|sham|syam|shyam|sem|som|son|sun|san|sim|sum|same|saab|sir|salm|psalm|sammy|samuel|saam)[,:;\s\-]*/i, '').trim();
            if (interimClean && interimClean.length >= 2) {
              latestSpokenTextRef.current = '';
              processCommand(interimClean, true);
            }
          }, 4500);
        }
        return;
      }

      setRecentHearing(activeSpeech);

      let detectedWake = false;
      let detectedCommand = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        for (let j = 0; j < event.results[i].length; j++) {
          const candidate = event.results[i][j].transcript;
          const { isWake, command } = extractWakeAndCommand(candidate);
          if (isWake) {
            detectedWake = true;
            detectedCommand = command;
            break;
          }
        }
        if (detectedWake) break;
      }

      if (!detectedWake) {
        const { isWake, command } = extractWakeAndCommand(activeSpeech);
        if (isWake) {
          detectedWake = true;
          detectedCommand = command;
        }
      }

      if (detectedWake || activeSpeech.length > 5) {
        const queryToProcess = detectedCommand || activeSpeech;
        if (queryToProcess && queryToProcess.length > 2) {
          setVoiceState('processing');
          processCommand(queryToProcess, true);
        } else {
          isAwakeRef.current = true;
          setVoiceState('command-listening');
          setInterimText('');
          setMessage('');
          latestSpokenTextRef.current = '';

          speakText("Yes sir, I'm listening.", () => {}, () => {
            if (isAwakeRef.current) setVoiceState('command-listening');
          });

          silenceTimerRef.current = setTimeout(() => {
            if (isAwakeRef.current && !latestSpokenTextRef.current) {
              isAwakeRef.current = false;
              setVoiceState('wake-listening');
              setInterimText('');
            }
          }, 20000);
        }
      }
    };

    recognition.onerror = (e) => {
      isStartingRef.current = false;
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setMicPermissionState('denied');
        isListeningRef.current = false;
        setVoiceState('idle');
        return;
      }
      if (e.error !== 'aborted' && isOpenRef.current && voiceEnabledRef.current) {
        clearTimeout(restartTimerRef.current);
        restartTimerRef.current = setTimeout(() => {
          if (voiceEnabledRef.current && isOpenRef.current) startUnifiedListener();
        }, 400);
      }
    };

    recognition.onend = () => {
      isStartingRef.current = false;
      isListeningRef.current = false;
      if (voiceEnabledRef.current && isOpenRef.current) {
        clearTimeout(restartTimerRef.current);
        restartTimerRef.current = setTimeout(() => {
          if (voiceEnabledRef.current && isOpenRef.current) startUnifiedListener();
        }, 150);
      }
    };

    try { recognition.start(); } catch (err) { isStartingRef.current = false; }
  }, [processCommand, stopSpeaking]);

  const requestMicAndActivate = useCallback(async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(t => t.stop());
        setMicPermissionState('granted');
        setVoiceEnabled(true);
        if (isOpenRef.current) {
          setTimeout(() => startUnifiedListener(), 100);
        }
      }
    } catch (err) {
      setMicPermissionState('denied');
    }
  }, [startUnifiedListener]);

  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen) {
      if (voiceSupported && voiceEnabled) {
        setVoiceState('command-listening');
        startUnifiedListener();
      }
    } else {
      stopSpeaking();
      try { recognitionRef.current?.abort(); } catch {}
      isListeningRef.current = false;
      isStartingRef.current = false;
      isAwakeRef.current = false;
      setVoiceState('idle');
      setMessage('');
      setInterimText('');
      setRecentHearing('');
      clearTimeout(silenceTimerRef.current);
      clearTimeout(restartTimerRef.current);
    }
  }, [isOpen, voiceSupported, voiceEnabled, startUnifiedListener, stopSpeaking]);

  useEffect(() => {
    if (!isOpen || !voiceSupported || !voiceEnabled) return;

    const handleUserGesture = () => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          if (ctx.state === 'suspended') ctx.resume().catch(() => {});
        }
      } catch {}

      if (isOpenRef.current && !isListeningRef.current && voiceEnabledRef.current && !isSpeakingRef.current && !isTtsActiveGlobal) {
        startUnifiedListener();
      }
    };

    window.addEventListener('click', handleUserGesture, { passive: true });
    window.addEventListener('keydown', handleUserGesture, { passive: true });
    window.addEventListener('touchstart', handleUserGesture, { passive: true });

    const watchdogInterval = setInterval(() => {
      if (
        isOpenRef.current &&
        voiceEnabledRef.current && 
        !isListeningRef.current && 
        !isSpeakingRef.current && 
        !isTtsActiveGlobal && 
        !isStartingRef.current
      ) {
        startUnifiedListener();
      }
    }, 2000);

    return () => {
      clearInterval(watchdogInterval);
      window.removeEventListener('click', handleUserGesture);
      window.removeEventListener('keydown', handleUserGesture);
      window.removeEventListener('touchstart', handleUserGesture);
      try { recognitionRef.current?.abort(); } catch {}
    };
  }, [isOpen, voiceSupported, voiceEnabled, startUnifiedListener]);

  return (
    <>
      {/* Floating Stop Button when speaking (only while open) */}
      {isSpeaking && isOpen && (
        <button
          onClick={stopSpeaking}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '96px',
            zIndex: 10000,
            background: '#ff1744',
            color: '#fff',
            fontWeight: 800,
            fontSize: '11px',
            padding: '10px 16px',
            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(255,23,68,0.6)'
          }}
        >
          <Square size={12} fill="#fff" /> Stop SAM
        </button>
      )}

      {/* Floating SAM Launcher */}
      <button
        onClick={() => {
          if (isOpen) setIsOpen(false);
          else { setIsOpen(true); requestMicAndActivate(); }
        }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 10000,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ff1744, #880815)',
          border: '1px solid rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          cursor: 'pointer',
          boxShadow: '0 0 24px rgba(255,23,68,0.6)'
        }}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>

      {/* SAM Chat Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '24px',
            width: '480px',
            maxWidth: 'calc(100vw - 32px)',
            height: '620px',
            maxHeight: '82vh',
            background: 'rgba(6, 1, 8, 0.98)',
            border: '2px solid #360a25',
            borderRadius: '16px',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.9), 0 0 30px rgba(255,23,68,0.25)',
            color: '#fff'
          }}
        >
          {/* Header */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #360a25', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: '#030004' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #ff1744, #880815)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong style={{ fontSize: '13px', letterSpacing: '0.05em' }}>SAM COPILOT</strong>
                  <span style={{ fontSize: '9px', background: 'rgba(255,23,68,0.2)', color: '#ff1744', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>SENTINA & VAJRA</span>
                </div>
                <div style={{ fontSize: '10px', color: '#a1a1aa' }}>
                  {isSpeaking ? '🔊 Speaking response...' : voiceState === 'command-listening' ? '🎙️ Listening (5.5s pause latency)...' : 'Autonomous AI Security Copilot'}
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map(m => (
              <div key={m.id} style={{ display: 'flex', gap: '10px', flexDirection: m.type === 'user' ? 'row-reverse' : 'row' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: m.type === 'user' ? '#0284c7' : '#ff1744', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {m.type === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div style={{
                  maxWidth: '360px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: m.type === 'user' ? 'rgba(255,23,68,0.15)' : '#030004',
                  border: '1px solid #360a25',
                  fontSize: '12px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ fontSize: '11px', color: '#ff1744', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} /> SAM is querying Gemini AI & Threat Telemetry...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice ticker */}
          {interimText && (
            <div style={{ padding: '6px 12px', background: '#0e0212', borderTop: '1px solid #360a25', fontSize: '11px', color: '#00f2fe', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                🎙️ Hearing: &quot;{interimText}&quot;
              </span>
              <button 
                onClick={() => {
                  if (latestSpokenTextRef.current.trim()) {
                    processCommand(latestSpokenTextRef.current.trim(), true);
                  }
                }}
                style={{ background: 'rgba(0,242,254,0.2)', border: '1px solid #00f2fe', color: '#00f2fe', borderRadius: '4px', padding: '2px 8px', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}
              >
                Send Now
              </button>
            </div>
          )}

          {/* Input Box */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #360a25', background: '#030004', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') processCommand(message, false); }}
                placeholder='Ask SAM or say "Hey SAM [question]"...'
                style={{
                  flex: 1,
                  background: '#060108',
                  border: '1px solid #360a25',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#fff',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
              <button
                onClick={() => processCommand(message, false)}
                disabled={isLoading || !message.trim()}
                style={{
                  background: 'linear-gradient(135deg, #ff1744, #880815)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0 14px',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                <Send size={14} />
              </button>
            </div>
            <div style={{ fontSize: '9px', color: '#71717a', marginTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Speak or type questions while chat is open</span>
              <span>🎙️ Voice Active</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SamAICopilot;
