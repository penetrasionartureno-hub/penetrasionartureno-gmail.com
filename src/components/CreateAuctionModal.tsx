import React, { useState, useRef } from 'react';
import { X, Upload, Plus, Image as ImageIcon, DollarSign, Camera, MapPin, CheckCircle2 } from 'lucide-react';
import { AuctionCategory, AuctionItem } from '../types/auction';
import { useAuction } from '../context/AuctionContext';
import { formatCordobas } from '../utils/currency';

// Generated presets
import motoImg from '../assets/images/moto_deportiva_calle_1790872250846.jpg';
import carroImg from '../assets/images/carro_camioneta_hilux_1790872265231.jpg';
import telefonoImg from '../assets/images/telefono_smartphone_pro_1790872276641.jpg';
import cadenaImg from '../assets/images/cadena_oro_italiana_1790872291577.jpg';
import basicosImg from '../assets/images/electrodomesticos_hogar_1790872301826.jpg';
import rolexImg from '../assets/images/auction_rolex_submariner_1790871624283.jpg';

interface CreateAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_IMAGES = [
  { label: 'Moto', category: 'motos', url: motoImg },
  { label: 'Carro / Hilux', category: 'carros', url: carroImg },
  { label: 'Teléfono', category: 'telefonos', url: telefonoImg },
  { label: 'Cadena de Oro', category: 'cadenas', url: cadenaImg },
  { label: 'Reloj', category: 'relojes', url: rolexImg },
  { label: 'Básicos / Hogar', category: 'basicos', url: basicosImg },
];

const DEPARTAMENTOS_NICARAGUA = [
  'Managua',
  'León',
  'Masaya',
  'Granada',
  'Matagalpa',
  'Estelí',
  'Chinandega',
  'Rivas',
  'Chontales',
  'Jinotega',
  'Carazo',
  'Madriz',
  'Nueva Segovia',
  'Río San Juan',
  'RACCN (Costa Caribe Norte)',
  'RACCS (Costa Caribe Sur)'
];

