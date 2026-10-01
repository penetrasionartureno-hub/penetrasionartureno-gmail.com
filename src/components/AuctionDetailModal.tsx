import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Heart, 
  Truck, 
  FileText, 
  UserCheck, 
  MessageSquare,
  Send,
  Check,
  Ban,
  Phone
} from 'lucide-react';
import { AuctionItem } from '../types/auction';
import { useCountdown } from '../hooks/useCountdown';
import { useAuction } from '../context/AuctionContext';
import { formatCordobas } from '../utils/currency';

interface AuctionDetailModalProps {
  auction: AuctionItem | null;
  onClose: () => void;
}

export const AuctionDetailModal: React.FC<AuctionDetailModalProps> = ({ auction, onClose }) => {
  const { 
    user, 
    watchlist, 
    toggleWatchlist, 
    placeBid, 
    buyNowFixedPrice, 
    makeDirectOffer,
    respondToOffer,
    setIsWalletModalOpen 
  } = useAuction();

  if (!auction) return null;

  const countdown = useCountdown(auction.endTime);
  const isWatched = watchlist.includes(auction.id);

  // Minimum required bid in Cordobas
  const minRequiredBid = auction.bidsCount === 0 ? auction.startingBid : auction.currentBid + auction.bidIncrement;

  // Local form state
  const [customBidAmount, setCustomBidAmount] = useState<number>(minRequiredBid);
  const [isAutoBidEnabled, setIsAutoBidEnabled] = useState<boolean>(false);
  const [maxAutoBidLimit, setMaxAutoBidLimit] = useState<number>(auction.maxDirectPrice);
  
  // Direct offer form state
  const [offerAmount, setOfferAmount] = useState<number>(Math.round(auction.currentBid * 1.05));
  const [offerMessage, setOfferMessage] = useState<string>('');
  const [counterInput, setCounterInput] = useState<{ [offerId: string]: number }>({});
  
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'pujar' | 'oferta' | 'historial' | 'especificaciones'>('pujar');

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (customBidAmount < minRequiredBid) {
      setErrorMsg(`La puja mínima aceptada en este momento es de ${formatCordobas(minRequiredBid)}.`);
      return;
    }

    if (user.walletBalance < customBidAmount) {
      setErrorMsg(`Saldo disponible insuficiente (${formatCordobas(user.walletBalance)}). Recarga fondos en tu cartera para respaldar tu puja.`);
      return;
    }

    const res = placeBid(
      auction.id, 
      customBidAmount, 
      isAutoBidEnabled ? maxAutoBidLimit : undefined
    );

    if (!res.success) {
      setErrorMsg(res.error || 'No se pudo procesar la puja.');
    } else {
      setCustomBidAmount(customBidAmount + auction.bidIncrement);
    }
  };

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (offerAmount <= 0) {
      setErrorMsg('Introduce un monto de oferta válido.');
      return;
    }

    const res = makeDirectOffer(auction.id, offerAmount, offerMessage);
    if (!res.success) {
      setErrorMsg(res.error || 'Error al enviar la oferta.');
    } else {
      setOfferMessage('');
    }
  };

  const handleBuyNow = () => {
    setErrorMsg('');
    const res = buyNowFixedPrice(auction.id);
    if (!res.success) {
      setErrorMsg(res.error || 'Error al procesar la compra a precio fijo.');
    }
  };

  const handleFastIncrement = (increment: number) => {
    setCustomBidAmount(minRequiredBid + increment);
    setErrorMsg('');
  };

  const isSold = auction.status === 'sold_direct' || auction.status === 'ended';
  const reserveProgress = Math.min(100, Math.round((auction.currentBid / auction.minReservePrice) * 100));

  const isSellerCurrentUser = auction.seller.name === user.name || auction.seller.isCurrentUser;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2.5 text-xs text-slate-400">
            <span className="font-mono font-semibold text-amber-400">Lote #{auction.lotNumber}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{auction.categoryLabel}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-sky-400">{auction.seller.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWatchlist(auction.id)}
              className="p-1.5 rounded-lg border border-slate-800 text-slate-300 hover:text-rose-400 hover:border-slate-700 transition-colors"
              title="Guardar en favoritos"
            >
              <Heart className={`w-4 h-4 ${isWatched ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">
          {/* Main Grid: Photo + Pricing Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column: Image & Seller */}
            <div className="md:col-span-6 space-y-3">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800">
                <img
                  src={auction.image}
                  alt={auction.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
                  <span className="backdrop-blur-md bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800 text-[11px] font-mono">
                    {auction.condition}
                  </span>
                  <span className="backdrop-blur-md bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800 text-[11px] text-amber-300 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{countdown.formatted}</span>
                  </span>
                </div>
              </div>

              {/* Seller Trust Card */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-300 text-sm">
                    {auction.seller.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white flex items-center gap-1">
                      <span>{auction.seller.name}</span>
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      {auction.seller.location}
                      {auction.seller.phone && (
                        <> · <Phone className="w-3 h-3 inline text-emerald-400" /> {auction.seller.phone}</>
                      )}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-amber-400">{auction.seller.rating} ★</span>
                  <span className="text-slate-500 block text-[10px]">Vendedor Acreditado</span>
                </div>
              </div>
            </div>

            {/* Right Column: Title & 4 Mandatory Prices Matrix */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
                  {auction.title}
                </h2>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  {auction.subtitle}
                </p>
              </div>

              {/* THE 4 REQUIRED PRICES STRUCTURE IN CÓRDOBAS (C$) */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center justify-between">
                  <span>Valores Oficiales en Córdobas (NIO - C$)</span>
                  <span className="text-slate-500 font-mono">Incremento: +{formatCordobas(auction.bidIncrement)}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* 1. Precio de Subasta Actual */}
                  <div className="p-2.5 rounded-lg bg-slate-900/90 border border-amber-500/20">
                    <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block">
                      1. Precio Subasta (Puja)
                    </span>
                    <div className="text-lg font-bold font-mono text-amber-400 tabular-nums mt-0.5">
                      {formatCordobas(auction.currentBid)}
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Base: {formatCordobas(auction.startingBid)}
                    </span>
                  </div>

                  {/* 2. Precio Fijo (Comprar Ya) */}
                  <div className="p-2.5 rounded-lg bg-slate-900/90 border border-emerald-500/20">
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider block flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5" />
                      2. Precio Fijo (Comprar Ya)
                    </span>
                    <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums mt-0.5">
                      {auction.fixedPrice ? formatCordobas(auction.fixedPrice) : 'No fijado'}
                    </div>
                    <span className="text-[10px] text-emerald-500/80 block mt-0.5">
                      Compra directa sin pujar
                    </span>
                  </div>

                  {/* 3. Precio Mínimo (Reserva) */}
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      3. Precio Mínimo (Reserva)
                    </span>
                    <div className="text-sm font-bold font-mono text-slate-200 tabular-nums mt-0.5">
                      {formatCordobas(auction.minReservePrice)}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[10px]">
                      {auction.isReserveMet ? (
                        <span className="text-emerald-400 flex items-center gap-0.5 font-medium">
                          <CheckCircle2 className="w-3 h-3 inline" /> Reserva alcanzada
                        </span>
                      ) : (
                        <span className="text-amber-500 flex items-center gap-0.5 font-medium">
                          <AlertCircle className="w-3 h-3 inline" /> Reserva no alcanzada ({reserveProgress}%)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 4. Precio Máximo Estimado */}
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      4. Precio Máximo Estimado
                    </span>
                    <div className="text-sm font-bold font-mono text-slate-300 tabular-nums mt-0.5">
                      {formatCordobas(auction.maxDirectPrice)}
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Tope sugerido
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Progreso de pujas hacia Precio Mínimo de Reserva:</span>
                    <span className="font-mono text-slate-300 font-semibold">{reserveProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        auction.isReserveMet ? 'bg-emerald-500' : 'bg-amber-400'
                      }`}
                      style={{ width: `${reserveProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Buy Now Banner */}
              {auction.fixedPrice && !isSold && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-emerald-300 block">
                      ¿Quieres asegurar este producto de inmediato?
                    </span>
                    <span className="text-[11px] text-emerald-400/80">
                      Compra a precio fijo por {formatCordobas(auction.fixedPrice)}
                    </span>
                  </div>
                  <button
                    onClick={handleBuyNow}
                    className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm shadow-emerald-500/20 whitespace-nowrap active:scale-[0.98]"
                  >
                    Comprar Ya
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs inside Detail Modal */}
          <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('pujar')}
              className={`px-3.5 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'pujar'
                  ? 'border-amber-400 text-amber-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Pujar / Agregar Precio
            </button>
            <button
              onClick={() => setActiveTab('oferta')}
              className={`px-3.5 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'oferta'
                  ? 'border-sky-400 text-sky-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Hacer Oferta Directa ({auction.directOffers?.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveTab('historial')}
              className={`px-3.5 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'historial'
                  ? 'border-amber-400 text-amber-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Historial de Pujas ({auction.bidsHistory.length})
            </button>
            <button
              onClick={() => setActiveTab('especificaciones')}
              className={`px-3.5 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'especificaciones'
                  ? 'border-amber-400 text-amber-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Detalles & Legal
            </button>
          </div>

          {/* TAB 1: PUJAR / AGREGAR PRECIO */}
          {activeTab === 'pujar' && (
            <div className="space-y-4">
              {isSold ? (
                <div className="p-6 rounded-xl bg-slate-950/70 border border-slate-800 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-semibold text-white">Artículo Adjudicado</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Este producto ha sido vendido por {formatCordobas(auction.winnerAmount || auction.currentBid)}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBidSubmit} className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Licitación de Subasta en Córdobas</h4>
                      <p className="text-xs text-slate-400">
                        La siguiente puja válida debe ser de al menos <span className="text-amber-400 font-mono font-semibold">{formatCordobas(minRequiredBid)}</span>.
                      </p>
                    </div>

                    {/* Quick increment chips */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] text-slate-500 mr-1">Agregar:</span>
                      <button
                        type="button"
                        onClick={() => handleFastIncrement(0)}
                        className="px-2.5 py-1 text-xs rounded bg-slate-800 text-slate-200 hover:bg-slate-700 font-mono"
                      >
                        +{formatCordobas(auction.bidIncrement)}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFastIncrement(auction.bidIncrement * 2)}
                        className="px-2.5 py-1 text-xs rounded bg-slate-800 text-slate-200 hover:bg-slate-700 font-mono"
                      >
                        +{formatCordobas(auction.bidIncrement * 2)}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFastIncrement(auction.bidIncrement * 5)}
                        className="px-2.5 py-1 text-xs rounded bg-slate-800 text-slate-200 hover:bg-slate-700 font-mono"
                      >
                        +{formatCordobas(auction.bidIncrement * 5)}
                      </button>
                    </div>
                  </div>

                  {/* Input row */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-8 relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs font-bold">C$</div>
                      <input
                        type="number"
                        min={minRequiredBid}
                        step={auction.bidIncrement}
                        value={customBidAmount}
                        onChange={(e) => setCustomBidAmount(Number(e.target.value))}
                        className="w-full pl-9 pr-4 py-2.5 text-base font-mono font-bold rounded-lg bg-slate-900 border border-slate-700 text-amber-300 focus:outline-none focus:border-amber-400"
                        placeholder="Monto de la puja"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <button
                        type="submit"
                        className="w-full py-2.5 px-4 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg transition-all shadow-md shadow-amber-500/20 active:scale-[0.98] text-center"
                      >
                        Confirmar Puja de {formatCordobas(customBidAmount)}
                      </button>
                    </div>
                  </div>

                  {/* Auto-bid limit toggle */}
                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={isAutoBidEnabled}
                        onChange={(e) => setIsAutoBidEnabled(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-400 focus:ring-0 cursor-pointer"
                      />
                      <span className="font-medium">Activar Puja Automática (Proxy Bidding) con Precio Tope</span>
                    </label>

                    {isAutoBidEnabled && (
                      <div className="pl-6 space-y-1.5 animate-fade-in">
                        <p className="text-[11px] text-slate-400">
                          El sistema defenderá tu puja de forma automática en incrementos reglados hasta el tope máximo que definas:
                        </p>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            min={customBidAmount + auction.bidIncrement}
                            value={maxAutoBidLimit}
                            onChange={(e) => setMaxAutoBidLimit(Number(e.target.value))}
                            className="max-w-xs px-3 py-1.5 text-xs font-mono font-bold rounded bg-slate-900 border border-slate-700 text-slate-100"
                          />
                          <span className="text-[11px] text-slate-400">Precio máximo que estás dispuesto a pagar</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Error display */}
                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                      {errorMsg.includes('Saldo') && (
                        <button
                          type="button"
                          onClick={() => setIsWalletModalOpen(true)}
                          className="underline font-semibold hover:text-white"
                        >
                          Recargar Fondos
                        </button>
                      )}
                    </div>
                  )}

                  {/* Wallet balance note */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>
                      Tu saldo en cartera:{' '}
                      <span className="text-slate-300 font-mono font-medium">{formatCordobas(user.walletBalance)}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsWalletModalOpen(true)}
                      className="text-amber-400 hover:underline"
                    >
                      Añadir fondos
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: HACER OFERTA DIRECTA AL VENDEDOR */}
          {activeTab === 'oferta' && (
            <div className="space-y-5">
              {/* Form to submit an offer */}
              {!isSold && (
                <form onSubmit={handleOfferSubmit} className="p-5 rounded-xl bg-slate-950/90 border border-sky-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-sky-300 flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4" />
                        <span>Hacer Oferta Directa al Vendedor</span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        Envía una propuesta económica en Córdobas. El vendedor podrá aceptarla, rechazarla o contraofertar.
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Puja actual: <strong className="text-amber-400">{formatCordobas(auction.currentBid)}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-5 relative">
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Monto de tu oferta (C$) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs font-bold">C$</span>
                        <input
                          type="number"
                          required
                          min={100}
                          value={offerAmount}
                          onChange={(e) => setOfferAmount(Number(e.target.value))}
                          className="w-full pl-9 pr-3 py-2 text-sm font-mono font-bold rounded-lg bg-slate-900 border border-slate-700 text-sky-300 focus:outline-none focus:border-sky-400"
                          placeholder="Monto a ofertar"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-7">
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Mensaje o condiciones para el vendedor
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={offerMessage}
                          onChange={(e) => setOfferMessage(e.target.value)}
                          placeholder="Ej: Pago de contado y retiro hoy mismo en Managua"
                          className="flex-1 px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 text-xs font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Enviar Oferta</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300">
                      {errorMsg}
                    </div>
                  )}
                </form>
              )}

              {/* Offers List */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Ofertas Recibidas para este Lote ({auction.directOffers?.length || 0})
                </h4>

                {!auction.directOffers || auction.directOffers.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800">
                    Aún no se han formulado ofertas directas para este producto. ¡Sé el primero en enviar tu propuesta!
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {auction.directOffers.map((offer) => {
                      const isPending = offer.status === 'pending';
                      const isAccepted = offer.status === 'accepted';
                      const isRejected = offer.status === 'rejected';

                      return (
                        <div
                          key={offer.id}
                          className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white text-xs">{offer.buyerName}</span>
                              <span className="text-[11px] text-slate-500 font-mono">· {offer.timestamp}</span>
                              {offer.isCurrentUser && (
                                <span className="text-[10px] bg-slate-800 text-sky-300 px-1.5 py-0.5 rounded font-medium">Tú</span>
                              )}
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                                isAccepted ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                                isRejected ? 'bg-rose-950 text-rose-400 border border-rose-500/30' :
                                'bg-sky-950 text-sky-400 border border-sky-500/30'
                              }`}>
                                {isAccepted ? 'Oferta Aceptada' : isRejected ? 'Rechazada' : 'En Espera de Respuesta'}
                              </span>
                            </div>

                            <p className="text-xs text-slate-300 mt-1">
                              "{offer.message}"
                            </p>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-auto">
                            <div className="text-right">
                              <span className="text-[10px] uppercase text-slate-400 block">Monto Ofertado</span>
                              <span className="font-mono font-bold text-sky-300 text-sm tabular-nums">
                                {formatCordobas(offer.amount)}
                              </span>
                            </div>

                            {/* Seller Action Controls if seller is user */}
                            {isPending && isSellerCurrentUser && (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => respondToOffer(auction.id, offer.id, 'accept')}
                                  className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1"
                                  title="Aceptar oferta y vender el producto"
                                >
                                  <Check className="w-4 h-4" />
                                  <span className="hidden sm:inline">Aceptar</span>
                                </button>
                                <button
                                  onClick={() => respondToOffer(auction.id, offer.id, 'reject')}
                                  className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-semibold flex items-center gap-1"
                                  title="Rechazar oferta"
                                >
                                  <Ban className="w-4 h-4" />
                                  <span className="hidden sm:inline">Rechazar</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: HISTORIAL DE PUJAS */}
          {activeTab === 'historial' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Historial de licitaciones registradas en sala:</span>
                <span className="font-mono text-slate-300 font-semibold">{auction.bidsHistory.length} pujas</span>
              </div>

              {auction.bidsHistory.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800">
                  Aún no hay pujas registradas. ¡Sé el primero con la base de {formatCordobas(auction.startingBid)}!
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-2.5">Pujador</th>
                        <th className="px-4 py-2.5">Monto en Córdobas</th>
                        <th className="px-4 py-2.5">Tiempo</th>
                        <th className="px-4 py-2.5 text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {auction.bidsHistory.map((bid, index) => {
                        const isLeader = index === 0;
                        return (
                          <tr key={bid.id} className={isLeader ? 'bg-amber-500/5' : ''}>
                            <td className="px-4 py-2.5 font-medium text-slate-200 flex items-center gap-2">
                              {isLeader && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                              <span>{bid.bidder}</span>
                              {bid.isCurrentUser && (
                                <span className="text-[10px] bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded">Tú</span>
                              )}
                              {bid.isAutoBid && (
                                <span className="text-[10px] text-slate-500">(Auto)</span>
                              )}
                            </td>
                            <td className="px-4 py-2.5 font-mono font-semibold text-slate-100 tabular-nums">
                              {formatCordobas(bid.amount)}
                            </td>
                            <td className="px-4 py-2.5 text-slate-400">{bid.timestamp}</td>
                            <td className="px-4 py-2.5 text-right">
                              {isLeader ? (
                                <span className="text-amber-400 font-semibold text-[11px]">Puja Ganadora Actual</span>
                              ) : (
                                <span className="text-slate-500 text-[11px]">Sobrepujado</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ESPECIFICACIONES & LEGAL */}
          {activeTab === 'especificaciones' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Descripción del Producto
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  {auction.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Ubicación & Procedencia
                </h4>
                <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {auction.provenance}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Ficha Técnica
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {auction.specifications.map((spec, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs flex justify-between">
                      <span className="text-slate-400">{spec.label}:</span>
                      <span className="font-semibold text-slate-200 text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between shrink-0">
          <div className="text-xs">
            <span className="text-slate-400 block text-[10px] uppercase">Puja actual</span>
            <span className="font-mono font-bold text-amber-400 text-base tabular-nums">
              {formatCordobas(auction.currentBid)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/50"
            >
              Cerrar
            </button>
            {!isSold && (
              <>
                <button
                  onClick={() => setActiveTab('oferta')}
                  className="px-3.5 py-2 text-xs font-semibold text-sky-300 bg-sky-950/80 border border-sky-500/40 hover:bg-sky-900/70 rounded-lg transition-colors flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Ofertar</span>
                </button>
                <button
                  onClick={() => setActiveTab('pujar')}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
                >
                  Pujar Ahora
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
