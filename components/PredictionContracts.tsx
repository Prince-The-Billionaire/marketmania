"use client";
import React, { useState, useMemo } from 'react';
import { useMarketStore } from '@/store/useStore';
import { ChevronRight } from 'lucide-react';

const PredictionContracts = () => {
  const { contracts, activeMarket, setActiveMarket } = useMarketStore();
  const [filter, setFilter] = useState('All');
  
  const categories = useMemo(() => 
    ['All', ...Array.from(new Set(contracts.map(c => c.category)))], 
  [contracts]);

  const filtered = filter === 'All' ? contracts : contracts.filter(c => c.category === filter);

  return (
    <div className="mt-20 px-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <h2 className="text-3xl font-black tracking-tighter">Live Feed</h2>
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide max-w-2xl">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all border ${
                filter === cat ? 'bg-purple-600 border-purple-600 text-white shadow-lg' : 'bg-white text-slate-500 border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div 
            key={item.id}
            onClick={() => {
              setActiveMarket(item.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`bg-white p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer group flex flex-col justify-between h-56 ${
              activeMarket.id === item.id ? 'border-purple-600 ring-4 ring-purple-50' : 'border-transparent hover:border-slate-200'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">{item.category}</span>
                <span className="text-[10px] font-bold text-slate-400">Vol: {item.volume}</span>
              </div>
              <h3 className="font-black text-slate-800 text-lg leading-tight line-clamp-3 group-hover:text-purple-600 transition-colors">
                {item.title}
              </h3>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-600 transition-all duration-1000" 
                  style={{ width: `${item.probability}%` }}
                />
              </div>
              <span className="text-sm font-black text-slate-900">{item.probability}%</span>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionContracts;