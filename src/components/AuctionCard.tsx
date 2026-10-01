import React from 'react';
import { Clock, Heart, Zap, CheckCircle2, AlertCircle, ArrowUpRight, MessageSquare, MapPin } from 'lucide-react';
import { AuctionItem } from '../types/auction';
import { useCountdown } from '../hooks/useCountdown';
import { useAuction } from '../context/AuctionContext';
import { formatCordobas } from '../utils/currency';

interface AuctionCardProps {
  auction: AuctionItem;
  onSelect: (auction: AuctionItem) => void;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ auction, onSelect }) => {
  const { watchlist, toggleWatchlist, placeBid, buyNowFixedPrice } = useAuction();
  const countdown = useCountdown(auction.endTime);
  const isWatched = watchlist.includes(auction.id);

  const handleQuickBid = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextBid = auction.currentBid + auction.bidIncrement;
    placeBid(auction.id, nextBid);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    buyNowFixedPrice(auction.id);
  };

  const handleToggleHeart = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWatchlist(auction.id);
  };

  const isSold = auction.status === 'sold_direct' || auction.status === 'ended';

  return (
    <article
      onClick={() => onSelect(auction)}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300 hover:shadow-xl hover:shadow-black/40 cursor-pointer"
    >
      {/* Media Slot: 4:3 Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        <img
          src={auction.image}
          alt={auction.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

        {/* Top Badges overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            {isSold ? (
              <span className="backdrop-blur-md bg-rose-950/80 border border-rose-500/40 text-rose-300 px-2 py-0.5 rounded text-[11px] font-semibold">
                Vendido
              </span>
            ) : countdown.isUrgent ? (
              <span className="backdrop-blur-md bg-amber-950/80 border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                Cierra pronto
              </span>
            ) : (
              <span className="backdrop-blur-md bg-slate-950/70 border border-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-medium">
                En vivo
              </span>
            )}

            {auction.allowOffers && !isSold && (
              <span className="backdrop-blur-md bg-sky-950/80 border border-sky-500/40 text-sky-300 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1">
                <MessageSquare className="w-2.5 h-2.5" />
                Ofertas
              </span>
            )}
          </div>

          {/* Watchlist heart */}
          <button
            onClick={handleToggleHeart}
            aria-label={isWatched ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            className="w-8 h-8 rounded-full backdrop-blur-md bg-slate-950/70 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-slate-300 hover:text-rose-400 transition-colors"
          >
            <Heart className={`w-4 h-4 ${isWatched ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Bottom media bar: Countdown & Location */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300">
          <span className="font-mono bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1 text-[10px]">
            <MapPin className="w-3 h-3 text-sky-400" />
            <span className="truncate max-w-[120px]">{auction.seller.location.split(',')[0]}</span>
          </span>
          <span className="font-mono bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span className="tabular-nums">{countdown.formatted}</span>
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Unboxed Metadata */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="text-amber-400 font-medium">Lote #{auction.lotNumber}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>{auction.categoryLabel}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>{auction.bidsCount} {auction.bidsCount === 1 ? 'puja' : 'pujas'}</span>
        </div>

        {/* Title */}
        <h3 className="mt-1.5 text-base font-semibold text-white tracking-tight line-clamp-1 group-hover:text-amber-300 transition-colors">
          {auction.title}
        </h3>
        <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {auction.subtitle}
        </p>

        {/* THE 4 PRICING MATRIX IN CÓRDOBAS (C$) */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
          {/* Row 1: Precio de Subasta (Puja Actual) & Precio Fijo */}
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block">
                Precio de Subasta (Puja)
              </span>
              <div className="text-base sm:text-lg font-bold font-mono text-amber-400 tabular-nums">
                {formatCordobas(auction.currentBid)}
              </div>
            </div>

            {auction.fixedPrice && (
              <div className="text-right">
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 block flex items-center justify-end gap-1">
                  <Zap className="w-2.5 h-2.5 text-emerald-400" />
                  Precio Fijo (Comprar Ya)
                </span>
                <div className="text-xs sm:text-sm font-bold font-mono text-emerald-400 tabular-nums">
                  {formatCordobas(auction.fixedPrice)}
                </div>
              </div>
            )}
          </div>

          {/* Row 2: Precio Mínimo (Reserva) & Precio Máximo */}
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1.5 border-t border-slate-800/50">
            {/* Precio Mínimo / Reserva */}
            <div>
              <span className="text-slate-500 block text-[10px]">Precio Mínimo (Reserva):</span>
              <div className="flex items-center gap-1 font-mono text-slate-300 text-xs">
                <span>{formatCordobas(auction.minReservePrice)}</span>
                {auction.isReserveMet ? (
                  <span title="Reserva alcanzada" className="inline-flex"><CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /></span>
                ) : (
                  <span title="Reserva pendiente" className="inline-flex"><AlertCircle className="w-3 h-3 text-amber-500 shrink-0" /></span>
                )}
              </div>
            </div>

            {/* Precio Máximo */}
            <div className="text-right">
              <span className="text-slate-500 block text-[10px]">Precio Máximo:</span>
              <span className="font-mono text-slate-300 text-xs">
                {formatCordobas(auction.maxDirectPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Pujar / Hacer Oferta / Comprar */}
        <div className="mt-4 pt-3 flex items-center gap-1.5">
          {isSold ? (
            <div className="w-full py-2 text-center text-xs font-medium text-slate-400 bg-slate-800/60 rounded-lg">
              Artículo Vendido
            </div>
          ) : (
            <>
              {/* Quick Bid Button */}
              <button
                onClick={handleQuickBid}
                className="flex-1 py-2 px-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors text-center truncate active:scale-[0.98]"
              >
                Pujar +{formatCordobas(auction.bidIncrement)}
              </button>

              {/* Hacer Oferta */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(auction);
                }}
                title="Hacer una oferta directa al vendedor"
                className="py-2 px-2.5 text-xs font-medium text-sky-300 bg-sky-950/70 border border-sky-500/40 hover:bg-sky-900/60 rounded-lg transition-colors flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ofertar</span>
              </button>

              {/* Quick Buy Now */}
              {auction.fixedPrice && (
                <button
                  onClick={handleBuyNow}
                  title="Comprar inmediatamente a precio fijo"
                  className="py-2 px-2.5 text-xs font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 hover:bg-emerald-900/60 rounded-lg transition-colors flex items-center justify-center gap-1 active:scale-[0.98]"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Comprar Ya</span>
                </button>
              )}

              {/* View details */}
              <button
                onClick={() => onSelect(auction)}
                aria-label="Ver detalles"
                className="p-2 text-slate-400 hover:text-white rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60 transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
};
