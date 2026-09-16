import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const TutorDashboard = () => {
  const { user, profile } = useAuth();
  const [balance, setBalance] = useState(480.0);
  const [withdrawModal, setWithdrawModal] = useState(false);

  const tutorName = profile?.full_name || 'Ing. Carlos Mendoza';

  const handleWithdraw = (e) => {
    e.preventDefault();
    setWithdrawModal(false);
    alert('Solicitud de retiro anticipado enviada a tu cuenta bancaria registrada.');
  };

  return (
    <div className="bg-slate-100 text-slate-800 antialiased min-h-screen pb-16 selection:bg-brand-500 selection:text-white">
      {/* Top Bar for Tutor */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white">
                Edu<span className="text-brand-500">Connect</span>
              </span>
            </Link>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-[11px] font-bold uppercase tracking-wider border border-brand-500/30">
              Panel Profesor
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <Link to="/dashboard/tutor" className="text-white font-bold text-brand-400">
              Dashboard
            </Link>
            <Link to="/aula-virtual" className="hover:text-white transition-colors">
              Aula Virtual
            </Link>
            <a href="#alumnos" className="hover:text-white transition-colors">
              Mis Alumnos
            </a>
            <a href="#finanzas" className="hover:text-white transition-colors">
              Finanzas & Cobros
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/aula-virtual"
              className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <i className="fa-solid fa-video text-xs mr-1"></i> Aula Virtual
            </Link>
            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
              <img
                src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                alt="Avatar"
                className="w-9 h-9 rounded-xl object-cover border border-slate-700"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-white leading-tight">{tutorName}</p>
                <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Disponible
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider">
              Sesión Activa
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold">¡Hola de nuevo, Carlos!</h1>
            <p className="text-brand-100 text-sm max-w-xl">
              Tienes 2 clases programadas para el día de hoy y 1 nueva solicitud de alumno esperando respuesta.
            </p>
          </div>
          <button
            onClick={() => alert('Sincronizado con Google Calendar correctamente.')}
            className="px-5 py-3 bg-white text-brand-700 hover:bg-brand-50 font-bold rounded-2xl text-xs shadow-lg transition-all shrink-0 flex items-center gap-2"
          >
            <i className="fa-solid fa-calendar-days"></i>
            <span>Sincronizar Agenda</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Metric 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Saldo Acumulado</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">
                <i className="fa-solid fa-wallet"></i>
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">${balance.toFixed(2)} <span className="text-xs text-slate-400 font-normal">USD</span></p>
            <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <i className="fa-solid fa-arrow-up"></i> +$120 esta semana
            </p>
          </div>

          {/* Metric 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Clases del Mes</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center text-sm font-bold">
                <i className="fa-solid fa-chalkboard-user"></i>
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">18 Sesiones</p>
            <p className="text-[11px] text-slate-500 font-medium">92% asistencia de alumnos</p>
          </div>

          {/* Metric 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Alumnos Activos</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-sm font-bold">
                <i className="fa-solid fa-user-group"></i>
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">12 Alumnos</p>
            <p className="text-[11px] text-brand-600 font-semibold">+3 nuevos este mes</p>
          </div>

          {/* Metric 4 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Calificación</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-sm font-bold">
                <i className="fa-solid fa-star"></i>
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">5.0 / 5.0</p>
            <p className="text-[11px] text-amber-500 font-bold">112 reseñas verificadas</p>
          </div>
        </div>

        {/* Schedule & Financial Actions */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Agenda Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base font-extrabold text-slate-900">Clases de Hoy</h2>
                <span className="text-xs text-brand-600 font-bold">Miércoles, 16 Sep 2026</span>
              </div>

              {/* Class Card */}
              <div className="p-4 rounded-2xl border-2 border-brand-500/30 bg-brand-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-md">
                    16:00
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600 bg-red-100 px-2 py-0.5 rounded-full animate-pulse">
                      Comienza en 15 min
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-0.5">Alejandro Silva</h3>
                    <p className="text-xs text-brand-600 font-semibold">Programación Python & Lógica</p>
                  </div>
                </div>
                <Link
                  to="/aula-virtual"
                  className="w-full sm:w-auto px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md transition-all text-center flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-video text-xs"></i> Iniciar Aula Virtual
                </Link>
              </div>

              {/* Later Class */}
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-extrabold text-sm shrink-0">
                    18:30
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      Hoy más tarde
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-0.5">Mariana Torres</h3>
                    <p className="text-xs text-slate-500">Introducción a React & Hooks</p>
                  </div>
                </div>
                <button
                  onClick={() => alert('Detalles de la sesión de Mariana Torres')}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-50"
                >
                  Ver Preparación
                </button>
              </div>
            </div>
          </div>

          {/* Wallet & Quick Withdraw Column */}
          <div className="lg:col-span-4 space-y-6">
            <div id="finanzas" className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Billetera de Cobros</h3>
              <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-200/70">
                <span className="text-xs text-slate-400 font-semibold">Próxima liquidación automática:</span>
                <p className="text-lg font-extrabold text-slate-900">Lunes, 21 de Septiembre</p>
                <p className="text-xs text-slate-500">Transferencia bancaria directa (•••• 9182)</p>
              </div>

              <button
                onClick={() => setWithdrawModal(true)}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md"
              >
                Solicitar Retiro Inmediato
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Withdrawal Modal */}
      {withdrawModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-extrabold text-slate-900">Retiro Inmediato</h3>
              <button onClick={() => setWithdrawModal(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <p className="text-xs text-slate-600">
              ¿Deseas transferir los <strong>${balance.toFixed(2)} USD</strong> disponibles a tu cuenta bancaria registrada?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setWithdrawModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleWithdraw}
                className="flex-1 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
