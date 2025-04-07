"use client"

import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { day: "Mon", quality: 72, duration: 6.8 },
  { day: "Tue", quality: 68, duration: 6.5 },
  { day: "Wed", quality: 75, duration: 7.2 },
  { day: "Thu", quality: 80, duration: 7.5 },
  { day: "Fri", quality: 78, duration: 7.3 },
  { day: "Sat", quality: 82, duration: 7.8 },
  { day: "Sun", quality: 85, duration: 7.7 },
]

export default function SleepQualityChart() {
  return (
    <ChartContainer className="h-[300px]">
      <Chart>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" />
            <YAxis yAxisId="left" domain={[0, 100]} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="quality"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ r: 4, fill: "#8b5cf6" }}
              activeDot={{ r: 6, fill: "#8b5cf6" }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="duration"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4, fill: "#3b82f6" }}
              activeDot={{ r: 6, fill: "#3b82f6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Chart>
    </ChartContainer>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <ChartTooltip>
        <ChartTooltipContent>
          <div className="font-medium">{label}</div>
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-purple-600 mr-1" />
            <span>Quality: {payload[0].value}%</span>
          </div>
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-blue-600 mr-1" />
            <span>Duration: {payload[1].value} hours</span>
          </div>
        </ChartTooltipContent>
      </ChartTooltip>
    )
  }
  return null
}

