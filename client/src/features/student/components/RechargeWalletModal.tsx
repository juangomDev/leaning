import React, { useState } from 'react';
import { studentWalletService } from '../services/studentWalletService';
import { extractErrorMessage } from '../../../api/apiClient';

interface RechargeWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newBalance?: number) => void;
}

export const RechargeWalletModal: React.FC<RechargeWalletModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [amount, setAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const presets = [10, 25, 50, 100];

  const handleSelectPreset = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    const num = parseFloat(e.target.value);
    if (!isNaN(num) && num > 0) {
      setAmount(num);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setErrorMsg('Por favor ingresa un monto válido a recargar.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await studentWalletService.recharge(amount, paymentMethod);
      onSuccess(res?.newBalance);
      onClose();
    } catch (err: any) {
      setErrorMsg(extractErrorMessage(err, 'Error al procesar la recarga de saldo.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl shrink-0">
            <i className="fa-solid fa-wallet"></i>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-slate-900">Recargar Billetera</h3>
          <p className="text-xs text-slate-500 mt-1">
            El saldo se añade de forma instantánea a tu cuenta para agendar tutorías.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Selecciona un monto (USD)
            </label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {presets.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleSelectPreset(val)}
                  className={`py-2.5 rounded-xl font-extrabold text-sm transition-all ${
                    amount === val && !customAmount
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  ${val}
                </button>
              ))}
            </div>

            {/* Custom input */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input
                type="number"
                min="5"
                step="5"
                placeholder="Otro monto personalizado"
                value={customAmount}
                onChange={handleCustomChange}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 bg-slate-50"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Método de Pago
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <i className="fa-regular fa-credit-card text-sm"></i>
                <span>Tarjeta Débito/Crédito</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('transfer')}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'transfer'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <i className="fa-solid fa-building-columns text-sm"></i>
                <span>Transferencia Directa</span>
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
            >
              {loading ? (
                'Procesando...'
              ) : (
                <>
                  <span>Recargar ${amount} USD</span>
                  <i className="fa-solid fa-arrow-right text-[11px]"></i>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
