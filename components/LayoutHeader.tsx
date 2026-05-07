"use client";
import React from 'react';
import { Wallet, Search, Bell, UserCircle } from 'lucide-react';

export default function LayoutHeader({ balance = 3000 }) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-black text-violet-600 tracking-tighter cursor-pointer">ZAP</h1>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-500">
          <span className="text-zinc-900 cursor-pointer">Markets</span>
          <span className="hover:text-zinc-900 cursor-pointer">Activity</span>
          <span className="hover:text-zinc-900 cursor-pointer">Rankings</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-violet-50 px-4 py-2 rounded-2xl border border-violet-100">
          <Wallet className="w-4 h-4 text-violet-600" />
          <span className="font-bold text-violet-700">{balance.toLocaleString()} ZP</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <Search className="w-5 h-5 cursor-pointer hover:text-zinc-600" />
          <Bell className="w-5 h-5 cursor-pointer hover:text-zinc-600" />
          <UserCircle className="w-6 h-6 cursor-pointer text-zinc-300 hover:text-violet-600" />
        </div>
      </div>
    </header>
  );
}