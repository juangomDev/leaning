# 🚀 EduConnect Backend API

Servidor REST desarrollado con **Node.js**, **Express**, **TypeScript** y principios de **Clean Architecture** (Domain-Driven Design).

---

## 📌 Configuración y Arranque

```bash
# Instalar dependencias
npm install

# Modo desarrollo con recarga automática
npm run dev

# Ejecutar pruebas automatizadas (72 tests)
npm test

# Verificación estricta de tipos TypeScript
npx tsc -p tsconfig.json --noEmit

# Compilar para producción
npm run build
npm start
```

---

## 🔐 Autenticación y Encabezados Globales

Para rutas protegidas se debe enviar el token JWT en el encabezado `Authorization`:
```http
Authorization: Bearer <tu_token_jwt>
```

Para pruebas locales y entornos de desarrollo, también se soporta el encabezado de simulación:
```http
x-demo-user-id: usr-student-1
x-demo-role: student (o tutor / admin)
```

---

## 📋 Catálogo de Rutas de la API (Prefijo `/api/v1`)

### 1. Sistema y Diagnóstico

| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :---: | :--- |
| `GET` | `/` | Público | Información general y estado del servicio |
| `GET` | `/api/v1/health` | Público | Diagnóstico de salud, arquitectura y timestamp |

---

### 2. Autenticación (`/api/v1/auth`)

#### `POST /api/v1/auth/register`
Registra un nuevo usuario en la plataforma.
- **Acceso:** Público
- **Cuerpo de la petición (JSON):**
```json
{
  "fullName": "Juan Perez",
  "email": "juan@example.com",
  "password": "miPasswordSeguro123",
  "role": "student", // Opcional: "student" | "tutor" | "admin" (default: "student")
  "phone": "+584121234567" // Opcional
}
```
- **Respuesta (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "usr-uuid-generado",
    "email": "juan@example.com",
    "fullName": "Juan Perez",
    "roles": ["student"],
    "avatarUrl": null,
    "phone": "+584121234567",
    "createdAt": "2026-09-19T18:00:00.000Z"
  }
}
```

#### `POST /api/v1/auth/login`
Inicia sesión y genera el token JWT.
- **Acceso:** Público
- **Cuerpo de la petición (JSON):**
```json
{
  "email": "juan@example.com",
  "password": "miPasswordSeguro123"
}
```
- **Respuesta (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr-uuid",
      "email": "juan@example.com",
      "fullName": "Juan Perez",
      "roles": ["student"]
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### `GET /api/v1/auth/me`
Obtiene los datos del usuario autenticado en la sesión actual.
- **Acceso:** Protegido (`Authorization: Bearer <token>`)
- **Datos requeridos:** Ninguno en el cuerpo.
- **Respuesta (200 OK):** Perfil del usuario autenticado.

---

### 3. Tutores (`/api/v1/tutors`)

#### `GET /api/v1/tutors`
Lista los tutores disponibles aplicando filtros de búsqueda.
- **Acceso:** Público
- **Parámetros Query (opcionales):**
  - `q` o `query`: Búsqueda textual por nombre, biografía o materia (ej. `?q=matematicas`)
  - `categoria`: Filtrar por categoría (`matematicas`, `ciencias`, `idiomas`, `programacion`, `musica`, `otro`)
  - `modalidad`: Modalidad de enseñanza (`online`, `presencial`, `ambas`)
  - `maxPrice`: Tarifa máxima por hora (ej. `?maxPrice=30`)
  - `minRating`: Calificación mínima requerida (ej. `?minRating=4.5`)
- **Respuesta (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "1",
      "userId": "usr-tutor-1",
      "fullName": "Dra. Ana Martínez",
      "avatarUrl": "https://...",
      "bio": "Doctora en Matemáticas...",
      "modality": "online",
      "rating": 4.9,
      "reviewsCount": 87,
      "badges": ["Top Tutor", "Verificado"],
      "isAvailable": true,
      "subjects": [
        {
          "id": "subj-1",
          "subjectName": "Cálculo Diferencial e Integral",
          "category": "matematicas",
          "pricePerHour": 25
        }
      ]
    }
  ]
}
```

