"use client";
import React, { useState, useRef, useEffect } from 'react';
import { User, Search, PlusCircle, Coins, X, Briefcase, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useMarketStore, getLivePositionValue } from '../store/useStore';

const Navbar: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);

  const shopRef = useRef<HTMLDivElement | null>(null);
  const portfolioRef = useRef<HTMLDivElement | null>(null);

  const { userBalance, buyMoreCoins, userPositions, contracts } = useMarketStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) setShowShop(false);
      if (portfolioRef.current && !portfolioRef.current.contains(e.target as Node)) setShowPortfolio(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ZCurrency = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 6L5 18H19" />
      <path d="M5 6H19L5 18" />
      <line x1="12" y1="3" x2="12" y2="21" />
    </svg>
  );

  const coinPackages = [
    { label: 'Starter Pack', coins: 5000, price: '₦500' },
    { label: 'Pro Trader', coins: 15000, price: '₦1,200', popular: true },
    { label: 'Whale Tier', coins: 50000, price: '₦3,500' },
  ];

  const activePositionsArray = Object.values(userPositions).filter((p) => p.yesShares > 0 || p.noShares > 0);

  return (
    <nav className="sticky top-5 z-50 mx-auto w-full max-w-[90vw] rounded-2xl border border-slate-200/60 bg-white/70 px-4 py-3 shadow-xl backdrop-blur-xl sm:px-6">
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/" className="text-slate-900 font-black text-lg tracking-tighter sm:text-xl">
            MM <span className="font-light opacity-60 uppercase text-[10px] tracking-[0.25em] ml-1">Marketmania</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <button onClick={() => setShowPortfolio(true)} className="text-slate-600 hover:text-purple-600 text-sm font-semibold">
              Portfolio ({activePositionsArray.length})
            </button>
            <Link href="/admin" className="text-slate-600 hover:text-purple-600 text-sm font-semibold">Admin</Link>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:w-auto sm:justify-end">
          <div className="relative flex-1 min-w-0 sm:max-w-[260px]">
            <Search className={`absolute left-3 top-2 w-4 h-4 text-purple-600 ${isHovered ? 'scale-110' : 'scale-100'}`} />
            <input
              onFocus={() => setIsHovered(true)}
              onBlur={() => setIsHovered(false)}
              type="text"
              placeholder="who will win....."
              className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-100/60 py-2 pl-10 pr-4 text-sm outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative" ref={portfolioRef}>
              <button
                onClick={() => { setShowPortfolio((v) => !v); setShowShop(false); }}
                className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 ${
                  activePositionsArray.length > 0 ? 'bg-purple-50 text-purple-600 border-purple-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Briefcase className="w-5 h-5" />
                {activePositionsArray.length > 0 && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
              </button>

              {showPortfolio && (
                <div className="absolute right-0 mt-3 w-[min(90vw,24rem)] bg-white border border-slate-100 rounded-3xl shadow-2xl p-5 z-50 max-h-[32rem] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      <h4 className="text-base font-black text-slate-800">Active Positions</h4>
                    </div>
                    <button onClick={() => setShowPortfolio(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                  </div>

                  {activePositionsArray.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <p className="text-sm font-bold text-slate-400">No active positions yet.</p>
                      <p className="text-xs text-slate-300 mt-1">Place bets on live contracts to track your returns here!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activePositionsArray.map((pos) => {
                        const contract = contracts.find((c) => c.id === pos.contractId);
                        if (!contract) return null;
                        const { totalValue, yesPrice, noPrice } = getLivePositionValue(pos, contract);
                        return (
                          <div key={pos.contractId} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-2">
                            <p className="text-xs font-black text-slate-800 line-clamp-1">{contract.title}</p>

                            <div className="flex justify-between items-end pt-1">
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Your Holding</span>
                                {pos.yesShares > 0 && <span className="text-xs font-black text-emerald-600">{Math.round(pos.yesShares).toLocaleString()} YES Shares (at {(yesPrice * 100).toFixed(0)}¢)</span>}
                                {pos.noShares > 0 && <span className="text-xs font-black text-rose-600">{Math.round(pos.noShares).toLocaleString()} NO Shares (at {(noPrice * 100).toFixed(0)}¢)</span>}
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Live Value</span>
                                <span className="text-sm font-black text-slate-900">₦{Math.round(totalValue).toLocaleString()}</span>
                              </div>
                            </div>

                            <div className="flex justify-between text-[9px] font-bold text-slate-400 border-t border-slate-200/50 pt-2 mt-1">
                              <span>Invested: ₦{pos.totalInvested.toLocaleString()}</span>
                              <span className={totalValue >= pos.totalInvested ? 'text-emerald-500' : 'text-rose-500'}>
                                {totalValue >= pos.totalInvested ? '↑ Profit' : '↓ Loss'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative" ref={shopRef}>
              <button onClick={() => { setShowShop((v) => !v); setShowPortfolio(false); }} className="flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-1.5 shadow-md transition-all text-white">
                <span className="text-white font-bold text-xs">{userBalance.toLocaleString()}</span>
                <div className="text-white/90"><ZCurrency /></div>
                <PlusCircle className="w-3.5 h-3.5 text-purple-200" />
              </button>

              {showShop && (
                <div className="absolute right-0 mt-3 w-[min(90vw,22rem)] bg-white border border-slate-100 rounded-3xl shadow-2xl p-5 z-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-purple-600" />
                      <h4 className="text-sm font-black text-slate-800">Buy Coins</h4>
                    </div>
                    <button onClick={() => setShowShop(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                  </div>

                  <div className="space-y-2.5">
                    {coinPackages.map((pkg) => (
                      <button key={pkg.label} onClick={() => { buyMoreCoins(pkg.coins); alert(`Successfully added ₦${pkg.coins.toLocaleString()} Coins.`); setShowShop(false); }} className={`w-full text-left p-3 rounded-2xl border ${pkg.popular ? 'bg-purple-50 border-purple-200' : 'bg-slate-50 border-slate-100'}`}>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{pkg.label}</p>
                          <p className="text-sm font-black text-purple-600">+{pkg.coins.toLocaleString()} Coins</p>
                        </div>
                        <div className="bg-white border border-slate-200 px-2.5 py-1 rounded-xl text-xs font-black text-slate-700">{pkg.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all border border-slate-200">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;