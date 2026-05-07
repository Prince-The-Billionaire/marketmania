"use client";
import React, { useState } from 'react';
import { User, Search } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false);

  const ZCurrency = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 6L5 18H19" />
      <path d="M5 6H19L5 18" />
      <line x1="12" y1="3" x2="12" y2="21" />
    </svg>
  );

  return (
    <nav className="sticky top-5 mx-auto w-[90vw] z-50 flex items-center justify-between px-8 py-3 bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl">
      <div className="flex-shrink-0">
        <Link href="/" className="text-slate-900 font-black text-xl tracking-tighter">
          MM <span className="font-light opacity-60 uppercase text-xs tracking-[0.2em] ml-1">Marketmania</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-10">
        {['portfolio', 'about'].map((link) => (
          <a key={link} href={`#${link}`} className="text-slate-600 hover:text-purple-600 transition-all capitalize text-sm font-semibold">
            {link}
          </a>
        ))}
        <Link href="/admin" className="text-slate-600 hover:text-purple-600 text-sm font-semibold">Admin</Link>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative flex items-center group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <Search className={`absolute left-3 w-4 h-4 text-purple-600 transition-transform ${isHovered ? 'scale-110' : 'scale-100'}`} />
          <input 
            type="text" placeholder="who will win....."
            className="bg-slate-100/50 border border-slate-200 pl-10 pr-4 py-2 rounded-xl text-sm w-40 focus:w-60 transition-all outline-none"
          />
        </div>

        <div className="flex items-center gap-2 bg-purple-600 px-3 py-1.5 rounded-lg shadow-md">
          <span className="text-white font-bold text-xs">3000</span>
          <div className="text-white/90"><ZCurrency /></div>
        </div>

        <button className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all border border-slate-200">
          <User className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;