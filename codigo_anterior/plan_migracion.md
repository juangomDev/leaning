# 🚀 Plan de Migración: EduConnect — De HTML Estático a Aplicación Full-Stack

> **Proyecto:** EduConnect — Plataforma de Tutorías Privadas
> **Origen:** index.html (959 líneas, estático)
> **Destino:** Aplicación React + API Backend con persistencia de datos
> **Fecha de planificación:** 2026-09-02

---

## 🎯 Objetivo

Convertir la landing page estática de EduConnect en un sistema web completo y funcional donde:
- Los usuarios (estudiantes y tutores) puedan registrarse, iniciar sesión y gestionar su perfil
- Los tutores sean datos reales almacenados en una base de datos
- Los estudiantes puedan reservar clases, ver su historial y pagar
- Los tutores puedan administrar su disponibilidad y ver sus reservas
- Todo el estado de la aplicación sea persistente y seguro

---

## 🧱 Stack Tecnológico Propuesto

### Frontend
| Tecnología               | Rol                              | Razón de elección                       |
|--------------------------|----------------------------------|-----------------------------------------|
| React 18                 | Framework de UI                  | Componentes reutilizables, ecosistema maduro |
| Vite                     | Bundler y dev server             | Extremadamente rápido, fácil configuración |
| React Router v6          | Navegación SPA                   | Estándar de facto para SPAs React       |
| TailwindCSS              | Estilos (ya usado en el proyecto)| Migración directa sin reescribir estilos|
| Zustand                  | Gestión de estado global         | Más simple que Redux, ideal para este tamaño|
| TanStack Query (React Query) | Fetching y caché de datos    | Manejo automático de loading/error/caché|
| React Hook Form + Zod    | Formularios y validación         | Type-safe, validación eficiente         |

---

## 🔌 Evaluación de API / Backend

### ✅ OPCIÓN A — Supabase (Recomendada para MVP)
- Backend-as-a-Service con PostgreSQL, Auth, Storage y API REST automática
- Auth: Email/Password + OAuth (Google, GitHub), JWT automático
- DB: PostgreSQL con Row Level Security (RLS)
- Storage: Para fotos de perfil de tutores
- Costo: Free tier generoso (500MB DB, 2GB Storage)
- VENTAJA: Sin servidor propio, tiempo de setup mínimo
- DESVENTAJA: Menos control sobre lógica de negocio compleja

### ⚡ OPCIÓN B — Node.js + Express + PostgreSQL (Máximo control)
- API REST propia con Express.js y Prisma ORM
- Auth: JWT + bcrypt para contraseñas
- Hosting: Railway o Render (~$7/mes)
- VENTAJA: Control total, lógica personalizada
- DESVENTAJA: Mayor tiempo de setup y mantenimiento

### 🔥 OPCIÓN C — Firebase
- Auth muy maduro (Firebase Auth)
- DB: Firestore (NoSQL, tiempo real nativo)
- VENTAJA: Tiempo real nativo, Auth robusto
- DESVENTAJA: NoSQL complica queries relacionales (tutores + reservas)

> RECOMENDACIÓN: Comenzar con Supabase (Opción A) para MVP. Migrar a Node.js propio si se necesita lógica de negocio más compleja.

---

## 🗂️ Estructura de Carpetas (React + Vite)

