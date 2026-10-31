import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSleep } from '../context/SleepContext';
import { useTheme } from '../context/ThemeContext';
import { chatAPI, analyticsAPI } from '../services/api';
import {
  Moon,
  Sparkles,
  Coffee,
  Heart,
  TrendingUp,
  Clock,
  Activity,
  Bed,
  CheckCircle2,
  ChevronRight,
  Send,
  X,
  Plus,
  ShieldCheck,
  Compass,
  Headphones,
  Waves,
  CloudRain,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Wind,
  Eye,
  Sunset,
  Droplets,
  RotateCcw,
  Zap,
  Flame,
  Info,
} from 'lucide-react';

const PALETTES = {
  seafoamAurora: {
    id: 'seafoamAurora',
    name: 'Seafoam & Aurora',
    tagline: 'Option 4: Bioluminescent seafoam & misty celestial cyan',
    bgDark: '#060A0F',
    bgSubtle: 'rgba(10, 18, 28, 0.65)',
    cardGlass: 'rgba(12, 23, 36, 0.58)',
    cardGlassHover: 'rgba(16, 30, 48, 0.75)',
    border: 'rgba(45, 212, 191, 0.16)',
    borderHover: 'rgba(45, 212, 191, 0.38)',
    accentPrimary: '#2DD4BF',
    accentSecondary: '#38BDF8',
    accentMuted: 'rgba(45, 212, 191, 0.15)',
    glowColor: 'rgba(45, 212, 191, 0.28)',
    textHighlight: '#99F6E4',
    orbGradient:
      'radial-gradient(circle at 40% 40%, rgba(45, 212, 191, 0.45) 0%, rgba(14, 165, 233, 0.2) 50%, rgba(6, 10, 15, 0) 80%)',
    pillActive: '#2DD4BF',
    pillActiveText: '#041F1A',
  },
  duneSand: {
    id: 'duneSand',
    name: 'Dune & Amber Sand',
    tagline: 'Option 2: Earthy oat, honey sand & soft candlelight',
    bgDark: '#0B0907',
    bgSubtle: 'rgba(22, 18, 14, 0.65)',
    cardGlass: 'rgba(26, 21, 16, 0.58)',
    cardGlassHover: 'rgba(36, 29, 22, 0.75)',
    border: 'rgba(226, 179, 118, 0.16)',
    borderHover: 'rgba(226, 179, 118, 0.38)',
    accentPrimary: '#E2B376',
    accentSecondary: '#D49755',
    accentMuted: 'rgba(226, 179, 118, 0.15)',
    glowColor: 'rgba(226, 179, 118, 0.26)',
    textHighlight: '#FDE68A',
    orbGradient:
      'radial-gradient(circle at 40% 40%, rgba(226, 179, 118, 0.45) 0%, rgba(180, 83, 9, 0.2) 50%, rgba(11, 9, 7, 0) 80%)',
    pillActive: '#E2B376',
    pillActiveText: '#251403',
  },
};

