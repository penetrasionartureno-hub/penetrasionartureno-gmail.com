import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  Award, 
  Heart, 
  Clock, 
  ArrowUpRight, 
  ShieldCheck, 
  Download, 
  PlusCircle, 
  CheckCircle2, 
  AlertTriangle,
  MessageSquare,
  Tag,
  Check,
  Ban
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { AuctionItem } from '../types/auction';
import { formatCordobas } from '../utils/currency';

interface UserDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAuction: (auction: AuctionItem) => void;
}

export const UserDashboardModal: React.FC<UserDashboardModalProps> = ({
  isOpen,
  onClose,
  onSelectAuction
}) => {
  const { 
    user, 
    myBids, 
    myPurchases, 
    myOffersSent, 
    watchlist, 
    auctions, 
    depositFunds, 
    toggleWatchlist,
    respondToOffer
  } = useAuction();

  const [activeTab, setActiveTab] = useState<'billetera' | 'pujas' | 'ofertas' | 'ventas' | 'compras' | 'favoritos'>('billetera');
  const [depositAmount, setDepositAmount] = useState<number>(10000);
  const [depositMethod, setDepositMethod] = useState<'banco' | 'billetera_movil' | 'efectivo'>('banco');

  if (!isOpen) return null;

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount <= 0) return;
    depositFunds(depositAmount);
  };

  const watchedAuctions = auctions.filter((a) => watchlist.includes(a.id));
  const myPublishedAuctions = auctions.filter((a) => a.seller.isCurrentUser || a.seller.name === user.name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-base">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-white font-display">{user.name}</h3>
                <span className="flex items-center gap-0.5 text-[10px] text-emerald-400 font-medium bg-emerald-950/70 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                  <ShieldCheck className="w-3 h-3" /> Verificado
                </span>
              </div>
              <p className="text-xs text-slate-400">{user.email} · Cédula: {user.cedula} · {user.ciudad}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-800/80 bg-slate-950/30 overflow-x-auto">
          <button
            onClick={() => setActiveTab('billetera')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'billetera'
                ? 'border-amber-400 text-amber-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Mi Cartera ({formatCordobas(user.walletBalance)})</span>
          </button>

          <button
            onClick={() => setActiveTab('pujas')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'pujas'
                ? 'border-amber-400 text-amber-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Mis Pujas ({myBids.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ofertas')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'ofertas'
                ? 'border-sky-400 text-sky-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ofertas Enviadas ({myOffersSent.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ventas')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'ventas'
                ? 'border-amber-400 text-amber-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Mis Productos en Venta ({myPublishedAuctions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('compras')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'compras'
                ? 'border-amber-400 text-amber-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Mis Compras ({myPurchases.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('favoritos')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'favoritos'
                ? 'border-amber-400 text-amber-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Favoritos ({watchlist.length})</span>
          </button>
        </div>

        {/* Scrollable Tab Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* TAB 1: BILLETERA */}
          {activeTab === 'billetera' && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Saldo Total en Córdobas Nicaragüenses (NIO)
                  </span>
                  <div className="text-3xl font-mono font-bold text-amber-400 tabular-nums mt-1">
                    {formatCordobas(user.walletBalance)}
                  </div>
                  <span className="text-xs text-slate-400 mt-1 block">
                    Disponible para pujas inmediatas, compras fijas u ofertas directas
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs text-emerald-400 font-medium block">
                    Cuenta Verificada Nicaragua
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Tel: {user.telefono}
                  </span>
                </div>
              </div>

              {/* Deposit Form */}
              <form onSubmit={handleDeposit} className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-amber-400" />
                  <span>Añadir Fondos a Tu Cartera en Córdobas (C$)</span>
                </h4>

                <div className="flex items-center gap-2 flex-wrap">
                  {[2500, 5000, 10000, 25000, 50000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt)}
                      className={`px-3 py-1.5 text-xs rounded-lg font-mono transition-colors cursor-pointer ${
                        depositAmount === amt
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      +{formatCordobas(amt)}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs font-bold">C$</span>
                  <input
                    type="number"
                    min={100}
                    step={100}
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-2.5 text-sm font-mono font-bold rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-400"
                    placeholder="Cantidad a recargar en Córdobas"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDepositMethod('banco')}
                    className={`p-2.5 rounded-lg border text-xs text-center transition-colors cursor-pointer ${
                      depositMethod === 'banco'
                        ? 'border-amber-400 bg-amber-500/10 text-amber-300 font-semibold'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400'
                    }`}
                  >
                    Transferencia Bancaria (BAC / Banpro / Lafise)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepositMethod('billetera_movil')}
                    className={`p-2.5 rounded-lg border text-xs text-center transition-colors cursor-pointer ${
                      depositMethod === 'billetera_movil'
                        ? 'border-amber-400 bg-amber-500/10 text-amber-300 font-semibold'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400'
                    }`}
                  >
                    Billetera Móvil (Claro Pay / Tigo Money)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepositMethod('efectivo')}
                    className={`p-2.5 rounded-lg border text-xs text-center transition-colors cursor-pointer ${
                      depositMethod === 'efectivo'
                        ? 'border-amber-400 bg-amber-500/10 text-amber-300 font-semibold'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400'
                    }`}
                  >
                    Efectivo en Agente Banpro / PuntoFácil
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
                >
                  Recargar {formatCordobas(depositAmount)} Ahora
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: MIS PUJAS */}
          {activeTab === 'pujas' && (
            <div className="space-y-3">
              {myBids.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-950/40 rounded-xl border border-slate-800">
                  No tienes pujas activas en este momento. Explora el catálogo para ofertar.
                </div>
              ) : (
                myBids.map((bid) => {
                  const targetAuction = auctions.find((a) => a.id === bid.auctionId);
                  const isWinning = bid.status === 'winning';

                  return (
                    <div
                      key={bid.auctionId}
                      className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={bid.image}
                          alt={bid.itemTitle}
                          className="w-16 h-12 rounded-lg object-cover border border-slate-800 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-amber-400 text-xs font-bold">Lote #{bid.lotNumber}</span>
                            <span className="text-slate-500 text-xs">· {bid.categoryLabel}</span>
                          </div>
                          <h4 className="text-sm font-semibold text-white line-clamp-1">{bid.itemTitle}</h4>
                          <span className="text-[11px] text-slate-400">Pujado a las {bid.timestamp}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                        <div className="text-right">
                          <span className="text-[10px] uppercase text-slate-400 block">Tu Oferta</span>
                          <span className="font-mono font-bold text-slate-100 text-sm tabular-nums">
                            {formatCordobas(bid.amount)}
                          </span>
                          <div className="text-[11px] mt-0.5">
                            {isWinning ? (
                              <span className="text-emerald-400 font-semibold flex items-center justify-end gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Vas Ganando
                              </span>
                            ) : (
                              <span className="text-rose-400 font-semibold flex items-center justify-end gap-1">
                                <AlertTriangle className="w-3 h-3" /> Te han sobrepujado
                              </span>
                            )}
                          </div>
                        </div>

                        {targetAuction && (
                          <button
                            onClick={() => {
                              onClose();
                              onSelectAuction(targetAuction);
                            }}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:text-white hover:border-amber-400 flex items-center gap-1"
                          >
                            <span>Ver Sala</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 3: OFERTAS ENVIADAS */}
          {activeTab === 'ofertas' && (
            <div className="space-y-3">
              {myOffersSent.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-950/40 rounded-xl border border-slate-800">
                  No has enviado ofertas directas todavía. Puedes proponer un precio negociable en cualquier producto con la opción «Hacer Oferta».
                </div>
              ) : (
                myOffersSent.map((offer) => {
                  const targetAuction = auctions.find((a) => a.id === offer.auctionId);
                  return (
                    <div
                      key={offer.id}
                      className="p-4 rounded-xl bg-slate-950/70 border border-sky-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-sky-950 border border-sky-500/40 text-sky-300 px-2 py-0.5 rounded font-semibold">
                            Oferta Enviada
                          </span>
                          <span className="text-slate-400 text-xs font-mono">{offer.timestamp}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-white mt-1">
                          {targetAuction?.title || 'Producto en subasta'}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5 italic">"{offer.message}"</p>
                      </div>

                      <div className="text-right flex items-center gap-3">
                        <div>
                          <span className="text-[10px] uppercase text-slate-400 block">Tu Propuesta</span>
                          <span className="font-mono font-bold text-sky-400 text-sm tabular-nums">
                            {formatCordobas(offer.amount)}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            Estado: {offer.status === 'accepted' ? '✓ Aceptada' : offer.status === 'rejected' ? 'Rechazada' : 'Pendiente'}
                          </span>
                        </div>

                        {targetAuction && (
                          <button
                            onClick={() => {
                              onClose();
                              onSelectAuction(targetAuction);
                            }}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:text-white"
                          >
                            Ver Lote
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 4: MIS PRODUCTOS EN VENTA */}
          {activeTab === 'ventas' && (
            <div className="space-y-4">
              {myPublishedAuctions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-950/40 rounded-xl border border-slate-800">
                  Aún no has publicado ningún producto para vender. Usa el botón «Vender Mi Producto» o «Publicar Producto» para cargar tus motos, carros, teléfonos, joyas u objetos del hogar.
                </div>
              ) : (
                myPublishedAuctions.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.title}
                          className="w-14 h-12 rounded-lg object-cover border border-slate-800 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-amber-400 text-xs font-bold">Lote #{prod.lotNumber}</span>
                            <span className="text-slate-500 text-xs">· {prod.categoryLabel}</span>
                          </div>
                          <h4 className="text-sm font-semibold text-white line-clamp-1">{prod.title}</h4>
                          <span className="text-[11px] text-slate-400">
                            Puja actual: <strong className="text-amber-400">{formatCordobas(prod.currentBid)}</strong> ({prod.bidsCount} pujas)
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          onSelectAuction(prod);
                        }}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:text-white"
                      >
                        Ver Sala
                      </button>
                    </div>

                    {/* Offers received on this user's product */}
                    {prod.directOffers && prod.directOffers.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-2">
                        <span className="text-[11px] font-semibold text-sky-300 block">
                          Ofertas directas de compradores recibidas ({prod.directOffers.length}):
                        </span>
                        {prod.directOffers.map((o) => (
                          <div
                            key={o.id}
                            className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-semibold text-white">{o.buyerName}: </span>
                              <span className="text-sky-300 font-mono font-bold">{formatCordobas(o.amount)}</span>
                              <span className="text-slate-400 text-[11px] block">"{o.message}"</span>
                            </div>

                            {o.status === 'pending' ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => respondToOffer(prod.id, o.id, 'accept')}
                                  className="px-2.5 py-1 bg-emerald-500 text-slate-950 rounded font-semibold text-xs hover:bg-emerald-400"
                                >
                                  Aceptar Oferta
                                </button>
                                <button
                                  onClick={() => respondToOffer(prod.id, o.id, 'reject')}
                                  className="px-2.5 py-1 bg-rose-500/20 text-rose-300 rounded font-semibold text-xs hover:bg-rose-500/30"
                                >
                                  Rechazar
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] font-semibold text-emerald-400">
                                {o.status === 'accepted' ? 'Oferta Aceptada' : 'Rechazada'}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 5: COMPRAS */}
          {activeTab === 'compras' && (
            <div className="space-y-3">
              {myPurchases.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-950/40 rounded-xl border border-slate-800">
                  Aún no has adquirido productos. Puedes ganar en subasta, comprar a precio fijo o hacer una oferta directa que el vendedor acepte.
                </div>
              ) : (
                myPurchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={purchase.image}
                        alt={purchase.itemTitle}
                        className="w-16 h-12 rounded-lg object-cover border border-slate-800 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded font-semibold">
                            {purchase.type === 'precio_fijo' ? 'Compra Inmediata' : purchase.type === 'oferta_aceptada' ? 'Oferta Aceptada' : 'Subasta Ganada'}
                          </span>
                          <span className="text-slate-500 text-[11px] font-mono">{purchase.invoiceNumber}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-white mt-1 line-clamp-1">{purchase.itemTitle}</h4>
                        <span className="text-[11px] text-slate-400">Fecha: {purchase.date}</span>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <div>
                        <span className="text-[10px] uppercase text-slate-400 block">Total Pagado</span>
                        <span className="font-mono font-bold text-emerald-400 text-sm tabular-nums">
                          {formatCordobas(purchase.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 6: FAVORITOS */}
          {activeTab === 'favoritos' && (
            <div className="space-y-3">
              {watchedAuctions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-950/40 rounded-xl border border-slate-800">
                  Tu lista de seguimiento está vacía.
                </div>
              ) : (
                watchedAuctions.map((auction) => (
                  <div
                    key={auction.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={auction.image}
                        alt={auction.title}
                        className="w-16 h-12 rounded-lg object-cover border border-slate-800 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-amber-400 text-xs font-bold">Lote #{auction.lotNumber}</span>
                          <span className="text-slate-500 text-xs">· {auction.categoryLabel}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-white line-clamp-1">{auction.title}</h4>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          Puja: <span className="text-amber-400 font-bold">{formatCordobas(auction.currentBid)}</span>
                          {auction.fixedPrice && (
                            <span className="ml-2 text-emerald-400 font-semibold">
                              · Compra Ya: {formatCordobas(auction.fixedPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleWatchlist(auction.id)}
                        className="p-2 text-rose-400 hover:text-slate-400"
                        title="Quitar"
                      >
                        <Heart className="w-4 h-4 fill-rose-500" />
                      </button>
                      <button
                        onClick={() => {
                          onClose();
                          onSelectAuction(auction);
                        }}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:text-white"
                      >
                        Ver
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
