import app from './app.js';
import { config } from './infrastructure/config/env.js';

const PORT = config.port || 5000;

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 EduConnect Backend [TypeScript & Clean Architecture]`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/v1/health`);
  console.log(`🌐 Base de datos: ${config.isSupabaseConfigured() ? 'Supabase Database' : 'In-Memory Mock Database'}`);
  console.log(`🛡️  Seguridad: Helmet activo | CORS restringido | Payload limit 200kb`);
  console.log(`====================================================`);
});

// Manejo de errores de escucha (ej. puerto ya en uso)
server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Error fatal: El puerto ${PORT} ya está en uso.`);
  } else {
    console.error(`❌ Error en el servidor HTTP:`, err.message);
  }
  process.exit(1);
});

// Cierre ordenado (Graceful Shutdown)
const gracefulShutdown = (signal: string) => {
  console.log(`\n🛑 Recibida señal ${signal}. Cerrando servidor HTTP de forma segura...`);

  server.close(() => {
    console.log('✅ Servidor HTTP cerrado. No se aceptan más conexiones.');
    process.exit(0);
  });

  // Forzar cierre si no termina tras 10 segundos
  setTimeout(() => {
    console.error('⚠️  Tiempo de espera agotado. Forzando detención del proceso.');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (err: Error) => {
  console.error('💥 Excepción no capturada (uncaughtException):', err);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason: unknown) => {
  console.error('💥 Promesa rechazada no capturada (unhandledRejection):', reason);
  gracefulShutdown('unhandledRejection');
});

export default server;
