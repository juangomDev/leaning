# 📄 Documentación Completa: EduConnect — index.html

> Archivo: `index.html` | Líneas totales: **959** | Tamaño: **~57 KB**
> Fecha de análisis: 2026-09-02

---

## 🌐 Información General

| Campo             | Valor                                     |
|-------------------|-------------------------------------------|
| **Título**        | EduConnect - Clases Privadas y Tutorías   |
| **Idioma**        | Español (`lang="es"`)                     |
| **Charset**       | UTF-8                                     |
| **Viewport**      | `width=device-width, initial-scale=1.0`   |
| **Framework CSS** | Tailwind CSS (CDN)                        |
| **Iconos**        | Font Awesome 6.4.0                        |
| **Tipografía**    | Plus Jakarta Sans (Google Fonts)          |
| **Año copyright** | 2026                                      |

---

## 🎨 Sistema de Diseño (Tailwind Config)

### Fuente principal
- `Plus Jakarta Sans`, sans-serif

### Paleta de colores (`brand`)
| Token          | Valor Hex                                  |
|----------------|--------------------------------------------|
| `brand.50`     | `#f0f7ff`                                  |
| `brand.100`    | `#e0effe`                                  |
| `brand.500`    | `#2563eb`                                  |
| `brand.600`    | `#1d4ed8`                                  |
| `brand.700`    | `#1e40af`                                  |
| `brand.accent` | `#f97316` (naranja, para CTA secundarios)  |

---

## 🏗️ Estructura de Secciones

### 1. Header — Navegación Principal (líneas 38–67)
- **Posición:** Sticky (`top-0`), z-index 40
- **Fondo:** `bg-white/90` con `backdrop-blur-md`
- **Logo:** Ícono `fa-graduation-cap` + texto `Edu` + `Connect` (azul)
- **Menú de navegación (solo desktop `md:`):**
  - Materias → `#materias`
  - Tutores Destacados → `#tutores`
  - ¿Cómo funciona? → `#como-funciona`
  - Enseñar en EduConnect → `#ser-tutor`
- **Botones de acción:**
  - `Iniciar Sesión` → abre modal `loginModal`
  - `Buscar Tutor` → enlaza a `#tutores`

---

### 2. Hero Section (líneas 70–178)
- **Fondo:** Gradiente `from-brand-50/50 via-white to-slate-50`
- **Layout:** Grid `lg:grid-cols-12` (7 cols contenido, 5 cols imagen)
- **Badge:** "★ Plataforma líder en tutorías personalizadas"
- **Título H1:** "Encuentra el tutor ideal para alcanzar tus metas académicas"
- **Subtítulo:** Conecta con profesores verificados para clases presenciales o en línea.
- **Barra de búsqueda interactiva (`#heroSearchForm`):**
  - Select `#heroSubject`: Matemáticas / Programación / Inglés / Física / Química
  - Select `#heroModal`: Todas / En Línea / Presencial
  - Botón: **Buscar** → filtra y hace scroll a `#tutores`
- **Estadísticas rápidas:**
  - `+1,500` Tutores Verificados
  - `98%` Calificaciones Positivas
  - `+50` Materias Disponibles
- **Imagen lateral:** Unsplash (foto de estudiantes, 800×460px)
- **Tarjetas flotantes:**
  - "100% Verificados — Credenciales validadas" (verde, animación bounce)
  - "⭐ 4.9 / 5.0" (rating flotante)

---

### 3. Banner de Propuesta de Valor (líneas 181–215)
- **Fondo:** `bg-white` con borde `border-y`
- **3 columnas (md):**

| Ícono                | Título                    | Descripción                                         |
|----------------------|---------------------------|-----------------------------------------------------|
| `fa-user-check`      | Perfiles Transparentes    | Revisa antecedentes, formación y opiniones reales.  |
| `fa-calendar-check`  | Flexibilidad Total        | Sin paquetes obligatorios. Coordina tus horarios.   |
| `fa-handshake-angle` | Garantía de Satisfacción  | Si la 1ª clase no cumple, reasignamos sin costo.    |

---

### 4. Sección #materias — Categorías de Estudio (líneas 218–279)
- **Fondo:** `bg-slate-50`
- **Título H2:** "Explora por área de estudio"
- **Grid:** 4 columnas (`lg`), 2 columnas (`sm`)
- **Tarjetas de categoría** (onclick → filtra tutores + scroll suave):

