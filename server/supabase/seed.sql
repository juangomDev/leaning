-- ==========================================================
-- EDUCONNECT - SEED DATA FOR SUPABASE
-- Carga inicial de usuarios, tutores, materias y billeteras demo
-- Puede ejecutarse directamente en el SQL Editor de Supabase
-- ==========================================================

DO $$
DECLARE
    student1_id UUID := '11111111-1111-1111-1111-111111111110';
    admin1_id   UUID := '99999999-9999-9999-9999-999999999999';
    tutor1_id   UUID := '11111111-1111-1111-1111-111111111111';
    tutor2_id   UUID := '22222222-2222-2222-2222-222222222222';
    tutor3_id   UUID := '33333333-3333-3333-3333-333333333333';
    tutor4_id   UUID := '44444444-4444-4444-4444-444444444444';
    tutor5_id   UUID := '55555555-5555-5555-5555-555555555555';
    tutor6_id   UUID := '66666666-6666-6666-6666-666666666666';

    booking1_id UUID := 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    booking2_id UUID := 'a2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    hash_pwd    TEXT;
BEGIN
    -- Contraseña encriptada para todos los usuarios demo: 'password123'
    hash_pwd := crypt('password123', gen_salt('bf'));

    -- 1. CREACIÓN DE USUARIOS EN AUTH.USERS (Permite autenticarse directamente por Supabase Auth)
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token
    )
    VALUES
    (
        student1_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
        'alumno@educonnect.com', hash_pwd, NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Alejandro Silva","role":"student","phone":"+1 555-0001"}'::jsonb,
        NOW(), NOW(), '', ''
    ),
    (
        admin1_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
        'admin@educonnect.com', hash_pwd, NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Administrador General","role":"admin","phone":"+1 555-0999"}'::jsonb,
        NOW(), NOW(), '', ''
    ),
    (
        tutor1_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
        'elena@educonnect.com', hash_pwd, NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Dra. Elena Rostova","role":"tutor","phone":"+1 555-0101"}'::jsonb,
        NOW(), NOW(), '', ''
    ),
    (
        tutor2_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
        'carlos@educonnect.com', hash_pwd, NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Ing. Carlos Mendoza","role":"tutor","phone":"+1 555-0102"}'::jsonb,
        NOW(), NOW(), '', ''
    ),
    (
        tutor3_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
        'sarah@educonnect.com', hash_pwd, NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Sarah Jenkins","role":"tutor","phone":"+1 555-0103"}'::jsonb,
        NOW(), NOW(), '', ''
    ),
    (
        tutor4_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
        'miguel@educonnect.com', hash_pwd, NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Prof. Miguel Ángel","role":"tutor","phone":"+1 555-0104"}'::jsonb,
        NOW(), NOW(), '', ''
    ),
    (
        tutor5_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
        'valeria@educonnect.com', hash_pwd, NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Valeria Gómez","role":"tutor","phone":"+1 555-0105"}'::jsonb,
        NOW(), NOW(), '', ''
    ),
    (
        tutor6_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
        'david@educonnect.com', hash_pwd, NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"David Smith","role":"tutor","phone":"+1 555-0106"}'::jsonb,
        NOW(), NOW(), '', ''
    )
    ON CONFLICT (id) DO UPDATE SET
        encrypted_password = EXCLUDED.encrypted_password,
        raw_user_meta_data = EXCLUDED.raw_user_meta_data;

    -- 2. ASEGURAR PERFILES EN PUBLIC.PROFILES
    INSERT INTO public.profiles (id, full_name, email, role, roles, avatar_url, phone)
    VALUES
    (
        student1_id, 'Alejandro Silva', 'alumno@educonnect.com', 'student', ARRAY['student'],
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250', '+1 555-0001'
    ),
    (
        admin1_id, 'Administrador General', 'admin@educonnect.com', 'admin', ARRAY['admin', 'student'],
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250', '+1 555-0999'
    ),
    (
        tutor1_id, 'Dra. Elena Rostova', 'elena@educonnect.com', 'tutor', ARRAY['tutor'],
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250', '+1 555-0101'
    ),
    (
        tutor2_id, 'Ing. Carlos Mendoza', 'carlos@educonnect.com', 'tutor', ARRAY['tutor'],
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250', '+1 555-0102'
    ),
    (
        tutor3_id, 'Sarah Jenkins', 'sarah@educonnect.com', 'tutor', ARRAY['tutor'],
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250', '+1 555-0103'
    ),
    (
        tutor4_id, 'Prof. Miguel Ángel', 'miguel@educonnect.com', 'tutor', ARRAY['tutor'],
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250', '+1 555-0104'
    ),
    (
        tutor5_id, 'Valeria Gómez', 'valeria@educonnect.com', 'tutor', ARRAY['tutor'],
        'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=250', '+1 555-0105'
    ),
    (
        tutor6_id, 'David Smith', 'david@educonnect.com', 'tutor', ARRAY['tutor'],
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250', '+1 555-0106'
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        avatar_url = EXCLUDED.avatar_url;

    -- 3. PERFIL DE ESTUDIANTE (students)
    INSERT INTO public.students (user_id, education_level, learning_goals)
    VALUES (student1_id, 'Universidad', 'Dominar Cálculo Avanzado y programación en Python')
    ON CONFLICT (user_id) DO NOTHING;

    -- 4. INFORMACIÓN DE TUTORES (tutors)
    INSERT INTO public.tutors (
        id, subject_name, subject_category, bio, price_per_hour, modality, rating, reviews_count, badges, is_available
    )
    VALUES
    (
        tutor1_id, 'Matemáticas & Cálculo', 'matematicas',
        'Doctora en Ciencias Matemáticas por la UAM. Más de 10 años preparando a estudiantes para exámenes de admisión, cálculo multivariable y álgebra lineal con métodos intuitivos y visuales.',
        25, 'online', 4.9, 84, ARRAY['Tutor Top', 'Verificada'], true
    ),
    (
        tutor2_id, 'Programación Python & Web', 'programacion',
        'Ingeniero de Software Senior con especialidad en Python, React, FastAPI y arquitectura en la nube. Te enseño desde los fundamentos lógicos hasta proyectos listos para tu portafolio.',
        30, 'presencial', 5.0, 112, ARRAY['Respuesta Rápida', 'Verificado'], true
    ),
    (
        tutor3_id, 'Inglés Nativo & TOEFL', 'ingles',
        'Profesora nativa certificada CELTA de Cambridge. Clases personalizadas de preparación para TOEFL, IELTS e inglés técnico para entrevistas profesionales internacionales.',
        22, 'online', 4.8, 65, ARRAY['Nativa', 'Verificada'], true
    ),
    (
        tutor4_id, 'Álgebra y Física Básica', 'matematicas',
        'Licenciado en Física aplicada. Especialista en ayudar a alumnos de secundaria y bachillerato a perder el miedo a las ecuaciones, cinemática y leyes de Newton con experimentos cotidianos.',
        20, 'presencial', 4.9, 43, ARRAY['Paciencia Garantizada', 'Verificado'], true
    ),
    (
        tutor5_id, 'Bases de Datos & SQL', 'programacion',
        'Arquitecta de bases de datos relacionales y NoSQL. Domina SQL, PostgreSQL, modelado relacional y optimización de consultas complejas desde cero.',
        28, 'online', 4.7, 29, ARRAY['Verificada'], true
    ),
    (
        tutor6_id, 'Inglés Conversacional', 'ingles',
        'Profesor bilingüe con enfoque en fluidez, pronunciación y reducción de acento. Ideal para profesionales que necesitan ganar confianza en reuniones de trabajo en tiempo récord.',
        24, 'online', 4.9, 91, ARRAY['Tutor Top'], true
    )
    ON CONFLICT (id) DO UPDATE SET
        bio = EXCLUDED.bio,
        price_per_hour = EXCLUDED.price_per_hour,
        rating = EXCLUDED.rating,
        reviews_count = EXCLUDED.reviews_count;

    -- 5. MATERIAS POR TUTOR (tutor_subjects)
    INSERT INTO public.tutor_subjects (tutor_id, subject_name, category, price_per_hour, description)
    VALUES
    (tutor1_id, 'Cálculo Multivariable', 'matematicas', 25, 'Límites, derivadas parciales e integrales dobles.'),
    (tutor1_id, 'Álgebra Lineal', 'matematicas', 25, 'Espacios vectoriales, matrices y transformaciones.'),
    (tutor2_id, 'Python para Principiantes', 'programacion', 30, 'Sintaxis básica, POO y proyectos prácticos.'),
    (tutor2_id, 'Desarrollo Web Fullstack', 'programacion', 35, 'React, Node.js, Express y bases de datos.'),
    (tutor3_id, 'Preparación TOEFL / IELTS', 'ingles', 22, 'Estrategias de examen y simulacros reales.'),
    (tutor5_id, 'PostgreSQL y Modelado Relacional', 'programacion', 28, 'Consultas avanzadas, índices y optimización.')
    ON CONFLICT DO NOTHING;

    -- 6. BILLETERAS VIRTUALES (wallets)
    INSERT INTO public.wallets (user_id, balance, currency, status)
    VALUES
    (student1_id, 150.00, 'USD', 'active'),
    (tutor1_id, 320.00, 'USD', 'active'),
    (tutor2_id, 450.00, 'USD', 'active')
    ON CONFLICT (user_id) DO UPDATE SET balance = EXCLUDED.balance;

    -- Transacción demo de recarga
    INSERT INTO public.wallet_transactions (wallet_id, user_id, amount, type, concept, status)
    SELECT id, student1_id, 150.00, 'recharge', 'Recarga inicial con Tarjeta de Crédito', 'completed'
    FROM public.wallets WHERE user_id = student1_id
    ON CONFLICT DO NOTHING;

    -- 7. RESERVAS DE PRUEBA (bookings)
    INSERT INTO public.bookings (
        id, student_id, tutor_id, subject, scheduled_at, duration_hours, modality, status, hourly_rate, total_price, notes
    )
    VALUES
    (
        booking1_id, student1_id, tutor1_id, 'Cálculo Multivariable',
        NOW() + INTERVAL '2 days', 2, 'online', 'confirmed', 25, 50, 'Preparación para el examen parcial'
    ),
    (
        booking2_id, student1_id, tutor2_id, 'Python para Principiantes',
        NOW() - INTERVAL '3 days', 1, 'online', 'completed', 30, 30, 'Introducción a funciones y módulos'
    )
    ON CONFLICT (id) DO NOTHING;

    -- 8. RESEÑAS DE PRUEBA (reviews)
    INSERT INTO public.reviews (booking_id, student_id, tutor_id, rating, comment)
    VALUES (
        booking2_id, student1_id, tutor2_id, 5.0,
        'Excelente clase, el profesor Carlos explica de manera clara y con ejemplos de la vida real.'
    )
    ON CONFLICT (booking_id) DO NOTHING;

END $$;
