import { supabaseAdmin } from '../infrastructure/config/supabase.config.js';
import { config } from '../infrastructure/config/env.js';

function parseArgs(): { email: string; password: string; name: string; phone: string } {
  const args = process.argv.slice(2);
  let email = 'admin@educonnect.com';
  let password = 'password123';
  let name = 'Administrador General';
  let phone = '+1 555-0999';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--email' && args[i + 1]) {
      email = args[++i];
    } else if (arg.startsWith('--email=')) {
      email = arg.split('=')[1];
    } else if (arg === '--password' && args[i + 1]) {
      password = args[++i];
    } else if (arg.startsWith('--password=')) {
      password = arg.split('=')[1];
    } else if (arg === '--name' && args[i + 1]) {
      name = args[++i];
    } else if (arg.startsWith('--name=')) {
      name = arg.split('=')[1];
    } else if (arg === '--phone' && args[i + 1]) {
      phone = args[++i];
    } else if (arg.startsWith('--phone=')) {
      phone = arg.split('=')[1];
    }
  }

  return { email: email.trim().toLowerCase(), password, name: name.trim(), phone: phone.trim() };
}

async function runCreateAdmin() {
  console.log('\n======================================================');
  console.log('👑 EduConnect - Creación de Usuario Administrador');
  console.log('======================================================\n');

  if (!config.isSupabaseConfigured() || !supabaseAdmin) {
    console.error('❌ Error: Supabase no está configurado en server/.env');
    console.error('Asegúrate de definir SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.');
    process.exit(1);
  }

  const { email, password, name, phone } = parseArgs();

  console.log(`📧 Email:    ${email}`);
  console.log(`👤 Nombre:   ${name}`);
  console.log(`📱 Teléfono: ${phone}`);
  console.log('⏳ Procesando alta en Supabase Auth y PostgreSQL...');

  try {
    let userId: string;

    // 1. Verificar si ya existe en auth.users mediante listUsers
    const { data: usersList, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      throw new Error(`Error al consultar usuarios de Auth: ${listError.message}`);
    }

    const existingAuthUser = usersList?.users?.find(
      (u) => u.email?.toLowerCase() === email
    );

    if (existingAuthUser) {
      console.log(`\nℹ️  El usuario con email ${email} ya existe en Supabase Auth.`);
      console.log('🔄 Actualizando contraseña y rol de administrador...');

      const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingAuthUser.id,
        {
          password: password,
          email_confirm: true,
          user_metadata: {
            full_name: name,
            role: 'admin',
            phone: phone,
          },
        }
      );

      if (updateError || !updatedUser.user) {
        throw new Error(`Error al actualizar usuario: ${updateError?.message}`);
      }

      userId = updatedUser.user.id;
    } else {
      console.log('\n✨ Creando nuevo usuario en Supabase Auth...');
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: name,
          role: 'admin',
          phone,
        },
      });

      if (createError || !newUser.user) {
        throw new Error(`Error al crear usuario en Supabase Auth: ${createError?.message}`);
      }

      userId = newUser.user.id;
    }

    // 2. Asegurar o actualizar el registro en public.profiles
    console.log('📝 Sincronizando perfil en public.profiles...');
    const basePayload: any = {
      id: userId,
      email: email,
      full_name: name,
      role: 'admin',
      phone: phone,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      updated_at: new Date().toISOString(),
    };

    let { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({ ...basePayload, roles: ['admin', 'student'] });

    if (profileError && profileError.message?.includes("'roles'")) {
      console.log('ℹ️  Columna `roles` no detectada en profiles. Guardando con columna estándar `role`...');
      const fallbackResult = await supabaseAdmin
        .from('profiles')
        .upsert(basePayload);
      profileError = fallbackResult.error;
    }

    if (profileError) {
      throw new Error(`Error al registrar perfil en profiles: ${profileError.message}`);
    }

    console.log('\n✅ ¡Usuario administrador configurado con éxito!');
    console.log('------------------------------------------------------');
    console.log(`🆔 ID de Usuario: ${userId}`);
    console.log(`📧 Email:         ${email}`);
    console.log(`🔑 Contraseña:    ${password}`);
    console.log(`🛡️  Rol:           admin (con acceso a /api/v1/admin/*)`);
    console.log('------------------------------------------------------');
    console.log('💡 Ahora puedes iniciar sesión en el frontend o usar estas');
    console.log('   credenciales para llamadas a la API de EduConnect.\n');

  } catch (error: any) {
    console.error('\n❌ Fallo en la creación del administrador:', error.message || error);
    process.exit(1);
  }
}

runCreateAdmin();
