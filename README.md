# 🎓 EduConnect

Plataforma de Tutorías y Clases Privadas.

---

## 📁 Estructura del Proyecto

La raíz del proyecto contiene exactamente 3 carpetas principales y este `README.md`:

```text
.
├── client/     # Frontend interactivo (React 19 + Vite + Vanilla CSS Modular)
├── server/     # Backend y base de datos (Node.js + Express + TypeScript + Supabase)
├── legacy/     # Maquetas y prototipos HTML/CSS originales de referencia
└── README.md   # Documentación del repositorio
```

---

## 🚀 Proyectos Independientes

Cada proyecto es autónomo y gestiona sus propias dependencias y scripts:

### 1. Frontend (`client/`)
Desarrollado con React 19, Vite, Vanilla CSS Modular (ITCSS) y Lucide Icons.

```bash
cd client
npm install     # Instalar dependencias (si es necesario)
npm run dev     # Iniciar servidor de desarrollo en http://localhost:5173
npm run build   # Compilar para producción
```

### 2. Backend (`server/`)
API REST desarrollada con Node.js, Express, TypeScript y Clean Architecture (DDD). Cuenta con persistencia dual (Supabase & In-Memory) y 72 tests automatizados.

```bash
cd server
npm install     # Instalar dependencias
npm run dev     # Iniciar en modo desarrollo (http://localhost:5000)
npm test        # Ejecutar suite de pruebas (72 tests)
npm run build   # Compilar TypeScript a JavaScript
npm start       # Iniciar servidor en producción
```

#### Resumen de Endpoints Disponibles (`/api/v1`):
- **Autenticación**: `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me`
- **Estudiantes**: `POST /api/v1/students`, `GET /api/v1/students/profile`, `GET /api/v1/students/:id`, `PUT /api/v1/students/:id`
- **Tutores**: `GET /api/v1/tutors` (con filtros `?q=`, `?categoria=`, `?modalidad=`), `GET /api/v1/tutors/:id`, `POST /api/v1/tutors/apply`
- **Reservas**: `POST /api/v1/bookings`, `GET /api/v1/bookings/my-bookings`, `PATCH /api/v1/bookings/:id/status`
- **Reseñas**: `POST /api/v1/reviews`, `GET /api/v1/reviews/tutor/:tutorId`
- **Billetera**: `GET /api/v1/wallet/balance`, `POST /api/v1/wallet/recharge`
- **Administración**: `POST /api/v1/admin/tutors/:id/approve`, `POST /api/v1/admin/users/:id/ban`, `POST /api/v1/admin/reviews/:id/moderate`
- **Diagnóstico**: `GET /api/v1/health`

👉 *Para ver los esquemas de datos JSON detallados de cada petición y respuesta, consulta el [README del Backend](server/README.md).*

### 3. Prototipos Originales (`legacy/`)
Contiene las maquetas estáticas iniciales en HTML y CSS, diagramas de migración y documentación histórica del diseño original.

