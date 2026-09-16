import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-14 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 text-xl font-extrabold text-white">
              <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center text-xs">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <span>Edu<span className="text-brand-500">Connect</span></span>
            </Link>
            <p className="text-sm leading-relaxed">
              La plataforma que simplifica el encuentro entre estudiantes y tutores calificados.
            </p>
            <div className="flex gap-3 text-lg">
              <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin"></i>
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
                <i className="fa-brands fa-twitter"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Estudiantes</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/explorar" className="hover:text-white transition-colors">Buscar Tutores</Link>
              </li>
              <li>
                <Link to="/explorar?categoria=matematicas" className="hover:text-white transition-colors">Categorías</Link>
              </li>
              <li>
                <a href="#como-funciona" className="hover:text-white transition-colors">Garantía de Clase</a>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">Portal de Alumno</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Profesores</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/registro-tutor" className="hover:text-white transition-colors">Convertirme en Tutor</Link>
              </li>
              <li>
                <Link to="/registro-tutor#requisitos" className="hover:text-white transition-colors">Requisitos</Link>
              </li>
              <li>
                <Link to="/dashboard/tutor" className="hover:text-white transition-colors">Panel Docente</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Soporte</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">FAQ & Ayuda</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacidad y Términos</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 text-xs text-slate-500 text-center">
          <p>© 2026 EduConnect Inc. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
