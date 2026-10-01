import React from 'react';
import { CheckCircle2, AlertTriangle, Info, AlertCircle, X } from 'lucide-react';
import { useAuction } from '../context/AuctionContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAuction();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <Info className="w-4 h-4 text-sky-400 shrink-0" />;
        let borderClass = 'border-slate-700 bg-slate-900/95';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
          borderClass = 'border-emerald-500/40 bg-slate-900/95 shadow-emerald-950/20';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
          borderClass = 'border-amber-500/40 bg-slate-900/95 shadow-amber-950/20';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
          borderClass = 'border-rose-500/40 bg-slate-900/95 shadow-rose-950/20';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-xl border ${borderClass} shadow-xl backdrop-blur-md transition-all animate-fade-in`}
          >
            <div className="flex items-start gap-2.5">
              {icon}
              <div className="text-xs text-slate-200 leading-snug">
                {toast.lotNumber && (
                  <span className="font-mono text-amber-400 font-bold block mb-0.5">
                    LOTE #{toast.lotNumber}
                  </span>
                )}
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