| # | Categoría          | Ícono           | Color base   | Cantidad        |
|---|--------------------|-----------------|--------------|-----------------|
| 1 | Matemáticas        | `fa-calculator` | `blue-50`    | 320+ profesores |
| 2 | Programación & TI  | `fa-code`       | `purple-50`  | 210+ profesores |
| 3 | Idiomas            | `fa-language`   | `amber-50`   | 450+ profesores |
| 4 | Ciencias Naturales | `fa-atom`       | `emerald-50` | 180+ profesores |

- **Hover:** ícono cambia a fondo azul, borde azul aparece, flecha se desplaza →

---

### 5. Sección #tutores — Tutores Destacados (líneas 282–322)
- **Fondo:** `bg-white`
- **Título H2:** "Tutores Destacados"
- **Tabs de filtro:**
  - `Todos` (activo por defecto) | `Matemáticas` | `Programación` | `Inglés`
- **Grid de tarjetas:** `#tutorsGrid` — generado dinámicamente por JavaScript
- **Estado vacío:** `#noResults` con botón "Restablecer filtros"

#### Base de datos de tutores (`tutorsData` — 6 tutores):

| ID | Nombre              | Materia                   | Categoría    | Rating | Reseñas | Precio/h | Modalidad  | Badges                        |
|----|---------------------|---------------------------|--------------|--------|---------|----------|------------|-------------------------------|
| 1  | Dra. Elena Rostova  | Matemáticas & Cálculo     | matematicas  | 4.9    | 84      | $25 USD  | Online     | Tutor Top, Verificada         |
| 2  | Ing. Carlos Mendoza | Programación Python & Web | programacion | 5.0    | 112     | $30 USD  | Presencial | Respuesta Rápida, Verificado  |
| 3  | Sarah Jenkins       | Inglés Nativo & TOEFL     | ingles       | 4.8    | 65      | $22 USD  | Online     | Nativa, Verificada            |
| 4  | Prof. Miguel Ángel  | Álgebra y Física Básica   | matematicas  | 4.9    | 43      | $20 USD  | Presencial | Paciencia Garantizada         |
| 5  | Valeria Gómez       | Bases de Datos & SQL      | programacion | 4.7    | 29      | $28 USD  | Online     | Verificada                    |
| 6  | David Smith         | Inglés Conversacional     | ingles       | 4.9    | 91      | $24 USD  | Online     | Tutor Top                     |

**Estructura de cada tarjeta:**
- Avatar con punto verde (disponible hoy)
- Nombre, materia, rating ⭐, número de opiniones
- Bio resumida (máx. 3 líneas)
- Badges de modalidad e insignias
- Precio por hora + botón `Ver Perfil` → abre modal de tutor

---

### 6. Sección #como-funciona (líneas 325–371)
- **Fondo:** `bg-slate-900` (oscuro) con patrón radial decorativo (`opacity-10`)
- **Título H2:** "¿Cómo funciona la plataforma?"
- **3 Pasos:**

| Paso | Título           | Descripción                                                           |
|------|------------------|-----------------------------------------------------------------------|
| 1    | Busca y compara  | Explora perfiles, lee opiniones, verifica experiencia y tarifas.      |
| 2    | Reserva tu clase | Elige modalidad y el horario disponible según tu agenda.              |
| 3    | Aprende y avanza | Conéctate al aula virtual o acude al punto. Evalúa tu clase.         |

---

### 7. Sección Testimonios (líneas 374–446)
- **Fondo:** `bg-slate-50`
- **Título H2:** "Lo que dicen nuestros estudiantes"
- **3 testimonios (5 estrellas cada uno):**

| Persona         | Rol                       | Testimonio (resumen)                                        |
|-----------------|---------------------------|-------------------------------------------------------------|
| Camila Torres   | Estudiante de Ingeniería  | Aprendió Cálculo Integral con profesora Elena en 4 sesiones.|
| Mateo Ríos      | Desarrollador Web         | Preparó entrevista técnica en inglés con Carlos.            |
| Sofía Mendoza   | Estudiante de Bachillerato| La garantía de clase le dio confianza para tomar Física.    |

---

### 8. Sección #ser-tutor — CTA para Tutores (líneas 449–487)
- **Fondo:** Gradiente `from-brand-600 to-indigo-700`
- **Badge:** "¿Eres profesor o especialista?"
- **Título H2:** "Enseña en EduConnect y genera ingresos compartiendo tu conocimiento"
- **Beneficios:**
  - ✅ Sin cuotas de inscripción
  - ✅ Cobros semanales seguros
  - ✅ Herramientas para tus clases
