import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Gavel, ShieldAlert, TrendingUp, Zap, MessageSquare } from 'lucide-react';

export const PricingExplanationBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 mb-8 text-xs transition-all">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            C$
          </div>
          <div>
            <span className="font-semibold text-white">
              SubastaPro Nicaragua: Pujas, ofertas directas y precios en Córdobas (C$)
            </span>
            <span className="text-slate-400 hidden sm:inline ml-2">
              (Puja de Subasta · Precio Mínimo de Reserva · Precio Máximo · Precio Fijo · Hacer Ofertas)
            </span>
          </div>
        </div>
        <button className="text-slate-400 hover:text-white p-1">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 animate-fade-in">
          {/* 1. Precio Subasta */}
          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Gavel className="w-4 h-4" />
              <span>1. Puja de Subasta (C$)</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Monto que compite en vivo. Puedes agregar precio con incrementos reglados o teclear tu monto libre.
            </p>
          </div>

          {/* 2. Precio Mínimo */}
          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>2. Precio Mínimo (Reserva)</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              El valor suelo fijado por el vendedor. Si no se alcanza, el lote no se entrega obligatoriamente.
            </p>
          </div>

          {/* 3. Precio Máximo */}
          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <TrendingUp className="w-4 h-4" />
              <span>3. Precio Máximo (Tope)</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Tope referencial del mercado o límite superior para que configures tu auto-puja automática.
            </p>
          </div>

          {/* 4. Precio Fijo */}
          <div className="p-3 rounded-lg bg-slate-950/70 border border-emerald-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Zap className="w-4 h-4" />
              <span>4. Precio Fijo ("Comprar Ya")</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Cierra el trato al instante al precio fijo marcado por el vendedor sin esperar a que termine el tiempo.
            </p>
          </div>

          {/* 5. Hacer Ofertas Directas */}
          <div className="p-3 rounded-lg bg-slate-950/70 border border-sky-500/30 space-y-1">
            <div className="flex items-center gap-1.5 text-sky-400 font-semibold">
              <MessageSquare className="w-4 h-4" />
              <span>5. Hacer Oferta Directa</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Proponle al vendedor un precio en Córdobas y tu propuesta personal para negociar en privado.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
