// src/components/StoreInitializer.tsx
"use client";
import { useEffect } from 'react';
import { useMarketStore } from '../store/useStore';

export default function StoreInitializer() {
  const setContracts = useMarketStore((s) => s.setContracts);

  useEffect(() => {
    fetch('/api/contracts') // Points to your Next.js route.ts
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setContracts(data);
        }
      })
      .catch((err) => console.error("Failed loading initial contracts", err));
  }, [setContracts]);

  return null;
}