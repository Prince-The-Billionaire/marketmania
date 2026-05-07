"use client";
import { ComposedChart, Area, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { time: '12:00', yes: 40, no: 60, volume: 400 },
  { time: '13:00', yes: 45, no: 55, volume: 600 },
  { time: '14:00', yes: 35, no: 65, volume: 800 },
  { time: '15:00', yes: 55, no: 45, volume: 1200 },
  { time: '16:00', yes: 72, no: 28, volume: 2100 },
];

export default function AdvancedDualChart() {
  return (
    <div className="h-[450px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="colorYes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#f4f4f5" />
          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#a1a1aa', fontSize: 12}} dy={10} />
          <YAxis domain={[0, 100]} hide />
          <YAxis yAxisId="volume" hide />
          <Tooltip 
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
          />
          
          <Area 
            type="monotone" 
            dataKey="yes" 
            stroke="#7c3aed" 
            strokeWidth={4} 
            fillOpacity={1} 
            fill="url(#colorYes)" 
          />
          <Area 
            type="monotone" 
            dataKey="no" 
            stroke="#d4d4d8" 
            strokeWidth={2} 
            fill="transparent" 
            strokeDasharray="5 5"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}