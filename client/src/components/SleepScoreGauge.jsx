import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function SleepScoreGauge({ score = 85, label = 'Sleep Score' }) {
  const { theme } = useTheme();
  const safeScore = Math.min(100, Math.max(0, score || 0));
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  let strokeColor = theme.accentPrimary || '#2DD4BF';
  let statusText = 'Optimal Sleep';
  let statusBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

  if (safeScore < 60) {
    strokeColor = '#f43f5e';
    statusText = 'Sleep Deficit';
    statusBadge = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  } else if (safeScore < 75) {
    strokeColor = '#f59e0b';
    statusText = 'Fair Quality';
    statusBadge = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  } else if (safeScore < 88) {
    strokeColor = theme.accentPrimary || '#38bdf8';
    statusText = 'Good Recovery';
    statusBadge = 'border';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
          {/* Background Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Progress Ring */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={strokeColor}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${strokeColor}66)`,
            }}
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold tracking-tight text-white">
            {safeScore}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
            / 100
          </span>
        </div>
      </div>

      <div className="mt-2 flex flex-col items-center gap-1">
        <span
          className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusBadge}`}
          style={
            safeScore >= 75
              ? {
                  backgroundColor: theme.accentMuted,
                  color: theme.accentPrimary,
                  borderColor: theme.border,
                }
              : {}
          }
        >
          {statusText}
        </span>
        <span className="text-xs text-slate-400 font-medium">{label}</span>
      </div>
    </div>
  );
}