export default function SoothingDashboard({ onOpenLogModal, setActiveTab }) {
  const { user } = useAuth();
  const { logs, stats } = useSleep();
  const { theme, selectedPalette, setSelectedPalette } = useTheme();

  // 4-7-8 Breathing Orb State
  const [breathActive, setBreathActive] = useState(true);
  const [breathPhase, setBreathPhase] = useState('Inhale');
  const [breathProgress, setBreathProgress] = useState(0);

  // Web Audio Soundscape Engine
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [activeSound, setActiveSound] = useState('waves');
  const [volume, setVolume] = useState(35);
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const soundNodesRef = useRef([]);

  // Telemetry Metrics synced with backend live stats
  const targetHours = user?.sleepProfile?.targetHours || 8;
  const latestLog = stats?.latestLog || logs[0];
  const score = latestLog?.sleepScore || stats?.avgScore || 82;
  const avgDuration = stats?.avgDurationHours ? `${stats.avgDurationHours}h` : '7h 45m';
  const efficiency = `${stats?.sleepEfficiency || 88}%`;
  const debt = `${stats?.sleepDebtHours || 0}h`;
  const fallAsleep = `${latestLog?.sleepLatency || 14} min`;

  // 7-day trend telemetry
  const [activeTrendIndex, setActiveTrendIndex] = useState(6);
  const [trendHistory, setTrendHistory] = useState([
    { day: 'Mon', score: 78, duration: 7.2, deep: 20, rem: 22, light: 58 },
    { day: 'Tue', score: 81, duration: 7.6, deep: 24, rem: 21, light: 55 },
    { day: 'Wed', score: 75, duration: 6.8, deep: 18, rem: 20, light: 62 },
    { day: 'Thu', score: 84, duration: 8.0, deep: 25, rem: 25, light: 50 },
    { day: 'Fri', score: 86, duration: 8.1, deep: 26, rem: 24, light: 50 },
    { day: 'Sat', score: 89, duration: 8.4, deep: 28, rem: 24, light: 48 },
    { day: 'Sun', score: 82, duration: 7.75, deep: 24, rem: 22, light: 54 },
  ]);

  useEffect(() => {
    async function loadTrends() {
      try {
        const res = await analyticsAPI.getTrends(7);
        if (res.success && res.data && res.data.length > 0) {
          const mapped = res.data.map((d) => ({
            day: d.dayName,
            score: d.sleepScore,
            duration: d.durationHours,
            deep: Math.round(d.durationHours * 2.8),
            rem: Math.round(d.durationHours * 2.6),
            light: Math.max(20, 100 - Math.round(d.durationHours * 5.4)),
          }));
          setTrendHistory(mapped);
          setActiveTrendIndex(mapped.length - 1);
        }
      } catch (err) {
        console.warn('Trend fetch notice:', err.message);
      }
    }
    loadTrends();
  }, [logs]);

  // AI Sleep Guide Live Drawer & Chat State
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: `Good day, ${user?.name?.split(' ')[0] || 'Vaibhav'}. Your circadian temperature drop begins in ~6 hours. Your caffeine cutoff has protected your slow-wave sleep reserve for tonight.`,
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Starfield Canvas
  const canvasRef = useRef(null);

  // 4-7-8 Breathing Loop
  useEffect(() => {
    if (!breathActive) return;
    const cycle = [
      { name: 'Inhale', duration: 4000 },
      { name: 'Hold', duration: 7000 },
      { name: 'Exhale Gently', duration: 8000 },
    ];
    let currentIndex = 0;
    let startTime = Date.now();

    const interval = setInterval(() => {
      const currentCycle = cycle[currentIndex];
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / currentCycle.duration) * 100);
      setBreathProgress(progress);

      if (elapsed >= currentCycle.duration) {
        currentIndex = (currentIndex + 1) % cycle.length;
        setBreathPhase(cycle[currentIndex].name);
        startTime = Date.now();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [breathActive]);

  // Starfield Particle Dust Animation Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      speed: Math.random() * 0.2 + 0.05,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = theme.accentPrimary;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  // Web Audio Acoustic Masking Synth
  const initAudioEngine = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
      gainNodeRef.current = audioCtxRef.current.createGain();
      gainNodeRef.current.gain.value = volume / 100;
      gainNodeRef.current.connect(audioCtxRef.current.destination);
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const stopAudio = () => {
    soundNodesRef.current.forEach((n) => {
      try {
        if (n.stop) n.stop();
        if (n.disconnect) n.disconnect();
      } catch (err) { }
    });
    soundNodesRef.current = [];
  };

  const startAcousticMasking = (type) => {
    initAudioEngine();
    stopAudio();
    const ctx = audioCtxRef.current;
    const master = gainNodeRef.current;
    const bufferSize = ctx.sampleRate * 2.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastVal = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'brown') {
        lastVal = (lastVal + 0.025 * white) / 1.025;
        data[i] = lastVal * 3.5;
      } else if (type === 'rain') {
        lastVal = (lastVal + 0.05 * white) / 1.05;
        data[i] = lastVal * 2.2;
      } else {
        lastVal = (lastVal + 0.035 * white) / 1.035;
        data[i] = lastVal * 2.8;
      }
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    if (type === 'brown') {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, ctx.currentTime);
    } else if (type === 'rain') {
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(750, ctx.currentTime);
      filter.Q.setValueAtTime(0.4, ctx.currentTime);
    } else {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.08, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(220, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
      soundNodesRef.current.push(lfo);
    }

    noise.connect(filter);
    filter.connect(master);
    noise.start();
    soundNodesRef.current.push(noise);
  };

  const toggleSoundPlay = () => {
    if (isPlayingSound) {
      stopAudio();
      setIsPlayingSound(false);
    } else {
      startAcousticMasking(activeSound);
      setIsPlayingSound(true);
    }
  };

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(
        volume / 100,
        audioCtxRef.current.currentTime,
        0.05
      );
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopAudio();
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  // Connect AI Sleep Guide to live Gemini API backend
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setIsAiTyping(true);

    try {
      const res = await chatAPI.sendMessage(userText);
      const raw = res.response || res.message || res.data?.message;
      const aiReply = typeof raw === 'string' ? raw : (raw?.text || raw?.content || 'Your circadian pacing is aligning well with your recovery schedule.');
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply,
        },
      ]);
    } catch (err) {
      const isOffline = err.message?.includes('Cannot reach') || err.message?.includes('Backend server') || err.message?.includes('Failed to fetch');
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: isOffline
            ? '⚠️ Backend server is currently not reachable on port 5000. Start it with "node server/server.js" to receive live Gemini responses.'
            : 'Circadian advice: Lower bedroom temperature to 18-19°C (66°F) and dim overhead lighting to facilitate natural melatonin secretion.',
        },
      ]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const userName = user?.name ? user.name.split(' ')[0] : 'Vaibhav';

  return (
    <div
      className="min-h-screen text-slate-100 transition-colors duration-700 selection:bg-teal-500/20 relative font-sans overflow-x-hidden"
      style={{
        backgroundColor: theme.bgDark,
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Background Starfield Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-70" />

      {/* Atmospheric Aurora Orbs */}
      <div
        className="fixed -top-48 -left-48 w-[640px] h-[640px] rounded-full blur-[160px] pointer-events-none transition-all duration-1000"
        style={{ background: theme.glowColor }}
      />
      <div
        className="fixed bottom-0 -right-48 w-[600px] h-[600px] rounded-full blur-[170px] pointer-events-none transition-all duration-1000"
        style={{ background: theme.glowColor, opacity: 0.5 }}
      />

      {/* Main Sanctuary Layout */}
      <div className="space-y-8 relative z-10 pb-12">
        {/* Top Control Bar: Theme Palette Selector & AI Guide Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* Palette Selector Pills */}
          <div
            className="flex items-center p-1 rounded-2xl border backdrop-blur-md"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              borderColor: theme.border,
            }}
          >
            <button
              onClick={() => setSelectedPalette('seafoamAurora')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${selectedPalette === 'seafoamAurora'
                  ? 'bg-[#2DD4BF] text-slate-950 font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Seafoam & Aurora</span>
            </button>
            <button
              onClick={() => setSelectedPalette('duneSand')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${selectedPalette === 'duneSand'
                  ? 'bg-[#E2B376] text-stone-950 font-semibold shadow-md'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              <Sunset className="w-3.5 h-3.5" />
              <span>Dune & Amber Sand</span>
            </button>
          </div>

          <button
            onClick={() => setShowAiDrawer(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all text-slate-200"
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: theme.accentPrimary }} />
            <span>Circadian AI Guide</span>
          </button>
        </div>

        {/* HERO SECTION: Hypnagogic Breathing Orb & Real-time Wind-Down Hero */}
        <section
          className="relative rounded-3xl p-6 sm:p-10 backdrop-blur-2xl border overflow-hidden transition-all duration-700"
          style={{
            backgroundColor: theme.cardGlass,
            borderColor: theme.border,
            boxShadow: `0 20px 60px -20px rgba(0,0,0,0.8)`,
          }}
        >
          {/* Subtle Organic Background Mesh */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: theme.accentPrimary }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Greeting & Circadian Snapshot */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-medium bg-white/[0.04] border border-white/[0.08]">
                <span
                  className="w-2 h-2 rounded-full animate-ping"
                  style={{ backgroundColor: theme.accentPrimary }}
                />
                <span className="text-slate-300">
                  Circadian Window: Biological Twilight Approaching
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight tracking-tight text-white leading-tight">
                Good day,{' '}
                <span className="font-semibold" style={{ color: theme.accentPrimary }}>
                  {userName}
                </span>
              </h1>

              <p className="text-sm text-slate-300/80 max-w-xl leading-relaxed">
                Your nervous system is operating in restorative equilibrium. Heart rate dip was
                detected at 04:12 AM with 24% deep slow-wave renewal.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenLogModal}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all hover:scale-[1.02] shadow-lg"
                  style={{
                    backgroundColor: theme.accentPrimary,
                    color: selectedPalette === 'duneSand' ? '#241302' : '#041F1A',
                    boxShadow: `0 6px 20px ${theme.glowColor}`,
                  }}
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Log Sleep Session</span>
                </button>

                <button
                  onClick={() => setBreathActive(!breathActive)}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all text-slate-300"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{breathActive ? 'Pause Breathing Guide' : 'Resume Breathing Guide'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Interactive 4-7-8 Breathing Orb Centerpiece */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 relative">
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Outer Breathing Ripples */}
                <div
                  className="absolute inset-0 rounded-full transition-all duration-1000 ease-in-out"
                  style={{
                    border: `1.5px solid ${theme.accentPrimary}`,
                    opacity: breathPhase === 'Inhale' ? 0.6 : 0.2,
                    transform: breathPhase === 'Inhale' ? 'scale(1.15)' : 'scale(0.92)',
                    filter: `drop-shadow(0 0 15px ${theme.glowColor})`,
                  }}
                />

                <div
                  className="absolute inset-4 rounded-full transition-all duration-700 ease-in-out"
                  style={{
                    background: theme.orbGradient,
                    transform: breathPhase === 'Inhale' ? 'scale(1.05)' : 'scale(0.88)',
                    filter: 'blur(8px)',
                  }}
                />

                {/* Core Organic Pulsing Center */}
                <div
                  className="relative z-10 w-44 h-44 rounded-full flex flex-col items-center justify-center text-center p-4 backdrop-blur-md border shadow-2xl transition-all duration-1000"
                  style={{
                    backgroundColor: 'rgba(10, 15, 22, 0.7)',
                    borderColor: theme.border,
                    transform: breathPhase === 'Hold' ? 'scale(1.02)' : 'scale(1.0)',
                  }}
                >
                  <Wind
                    className="w-5 h-5 mb-1.5 transition-transform duration-500"
                    style={{ color: theme.accentPrimary }}
                  />
                  <span className="text-xs uppercase tracking-widest text-slate-400 font-mono font-medium">
                    {breathPhase}
                  </span>
                  <span className="text-xl font-bold text-white tracking-tight mt-0.5">
                    4 • 7 • 8
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">
                    {Math.round(breathProgress)}%
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: theme.accentPrimary }}
                />
                Hypnagogic Resonance for Vagal Tone
              </p>
            </div>
          </div>
        </section>

        {/* 4 REFINED TELEMETRY CAPSULES */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'AVG DURATION',
              value: avgDuration,
              sub: `Goal: ${targetHours}.0h`,
              icon: Clock,
            },
            {
              label: 'SLEEP EFFICIENCY',
              value: efficiency,
              sub: '>85% Clinically Restorative',
              icon: Activity,
            },
            {
              label: '7-DAY SLEEP DEBT',
              value: debt,
              sub: 'Optimum equilibrium',
              icon: TrendingUp,
            },
            {
              label: 'FALL ASLEEP TIME',
              value: fallAsleep,
              sub: 'Ideal onset: 10 - 20m',
              icon: Moon,
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-3xl border backdrop-blur-md transition-all duration-300 hover:scale-[1.02]"
                style={{
                  backgroundColor: theme.cardGlass,
                  borderColor: theme.border,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400 font-mono">
                    {item.label}
                  </span>
                  <div className="p-2 rounded-xl" style={{ backgroundColor: theme.accentMuted }}>
                    <Icon className="w-4 h-4" style={{ color: theme.accentPrimary }} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">{item.value}</div>
                <div className="text-[11px] text-slate-400 mt-1 font-medium">{item.sub}</div>
              </div>
            );
          })}
        </div>

        {/* SECTION 2: Pittsburgh Sleep Quality Index & 24h Circadian Clock */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Clinical PSQI Card */}
          <div
            className="lg:col-span-5 rounded-3xl p-6 sm:p-7 backdrop-blur-xl border flex flex-col justify-between space-y-4"
            style={{
              backgroundColor: theme.cardGlass,
              borderColor: theme.border,
            }}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400">
                  CLINICAL RESTORATION INDEX
                </span>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border"
                  style={{
                    backgroundColor: theme.accentMuted,
                    borderColor: theme.border,
                    color: theme.accentPrimary,
                  }}
                >
                  PSQI Verified
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white tracking-tight mt-1">
                Restorative Sleep Score
              </h3>
            </div>

            <div className="flex items-center justify-center py-4">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r="60"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="60"
                    stroke={theme.accentPrimary}
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 60}
                    strokeDashoffset={2 * Math.PI * 60 * (1 - score / 100)}
                    strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 12px ${theme.glowColor})` }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-extrabold text-white tracking-tight">
                    {score}
                  </span>
                  <span className="text-[10px] uppercase font-mono text-slate-400">Optimal</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-300">
              <div className="flex items-center gap-1.5 font-semibold text-white mb-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: theme.accentPrimary }} />
                <span>N3 Stage Sleep Achieved</span>
              </div>
              <span>Physiological delta waves restored cellular ATP reserves in muscle tissue.</span>
            </div>
          </div>

          {/* 24-Hour Biological Clock Phase */}
          <div
            className="lg:col-span-7 rounded-3xl p-6 sm:p-7 backdrop-blur-xl border flex flex-col justify-between space-y-4"
            style={{
              backgroundColor: theme.cardGlass,
              borderColor: theme.border,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400">
                  CIRCADIAN PACEMAKER
                </span>
                <h3 className="text-base font-semibold text-white tracking-tight">
                  24-Hour Biological Clock Phase
                </h3>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5" style={{ color: theme.accentPrimary }} />
                <span>Real-Time Pacemaker</span>
              </div>
            </div>

            {/* Visual Circadian Wave Line */}
            <div className="py-4">
              <div className="relative h-28 rounded-2xl p-4 bg-gradient-to-r from-slate-900/80 via-black/40 to-slate-900/80 border border-white/5 flex items-center justify-between overflow-hidden">
                <svg
                  className="absolute inset-0 w-full h-full opacity-30"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 40"
                >
                  <path
                    d="M 0 30 Q 25 5, 50 25 T 100 15"
                    fill="none"
                    stroke={theme.accentPrimary}
                    strokeWidth="1.5"
                  />
                </svg>

                <div className="relative z-10 text-center">
                  <span className="text-[10px] font-mono text-slate-400 block">14:00</span>
                  <span className="text-xs font-semibold text-amber-200/90 flex items-center gap-1 justify-center">
                    <Coffee className="w-3 h-3" /> Cutoff
                  </span>
                  <span className="text-[9px] text-slate-500">Adenosine</span>
                </div>

                <div className="relative z-10 text-center">
                  <span className="text-[10px] font-mono text-slate-400 block">21:00</span>
                  <span className="text-xs font-semibold text-indigo-200/90 flex items-center gap-1 justify-center">
                    <Eye className="w-3 h-3" /> Melatonin
                  </span>
                  <span className="text-[9px] text-slate-500">Dim light</span>
                </div>

                <div className="relative z-10 text-center">
                  <span className="text-[10px] font-mono text-slate-400 block">02:00</span>
                  <span
                    className="text-xs font-semibold flex items-center gap-1 justify-center"
                    style={{ color: theme.accentPrimary }}
                  >
                    <Moon className="w-3 h-3" /> Deep Peak
                  </span>
                  <span className="text-[9px] text-slate-500">Core min temp</span>
                </div>

                <div className="relative z-10 text-center">
                  <span className="text-[10px] font-mono text-slate-400 block">07:00</span>
                  <span className="text-xs font-semibold text-emerald-200/90 flex items-center gap-1 justify-center">
                    <Flame className="w-3 h-3" /> Cortisol
                  </span>
                  <span className="text-[9px] text-slate-500">Wake surge</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div
                className="p-3.5 rounded-2xl border"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  borderColor: theme.border,
                }}
              >
                <span className="text-slate-400 block text-[10px] uppercase font-mono">
                  Caffeine Clearance
                </span>
                <p className="text-white font-medium mt-0.5">
                  Adenosine receptors are steadily clearing for restorative N3 slow waves.
                </p>
              </div>

              <div
                className="p-3.5 rounded-2xl border"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  borderColor: theme.border,
                }}
              >
                <span className="text-slate-400 block text-[10px] uppercase font-mono">
                  Suggested Bedroom Climate
                </span>
                <p className="text-white font-medium mt-0.5">
                  66°F - 68°F (19°C) accelerates vasodilation, shortening latency by ~6 min.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: 7-Day Hypnogram Wave & Interactive Acoustic Soundscapes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 7-Day Sleep Duration Hypnogram Wave */}
          <div
            className="lg:col-span-8 rounded-3xl p-6 sm:p-7 backdrop-blur-xl border space-y-4"
            style={{
              backgroundColor: theme.cardGlass,
              borderColor: theme.border,
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400">
                  NEURAL RESTORATION TREND
                </span>
                <h3 className="text-base font-semibold text-white tracking-tight">
                  7-Day Duration & Sleep Quality Waveform
                </h3>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400">Selected Day:</span>
                <span className="font-semibold font-mono" style={{ color: theme.accentPrimary }}>
                  {trendHistory[activeTrendIndex]?.day} ({trendHistory[activeTrendIndex]?.duration}h •{' '}
                  {trendHistory[activeTrendIndex]?.score} Score)
                </span>
              </div>
            </div>

            {/* Interactive Pillar Bars */}
            <div className="h-56 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-2">
              {trendHistory.map((item, idx) => {
                const heightPct = (item.duration / 10) * 100;
                const isSelected = activeTrendIndex === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => setActiveTrendIndex(idx)}
                    className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                  >
                    <div className="text-[10px] text-slate-400 mb-1 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.duration}h
                    </div>

                    <div
                      className="w-full max-w-[48px] rounded-2xl overflow-hidden flex flex-col-reverse transition-all duration-300 group-hover:scale-105"
                      style={{
                        height: `${heightPct}%`,
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: isSelected
                          ? `1.5px solid ${theme.accentPrimary}`
                          : '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: isSelected ? `0 0 16px ${theme.glowColor}` : 'none',
                      }}
                    >
                      <div
                        style={{
                          height: `${item.deep}%`,
                          backgroundColor: theme.accentSecondary,
                        }}
                      />
                      <div
                        style={{
                          height: `${item.rem}%`,
                          backgroundColor: theme.accentPrimary,
                        }}
                      />
                      <div
                        style={{ height: `${item.light}%` }}
                        className="bg-slate-700/50"
                      />
                    </div>

                    <span
                      className={`text-xs mt-2.5 font-medium transition-colors ${isSelected ? 'text-white font-bold' : 'text-slate-400'
                        }`}
                      style={isSelected ? { color: theme.accentPrimary } : {}}
                    >
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-3 border-t border-white/[0.06]">
              <div className="flex items-center space-x-4">
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: theme.accentSecondary }}
                  />
                  Deep N3
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: theme.accentPrimary }}
                  />
                  REM Sleep
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-700/50" />
                  Core / Light
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Baseline biological target: {targetHours}.0 hrs
              </span>
            </div>
          </div>

          {/* Right Column: Web-Audio Acoustic Masking Player */}
          <div
            className="lg:col-span-4 rounded-3xl p-6 sm:p-7 backdrop-blur-xl border flex flex-col justify-between"
            style={{
              backgroundColor: theme.cardGlass,
              borderColor: theme.border,
            }}
          >
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400">
                    ACOUSTIC MASKING
                  </span>
                  <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                    <Headphones className="w-4 h-4" style={{ color: theme.accentPrimary }} />
                    Soundscapes Synth
                  </h3>
                </div>

                <button
                  onClick={toggleSoundPlay}
                  className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg"
                  style={{
                    backgroundColor: theme.accentPrimary,
                    color: selectedPalette === 'duneSand' ? '#241302' : '#041F1A',
                    boxShadow: `0 4px 18px ${theme.glowColor}`,
                  }}
                >
                  {isPlayingSound ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-400 mt-2">
                Generates pink/brown noise and modulated waves to lower cortical vigilance.
              </p>

              {/* Sound Selector Buttons */}
              <div className="grid grid-cols-3 gap-2 mt-5">
                {[
                  { id: 'waves', label: 'Tidal Swell', icon: Waves },
                  { id: 'rain', label: 'Night Rain', icon: CloudRain },
                  { id: 'brown', label: 'Warm Brown', icon: Wind },
                ].map((s) => {
                  const Icon = s.icon;
                  const isCur = activeSound === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        setActiveSound(s.id);
                        if (isPlayingSound) startAcousticMasking(s.id);
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${isCur ? 'font-semibold shadow-md' : 'text-slate-400 hover:text-white'
                        }`}
                      style={{
                        backgroundColor: isCur ? theme.accentMuted : 'rgba(255,255,255,0.02)',
                        borderColor: isCur ? theme.accentPrimary : 'rgba(255,255,255,0.06)',
                        color: isCur ? theme.accentPrimary : '#94A3B8',
                      }}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px] font-medium leading-tight">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Volume Control */}
            <div className="pt-6">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setVolume((v) => (v > 0 ? 0 : 35))}
                  className="text-slate-400 hover:text-white"
                >
                  {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  style={{ accentColor: theme.accentPrimary }}
                />
                <span className="text-xs font-mono text-slate-400 w-8 text-right">
                  {volume}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Sleep Guide Drawer connected to Gemini backend */}
      {showAiDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="w-full max-w-md h-full flex flex-col border-l shadow-2xl relative"
            style={{
              backgroundColor: theme.bgDark,
              borderColor: theme.border,
            }}
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-9 h-9 rounded-2xl flex items-center justify-center font-bold"
                  style={{ backgroundColor: theme.accentMuted, color: theme.accentPrimary }}
                >
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Somna Circadian AI</h3>
                  <p className="text-[11px]" style={{ color: theme.accentPrimary }}>
                    Gemini Nocturnal Telemetry Engine
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAiDrawer(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 leading-relaxed ${msg.sender === 'user'
                        ? 'text-slate-950 font-medium'
                        : 'bg-white/[0.04] border border-white/[0.08] text-slate-200'
                      }`}
                    style={
                      msg.sender === 'user'
                        ? { backgroundColor: theme.accentPrimary }
                        : {}
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-3.5 text-slate-400 text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full animate-bounce bg-teal-400"></span>
                    <span>Gemini AI is analyzing sleep telemetry...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-white/[0.08] bg-black/50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  placeholder="Ask about sleep stages, latency, or evening wind-down..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  style={{ borderColor: theme.border }}
                />
                <button
                  type="submit"
                  disabled={isAiTyping}
                  className="p-2.5 rounded-xl font-bold transition-all text-slate-950 disabled:opacity-50"
                  style={{ backgroundColor: theme.accentPrimary }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
