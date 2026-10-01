import React from 'react';
import { Gavel, Zap, Heart, User, PlusCircle } from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import { formatCordobas } from '../utils/currency';

interface MobileBottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentTab, onTabChange }) => {
  const { watchlist, setIsCreateModalOpen, setIsDashboardOpen, user } = useAuction();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 pb-safe">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-2">
        {/* Tab 1: Subastas */}
        <button
          onClick={() => onTabChange('todas')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors cursor-pointer ${
            currentTab === 'todas' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gavel className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Subastas</span>
        </button>

        {/* Tab 2: Compra Ya (Precio Fijo) */}
        <button
          onClick={() => onTabChange('fijo')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors cursor-pointer ${
            currentTab === 'fijo' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Precio Fijo</span>
        </button>

        {/* Tab 3: Center Plus button (Publicar / Vender) */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] -mt-3 transition-transform active:scale-95 cursor-pointer"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <PlusCircle className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-[10px] font-bold text-amber-300 tracking-tight mt-0.5">Vender</span>
        </button>

        {/* Tab 4: Favoritos */}
        <button
          onClick={() => onTabChange('favoritos')}
          className={`relative flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors cursor-pointer ${
            currentTab === 'favoritos' ? 'text-rose-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Favoritos</span>
          {watchlist.length > 0 && (
            <span className="absolute top-1 right-2 w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              {watchlist.length}
            </span>
          )}
        </button>

        {/* Tab 5: Mi Perfil / Cartera */}
        <button
          onClick={() => setIsDashboardOpen(true)}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors cursor-pointer ${
            currentTab === 'perfil' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1 truncate max-w-[65px]">
            {formatCordobas(user.walletBalance)}
          </span>
        </button>
      </div>
    </div>
  );
};
