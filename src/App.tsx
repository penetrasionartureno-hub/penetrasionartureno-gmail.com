/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { AuctionProvider, useAuction } from './context/AuctionContext';
import { Header } from './components/Header';
import { AuctionHero } from './components/AuctionHero';
import { FilterBar } from './components/FilterBar';
import { AuctionCard } from './components/AuctionCard';
import { AuctionDetailModal } from './components/AuctionDetailModal';
import { CreateAuctionModal } from './components/CreateAuctionModal';
import { UserDashboardModal } from './components/UserDashboardModal';
import { WalletModal } from './components/WalletModal';
import { InstallAppModal } from './components/InstallAppModal';
import { ToastContainer } from './components/ToastContainer';
import { PricingExplanationBanner } from './components/PricingExplanationBanner';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { Monitor } from 'lucide-react';

function AuctionAppContent() {
  const { 
    auctions, 
    selectedAuction, 
    setSelectedAuction,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isDashboardOpen,
    setIsDashboardOpen,
    isWalletModalOpen,
    setIsWalletModalOpen,
    isInstallModalOpen,
    setIsInstallModalOpen,
    viewMode,
    setViewMode,
  } = useAuction();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [onlyFixedPrice, setOnlyFixedPrice] = useState(false);
  const [onlyReserveMet, setOnlyReserveMet] = useState(false);
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [sortBy, setSortBy] = useState('closing_soon');
  const [activeNav, setActiveNav] = useState('todas');

  // Handle navigation tab clicks
  const handleNavClick = (view: string) => {
    setActiveNav(view);
    if (view === 'fijo') {
      setOnlyFixedPrice(true);
      setOnlyReserveMet(false);
      setOnlyOffers(false);
    } else if (view === 'ofertas') {
      setOnlyOffers(true);
      setOnlyFixedPrice(false);
      setOnlyReserveMet(false);
    } else if (view === 'reserva') {
      setOnlyReserveMet(true);
      setOnlyFixedPrice(false);
      setOnlyOffers(false);
    } else if (view === 'favoritos' || view === 'perfil') {
      setIsDashboardOpen(true);
    } else {
      setOnlyFixedPrice(false);
      setOnlyReserveMet(false);
      setOnlyOffers(false);
    }
  };

  // Filtered and Sorted Auctions
  const filteredAuctions = useMemo(() => {
    return auctions.filter((item) => {
      // Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesSub = item.subtitle.toLowerCase().includes(query);
        const matchesCat = item.categoryLabel.toLowerCase().includes(query);
        const matchesLoc = item.seller.location.toLowerCase().includes(query);
        const matchesLot = String(item.lotNumber).includes(query);
        if (!matchesTitle && !matchesSub && !matchesCat && !matchesLoc && !matchesLot) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Only with Fixed Price (Compra Ya)
      if (onlyFixedPrice && !item.fixedPrice) {
        return false;
      }

      // Only Reserve Met
      if (onlyReserveMet && !item.isReserveMet) {
        return false;
      }

      // Only with Offers Allowed
      if (onlyOffers && !item.allowOffers) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'closing_soon') {
        return a.endTime - b.endTime;
      }
      if (sortBy === 'price_desc') {
        return b.currentBid - a.currentBid;
      }
      if (sortBy === 'price_asc') {
        return a.currentBid - b.currentBid;
      }
      if (sortBy === 'bids_count') {
        return b.bidsCount - a.bidsCount;
      }
      return 0;
    });
  }, [auctions, searchTerm, selectedCategory, onlyFixedPrice, onlyReserveMet, onlyOffers, sortBy]);

  // Featured lot (Toyota Hilux or first live)
  const featuredLot = auctions.find((a) => a.featured && a.status === 'live') || auctions[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* PWA Install Promotion */}
      <PWAInstallBanner />

      {/* Top Header */}
      <Header onNavClick={handleNavClick} activeNav={activeNav} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        {/* App Mode Simulator Container if user toggled 'Modo App' on desktop */}
        {viewMode === 'app' ? (
          <div className="max-w-md mx-auto my-4 bg-slate-950 border-4 border-slate-800 rounded-[3rem] p-3 shadow-2xl relative overflow-hidden">
            {/* Phone notch */}
            <div className="w-32 h-5 bg-slate-900 rounded-b-xl mx-auto mb-3 flex items-center justify-center">
              <div className="w-12 h-1 bg-slate-800 rounded-full" />
            </div>

            <div className="flex items-center justify-between px-2 mb-3 text-xs text-slate-400">
              <span className="font-semibold text-white">SubastaPro App (Nicaragua C$)</span>
              <button 
                onClick={() => setViewMode('platform')}
                className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                <Monitor className="w-3 h-3" />
                <span>Volver a Plataforma</span>
              </button>
            </div>

            {/* In-app Feed */}
            <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <FilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onlyFixedPrice={onlyFixedPrice}
                onToggleFixedPrice={() => setOnlyFixedPrice(!onlyFixedPrice)}
                onlyReserveMet={onlyReserveMet}
                onToggleReserveMet={() => setOnlyReserveMet(!onlyReserveMet)}
                onlyOffers={onlyOffers}
                onToggleOffers={() => setOnlyOffers(!onlyOffers)}
                sortBy={sortBy}
                onSortChange={setSortBy}
                totalCount={filteredAuctions.length}
              />

              <div className="space-y-4">
                {filteredAuctions.map((auction) => (
                  <AuctionCard
                    key={auction.id}
                    auction={auction}
                    onSelect={(auc) => setSelectedAuction(auc)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Platform Web View Mode (Full responsive layout) */
          <>
            {/* Hero Section if no restrictive search is applied */}
            {!searchTerm && selectedCategory === 'all' && !onlyFixedPrice && !onlyReserveMet && !onlyOffers && featuredLot && (
              <AuctionHero
                featuredAuction={featuredLot}
                onSelect={(auc) => setSelectedAuction(auc)}
              />
            )}

            {/* Explanation Guide on the 4 Pricing Models & Direct Offers */}
            <PricingExplanationBanner />

            {/* Live Filter Bar */}
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onlyFixedPrice={onlyFixedPrice}
              onToggleFixedPrice={() => setOnlyFixedPrice(!onlyFixedPrice)}
              onlyReserveMet={onlyReserveMet}
              onToggleReserveMet={() => setOnlyReserveMet(!onlyReserveMet)}
              onlyOffers={onlyOffers}
              onToggleOffers={() => setOnlyOffers(!onlyOffers)}
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalCount={filteredAuctions.length}
            />

            {/* Auctions Grid */}
            {filteredAuctions.length === 0 ? (
              <div className="py-16 text-center rounded-2xl border border-slate-800 bg-slate-900/40 p-8 space-y-3">
                <p className="text-base text-slate-300 font-semibold">
                  No se han encontrado productos con estos criterios.
                </p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Prueba a limpiar la búsqueda o cambiar la categoría (motos, carros, teléfonos, cadenas, relojes, básicos).
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setOnlyFixedPrice(false);
                    setOnlyReserveMet(false);
                    setOnlyOffers(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors mt-2"
                >
                  Ver Todos los Productos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAuctions.map((auction) => (
                  <AuctionCard
                    key={auction.id}
                    auction={auction}
                    onSelect={(auc) => setSelectedAuction(auc)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Touch Navigation Bar */}
      <MobileBottomNav
        currentTab={activeNav}
        onTabChange={handleNavClick}
      />

      {/* Floating Notifications */}
      <ToastContainer />

      {/* Modal: Lot PDP Detail View & Bidding/Offer Console */}
      <AuctionDetailModal
        auction={selectedAuction}
        onClose={() => setSelectedAuction(null)}
      />

      {/* Modal: Create & Publish New Product (Motos, Carros, Teléfonos, Cadenas, Relojes, Básicos) */}
      <CreateAuctionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Modal: User Dashboard */}
      <UserDashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        onSelectAuction={(auc) => setSelectedAuction(auc)}
      />

      {/* Modal: Fast Wallet Deposit in Cordobas */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />

      {/* Modal: How and Where to Install App (Android, iOS, PC, QR) */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuctionProvider>
      <AuctionAppContent />
    </AuctionProvider>
  );
}