```
educonnect-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/
│   │   ├── supabaseClient.js
│   │   ├── auth.js
│   │   ├── tutors.js
│   │   └── bookings.js
│   ├── components/
│   │   ├── ui/         (Button, Modal, Toast, Badge)
│   │   ├── layout/     (Navbar, Footer, Layout)
│   │   ├── tutors/     (TutorCard, TutorGrid, TutorFilters, TutorProfileModal)
│   │   └── booking/    (BookingForm, BookingConfirmation)
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── TutorsList.jsx
│   │   ├── TutorProfile.jsx
│   │   ├── Dashboard/
│   │   │   ├── StudentDashboard.jsx
│   │   │   └── TutorDashboard.jsx
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   └── NotFound.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTutors.js
│   │   └── useBookings.js
│   ├── store/
│   │   ├── authStore.js
│   │   └── uiStore.js
│   ├── utils/
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── router/
│   │   └── index.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── .env.example
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🗄️ Diseño de Base de Datos (PostgreSQL / Supabase)

### Tabla: profiles
- id (UUID, PK, referencia auth.users)
- full_name (TEXT)
- avatar_url (TEXT)
- role (TEXT: 'student' | 'tutor')
- created_at (TIMESTAMPTZ)

### Tabla: tutors
- id (UUID, PK, referencia profiles)
- subject_name (TEXT)
- subject_category (TEXT: matematicas | programacion | ingles | ciencias)
- bio (TEXT)
- price_per_hour (NUMERIC)
- modality (TEXT: online | presencial | ambas)
- rating (NUMERIC, default 0)
- reviews_count (INT, default 0)
- badges (TEXT[])
- is_available (BOOLEAN)

### Tabla: bookings
- id (UUID, PK)
- student_id (UUID → profiles)
- tutor_id (UUID → tutors)
- scheduled_at (TIMESTAMPTZ)
- duration_hours (INT, default 1)
- modality (TEXT)
- status (TEXT: pending | confirmed | cancelled | completed)
- total_price (NUMERIC)
- notes (TEXT)

### Tabla: reviews
- id (UUID, PK)
- booking_id (UUID → bookings)
- student_id (UUID → profiles)
- tutor_id (UUID → tutors)
- rating (INT, 1–5)
- comment (TEXT)

### Tabla: availability
- id (UUID, PK)
- tutor_id (UUID → tutors)
- day_of_week (INT, 0–6)
- start_time (TIME)
- end_time (TIME)

---

## 🗺️ Rutas de la Aplicación

| Ruta                | Componente             | Acceso       | Descripción                              |
|---------------------|------------------------|--------------|------------------------------------------|
| /                   | Home.jsx               | Público      | Landing page completa                    |
| /tutores            | TutorsList.jsx         | Público      | Listado con filtros avanzados            |
| /tutores/:id        | TutorProfile.jsx       | Público      | Perfil detallado del tutor               |
| /login              | Login.jsx              | No auth      | Formulario de inicio de sesión           |
| /registro           | Register.jsx           | No auth      | Registro como estudiante o tutor         |
| /dashboard          | StudentDashboard.jsx   | Estudiante   | Reservas, historial, perfil              |
| /dashboard/tutor    | TutorDashboard.jsx     | Tutor        | Clases, disponibilidad, ingresos         |
| *                   | NotFound.jsx           | Público      | Página 404                               |

---

## 🔐 Sistema de Autenticación

### Flujo de Registro
1. Usuario completa form y elige rol (Estudiante / Tutor)
2. Supabase crea usuario en auth.users
3. Trigger crea registro en la tabla profiles
4. Si rol = tutor → redirigir a completar perfil
5. JWT se almacena en memoria / cookies seguras

### Flujo de Login
1. Email + Password → Supabase Auth
2. Si válido → retorna session con JWT
3. Zustand authStore guarda { user, session, role }
4. React Router redirige según rol al dashboard correspondiente

### Protección de rutas
- ProtectedRoute verifica sesión activa
- Redirige a /login si no hay sesión
- Valida rol permitido para acceder al recurso

---

## 📋 Plan de Migración por Fases

### FASE 1 — Setup del Proyecto (Semana 1)
- [ ] Inicializar con: npm create vite@latest educonnect-app -- --template react
- [ ] Configurar TailwindCSS
- [ ] Instalar dependencias: React Router, Zustand, TanStack Query, React Hook Form, Zod
- [ ] Crear cuenta en Supabase y configurar proyecto
- [ ] Configurar variables de entorno (.env)
- [ ] Implementar estructura de carpetas
- [ ] Crear layout base: Navbar, Footer, Layout

### FASE 2 — Migración Landing Page (Semana 1–2)
- [ ] Migrar Hero Section → HeroSection.jsx
- [ ] Migrar Banner Propuesta de Valor → ValueBanner.jsx
- [ ] Migrar Sección Materias → SubjectCategories.jsx
- [ ] Migrar TutorCard → TutorCard.jsx (con datos reales de API)
- [ ] Migrar TutorGrid + filtros → TutorGrid.jsx
- [ ] Migrar HowItWorks, Testimonials, TutorCTA

### FASE 3 — Backend y Base de Datos (Semana 2–3)
- [ ] Crear tablas en Supabase: profiles, tutors, bookings, reviews, availability
- [ ] Configurar Row Level Security (RLS) en todas las tablas
- [ ] Poblar DB con los 6 tutores actuales (seed)
- [ ] Crear triggers para calcular rating promedio automáticamente
- [ ] Implementar api/supabaseClient.js
- [ ] Implementar api/tutors.js, api/auth.js, api/bookings.js

### FASE 4 — Autenticación (Semana 3)
- [ ] Página Login.jsx con validación Zod
- [ ] Página Register.jsx con elección de rol
- [ ] Custom hook useAuth.js
- [ ] authStore.js con Zustand
- [ ] ProtectedRoute.jsx
- [ ] Navbar actualizado con estado de sesión

### FASE 5 — Dashboards (Semana 4)
- [ ] Dashboard Estudiante: reservas próximas, historial, perfil, dejar reseñas
- [ ] Dashboard Tutor: clases programadas, disponibilidad, ingresos, editar perfil

### FASE 6 — Módulo de Reservas (Semana 4–5)
- [ ] TutorProfile.jsx con calendario de disponibilidad real
- [ ] BookingForm.jsx con selector de fecha/hora disponible
- [ ] Lógica de confirmación → crea fila en bookings
- [ ] Email de confirmación (Supabase Edge Functions + Resend)
- [ ] Sistema de cancelación con políticas

### FASE 7 — Polish y Deploy (Semana 5–6)
- [ ] Búsqueda por texto libre
- [ ] Filtros avanzados (precio, rating, modalidad)
- [ ] Paginación de tutores
- [ ] SEO: meta tags dinámicos, Open Graph
- [ ] Optimización de imágenes
- [ ] Deploy Frontend → Vercel (free tier)
- [ ] Configurar dominio personalizado (opcional)

---

## 🔄 Comparación: Antes vs. Después

| Aspecto             | HTML Estático (Actual)      | React + API (Nuevo)                  |
|---------------------|-----------------------------|--------------------------------------|
| Datos de tutores    | Hardcodeados en JS          | Base de datos PostgreSQL real        |
| Autenticación       | No existe                   | JWT con Supabase Auth                |
| Reservas            | Solo muestra un toast       | Guardadas en DB, gestionables        |
| Registro tutores    | Solo muestra un toast       | Crea perfil real en la plataforma    |
| Navegación          | Scroll dentro de 1 página   | Rutas reales (SPA con React Router)  |
| Estado              | Variables JS locales         | Zustand + React Query + Supabase     |
| Escalabilidad       | Ninguna                     | Alta: DB, cache, paginación          |
| Tiempo real         | No                          | Posible con Supabase Realtime        |

---

## 💰 Estimación de Costos (MVP)

| Servicio    | Plan                        | Costo mensual |
|-------------|-----------------------------|---------------|
| Supabase    | Free (hasta 50k reqs/mes)   | $0            |
| Vercel      | Free (Hobby)                | $0            |
| Dominio     | Namecheap / GoDaddy         | ~$1/mes       |
| TOTAL MVP   |                             | ~$0–$1/mes    |

> Una vez que supere el free tier de Supabase: ~$25/mes (Pro plan)

---

## ⚠️ Consideraciones de Seguridad

- Row Level Security (RLS) OBLIGATORIO en Supabase para cada tabla
- Nunca exponer claves de servicio en el frontend (solo usar anon key)
- Validación de datos tanto en frontend (Zod) como en backend (RLS + constraints)
- Sanitización de inputs para prevenir XSS
- CORS configurado correctamente en la API

---

## ❓ Preguntas Abiertas (Decisiones Pendientes)

1. ¿Necesitamos integrar pagos? (Stripe cambia arquitectura del backend)
2. ¿Chat entre tutor y estudiante? (Supabase Realtime o Stream Chat)
3. ¿Video conferencia integrada? (Daily.co, Zoom SDK o link manual)
4. ¿TypeScript o JavaScript? (TS más seguro pero más setup inicial)
5. ¿Supabase o backend propio a largo plazo?
6. ¿Cuándo se necesita el MVP? (afecta decisiones de stack)

---

## 🛠️ Próximos Pasos Inmediatos

1. Aprobar este plan y resolver las preguntas abiertas
2. Crear repositorio en GitHub
3. Ejecutar: npm create vite@latest educonnect-app -- --template react
4. Crear proyecto en supabase.com
5. Comenzar la Fase 1
