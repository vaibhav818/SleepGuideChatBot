import React, { useState, useEffect } from 'react';
import { useSleep } from '../context/SleepContext';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI } from '../services/api';
import SleepTrendsChart from '../components/SleepTrendsChart';
import {
  BarChart3,
  Award,
  Zap,
  TrendingDown,
  Clock,
  Coffee,
  ShieldCheck,
  AlertCircle,
  Trash2,
} from 'lucide-react';

export default function Analytics() {
  const { logs, stats, deleteSleepLog } = useSleep();
  const { user } = useAuth();
  const [trends, setTrends] = useState([]);
  const [audit, setAudit] = useState(null);
  const [timeRange, setTimeRange] = useState(7);

  useEffect(() => {
    async function loadData() {
      try {
        const [trendsRes, auditRes] = await Promise.all([
          analyticsAPI.getTrends(timeRange),
          analyticsAPI.getAudit(),
        ]);
        if (trendsRes.success) setTrends(trendsRes.data || []);
        if (auditRes.success) setAudit(auditRes.audit || null);
      } catch (err) {
        console.warn('Analytics loading error:', err.message);
      }
    }
    loadData();
  }, [timeRange, logs]);

  const targetHours = user?.sleepProfile?.targetHours || 8;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" /> Sleep Architecture Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Clinical metrics, circadian regularity, and sleep debt auditing
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-1 bg-sleep-900 p-1 rounded-xl border border-indigo-950">
          <button
            onClick={() => setTimeRange(7)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              timeRange === 7
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange(14)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              timeRange === 14
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            14 Days
          </button>
        </div>
      </div>

      {/* Audit Banner Card */}
      <div className="glass-card rounded-3xl p-6 border border-indigo-950 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        {/* Grade Badge */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-indigo-950 to-sleep-900 border border-indigo-900/60 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Clinical Sleep Grade
          </span>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-sleep-950 font-black text-3xl flex items-center justify-center shadow-lg shadow-emerald-500/30 my-1">
            {audit?.grade || 'A-'}
          </div>
          <span className="text-xs font-semibold text-emerald-400 mt-1">
            PSQI Standard
          </span>
        </div>

        {/* Metric 1: Regularity Score */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-indigo-400" /> Sleep Regularity Index (SRI)
          </div>
          <div className="text-2xl font-extrabold text-white">
            {audit?.regularityScore || 92}
            <span className="text-sm font-normal text-slate-400 ml-1">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Bedtime consistency within ±{audit?.bedStdDevMinutes || 24} min
          </p>
        </div>

        {/* Metric 2: Sleep Debt */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <TrendingDown className="w-3.5 h-3.5 text-amber-400" /> Accumulated Sleep Debt
          </div>
          <div className="text-2xl font-extrabold text-white">
            {audit?.sleepDebtHours || 0}
            <span className="text-sm font-normal text-slate-400 ml-1">hours</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Against your {targetHours}h nightly target
          </p>
        </div>

        {/* Metric 3: Chronotype alignment */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Award className="w-3.5 h-3.5 text-dream-purple" /> Chronotype Profile
          </div>
          <div className="text-lg font-bold text-white">
            {user?.sleepProfile?.chronotype || 'Intermediate'}
          </div>
          <p className="text-[11px] text-slate-400">
            Optimal sleep window: 11:30 PM - 7:30 AM
          </p>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="glass-card rounded-2xl p-6 border border-indigo-950">
        <h3 className="text-base font-bold text-white mb-1">
          Nightly Duration vs. Target Baseline ({timeRange} Days)
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Hover over bars to view latency, morning mood, and Pittsburgh sleep score
        </p>
        <SleepTrendsChart trends={trends} targetHours={targetHours} />
      </div>

      {/* Clinical Recommendations & Correlation insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommendations */}
        <div className="glass-card rounded-2xl p-6 border border-indigo-950 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Clinical Action Plan
          </h3>
          <div className="space-y-2.5">
            {audit?.recommendations?.map((rec, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-sleep-900/80 border border-indigo-950 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{rec.title}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    {rec.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{rec.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Correlation factors */}
        <div className="glass-card rounded-2xl p-6 border border-indigo-950 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Sleep Latency & Lifestyle Factors
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-sleep-900/80 border border-indigo-950 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <Coffee className="w-4 h-4 text-amber-400" />
                <span>Caffeine Cutoff Rule</span>
              </div>
              <span className="font-bold text-white">
                {user?.sleepProfile?.caffeineCutoffHour || 14}:00 PM
              </span>
            </div>

            <div className="p-3 rounded-xl bg-sleep-900/80 border border-indigo-950 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Average Sleep Latency</span>
              </div>
              <span className="font-bold text-emerald-400">
                {stats?.avgLatency || 15} minutes
              </span>
            </div>

            <div className="p-3 rounded-xl bg-sleep-900/80 border border-indigo-950 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300">
                <AlertCircle className="w-4 h-4 text-indigo-400" />
                <span>Average Night Awakenings</span>
              </div>
              <span className="font-bold text-white">
                {stats?.avgAwakenings || 0.4} per night
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Log History */}
      <div className="glass-card rounded-2xl p-6 border border-indigo-950">
        <h3 className="text-sm font-bold text-white mb-3">All Recorded Sleep Sessions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-indigo-950 text-slate-400 font-semibold">
                <th className="pb-3">Date</th>
                <th className="pb-3">Bedtime - Wake</th>
                <th className="pb-3">Duration</th>
                <th className="pb-3">Latency</th>
                <th className="pb-3">Quality</th>
                <th className="pb-3">Score</th>
                <th className="pb-3">Mood</th>
                <th className="pb-3">Caffeine</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-950/60">
              {logs.map((l) => (
                <tr key={l._id} className="hover:bg-sleep-800/40 transition-colors">
                  <td className="py-3 font-medium text-slate-200">
                    {new Date(l.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 text-slate-400">{l.bedtime} - {l.wakeTime}</td>
                  <td className="py-3 font-bold text-white">{(l.durationMinutes / 60).toFixed(1)}h</td>
                  <td className="py-3 text-slate-400">{l.sleepLatencyMinutes}m</td>
                  <td className="py-3 text-indigo-300 font-semibold">{l.qualityRating}/10</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-indigo-500/20 text-indigo-300">
                      {l.sleepScore || 75}/100
                    </span>
                  </td>
                  <td className="py-3 text-slate-300">{l.morningMood}</td>
                  <td className="py-3 text-slate-400">{l.caffeineCups || 0} cups</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => deleteSleepLog(l._id)}
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
      </div>
    </div>
  );
}