export const CreateAuctionModal: React.FC<CreateAuctionModalProps> = ({ isOpen, onClose }) => {
  const { createAuction, user } = useAuction();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<AuctionCategory>('motos');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('Excelente (Como nuevo)');
  const [ciudad, setCiudad] = useState('Managua');
  const [telefonoContacto, setTelefonoContacto] = useState(user.telefono || '+505 8892-4120');
  const [allowOffers, setAllowOffers] = useState<boolean>(true);

  // Selected image (either custom uploaded file base64 or preset)
  const [imagePreview, setImagePreview] = useState<string>(motoImg);
  const [isCustomUploaded, setIsCustomUploaded] = useState<boolean>(false);

  // The 4 Pricing Fields in Córdobas (C$)
  const [startingBid, setStartingBid] = useState<number>(35000);
  const [minReservePrice, setMinReservePrice] = useState<number>(45000);
  const [maxDirectPrice, setMaxDirectPrice] = useState<number>(60000);
  const [hasFixedPrice, setHasFixedPrice] = useState<boolean>(true);
  const [fixedPrice, setFixedPrice] = useState<number>(55000);
  const [bidIncrement, setBidIncrement] = useState<number>(500);
  const [durationDays, setDurationDays] = useState<number>(3);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  // Handle local file upload (From user device / gallery / camera)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImagePreview(reader.result);
          setIsCustomUploaded(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Switch category presets default values
  const handleCategoryChange = (cat: AuctionCategory) => {
    setCategory(cat);
    const matchingPreset = PRESET_IMAGES.find((p) => p.category === cat);
    if (matchingPreset && !isCustomUploaded) {
      setImagePreview(matchingPreset.url);
    }

    // Smart default price suggestions in Córdobas according to category
    if (cat === 'motos') {
      setStartingBid(35000);
      setMinReservePrice(45000);
      setMaxDirectPrice(60000);
      setFixedPrice(55000);
      setBidIncrement(500);
    } else if (cat === 'carros') {
      setStartingBid(280000);
      setMinReservePrice(350000);
      setMaxDirectPrice(480000);
      setFixedPrice(440000);
      setBidIncrement(2500);
    } else if (cat === 'telefonos') {
      setStartingBid(12000);
      setMinReservePrice(16000);
      setMaxDirectPrice(25000);
      setFixedPrice(22000);
      setBidIncrement(200);
    } else if (cat === 'cadenas') {
      setStartingBid(18000);
      setMinReservePrice(24000);
      setMaxDirectPrice(36000);
      setFixedPrice(32000);
      setBidIncrement(300);
    } else if (cat === 'relojes') {
      setStartingBid(15000);
      setMinReservePrice(20000);
      setMaxDirectPrice(32000);
      setFixedPrice(28000);
      setBidIncrement(250);
    } else if (cat === 'basicos') {
      setStartingBid(1500);
      setMinReservePrice(2200);
      setMaxDirectPrice(3800);
      setFixedPrice(3200);
      setBidIncrement(50);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim()) {
      setError('Por favor escribe el título y la descripción del producto.');
      return;
    }

    if (minReservePrice < startingBid) {
      setError('El precio mínimo de reserva no puede ser menor al precio inicial de salida.');
      return;
    }

    if (maxDirectPrice < minReservePrice) {
      setError('El precio máximo estimado debe ser superior al precio mínimo de reserva.');
      return;
    }

    if (hasFixedPrice && fixedPrice < minReservePrice) {
      setError('El precio fijo de compra directa debe ser al menos igual o mayor al precio mínimo de reserva.');
      return;
    }

    const categoryLabels: Record<AuctionCategory, string> = {
      motos: 'Motos',
      carros: 'Carros',
      telefonos: 'Teléfonos',
      cadenas: 'Cadenas y Joyas',
      relojes: 'Relojes',
      basicos: 'Productos Básicos y Hogar',
    };

    const now = Date.now();
    const durationMs = durationDays * 24 * 3600 * 1000;

    createAuction({
      title,
      subtitle: subtitle || `Producto publicado por vendedor particular en ${ciudad}, Nicaragua.`,
      category,
      categoryLabel: categoryLabels[category],
      image: imagePreview,
      description,
      condition,
      provenance: `${ciudad}, Nicaragua. Entrega personal coordinada.`,
      specifications: [
        { label: 'Categoría', value: categoryLabels[category] },
        { label: 'Estado', value: condition },
        { label: 'Ubicación', value: ciudad },
        { label: 'Contacto Vendedor', value: telefonoContacto },
        { label: 'Moneda Oficial', value: 'Córdobas Nicaragüenses (C$)' },
      ],
      startingBid,
      currentBid: startingBid,
      minReservePrice,
      isReserveMet: false,
      maxDirectPrice,
      fixedPrice: hasFixedPrice ? fixedPrice : undefined,
      bidIncrement,
      allowOffers,
      startTime: now,
      endTime: now + durationMs,
      status: 'live',
      featured: false,
      seller: {
        name: user.name,
        location: `${ciudad}, Nicaragua`,
        phone: telefonoContacto,
        rating: 5.0,
        salesCount: 1,
        verified: user.isVerified,
        isCurrentUser: true,
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Publicar Producto en SubastaPro Nicaragua
            </h3>
            <p className="text-xs text-slate-400">
              Vende motos, carros, teléfonos, cadenas, relojes o productos básicos en Córdobas (C$).
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/70 border border-rose-500/40 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              ¿Qué tipo de producto vas a vender? *
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { id: 'motos', label: 'Moto' },
                { id: 'carros', label: 'Carro' },
                { id: 'telefonos', label: 'Teléfono' },
                { id: 'cadenas', label: 'Cadena/Joya' },
                { id: 'relojes', label: 'Reloj' },
                { id: 'basicos', label: 'Básicos/Hogar' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleCategoryChange(item.id as AuctionCategory)}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    category === item.id
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="text-xs block">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Título del Producto *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Moto Génesis HJ 125cc 2022 o Cadena de Oro 14K con dije"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Subtítulo / Breve resumen
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Ej: Al día con papeles, poco kilometraje"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Departamento / Ciudad en Nicaragua *
                </label>
                <select
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {DEPARTAMENTOS_NICARAGUA.map((dep) => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* REAL IMAGE UPLOAD & PRESETS */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-amber-400" />
                <span>Foto del Producto</span>
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-500/40 hover:bg-amber-400/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Subir de Mi Celular / PC</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Preview image */}
            <div className="flex items-center gap-4">
              <div className="relative w-28 h-20 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 shrink-0">
                <img src={imagePreview} alt="Vista previa" className="w-full h-full object-cover" />
              </div>
              <div className="text-xs text-slate-400 space-y-1">
                <span className="font-semibold text-slate-200 block">
                  {isCustomUploaded ? '✓ Foto personalizada cargada con éxito' : 'Foto predeterminada de catálogo'}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  O elige una de las fotos profesionales de muestra:
                </span>
                <div className="flex gap-1.5 flex-wrap pt-1">
                  {PRESET_IMAGES.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setImagePreview(p.url);
                        setIsCustomUploaded(false);
                      }}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 hover:border-amber-400 text-slate-300"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* THE 4 REQUIRED PRICING CONFIGURATOR IN CÓRDOBAS (C$) */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Estructura de los 4 Precios en Córdobas (C$)
              </h4>
              <span className="text-[10px] text-sky-400 font-mono">Moneda Oficial: NIO (C$)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1. Precio Inicial */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  1. Precio Inicial (Salida) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs font-bold">C$</span>
                  <input
                    type="number"
                    required
                    min={50}
                    value={startingBid}
                    onChange={(e) => setStartingBid(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <span className="text-[10px] text-slate-500">Primera puja válida</span>
              </div>

              {/* 2. Precio Mínimo (Reserva) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  2. Precio Mínimo (Reserva Obligatoria) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs font-bold">C$</span>
                  <input
                    type="number"
                    required
                    min={startingBid}
                    value={minReservePrice}
                    onChange={(e) => setMinReservePrice(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <span className="text-[10px] text-slate-500">No se vende por debajo de este monto</span>
              </div>

              {/* 3. Precio Máximo Estimado */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  3. Precio Máximo Estimado *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs font-bold">C$</span>
                  <input
                    type="number"
                    required
                    min={minReservePrice}
                    value={maxDirectPrice}
                    onChange={(e) => setMaxDirectPrice(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <span className="text-[10px] text-slate-500">Tope sugerido de valor</span>
              </div>

              {/* 4. Precio Fijo (Comprar Ya) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-emerald-400">
                    4. Precio Fijo ("Comprar Ya")
                  </label>
                  <label className="flex items-center gap-1 text-[10px] text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasFixedPrice}
                      onChange={(e) => setHasFixedPrice(e.target.checked)}
                      className="w-3 h-3 rounded border-slate-700 bg-slate-900 text-emerald-500"
                    />
                    <span>Activar</span>
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs font-bold">C$</span>
                  <input
                    type="number"
                    disabled={!hasFixedPrice}
                    value={fixedPrice}
                    onChange={(e) => setFixedPrice(Number(e.target.value))}
                    className={`w-full pl-9 pr-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-slate-900 border border-slate-800 focus:outline-none focus:border-emerald-400 ${
                      hasFixedPrice ? 'text-emerald-300' : 'text-slate-600 opacity-50'
                    }`}
                  />
                </div>
                <span className="text-[10px] text-slate-500">Compra inmediata sin subasta</span>
              </div>
            </div>

            {/* Increment and Duration */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/60">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Incremento Mínimo por Puja</label>
                <select
                  value={bidIncrement}
                  onChange={(e) => setBidIncrement(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs rounded bg-slate-900 border border-slate-800 text-slate-200"
                >
                  <option value={50}>+C$ 50</option>
                  <option value={100}>+C$ 100</option>
                  <option value={250}>+C$ 250</option>
                  <option value={500}>+C$ 500</option>
                  <option value={1000}>+C$ 1,000</option>
                  <option value={2500}>+C$ 2,500</option>
                  <option value={5000}>+C$ 5,000</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Duración en Sala</label>
                <select
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs rounded bg-slate-900 border border-slate-800 text-slate-200"
                >
                  <option value={1}>1 Día (Rápida)</option>
                  <option value={3}>3 Días</option>
                  <option value={5}>5 Días</option>
                  <option value={7}>7 Días (Recomendada)</option>
                </select>
              </div>
            </div>

            {/* Direct Offer option */}
            <div className="pt-2 border-t border-slate-800/60">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowOffers}
                  onChange={(e) => setAllowOffers(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-sky-400"
                />
                <span className="font-medium text-sky-300">
                  Permitir que los compradores hagan ofertas directas que yo pueda negociar
                </span>
              </label>
            </div>
          </div>

          {/* Description & Contact */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Descripción Completa del Producto *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe el estado, detalles mecánicos o estéticos, accesorios incluidos y forma de entrega..."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Estado de Conservación
                </label>
                <input
                  type="text"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  placeholder="Ej: Como nuevo / Poco uso"
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Teléfono / WhatsApp de Contacto
                </label>
                <input
                  type="text"
                  value={telefonoContacto}
                  onChange={(e) => setTelefonoContacto(e.target.value)}
                  placeholder="+505 8888-0000"
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
            >
              Publicar Mi Producto Ahora
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
