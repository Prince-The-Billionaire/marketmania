"use client";
import React, { useState } from 'react';
import { useMarketStore } from '../store/useStore';

const AddContractForm = () => {
  const addContract = useMarketStore(s => s.addContract);
  const [form, setForm] = useState({ title: '', category: 'Sports', prob: 50, seed: 50000 });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addContract({
      id: Math.random().toString(36).substr(2, 9),
      title: form.title,
      category: form.category,
      probability: form.prob,
      initialVolume: form.seed
    });
    alert("Saved to JSON and State!");
  };

  return (
    <form onSubmit={handleAdd} className="max-w-xl mx-auto p-10 bg-white rounded-[3rem] border space-y-4">
      <h2 className="text-2xl font-black mb-4">Add Market</h2>
      <input 
        placeholder="Market Title" 
        className="w-full p-4 bg-slate-50 rounded-xl outline-none"
        onChange={e => setForm({...form, title: e.target.value})}
      />
      <select 
        className="w-full p-4 bg-slate-50 rounded-xl"
        onChange={e => setForm({...form, category: e.target.value})}
      >
        <option>Sports</option><option>Academics</option><option>Politics</option>
      </select>
      <input 
        type="number" 
        placeholder="Starting Prob %" 
        className="w-full p-4 bg-slate-50 rounded-xl outline-none"
        onChange={e => setForm({...form, prob: Number(e.target.value)})}
      />
      <button className="w-full py-4 bg-purple-600 text-white font-black rounded-xl">Create Market</button>
    </form>
  );
};

export default AddContractForm;