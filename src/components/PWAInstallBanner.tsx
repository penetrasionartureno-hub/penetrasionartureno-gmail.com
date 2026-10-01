import React, { useState } from 'react';
import { Smartphone, X, Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useAuction } from '../context/AuctionContext';

export const PWAInstallBanner: React.FC = () => {
  const { isInstalled } = usePWAInstall();
  const { setIsInstallModalOpen } = useAuction();
  const [isDismissed, setIsDismissed] = useState(false);

  // If already running standalone or user dismissed, don't show
  if (isInstalled || isDismissed) return null;

  return (
    <div className="bg-gradient-to-r from-sky-950/80 via-slate-900 to-amber-950/60 border-b border-sky-500/20 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-200">
          <Smartphone className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            <strong className="text-amber-300">¿Quieres cargar la app en tu teléfono o PC?</strong> Instálala gratis en Android, iPhone o escritorio para pujar y vender al instante.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="px-3 py-1 bg-sky-400 hover:bg-sky-300 text-slate-950 rounded-md font-bold text-xs transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ver Dónde y Cómo Cargar la App</span>
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="text-slate-400 hover:text-white p-1"
            aria-label="Cerrar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
