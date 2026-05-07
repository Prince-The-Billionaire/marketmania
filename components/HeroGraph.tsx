"use client";
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMarketStore } from '../store/useStore';

const HeroGraph = () => {
  const activeMarket = useMarketStore((state) => state.activeMarket);

  if (!activeMarket) return null;

  return (
    <div className="flex-grow bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative">
      <div className="flex justify-between items-start mb-8">
        <div className="max-w-md">
          <span className="text-purple-500 text-[10px] font-black uppercase tracking-widest mb-1 block">{activeMarket.category}</span>
          <h2 className="text-3xl font-black text-slate-900 leading-tight">{activeMarket.title}</h2>
        </div>
        <div className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xl font-black">
          {activeMarket.probability}%
        </div>
      </div>

      <div className="h-[340px] w-full relative">
        {/* Numerical Volume Bottom-Left */}
        <div className="absolute bottom-4 left-2 z-10">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Market Volume</p>
          <p className="text-4xl font-black text-slate-900 tracking-tighter">₦{activeMarket.volume.toLocaleString()}</p>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={activeMarket.history}>
            <defs>
              <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333ea" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" hide />
            <YAxis domain={[0, 100]} hide />
            <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.05)' }} />
            <Area type="monotone" dataKey="yes" stroke="#9333ea" strokeWidth={4} fill="url(#chartColor)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HeroGraph;