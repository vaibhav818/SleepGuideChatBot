import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import SoundscapePlayer from '../components/SoundscapePlayer';
import {
  Wrench,
  Clock,
  Coffee,
  Heart,
  Sparkles,
  CheckCircle2,
  Play,
  RotateCcw,
  Moon,
  Sun,
  Wind,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function SleepTools() {
  const { theme, selectedPalette } = useTheme();

  // Sleep Cycle Calculator State
  const [calcMode, setCalcMode] = useState('wake'); // 'wake' or 'bed'
  const [targetTime, setTargetTime] = useState('07:00');
  const [cycleOptions, setCycleOptions] = useState([]);
  const [loadingCycles, setLoadingCycles] = useState(false);

  // Caffeine Calculator State
  const [caffeineHour, setCaffeineHour] = useState(14); // 2 PM
  const [caffeineMg, setCaffeineMg] = useState(150); // standard coffee

  // 4-7-8 Breathing Guide State
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('Inhale');
  const [breathingSeconds, setBreathingSeconds] = useState(4);

  // Calculate sleep cycles
  const fetchCycles = async () => {
    setLoadingCycles(true);
    try {
      const payload =
        calcMode === 'wake'
          ? { targetWakeTime: targetTime }
          : { targetBedTime: targetTime };
      const res = await analyticsAPI.calcSleepCycles(payload);
      if (res.success) {
        setCycleOptions(res.options || []);
      }
    } catch (err) {
      console.warn('Cycle calculation error:', err);
    } finally {
      setLoadingCycles(false);
    }
  };

  useEffect(() => {
    fetchCycles();
  }, [calcMode, targetTime]);

  // 4-7-8 Breathing timer logic
  useEffect(() => {
    let timer;
    if (breathingActive) {
      timer = setInterval(() => {
        setBreathingSeconds((prev) => {
          if (prev <= 1) {
            if (breathingPhase === 'Inhale') {
              setBreathingPhase('Hold');
              return 7;
            } else if (breathingPhase === 'Hold') {
              setBreathingPhase('Exhale');
              return 8;
            } else {
              setBreathingPhase('Inhale');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [breathingActive, breathingPhase]);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-slate-100">
      {/* Header */}
      <div
        className="p-6 rounded-3xl border backdrop-blur-xl transition-colors duration-700"
        style={{
          backgroundColor: theme.cardGlass,
          borderColor: theme.border,
        }}
      >
        <div
          className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-mono uppercase border mb-1.5"
          style={{
            backgroundColor: theme.accentMuted,
            borderColor: theme.border,
            color: theme.accentPrimary,
          }}
        >
          <Wrench className="w-3 h-3" />
          <span>Neuro-Sensory Intervention Suite</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Circadian Sleep Tools
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Ultradian cycle alignment, adenosine half-life calculators, and vagal tone modulation
        </p>
      </div>

      {/* Grid: 3 Main Clinical Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tool 1: 90-Minute Ultradian Sleep Cycle Planner */}
        <div
          className="p-6 rounded-3xl border backdrop-blur-xl space-y-4 flex flex-col justify-between transition-colors duration-700"
          style={{
            backgroundColor: theme.cardGlass,
            borderColor: theme.border,
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme.accentMuted, color: theme.accentPrimary }}
              >
                <Clock className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-white">90-Minute Sleep Cycle Optimizer</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Wake at the crest of light REM sleep to prevent sleep inertia caused by abrupt N3 slow-wave interruptions.
            </p>

            <div
              className="mt-4 flex rounded-2xl bg-black/40 p-1 border"
              style={{ borderColor: theme.border }}
            >
              <button
                onClick={() => setCalcMode('wake')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  calcMode === 'wake' ? 'shadow-md font-bold' : 'text-slate-400 hover:text-white'
                }`}
                style={
                  calcMode === 'wake'
                    ? {
                        backgroundColor: theme.accentPrimary,
                        color: selectedPalette === 'duneSand' ? '#251403' : '#041F1A',
                      }
                    : {}
                }
              >
                I must wake up at
              </button>
              <button
                onClick={() => setCalcMode('bed')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  calcMode === 'bed' ? 'shadow-md font-bold' : 'text-slate-400 hover:text-white'
                }`}
                style={
                  calcMode === 'bed'
                    ? {
                        backgroundColor: theme.accentPrimary,
                        color: selectedPalette === 'duneSand' ? '#251403' : '#041F1A',
                      }
                    : {}
                }
              >
                I plan to sleep at
              </button>
            </div>

            <div className="mt-3">
              <label className="text-[11px] text-slate-400 block mb-1 font-mono uppercase">
                Target Time
              </label>
              <input
                type="time"
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
                className="w-full bg-white/[0.04] border rounded-2xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none"
                style={{ borderColor: theme.border }}
              />
            </div>

            <div className="mt-4 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400">
                Recommended Times
              </span>
              {loadingCycles ? (
                <div className="text-xs text-slate-400 py-2">Computing cycles...</div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {(cycleOptions.length > 0
                    ? cycleOptions
                    : [
                        { time: '21:44', cycles: 6, duration: '9.0h' },
                        { time: '23:14', cycles: 5, duration: '7.5h' },
                        { time: '00:44', cycles: 4, duration: '6.0h' },
                        { time: '02:14', cycles: 3, duration: '4.5h' },
                      ]
                  )
                    .slice(0, 4)
                    .map((c, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center"
                      >
                        <span
                          className="text-sm font-bold block font-mono"
                          style={{ color: theme.accentPrimary }}
                        >
                          {c.suggestedBedtime || c.suggestedWakeTime || c.time || '23:15'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {c.cycles
                            ? `${c.cycles} Cycles (${c.durationHours || c.duration || '7.5h'})`
                            : '5 Cycles (7.5h)'}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 pt-2 border-t border-white/[0.06] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: theme.accentPrimary }} />
            <span>Factoring in 14-minute average latency</span>
          </div>
        </div>

        {/* Tool 2: Adenosine & Caffeine Clearance Half-Life */}
        <div
          className="p-6 rounded-3xl border backdrop-blur-xl space-y-4 flex flex-col justify-between transition-colors duration-700"
          style={{
            backgroundColor: theme.cardGlass,
            borderColor: theme.border,
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme.accentMuted, color: theme.accentPrimary }}
              >
                <Coffee className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-white">Adenosine & Caffeine Curve</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Caffeine features an average 5.5-hour half-life and competitively binds adenosine receptors, suppressing natural sleep pressure.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Consumption Time</span>
                  <span
                    className="font-mono font-bold"
                    style={{ color: theme.accentPrimary }}
                  >
                    {caffeineHour}:00 ({caffeineHour > 12 ? `${caffeineHour - 12} PM` : `${caffeineHour} AM`})
                  </span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="20"
                  value={caffeineHour}
                  onChange={(e) => setCaffeineHour(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  style={{ accentColor: theme.accentPrimary }}
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Dose Quantity</span>
                  <span
                    className="font-mono font-bold"
                    style={{ color: theme.accentPrimary }}
                  >
                    {caffeineMg} mg
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="400"
                  step="25"
                  value={caffeineMg}
                  onChange={(e) => setCaffeineMg(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  style={{ accentColor: theme.accentPrimary }}
                />
              </div>

              {/* Clearance Timeline */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">50% Cleared (1 Half-life):</span>
                  <span className="text-white font-mono">{caffeineHour + 5}:30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">75% Cleared (2 Half-lives):</span>
                  <span
                    className="font-mono font-semibold"
                    style={{ color: theme.accentPrimary }}
                  >
                    {caffeineHour + 11}:00
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-white/[0.06]">
                  <span className="text-slate-400">Stage 3 Sleep Impact:</span>
                  <span
                    className="font-bold"
                    style={{ color: caffeineHour > 14 ? '#F59E0B' : theme.accentPrimary }}
                  >
                    {caffeineHour > 14 ? 'Mild Inhibition' : 'Fully Clear by Bedtime'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 pt-2 border-t border-white/[0.06] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: theme.accentPrimary }} />
            <span>Strict 14:00 cutoff preserves slow-wave integrity</span>
          </div>
        </div>

        {/* Tool 3: Vagal Nerve Parasympathetic Breathing Orb */}
        <div
          className="p-6 rounded-3xl border backdrop-blur-xl space-y-4 flex flex-col justify-between transition-colors duration-700"
          style={{
            backgroundColor: theme.cardGlass,
            borderColor: theme.border,
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme.accentMuted, color: theme.accentPrimary }}
              >
                <Wind className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-white">4-7-8 Parasympathetic Cadence</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prolonged exhalation activates the vagus nerve, reducing autonomic vigilance and lowering systolic blood pressure.
            </p>

            {/* Breathing Animation Orb */}
            <div className="my-6 flex flex-col items-center justify-center">
              <div
                className="w-36 h-36 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-1000"
                style={{
                  borderColor: breathingActive ? theme.accentPrimary : 'rgba(255,255,255,0.1)',
                  backgroundColor: breathingActive ? theme.accentMuted : 'rgba(255,255,255,0.02)',
                  boxShadow: breathingActive ? `0 0 30px ${theme.glowColor}` : 'none',
                  transform:
                    breathingActive && breathingPhase === 'Inhale'
                      ? 'scale(1.12)'
                      : breathingActive && breathingPhase === 'Exhale'
                      ? 'scale(0.92)'
                      : 'scale(1.0)',
                }}
              >
                <span className="text-xs uppercase font-mono tracking-widest text-slate-300">
                  {breathingActive ? breathingPhase : 'Ready'}
                </span>
                <span className="text-3xl font-extrabold text-white mt-1">
                  {breathingActive ? `${breathingSeconds}s` : '4-7-8'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setBreathingActive(!breathingActive)}
              className="w-full py-2.5 rounded-2xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: theme.accentPrimary,
                color: selectedPalette === 'duneSand' ? '#251403' : '#041F1A',
                boxShadow: `0 4px 18px ${theme.glowColor}`,
              }}
            >
              {breathingActive ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Pause Breathing Cycle</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Begin 4-7-8 Sequence</span>
                </>
              )}
            </button>
          </div>

          <div className="text-[10px] text-slate-500 pt-2 border-t border-white/[0.06] flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5" style={{ color: theme.accentPrimary }} />
            <span>Stimulates baroreflex heart-rate deceleration</span>
          </div>
        </div>
      </div>

      {/* Audio Soundscape Suite */}
      <div
        className="p-6 rounded-3xl border backdrop-blur-xl transition-colors duration-700"
        style={{
          backgroundColor: theme.cardGlass,
          borderColor: theme.border,
        }}
      >
        <h2 className="text-base font-bold text-white mb-4">Acoustic Masking Synthesizer</h2>
        <SoundscapePlayer />
      </div>
    </div>
  );
}
