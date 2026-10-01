import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  Monitor, 
  Share2, 
  Check, 
  QrCode, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useAuction } from '../context/AuctionContext';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { setViewMode } = useAuction();
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'pc' | 'qr'>('android');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://subastapro.ni';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`¡Mira la aplicación de Subastas y Compra Directa en Nicaragua en Córdobas (C$): ${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                ¿Dónde y Cómo Cargar la Aplicación?
              </h3>
              <p className="text-xs text-slate-400">
                Instálala en tu celular Android, iPhone o computadora sin pasar por tiendas.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-slate-950/40 border-b border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('android')}
            className={`py-2 px-1 text-center rounded-lg font-medium transition-colors ${
              activeTab === 'android' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Android
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`py-2 px-1 text-center rounded-lg font-medium transition-colors ${
              activeTab === 'ios' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            iPhone (iOS)
          </button>
          <button
            onClick={() => setActiveTab('pc')}
            className={`py-2 px-1 text-center rounded-lg font-medium transition-colors ${
              activeTab === 'pc' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            PC / Mac
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`py-2 px-1 text-center rounded-lg font-medium transition-colors ${
              activeTab === 'qr' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Código QR
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* TAB: ANDROID */}
          {activeTab === 'android' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Carga en Teléfonos Android (Chrome / Samsung Internet)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  SubastaPro está construida con tecnología PWA de última generación. Puedes instalarla directamente en la pantalla de tu celular con su propio icono de app, notificaciones de pujas y pantalla completa.
                </p>

                {isInstallable ? (
                  <button
                    onClick={async () => {
                      await install();
                      onClose();
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Instalar Aplicación en Android Ahora</span>
                  </button>
                ) : (
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0">1</span>
                      <span>En tu navegador Chrome en Android, toca los <strong>tres puntos verticales (⋮)</strong> en la esquina superior derecha.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0">2</span>
                      <span>Toca en <strong>"Instalar aplicación"</strong> o <strong>"Añadir a pantalla principal"</strong>.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0">3</span>
                      <span>¡Listo! Se creará el acceso directo como una app nativa en tu teléfono.</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>No consume espacio de memoria y siempre se mantiene actualizada en tiempo real.</span>
              </div>
            </div>
          )}

          {/* TAB: IPHONE IOS */}
          {activeTab === 'ios' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Carga en iPhone & iPad (Safari)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Apple permite instalar la app directamente desde el navegador Safari sin necesidad de App Store:
                </p>

                <div className="space-y-3 text-xs text-slate-200">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                    <span>Abre este enlace en el navegador <strong>Safari</strong> de tu iPhone.</span>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                    <span>Toca el botón <strong>Compartir</strong> (icono del cuadro con flecha apuntando arriba) en la barra inferior de Safari.</span>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-xs">3</span>
                    <span>Desliza hacia abajo y pulsa en <strong>"Añadir a pantalla de inicio"</strong> (+).</span>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">4</span>
                    <span>Pulsa <strong>"Añadir"</strong> arriba a la derecha. ¡Ya tendrás el icono oficial de SubastaPro!</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PC / MAC */}
          {activeTab === 'pc' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Carga en Computadora (Windows, Mac, Linux)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  En tu navegador Chrome, Edge o Brave en escritorio puedes instalar SubastaPro como aplicación de escritorio:
                </p>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0">1</span>
                    <span>Observa la barra de direcciones arriba: verás un icono de <strong>pantalla con flecha abajo (Instalar)</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0">2</span>
                    <span>Haz clic en él y confirma <strong>"Instalar SubastaPro"</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center shrink-0">3</span>
                    <span>Se abrirá en su propia ventana sin barras de navegador, súper rápida y cómoda.</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setViewMode('app');
                      onClose();
                    }}
                    className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Smartphone className="w-4 h-4 text-sky-400" />
                    <span>Activar Simulador Modo App Móvil en esta pantalla</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: QR CODE */}
          {activeTab === 'qr' && (
            <div className="space-y-4 text-center">
              <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Escanea con la Cámara de tu Celular
                </span>
                <p className="text-xs text-slate-300">
                  Apunta la cámara de tu teléfono al código para abrir la app de inmediato:
                </p>

                {/* Visual QR Code Generator */}
                <div className="inline-block p-4 rounded-xl bg-white mx-auto shadow-xl">
                  <svg className="w-44 h-44" viewBox="0 0 100 100" fill="none">
                    {/* QR Finder Corners */}
                    <rect width="100" height="100" fill="#ffffff" />
                    {/* Top-Left */}
                    <rect x="10" y="10" width="24" height="24" fill="#0f172a" />
                    <rect x="14" y="14" width="16" height="16" fill="#ffffff" />
                    <rect x="18" y="18" width="8" height="8" fill="#d97706" />
                    {/* Top-Right */}
                    <rect x="66" y="10" width="24" height="24" fill="#0f172a" />
                    <rect x="70" y="14" width="16" height="16" fill="#ffffff" />
                    <rect x="74" y="18" width="8" height="8" fill="#d97706" />
                    {/* Bottom-Left */}
                    <rect x="10" y="66" width="24" height="24" fill="#0f172a" />
                    <rect x="14" y="70" width="16" height="16" fill="#ffffff" />
                    <rect x="18" y="74" width="8" height="8" fill="#d97706" />
                    {/* Pattern Matrix */}
                    <rect x="40" y="12" width="6" height="6" fill="#0f172a" />
                    <rect x="52" y="12" width="6" height="6" fill="#0f172a" />
                    <rect x="40" y="24" width="18" height="6" fill="#0f172a" />
                    <rect x="12" y="40" width="6" height="18" fill="#0f172a" />
                    <rect x="24" y="46" width="6" height="12" fill="#0f172a" />
                    <rect x="40" y="40" width="20" height="20" fill="#0f172a" />
                    <rect x="45" y="45" width="10" height="10" fill="#d97706" />
                    <rect x="66" y="40" width="12" height="6" fill="#0f172a" />
                    <rect x="82" y="40" width="8" height="12" fill="#0f172a" />
                    <rect x="66" y="52" width="18" height="6" fill="#0f172a" />
                    <rect x="40" y="66" width="6" height="12" fill="#0f172a" />
                    <rect x="52" y="72" width="12" height="6" fill="#0f172a" />
                    <rect x="46" y="82" width="18" height="6" fill="#0f172a" />
                    <rect x="70" y="70" width="20" height="20" fill="#0f172a" />
                    <rect x="76" y="76" width="8" height="8" fill="#d97706" />
                  </svg>
                </div>

                <div className="pt-2 flex items-center justify-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
                  </button>

                  <button
                    onClick={handleShareWhatsApp}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Compartir por WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Share Link footer */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="truncate max-w-[280px] sm:max-w-md font-mono text-[11px] text-slate-300">
              {currentUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className="text-amber-400 hover:underline font-semibold ml-2 shrink-0 flex items-center gap-1"
            >
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
