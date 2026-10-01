import React from 'react';
import { Search, SlidersHorizontal, Check, Zap, CheckCircle2, MessageSquare } from 'lucide-react';
import { AuctionCategory } from '../types/auction';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  onlyFixedPrice: boolean;
  onToggleFixedPrice: () => void;
  onlyReserveMet: boolean;
  onToggleReserveMet: () => void;
  onlyOffers: boolean;
  onToggleOffers: () => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalCount: number;
}

const CATEGORIES: { id: string; label: string }[] = [
  { id: 'all', label: 'Todos los Productos' },
  { id: 'motos', label: 'Motos' },
  { id: 'carros', label: 'Carros' },
  { id: 'telefonos', label: 'Teléfonos' },
  { id: 'cadenas', label: 'Cadenas y Joyas' },
  { id: 'relojes', label: 'Relojes' },
  { id: 'basicos', label: 'Productos Básicos' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onlyFixedPrice,
  onToggleFixedPrice,
  onlyReserveMet,
  onToggleReserveMet,
  onlyOffers,
  onToggleOffers,
  sortBy,
  onSortChange,
  totalCount
}) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Top search and sorting row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar motos, carros, teléfonos, cadenas, relojes..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        {/* Filter toggles & Sorting */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle: Acepta Ofertas */}
          <button
            onClick={onToggleOffers}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
              onlyOffers
                ? 'bg-sky-950/70 border-sky-500/60 text-sky-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
            <span>Hacer Ofertas</span>
            {onlyOffers && <Check className="w-3 h-3 text-sky-400 ml-0.5" />}
          </button>

          {/* Toggle: Solo con Precio Fijo / Compra Ya */}
          <button
            onClick={onToggleFixedPrice}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
              onlyFixedPrice
                ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Compra Ya (Precio Fijo)</span>
            {onlyFixedPrice && <Check className="w-3 h-3 text-emerald-400 ml-0.5" />}
          </button>

          {/* Toggle: Solo con Reserva Superada */}
          <button
            onClick={onToggleReserveMet}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
              onlyReserveMet
                ? 'bg-amber-950/60 border-amber-500/60 text-amber-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Reserva Alcanzada</span>
            {onlyReserveMet && <Check className="w-3 h-3 text-amber-400 ml-0.5" />}
          </button>

          {/* Sort dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 rounded-lg px-2.5 py-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer pr-1"
            >
              <option value="closing_soon" className="bg-slate-900 text-slate-200">Cierre más próximo</option>
              <option value="price_desc" className="bg-slate-900 text-slate-200">Puja: Mayor a menor (C$)</option>
              <option value="price_asc" className="bg-slate-900 text-slate-200">Puja: Menor a mayor (C$)</option>
              <option value="bids_count" className="bg-slate-900 text-slate-200">Más pujas registradas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category segmented filter bar */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 border-b border-slate-800/80 scrollbar-none">
        <div className="flex items-center gap-1.5 py-1">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/10 border border-amber-500/40 text-amber-300'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-500 whitespace-nowrap hidden sm:block">
          Mostrando <span className="font-mono text-slate-300 font-semibold">{totalCount}</span> productos disponibles
        </div>
      </div>
    </div>
  );
};
