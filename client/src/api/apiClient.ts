import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api/v1';

/**
 * Cliente HTTP Axios configurado para EduConnect
 * Incluye withCredentials: true para el manejo nativo de cookies HttpOnly (auth_token)
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Extrae de forma segura y amigable el mensaje de error de cualquier respuesta HTTP o excepción
 */
export function extractErrorMessage(
  err: any,
  fallback = 'Ha ocurrido un error inesperado. Por favor intenta nuevamente.'
): string {
  if (!err) return fallback;

  if (typeof err === 'string') {
    return err !== '[object Object]' ? err : fallback;
  }

  // 1. Errores estructurados de la Clean Architecture del servidor: { success: false, error: { type, message } }
  const serverError = err.response?.data?.error;
  if (typeof serverError === 'object' && serverError !== null) {
    if (typeof serverError.message === 'string' && serverError.message.trim().length > 0) {
      return serverError.message;
    }
  } else if (typeof serverError === 'string' && serverError.trim().length > 0) {
    return serverError;
  }

  // 2. Formato estándar de Express o Supabase: { message: string }
  if (typeof err.response?.data?.message === 'string' && err.response.data.message.trim().length > 0) {
    return err.response.data.message;
  }

  // 3. Formato OAuth / Supabase Auth: { error_description: string }
  if (typeof err.response?.data?.error_description === 'string') {
    return err.response.data.error_description;
  }

  // 4. Array de errores de validación: { errors: [ ... ] }
  if (Array.isArray(err.response?.data?.errors) && err.response.data.errors.length > 0) {
    const first = err.response.data.errors[0];
    if (typeof first === 'string') return first;
    if (typeof first?.message === 'string') return first.message;
    if (typeof first?.msg === 'string') return first.msg;
  }

  // 5. Mensaje nativo de Error (si no es [object Object])
  if (typeof err.message === 'string' && err.message !== '[object Object]' && err.message.trim().length > 0) {
    if (err.message.includes('Network Error')) {
      return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    }
    if (err.message.includes('401')) {
      return 'Credenciales inválidas. Verifica tu correo y contraseña.';
    }
    if (err.message.includes('404')) {
      return 'El recurso solicitado no fue encontrado.';
    }
    if (err.message.includes('409')) {
      return 'Ya existe un usuario o recurso registrado con estos datos.';
    }
    return err.message;
  }

  // 6. Códigos de estado HTTP si no hubo cuerpo
  const status = err.response?.status || err.status;
  if (status === 401) return 'Credenciales inválidas o sesión expirada.';
  if (status === 403) return 'No tienes autorización para realizar esta acción.';
  if (status === 404) return 'El recurso solicitado no fue encontrado.';
  if (status === 409) return 'Ya existe una cuenta con estos datos.';
  if (status === 429) return 'Demasiados intentos. Por favor espera unos minutos.';
  if (status && status >= 500) return 'Ocurrió un error en el servidor. Por favor intenta más tarde.';

  return fallback;
}

// Interceptor de respuesta para manejo uniforme de errores y extracción
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const message = extractErrorMessage(error);
    const customError: any = new Error(message);
    customError.response = error.response;
    customError.status = error.response?.status;
    customError.data = error.response?.data;
    customError.isAxiosError = true;

    return Promise.reject(customError);
  }
);

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then((res) => res.data),

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config).then((res) => res.data),

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config).then((res) => res.data),

  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config).then((res) => res.data),
};
