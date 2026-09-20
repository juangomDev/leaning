# 🎓 EduConnect

Plataforma integral de Tutorías y Clases Particulares con arquitectura desacoplada, Frontend en **React 19 + Vite** y Backend en **Node.js + Express + TypeScript** con persistencia dual (**Supabase PostgreSQL** e **In-Memory**).

---

## 📁 Estructura del Repositorio

```text
.
├── client/     # Frontend interactivo (React 19 + Vite + Vanilla CSS Modular)
├── server/     # Backend REST API (Node.js + Express + TypeScript + Clean Architecture)
│   └── supabase/
│       ├── schema.sql   # DDL completo: tablas, índices, RLS y triggers automáticos
│       └── seed.sql     # Semilla de datos: usuarios demo, tutores, materias y billeteras
├── legacy/     # Maquetas y prototipos HTML/CSS originales de referencia
└── README.md   # Documentación general del repositorio
```

---

## 👥 Cuentas y Usuarios de Prueba (Seed Data)

Todos los usuarios de demostración están preconfigurados tanto en el mock en memoria como en el script [server/supabase/seed.sql](server/supabase/seed.sql) para Supabase Auth.

> **Contraseña universal para todas las cuentas demo:** `password123`

| Rol | Correo Electrónico | Nombre | ID / UUID | Saldo Billetera |
| :--- | :--- | :--- | :--- | :--- |
| **Estudiante** | `alumno@educonnect.com` | Alejandro Silva | `11111111-1111-1111-1111-111111111110` | $150.00 USD |
| **Administrador** | `admin@educonnect.com` | Administrador General | `99999999-9999-9999-9999-999999999999` | $0.00 USD |
| **Tutor** (Matemáticas) | `elena@educonnect.com` | Dra. Elena Rostova | `11111111-1111-1111-1111-111111111111` | $320.00 USD |
| **Tutor** (Programación) | `carlos@educonnect.com` | Ing. Carlos Mendoza | `22222222-2222-2222-2222-222222222222` | $450.00 USD |
| **Tutor** (Inglés) | `sarah@educonnect.com` | Sarah Jenkins | `33333333-3333-3333-3333-333333333333` | $0.00 USD |
| **Tutor** (Física) | `miguel@educonnect.com` | Prof. Miguel Ángel | `44444444-4444-4444-4444-444444444444` | $0.00 USD |
| **Tutor** (Bases de Datos) | `valeria@educonnect.com` | Valeria Gómez | `55555555-5555-5555-5555-555555555555` | $0.00 USD |
| **Tutor** (Inglés Conv.) | `david@educonnect.com` | David Smith | `66666666-6666-6666-6666-666666666666` | $0.00 USD |

---

## 🗄️ Base de Datos Supabase (PostgreSQL)

El esquema de persistencia soporta el ciclo de vida completo de la plataforma. Para aplicarlo en tu proyecto de Supabase:

1. Ingresa a tu proyecto en [Supabase Console](https://supabase.com).
2. Abre la sección **SQL Editor**.
3. Ejecuta primero [server/supabase/schema.sql](server/supabase/schema.sql):
   - Crea las tablas `profiles`, `tutors`, `tutor_subjects`, `students`, `bookings`, `reviews`, `wallets` y `wallet_transactions`.
   - Activa Row Level Security (RLS) e índices de búsqueda.
   - Instala el trigger `handle_new_user()` que crea automáticamente perfil y billetera al registrarse un usuario en Supabase Auth.
4. Ejecuta [server/supabase/seed.sql](server/supabase/seed.sql):
   - Siembra los usuarios de prueba en `auth.users` y enlaza sus perfiles, materias, reservas y transacciones iniciales.

---

## 🚀 Puesta en Marcha

### 1. Servidor Backend (`server/`)
API REST construida con TypeScript y Clean Architecture (DDD).

```bash
cd server
npm install

# Copiar variables de entorno
cp .env.example .env    # Configura SUPABASE_URL y claves según aplique

# Iniciar servidor (http://localhost:5000)
npm run dev

# Ejecutar pruebas automatizadas
npm test

# Compilar TypeScript a JavaScript
npm run build
```

#### Variables de Entorno Clave (`server/.env`):
- `PORT`: Puerto de escucha (por defecto `5000`).
- `NODE_ENV`: `development` | `production`.
- `SUPABASE_URL`: URL del proyecto Supabase (`https://<project-ref>.supabase.co`).
- `SUPABASE_SERVICE_ROLE_KEY`: Clave secreta con privilegios para el backend.
- `SUPABASE_ANON_KEY`: Clave pública de Supabase.
- `JWT_SECRET`: Secreto JWT para firmar y validar sesiones de usuario.

### 2. Cliente Frontend (`client/`)
Interfaz de usuario React 19 optimizada con Vite y gestión de sesión con cookies HttpOnly.

```bash
cd client
npm install

# Iniciar en modo desarrollo (http://localhost:5173)
npm run dev

# Compilar para producción
npm run build
```

#### Variables de Entorno Clave (`client/.env`):
- `VITE_BACKEND_URL`: URL base de la API (`http://localhost:5000/api/v1`).
- `VITE_SUPABASE_URL`: URL del proyecto Supabase (opcional para consumo directo).
- `VITE_SUPABASE_ANON_KEY`: Clave anónima pública de Supabase.

---

## 🔐 Seguridad y Autenticación

- **Cookies HttpOnly**: La autenticación usa cookies `auth_token` con flag `HttpOnly` y `SameSite: Lax/Strict`, previniendo ataques de robo de sesión por XSS.
- **CORS Seguro**: Permite credenciales (`credentials: true`) restringidas al origen del cliente web (`http://localhost:5173`).
- **Control de Acceso basado en Roles (RBAC)**: Roles `student`, `tutor` y `admin`.
- **Protección de Billetera y Reservas**: Validaciones de saldo disponible y estados de transición en reservas (`pending` → `confirmed` → `completed` / `cancelled`).

---

## 📚 Endpoints Principales (`/api/v1`)

- **Auth**: `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`, `POST /auth/forgot-password`, `POST /auth/reset-password`
- **Tutores**: `GET /tutors` (filtros `?q=`, `?categoria=`, `?modalidad=`, `?maxPrice=`), `GET /tutors/:id`, `POST /tutors/apply`
- **Estudiantes**: `POST /students`, `GET /students/profile`, `GET /students/:id`, `PUT /students/:id`
- **Reservas**: `POST /bookings`, `GET /bookings/my-bookings`, `PATCH /bookings/:id/status`
- **Reseñas**: `POST /reviews`, `GET /reviews/tutor/:tutorId`
- **Billetera**: `GET /wallet/balance`, `POST /wallet/recharge`
- **Administración**: `POST /admin/tutors/:id/approve`, `POST /admin/users/:id/ban`, `POST /admin/reviews/:id/moderate`
- **Salud del Sistema**: `GET /health`
