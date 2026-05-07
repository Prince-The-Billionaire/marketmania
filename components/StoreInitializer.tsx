"use client";

import { useEffect, useRef } from "react";
import { useMarketStore } from "@/store/useStore";

export default function StoreInitializer() {
  const hasLoaded = useRef(false);

  useEffect(() => {
    // Only load once to prevent duplicate fetches in strict mode
    if (!hasLoaded.current) {
      useMarketStore.getState().loadData();
      hasLoaded.current = true;
    }
  }, []);

  return null;
}