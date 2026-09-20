import React, { useState } from 'react';

interface FAQItem {
  id: string;
  category: 'alumnos' | 'pagos' | 'tutores';
  question: string;
  answer: string;
}

export const HelpContactPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFAQId, setOpenFAQId] = useState<string | null>('faq-1');

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('soporte');
  const [contactMessage, setContactMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const faqs: FAQItem[] = [
    {
      id: 'faq-1',
      category: 'alumnos',
      question: '¿Cómo reservo mi primera clase con un tutor?',
      answer: 'Busca tu materia o tema de interés en el catálogo de tutores. Revisa el perfil, opiniones y tarifas de los profesores disponibles, selecciona un horario que te convenga y confirma la reserva. Podrás acceder al aula virtual o coordinar el punto de encuentro.',
    },
    {
      id: 'faq-2',
      category: 'alumnos',
      question: '¿Qué sucede si necesito reprogramar o cancelar una clase?',
      answer: 'Puedes cancelar o reprogramar tu clase sin penalización hasta 12 horas antes de la hora programada directamente desde tu Dashboard de Alumno. Si cancelas a tiempo, el importe se reintegra a tu saldo.',
    },
    {
      id: 'faq-3',
      category: 'alumnos',
      question: '¿Cómo funciona el Aula Virtual interactiva?',
      answer: 'Nuestra aula virtual incluye videollamada en alta definición, pizarra digital interactiva compartida, chat de texto y herramientas para subir ejercicios o documentos en tiempo real.',
    },
    {
      id: 'faq-4',
      category: 'pagos',
      question: '¿Qué métodos de pago son aceptados?',
      answer: 'Aceptamos tarjetas de débito y crédito (Visa, Mastercard, American Express), transferencias bancarias y recargas directas a tu Billetera Virtual EduConnect.',
    },
    {
      id: 'faq-5',
      category: 'pagos',
      question: '¿Cómo funciona la Garantía de Satisfacción?',
      answer: 'Si no estás 100% satisfecho con tu primera sesión con un nuevo tutor, infórmanos dentro de las 24 horas posteriores a la clase y te reembolsaremos el monto a tu saldo o te asignaremos otro tutor.',
    },
    {
      id: 'faq-6',
      category: 'pagos',
      question: '¿En qué momento se le paga al tutor?',
      answer: 'El pago queda retenido de manera segura por la plataforma y se libera al tutor únicamente cuando la clase finaliza satisfactoriamente.',
    },
    {
      id: 'faq-7',
      category: 'tutores',
      question: '¿Cuáles son los requisitos para enseñar en EduConnect?',
      answer: 'Buscamos profesionales graduados, estudiantes universitarios avanzados o especialistas con vocación pedagógica. Evaluamos tu CV, comprobante de estudios y realizamos una breve validación de identidad.',
    },
    {
      id: 'faq-8',
      category: 'tutores',
      question: '¿Cuánto cuesta registrarse como profesor?',
      answer: 'El registro es 100% gratuito. No cobramos mensualidades ni cuotas de inscripción. Solo retenemos una pequeña comisión de servicio sobre las clases efectivamente impartidas.',
    },
    {
      id: 'faq-9',
      category: 'tutores',
      question: '¿Cuándo y cómo recibo mis ingresos?',
      answer: 'Tus ganancias se acumulan en tu Billetera de Tutor y puedes solicitar transferencias directas a tu cuenta bancaria de forma semanal.',
    },
  ];

  const filteredFAQs = faqs.filter((item) => {
    const matchesCategory = activeCategory === 'todas' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 1500);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-600 text-xs font-extrabold uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60">
            Soporte & Ayuda
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mt-4 tracking-tight">
            ¿Cómo podemos ayudarte hoy?
          </h1>
          <p className="mt-3 text-slate-600 text-lg">
            Respuestas a las dudas más comunes y canales de contacto directo con nuestro equipo.
          </p>

          {/* Quick Search */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en preguntas frecuentes (ej: pagos, cancelar, aula)..."
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveCategory('todas')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeCategory === 'todas'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Todas las preguntas
          </button>
          <button
            onClick={() => setActiveCategory('alumnos')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeCategory === 'alumnos'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <i className="fa-solid fa-graduation-cap mr-1.5"></i> Alumnos & Clases
          </button>
          <button
            onClick={() => setActiveCategory('pagos')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeCategory === 'pagos'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <i className="fa-solid fa-credit-card mr-1.5"></i> Pagos & Billetera
          </button>
          <button
            onClick={() => setActiveCategory('tutores')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeCategory === 'tutores'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <i className="fa-solid fa-chalkboard-user mr-1.5"></i> Tutores & Docencia
          </button>
        </div>

        {/* Main Grid: FAQ Accordions (Col 7) + Contact Form (Col 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* FAQ Accordion List */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
              <i className="fa-regular fa-circle-question text-brand-600"></i> Preguntas Frecuentes
            </h2>

            {filteredFAQs.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
                <i className="fa-solid fa-inbox text-slate-300 text-3xl mb-3"></i>
                <p className="text-slate-600 text-sm font-semibold">No se encontraron resultados para tu búsqueda.</p>
                <p className="text-slate-400 text-xs mt-1">Escríbenos directamente a través del formulario lateral.</p>
              </div>
            ) : (
              filteredFAQs.map((faq) => {
                const isOpen = openFAQId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFAQId(isOpen ? null : faq.id)}
                      className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-bold text-slate-800 hover:text-brand-600 transition-colors"
                    >
                      <span className="text-sm sm:text-base">{faq.question}</span>
                      <i
                        className={`fa-solid fa-chevron-down text-xs text-slate-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-brand-600' : ''
                        }`}
                      ></i>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100 bg-slate-50/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Contact Form & Support Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Contacto Directo</span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">Envíanos un mensaje</h2>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Respondemos en menos de 2 horas en horario de atención.
              </p>

              {formSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center text-emerald-800">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="fa-solid fa-check text-emerald-600 text-xl"></i>
                  </div>
                  <h3 className="font-extrabold text-base">¡Mensaje enviado con éxito!</h3>
                  <p className="text-xs text-emerald-700 mt-1">
                    Nos pondremos en contacto contigo a la brevedad a través de tu email.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Ej. Juan Pérez"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="juan@example.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Motivo de Contacto</label>
                    <select
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                    >
                      <option value="soporte">Soporte técnico o ayuda con una clase</option>
                      <option value="pagos">Consulta sobre pagos o reembolsos</option>
                      <option value="tutor">Preguntas sobre postulación docente</option>
                      <option value="alianzas">Alianzas universitarias o empresas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mensaje o Detalle</label>
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Describe en qué podemos ayudarte..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold rounded-xl shadow transition-all"
                  >
                    Enviar Mensaje →
                  </button>
                </form>
              )}
            </div>

            {/* Channels & Info card */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4">
              <h3 className="font-bold text-sm text-brand-300 uppercase tracking-wider">Canales de Atención</h3>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-envelope text-brand-400"></i>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Email de soporte</p>
                    <p className="font-semibold text-white">soporte@educonnect.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-clock text-amber-400"></i>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Horario de atención</p>
                    <p className="font-semibold text-white">Lunes a Sábado: 8:00 AM – 8:00 PM</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <i className="fa-brands fa-whatsapp text-emerald-400"></i>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Atención vía WhatsApp</p>
                    <p className="font-semibold text-white">+1 (800) 555-EDUCON</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
