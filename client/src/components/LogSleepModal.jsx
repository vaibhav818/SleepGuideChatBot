import React, { useState } from 'react';
import { X, Moon, Sun, Clock, Zap, Coffee, Sparkles, AlertCircle } from 'lucide-react';
import { useSleep } from '../context/SleepContext';
import { useAuth } from '../context/AuthContext';

export default function LogSleepModal({ isOpen, onClose }) {
  const { addSleepLog } = useSleep();
  const { user } = useAuth();

  const [bedtime, setBedtime] = useState('23:30');
  const [wakeTime, setWakeTime] = useState('07:30');
  const [sleepLatencyMinutes, setSleepLatencyMinutes] = useState(15);
  const [qualityRating, setQualityRating] = useState(8);
  const [awakeningsCount, setAwakeningsCount] = useState(0);
  const [morningMood, setMorningMood] = useState('Refreshed');
  const [caffeineCups, setCaffeineCups] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  // Calculate duration preview
  const [bH, bM] = bedtime.split(':').map(Number);
  const [wH, wM] = wakeTime.split(':').map(Number);
  let bedMin = bH * 60 + bM;
  let wakeMin = wH * 60 + wM;
  if (wakeMin <= bedMin) wakeMin += 24 * 60;
  const durationMinutes = wakeMin - bedMin;
  const durationHours = (durationMinutes / 60).toFixed(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await addSleepLog({
        bedtime,
        wakeTime,
        durationMinutes,
        sleepLatencyMinutes: Number(sleepLatencyMinutes),
        qualityRating: Number(qualityRating),
        awakeningsCount: Number(awakeningsCount),
        morningMood,
        caffeineCups: Number(caffeineCups),
        notes,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to record sleep log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-sleep-900 border border-indigo-900/60 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-indigo-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Log Sleep Session</h2>
              <p className="text-xs text-slate-400">Track last night's rest to improve AI guidance accuracy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Bedtime & Wake Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Moon className="w-3.5 h-3.5 text-indigo-400" /> Bedtime
              </label>
              <input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                required
                className="w-full bg-sleep-950 border border-indigo-900/60 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> Wake Time
              </label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                required
                className="w-full bg-sleep-950 border border-indigo-900/60 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Duration Preview Banner */}
          <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-900/50 flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" /> Total Sleep Window:
            </span>
            <span className="font-bold text-emerald-400 text-sm">
              {durationHours} hours ({durationMinutes} mins)
            </span>
          </div>

          {/* Latency & Awakenings */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Fall Asleep Time</label>
                <span className="text-xs font-bold text-indigo-400">{sleepLatencyMinutes} min</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={sleepLatencyMinutes}
                onChange={(e) => setSleepLatencyMinutes(e.target.value)}
                className="w-full accent-indigo-500"
              />
              <span className="text-[10px] text-slate-500">Sleep latency</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Night Awakenings
              </label>
              <select
                value={awakeningsCount}
                onChange={(e) => setAwakeningsCount(e.target.value)}
                className="w-full bg-sleep-950 border border-indigo-900/60 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value={0}>0 (Slept straight through)</option>
                <option value={1}>1 time</option>
                <option value={2}>2 times</option>
                <option value={3}>3 times</option>
                <option value={4}>4+ times (Fragmented)</option>
              </select>
            </div>
          </div>

          {/* Sleep Quality Slider (1-10) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Sleep Quality Rating (1 - 10)
              </label>
              <span className="text-xs font-bold text-emerald-400">{qualityRating}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={qualityRating}
              onChange={(e) => setQualityRating(e.target.value)}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>Poor (Restless)</span>
              <span>Average</span>
              <span>Deep & Rejuvenating</span>
            </div>
          </div>

          {/* Morning Mood & Caffeine */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Morning Feeling
              </label>
              <select
                value={morningMood}
                onChange={(e) => setMorningMood(e.target.value)}
                className="w-full bg-sleep-950 border border-indigo-900/60 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Refreshed">🌟 Refreshed & Energized</option>
                <option value="Alert">⚡ Alert & Ready</option>
                <option value="Neutral">😐 Neutral</option>
                <option value="Groggy">🥱 Groggy / Sleep Inertia</option>
                <option value="Exhausted">💤 Exhausted</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1 mb-1.5">
                <Coffee className="w-3.5 h-3.5 text-amber-500" /> Caffeine Intake
              </label>
              <select
                value={caffeineCups}
                onChange={(e) => setCaffeineCups(e.target.value)}
                className="w-full bg-sleep-950 border border-indigo-900/60 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value={0}>0 cups (Decaf / None)</option>
                <option value={1}>1 cup</option>
                <option value={2}>2 cups</option>
                <option value={3}>3 cups</option>
                <option value={4}>4+ cups (High)</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Evening Notes / Sleep Environment
            </label>
            <input
              type="text"
              placeholder="e.g. Read 20 mins, cool room, ate dinner at 8pm..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-sleep-950 border border-indigo-900/60 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-indigo-950 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {loading ? 'Saving...' : 'Save & Calculate Score'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

