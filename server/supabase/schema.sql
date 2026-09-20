-- ==========================================================
-- EDUCONNECT - COMPLETE SUPABASE SCHEMA DEFINITION
-- ==========================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABLES DEFINITIONS

-- Table: profiles (Extiende la identidad de auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'tutor', 'admin')),
    roles TEXT[] DEFAULT ARRAY['student']::TEXT[],
    avatar_url TEXT,
    phone TEXT,
    reset_token TEXT,
    reset_expires TIMESTAMPTZ,
    verification_token TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: tutors
CREATE TABLE IF NOT EXISTS public.tutors (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_name TEXT NOT NULL DEFAULT 'Tutoría General',
    subject_category TEXT NOT NULL DEFAULT 'otro' CHECK (subject_category IN ('matematicas', 'programacion', 'ingles', 'ciencias', 'musica', 'otro')),
    bio TEXT,
    price_per_hour NUMERIC NOT NULL DEFAULT 20 CHECK (price_per_hour >= 0),
    modality TEXT NOT NULL DEFAULT 'online' CHECK (modality IN ('online', 'presencial', 'ambas')),
    rating NUMERIC NOT NULL DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
    reviews_count INTEGER NOT NULL DEFAULT 0 CHECK (reviews_count >= 0),
    badges TEXT[] DEFAULT ARRAY['Nuevo Tutor']::TEXT[],
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: tutor_subjects (Múltiples especialidades por tutor)
CREATE TABLE IF NOT EXISTS public.tutor_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tutor_id UUID NOT NULL REFERENCES public.tutors(id) ON DELETE CASCADE,
    subject_name TEXT NOT NULL,
    category TEXT NOT NULL,
    price_per_hour NUMERIC NOT NULL DEFAULT 20 CHECK (price_per_hour >= 0),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: students (Perfil académico del estudiante)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    education_level TEXT NOT NULL DEFAULT 'Secundaria',
    learning_goals TEXT NOT NULL DEFAULT 'Mejorar calificaciones y reforzar conocimientos',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: bookings (Reservas de clases)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tutor_id UUID NOT NULL REFERENCES public.tutors(id) ON DELETE CASCADE,
    tutor_subject_id UUID REFERENCES public.tutor_subjects(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_hours NUMERIC NOT NULL DEFAULT 1 CHECK (duration_hours > 0),
    modality TEXT NOT NULL DEFAULT 'online' CHECK (modality IN ('online', 'presencial')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    hourly_rate NUMERIC DEFAULT 0 CHECK (hourly_rate >= 0),
    total_price NUMERIC NOT NULL DEFAULT 0 CHECK (total_price >= 0),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: reviews (Calificaciones y comentarios de tutorías)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tutor_id UUID NOT NULL REFERENCES public.tutors(id) ON DELETE CASCADE,
    rating NUMERIC NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: wallets (Monederos virtuales)
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    balance NUMERIC NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'closed')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: wallet_transactions (Movimientos financieros y recargas)
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('recharge', 'payment', 'refund', 'payout')),
    concept TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_tutors_category ON public.tutors(subject_category);
CREATE INDEX IF NOT EXISTS idx_tutor_subjects_tutor ON public.tutor_subjects(tutor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_student ON public.bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_tutor ON public.bookings(tutor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_reviews_tutor ON public.reviews(tutor_id);
CREATE INDEX IF NOT EXISTS idx_wallets_user ON public.wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_tx_user ON public.wallet_transactions(user_id);

-- 4. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- 4.1 Profiles Policies
-- Los usuarios pueden consultar su propio perfil completo
CREATE POLICY "Usuarios pueden ver su propio perfil"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Los perfiles de tutores son visibles públicamente (para catálogo y búsqueda)
CREATE POLICY "Perfiles de tutores visibles públicamente"
    ON public.profiles FOR SELECT
    USING (role = 'tutor');

-- Los administradores pueden consultar todos los perfiles
CREATE POLICY "Admins pueden ver todos los perfiles"
    ON public.profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

CREATE POLICY "Usuarios pueden insertar su propio perfil"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 4.2 Tutors Policies
CREATE POLICY "Tutores visibles públicamente"
    ON public.tutors FOR SELECT
    USING (true);

CREATE POLICY "Tutores pueden registrarse"
    ON public.tutors FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Tutores pueden actualizar su propio perfil"
    ON public.tutors FOR UPDATE
    USING (auth.uid() = id);

-- 4.3 Tutor Subjects Policies
CREATE POLICY "Materias visibles públicamente"
    ON public.tutor_subjects FOR SELECT
    USING (true);

CREATE POLICY "Tutores gestionan sus materias"
    ON public.tutor_subjects FOR ALL
    USING (auth.uid() = tutor_id);

-- 4.4 Students Policies
CREATE POLICY "Estudiantes pueden ver su propio perfil o tutores/admins"
    ON public.students FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('tutor', 'admin')));

CREATE POLICY "Estudiantes gestionan su perfil"
    ON public.students FOR ALL
    USING (auth.uid() = user_id);

-- 4.5 Bookings Policies
CREATE POLICY "Usuarios pueden ver sus propias reservas (estudiante o tutor)"
    ON public.bookings FOR SELECT
    USING (auth.uid() = student_id OR auth.uid() = tutor_id);

CREATE POLICY "Estudiantes autenticados pueden crear reservas"
    ON public.bookings FOR INSERT
    WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Participantes pueden actualizar la reserva"
    ON public.bookings FOR UPDATE
    USING (auth.uid() = student_id OR auth.uid() = tutor_id);

-- 4.6 Reviews Policies
CREATE POLICY "Reseñas visibles públicamente"
    ON public.reviews FOR SELECT
    USING (true);

CREATE POLICY "Estudiantes que tomaron la clase pueden crear reseña"
    ON public.reviews FOR INSERT
    WITH CHECK (auth.uid() = student_id);

-- 4.7 Wallets Policies
CREATE POLICY "Usuarios pueden ver su propia billetera"
    ON public.wallets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden ver sus propias transacciones"
    ON public.wallet_transactions FOR SELECT
    USING (auth.uid() = user_id);

-- 5. AUTOMATIC TRIGGER: ON USER CREATED
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    user_role TEXT;
    user_roles TEXT[];
BEGIN
    -- Blindaje de seguridad: Solo permitir registro público de 'tutor' o 'student'
    -- NUNCA permitir auto-asignación de 'admin' desde metadatos del cliente
    IF (LOWER(COALESCE(NEW.raw_user_meta_data->>'role', '')) = 'tutor') THEN
        user_role := 'tutor';
    ELSE
        user_role := 'student';
    END IF;

    user_roles := ARRAY[user_role]::TEXT[];

    -- 1. Insertar perfil
    INSERT INTO public.profiles (id, full_name, email, role, roles, avatar_url, phone)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'fullName', 'Usuario EduConnect'),
        NEW.email,
        user_role,
        user_roles,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'avatarUrl', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'),
        COALESCE(NEW.raw_user_meta_data->>'phone', '')
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email;

    -- 2. Crear Billetera Virtual con saldo de bienvenida
    INSERT INTO public.wallets (user_id, balance, currency, status)
    VALUES (NEW.id, 50.00, 'USD', 'active')
    ON CONFLICT (user_id) DO NOTHING;

    -- 3. Si el rol es 'tutor', registrar en tutors y materias iniciales
    IF (user_role = 'tutor') THEN
        INSERT INTO public.tutors (
            id,
            subject_name,
            subject_category,
            bio,
            price_per_hour,
            modality,
            rating,
            reviews_count,
            badges,
            is_available
        ) VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'subject_name', NEW.raw_user_meta_data->>'subject', 'Tutoría General'),
            COALESCE(NEW.raw_user_meta_data->>'subject_category', NEW.raw_user_meta_data->>'category', 'matematicas'),
            COALESCE(NEW.raw_user_meta_data->>'bio', 'Profesor apasionado por la enseñanza personalizada.'),
            COALESCE((NEW.raw_user_meta_data->>'price_per_hour')::numeric, (NEW.raw_user_meta_data->>'rate')::numeric, 25),
            COALESCE(NEW.raw_user_meta_data->>'modality', 'online'),
            5.0,
            1,
            ARRAY['Tutor Verificado', 'Nuevo'],
            true
        )
        ON CONFLICT (id) DO NOTHING;

        -- Materia por defecto
        INSERT INTO public.tutor_subjects (tutor_id, subject_name, category, price_per_hour, description)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'subject_name', 'Tutoría General'),
            COALESCE(NEW.raw_user_meta_data->>'subject_category', 'matematicas'),
            COALESCE((NEW.raw_user_meta_data->>'price_per_hour')::numeric, 25),
            'Clases particulares personalizadas'
        );
    ELSE
        -- Si es estudiante, crear entrada base en students
        INSERT INTO public.students (user_id, education_level, learning_goals)
        VALUES (NEW.id, 'Universidad / Superior', 'Refuerzo académico y preparación de exámenes')
        ON CONFLICT (user_id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$;

-- Definir trigger de auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. PERMISOS GENERALES Y BLINDAJE PARA ROLES DE SUPABASE
-- Administrador completo para el backend del servidor
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Clientes autenticados: Operaciones CRUD en tablas estándar protegidas por RLS
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles, public.tutors, public.tutor_subjects, public.students, public.bookings, public.reviews TO authenticated;

-- Blindaje estricto de Billeteras: NUNCA permitir mutaciones directas (INSERT, UPDATE, DELETE) desde clientes
REVOKE INSERT, UPDATE, DELETE ON public.wallets, public.wallet_transactions FROM authenticated, anon, public;
GRANT SELECT ON public.wallets, public.wallet_transactions TO authenticated;

-- Acceso anónimo para navegación pública del catálogo de tutores y reseñas
GRANT SELECT ON public.profiles, public.tutors, public.tutor_subjects, public.reviews TO anon;

-- Confidencialidad de tokens: Ocultar columnas sensibles de recuperación de contraseñas
REVOKE SELECT (reset_token, reset_expires, verification_token) ON public.profiles FROM anon, authenticated;
