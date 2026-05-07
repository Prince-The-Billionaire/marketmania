"use client";
import React, { useState } from 'react';
import { useMarketStore } from '../store/useStore';

const PlaceOrder = () => {
  const { activeMarket, placeTrade } = useMarketStore();
  const [outcome, setOutcome] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState(2500);

  if (!activeMarket) return null;

  const currentProb = outcome === 'yes' ? activeMarket.probability : (100 - activeMarket.probability);
  const payout = (amount * 0.97) / (currentProb / 100); // 3% fee

  return (
    <div className="w-full lg:w-[380px] bg-white p-8 rounded-[2.5rem] border border-slate-100">
      <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
        <button
          onClick={() => setOutcome('yes')}
          className={`flex-1 py-4 text-xs font-black rounded-xl transition-all ${
            outcome === 'yes' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400'
          }`}
        >
          YES {activeMarket.probability}%
        </button>
        <button
          onClick={() => setOutcome('no')}
          className={`flex-1 py-4 text-xs font-black rounded-xl transition-all ${
            outcome === 'no' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400'
          }`}
        >
          NO {(100 - activeMarket.probability).toFixed(1)}%
        </button>
      </div>

      <div className="mb-6">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Investment</label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-black text-2xl outline-none focus:border-purple-600 transition-all"
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-slate-300">₦</span>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-3xl mb-8 border border-slate-100">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-slate-500">Return Potential</span>
          <span className={`text-2xl font-black ${outcome === 'yes' ? 'text-emerald-600' : 'text-rose-600'}`}>
            ₦{payout.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>

      <button 
        onClick={() => placeTrade(amount, outcome)}
        className={`w-full py-5 rounded-2xl font-black text-lg text-white shadow-xl active:scale-95 transition-all ${
          outcome === 'yes' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
        }`}
      >
        Confirm {outcome.toUpperCase()} Position
      </button>
    </div>
  );
};

export default PlaceOrder;