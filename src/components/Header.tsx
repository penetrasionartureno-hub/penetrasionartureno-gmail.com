import React from 'react';
import { 
  Gavel, 
  Wallet, 
  Plus, 
  Heart, 
  Smartphone, 
  Monitor, 
  Volume2, 
  VolumeX, 
  Download,
  Tag
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { formatCordobas } from '../utils/currency';

interface HeaderProps {
  onNavClick?: (view: string) => void;
  activeNav?: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavClick, activeNav = 'todas' }) => {
  const { 
    user, 
    watchlist, 
    viewMode, 
    setViewMode, 
    setIsCreateModalOpen, 
    setIsDashboardOpen,
    setIsWalletModalOpen,
    setIsInstallModalOpen,
    soundEnabled,
    toggleSound
  } = useAuction();

  const { isInstallable, install } = usePWAInstall();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onNavClick?.('todas'); }}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:border-amber-400 transition-colors">
              <Gavel className="w-5 h-5 text-amber-400" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
              SUBASTA<span className="text-amber-400">PRO</span>
              <span className="text-[10px] font-mono font-medium text-sky-400 ml-1.5 px-1 py-0.5 rounded bg-sky-950/80 border border-sky-500/30">
                Nicaragua (C$)
              </span>
            </span>
          </a>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button 
            onClick={() => onNavClick?.('todas')}
            className={`transition-colors hover:text-white cursor-pointer ${
              activeNav === 'todas' ? 'text-amber-400 font-semibold underline underline-offset-8 decoration-amber-400' : ''
            }`}
          >
            Subastas en Vivo
          </button>
          <button 
            onClick={() => onNavClick?.('fijo')}
            className={`transition-colors hover:text-white cursor-pointer flex items-center gap-1.5 ${
              activeNav === 'fijo' ? 'text-amber-400 font-semibold underline underline-offset-8 decoration-amber-400' : ''
            }`}
          >
            <span>Comprar Ya (Precio Fijo)</span>
          </button>
          <button 
            onClick={() => onNavClick?.('ofertas')}
            className={`transition-colors hover:text-white cursor-pointer ${
              activeNav === 'ofertas' ? 'text-amber-400 font-semibold underline underline-offset-8 decoration-amber-400' : ''
            }`}
          >
            Aceptan Ofertas
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="transition-colors hover:text-white cursor-pointer font-semibold text-amber-300 flex items-center gap-1"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Vender Mi Producto</span>
          </button>
          <button 
            onClick={() => setIsDashboardOpen(true)}
            className="transition-colors hover:text-white cursor-pointer"
          >
            Mi Cuenta
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions + quick controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Silenciar sonidos' : 'Activar efectos de audio'}
            aria-label="Alternar audio"
            className="w-9 h-9 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700 flex items-center justify-center transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400/80" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* How and Where to install the App */}
          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sky-500/40 bg-sky-950/60 hover:bg-sky-900/60 text-sky-300 text-xs font-semibold transition-colors cursor-pointer"
            title="¿Dónde y cómo cargar la aplicación en tu celular o PC?"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">¿Dónde cargo la app?</span>
            <span className="sm:hidden">App</span>
          </button>

          {/* Switch Platform Mode / App Mode */}
          <button
            onClick={() => setViewMode(viewMode === 'platform' ? 'app' : 'platform')}
            title={viewMode === 'platform' ? 'Vista Móvil App' : 'Vista Plataforma Web'}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            {viewMode === 'platform' ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                <span>Modo App</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-amber-400" />
                <span>Plataforma</span>
              </>
            )}
          </button>

          {/* PWA Install Trigger */}
          {isInstallable && (
            <button
              onClick={install}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50 text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar</span>
            </button>
          )}

          {/* Watchlist counter */}
          <button
            onClick={() => setIsDashboardOpen(true)}
            aria-label="Ver lista de seguimiento"
            className="relative w-9 h-9 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-700 flex items-center justify-center transition-colors"
          >
            <Heart className="w-4 h-4 text-rose-400/90" />
            {watchlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {watchlist.length}
              </span>
            )}
          </button>

          {/* Wallet Balance Pill in Córdobas */}
          <button
            onClick={() => setIsWalletModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:border-amber-500/40 hover:bg-slate-850 text-xs transition-colors"
          >
            <Wallet className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono font-semibold text-slate-100 tabular-nums">
              {formatCordobas(user.walletBalance)}
            </span>
          </button>

          {/* User Profile trigger */}
          <button
            onClick={() => setIsDashboardOpen(true)}
            className="flex items-center gap-2 p-1 pl-2 rounded-lg border border-slate-800 bg-slate-900/70 hover:border-slate-700 text-xs text-slate-300 transition-colors"
          >
            <span className="hidden sm:inline font-medium text-slate-200">{user.name.split(' ')[0]}</span>
            <div className="w-7 h-7 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-semibold text-xs">
              {user.name.charAt(0)}
            </div>
          </button>

          {/* Publish Product CTA */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="hidden xl:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg hover:from-amber-300 hover:to-amber-400 transition-colors shadow-sm shadow-amber-500/20 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Publicar Producto</span>
          </button>
        </div>
      </div>
    </header>
  );
};
