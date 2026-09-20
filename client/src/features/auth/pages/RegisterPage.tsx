import React from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';

export const RegisterPage: React.FC = () => {
  return (
    <AuthLayout
      title="Crea tu cuenta en EduConnect"
      subtitle="Selecciona cómo te gustaría participar en nuestra comunidad de aprendizaje."
      badge="Crear Cuenta"
    >
      <div className="space-y-4">
        {/* Student Choice Card */}
        <Link
          to="/register/student"
          className="group block p-6 rounded-2xl border-2 border-slate-200 hover:border-brand-500 hover:bg-brand-50/30 transition-all shadow-sm hover:shadow-md"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center text-xl shrink-0 transition-all">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-extrabold text-slate-900 text-base group-hover:text-brand-600 transition-colors">
                  Soy Estudiante
                </h3>
                <span className="text-xs font-bold text-brand-600 group-hover:translate-x-1 transition-transform">
                  Comenzar →
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Busco tutores calificados para apoyo en materias, exámenes o aprender nuevas habilidades.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-semibold text-slate-600">
                <span className="px-2 py-0.5 rounded-md bg-slate-100">Garantía 100%</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100">Clases 1 a 1</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100">Sin contratos</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Tutor Choice Card */}
        <Link
          to="/register/tutor"
          className="group block p-6 rounded-2xl border-2 border-slate-200 hover:border-brand-500 hover:bg-brand-50/30 transition-all shadow-sm hover:shadow-md"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center text-xl shrink-0 transition-all">
              <i className="fa-solid fa-chalkboard-user"></i>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-extrabold text-slate-900 text-base group-hover:text-purple-600 transition-colors">
                  Soy Profesor o Especialista
                </h3>
                <span className="text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
                  Postular →
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Quiero impartir clases, generar ingresos y compartir mis conocimientos fijando mis propias tarifas.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-semibold text-slate-600">
                <span className="px-2 py-0.5 rounded-md bg-slate-100">Tarifas libres</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100">Pagos semanales</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100">Aula Virtual</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Already registered prompt */}
      <div className="mt-8 text-center text-xs text-slate-500 border-t border-slate-100 pt-6">
        ¿Ya tienes una cuenta registrada?{' '}
        <Link to="/login" className="font-bold text-brand-600 hover:underline">
          Inicia sesión aquí
        </Link>
      </div>
    </AuthLayout>
  );
};
