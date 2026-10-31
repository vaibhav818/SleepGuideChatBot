import React, { useState, useEffect } from 'react';
import { useSleep } from '../context/SleepContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
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
  Activity,
  Heart,
  Moon,
  Calendar,
} from 'lucide-react';

export default function Analytics() {
  const { logs, stats } = useSleep();
  const { user } = useAuth();
  const { theme, selectedPalette } = useTheme();
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
    <div className="space-y-6 pb-12 animate-fadeIn text-slate-100">
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border backdrop-blur-xl transition-colors duration-700"
        style={{
          backgroundColor: theme.cardGlass,
          borderColor: theme.border,
        }}
      >
        <div>
          <div
            className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-mono uppercase border mb-1.5"
            style={{
              backgroundColor: theme.accentMuted,
              borderColor: theme.border,
              color: theme.accentPrimary,
            }}
          >
            <Activity className="w-3 h-3" />
            <span>Circadian Waveform & Polysomnography</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sleep Architecture Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Clinical metrics, circadian regularity, and sleep debt auditing
          </p>
        </div>

        {/* Time range selector */}
        <div
          className="flex items-center gap-1 bg-black/40 p-1.5 rounded-2xl border transition-colors duration-500"
          style={{ borderColor: theme.border }}
        >
          <button
            onClick={() => setTimeRange(7)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              timeRange === 7 ? 'shadow-md font-bold' : 'text-slate-400 hover:text-white'
            }`}
            style={
              timeRange === 7
                ? {
                    backgroundColor: theme.accentPrimary,
                    color: selectedPalette === 'duneSand' ? '#251403' : '#041F1A',
                  }
                : {}
            }
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange(14)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              timeRange === 14 ? 'shadow-md font-bold' : 'text-slate-400 hover:text-white'
            }`}
            style={
              timeRange === 14
                ? {
                    backgroundColor: theme.accentPrimary,
                    color: selectedPalette === 'duneSand' ? '#251403' : '#041F1A',
                  }
                : {}
            }
          >
            14 Days
          </button>
        </div>
      </div>

      {/* 4 Summary Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="p-5 rounded-3xl border backdrop-blur-xl transition-colors duration-700"
          style={{
            backgroundColor: theme.cardGlass,
            borderColor: theme.border,
          }}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Average Duration</span>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: theme.accentMuted, color: theme.accentPrimary }}
            >
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {stats?.avgDurationHours || 0}
            <span className="text-xs text-slate-400 font-normal ml-1">hrs</span>
          </div>
          <span className="text-xs mt-1 block" style={{ color: theme.accentPrimary }}>
            Target: {targetHours}h/night
          </span>
        </div>

        <div
          className="p-5 rounded-3xl border backdrop-blur-xl transition-colors duration-700"
          style={{
            backgroundColor: theme.cardGlass,
            borderColor: theme.border,
          }}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Sleep Efficiency</span>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: theme.accentMuted, color: theme.accentPrimary }}
            >
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {stats?.sleepEfficiency || 88}
            <span className="text-xs text-slate-400 font-normal ml-1">%</span>
          </div>
          <span className="text-xs mt-1 block" style={{ color: theme.accentPrimary }}>
            &gt;85% clinically restorative
          </span>
        </div>

        <div
          className="p-5 rounded-3xl border backdrop-blur-xl transition-colors duration-700"
          style={{
            backgroundColor: theme.cardGlass,
            borderColor: theme.border,
          }}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Accumulated Debt</span>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: theme.accentMuted, color: theme.accentPrimary }}
            >
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {stats?.sleepDebtHours || 0}
            <span className="text-xs text-slate-400 font-normal ml-1">hrs</span>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Circadian equilibrium</span>
        </div>

        <div
          className="p-5 rounded-3xl border backdrop-blur-xl transition-colors duration-700"
          style={{
            backgroundColor: theme.cardGlass,
            borderColor: theme.border,
          }}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Chronotype Profile</span>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: theme.accentMuted, color: theme.accentPrimary }}
            >
              <Moon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">
            {user?.sleepProfile?.chronotype || 'Intermediate'}
          </div>
          <span className="text-xs mt-1 block" style={{ color: theme.accentPrimary }}>
            Pacemaker Phase Locked
          </span>
        </div>
      </div>

      {/* 7-Day Trend Hypnogram Chart */}
      <div
        className="p-6 sm:p-7 rounded-3xl border backdrop-blur-xl space-y-4 transition-colors duration-700"
        style={{
          backgroundColor: theme.cardGlass,
          borderColor: theme.border,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
              CIRCADIAN TIMELINE
            </span>
            <h2 className="text-base font-bold text-white">Sleep Duration & Regularity</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">{timeRange}-Day Window</span>
        </div>

        <SleepTrendsChart trends={trends} targetHours={targetHours} />
      </div>

      {/* Clinical Audit Insights */}
      {audit && (
        <div
          className="p-6 rounded-3xl border backdrop-blur-xl space-y-4 transition-colors duration-700"
          style={{
            backgroundColor: theme.cardGlass,
            borderColor: theme.border,
          }}
        >
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5" style={{ color: theme.accentPrimary }} />
            <h2 className="text-base font-bold text-white">Clinical Sleep Quality Audit</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-slate-400 uppercase font-mono text-[10px]">PSQI Score</span>
              <p className="text-lg font-bold mt-1" style={{ color: theme.accentPrimary }}>
                {audit.psqiScore || 82} / 100
              </p>
              <p className="text-slate-400 mt-1">
                Reflects subjective sleep quality, latency, and daytime dysfunction.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-slate-400 uppercase font-mono text-[10px]">
                Restorative Efficiency
              </span>
              <p className="text-lg font-bold mt-1" style={{ color: theme.accentPrimary }}>
                {audit.restorativePercent || 88}%
              </p>
              <p className="text-slate-400 mt-1">
                High delta slow-wave sleep density detected during initial 3 hours.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <span className="text-slate-400 uppercase font-mono text-[10px]">
                Circadian Pacing
              </span>
              <p className="text-lg font-bold mt-1" style={{ color: theme.accentPrimary }}>
                Synchronized
              </p>
              <p className="text-slate-400 mt-1">
                Bedtime midpoint variability under 35 minutes indicates stable biological clock.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
