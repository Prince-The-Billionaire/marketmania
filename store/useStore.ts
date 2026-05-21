import { create } from 'zustand';

export interface MarketContract {
  id: string;
  title: string;
  category: string;
  probability: number; // dynamically calculated as: noShares / (yesShares + noShares) * 100
  volume: number;
  yesSharesPool: number; // x in our AMM
  noSharesPool: number;  // y in our AMM
  history: Array<{ date: string; yes: number }>;
}

export interface UserPosition {
  contractId: string;
  yesShares: number;
  noShares: number;
  totalInvested: number;
}

interface MarketState {
  contracts: MarketContract[];
  activeMarket: MarketContract | null;
  userBalance: number;
  userPositions: Record<string, UserPosition>;
  
  // Actions
  setContracts: (contracts: any[]) => void;
  setActiveMarket: (id: string) => void;
  addContract: (form: { id: string; title: string; category: string; probability: number; initialVolume: number }) => void;
  placeTrade: (amount: number, outcome: 'yes' | 'no') => { success: boolean; message: string };
  buyMoreCoins: (amount: number) => void;
}

export const useMarketStore = create<MarketState>((set, get) => ({
  contracts: [],
  activeMarket: null,
  userBalance: 50000, // Initial free virtual balance for new sessions
  userPositions: {},

  setContracts: (rawContracts) => {
    // Map raw backend/JSON contracts to active AMM pools if they don't have them
    const initialized = rawContracts.map((c) => {
      const seed = c.volume || 50000;
      const baseProb = c.baseProb || c.probability || 50;
      
      // Calculate pool distribution to accurately reflect the baseline starting percentage
      // Total shares minted = seed * 2
      const totalShares = seed * 2;
      const noSharesPool = totalShares * (baseProb / 100);
      const yesSharesPool = totalShares * ((100 - baseProb) / 100);

      return {
        id: c.id,
        title: c.title,
        category: c.category,
        probability: baseProb,
        volume: seed,
        yesSharesPool,
        noSharesPool,
        history: c.history || [{ date: new Date().toLocaleTimeString(), yes: baseProb }]
      };
    });

    set({ contracts: initialized, activeMarket: initialized[0] || null });
  },

  setActiveMarket: (id) => {
    const market = get().contracts.find((c) => c.id === id) || null;
    set({ activeMarket: market });
  },

  addContract: (form) => {
    const seed = form.initialVolume;
    const totalShares = seed * 2;
    // Inverse relationship: if prob is high (e.g. 80%), YES shares are cheaper/fewer in pool
    const noSharesPool = totalShares * (form.probability / 100);
    const yesSharesPool = totalShares * ((100 - form.probability) / 100);

    const newMarket: MarketContract = {
      id: form.id,
      title: form.title,
      category: form.category,
      probability: form.probability,
      volume: seed,
      yesSharesPool,
      noSharesPool,
      history: [{ date: new Date().toLocaleTimeString(), yes: form.probability }]
    };

    set((state) => {
      const updated = [...state.contracts, newMarket];
      return { contracts: updated };
    });
  },

  placeTrade: (amount, outcome) => {
    const { activeMarket, userBalance, userPositions, contracts } = get();
    if (!activeMarket) return { success: false, message: "No active market selected" };
    if (amount <= 0) return { success: false, message: "Invalid investment amount" };
    if (userBalance < amount) return { success: false, message: "Insufficient virtual cash balance!" };

    let x = activeMarket.yesSharesPool;
    let y = activeMarket.noSharesPool;
    const k = x * y; // Constant product invariant
    
    let sharesBought = 0;
    let newX = x;
    let newY = y;

    // CPMM Mechanics for Conditional Tokens
    if (outcome === 'yes') {
      // User puts 'amount' cash into pool, which converts into full pairs, then extracts opposing shares
      // Implementation formula for buying shares from AMM liquidity pool:
      newY = y + amount;
      newX = k / newY;
      sharesBought = (x + amount) - newX;
    } else {
      newX = x + amount;
      newY = k / newX;
      sharesBought = (y + amount) - newY;
    }

    // Protection check to prevent draining entire pool threshold
    if (sharesBought <= 0 || isNaN(sharesBought)) {
      return { success: false, message: "Trade size too large for current market liquidity pool." };
    }

    // Recalculate market price based on new outstanding share balance
    const newProbability = Math.round((newY / (newX + newY)) * 100);

    const updatedMarket: MarketContract = {
      ...activeMarket,
      yesSharesPool: newX,
      noSharesPool: newY,
      volume: activeMarket.volume + amount,
      probability: newProbability,
      history: [...activeMarket.history, { date: new Date().toLocaleTimeString(), yes: newProbability }]
    };

    // Update user personal portfolio positions
    const existingPosition = userPositions[activeMarket.id] || {
      contractId: activeMarket.id,
      yesShares: 0,
      noShares: 0,
      totalInvested: 0
    };

    const updatedPosition = {
      ...existingPosition,
      yesShares: existingPosition.yesShares + (outcome === 'yes' ? sharesBought : 0),
      noShares: existingPosition.noShares + (outcome === 'no' ? sharesBought : 0),
      totalInvested: existingPosition.totalInvested + amount
    };

    const updatedContracts = contracts.map((c) => c.id === activeMarket.id ? updatedMarket : c);

    set({
      userBalance: userBalance - amount,
      activeMarket: updatedMarket,
      contracts: updatedContracts,
      userPositions: { ...userPositions, [activeMarket.id]: updatedPosition }
    });

    return { 
      success: true, 
      message: `Successfully bought ${Math.round(sharesBought).toLocaleString()} ${outcome.toUpperCase()} shares!` 
    };
  },

  buyMoreCoins: (amount) => {
    set((state) => ({ userBalance: state.userBalance + amount }));
  }
}));

// Add this helper near the top or bottom of your useStore file to calculate live value:
export const getLivePositionValue = (position: any, contract: any) => {
  if (!contract) return { totalValue: 0, yesValue: 0, noValue: 0 };
  
  const poolTotal = contract.yesSharesPool + contract.noSharesPool;
  const yesPrice = contract.noSharesPool / poolTotal; // current price of YES
  const noPrice = contract.yesSharesPool / poolTotal;  // current price of NO

  const yesValue = position.yesShares * yesPrice;
  const noValue = position.noShares * noPrice;

  return {
    totalValue: yesValue + noValue,
    yesValue,
    noValue,
    yesPrice,
    noPrice
  };
};