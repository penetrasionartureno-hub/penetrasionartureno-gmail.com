import React from 'react';
import { Gavel, ShieldCheck, Award, Lock, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-850 bg-slate-950 text-slate-400 py-12 px-4 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Gavel className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-lg text-white tracking-tight">
                SUBASTA<span className="text-amber-400">PRO</span>
                <span className="text-xs text-sky-400 font-mono ml-1">Nicaragua</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Plataforma de subastas, compra inmediata y ofertas directas en Córdobas (C$). Publica y adquiere motos, carros, teléfonos, cadenas y productos básicos en toda Nicaragua.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Transacciones verificadas y entrega segura</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
              Categorías Populares
            </h4>
            <ul className="space-y-1.5">
              <li><span className="text-slate-300">Motos:</span> Pulsar, Génesis, Yamaha, Mensajeras y Scooters</li>
              <li><span className="text-slate-300">Carros:</span> Toyota Hilux, Corolla, Camionetas 4x4 y Sedanes</li>
              <li><span className="text-slate-300">Teléfonos:</span> iPhone, Samsung Galaxy, Laptops y Tablets</li>
              <li><span className="text-slate-300">Cadenas:</span> Oro 14K/18K tejido cubano, dijes y joyas</li>
              <li><span className="text-slate-300">Relojes:</span> Automáticos, sumergibles y de colección</li>
              <li><span className="text-slate-300">Básicos:</span> Electrodomésticos y artículos para el hogar</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
              Modalidades de Compra y Oferta
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><span className="text-slate-300 font-medium">1. Puja en Córdobas:</span> Compite agregando precio a la subasta.</li>
              <li><span className="text-slate-300 font-medium">2. Oferta Directa:</span> Proponle tu precio en Córdobas al vendedor.</li>
              <li><span className="text-slate-300 font-medium">3. Precio Fijo (Comprar Ya):</span> Adjudicación inmediata sin esperas.</li>
              <li><span className="text-slate-300 font-medium">4. Precio Mínimo:</span> Protección de valor suelo para el vendedor.</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
              Cobertura en Nicaragua
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Managua · León · Masaya · Estelí · Granada · Matagalpa</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Verificación de cédula y teléfono</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Atención a compradores y vendedores:<br />
                soporte@subastapro.ni · WhatsApp: +505 8892-4120
              </p>
            </div>
          </div>
        </div>

        {/* Quiet Copyright Row */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} SubastaPro Nicaragua. Todos los precios expresados en Córdobas (C$ - NIO).
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-slate-300">Términos de Subasta</a>
            <a href="#" className="hover:text-slate-300">Protección al Comprador</a>
            <a href="#" className="hover:text-slate-300">Guía para Vendedores</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
