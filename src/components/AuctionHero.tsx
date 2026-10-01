import React from 'react';
import { Clock, ShieldCheck, ArrowRight, Zap, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { AuctionItem } from '../types/auction';
import { useCountdown } from '../hooks/useCountdown';
import { useAuction } from '../context/AuctionContext';
import { formatCordobas } from '../utils/currency';

interface AuctionHeroProps {
  featuredAuction: AuctionItem;
  onSelect: (auction: AuctionItem) => void;
}

export const AuctionHero: React.FC<AuctionHeroProps> = ({ featuredAuction, onSelect }) => {
  const { buyNowFixedPrice, placeBid } = useAuction();
  const countdown = useCountdown(featuredAuction.endTime);

  const handleQuickBid = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextBid = featuredAuction.currentBid + featuredAuction.bidIncrement;
    placeBid(featuredAuction.id, nextBid);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    buyNowFixedPrice(featuredAuction.id);
  };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/90 shadow-2xl mb-12">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 lg:p-10">
        {/* Left Column: Lot Spotlight & Information */}
        <div className="lg:col-span-6 space-y-6">
          {/* Unboxed Metadata */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span className="text-amber-400 font-semibold tracking-wider uppercase">Lote Destacado #{featuredAuction.lotNumber}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{featuredAuction.categoryLabel}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{featuredAuction.bidsCount} pujas</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-sky-400">{featuredAuction.seller.location}</span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white font-display text-balance leading-tight">
              {featuredAuction.title}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              {featuredAuction.subtitle}
            </p>
          </div>

          {/* Verification note */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Verificado por {featuredAuction.seller.name} · Inspección mecánica y legal en regla</span>
          </div>

          {/* THE 4 PRICING MATRIX IN CÓRDOBAS (C$) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            {/* 1. Precio de Subasta Actual */}
            <div className="space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Puja Actual
              </span>
              <div className="text-base sm:text-lg font-bold font-mono text-amber-400 tabular-nums">
                {formatCordobas(featuredAuction.currentBid)}
              </div>
              <span className="text-[10px] text-slate-500">Base: {formatCordobas(featuredAuction.startingBid)}</span>
            </div>

            {/* 2. Precio Mínimo (Reserva) */}
            <div className="space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Precio Mínimo
              </span>
              <div className="text-xs sm:text-sm font-semibold font-mono text-slate-200 tabular-nums">
                {formatCordobas(featuredAuction.minReservePrice)}
              </div>
              <div className="flex items-center gap-1 text-[10px]">
                {featuredAuction.isReserveMet ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3 inline" /> Superada
                  </span>
                ) : (
                  <span className="text-amber-500 font-medium flex items-center gap-0.5">
                    <AlertCircle className="w-3 h-3 inline" /> Sin alcanzar
                  </span>
                )}
              </div>
            </div>

            {/* 3. Precio Máximo Estimado */}
            <div className="space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Precio Máximo
              </span>
              <div className="text-xs sm:text-sm font-semibold font-mono text-slate-300 tabular-nums">
                {formatCordobas(featuredAuction.maxDirectPrice)}
              </div>
              <span className="text-[10px] text-slate-500">Tope sugerido</span>
            </div>

            {/* 4. Precio Fijo (Comprar Ya) */}
            <div className="space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Precio Fijo
              </span>
              <div className="text-base sm:text-lg font-bold font-mono text-emerald-400 tabular-nums">
                {featuredAuction.fixedPrice ? formatCordobas(featuredAuction.fixedPrice) : 'N/A'}
              </div>
              <span className="text-[10px] text-emerald-500/80 font-medium">Compra Directa</span>
            </div>
          </div>

          {/* Countdown & CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-200">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Cierre en</span>
                <span className="font-mono font-semibold text-slate-100 tabular-nums">{countdown.formatted}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-1 flex-wrap">
              {/* Puja Rápida CTA */}
              <button
                onClick={handleQuickBid}
                className="flex-1 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg hover:from-amber-300 hover:to-amber-400 transition-all shadow-md shadow-amber-500/20 text-center whitespace-nowrap active:scale-[0.98]"
              >
                Pujar +{formatCordobas(featuredAuction.bidIncrement)}
              </button>

              {/* Hacer Oferta o Comprar Ya */}
              <button
                onClick={() => onSelect(featuredAuction)}
                className="px-3.5 py-2.5 text-xs font-semibold text-sky-300 bg-sky-950/70 border border-sky-500/40 rounded-lg hover:bg-sky-900/60 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                <span>Hacer Oferta</span>
              </button>

              {/* Compra Inmediata Fija CTA */}
              {featuredAuction.fixedPrice && (
                <button
                  onClick={handleBuyNow}
                  className="px-3.5 py-2.5 text-xs font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 rounded-lg hover:bg-emerald-900/60 transition-colors flex items-center gap-1 whitespace-nowrap active:scale-[0.98]"
                  title="Comprar inmediatamente sin subasta"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Comprar Ya</span>
                </button>
              )}

              {/* Ver Lote Completo */}
              <button
                onClick={() => onSelect(featuredAuction)}
                className="px-3 py-2.5 text-xs font-medium text-slate-300 hover:text-white rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/50 transition-colors flex items-center gap-1"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Image */}
        <div className="lg:col-span-6">
          <div 
            onClick={() => onSelect(featuredAuction)}
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-800/90 aspect-[4/3] bg-slate-900 shadow-2xl transition-transform duration-300 hover:scale-[1.01]"
          >
            <img
              src={featuredAuction.image}
              alt={featuredAuction.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
            
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-300">
              <span className="backdrop-blur-md bg-slate-950/70 px-2.5 py-1 rounded border border-slate-800 text-[11px] font-mono">
                {featuredAuction.year ? `Año ${featuredAuction.year}` : 'Garantizado'}
              </span>
              <span className="backdrop-blur-md bg-slate-950/70 px-2.5 py-1 rounded border border-slate-800 text-[11px] text-amber-300 font-medium">
                Subastas en Córdobas (C$)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
