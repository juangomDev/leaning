import app from './app.js';
import { config } from './config/env.js';

const PORT = config.port || 5000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 EduConnect Backend [TypeScript & Clean Architecture] activo`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/v1/health`);
  console.log(`🌐 Modo: ${config.isSupabaseConfigured() ? 'Supabase Database' : 'In-Memory Mock Database'}`);
  console.log(`====================================================`);
});
