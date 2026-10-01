import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { AuctionItem, UserBid, UserPurchase, UserProfile, BidRecord, DirectOffer } from '../types/auction';
import { INITIAL_AUCTIONS, INITIAL_USER } from '../data/initialAuctions';
import { soundFx } from '../utils/audio';
import { formatCordobas } from '../utils/currency';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  lotNumber?: number;
}

interface AuctionContextType {
  auctions: AuctionItem[];
  user: UserProfile;
  watchlist: string[];
  myBids: UserBid[];
  myPurchases: UserPurchase[];
  myOffersSent: DirectOffer[];
  selectedAuction: AuctionItem | null;
  setSelectedAuction: (auction: AuctionItem | null) => void;
  viewMode: 'platform' | 'app';
  setViewMode: (mode: 'platform' | 'app') => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isDashboardOpen: boolean;
  setIsDashboardOpen: (open: boolean) => void;
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: (open: boolean) => void;
  isInstallModalOpen: boolean;
  setIsInstallModalOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error', lotNumber?: number) => void;
  
  // Actions
  placeBid: (auctionId: string, amount: number, maxAutoBid?: number) => { success: boolean; error?: string };
  buyNowFixedPrice: (auctionId: string) => { success: boolean; error?: string };
  makeDirectOffer: (auctionId: string, amount: number, message?: string) => { success: boolean; error?: string };
  respondToOffer: (auctionId: string, offerId: string, action: 'accept' | 'reject' | 'counter', counterAmount?: number) => void;
  toggleWatchlist: (auctionId: string) => void;
  depositFunds: (amount: number) => void;
  createAuction: (newAuction: Omit<AuctionItem, 'id' | 'lotNumber' | 'bidsCount' | 'bidsHistory' | 'views' | 'directOffers'>) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

const STORAGE_KEY_AUCTIONS = 'subastapro_nica_auctions_v2';
const STORAGE_KEY_USER = 'subastapro_nica_user_v2';
const STORAGE_KEY_WATCHLIST = 'subastapro_nica_watchlist_v2';
const STORAGE_KEY_BIDS = 'subastapro_nica_bids_v2';
const STORAGE_KEY_PURCHASES = 'subastapro_nica_purchases_v2';
const STORAGE_KEY_OFFERS = 'subastapro_nica_offers_v2';

export const AuctionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Initial State from localStorage or initial Nicaragua catalog
  const [auctions, setAuctions] = useState<AuctionItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUCTIONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_AUCTIONS;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_USER;
  });

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WATCHLIST);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return ['lote-101', 'lote-102', 'lote-103'];
  });

  const [myBids, setMyBids] = useState<UserBid[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BIDS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [myPurchases, setMyPurchases] = useState<UserPurchase[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PURCHASES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [myOffersSent, setMyOffersSent] = useState<DirectOffer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_OFFERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // UI state
  const [selectedAuction, setSelectedAuction] = useState<AuctionItem | null>(null);
  const [viewMode, setViewMode] = useState<'platform' | 'app'>('platform');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AUCTIONS, JSON.stringify(auctions));
    } catch {
      // ignore
    }
  }, [auctions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WATCHLIST, JSON.stringify(watchlist));
    } catch {
      // ignore
    }
  }, [watchlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BIDS, JSON.stringify(myBids));
    } catch {
      // ignore
    }
  }, [myBids]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PURCHASES, JSON.stringify(myPurchases));
    } catch {
      // ignore
    }
  }, [myPurchases]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_OFFERS, JSON.stringify(myOffersSent));
    } catch {
      // ignore
    }
  }, [myOffersSent]);

  // Keep selected auction updated if underlying auction changes
  useEffect(() => {
    if (selectedAuction) {
      const updated = auctions.find((a) => a.id === selectedAuction.id);
      if (updated) setSelectedAuction(updated);
    }
  }, [auctions, selectedAuction]);

  const addToast = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info', lotNumber?: number) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev.slice(-3), { id, type, message, lotNumber }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleSound = useCallback(() => {
    const newState = soundFx.toggleSound();
    setSoundEnabled(newState);
  }, []);

  // 2. Action: Place Bid (Pujar / Agregar precio a la subasta)
  const placeBid = useCallback((auctionId: string, amount: number, maxAutoBid?: number): { success: boolean; error?: string } => {
    const target = auctions.find((a) => a.id === auctionId);
    if (!target) {
      return { success: false, error: 'Artículo no encontrado en el sistema.' };
    }

    if (target.status !== 'live') {
      return { success: false, error: 'Esta subasta ya ha concluido.' };
    }

    if (Date.now() >= target.endTime) {
      return { success: false, error: 'El tiempo límite de esta subasta ha finalizado.' };
    }

    const minRequired = target.bidsCount === 0 ? target.startingBid : target.currentBid + target.bidIncrement;
    if (amount < minRequired) {
      return {
        success: false,
        error: `La puja mínima requerida es de ${formatCordobas(minRequired)}.`
      };
    }

    // Check wallet balance in Cordobas
    if (user.walletBalance < amount) {
      return {
        success: false,
        error: `Saldo insuficiente en tu cartera (${formatCordobas(user.walletBalance)}). Por favor recarga fondos en Córdobas para respaldar tu puja.`
      };
    }

    const newBidRecord: BidRecord = {
      id: `bid-${Date.now()}`,
      bidder: user.name,
      bidderId: 'current-user',
      amount,
      timestamp: 'Ahora mismo',
      isAutoBid: !!maxAutoBid,
      isCurrentUser: true,
    };

    const isReserveMet = amount >= target.minReservePrice;

    // Update auction state
    setAuctions((prev) =>
      prev.map((auc) => {
        if (auc.id === auctionId) {
          return {
            ...auc,
            currentBid: amount,
            bidsCount: auc.bidsCount + 1,
            isReserveMet,
            bidsHistory: [newBidRecord, ...auc.bidsHistory],
          };
        }
        return auc;
      })
    );

    // Update user bids tracking
    setMyBids((prev) => {
      const filtered = prev.filter((b) => b.auctionId !== auctionId);
      const updatedBid: UserBid = {
        auctionId,
        lotNumber: target.lotNumber,
        itemTitle: target.title,
        categoryLabel: target.categoryLabel,
        amount,
        maxAutoBid,
        status: 'winning',
        timestamp: new Date().toLocaleTimeString('es-NI', { hour: '2-digit', minute: '2-digit' }),
        image: target.image,
        endTime: target.endTime,
      };
      return [updatedBid, ...filtered];
    });

    soundFx.playBidChime();

    if (isReserveMet && !target.isReserveMet) {
      addToast(`¡Puja de ${formatCordobas(amount)} aceptada! Has superado el PRECIO MÍNIMO DE RESERVA del lote.`, 'success', target.lotNumber);
    } else {
      addToast(`¡Puja registrada con éxito por ${formatCordobas(amount)} en el Lote #${target.lotNumber}!`, 'success', target.lotNumber);
    }

    return { success: true };
  }, [auctions, user, addToast]);

  // 3. Action: Buy Now Fixed Price (Compra Ya a Precio Fijo)
  const buyNowFixedPrice = useCallback((auctionId: string): { success: boolean; error?: string } => {
    const target = auctions.find((a) => a.id === auctionId);
    if (!target) return { success: false, error: 'Artículo no encontrado.' };
    if (!target.fixedPrice) return { success: false, error: 'Este artículo no tiene precio fijo configurado.' };
    if (target.status !== 'live') return { success: false, error: 'El artículo ya no está disponible.' };

    const price = target.fixedPrice;
    if (user.walletBalance < price) {
      return {
        success: false,
        error: `Saldo insuficiente en cartera (${formatCordobas(user.walletBalance)}). Necesitas ${formatCordobas(price)} para la compra directa.`
      };
    }

    // Deduct from wallet
    setUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance - price,
    }));

    // Update auction status
    setAuctions((prev) =>
      prev.map((auc) => {
        if (auc.id === auctionId) {
          return {
            ...auc,
            status: 'sold_direct',
            winner: user.name,
            winnerAmount: price,
          };
        }
        return auc;
      })
    );

    // Record purchase
    const newPurchase: UserPurchase = {
      id: `pur-${Date.now()}`,
      auctionId,
      itemTitle: target.title,
      price,
      date: new Date().toLocaleDateString('es-NI', { day: '2-digit', month: 'short', year: 'numeric' }),
      type: 'precio_fijo',
      image: target.image,
      invoiceNumber: `FAC-NI-${target.lotNumber}-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setMyPurchases((prev) => [newPurchase, ...prev]);

    // Audio & Confetti
    soundFx.playGavelHammer();
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0066cc', '#ffffff', '#fbbf24', '#10b981'] // Nicaraguan & gold colors
      });
    } catch {
      // fallback
    }

    addToast(`¡Felicidades! Has adquirido el Lote #${target.lotNumber} por compra directa a precio fijo (${formatCordobas(price)}).`, 'success', target.lotNumber);
    return { success: true };
  }, [auctions, user, addToast]);

  // 4. Action: Make Direct Offer (Hacer Oferta Directa al Vendedor)
  const makeDirectOffer = useCallback((auctionId: string, amount: number, message?: string): { success: boolean; error?: string } => {
    const target = auctions.find((a) => a.id === auctionId);
    if (!target) return { success: false, error: 'Artículo no encontrado.' };
    if (target.status !== 'live') return { success: false, error: 'Esta subasta ya no está activa.' };

    if (amount <= 0) {
      return { success: false, error: 'Por favor introduce un monto de oferta válido en Córdobas.' };
    }

    const newOffer: DirectOffer = {
      id: `off-${Date.now()}`,
      auctionId,
      buyerName: user.name,
      buyerId: 'current-user',
      amount,
      message: message || 'Oferta directa para compra en firme.',
      timestamp: 'Ahora mismo',
      status: 'pending',
      isCurrentUser: true,
    };

    // Add to auction directOffers
    setAuctions((prev) =>
      prev.map((auc) => {
        if (auc.id === auctionId) {
          return {
            ...auc,
            directOffers: [newOffer, ...(auc.directOffers || [])],
          };
        }
        return auc;
      })
    );

    // Add to user sent offers
    setMyOffersSent((prev) => [newOffer, ...prev]);

    soundFx.playBidChime();
    addToast(`Oferta directa de ${formatCordobas(amount)} enviada al vendedor del Lote #${target.lotNumber}.`, 'success', target.lotNumber);
    return { success: true };
  }, [auctions, user, addToast]);

  // 5. Action: Respond to Offer (Aceptar / Rechazar / Contraofertar)
  const respondToOffer = useCallback((auctionId: string, offerId: string, action: 'accept' | 'reject' | 'counter', counterAmount?: number) => {
    const target = auctions.find((a) => a.id === auctionId);
    if (!target) return;

    const offer = target.directOffers?.find((o) => o.id === offerId);
    if (!offer) return;

    if (action === 'accept') {
      // Mark auction as sold
      setAuctions((prev) =>
        prev.map((auc) => {
          if (auc.id === auctionId) {
            return {
              ...auc,
              status: 'sold_direct',
              winner: offer.buyerName,
              winnerAmount: offer.amount,
              directOffers: auc.directOffers?.map((o) =>
                o.id === offerId ? { ...o, status: 'accepted' as const } : o
              ),
            };
          }
          return auc;
        })
      );

      // If buyer is current user, register purchase
      if (offer.isCurrentUser) {
        setUser((prev) => ({
          ...prev,
          walletBalance: Math.max(0, prev.walletBalance - offer.amount),
        }));
        const newPurchase: UserPurchase = {
          id: `pur-${Date.now()}`,
          auctionId,
          itemTitle: target.title,
          price: offer.amount,
          date: new Date().toLocaleDateString('es-NI', { day: '2-digit', month: 'short', year: 'numeric' }),
          type: 'oferta_aceptada',
          image: target.image,
          invoiceNumber: `OFR-NI-${target.lotNumber}-${Math.floor(1000 + Math.random() * 9000)}`,
        };
        setMyPurchases((prev) => [newPurchase, ...prev]);
      }

      soundFx.playGavelHammer();
      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch {
        // fallback
      }
      addToast(`Oferta de ${formatCordobas(offer.amount)} ACEPTADA. Lote #${target.lotNumber} adjudicado.`, 'success', target.lotNumber);
    } else if (action === 'reject') {
      setAuctions((prev) =>
        prev.map((auc) => {
          if (auc.id === auctionId) {
            return {
              ...auc,
              directOffers: auc.directOffers?.map((o) =>
                o.id === offerId ? { ...o, status: 'rejected' as const } : o
              ),
            };
          }
          return auc;
        })
      );
      addToast(`Oferta rechazada para el Lote #${target.lotNumber}.`, 'info', target.lotNumber);
    } else if (action === 'counter' && counterAmount) {
      setAuctions((prev) =>
        prev.map((auc) => {
          if (auc.id === auctionId) {
            return {
              ...auc,
              directOffers: auc.directOffers?.map((o) =>
                o.id === offerId
                  ? { ...o, status: 'countered' as const, counterAmount }
                  : o
              ),
            };
          }
          return auc;
        })
      );
      addToast(`Contraoferta de ${formatCordobas(counterAmount)} enviada.`, 'info', target.lotNumber);
    }
  }, [auctions, addToast]);

  // 6. Action: Watchlist Toggle
  const toggleWatchlist = useCallback((auctionId: string) => {
    setWatchlist((prev) => {
      const exists = prev.includes(auctionId);
      if (exists) {
        addToast('Artículo eliminado de tu lista de seguimiento.', 'info');
        return prev.filter((id) => id !== auctionId);
      } else {
        addToast('Artículo guardado en tu lista de seguimiento.', 'success');
        return [...prev, auctionId];
      }
    });
  }, [addToast]);

  // 7. Action: Deposit Funds (Recargar en Córdobas C$)
  const depositFunds = useCallback((amount: number) => {
    if (amount <= 0) return;
    setUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + amount,
    }));
    soundFx.playBidChime();
    addToast(`Recarga de ${formatCordobas(amount)} acreditada con éxito en tu cartera.`, 'success');
  }, [addToast]);

  // 8. Action: Create Auction (Publicar Producto)
  const createAuction = useCallback((newAuctionData: Omit<AuctionItem, 'id' | 'lotNumber' | 'bidsCount' | 'bidsHistory' | 'views' | 'directOffers'>) => {
    const nextLot = Math.max(...auctions.map((a) => a.lotNumber), 100) + 1;
    const newLot: AuctionItem = {
      ...newAuctionData,
      id: `lote-${nextLot}`,
      lotNumber: nextLot,
      bidsCount: 0,
      bidsHistory: [],
      directOffers: [],
      views: 1,
      isReserveMet: false,
    };

    setAuctions((prev) => [newLot, ...prev]);
    soundFx.playGavelHammer();
    addToast(`¡Excelente! Tu producto ha sido publicado como Lote #${nextLot} en SubastaPro Nicaragua.`, 'success', nextLot);
  }, [auctions, addToast]);

  // 9. Simulated live bids in Nicaraguan floor
  useEffect(() => {
    const floorBidTimer = setInterval(() => {
      const liveAuctions = auctions.filter((a) => a.status === 'live');
      if (liveAuctions.length === 0) return;

      const randomAuction = liveAuctions[Math.floor(Math.random() * liveAuctions.length)];
      if (randomAuction.currentBid >= randomAuction.maxDirectPrice) return;

      const increment = randomAuction.bidIncrement;
      const nextAmount = randomAuction.currentBid + increment;
      const bidderAliases = [
        'Biker_Managua', 
        'Transportes_Leon', 
        'AutoLote_Granada', 
        'Comprador_Esteli', 
        'Finca_Matagalpa', 
        'NicaStore_505'
      ];
      const randomBidder = bidderAliases[Math.floor(Math.random() * bidderAliases.length)];

      const newRecord: BidRecord = {
        id: `sim-${Date.now()}`,
        bidder: randomBidder,
        bidderId: `sim-user-${Math.floor(Math.random() * 100)}`,
        amount: nextAmount,
        timestamp: 'Hace instantes',
        isAutoBid: false,
      };

      setAuctions((prev) =>
        prev.map((auc) => {
          if (auc.id === randomAuction.id) {
            const reserveMet = nextAmount >= auc.minReservePrice;
            return {
              ...auc,
              currentBid: nextAmount,
              bidsCount: auc.bidsCount + 1,
              isReserveMet: reserveMet,
              bidsHistory: [newRecord, ...auc.bidsHistory.slice(0, 15)],
            };
          }
          return auc;
        })
      );

      // Check if current user was outbid
      setMyBids((prev) =>
        prev.map((b) => {
          if (b.auctionId === randomAuction.id && b.status === 'winning' && b.amount < nextAmount) {
            if (b.maxAutoBid && b.maxAutoBid >= nextAmount + increment) {
              const autoUserAmount = nextAmount + increment;
              setTimeout(() => {
                placeBid(randomAuction.id, autoUserAmount);
                addToast(`Tu auto-puja defendió tu liderazgo en Lote #${randomAuction.lotNumber} por ${formatCordobas(autoUserAmount)}`, 'info', randomAuction.lotNumber);
              }, 1200);
              return b;
            } else {
              addToast(`¡Atención! Has sido sobrepujado en el Lote #${randomAuction.lotNumber}. Oferta actual: ${formatCordobas(nextAmount)}`, 'warning', randomAuction.lotNumber);
              return { ...b, status: 'outbid' };
            }
          }
          return b;
        })
      );
    }, 45000);

    return () => clearInterval(floorBidTimer);
  }, [auctions, placeBid, addToast]);

  return (
    <AuctionContext.Provider
      value={{
        auctions,
        user,
        watchlist,
        myBids,
        myPurchases,
        myOffersSent,
        selectedAuction,
        setSelectedAuction,
        viewMode,
        setViewMode,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isDashboardOpen,
        setIsDashboardOpen,
        isWalletModalOpen,
        setIsWalletModalOpen,
        isInstallModalOpen,
        setIsInstallModalOpen,
        toasts,
        removeToast,
        addToast,
        placeBid,
        buyNowFixedPrice,
        makeDirectOffer,
        respondToOffer,
        toggleWatchlist,
        depositFunds,
        createAuction,
        soundEnabled,
        toggleSound,
      }}
    >
      {children}
    </AuctionContext.Provider>
  );
};

export const useAuction = (): AuctionContextType => {
  const context = useContext(AuctionContext);
  if (!context) {
    throw new Error('useAuction must be used within an AuctionProvider');
  }
  return context;
};
