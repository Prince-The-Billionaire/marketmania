"use client";
import React, { useState, useRef, useEffect } from 'react';
import { User, Search, PlusCircle, Coins, CreditCard, X, Briefcase, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useMarketStore, getLivePositionValue } from '../store/useStore';

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);
  
  const shopRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  
  // Connect store states
  const { userBalance, buyMoreCoins, userPositions, contracts } = useMarketStore();

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shopRef.current && !shopRef.current.contains(event.target as Node)) setShowShop(false);
      if (portfolioRef.current && !portfolioRef.current.contains(event.target as Node)) setShowPortfolio(false);
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
    { label: "Starter Pack", coins: 5000, price: "₦500" },
    { label: "Pro Trader", coins: 15000, price: "₦1,200", popular: true },
    { label: "Whale Tier", coins: 50000, price: "₦3,500" },
  ];

  // Turn active user positions into an array with live data appended
  const activePositionsArray = Object.values(userPositions).filter(
    (pos) => pos.yesShares > 0 || pos.noShares > 0
  );

  return (
    <nav className="sticky top-5 mx-auto w-[90vw] z-50 flex items-center justify-between px-8 py-3 bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl">
      <div className="shrink-0">
        <Link href="/" className="text-slate-900 font-black text-xl tracking-tighter">
          MM <span className="font-light opacity-60 uppercase text-xs tracking-[0.2em] ml-1">Marketmania</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-10">
        <button onClick={() => setShowPortfolio(true)} className="text-slate-600 hover:text-purple-600 transition-all text-sm font-semibold cursor-pointer">
          Portfolio ({activePositionsArray.length})
        </button>
        <Link href="/admin" className="text-slate-600 hover:text-purple-600 text-sm font-semibold">Admin</Link>
      </div>

      <div className="flex items-center gap-4 relative">
        {/* Search Engine Layout */}
        <div className="relative flex items-center group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <Search className={`absolute left-3 w-4 h-4 text-purple-600 transition-transform ${isHovered ? 'scale-110' : 'scale-100'}`} />
          <input 
            type="text" placeholder="who will win....."
            className="bg-slate-100/50 border border-slate-200 pl-10 pr-4 py-2 rounded-xl text-sm w-40 focus:w-60 transition-all outline-none"
          />
        </div>

        {/* --- PORTFOLIO POSITION MODAL TRIGGER --- */}
        <div className="relative" ref={portfolioRef}>
          <button 
            onClick={() => { setShowPortfolio(!showPortfolio); setShowShop(false); }}
            className={`p-2 rounded-xl transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
              activePositionsArray.length > 0 
                ? 'bg-purple-50 text-purple-600 border-purple-200 shadow-sm' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            {activePositionsArray.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>

          {/* Portfolio Dashboard Dropdown */}
          {showPortfolio && (
            <div className="absolute right-0 mt-3 w-96 bg-white border border-slate-100 rounded-3xl shadow-2xl p-6 z-50 max-h-120 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <h4 className="text-base font-black text-slate-800">Active Positions</h4>
                </div>
                <button onClick={() => setShowPortfolio(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
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
                            {pos.yesShares > 0 && (
                              <span className="text-xs font-black text-emerald-600">
                                {Math.round(pos.yesShares).toLocaleString()} YES Shares (at {(yesPrice * 100).toFixed(0)}¢)
                              </span>
                            )}
                            {pos.noShares > 0 && (
                              <span className="text-xs font-black text-rose-600">
                                {Math.round(pos.noShares).toLocaleString()} NO Shares (at {(noPrice * 100).toFixed(0)}¢)
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Live Value</span>
                            <span className="text-sm font-black text-slate-900">
                              ₦{Math.round(totalValue).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Visual indicator comparing investment against current value */}
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

        {/* --- COIN SHOP WALLET SYSTEM --- */}
        <div className="relative" ref={shopRef}>
          <button 
            onClick={() => { setShowShop(!showShop); setShowPortfolio(false); }}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg shadow-md transition-all active:scale-95 group cursor-pointer"
          >
            <span className="text-white font-bold text-xs">{userBalance.toLocaleString()}</span>
            <div className="text-white/90"><ZCurrency /></div>
            <PlusCircle className="w-3.5 h-3.5 text-purple-200 group-hover:text-white transition-colors ml-0.5" />
          </button>

          {/* Shop Modal Content */}
          {showShop && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-3xl shadow-2xl p-5 z-50">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-purple-600" />
                  <h4 className="text-sm font-black text-slate-800">Buy Coins</h4>
                </div>
                <button onClick={() => setShowShop(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5">
                {coinPackages.map((pkg) => (
                  <button
                    key={pkg.label}
                    onClick={() => {
                      buyMoreCoins(pkg.coins);
                      alert(`Successfully added ₦${pkg.coins.toLocaleString()} Coins.`);
                      setShowShop(false);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex justify-between items-center relative ${
                      pkg.popular ? 'bg-purple-50/50 border-purple-200' : 'bg-slate-50/50 border-slate-100'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">{pkg.label}</p>
                      <p className="text-sm font-black text-purple-600">+{pkg.coins.toLocaleString()} Coins</p>
                    </div>
                    <div className="bg-white border border-slate-200 px-2.5 py-1 rounded-xl text-xs font-black text-slate-700">
                      {pkg.price}
                    </div>
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
    </nav>
  );
};

export default Navbar;