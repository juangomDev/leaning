import React, { useState } from 'react';

export const Finanzas = () => {
  const [balance, setBalance] = useState(85.0);
  const [rechargeModal, setRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('50');

  const transactions = [
    {
      id: 'REC-9021',
      date: '12 Sep 2026',
      concept: 'Clase de Cálculo Integral (Dra. Elena Rostova)',
      amount: -25.0,
      status: 'Completado',
      method: 'Billetera EduConnect',
    },
    {
      id: 'REC-8842',
      date: '05 Sep 2026',
      concept: 'Recarga de Saldo con Tarjeta Visa (•••• 4022)',
      amount: 100.0,
      status: 'Acreditado',
      method: 'Tarjeta de Crédito',
    },
    {
      id: 'REC-8710',
      date: '03 Sep 2026',
      concept: 'Clase de Bases de Datos SQL (Valeria Gómez)',
      amount: -28.0,
      status: 'Completado',
      method: 'Billetera EduConnect',
    },
    {
      id: 'REC-8501',
      date: '28 Ago 2026',
      concept: 'Clase de Inglés TOEFL (Sarah Jenkins)',
      amount: -22.0,
      status: 'Completado',
      method: 'PayPal',
    },
  ];

  const handleRecharge = (e) => {
    e.preventDefault();
    setBalance(balance + parseFloat(rechargeAmount));
    setRechargeModal(false);
    alert(`¡Recarga exitosa de $${rechargeAmount} USD! Tu nuevo saldo es $${balance + parseFloat(rechargeAmount)} USD.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Finanzas & Facturación</h1>
          <p className="text-slate-500 text-sm mt-1">Controla tu saldo disponible, métodos de pago y comprobantes</p>
        </div>
        <button
          onClick={() => setRechargeModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <i className="fa-solid fa-plus text-xs"></i> Recargar Saldo
        </button>
      </div>

      {/* Balance & Cards Section */}
      <div className="grid sm:grid-cols-3 gap-5">
        {/* Available Balance */}
        <div className="bg-gradient-to-br from-brand-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-200 uppercase tracking-wide">Saldo en Billetera</span>
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-sm">
              <i className="fa-solid fa-wallet"></i>
            </div>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold">${balance.toFixed(2)}</p>
            <p className="text-xs text-brand-200 mt-1">Moneda: Dólares Americanos (USD)</p>
          </div>
          <button
            onClick={() => setRechargeModal(true)}
            className="w-full py-2.5 bg-white text-brand-700 font-extrabold rounded-xl text-xs shadow hover:bg-brand-50 transition-colors"
          >
            Añadir Fondos
          </button>
        </div>

        {/* Total Spent */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Inversión Total</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
              <i className="fa-solid fa-chart-line"></i>
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-900">$345.00</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">14 clases completadas con éxito</p>
          </div>
          <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-100">
            Promedio: $24.60 USD por sesión
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Métodos Guardados</span>
            <button
              onClick={() => alert('Formulario de nueva tarjeta')}
              className="text-xs font-bold text-brand-600 hover:text-brand-800"
            >
              + Añadir
            </button>
          </div>
          <div className="space-y-2 py-2">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
              <div className="flex items-center gap-2">
                <i className="fa-brands fa-cc-visa text-blue-600 text-lg"></i>
                <span className="font-bold text-slate-800">Visa terminada en 4022</span>
              </div>
              <span className="text-[10px] bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded font-bold">Principal</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
              <div className="flex items-center gap-2">
                <i className="fa-brands fa-paypal text-sky-600 text-lg"></i>
                <span className="font-bold text-slate-800">alejandro@correo.com</span>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-400">Protección SSL de 256 bits activa</p>
        </div>
      </div>

      {/* Transactions & Receipts Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Historial de Transacciones</h2>
            <p className="text-xs text-slate-400">Comprobantes y recibos digitales de tus clases</p>
          </div>
          <button
            onClick={() => alert('Descargando reporte financiero en PDF...')}
            className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors"
          >
            <i className="fa-solid fa-download mr-1"></i> Exportar PDF
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="py-3.5 px-6">ID Recibo</th>
                <th className="py-3.5 px-6">Fecha</th>
                <th className="py-3.5 px-6">Concepto</th>
                <th className="py-3.5 px-6">Método</th>
                <th className="py-3.5 px-6">Monto</th>
                <th className="py-3.5 px-6 text-right">Comprobante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-brand-600">{tx.id}</td>
                  <td className="py-4 px-6 text-slate-500">{tx.date}</td>
                  <td className="py-4 px-6 font-bold text-slate-900">{tx.concept}</td>
                  <td className="py-4 px-6 text-slate-500">{tx.method}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`font-extrabold ${
                        tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`} USD
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => alert(`Generando recibo ${tx.id}...`)}
                      className="p-1.5 text-slate-400 hover:text-brand-600 transition-colors"
                      title="Descargar Recibo"
                    >
                      <i className="fa-solid fa-file-invoice text-sm"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recharge Modal */}
      {rechargeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base">Recargar Saldo</h3>
              <button onClick={() => setRechargeModal(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleRecharge} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">Selecciona un monto ($ USD)</label>
                <div className="grid grid-cols-3 gap-2">
                  {['25', '50', '100'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setRechargeAmount(amt)}
                      className={`py-2 rounded-xl text-xs font-extrabold border transition-all ${
                        rechargeAmount === amt
                          ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-brand-400'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">O ingresa otro monto</label>
                <input
                  type="number"
                  min="10"
                  max="1000"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-xl text-xs shadow-md transition-all"
              >
                Pagar ${rechargeAmount} USD con Visa (•••• 4022)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
