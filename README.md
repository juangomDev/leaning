# 🎓 EduConnect

El proyecto ha sido organizado en dos carpetas principales:

---

## 📁 Estructura del Proyecto

### 1. `codigo_anterior/` (Prototipos Estáticos Originales)
Contiene las maquetas y documentación técnica iniciales:
- **`index.html`**: Landing page estática original (~959 líneas).
- **`Paginas Publicas/`**: Vistas HTML estáticas (`explorar.html`, `login-registro.html`, `tutor-perfil.html`, etc.).
- **`estudiantes/`**: Prototipos del panel de estudiante (`dashboard.html`, `mis-clases.html`, `aula-virtual.html`, etc.).
- **`profesor/`**: Prototipo del panel del profesor.
- **`imagenes/`**: Recursos visuales.
- **`detalles_pagina.md` & `plan_migracion.md`**: Especificación de diseño y análisis de migración.

---

### 2. `codigo_nuevo/` (MVP Full-Stack con Supabase & React)
Contiene la aplicación interactiva moderna:
- **`client/`**:
  - React 18 + Vite + TailwindCSS.
  - Vistas: Landing, Catálogo con filtros avanzados, Perfil de Tutor, Modal de Reserva interactivo, Auth con roles (`Estudiante` y `Tutor`), y Dashboards funcionales.
  - Conexión a Supabase con modo local/demo resiliente.
- **`supabase/`**:
  - `schema.sql`: DDL de PostgreSQL, triggers de perfil y políticas RLS.
  - `seed.sql`: Carga de los 6 tutores de demostración reales.

---

## 🚀 Cómo Ejecutar el Nuevo Código

Desde la raíz del proyecto:

```bash
# Inicia el cliente React en codigo_nuevo/client
npm run dev
```

O entrando directamente a la carpeta del nuevo código:

```bash
cd codigo_nuevo/client
npm run dev
```
Abre en tu navegador `http://localhost:5173`.
