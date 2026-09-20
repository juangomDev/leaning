import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({ title, lastUpdated, children }) => {
  return (
    <div className="bg-slate-50 min-h-screen py-12 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Category */}
        <div className="mb-8">
          <span className="text-brand-600 text-xs font-extrabold uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60">
            Marco Legal & Cumplimiento
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            {title}
          </h1>
          <p className="text-slate-500 text-xs mt-1.5 flex items-center gap-1.5">
            <i className="fa-regular fa-clock"></i> Última actualización: {lastUpdated}
          </p>
        </div>

        {/* Grid Layout: Sidebar Navigation (Col 3) + Legal Content (Col 9) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-3 sticky top-24 space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-2">
                Documentos Legales
              </span>
              <NavLink
                to="/legal/terms"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold rounded-xl transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-extrabold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <i className="fa-solid fa-file-contract text-brand-500 w-4"></i>
                Términos y Condiciones
              </NavLink>

              <NavLink
                to="/legal/privacy"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold rounded-xl transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-extrabold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <i className="fa-solid fa-shield-halved text-brand-500 w-4"></i>
                Política de Privacidad
              </NavLink>
            </div>

            <div className="bg-slate-100 rounded-2xl p-4 text-[11px] text-slate-500 space-y-2 border border-slate-200/60">
              <p className="font-bold text-slate-700">¿Dudas legales o regulatorias?</p>
              <p>Puedes escribir directamente a nuestro oficial de cumplimiento en:</p>
              <a href="mailto:legal@educonnect.com" className="text-brand-600 font-bold block hover:underline">
                legal@educonnect.com
              </a>
            </div>
          </aside>

          <main className="lg:col-span-9 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm leading-relaxed text-slate-700 text-sm space-y-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
