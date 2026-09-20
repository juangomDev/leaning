import React, { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  badge?: string;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    avatar: string;
  };
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
  badge = 'Acceso Seguro',
  testimonial = {
    quote:
      'Encontrar al tutor indicado en EduConnect me permitió aprobar Cálculo Avanzado con honores. La plataforma es rápida y muy intuitiva.',
    author: 'Camila Torres',
    role: 'Estudiante de Ingeniería Civil',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  },
}) => {
  return (
    <section className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8 antialiased">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Visual Brand & Testimonial (Desktop) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-center space-y-8 pr-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/70 text-brand-700 text-xs font-bold uppercase tracking-wider w-fit">
              <i className="fa-solid fa-shield-halved text-brand-600"></i>
              <span>{badge}</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl xl:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
                La comunidad de tutorías 1 a 1 más confiable
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Únete a más de 10,000 estudiantes y profesores que transforman su futuro académico
                cada día con sesiones personalizadas a tu ritmo.
              </p>
            </div>

            {/* Testimonial Card */}
            <div className="bg-white/90 backdrop-blur rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex text-amber-400 gap-1 text-xs">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <p className="text-xs text-slate-700 italic leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-10 h-10 rounded-full object-cover border border-brand-100"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">{testimonial.author}</p>
                  <p className="text-[11px] text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </div>

            {/* Trust stats pill */}
            <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-check-circle text-emerald-500"></i>
                <span>Tutores 100% Verificados</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-lock text-brand-600"></i>
                <span>Sesión Segura & Cifrada</span>
              </div>
            </div>
          </div>

          {/* Right Column: Form Container */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-lg auth-form-card">
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {title}
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {subtitle}
                </p>
              </div>

              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
