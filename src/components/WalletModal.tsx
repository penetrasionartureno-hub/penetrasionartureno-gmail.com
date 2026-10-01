import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  Building2, 
  Smartphone, 
  Copy, 
  Check, 
  Loader2, 
  QrCode, 
  ExternalLink,
  Receipt
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuction } from '../context/AuctionContext';
import { formatCordobas } from '../utils/currency';
import { soundFx } from '../utils/audio';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaymentMethodType = 'paypal' | 'binance' | 'banpro' | 'billetera' | 'transferencia' | 'tarjeta';

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { user, depositFunds, addToast } = useAuction();
  
  const [amount, setAmount] = useState<number>(5000);
  const [method, setMethod] = useState<PaymentMethodType>('paypal');
  
  // Specific method inputs
  const [paypalEmail, setPaypalEmail] = useState<string>(user.email || 'arturo.morales@gmail.com');
  const [binanceTxHash, setBinanceTxHash] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>(user.telefono || '+505 8892-4120');
  const [smsCode, setSmsCode] = useState<string>('5058');
  const [smsSent, setSmsSent] = useState<boolean>(false);
  const [banproVoucher, setBanproVoucher] = useState<string>('BAN-94821');
  const [bankRef, setBankRef] = useState<string>('BAC-TRF-1029');
  const [cardNumber, setCardNumber] = useState<string>('4111 8290 3412 8820');
  const [cardExp, setCardExp] = useState<string>('08/28');
  const [cardCvv, setCardCvv] = useState<string>('420');

  // Interactive processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [receiptData, setReceiptData] = useState<{
    id: string;
    amount: number;
    methodName: string;
    date: string;
  } | null>(null);

  const [copiedItem, setCopiedItem] = useState<string>('');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(''), 2000);
  };

  // 1 USD ~ 36.80 NIO Córdobas
  const amountInUSD = (amount / 36.80).toFixed(2);

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    setIsProcessing(true);
    setProcessingStep('Conectando con la pasarela de pagos segura...');

    setTimeout(() => {
      if (method === 'paypal') {
        setProcessingStep('Verificando fondos en cuenta PayPal...');
      } else if (method === 'binance') {
        setProcessingStep('Confirmando recepción en red Binance Smart Chain (USDT)...');
      } else if (method === 'banpro') {
        setProcessingStep('Validando código de ficha y convenio en Agente Banpro...');
      } else if (method === 'billetera') {
        setProcessingStep('Validando PIN de seguridad de Billetera Móvil...');
      } else if (method === 'transferencia') {
        setProcessingStep('Comprobando acreditación interbancaria en Nicaragua...');
      } else {
        setProcessingStep('Autorizando transacción bancaria con 3D Secure...');
      }
    }, 800);

    setTimeout(() => {
      // Execute wallet credit
      depositFunds(amount);
      soundFx.playGavelHammer();
      
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0066cc', '#fbbf24', '#ffffff', '#10b981']
        });
      } catch {
        // fallback
      }

      const methodNames: Record<PaymentMethodType, string> = {
        paypal: 'PayPal Internacional',
        binance: 'Binance Pay / Cripto USDT',
        banpro: 'Agente Banpro (Ficha Digital)',
        billetera: 'Billetera Móvil (Claro Pay / Tigo Money)',
        transferencia: 'Transferencia Bancaria Nacional',
        tarjeta: 'Tarjeta de Débito/Crédito'
      };

      setReceiptData({
        id: `REC-NI-${Math.floor(100000 + Math.random() * 900000)}`,
        amount,
        methodName: methodNames[method],
        date: new Date().toLocaleTimeString('es-NI', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });

      setIsProcessing(false);
    }, 1800);
  };

  const handleDone = () => {
    setReceiptData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Recargar Cartera en Córdobas</h3>
              <p className="text-[11px] text-slate-400">PayPal, Binance Pay, Agente Banpro, Ficha Digital y Bancos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PROCESSING SCREEN */}
        {isProcessing ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto animate-spin">
              <Loader2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-semibold text-white font-display">Procesando Recarga Segura</h4>
            <p className="text-xs text-amber-300 font-mono animate-pulse">
              {processingStep}
            </p>
            <span className="text-[11px] text-slate-500 block">
              Monto a acreditar: <strong className="text-slate-200">{formatCordobas(amount)}</strong>
            </span>
          </div>
        ) : receiptData ? (
          /* RECEIPT / SUCCESS SCREEN */
          <div className="p-6 space-y-5 overflow-y-auto">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-white font-display">¡Acreditación Exitosa!</h4>
              <p className="text-xs text-slate-300">
                Se han acreditado fondos correctamente a tu cuenta de SubastaPro.
              </p>
            </div>

            {/* Digital Voucher */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Número de Recibo Oficial:</span>
                <span className="font-mono font-bold text-amber-400">{receiptData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Monto Acreditado:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{formatCordobas(receiptData.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Método de Pago:</span>
                <span className="text-slate-200 font-medium">{receiptData.methodName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nuevo Saldo Disponible:</span>
                <span className="font-mono font-bold text-slate-100">{formatCordobas(user.walletBalance)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-2">
                <span>Hora de Validación:</span>
                <span>{receiptData.date}</span>
              </div>
            </div>

            <button
              onClick={handleDone}
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors"
            >
              Listo, Continuar a Subastar
            </button>
          </div>
        ) : (
          /* PAYMENT FORM */
          <form onSubmit={handleProcessPayment} className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Balance Bar */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Tu Saldo en Cartera:</span>
              <span className="text-base font-bold font-mono text-amber-400">
                {formatCordobas(user.walletBalance)}
              </span>
            </div>

            {/* Amount Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Monto en Córdobas a depositar (C$)
              </label>
              <div className="grid grid-cols-4 gap-1.5 mb-2">
                {[1000, 5000, 10000, 25000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`py-1.5 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                      amount === val
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {formatCordobas(val)}
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs font-bold">C$</span>
                <input
                  type="number"
                  min={100}
                  step={100}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 text-sm font-mono font-bold rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Equivalente aproximado: <strong>${amountInUSD} USD</strong> (Tasa oficial: 1 USD = 36.80 NIO)
              </span>
            </div>

            {/* Payment Method Selector Tabs */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Selecciona tu Método de Pago
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setMethod('paypal')}
                  className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    method === 'paypal'
                      ? 'border-blue-500 bg-blue-500/20 text-blue-300 font-bold shadow-sm'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <span className="font-semibold block">PayPal</span>
                  <span className="text-[9px] text-slate-500">Dólares / Tarjeta</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('binance')}
                  className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    method === 'binance'
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold shadow-sm'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <span className="font-semibold block">Binance Pay</span>
                  <span className="text-[9px] text-slate-500">Cripto USDT</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('banpro')}
                  className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    method === 'banpro'
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold shadow-sm'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <span className="font-semibold block">Agente Banpro</span>
                  <span className="text-[9px] text-slate-500">Ficha / Efectivo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('billetera')}
                  className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    method === 'billetera'
                      ? 'border-sky-500 bg-sky-500/20 text-sky-300 font-bold shadow-sm'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <span className="font-semibold block">Billetera Móvil</span>
                  <span className="text-[9px] text-slate-500">Claro/Tigo Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('transferencia')}
                  className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    method === 'transferencia'
                      ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 font-bold shadow-sm'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <span className="font-semibold block">Bancos NI</span>
                  <span className="text-[9px] text-slate-500">BAC/Lafise/Banpro</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('tarjeta')}
                  className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    method === 'tarjeta'
                      ? 'border-rose-500 bg-rose-500/20 text-rose-300 font-bold shadow-sm'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <span className="font-semibold block">Tarjeta Débito</span>
                  <span className="text-[9px] text-slate-500">Visa/Mastercard</span>
                </button>
              </div>
            </div>

            {/* METHOD DETAILS & FUNCTIONAL INPUTS */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              {/* PAYPAL */}
              {method === 'paypal' && (
                <div className="space-y-2.5 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-blue-400">Pago Express con PayPal</span>
                    <span className="text-slate-400 text-[11px] font-mono">Cargo: ${amountInUSD} USD</span>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Correo de tu cuenta PayPal</label>
                    <input
                      type="email"
                      required
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Al confirmar, se autorizará el cobro internacional de ${amountInUSD} USD y se acreditarán {formatCordobas(amount)} en tu saldo inmediatamente.
                  </p>
                </div>
              )}

              {/* BINANCE PAY / USDT */}
              {method === 'binance' && (
                <div className="space-y-2.5 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-amber-400">Binance Pay & Cripto (USDT)</span>
                    <span className="text-slate-400 text-[11px] font-mono">{amountInUSD} USDT</span>
                  </div>
                  
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Binance Pay ID:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-300 font-bold">505889412</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('505889412', 'binance_id')}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          {copiedItem === 'binance_id' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Dirección USDT (BEP20):</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-300 truncate max-w-[120px]">0x71C...4b92</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('0x71C4b92837492817409218294719284719284719', 'usdt_addr')}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          {copiedItem === 'usdt_addr' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">ID de Transacción / Order ID de Binance</label>
                    <input
                      type="text"
                      value={binanceTxHash}
                      onChange={(e) => setBinanceTxHash(e.target.value)}
                      placeholder="Ej: 2948192841 o Binance Pay Order"
                      className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200"
                    />
                  </div>
                </div>
              )}

              {/* AGENTE BANPRO / FICHA DIGITAL */}
              {method === 'banpro' && (
                <div className="space-y-2.5 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-emerald-400">Ficha Digital y Agente Banpro</span>
                    <span className="text-slate-400 text-[11px]">Nicaragua</span>
                  </div>

                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Convenio Banpro:</span>
                      <span className="font-mono font-bold text-emerald-300">#4082 (SubastaPro NI)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Número de Ficha Generada:</span>
                      <span className="font-mono font-bold text-amber-300">8942-0193</span>
                    </div>
                    <p className="text-[10px] text-slate-500 pt-1">
                      Paga en cualquier agente Banpro, pulpería autorizada o sucursal bancaria mencionando el convenio y tu ficha.
                    </p>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Número de comprobante / Voucher de pago</label>
                    <input
                      type="text"
                      value={banproVoucher}
                      onChange={(e) => setBanproVoucher(e.target.value)}
                      className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* BILLETERA MOVIL (CLARO / TIGO) */}
              {method === 'billetera' && (
                <div className="space-y-2.5 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sky-400">Claro Pay & Tigo Money</span>
                    <span className="text-slate-400 text-[11px]">Pago Instantáneo</span>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Número de Teléfono en Nicaragua (+505)</label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={smsCode}
                      onChange={(e) => setSmsCode(e.target.value)}
                      placeholder="Código PIN SMS (ej: 5058)"
                      className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSmsSent(true);
                        addToast('Código SMS simulado enviado a tu celular.', 'info');
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded whitespace-nowrap"
                    >
                      {smsSent ? 'Reenviar' : 'Enviar PIN'}
                    </button>
                  </div>
                </div>
              )}

              {/* TRANSFERENCIA BANCARIA */}
              {method === 'transferencia' && (
                <div className="space-y-2.5 animate-fade-in">
                  <span className="font-semibold text-indigo-400 block">Transferencia Bancaria Nacional</span>
                  
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1 font-mono text-[11px]">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">BAC Credomatic (C$):</span>
                      <span className="text-slate-200 font-bold">362-89102-4</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Banpro Nicaragua (C$):</span>
                      <span className="text-slate-200 font-bold">100-24910-8</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Banco LAFISE (C$):</span>
                      <span className="text-slate-200 font-bold">402-91823-1</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Referencia bancaria de transferencia</label>
                    <input
                      type="text"
                      value={bankRef}
                      onChange={(e) => setBankRef(e.target.value)}
                      className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* TARJETA DE CREDITO / DEBITO */}
              {method === 'tarjeta' && (
                <div className="space-y-2.5 animate-fade-in">
                  <span className="font-semibold text-rose-400 block">Tarjeta Visa / Mastercard</span>
                  
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Número de Tarjeta</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Expiración</label>
                      <input
                        type="text"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Transacción encriptada y fondos acreditados inmediatamente en Córdobas</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-[0.98]"
            >
              Completar y Acreditar {formatCordobas(amount)} Ahora
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
