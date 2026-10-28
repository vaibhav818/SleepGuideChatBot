import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSleep } from '../context/SleepContext';
import { analyticsAPI } from '../services/api';
import SleepScoreGauge from '../components/SleepScoreGauge';
import SleepTrendsChart from '../components/SleepTrendsChart';
import SoundscapePlayer from '../components/SoundscapePlayer';
import {
  Moon,
  Clock,
  Zap,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Coffee,
  CheckCircle2,
  Trash2,
  ArrowRight,
} from 'lucide-react';

export default function Dashboard({ onOpenLogModal, setActiveTab }) {
  const { user } = useAuth();
  const { logs, stats, deleteSleepLog, loading } = useSleep();
  const [trends, setTrends] = useState([]);
  const [audit, setAudit] = useState(null);

  useEffect(() => {
    async function loadTrends() {
      try {
        const [trendsRes, auditRes] = await Promise.all([
          analyticsAPI.getTrends(7),
          analyticsAPI.getAudit(),
        ]);
        if (trendsRes.success) setTrends(trendsRes.data || []);
        if (auditRes.success) setAudit(auditRes.audit || null);
      } catch (err) {
        console.warn('Analytics load error:', err.message);
      }
    }
    loadTrends();
  }, [logs]);

  const targetHours = user?.sleepProfile?.targetHours || 8;
  const latestLog = stats?.latestLog || logs[0];
  const currentScore = latestLog?.sleepScore || stats?.avgScore || 82;

  // Time of day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Hero Greeting & Quick Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-950/80 via-sleep-900 to-sleep-950 p-6 rounded-3xl border border-indigo-900/50 shadow-xl relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {user?.sleepProfile?.chronotype || 'Intermediate'} Chronotype
            </span>
            <span className="text-xs text-slate-400">Target: {targetHours} hrs/night</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {greeting}, {user?.name?.split(' ')[0] || 'Friend'} 🌙
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Your personalized circadian rhythm and sleep restoration telemetry. Connected to Gemini AI sleep science engine.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => setActiveTab('chat')}
            className="px-4 py-2.5 rounded-xl bg-sleep-800 hover:bg-sleep-700 text-indigo-300 border border-indigo-800/80 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Ask Sleep AI
          </button>
          <button
            onClick={onOpenLogModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-102 flex items-center gap-2"
          >
            <Moon className="w-4 h-4" />
            Log Last Night
          </button>
        </div>

        {/* Ambient glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Sleep Duration */}
        <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 border border-indigo-950 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Duration</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats?.avgDurationHours || 0}
              <span className="text-sm font-normal text-slate-400 ml-1">hrs</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs mt-1 text-slate-400">
              <span>Goal: {targetHours}h</span>
              <span className={stats?.avgDurationHours >= targetHours ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                ({stats?.avgDurationHours >= targetHours ? 'On Track' : `${(targetHours - (stats?.avgDurationHours || 0)).toFixed(1)}h deficit`})
              </span>
            </div>
          </div>
        </div>

        {/* KPI 2: Sleep Efficiency */}
        <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 border border-indigo-950 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Sleep Efficiency</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats?.sleepEfficiency || 88}
              <span className="text-sm font-normal text-slate-400 ml-1">%</span>
            </div>
            <p className="text-xs text-emerald-400 mt-1 font-medium">
              &gt;85% is clinically restorative
            </p>
          </div>
        </div>

        {/* KPI 3: Sleep Debt */}
        <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 border border-indigo-950 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">7-Day Sleep Debt</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats?.sleepDebtHours || 0}
              <span className="text-sm font-normal text-slate-400 ml-1">hrs</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {stats?.sleepDebtHours > 2 ? 'Recover with early bedtimes' : 'No significant debt'}
            </p>
          </div>
        </div>

        {/* KPI 4: Sleep Latency */}
        <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 border border-indigo-950 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Fall Asleep Time</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Moon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats?.avgLatency || 15}
              <span className="text-sm font-normal text-slate-400 ml-1">min</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Optimal window: 10 - 20 mins
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1-Col: Sleep Score Gauge & AI Audit Recommendation */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-5 border border-indigo-950 flex flex-col items-center">
            <h3 className="text-sm font-bold text-white mb-2 self-start flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Clinical Sleep Score
            </h3>
            <SleepScoreGauge score={currentScore} label="Last Logged Recovery Score" />
            
            {/* Quick breakdown metrics */}
            <div className="w-full mt-4 pt-4 border-t border-indigo-950 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-sleep-900/60 border border-indigo-950">
                <span className="text-slate-400 block text-[10px]">Morning Mood</span>
                <span className="font-bold text-indigo-300">{latestLog?.morningMood || 'Refreshed'}</span>
              </div>
              <div className="p-2 rounded-xl bg-sleep-900/60 border border-indigo-950">
                <span className="text-slate-400 block text-[10px]">Caffeine Cutoff</span>
                <span className="font-bold text-amber-400">{user?.sleepProfile?.caffeineCutoffHour || 14}:00</span>
              </div>
            </div>
          </div>

          {/* Soundscape player */}
          <SoundscapePlayer />
        </div>

        {/* Right 2-Cols: 7-Day Trend Chart & Recent Sleep Logs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trend Chart Card */}
          <div className="glass-card rounded-2xl p-5 border border-indigo-950">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400" /> 7-Day Sleep Duration Trend
                </h3>
                <p className="text-xs text-slate-400">Comparing nightly duration with your biological target</p>
              </div>
              <button
                onClick={() => setActiveTab('analytics')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                Full Analytics <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <SleepTrendsChart trends={trends} targetHours={targetHours} />
          </div>

          {/* AI Clinical Insights Pill */}
          {audit?.recommendations && audit.recommendations.length > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/90 via-sleep-900 to-indigo-950/80 border border-indigo-500/30 flex items-start gap-3 shadow-lg">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Gemini AI Clinical Advice • {audit.recommendations[0].title}
                  </h4>
                  <span className="px-1.5 py-0.2 text-[9px] font-extrabold rounded bg-indigo-500/30 text-indigo-300">
                    {audit.recommendations[0].priority} Priority
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {audit.recommendations[0].detail}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('chat')}
                className="shrink-0 text-xs text-indigo-400 hover:text-white font-semibold underline underline-offset-2"
              >
                Chat
              </button>
            </div>
          )}

          {/* Recent Sleep Sessions Table */}
          <div className="glass-card rounded-2xl p-5 border border-indigo-950">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-400" /> Recent Sleep Sessions
              </h3>
              <span className="text-xs text-slate-400">{logs.length} logged entries</span>
            </div>

            {logs.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No sleep sessions recorded yet. Click "Log Sleep" above to get started!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-indigo-950 text-slate-400 font-semibold">
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Schedule</th>
                      <th className="pb-2">Duration</th>
                      <th className="pb-2">Score</th>
                      <th className="pb-2">Latency</th>
                      <th className="pb-2">Mood</th>
                      <th className="pb-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-950/60">
                    {logs.slice(0, 5).map((log) => (
                      <tr key={log._id} className="hover:bg-sleep-800/40 transition-colors">
                        <td className="py-2.5 font-medium text-slate-200">
                          {new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="py-2.5 text-slate-400">
                          {log.bedtime} - {log.wakeTime}
                        </td>
                        <td className="py-2.5 font-semibold text-white">
                          {(log.durationMinutes / 60).toFixed(1)} hrs
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              (log.sleepScore || 70) >= 85
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : (log.sleepScore || 70) >= 70
                                ? 'bg-indigo-500/20 text-indigo-300'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {log.sleepScore || 75}/100
                          </span>
                        </td>
                        <td className="py-2.5 text-slate-400">
                          {log.sleepLatencyMinutes} min
                        </td>
                        <td className="py-2.5 text-slate-300 font-medium">
                          {log.morningMood}
                        </td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={() => deleteSleepLog(log._id)}
                            className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                            title="Delete log"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

