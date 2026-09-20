import React from 'react';
import { LegalLayout } from '../components/LegalLayout';

export const PrivacyPage: React.FC = () => {
  return (
    <LegalLayout title="Política de Privacidad y Cookies" lastUpdated="19 de Septiembre de 2026">
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">1. Compromiso con tu Privacidad</h2>
        <p>
          En <strong>EduConnect</strong> nos tomamos muy en serio la seguridad y la confidencialidad de tus datos. Esta política describe qué información recopilamos, cómo la usamos y los derechos que tienes sobre ella conforme a los estándares internacionales de protección de datos (RGPD, CCPA y normativas locales).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">2. Datos que Recopilamos</h2>
        <ul className="list-disc pl-5 space-y-2 text-slate-600">
          <li><strong>Datos de registro e identidad:</strong> Nombre completo, correo electrónico, teléfono y rol seleccionado (estudiante o tutor).</li>
          <li><strong>Datos de perfil académico:</strong> Nivel educativo, metas de aprendizaje y reseñas en el caso de alumnos; certificaciones, bio y materias en el caso de tutores.</li>
          <li><strong>Información de transacciones:</strong> Historial de reservas, montos abonados y movimientos en la billetera virtual (no almacenamos números completos de tarjetas de crédito; estas son procesadas por pasarelas seguras certificadas PCI-DSS).</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">3. Uso de Cookies y Seguridad de Sesión</h2>
        <p>
          EduConnect utiliza una arquitectura de autenticación moderna y robusta basada en <strong>Cookies HttpOnly</strong>:
        </p>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
          <p>
            <strong>Cookie de Sesión (`auth_token`):</strong> Se emite con los atributos de seguridad <code>HttpOnly</code>, <code>SameSite=Lax</code> y <code>Secure</code>. Esto significa que ningún script JavaScript malicioso puede leer tu token de sesión desde el navegador, previniendo eficazmente ataques de tipo Cross-Site Scripting (XSS).
          </p>
          <p>
            <strong>Cookies Analíticas y de Rendimiento:</strong> Nos permiten medir la calidad de carga de las páginas para ofrecer una navegación fluida. Puedes configurar o revocar estas cookies desde los ajustes de tu navegador en cualquier momento.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">4. Derechos del Usuario (ARCO)</h2>
        <p>
          Tienes pleno derecho a Acceder, Rectificar, Cancelar u Oponerte al tratamiento de tus datos personales, así como a solicitar la portabilidad o eliminación de tu cuenta.
        </p>
        <p>
          Para ejercer cualquiera de estos derechos, basta con enviar una solicitud a <a href="mailto:privacidad@educonnect.com" className="text-brand-600 font-bold hover:underline">privacidad@educonnect.com</a>. Responderemos a tu solicitud en un plazo máximo de 72 horas hábiles.
        </p>
      </section>
    </LegalLayout>
  );
};
