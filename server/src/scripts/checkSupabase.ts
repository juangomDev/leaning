import { createClient } from '@supabase/supabase-js';
import { config } from '../infrastructure/config/env.js';

async function checkSupabaseConnection() {
  console.log('\n======================================================');
  console.log('🔍 EduConnect - Diagnóstico de Conectividad con Supabase');
  console.log('======================================================\n');

  console.log(`📡 SUPABASE_URL: ${config.supabaseUrl ? config.supabaseUrl : '❌ No definida'}`);
  console.log(`🔑 ANON / PUBLISHABLE_KEY:    ${config.supabaseAnonKey ? '✅ Configurada' : '⚠️  No definida'}`);
  console.log(`🛡️  SERVICE / SECRET_KEY:       ${config.supabaseServiceRoleKey ? '✅ Configurada' : '⚠️  No definida'}`);
  console.log(`🔐 JWT_SECRET:                 ${config.jwtSecret ? '✅ Configurado' : '❌ No definido'}\n`);

  if (!config.isSupabaseConfigured()) {
    console.log('⚠️  ESTADO ACTUAL: Modo In-Memory Mock Database activo.');
    console.log('ℹ️  Motivo: SUPABASE_URL o claves no están configuradas en server/.env (o contienen valores placeholder).\n');
    console.log('📋 INSTRUCCIONES PARA CONECTAR SUPABASE:');
    console.log('1. Ingresa a https://supabase.com y abre tu proyecto.');
    console.log('2. Ve a: Project Settings -> API.');
    console.log('3. Copia Project URL y las claves (anon pública y service_role secreta).');
    console.log('4. Pégalas en el archivo server/.env.');
    console.log('5. Ejecuta nuevamente: npm run check:supabase\n');
    return;
  }

  const keyToUse = config.supabaseServiceRoleKey || config.supabaseKey;
  const client = createClient(config.supabaseUrl, keyToUse, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const startTime = Date.now();
  console.log('⏳ Probando conexión contra Supabase...');

  const tablesToCheck = [
    'profiles',
    'tutors',
    'tutor_subjects',
    'students',
    'bookings',
    'reviews',
    'wallets',
    'wallet_transactions',
  ];

  const results: Array<{ table: string; status: string; count: number | string; error?: string }> = [];

  for (const table of tablesToCheck) {
    try {
      const { data, count, error } = await client
        .from(table)
        .select('*', { count: 'exact' })
        .limit(1);

      if (error) {
        results.push({
          table,
          status: '❌ Error / Inexistente',
          count: '-',
          error: error.message,
        });
      } else {
        results.push({
          table,
          status: '✅ Disponible',
          count: count ?? 0,
        });
      }
    } catch (err: any) {
      results.push({
        table,
        status: '❌ Fallo',
        count: '-',
        error: err.message,
      });
    }
  }

  const latency = Date.now() - startTime;
  console.log(`⚡ Conexión exitosa en ${latency} ms.\n`);
  console.log('📊 Estado de las Tablas del Esquema:');
  console.table(results);

  const missingTables = results.filter((r) => r.status.includes('❌'));
  if (missingTables.length > 0) {
    console.log('\n⚠️  ALERTA: Faltan tablas o permisos en la base de datos.');
    console.log('👉 Ejecuta el archivo server/supabase/schema.sql en el SQL Editor de Supabase para crearlas.');
  } else {
    console.log('\n🎉 ¡Todas las tablas del esquema están sincronizadas y listas para operar!');
    const totalRecords = results.reduce((acc, curr) => acc + (typeof curr.count === 'number' ? curr.count : 0), 0);
    if (totalRecords === 0) {
      console.log('💡 Consejo: Puedes correr server/supabase/seed.sql en el SQL Editor para cargar datos demo.');
    }
  }

  console.log('\n======================================================\n');
}

checkSupabaseConnection().catch((err) => {
  console.error('💥 Error inesperado durante el diagnóstico:', err);
  process.exit(1);
});
