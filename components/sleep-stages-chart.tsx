"use client"

import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

const data = [
  { name: "Deep Sleep", value: 20, color: "#8b5cf6" },
  { name: "REM Sleep", value: 25, color: "#3b82f6" },
  { name: "Light Sleep", value: 45, color: "#a78bfa" },
  { name: "Awake", value: 10, color: "#e5e7eb" },
]

export default function SleepStagesChart() {
  return (
    <ChartContainer className="h-[300px]">
      <Chart>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              formatter={(value, entry, index) => <span className="text-sm">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </Chart>
    </ChartContainer>
  )
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <ChartTooltip>
        <ChartTooltipContent>
          <div className="font-medium">{payload[0].name}</div>
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full mr-1" style={{ backgroundColor: payload[0].payload.color }} />
            <span>{payload[0].value}%</span>
          </div>
          <div className="text-xs text-muted-foreground">{getStageDescription(payload[0].name)}</div>
        </ChartTooltipContent>
      </ChartTooltip>
    )
  }
  return null
}

function getStageDescription(stageName) {
  switch (stageName) {
    case "Deep Sleep":
      return "Restorative sleep that helps memory and learning"
    case "REM Sleep":
      return "Dream state important for cognitive function"
    case "Light Sleep":
      return "Transition between deep and REM sleep"
    case "Awake":
      return "Brief periods of wakefulness during the night"
    default:
      return ""
  }
}

