import { create } from 'zustand';

export interface HistoryPoint {
  date: string;
  yes: number;
}

export interface Contract {
  id: string;
  title: string;
  category: string;
  volume: number;
  probability: number;
  history: HistoryPoint[];
}

interface MarketState {
  contracts: Contract[];
  activeMarket: Contract | null;
  loadData: () => Promise<void>;
  setActiveMarket: (id: string) => void;
  addContract: (market: any) => Promise<void>;
  placeTrade: (amount: number, outcome: 'yes' | 'no') => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  contracts: [],
  activeMarket: null,

  loadData: async () => {
    const res = await fetch('/api/contracts');
    const data = await res.json();
    const processed = data.map((c: any) => ({
      ...c,
      volume: Number(c.volume) || 50000, // Fallback to 50k if missing
      probability: Number(c.baseProb),
      history: Array.from({ length: 8 }, (_, i) => ({
        date: `T-${7-i}`,
        yes: Number(c.baseProb) + (Math.random() * 4 - 2)
      }))
    }));
    set({ contracts: processed, activeMarket: processed[0] });
  },

  setActiveMarket: (id) => set((state) => ({
    activeMarket: state.contracts.find(m => m.id === id) || state.activeMarket
  })),

  addContract: async (newMarket) => {
    const seed = Number(newMarket.initialVolume) || 0;
    
    const fullItem: Contract = {
      id: newMarket.id,
      title: newMarket.title,
      category: newMarket.category,
      volume: seed,
      probability: Number(newMarket.probability),
      history: [{ date: 'Funded', yes: Number(newMarket.probability) }]
    };

    set((state) => ({ contracts: [fullItem, ...state.contracts] }));

    await fetch('/api/contracts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newMarket,
        volume: seed 
      }),
    });
  },

  placeTrade: (amount, outcome) => {
    set((state) => {
      if (!state.activeMarket) return state;
      const active = state.activeMarket;
      const tradeVal = Number(amount);
      
      // Price impact relative to pool depth (more volume = harder to move price)
      const poolDepth = Math.max(active.volume, 10000);
      const impact = (tradeVal / poolDepth) * 15; 
      const shift = outcome === 'yes' ? impact : -impact;
      const newProb = Math.min(Math.max(active.probability + shift, 1), 99);
      
      const updated = {
        ...active,
        probability: Number(newProb.toFixed(1)),
        volume: Number(active.volume) + tradeVal,
        history: [...active.history, { date: 'Trade', yes: newProb }]
      };

      return {
        activeMarket: updated,
        contracts: state.contracts.map(c => c.id === active.id ? updated : c)
      };
    });
  }
}));