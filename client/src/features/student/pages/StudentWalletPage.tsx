import React, { useState, useEffect } from 'react';
import { studentWalletService, WalletTransaction } from '../services/studentWalletService';
import { RechargeWalletModal } from '../components/RechargeWalletModal';

export const StudentWalletPage: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRechargeOpen, setIsRechargeOpen] = useState<boolean>(false);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const [walletRes, txList] = await Promise.all([
        studentWalletService.getBalance().catch(() => ({ balance: 0 })),
        studentWalletService.getTransactions(),
      ]);
      setBalance(walletRes.balance);
      setTransactions(txList);
    } catch (err) {
      console.error('Error fetching wallet data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWalletData();
  }, []);

  const totalLoaded = transactions
    .filter(t => t.type === 'DEPOSIT')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalSpent = transactions
    .filter(t => t.type === 'BOOKING_PAYMENT')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Billetera Digital</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Saldo consolidado unificado para todas tus reservas y tutorías
          </p>
        </div>
        <button
          onClick={() => setIsRechargeOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 transition-colors shadow-sm shrink-0"
        >
          <i className="fa-solid fa-plus-circle"></i>
          <span>Recargar Saldo</span>
        </button>
      </div>

      {/* Balance Banner & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Balance Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-brand-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <i className="fa-solid fa-wallet text-brand-400"></i> Saldo Disponible
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                Billetera Unificada Activa
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                ${balance.toFixed(2)}
              </span>
              <span className="text-sm font-bold text-slate-400">USD</span>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-slate-300 max-w-md">
              <i className="fa-solid fa-shield-halved text-emerald-400 mr-1.5"></i>
              Fondos protegidos y utilizables de inmediato al reservar clases o cambiar al rol de Tutor.
            </p>
            <button
              onClick={() => setIsRechargeOpen(true)}
              className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm shrink-0"
            >
              Recargar ahora
            </button>
          </div>
        </div>

        {/* Small stats column */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Recargado</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              ${totalLoaded.toFixed(2)}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Depósitos registrados</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Invertido en Aprendizaje</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              ${totalSpent.toFixed(2)}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Pagos de sesiones</p>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900">Historial de Movimientos</h2>
            <p className="text-xs text-slate-500 mt-0.5">Todas las recargas, pagos y reembolsos procesados</p>
          </div>
          <span className="text-xs font-bold text-slate-400">{transactions.length} transacciones</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <i className="fa-solid fa-circle-notch fa-spin text-2xl text-brand-600 mb-2"></i>
            <p className="text-xs">Cargando transacciones...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <i className="fa-solid fa-receipt text-3xl mb-2 text-slate-300"></i>
            <p className="text-xs font-medium">Aún no hay transacciones en tu cuenta</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5">Tipo / Concepto</th>
                  <th className="py-3 px-5">Fecha</th>
                  <th className="py-3 px-5">Estado</th>
                  <th className="py-3 px-5 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => {
                  const isPositive = tx.type === 'DEPOSIT' || tx.type === 'REFUND';
                  const typeLabel = {
                    DEPOSIT: 'Recarga de Saldo',
                    BOOKING_PAYMENT: 'Pago de Clase Agendada',
                    REFUND: 'Reembolso por Cancelación',
                  }[tx.type] || tx.type;

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                          }`}>
                            <i className={`fa-solid ${
                              tx.type === 'DEPOSIT' ? 'fa-arrow-down-left' :
                              tx.type === 'REFUND' ? 'fa-rotate-left' : 'fa-arrow-up-right'
                            }`}></i>
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{typeLabel}</p>
                            <p className="text-[11px] text-slate-400">{tx.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-slate-500 font-medium">
                        {tx.created_at}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                          {tx.status}
                        </span>
                      </td>
                      <td className={`py-3.5 px-5 text-right font-black text-sm ${
                        isPositive ? 'text-emerald-600' : 'text-slate-900'
                      }`}>
                        {isPositive ? '+' : '-'}${tx.amount.toFixed(2)} USD
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Recarga */}
      <RechargeWalletModal
        isOpen={isRechargeOpen}
        onClose={() => setIsRechargeOpen(false)}
        onSuccess={(newBal) => {
          if (typeof newBal === 'number') {
            setBalance(newBal);
          }
          loadWalletData();
        }}
      />
    </div>
  );
};
