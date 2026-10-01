export type AuctionCategory = 
  | 'motos' 
  | 'carros' 
  | 'telefonos' 
  | 'cadenas' 
  | 'relojes' 
  | 'basicos';

export interface BidRecord {
  id: string;
  bidder: string;
  bidderId: string;
  amount: number; // en Córdobas (C$)
  timestamp: string;
  isAutoBid?: boolean;
  isCurrentUser?: boolean;
}

export interface DirectOffer {
  id: string;
  auctionId: string;
  buyerName: string;
  buyerId: string;
  amount: number; // en Córdobas (C$)
  message?: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  counterAmount?: number;
  isCurrentUser?: boolean;
}

export interface SellerInfo {
  name: string;
  location: string; // ej. Managua, Masaya, León, Estelí
  phone?: string;
  rating: number;
  salesCount: number;
  verified: boolean;
  isCurrentUser?: boolean;
}

export interface AuctionItem {
  id: string;
  lotNumber: number;
  title: string;
  subtitle: string;
  category: AuctionCategory;
  categoryLabel: string;
  image: string;
  additionalImages?: string[];
  description: string;
  condition: string;
  provenance: string; // Procedencia / Ubicación en Nicaragua
  specifications: { label: string; value: string }[];

  // ESTRUCTURA DE 4 PRECIOS EN CÓRDOBAS (C$)
  startingBid: number;        // Precio inicial / base
  currentBid: number;         // Precio de subasta actual
  minReservePrice: number;    // Precio mínimo (Reserva obligatoria para adjudicar)
  isReserveMet: boolean;      // Si la puja actual superó el precio mínimo
  maxDirectPrice: number;     // Precio máximo estimado / Tope de puja recomendada
  fixedPrice?: number;        // Precio fijo ("Comprar Ya" - Venta directa inmediata)
  bidIncrement: number;       // Incremento mínimo entre pujas

  // OFERTAS DIRECTAS NEGOCIABLES
  directOffers: DirectOffer[];
  allowOffers?: boolean;      // Si el vendedor acepta ofertas negociables

  // MÉTRICAS
  bidsCount: number;
  bidsHistory: BidRecord[];
  endTime: number;            // Timestamp en ms
  startTime: number;
  status: 'live' | 'upcoming' | 'ended' | 'sold_direct';
  winner?: string | null;
  winnerAmount?: number;
  featured?: boolean;
  seller: SellerInfo;
  views: number;
  year?: number;
}

export interface UserBid {
  auctionId: string;
  lotNumber: number;
  itemTitle: string;
  categoryLabel: string;
  amount: number;
  maxAutoBid?: number;
  status: 'winning' | 'outbid' | 'won' | 'lost';
  timestamp: string;
  image: string;
  endTime: number;
}

export interface UserPurchase {
  id: string;
  auctionId: string;
  itemTitle: string;
  price: number;
  date: string;
  type: 'subasta_ganada' | 'precio_fijo' | 'oferta_aceptada';
  image: string;
  invoiceNumber: string;
}

export interface UserProfile {
  name: string;
  email: string;
  cedula: string;
  telefono: string;
  ciudad: string;
  avatar: string;
  walletBalance: number; // Saldo en Córdobas (C$)
  frozenFunds: number;
  isVerified: boolean;
  memberSince: string;
}
