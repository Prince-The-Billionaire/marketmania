"use client";
import React, { useState } from 'react';
import { useMarketStore } from '../store/useStore';

const PlaceOrder = () => {
  const { activeMarket, placeTrade, userBalance, buyMoreCoins } = useMarketStore();
  const [outcome, setOutcome] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState<number>(2500);

  if (!activeMarket) {
    return (
      <div className="w-full lg:w-[380px] bg-white p-8 rounded-[2.5rem] border border-slate-100 text-center text-slate-400 font-bold">
        Select a market below to begin trading
      </div>
    );
  }

  // Visual pricing estimates based on current pool metrics
  const poolTotal = activeMarket.yesSharesPool + activeMarket.noSharesPool;
  const rawYesPrice = activeMarket.noSharesPool / poolTotal;
  const currentSharePrice = outcome === 'yes' ? rawYesPrice : (1 - rawYesPrice);

  // Approximate shares user gets (incorporating average slip margin)
  const estimatedShares = amount / currentSharePrice;

  const handleTradeSubmit = () => {
    if (amount > userBalance) {
      alert("You don't have enough tokens!");
      return;
    }
    const result = placeTrade(amount, outcome);
    alert(result.message);
  };

  return (
    <div className="w-full lg:w-[380px] bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
      {/* Balance Indicator & Topup Action */}
      <div className="flex justify-between items-center mb-6 px-2">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase">Your Wallet</p>
          <p className="text-xl font-black text-slate-900">₦{userBalance.toLocaleString()}</p>
        </div>
        {userBalance < 500 && (
          <button 
            onClick={() => buyMoreCoins(25000)}
            className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs font-black rounded-xl transition-all"
          >
            + Refill Wallet
          </button>
        )}
      </div>

      {/* Outcome Selectors */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
        <button
          onClick={() => setOutcome('yes')}
          className={`flex-1 py-4 text-xs font-black rounded-xl transition-all ${
            outcome === 'yes' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400'
          }`}
        >
          YES {(rawYesPrice * 100).toFixed(0)}¢
        </button>
        <button
          onClick={() => setOutcome('no')}
          className={`flex-1 py-4 text-xs font-black rounded-xl transition-all ${
            outcome === 'no' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-400'
          }`}
        >
          NO {((1 - rawYesPrice) * 100).toFixed(0)}¢
        </button>
      </div>

      {/* Order Sizing input */}
      <div className="mb-6">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">
          Investment Amount
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount || ''}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-black text-2xl outline-none focus:border-purple-600 transition-all"
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-slate-300">₦</span>
        </div>
      </div>

      {/* Payout Display Matrix */}
      <div className="bg-slate-50 p-6 rounded-3xl mb-6 border border-slate-100 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-500">Average Share Cost</span>
          <span className="text-sm font-black text-slate-700">
            ₦{(currentSharePrice).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center border-t border-slate-200/60 pt-3">
          <span className="text-xs font-bold text-slate-500">Estimated Payout (If Win)</span>
          <span className={`text-xl font-black ${outcome === 'yes' ? 'text-emerald-600' : 'text-rose-600'}`}>
            ₦{Math.round(estimatedShares).toLocaleString()}
          </span>
        </div>
      </div>

      <button 
        onClick={handleTradeSubmit}
        className={`w-full py-5 rounded-2xl font-black text-lg text-white shadow-xl active:scale-95 transition-all ${
          outcome === 'yes' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
        }`}
      >
        Buy {outcome.toUpperCase()} Positions
      </button>
    </div>
  );
};

export default PlaceOrder;