import React, { useState } from 'react';
import { tutorWalletService } from '../services/tutorWalletService';
import { extractErrorMessage } from '../../../api/apiClient';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onSuccess: (newBalance: number) => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  availableBalance,
  onSuccess,
}) => {
  const [amount, setAmount] = useState<number>(Math.min(100, Math.floor(availableBalance)));
  const [method, setMethod] = useState<'bank' | 'paypal' | 'crypto'>('bank');
  const [accountDetails, setAccountDetails] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || amount > availableBalance) {
      setErrorMsg('El monto debe ser mayor a $0 y no superar tu saldo disponible.');
      return;
    }
    if (!accountDetails.trim()) {
      setErrorMsg('Por favor especifica los datos de la cuenta receptora.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await tutorWalletService.requestWithdrawal({
        amount,
        method,
        accountDetails,
      });
      onSuccess(res.newBalance);
      onClose();
    } catch (err: any) {
      setErrorMsg(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl shrink-0">
            <i className="fa-solid fa-money-bill-transfer"></i>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-900">Solicitar Retiro de Fondos</h3>
          <p className="text-xs text-slate-500 mt-1">
            Transfiere tus ingresos generados a tu cuenta bancaria o billetera digital
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200/80 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">Saldo disponible para retiro:</span>
          <span className="text-sm font-black text-purple-700">${availableBalance.toFixed(2)} USD</span>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation text-rose-500"></i>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleWithdraw} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Monto a Retirar (USD) *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
              <input
                type="number"
                min={10}
                max={availableBalance}
                step="5"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex gap-2">
            {[50, 100, 200].map((preset) => (
              <button
                key={preset}
                type="button"
                disabled={preset > availableBalance}
                onClick={() => setAmount(preset)}
                className="flex-1 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 text-xs font-bold text-slate-700 transition-colors"
              >
                ${preset}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setAmount(Math.floor(availableBalance))}
              className="flex-1 py-1.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-xs font-bold text-purple-700 transition-colors"
            >
              Todo
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Canal de Pago</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'bank', label: 'Banco Local', icon: 'fa-building-columns' },
                { id: 'paypal', label: 'PayPal', icon: 'fa-paypal' },
                { id: 'crypto', label: 'USDT / Crypto', icon: 'fa-coins' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id as any)}
                  className={`py-2 px-2 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 transition-all ${
                    method === m.id
                      ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <i className={`fa-solid ${m.icon}`}></i>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {method === 'bank' ? 'Número de Cuenta Bancaria / CLABE / IBAN *' :
               method === 'paypal' ? 'Correo Electrónico de PayPal *' :
               'Dirección de Billetera USDT (TRC-20) *'}
            </label>
            <input
              type="text"
              value={accountDetails}
              onChange={(e) => setAccountDetails(e.target.value)}
              placeholder={
                method === 'bank' ? 'Ej. BBVA CLABE 012180015... o IBAN ES91...' :
                method === 'paypal' ? 'tucuenta@paypal.com' : 'TXyz123...'
              }
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 flex items-start gap-2">
            <i className="fa-solid fa-clock text-purple-600 mt-0.5"></i>
            <span>Los retiros son procesados en un plazo de 24 a 48 horas hábiles directamente a tu cuenta.</span>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || availableBalance <= 0}
              className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check"></i>
                  <span>Confirmar Retiro</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