#### `GET /api/v1/tutors/:id`
Obtiene el perfil detallado de un tutor por su ID.
- **Acceso:** Público
- **Parámetro URL:** `:id` (ID del tutor)

#### `POST /api/v1/tutors/apply`
Postulación o registro inicial como nuevo tutor.
- **Acceso:** Protegido
- **Cuerpo de la petición (JSON):**
```json
{
  "fullName": "Lic. Pedro Sanchez",
  "bio": "Especialista en Física Cuántica y Mecánica.",
  "modality": "online", // "online" | "presencial" | "ambas"
  "subjectName": "Física Moderna",
  "subjectCategory": "ciencias",
  "pricePerHour": 35,
  "description": "Clases preparatorias para exámenes universitarios.",
  "badges": ["Certificado"] // Opcional
}
```

---

### 4. Estudiantes (`/api/v1/students`)

#### `POST /api/v1/students`
Crea el perfil de estudiante para el usuario autenticado.
- **Acceso:** Protegido (`Authorization: Bearer <token>`)
- **Cuerpo de la petición (JSON):**
```json
{
  "educationLevel": "universitario", // "primaria" | "secundaria" | "universitario" | "postgrado" | "otro"
  "learningGoals": "Dominar cálculo vectorial y preparar pruebas de admisión"
}
```

#### `GET /api/v1/students/profile`
Obtiene el perfil de estudiante del usuario autenticado.
- **Acceso:** Protegido (`Authorization: Bearer <token>`)
- **Datos requeridos:** Ninguno en el cuerpo.

#### `GET /api/v1/students/:id`
Consulta el perfil de un estudiante por su ID de estudiante o ID de usuario.
- **Acceso:** Público / Protegido
- **Parámetro URL:** `:id`

#### `PUT /api/v1/students/:id`
Actualiza el nivel educativo y/o las metas de aprendizaje de un estudiante.
- **Acceso:** Protegido (`Authorization: Bearer <token>`)
- **Parámetro URL:** `:id`
- **Cuerpo de la petición (JSON):**
```json
{
  "educationLevel": "postgrado", // Opcional
  "learningGoals": "Completar tesis doctoral en inteligencia artificial" // Opcional
}
```

---

### 5. Reservas de Clases (`/api/v1/bookings`)

#### `POST /api/v1/bookings`
Crea una nueva reserva de tutoría.
- **Acceso:** Protegido (`Authorization: Bearer <token>`)
- **Cuerpo de la petición (JSON):**
```json
{
  "tutorId": "1",
  "subject": "Cálculo Diferencial e Integral",
  "scheduledAt": "2026-10-15T14:00:00.000Z", // Fecha/hora en formato ISO 8601
  "durationHours": 2, // Duración en horas (default: 1)
  "modality": "online", // "online" | "presencial"
  "notes": "Necesito repasar integración por partes para mi examen" // Opcional
}
```
- **Respuesta (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "book-uuid",
    "studentId": "usr-student-1",
    "tutorId": "1",
    "subject": "Cálculo Diferencial e Integral",
    "scheduledAt": "2026-10-15T14:00:00.000Z",
    "durationHours": 2,
    "totalPrice": 50.0,
    "currency": "USD",
    "status": "pending"
  }
}
```

#### `GET /api/v1/bookings/my-bookings`
Lista el historial de reservas asociadas al usuario autenticado (como estudiante o tutor).
- **Acceso:** Protegido (`Authorization: Bearer <token>`)
- **Datos requeridos:** Ninguno.

#### `PATCH /api/v1/bookings/:id/status`
Actualiza el estado de una reserva (confirmar, completar o cancelar).
- **Acceso:** Protegido (`Authorization: Bearer <token>`)
- **Parámetro URL:** `:id` (ID de la reserva)
- **Cuerpo de la petición (JSON):**
```json
{
  "status": "confirmed", // "pending" | "confirmed" | "completed" | "cancelled"
  "notes": "Clase confirmada para la hora indicada" // Opcional
}
```

---

### 6. Reseñas y Calificaciones (`/api/v1/reviews`)

#### `POST /api/v1/reviews`
Emite una reseña y calificación para una clase completada.
- **Acceso:** Protegido (`Authorization: Bearer <token>`)
- **Condición de negocio:** La reserva vinculada debe encontrarse en estado `completed`.
- **Cuerpo de la petición (JSON):**
```json
{
  "bookingId": "book-uuid-completada",
  "rating": 5, // Número entero entre 1 y 5
  "comment": "Excelente tutora, explicó con paciencia y resolvió todos los ejercicios."
}
```

#### `GET /api/v1/reviews/tutor/:tutorId`
Obtiene todas las reseñas públicas registradas para un tutor específico.
- **Acceso:** Público
- **Parámetro URL:** `:tutorId`

---

### 7. Billetera y Saldo (`/api/v1/wallet`)

#### `GET /api/v1/wallet/balance`
Consulta el saldo disponible y el historial de transacciones del usuario autenticado.
- **Acceso:** Protegido (`Authorization: Bearer <token>`)
- **Datos requeridos:** Ninguno.
- **Respuesta (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "usr-student-1",
    "balance": 150.0,
    "currency": "USD",
    "transactions": [
      {
        "id": "tx-1",
        "amount": 50.0,
        "type": "recharge",
        "concept": "Recarga de saldo con tarjeta Visa",
        "status": "completed",
        "createdAt": "2026-09-19T12:00:00.000Z"
      }
    ]
  }
}
```

