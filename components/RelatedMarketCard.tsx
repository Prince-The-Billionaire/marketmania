"use client";
import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function RelatedMarketCard({ title, vol, price }: { title: string, vol: string, price: number }) {
  return (
    <div className="group bg-white p-4 rounded-2xl border border-zinc-200 hover:border-violet-300 transition-all cursor-pointer">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-sm leading-tight group-hover:text-violet-600 transition-colors">{title}</h4>
        <TrendingUp className="w-3 h-3 text-green-500" />
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] text-zinc-400 font-bold uppercase">Volume</p>
          <p className="text-xs font-bold">{vol}⚡</p>
        </div>
        <div className="bg-violet-50 text-violet-600 px-3 py-1 rounded-lg text-xs font-black">
          {price}%
        </div>
      </div>
    </div>
  );
}