import React, { useState } from 'react';
import { Calendar, Moon, Zap } from 'lucide-react';

export default function SleepTrendsChart({ trends = [], targetHours = 8 }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!trends || trends.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-sleep-900/40 rounded-2xl border border-indigo-950">
        <Moon className="w-8 h-8 text-indigo-400 mb-2 animate-pulse" />
        <p className="text-sm font-semibold text-slate-300">No trend data available yet</p>
        <p className="text-xs text-slate-500 mt-1">Log your first sleep session to see 7-day sleep cycle patterns.</p>
      </div>
    );
  }

  const maxVal = Math.max(10, ...trends.map((t) => t.durationHours + 1));
  const height = 180;

  return (
    <div className="w-full flex flex-col">
      {/* Target reference line info */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-indigo-500 inline-block shadow-sm shadow-indigo-500/50"></span>
          <span>Sleep Duration (Hours)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-0.5 border-t border-dashed border-emerald-400 inline-block"></span>
          <span>Target: {targetHours} hrs</span>
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="relative h-48 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-indigo-950/80">
        {/* Target line */}
        <div
          className="absolute left-0 right-0 border-t-2 border-dashed border-emerald-500/40 pointer-events-none z-10"
          style={{
            bottom: `${(targetHours / maxVal) * 100}%`,
          }}
        >
          <span className="absolute -top-3.5 right-2 text-[10px] text-emerald-400 font-bold bg-sleep-950/90 px-1 rounded">
            Target {targetHours}h
          </span>
        </div>

        {/* Bars */}
        {trends.map((day, idx) => {
          const barHeightPct = Math.min(100, (day.durationHours / maxVal) * 100);
          const isTargetMet = day.durationHours >= targetHours - 0.2;
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip on hover */}
              {isHovered && (
                <div className="absolute -top-16 z-30 bg-sleep-900 border border-indigo-500/40 shadow-xl rounded-lg p-2 text-left whitespace-nowrap text-xs pointer-events-none">
                  <p className="font-bold text-white">{day.date} ({day.dayName})</p>
                  <p className="text-indigo-300 font-semibold">{day.durationHours} hrs • Score: {day.sleepScore}/100</p>
                  <p className="text-slate-400 text-[10px]">Latency: {day.sleepLatency}m | Mood: {day.qualityRating}/10</p>
                </div>
              )}

              {/* Bar */}
              <div
                className={`w-full max-w-[36px] rounded-t-lg transition-all duration-300 ${
                  isTargetMet
                    ? 'bg-gradient-to-t from-indigo-600 via-indigo-500 to-emerald-400 shadow-md shadow-emerald-500/10'
                    : 'bg-gradient-to-t from-indigo-950 via-indigo-700 to-indigo-500'
                } ${isHovered ? 'scale-y-105 brightness-125' : ''}`}
                style={{ height: `${barHeightPct}%` }}
              >
                {/* Score badge at top of bar */}
                <div className="w-full text-center -mt-5 text-[10px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  {day.durationHours}h
                </div>
              </div>

              {/* Label */}
              <span className="text-[11px] font-medium text-slate-400 mt-2">
                {day.dayName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