#### `POST /api/v1/wallet/recharge`
Acredita saldo en la billetera virtual del usuario.
- **Acceso:** Protegido (`Authorization: Bearer <token>`)
- **Cuerpo de la petición (JSON):**
```json
{
  "amount": 25.0, // Monto numérico mayor a 0
  "method": "credit_card" // Opcional ("credit_card", "paypal", "transfer")
}
```

---

### 8. Administración y Moderación (`/api/v1/admin`)

> [!NOTE]
> Todos los endpoints bajo `/api/v1/admin` requieren que el usuario autenticado cuente con el rol `admin`.

#### `POST /api/v1/admin/tutors/:id/approve`
Aprueba a un tutor aspirante, habilitándolo en las búsquedas públicas y asignándole la insignia de verificado.
- **Acceso:** Solo Administrador (`Authorization: Bearer <token>`)
- **Parámetro URL:** `:id` (ID del tutor)

#### `POST /api/v1/admin/users/:id/ban`
Suspende o bloquea la cuenta de un usuario por incumplimiento de términos.
- **Acceso:** Solo Administrador (`Authorization: Bearer <token>`)
- **Parámetro URL:** `:id` (ID del usuario)
- **Cuerpo de la petición (JSON):**
```json
{
  "reason": "Comportamiento inadecuado en sesión de clase" // Opcional
}
```

#### `POST /api/v1/admin/reviews/:id/moderate`
Modera el estado de una reseña reportada.
- **Acceso:** Solo Administrador (`Authorization: Bearer <token>`)
- **Parámetro URL:** `:id` (ID de la reseña)
- **Cuerpo de la petición (JSON):**
```json
{
  "action": "hide" // "approve" | "hide" | "delete"
}
```

---

## 🛡️ Medidas de Seguridad Implementadas

1. **Helmet**: Protección activa con cabeceras de seguridad HTTP (`X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, etc.).
2. **Anti-Fingerprinting**: `app.disable('x-powered-by')` oculta la presencia de Express.
3. **Control de CORS**: Restricción de orígenes autorizados con soporte para credenciales y cache de preflight de 24 horas.
4. **Protección DoS**: Tamaño máximo de payload restringido a `200kb` para evitar ataques por sobrecarga de memoria.
5. **Cierre Ordenado (Graceful Shutdown)**: Captura de señales `SIGINT` y `SIGTERM` con cierre limpio de conexiones y protección contra fallos con timeout de 10s.
6. **Manejo Centralizado de Errores**: Códigos de estado HTTP acordes al dominio (`400`, `401`, `403`, `404`, `409`) y respuestas estructuradas en formato JSON.
