import { AuctionItem, UserProfile } from '../types/auction';

// Generated catalog images
import motoImg from '../assets/images/moto_deportiva_calle_1790872250846.jpg';
import carroImg from '../assets/images/carro_camioneta_hilux_1790872265231.jpg';
import telefonoImg from '../assets/images/telefono_smartphone_pro_1790872276641.jpg';
import cadenaImg from '../assets/images/cadena_oro_italiana_1790872291577.jpg';
import basicosImg from '../assets/images/electrodomesticos_hogar_1790872301826.jpg';
import rolexImg from '../assets/images/auction_rolex_submariner_1790871624283.jpg';
import tvImg from '../assets/images/smart_tv_salon_1790872813281.jpg';
import gshockImg from '../assets/images/reloj_deportivo_gshock_1790872824072.jpg';

const now = Date.now();
const ONE_HOUR = 3600 * 1000;
const ONE_DAY = 24 * ONE_HOUR;

export const INITIAL_AUCTIONS: AuctionItem[] = [
  {
    id: 'lote-101',
    lotNumber: 101,
    title: 'Camioneta Toyota Hilux 4x4 Doble Cabina 2.8L Turbo Diésel (2021)',
    subtitle: 'Transmisión manual 6 vel, 48,200 km, seguro y rodamiento al día, mantenimientos al día en Casa Pellas Managua',
    category: 'carros',
    categoryLabel: 'Carros & Camionetas',
    image: carroImg,
    additionalImages: [carroImg],
    description: 'Impecable Toyota Hilux año 2021 versión 4x4 motor 1GD-FTV 2.8 Turbo Diésel con 201 HP. Cero choques, mantenimientos estrictamente realizados en Casa Pellas Managua. Rines de lujo originales de 17 pulgadas, llantas todo terreno semi-nuevas, antivuelco cromado, tina plástica de fábrica, pantalla táctil con Apple CarPlay/Android Auto y cámara de retroceso. Papeles limpios listos para traspaso inmediato.',
    condition: 'Excelente - Estado de exhibición 9.8/10',
    provenance: 'Pista Jean Paul Genie, Managua, Nicaragua',
    specifications: [
      { label: 'Año de Fabricación', value: '2021' },
      { label: 'Kilometraje', value: '48,200 km certificados' },
      { label: 'Motor', value: '2.8L Turbo Diésel 1GD Intercooler' },
      { label: 'Transmisión', value: 'Manual 6 velocidades + Reversa' },
      { label: 'Tracción', value: '4x4 con selector electrónico' },
      { label: 'Documentos', value: 'Circulación, Seguro y Emisión al día (Managua)' }
    ],
    // Precios Realistas en Córdobas (Hilux 2021 vale ~$28,000 USD = C$ 1,030,000 NIO)
    startingBid: 820000,
    currentBid: 945000,
    minReservePrice: 920000,
    isReserveMet: true,
    maxDirectPrice: 1120000,
    fixedPrice: 1050000,
    bidIncrement: 5000,
    allowOffers: true,
    directOffers: [
      {
        id: 'off-1',
        auctionId: 'lote-101',
        buyerName: 'Carlos Mendieta',
        buyerId: 'usr-33',
        amount: 980000,
        message: 'Ofrezco C$ 980,000 en efectivo inmediato con traspaso en Managua hoy mismo.',
        timestamp: 'Hace 25 min',
        status: 'pending'
      }
    ],
    bidsCount: 18,
    bidsHistory: [
      { id: 'b-1', bidder: 'Transportes_Leon', bidderId: 'usr-92', amount: 945000, timestamp: 'Hace 5 min' },
      { id: 'b-2', bidder: 'Finca_Chontales', bidderId: 'usr-44', amount: 940000, timestamp: 'Hace 22 min' },
      { id: 'b-3', bidder: 'AgroInversiones_NI', bidderId: 'usr-12', amount: 935000, timestamp: 'Hace 1 h' }
    ],
    endTime: now + (2 * ONE_DAY) + (5 * ONE_HOUR) + (15 * 60 * 1000),
    startTime: now - (2 * ONE_DAY),
    status: 'live',
    featured: true,
    seller: {
      name: 'AutoLote El Progreso Managua',
      location: 'Pista Jean Paul Genie, Managua',
      phone: '+505 8890-1234',
      rating: 4.95,
      salesCount: 148,
      verified: true
    },
    views: 3120,
    year: 2021
  },
  {
    id: 'lote-102',
    lotNumber: 102,
    title: 'Moto Deportiva Pulsar NS 200 Fi ABS (2023)',
    subtitle: 'Inyección electrónica DTS-i Triple Bujía, frenos ABS ByBre, refrigeración líquida, 8,500 km recorridos',
    category: 'motos',
    categoryLabel: 'Motos',
    image: motoImg,
    additionalImages: [motoImg],
    description: 'Bajaj Pulsar NS 200 Fi modelo 2023 color azul metálico con negro. Motor 199.5 cc de 4 válvulas y 24.5 caballos de fuerza. Equipada con frenos de disco lobulados con sistema ABS en rueda delantera, suspensión monoshock Nitrox regulable, luces LED y llantas Eurogrip impecables. Cero multas, casco certificado DOT incluido y dos llaves originales.',
    condition: 'Como nueva - Único dueño con servicios de agencia',
    provenance: 'León, Nicaragua',
    specifications: [
      { label: 'Cilindrada', value: '199.5 cc DTS-i' },
      { label: 'Alimentación', value: 'Inyección Electrónica (Fi)' },
      { label: 'Frenos', value: 'Disco delantero 300 mm con ABS ByBre' },
      { label: 'Potencia', value: '24.5 HP @ 9,750 RPM' },
      { label: 'Refrigeración', value: 'Líquida (Radiador de aluminio)' },
      { label: 'Placa', value: 'LE - León al día' }
    ],
    // Precios Realistas en Córdobas (Pulsar NS200 nueva vale ~C$ 95,000; usada 2023 vale ~C$ 75,000)
    startingBid: 52000,
    currentBid: 68500,
    minReservePrice: 66000,
    isReserveMet: true,
    maxDirectPrice: 85000,
    fixedPrice: 79000,
    bidIncrement: 500,
    allowOffers: true,
    directOffers: [
      {
        id: 'off-2',
        auctionId: 'lote-102',
        buyerName: 'Javier Rocha',
        buyerId: 'usr-19',
        amount: 72000,
        message: 'Tengo C$ 72,000 listos en mano para cerrar trato hoy.',
        timestamp: 'Hace 45 min',
        status: 'pending'
      }
    ],
    bidsCount: 22,
    bidsHistory: [
      { id: 'b-4', bidder: 'Biker_Managua', bidderId: 'usr-78', amount: 68500, timestamp: 'Hace 8 min' },
      { id: 'b-5', bidder: 'Rutas_Masaya', bidderId: 'usr-11', amount: 68000, timestamp: 'Hace 38 min' }
    ],
    endTime: now + (1 * ONE_DAY) + (8 * ONE_HOUR),
    startTime: now - (3 * ONE_DAY),
    status: 'live',
    featured: true,
    seller: {
      name: 'MotoZone Nicaragua',
      location: 'León / Managua',
      phone: '+505 8456-7890',
      rating: 4.92,
      salesCount: 95,
      verified: true
    },
    views: 2150,
    year: 2023
  },
  {
    id: 'lote-103',
    lotNumber: 103,
    title: 'iPhone 15 Pro Max 256GB Titanio Natural (Sellado en Caja)',
    subtitle: 'Chip A17 Pro, cámara 48 MP con zoom 5x, batería 100%, libre de fábrica para Claro y Tigo',
    category: 'telefonos',
    categoryLabel: 'Teléfonos & Celulares',
    image: telefonoImg,
    additionalImages: [telefonoImg],
    description: 'Apple iPhone 15 Pro Max de 256GB en su acabado más cotizado: Titanio Natural. Caja totalmente sellada de fábrica con sus sellos originales intactos. Desbloqueado de origen para cualquier operadora (Claro, Tigo o internacional). Puerto USB-C de alta velocidad, pantalla Super Retina XDR de 6.7 pulgadas con ProMotion 120Hz y Dynamic Island. 1 año de garantía oficial Apple.',
    condition: 'Nuevo Sellado en Caja original de fábrica',
    provenance: 'Managua, Nicaragua (Importación oficial)',
    specifications: [
      { label: 'Capacidad', value: '256 GB NVMe' },
      { label: 'Color', value: 'Titanio Natural (Natural Titanium)' },
      { label: 'Procesador', value: 'Apple A17 Pro (3nm)' },
      { label: 'Cámara Principal', value: '48 MP + 12 MP UltraWide + 12 MP Tele 5x' },
      { label: 'Compatibilidad', value: 'Nano SIM + eSIM (Libre Claro y Tigo)' },
      { label: 'Garantía', value: '1 Año Oficial Apple Care' }
    ],
    // Precios Realistas en Córdobas (iPhone 15 Pro Max vale ~$1,150 USD = C$ 42,500 NIO)
    startingBid: 32000,
    currentBid: 38400,
    minReservePrice: 39500,
    isReserveMet: false,
    maxDirectPrice: 46000,
    fixedPrice: 43200,
    bidIncrement: 300,
    allowOffers: true,
    directOffers: [
      {
        id: 'off-3',
        auctionId: 'lote-103',
        buyerName: 'TechFan_Nica',
        buyerId: 'usr-50',
        amount: 40500,
        message: 'Ofrezco C$ 40,500 en efectivo en Galerías Santo Domingo.',
        timestamp: 'Hace 15 min',
        status: 'pending'
      }
    ],
    bidsCount: 17,
    bidsHistory: [
      { id: 'b-7', bidder: 'AppleNicaragua', bidderId: 'usr-81', amount: 38400, timestamp: 'Hace 3 min' },
      { id: 'b-8', bidder: 'Geek_Esteli', bidderId: 'usr-49', amount: 38100, timestamp: 'Hace 19 min' }
    ],
    endTime: now + (3 * ONE_DAY) + (2 * ONE_HOUR),
    startTime: now - (1 * ONE_DAY),
    status: 'live',
    featured: false,
    seller: {
      name: 'NicaStore Electrónica',
      location: 'Plaza Inter, Managua',
      phone: '+505 8712-3344',
      rating: 4.98,
      salesCount: 320,
      verified: true
    },
    views: 3400,
    year: 2024
  },
  {
    id: 'lote-104',
    lotNumber: 104,
    title: 'Cadena de Oro 14K Tejido Cubano 28 Gramos con Dije La Purísima',
    subtitle: 'Oro sólido amarillo 14 quilates (585/1000), 55 cm de largo, 5.5 mm de grosor, broche de caja con doble seguro',
    category: 'cadenas',
    categoryLabel: 'Cadenas & Joyas',
    image: cadenaImg,
    additionalImages: [cadenaImg],
    description: 'Cadena de eslabón cubano fabricada en oro amarillo macizo de 14 quilates garantizado (no es laminado ni fantasía). Peso neto de 28.5 gramos pesados en báscula de precisión. Acompañada de hermoso dije tallado de la Virgen de la Purísima Concepción con detalles diamantados. Acabado brillante de alta joyería con broche de caja y doble tranca lateral de máxima seguridad.',
    condition: 'Excelente estado, recién pulida por maestro joyero',
    provenance: 'Masaya, Nicaragua (Cuna del arte y la orfebrería)',
    specifications: [
      { label: 'Metal', value: 'Oro Amarillo 14K (585) Sólido' },
      { label: 'Peso Total', value: '28.5 Gramos verificados' },
      { label: 'Largo', value: '55 cm' },
      { label: 'Grosor', value: '5.5 mm' },
      { label: 'Broche', value: 'Caja con dos seguros laterales' },
      { label: 'Certificado', value: 'Prueba de ácido y balanza certificada' }
    ],
    // Precios Realistas en Córdobas (28.5g de 14k a ~$48 USD/g = C$ 50,000 NIO)
    startingBid: 36000,
    currentBid: 46500,
    minReservePrice: 44000,
    isReserveMet: true,
    maxDirectPrice: 58000,
    fixedPrice: 53000,
    bidIncrement: 500,
    allowOffers: true,
    directOffers: [
      {
        id: 'off-cad-1',
        auctionId: 'lote-104',
        buyerName: 'Roberto Solís',
        buyerId: 'usr-89',
        amount: 48000,
        message: 'Ofrezco C$ 48,000 en efectivo en Masaya.',
        timestamp: 'Hace 1 hora',
        status: 'pending'
      }
    ],
    bidsCount: 15,
    bidsHistory: [
      { id: 'b-9', bidder: 'Joyas_Granada', bidderId: 'usr-33', amount: 46500, timestamp: 'Hace 11 min' },
      { id: 'b-10', bidder: 'OroPuro_NI', bidderId: 'usr-87', amount: 46000, timestamp: 'Hace 40 min' }
    ],
    endTime: now + (2 * ONE_DAY) + (14 * ONE_HOUR),
    startTime: now - (2 * ONE_DAY),
    status: 'live',
    featured: false,
    seller: {
      name: 'Joyería La Fe Masaya',
      location: 'Mercado de Artesanías, Masaya',
      phone: '+505 8920-5566',
      rating: 4.96,
      salesCount: 210,
      verified: true
    },
    views: 2200
  },
  {
    id: 'lote-105',
    lotNumber: 105,
    title: 'Smart TV 50 Pulgadas 4K Ultra HD con Google TV y Dolby Audio',
    subtitle: 'Diseño sin marcos, WiFi doble banda, Bluetooth 5.1, control por voz, nuevo de paquete con 1 año de garantía',
    category: 'basicos',
    categoryLabel: 'Productos Básicos & Hogar',
    image: tvImg,
    additionalImages: [tvImg],
    description: 'Televisor inteligente de última generación de 50 pulgadas resolución 4K UHD (3840 x 2160) con panel HDR10+ de colores ultra realistas. Sistema operativo Google TV fluido con acceso a Netflix, YouTube, Disney+, Max y miles de aplicaciones. 3 puertos HDMI 2.1 (compatibles con PS5 y Xbox), 2 puertos USB, entrada óptica y salida de audio. Nuevo en su caja sellada con soporte de mesa y control con asistente de Google.',
    condition: 'Completamente nuevo en caja sellada con factura y garantía',
    provenance: 'Managua, Nicaragua',
    specifications: [
      { label: 'Pantalla', value: '50" 4K Ultra HD LED HDR10' },
      { label: 'Sistema', value: 'Google TV con Chromecast integrado' },
      { label: 'Audio', value: '20W Dolby Audio & DTS Virtual:X' },
      { label: 'Conectividad', value: '3x HDMI, 2x USB, WiFi 5GHz, Bluetooth' },
      { label: 'Garantía', value: '12 meses con taller autorizado en Managua' }
    ],
    // Precios Realistas en Córdobas (Smart TV 50" vale ~C$ 13,000 - C$ 14,000 en el mercado)
    startingBid: 8200,
    currentBid: 11300,
    minReservePrice: 10800,
    isReserveMet: true,
    maxDirectPrice: 15500,
    fixedPrice: 13800,
    bidIncrement: 200,
    allowOffers: true,
    directOffers: [],
    bidsCount: 16,
    bidsHistory: [
      { id: 'b-tv-1', bidder: 'Marcos_Esteli', bidderId: 'usr-61', amount: 11300, timestamp: 'Hace 6 min' },
      { id: 'b-tv-2', bidder: 'Familia_Castillo', bidderId: 'usr-22', amount: 11100, timestamp: 'Hace 32 min' }
    ],
    endTime: now + (1 * ONE_DAY) + (16 * ONE_HOUR),
    startTime: now - (2 * ONE_DAY),
    status: 'live',
    featured: false,
    seller: {
      name: 'ElectroHogar Nicaragua',
      location: 'Centro Comercial Managua',
      phone: '+505 8511-9900',
      rating: 4.93,
      salesCount: 185,
      verified: true
    },
    views: 1890,
    year: 2024
  },
  {
    id: 'lote-106',
    lotNumber: 106,
    title: 'Reloj Deportivo Casio G-Shock Tough Solar Resistente al Agua 200M',
    subtitle: 'Carga solar automática, hora mundial 48 ciudades, cronómetro de precisión, luz LED automática',
    category: 'relojes',
    categoryLabel: 'Relojes',
    image: gshockImg,
    additionalImages: [gshockImg],
    description: 'Auténtico reloj táctico deportivo Casio G-Shock con tecnología Tough Solar que se recarga con la luz solar o artificial, eliminando la necesidad de cambiar batería. Carcasa reforzada con estructura de carbono ultra resistente a impactos, caídas, lodo y agua hasta 200 metros (20 BAR). Formato ana-digi de alta legibilidad, 5 alarmas diarias, temporizador y cristal mineral endurecido.',
    condition: 'Nuevo en su lata original hexagonal Casio con manual',
    provenance: 'Managua / Chinandega, Nicaragua',
    specifications: [
      { label: 'Marca / Modelo', value: 'Casio G-Shock Tough Solar Original' },
      { label: 'Hermeticidad', value: '200 metros (20 ATM) apto buceo' },
      { label: 'Batería', value: 'Solar recargable permanente' },
      { label: 'Cristal', value: 'Mineral resistente a rayaduras' },
      { label: 'Funciones', value: 'Hora mundial, 5 alarmas, luz LED, calendario' }
    ],
    // Precios Realistas en Córdobas (G-Shock Tough Solar vale ~C$ 4,800 - C$ 5,500)
    startingBid: 2800,
    currentBid: 4100,
    minReservePrice: 3800,
    isReserveMet: true,
    maxDirectPrice: 6000,
    fixedPrice: 5200,
    bidIncrement: 100,
    allowOffers: true,
    directOffers: [],
    bidsCount: 13,
    bidsHistory: [
      { id: 'b-g-1', bidder: 'Deportista_Nica', bidderId: 'usr-15', amount: 4100, timestamp: 'Hace 14 min' },
      { id: 'b-g-2', bidder: 'Chinandega_Tactical', bidderId: 'usr-38', amount: 4000, timestamp: 'Hace 1 hora' }
    ],
    endTime: now + (2 * ONE_DAY) + (6 * ONE_HOUR),
    startTime: now - (1 * ONE_DAY),
    status: 'live',
    featured: false,
    seller: {
      name: 'TimeStore Nicaragua',
      location: 'Metrocentro, Managua',
      phone: '+505 8744-1122',
      rating: 4.97,
      salesCount: 140,
      verified: true
    },
    views: 1250
  },
  {
    id: 'lote-107',
    lotNumber: 107,
    title: 'Combo Cocina: Microondas Digital 1.1 cu.ft, Licuadora 800W y Cafetera 12 Tazas',
    subtitle: 'Paquete de electrodomésticos en acero inoxidable, bajo consumo eléctrico 110V estándar, nuevos en caja',
    category: 'basicos',
    categoryLabel: 'Productos Básicos & Hogar',
    image: basicosImg,
    additionalImages: [basicosImg],
    description: 'Kit completo de electrodomésticos de cocina de alta calidad. Incluye: 1) Horno Microondas Digital de 1.1 pies cúbicos en acero inoxidable con 10 niveles de potencia y descongelamiento automático; 2) Licuadora de alto rendimiento con vaso de vidrio templado de 1.5 litros y 6 cuchillas trituradoras de hielo; 3) Cafetera programable de 12 tazas con filtro permanente lavable. Garantía de 12 meses por escrito.',
    condition: 'Totalmente nuevo de paquete con sus manuales y cajas',
    provenance: 'Mercado Oriental / Ciudad Jardín, Managua',
    specifications: [
      { label: 'Voltaje', value: '110V / 60 Hz estándar Nicaragua' },
      { label: 'Microondas', value: '1.1 cu. ft. 1000 Watts acero inoxidable' },
      { label: 'Licuadora', value: 'Motor 800W, vaso de vidrio reforzado' },
      { label: 'Cafetera', value: '12 Tazas con función pausa para servir' },
      { label: 'Garantía', value: '1 Año con centro de servicio autorizado' }
    ],
    // Precios Realistas en Córdobas (Combo de 3 electrodomésticos vale ~C$ 5,800 - C$ 6,500)
    startingBid: 3200,
    currentBid: 4700,
    minReservePrice: 4400,
    isReserveMet: true,
    maxDirectPrice: 7000,
    fixedPrice: 6100,
    bidIncrement: 100,
    allowOffers: true,
    directOffers: [],
    bidsCount: 19,
    bidsHistory: [
      { id: 'b-13', bidder: 'Familia_Ruiz', bidderId: 'usr-71', amount: 4700, timestamp: 'Hace 14 min' },
      { id: 'b-14', bidder: 'Comedor_ElBuenSabor', bidderId: 'usr-28', amount: 4600, timestamp: 'Hace 1 hora' }
    ],
    endTime: now + (4 * ONE_HOUR) + (45 * 60 * 1000),
    startTime: now - (3 * ONE_DAY),
    status: 'live',
    featured: false,
    seller: {
      name: 'Comercial Hogar & Más',
      location: 'Ciudad Jardín, Managua',
      phone: '+505 8677-8899',
      rating: 4.89,
      salesCount: 450,
      verified: true
    },
    views: 1680
  },
  {
    id: 'lote-108',
    lotNumber: 108,
    title: 'Reloj Suizo de Colección Rolex Submariner Date Acero Oystersteel',
    subtitle: 'Calibre automático Rolex 3135 cronómetro certificado, bisel cerámico Cerachrom, estuche y papeles',
    category: 'relojes',
    categoryLabel: 'Relojes',
    image: rolexImg,
    additionalImages: [rolexImg],
    description: 'Reloj de submarinismo profesional fabricado en acero Oystersteel 904L de alta resistencia. Diámetro de caja de 40 mm, hermético hasta 300 metros de profundidad. Cristal de zafiro irrayable con lente Cyclops de aumento sobre la fecha. Brazalete Oyster con cierre Glidelock de ajuste fino sin herramientas. Acompañado de su estuche verde Rolex, folletos y tarjeta de garantía.',
    condition: 'Impecable estado 9.8/10, funcionamiento cronométrico',
    provenance: 'Carretera a Masaya, Managua, Nicaragua',
    specifications: [
      { label: 'Marca / Modelo', value: 'Rolex Submariner Date Ref. 116610LN' },
      { label: 'Movimiento', value: 'Automático Calibre Rolex 3135' },
      { label: 'Material', value: 'Acero Oystersteel (904L)' },
      { label: 'Bisel', value: 'Giratorio unidireccional Cerachrom negro' },
      { label: 'Hermeticidad', value: '300 metros / 1,000 pies' },
      { label: 'Reserva de Marcha', value: '48 horas' }
    ],
    // Precios Realistas en Córdobas (Rolex Submariner vale ~$9,500 - $11,000 USD = C$ 350,000 - C$ 400,000 NIO)
    startingBid: 240000,
    currentBid: 310000,
    minReservePrice: 325000,
    isReserveMet: false,
    maxDirectPrice: 420000,
    fixedPrice: 390000,
    bidIncrement: 2500,
    allowOffers: true,
    directOffers: [
      {
        id: 'off-4',
        auctionId: 'lote-108',
        buyerName: 'Coleccionista_Nica',
        buyerId: 'usr-02',
        amount: 340000,
        message: 'Ofrezco C$ 340,000 con cheque de gerencia certificado.',
        timestamp: 'Hace 1 hora',
        status: 'pending'
      }
    ],
    bidsCount: 15,
    bidsHistory: [
      { id: 'b-11', bidder: 'RelojeriaSuiza_NI', bidderId: 'usr-90', amount: 310000, timestamp: 'Hace 7 min' },
      { id: 'b-12', bidder: 'InversionesCaribe', bidderId: 'usr-14', amount: 307500, timestamp: 'Hace 45 min' }
    ],
    endTime: now + (1 * ONE_DAY) + (4 * ONE_HOUR),
    startTime: now - (4 * ONE_DAY),
    status: 'live',
    featured: false,
    seller: {
      name: 'Horología & Tiempo SA',
      location: 'Carretera a Masaya km 4.5, Managua',
      phone: '+505 8333-2211',
      rating: 4.99,
      salesCount: 88,
      verified: true
    },
    views: 4500,
    year: 2018
  }
];

export const INITIAL_USER: UserProfile = {
  name: 'Arturo Morales',
  email: 'arturo.morales@subastapro.ni',
  cedula: '001-140889-0042K',
  telefono: '+505 8892-4120',
  ciudad: 'Managua, Nicaragua',
  avatar: '',
  walletBalance: 145000, // C$ 145,000 Córdobas listos para ofertar o comprar
  frozenFunds: 0,
  isVerified: true,
  memberSince: 'Octubre 2024'
};
