import React, { useState } from 'react';
import { X, Moon, Sun, Clock, Zap, Coffee, Sparkles, AlertCircle } from 'lucide-react';
import { useSleep } from '../context/SleepContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function LogSleepModal({ isOpen, onClose }) {
  const { addSleepLog } = useSleep();
  const { user } = useAuth();
  const { theme, selectedPalette } = useTheme();

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
      <div
        className="relative w-full max-w-lg rounded-3xl shadow-2xl p-6 overflow-hidden border backdrop-blur-2xl"
        style={{
          backgroundColor: theme.bgDark,
          borderColor: theme.border,
          boxShadow: `0 20px 50px rgba(0,0,0,0.8), 0 0 20px ${theme.glowColor}`,
        }}
      >
        {/* Glow decoration */}
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: theme.accentPrimary }}
        ></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: theme.border }}>
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl border flex items-center justify-center"
              style={{
                backgroundColor: theme.accentMuted,
                borderColor: theme.border,
                color: theme.accentPrimary,
              }}
            >
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Log Sleep Session</h2>
              <p className="text-[11px] text-slate-400">Record last night's biological sleep telemetry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Bedtime & Wake Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Moon className="w-3.5 h-3.5" style={{ color: theme.accentPrimary }} /> Bedtime
              </label>
              <input
                type="time"
                required
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="w-full bg-white/[0.04] border rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                style={{ borderColor: theme.border }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> Wake Time
              </label>
              <input
                type="time"
                required
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full bg-white/[0.04] border rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                style={{ borderColor: theme.border }}
              />
            </div>
          </div>

          {/* Duration Preview Banner */}
          <div
            className="p-3 rounded-xl border flex items-center justify-between text-xs"
            style={{
              backgroundColor: theme.accentMuted,
              borderColor: theme.border,
            }}
          >
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4" style={{ color: theme.accentPrimary }} /> Total Sleep Window:
            </div>
            <span className="font-extrabold text-sm" style={{ color: theme.accentPrimary }}>
              {durationHours} Hours ({durationMinutes} mins)
            </span>
          </div>

          {/* Sleep Latency */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-300">Sleep Latency (Time to fall asleep)</label>
              <span className="text-xs font-bold font-mono" style={{ color: theme.accentPrimary }}>
                {sleepLatencyMinutes} min
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={sleepLatencyMinutes}
              onChange={(e) => setSleepLatencyMinutes(e.target.value)}
              className="w-full h-1.5 bg-white/10 rounded-lg cursor-pointer"
              style={{ accentColor: theme.accentPrimary }}
            />
          </div>

          {/* Sleep Quality (1-10) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-300">Subjective Sleep Quality</label>
              <span className="text-xs font-bold" style={{ color: theme.accentPrimary }}>{qualityRating} / 10</span>
            </div>
            <div className="grid grid-cols-10 gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setQualityRating(num)}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    qualityRating === num ? 'font-bold shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                  style={
                    qualityRating === num
                      ? {
                          backgroundColor: theme.accentPrimary,
                          color: selectedPalette === 'duneSand' ? '#251403' : '#041F1A',
                          borderColor: theme.accentPrimary,
                        }
                      : {
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          borderColor: 'rgba(255, 255, 255, 0.06)',
                        }
                  }
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Awakenings & Caffeine & Morning Mood */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Awakenings</label>
              <select
                value={awakeningsCount}
                onChange={(e) => setAwakeningsCount(e.target.value)}
                className="w-full bg-slate-900 border rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
                style={{ borderColor: theme.border }}
              >
                {[0, 1, 2, 3, 4, 5, '6+'].map((n) => (
                  <option key={n} value={n}>{n} times</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
                <Coffee className="w-3 h-3 text-amber-500" /> Caffeine
              </label>
              <select
                value={caffeineCups}
                onChange={(e) => setCaffeineCups(e.target.value)}
                className="w-full bg-slate-900 border rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
                style={{ borderColor: theme.border }}
              >
                {[0, 1, 2, 3, 4, 5, '6+'].map((c) => (
                  <option key={c} value={c}>{c} cups</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Morning Mood</label>
              <select
                value={morningMood}
                onChange={(e) => setMorningMood(e.target.value)}
                className="w-full bg-slate-900 border rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
                style={{ borderColor: theme.border }}
              >
                <option value="Refreshed">Refreshed</option>
                <option value="Alert">Alert</option>
                <option value="Groggy">Groggy</option>
                <option value="Exhausted">Exhausted</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Session Notes & Behavioral Context</label>
            <input
              type="text"
              placeholder="e.g. Read 20 mins, cool room, ate dinner at 8pm..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white/[0.04] border rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
              style={{ borderColor: theme.border }}
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t flex items-center justify-end gap-3" style={{ borderColor: theme.border }}>
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
              className="px-5 py-2 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center gap-1.5"
              style={{
                backgroundColor: theme.accentPrimary,
                color: selectedPalette === 'duneSand' ? '#251403' : '#041F1A',
                boxShadow: `0 4px 16px ${theme.glowColor}`,
              }}
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
