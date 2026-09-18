import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand-logo">
              <div className="footer-brand-icon">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <span className="footer-brand-text">Edu<span className="footer-brand-accent">Connect</span></span>
            </Link>
            <p className="footer-brand-desc">
              La plataforma que simplifica el encuentro entre estudiantes y tutores calificados.
            </p>
            <div className="footer-social-links">
              <a href="#" className="footer-social-link" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" className="footer-social-link" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin"></i>
              </a>
              <a href="#" className="footer-social-link" aria-label="Twitter">
                <i className="fa-brands fa-twitter"></i>
              </a>
            </div>
          </div>

          {/* Column: Students */}
          <div>
            <h4 className="footer-col-title">Estudiantes</h4>
            <ul className="footer-nav">
              <li>
                <Link to="/explorar" className="footer-link">Buscar Tutores</Link>
              </li>
              <li>
                <Link to="/explorar?categoria=matematicas" className="footer-link">Categorías</Link>
              </li>
              <li>
                <a href="#como-funciona" className="footer-link">Garantía de Clase</a>
              </li>
              <li>
                <Link to="/dashboard" className="footer-link">Portal de Alumno</Link>
              </li>
            </ul>
          </div>

          {/* Column: Tutors */}
          <div>
            <h4 className="footer-col-title">Profesores</h4>
            <ul className="footer-nav">
              <li>
                <Link to="/registro-tutor" className="footer-link">Convertirme en Tutor</Link>
              </li>
              <li>
                <Link to="/registro-tutor#requisitos" className="footer-link">Requisitos</Link>
              </li>
              <li>
                <Link to="/dashboard/tutor" className="footer-link">Panel Docente</Link>
              </li>
            </ul>
          </div>

          {/* Column: Support */}
          <div>
            <h4 className="footer-col-title">Soporte</h4>
            <ul className="footer-nav">
              <li><a href="#" className="footer-link">FAQ & Ayuda</a></li>
              <li><a href="#" className="footer-link">Contacto</a></li>
              <li><a href="#" className="footer-link">Privacidad y Términos</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 EduConnect Inc. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
