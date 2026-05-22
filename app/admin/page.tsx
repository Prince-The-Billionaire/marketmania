"use client";
import React, { useState } from 'react';
import { useMarketStore } from '../../store/useStore';

export default function AdminPortal() {
  const addContract = useMarketStore((s) => s.addContract);
  const [form, setForm] = useState({ 
    title: '', 
    category: 'Sports', 
    prob: 50, 
    seed: 50000 // Default seeding with 50k
  });

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!form.title || form.seed <= 0) {
      alert("Please provide a title and initial liquidity.");
      return;
    }

    await addContract({
      id: Math.random().toString(36).substr(2, 9),
      title: form.title,
      category: form.category,
      probability: Number(form.prob),
      initialVolume: Number(form.seed) // Sending seed money to the store
    });

    setForm({ title: '', category: 'Sports', prob: 50, seed: 50000 });
    alert(`Market Live with ₦${form.seed.toLocaleString()} Liquidity!`);
  };

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl bg-white p-8 sm:p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
        <h1 className="text-4xl font-black text-slate-900 mb-8">Create Liquid Market</h1>
        
        <form onSubmit={handlePost} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-3">Event Question</label>
            <input 
              className="w-full p-6 bg-slate-50 rounded-2xl ring-1 ring-slate-200 focus:ring-2 focus:ring-purple-600 outline-none font-bold"
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              placeholder="e.g. Will the AI Defense Project win the Expo?"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-3">Category</label>
              <select 
                className="w-full p-6 bg-slate-50 rounded-2xl ring-1 ring-slate-200 outline-none font-bold appearance-none"
                value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}
              >
                <option>Sports</option><option>Tech</option><option>Academics</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-3">Base Odds (%)</label>
              <input 
                type="number" 
                className="w-full p-6 bg-slate-50 rounded-2xl ring-1 ring-slate-200 outline-none font-bold"
                value={form.prob}
                onChange={e => setForm({...form, prob: Number(e.target.value)})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-3">Initial Seed Liquidity (₦)</label>
            <input 
              type="number" 
              className="w-full p-6 bg-emerald-50 text-emerald-700 rounded-2xl ring-1 ring-emerald-200 focus:ring-2 focus:ring-emerald-500 outline-none font-black text-2xl"
              value={form.seed}
              onChange={e => setForm({...form, seed: Number(e.target.value)})}
            />
            <p className="text-[10px] text-slate-400 ml-3 mt-1">This amount is used to pay out initial winners before trade volume builds up.</p>
          </div>

          <button className="w-full py-7 bg-slate-900 text-white font-black rounded-2xl text-2xl hover:bg-purple-600 shadow-2xl transition-all">
            Deploy & Fund Market
          </button>
        </form>
      </div>
    </div>
  );
}