- **Panel de registro (tarjeta blanca):**
  - Texto: "Completa tu registro en menos de 5 minutos"
  - Botón: "Regístrate como Tutor" → abre `tutorRegisterModal`

---

### 9. Footer (líneas 490–551)
- **Fondo:** `bg-slate-950`
- **5 columnas en grid (md):**

| Columna     | Contenido                                                              |
|-------------|------------------------------------------------------------------------|
| Brand (×2)  | Logo + descripción + redes sociales (Facebook, Instagram, LinkedIn, X) |
| Estudiantes | Buscar Tutores, Categorías, Garantía de Clase, Precios y Pagos         |
| Profesores  | Convertirme en Tutor, Requisitos, Centro de Tutores, Casos de Éxito    |
| Soporte     | Preguntas Frecuentes, Contacto, Privacidad, Términos del Servicio      |

- **Copyright:** © 2026 EduConnect Inc. Todos los derechos reservados.

---

## 🪟 Modales

### Modal 1: `#tutorModal` — Perfil y Reserva (líneas 554–565)
- Contenido generado dinámicamente por JS
- Muestra: avatar, nombre, materia, rating, bio, modalidad, precio/hora
- **Formulario de reserva:**
  - Input de fecha (date)
  - Select de hora: 09:00 AM / 02:00 PM / 05:00 PM
  - Botón "Confirmar Reserva de Clase" → toast de confirmación

### Modal 2: `#tutorRegisterModal` — Registro de Tutor (líneas 568–605)
- **Campos del formulario:**
  - Nombre Completo (text, requerido)
  - Correo Electrónico (email, requerido)
  - Materia Principal (select: Matemáticas / Programación / Inglés / Física-Química)
  - Tarifa esperada $/hora (number, rango: 10–100)
  - Botón "Enviar Solicitud" → toast de confirmación

### Modal 3: `#loginModal` — Iniciar Sesión (líneas 608–631)
- **Campos del formulario:**
  - Correo Electrónico (email, requerido)
  - Contraseña (password, requerido)
  - Botón "Ingresar" → toast de sesión iniciada

---

## 🍞 Sistema Toast de Notificaciones (`#toast`)
- **Posición:** `fixed bottom-5 right-5` (esquina inferior derecha)
- Ícono `fa-circle-check` (verde esmeralda) + mensaje de texto
- **Duración automática:** 4 segundos → se oculta solo

---

## ⚙️ Lógica JavaScript (líneas 640–957)

### Variables de estado
- `tutorsData[]` — Array con 6 objetos tutor
- `currentCategoryFilter` — String del filtro activo (default: `'todos'`)

### Funciones

| Función                          | Descripción                                                              |
|----------------------------------|--------------------------------------------------------------------------|
| `renderTutors(list)`             | Genera dinámicamente tarjetas de tutores en `#tutorsGrid`                |
| `filterTutors(category)`         | Filtra tutores por categoría y actualiza estado visual de tabs            |
| `filterBySubjectCategory(cat)`   | Scroll suave a `#tutores` y aplica `filterTutors()`                      |
| `openModal(modalId)`             | Muestra un modal (remueve clase `hidden`)                                |
| `closeModal(modalId)`            | Oculta un modal (agrega clase `hidden`)                                  |
| `openTutorModal(tutorId)`        | Genera contenido dinámico del tutor seleccionado y abre `#tutorModal`    |
| `handleBooking(e, tutorName)`    | Cierra modal de tutor + muestra toast de confirmación de reserva         |
| `handleTutorSubmit(e)`           | Cierra modal de registro + muestra toast de postulación recibida         |
| `handleLoginSubmit(e)`           | Cierra modal de login + muestra toast de sesión iniciada                 |
| `showToast(message)`             | Muestra notificación toast durante 4 segundos y luego la oculta          |

### Eventos registrados
- `DOMContentLoaded` → `renderTutors(tutorsData)` (carga inicial de todos los tutores)
- `heroSearchForm` `submit` → filtra por materia + modalidad → scroll a `#tutores`

---

## 📊 Métricas del Archivo

| Métrica                   | Valor |
|---------------------------|-------|
| Total de líneas           | 959   |
| Tamaño aproximado         | ~58 KB|
| Secciones HTML principales| 9     |
| Modales                   | 3     |
| Tutores en la base de datos| 6    |
| Categorías de materia     | 4     |
| Funciones JavaScript      | 10    |
| Testimonios               | 3     |
| Pasos "Cómo funciona"     | 3     |
| Redes sociales en footer  | 4     |
