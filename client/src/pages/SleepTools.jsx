import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
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
} from 'lucide-react';

export default function SleepTools() {
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
  const [breathingPhase, setBreathingPhase] = useState('Inhale'); // Inhale, Hold, Exhale
  const [breathingSeconds, setBreathingSeconds] = useState(4);

  // Calculate sleep cycles
  const fetchCycles = async () => {
    setLoadingCycles(true);
    try {
      const payload = calcMode === 'wake'
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
            // Transition phase
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

  // Caffeine half-life calculation (assuming bedtime at 23:00 / 11 PM)
  const bedHour = 23;
  const hoursElapsed = Math.max(0, bedHour - caffeineHour);
  const remainingCaffeineMg = Math.round(caffeineMg * Math.pow(0.5, hoursElapsed / 5.5));

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Wrench className="w-6 h-6 text-indigo-400" /> Circadian & Sleep Tools
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Clinical calculators, parasympathetic breathing guide, and sleep hygiene protocols
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tool 1: 90-Minute Sleep Cycle Calculator */}
        <div className="glass-card rounded-3xl p-6 border border-indigo-950 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-300 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">90-Minute Sleep Cycle Engine</h3>
                  <p className="text-xs text-slate-400">Wake up at the end of a cycle to prevent sleep inertia</p>
                </div>
              </div>
            </div>

            {/* Mode toggle */}
            <div className="flex rounded-xl bg-sleep-900 p-1 border border-indigo-950 mb-4">
              <button
                onClick={() => setCalcMode('wake')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  calcMode === 'wake' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'
                }`}
              >
                I want to wake up at...
              </button>
              <button
                onClick={() => setCalcMode('bed')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  calcMode === 'bed' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'
                }`}
              >
                I plan to go to bed at...
              </button>
            </div>

            {/* Time Picker */}
            <div className="flex items-center justify-between p-3.5 bg-sleep-950 rounded-2xl border border-indigo-900/60 mb-4">
              <span className="text-xs font-semibold text-slate-300">
                {calcMode === 'wake' ? 'Target Wake Up Time:' : 'Target Bedtime:'}
              </span>
              <input
                type="time"
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
                className="bg-sleep-900 border border-indigo-800 rounded-xl px-3 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Suggested Cycles */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                {calcMode === 'wake' ? 'Optimal Bedtimes:' : 'Optimal Wake Times:'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {cycleOptions.map((opt, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      opt.recommended
                        ? 'bg-gradient-to-b from-indigo-950/80 to-sleep-900 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                        : 'bg-sleep-900/40 border-indigo-950'
                    }`}
                  >
                    <div className="text-lg font-extrabold text-white">
                      {opt.suggestedBedtime || opt.suggestedWakeTime}
                    </div>
                    <div className="text-[11px] font-semibold text-indigo-300 mt-0.5">
                      {opt.durationHours} hrs ({opt.cycles} cycles)
                    </div>
                    {opt.recommended && (
                      <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
                        Recommended
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 mt-4">
            *Accounts for 15 minutes of average physiological sleep latency.
          </p>
        </div>

        {/* Tool 2: 4-7-8 Parasympathetic Breathing Guide */}
        <div className="glass-card rounded-3xl p-6 border border-indigo-950 flex flex-col items-center justify-between text-center">
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Heart className="w-5 h-5 text-rose-400" />
              <h3 className="text-sm font-bold text-white">4-7-8 Relaxing Breath</h3>
            </div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Stimulate the vagus nerve and downregulate heart rate before turning off the lights
            </p>
          </div>

          {/* Animated Breathing Circle */}
          <div className="my-6 relative flex items-center justify-center">
            <div
              className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 ${
                breathingActive
                  ? breathingPhase === 'Inhale'
                    ? 'scale-125 border-emerald-400 bg-emerald-500/10 shadow-xl shadow-emerald-500/20'
                    : breathingPhase === 'Hold'
                    ? 'scale-125 border-amber-400 bg-amber-500/10 shadow-xl shadow-amber-500/20'
                    : 'scale-90 border-indigo-400 bg-indigo-500/10'
                  : 'scale-100 border-indigo-900 bg-sleep-900/60'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {breathingActive ? breathingPhase : 'Ready'}
              </span>
              <span className="text-3xl font-extrabold text-white mt-1">
                {breathingActive ? breathingSeconds : '4-7-8'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (breathingActive) {
                  setBreathingActive(false);
                  setBreathingPhase('Inhale');
                  setBreathingSeconds(4);
                } else {
                  setBreathingActive(true);
                  setBreathingPhase('Inhale');
                  setBreathingSeconds(4);
                }
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                breathingActive
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
              }`}
            >
              {breathingActive ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {breathingActive ? 'Stop Exercise' : 'Start 4-7-8 Breathing'}
            </button>
          </div>
        </div>

        {/* Tool 3: Caffeine Half-Life & Adenosine Simulator */}
        <div className="glass-card rounded-3xl p-6 border border-indigo-950 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Caffeine Half-Life Calculator</h3>
              <p className="text-xs text-slate-400">Estimate active adenosine antagonism at bedtime</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1">
                <span>Time of Last Coffee:</span>
                <span className="text-amber-400 font-bold">
                  {caffeineHour > 12 ? caffeineHour - 12 + ':00 PM' : caffeineHour + ':00 AM'}
                </span>
              </div>
              <input
                type="range"
                min="8"
                max="21"
                step="1"
                value={caffeineHour}
                onChange={(e) => setCaffeineHour(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1">
                <span>Initial Dose:</span>
                <span className="text-amber-400 font-bold">{caffeineMg} mg (approx 1 mug)</span>
              </div>
              <input
                type="range"
                min="50"
                max="350"
                step="25"
                value={caffeineMg}
                onChange={(e) => setCaffeineMg(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Result Box */}
            <div className="p-4 rounded-2xl bg-sleep-900 border border-indigo-950 flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[11px] block">Active caffeine at 11:00 PM Bedtime:</span>
                <span className="text-xl font-extrabold text-white">
                  {remainingCaffeineMg} mg
                </span>
              </div>
              <span
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                  remainingCaffeineMg > 40
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}
              >
                {remainingCaffeineMg > 40 ? '⚠️ Slow-Wave Sleep Disrupted' : '✅ Safe Sleep Window'}
              </span>
            </div>
          </div>
        </div>

        {/* Tool 4: Soundscape Masking Player */}
        <SoundscapePlayer />
      </div>
    </div>
  );
}
