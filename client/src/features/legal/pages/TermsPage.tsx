import React from 'react';
import { LegalLayout } from '../components/LegalLayout';

export const TermsPage: React.FC = () => {
  return (
    <LegalLayout title="Términos y Condiciones de Uso" lastUpdated="19 de Septiembre de 2026">
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">1. Introducción y Objeto</h2>
        <p>
          Bienvenido a <strong>EduConnect</strong>. Estos Términos y Condiciones regulan el acceso y uso de nuestra plataforma digital, accesible a través de la web y aplicaciones vinculadas. Al registrarte o navegar por nuestros servicios, aceptas plenamente estas condiciones.
        </p>
        <p>
          EduConnect actúa como un punto de encuentro e intermediación tecnológica entre estudiantes que requieren asesoría académica y profesores/tutores particulares independientes calificados.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">2. Cuentas y Responsabilidades</h2>
        <p>
          Para reservar clases o registrarte como docente, debes proporcionar información veraz, completa y actualizada. Eres el único responsable de salvaguardar la confidencialidad de tus credenciales de acceso.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li>Los estudiantes menores de edad deben contar con la autorización o supervisión de sus tutores legales.</li>
          <li>Los tutores se comprometen a certificar su identidad y solvencia académica mediante documentación fidedigna.</li>
          <li>Queda terminantemente prohibido el acoso, la discriminación o cualquier conducta que atente contra la integridad de los miembros de la comunidad.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">3. Reservas, Tarifas y Pagos</h2>
        <p>
          Cada tutor fija libremente el valor de su tarifa por hora. Al solicitar una reserva, el estudiante autoriza el cargo del monto pactado a través de los medios de pago habilitados.
        </p>
        <p>
          El importe total de la clase queda en custodia segura por la plataforma y se libera a la Billetera del tutor únicamente una vez concluida la sesión de clase satisfactoriamente.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">4. Política de Cancelaciones y Reembolsos</h2>
        <p>
          Entendemos que pueden surgir imprevistos. Nuestra política de cancelación opera bajo los siguientes lineamientos:
        </p>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
          <p><strong>Cancelación con más de 12 horas de antelación:</strong> Reembolso del 100% del valor de la clase a tu saldo disponible.</p>
          <p><strong>Cancelación con menos de 12 horas:</strong> Se retiene el 50% de la tarifa para compensar el tiempo reservado por el tutor.</p>
          <p><strong>Incomparecencia del tutor:</strong> Reembolso automático del 100% más crédito compensatorio para tu siguiente sesión.</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">5. Modificaciones y Jurisdicción</h2>
        <p>
          EduConnect se reserva el derecho de modificar estos términos para adaptarlos a novedades normativas o técnicas. Cualquier cambio sustancial será notificado oportunamente a los usuarios registrados.
        </p>
      </section>
    </LegalLayout>
  );
};
