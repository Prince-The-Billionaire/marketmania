"use client";
import React, { useState } from 'react';

export default function TradeSidebar({ yesPrice = 72 }) {
  const [amount, setAmount] = useState<string>('');
  const [side, setSide] = useState<'YES' | 'NO'>('YES');

  const currentPrice = side === 'YES' ? yesPrice : 100 - yesPrice;
  const potentialShares = amount ? (Number(amount) / (currentPrice / 100)).toFixed(2) : '0.00';
  const potentialProfit = amount ? (Number(potentialShares) - Number(amount)).toFixed(2) : '0.00';

  return (
    <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm space-y-6">
      <div className="flex bg-zinc-100 p-1 rounded-2xl">
        <button 
          onClick={() => setSide('YES')}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${side === 'YES' ? 'bg-white shadow-sm text-violet-600' : 'text-zinc-500'}`}
        >Yes</button>
        <button 
          onClick={() => setSide('NO')}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${side === 'NO' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500'}`}
        >No</button>
      </div>

      <div>
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Amount to Trade</label>
        <div className="relative mt-2">
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-4 px-5 text-2xl font-black focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-zinc-400">⚡</span>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-zinc-500">Price per share</span>
          <span>{currentPrice}⚡</span>
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span className="text-zinc-500">Estimated Shares</span>
          <span className="text-zinc-900">{potentialShares}</span>
        </div>
        <div className="flex justify-between text-lg font-black pt-2 border-t border-zinc-100">
          <span>Max Payout</span>
          <span className="text-green-600">{amount ? potentialShares : '0.00'} ⚡</span>
        </div>
        <p className="text-[10px] text-center text-zinc-400 font-medium">Potential Profit: {potentialProfit} Zap Points</p>
      </div>

      <button className="w-full bg-violet-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-violet-700 transition-all shadow-xl shadow-violet-200 active:scale-[0.98]">
        Place Order
      </button>
    </div>
  );
}