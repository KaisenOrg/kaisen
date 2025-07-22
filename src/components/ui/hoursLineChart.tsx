//Chart ilustrativo para ser aprimorado posteriormente

"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { name: "JAN", value: 4.2 },
  { name: "FEB", value: 7.5 },
  { name: "MAR", value: 12.1 },
  { name: "APR", value: 9.3 },
  { name: "MAY", value: 15.8 },
  { name: "JUN", value: 20.2 },
  { name: "JUL", value: 18.0 },
  { name: "AGO", value: 22.5 },
  { name: "SEP", value: 17.3 },
  { name: "OCT", value: 23.4 },
  { name: "NOV", value: 19.7 },
  { name: "DEC", value: 25.0 },
];

export function HoursLineChart() {
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-md rounded-2xl">
      <CardHeader>
        <CardTitle className="text-2xl text-muted-foreground font-light">Productivities</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid
              stroke="#e5e7eb"
              strokeDasharray="0" 
              vertical={false} 
            />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis
              stroke="#888"
              tickFormatter={(value) => `${value}h`}
              ticks={[0, 5, 10, 15, 20, 25]}
              domain={[0, 25]}
            />
            <Tooltip
              formatter={(value: number) => `${value.toFixed(2)} hours`}
              labelStyle={{ color: "white", fontWeight: "500" }}
              itemStyle={{ color: "white" }}
              contentStyle={{
                backgroundColor: "#71717A",
                borderColor: "#ddd",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
              }}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#F97316"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
