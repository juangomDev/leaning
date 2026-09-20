import React, { useState, useEffect } from 'react';
import { tutorWalletService, TutorWalletSummary } from '../services/tutorWalletService';
import { WithdrawModal } from '../components/WithdrawModal';

export const TutorWalletPage: React.FC = () => {
  const [summary, setSummary] = useState<TutorWalletSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const data = await tutorWalletService.getWalletSummary();
      setSummary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Finanzas y Billetera Docente</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitorea tus ingresos por clase, fondos en custodia y solicita retiros a tu banco o PayPal
          </p>
        </div>
        <button
          onClick={() => setIsWithdrawOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-colors shadow-sm shrink-0"
        >
          <i className="fa-solid fa-money-bill-transfer"></i>
          <span>Solicitar Retiro</span>
        </button>
      </div>

      {/* Financial Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-5 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
          <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">Saldo Disponible</span>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-black text-white">${summary?.availableBalance.toFixed(2) || '480.00'}</span>
            <span className="text-xs text-purple-200">USD</span>
          </div>
          <span className="text-[10px] text-purple-200/80 mt-2 block">Listo para transferir</span>
        </div>

        {/* This Month Earnings */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ganancias Este Mes</span>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">${summary?.thisMonthEarnings.toFixed(2) || '380.00'}</span>
            <span className="text-xs text-slate-400">USD</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
            <i className="fa-solid fa-arrow-up"></i> +18% comparado al mes anterior
          </span>
        </div>

        {/* In Escrow */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fondos en Custodia</span>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-black text-amber-600">${summary?.pendingEscrow.toFixed(2) || '56.25'}</span>
            <span className="text-xs text-slate-400">USD</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Se liberan al finalizar las clases</span>
        </div>

        {/* All-time */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Histórico</span>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">${summary?.totalEarnedAllTime.toFixed(2) || '1420.00'}</span>
            <span className="text-xs text-slate-400">USD</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block">Acumulado en EduConnect</span>
        </div>
      </div>

      {/* Accounting Breakdown Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900">Desglose Contable por Clase</h2>
            <p className="text-xs text-slate-500 mt-0.5">Liquidación detallada con deducción del 10% de comisión de plataforma</p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {summary?.breakdown.length || 0} movimientos
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <i className="fa-solid fa-circle-notch fa-spin text-2xl text-purple-600 mb-2"></i>
            <p className="text-xs">Cargando desglose contable...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5">Concepto / Estudiante</th>
                  <th className="py-3 px-5">Fecha</th>
                  <th className="py-3 px-5">Estado</th>
                  <th className="py-3 px-5 text-right">Bruto</th>
                  <th className="py-3 px-5 text-right">Comisión (10%)</th>
                  <th className="py-3 px-5 text-right">Neto Acreditado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {summary?.breakdown.map((row) => {
                  const isCredit = row.netEarnings > 0;
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5">
                        <p className="font-bold text-slate-800">{row.studentName}</p>
                        <p className="text-[11px] text-slate-400">{row.subjectName}</p>
                      </td>
                      <td className="py-3.5 px-5 text-slate-500 font-medium">
                        {row.date}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          row.status === 'CREDITED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          row.status === 'IN_ESCROW' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-purple-50 text-purple-700 border-purple-200'
                        }`}>
                          {row.status === 'CREDITED' ? 'Acreditado' : row.status === 'IN_ESCROW' ? 'En Custodia' : 'Transferido'}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right text-slate-600 font-semibold">
                        ${row.grossAmount.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-5 text-right text-rose-600 font-semibold">
                        {row.platformFee > 0 ? `-$${row.platformFee.toFixed(2)}` : '-'}
                      </td>
                      <td className={`py-3.5 px-5 text-right font-black text-sm ${isCredit ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {isCredit ? '+' : ''}${row.netEarnings.toFixed(2)} USD
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Withdraw Modal */}
      {summary && (
        <WithdrawModal
          isOpen={isWithdrawOpen}
          onClose={() => setIsWithdrawOpen(false)}
          availableBalance={summary.availableBalance}
          onSuccess={() => {
            fetchWallet();
          }}
        />
      )}
    </div>
  );
};
