"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { RadialBarChart, RadialBar, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";

export function ChartRadialLabel({ data }) {
  return (
    <Card className="flex flex-col h-[340px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Weekly Rides</CardTitle>
        <CardDescription>This Week</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex justify-center items-center">
        <RadialBarChart
          width={250}
          height={250}
          cx="50%"
          cy="50%"
          
          innerRadius={30}
          outerRadius={110}
          data={data}
          startAngle={90}
          endAngle={450}
        >
          <RadialBar
            minAngle={15}
            dataKey="rides"
            fill="#2b7fff"
            label={{ fill: '#7f1d1d', position: 'insideStart' }}
            background
          />
          {/* Tooltip added for hover */}
          <Tooltip formatter={(value, name, props) => `${props.payload.day}: ${value} rides`} />
        </RadialBarChart>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this week <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total rides for each day of the week
        </div>
      </CardFooter>
    </Card>
  );
}
