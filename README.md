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
API REST desarrollada con Node.js, Express, TypeScript y arquitectura limpia. Incluye la carpeta `server/supabase/` con los scripts de base de datos (`schema.sql` y `seed.sql`).

```bash
cd server
npm install     # Instalar dependencias (si es necesario)
npm run dev     # Iniciar en modo desarrollo con recarga automática
npm run build   # Compilar TypeScript a JavaScript
npm start       # Iniciar servidor en producción
```

### 3. Prototipos Originales (`legacy/`)
Contiene las maquetas estáticas iniciales en HTML y CSS, diagramas de migración y documentación histórica del diseño original.
