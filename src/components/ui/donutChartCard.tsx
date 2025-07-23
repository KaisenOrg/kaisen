//Gráfico ilustrativo para ser aprimorado posteriormente

"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const progressValue = 22;
const progressMax = 25;
const progressPercent = (progressValue / progressMax) * 100;

export function DonutChartCard() {
  return (
    <Card className="w-full max-w-xs shadow-md rounded-2xl relative">
        <Image
            src="/geometric-bg.svg"
            alt=""
            width={80}
            height={80}
            aria-hidden="true"
            className="absolute left-0 bottom-0 w-32 h-24 z-0 pointer-events-none select-none overflow-hidden"
            draggable={false}
          />
      <CardHeader>
        <CardTitle className="text-base text-zinc-400 ">
          Accumulated Study Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-48 w-48 mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[{ value: 100 }]}
                innerRadius="75%"
                outerRadius="90%"
                stroke="none"
                fill="#D4D4D8"
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                cornerRadius={30}
              />

              <Pie
                data={[{ value: progressPercent }]}
                innerRadius="75%"
                outerRadius="90%"
                stroke="none"
                fill="#EA580C"
                dataKey="value"
                startAngle={90}
                endAngle={90 - (progressPercent * 360) / 100}
                cornerRadius={50}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Número central */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-semibold text-white">
              {progressValue}
            </span>
            <span className="text-sm text-white">minutes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
