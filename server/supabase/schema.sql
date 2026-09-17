-- ==========================================================
-- EDUCONNECT - SUPABASE SCHEMA DEFINITION
-- ==========================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & CHECKS
-- Table: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL CHECK (role IN ('student', 'tutor')),
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: tutors
CREATE TABLE IF NOT EXISTS public.tutors (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_name TEXT NOT NULL,
    subject_category TEXT NOT NULL CHECK (subject_category IN ('matematicas', 'programacion', 'ingles', 'ciencias', 'musica', 'otro')),
    bio TEXT,
    price_per_hour NUMERIC NOT NULL DEFAULT 20,
    modality TEXT NOT NULL DEFAULT 'online' CHECK (modality IN ('online', 'presencial', 'ambas')),
    rating NUMERIC NOT NULL DEFAULT 5.0,
    reviews_count INTEGER NOT NULL DEFAULT 0,
    badges TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: bookings
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tutor_id UUID NOT NULL REFERENCES public.tutors(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_hours NUMERIC NOT NULL DEFAULT 1,
    modality TEXT NOT NULL DEFAULT 'online' CHECK (modality IN ('online', 'presencial')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    total_price NUMERIC NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Perfiles visibles públicamente"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Los usuarios pueden insertar su propio perfil"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Tutors Policies
CREATE POLICY "Tutores visibles públicamente"
    ON public.tutors FOR SELECT
    USING (true);

CREATE POLICY "Tutores pueden registrarse"
    ON public.tutors FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Tutores pueden actualizar su propio perfil"
    ON public.tutors FOR UPDATE
    USING (auth.uid() = id);

-- Bookings Policies
CREATE POLICY "Usuarios pueden ver sus propias reservas (estudiante o tutor)"
    ON public.bookings FOR SELECT
    USING (auth.uid() = student_id OR auth.uid() = tutor_id);

CREATE POLICY "Estudiantes autenticados pueden crear reservas"
    ON public.bookings FOR INSERT
    WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Participantes pueden actualizar la reserva"
    ON public.bookings FOR UPDATE
    USING (auth.uid() = student_id OR auth.uid() = tutor_id);

-- 4. AUTOMATIC USER REGISTRATION TRIGGER
-- Automatically creates a profile when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, role, phone)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario EduConnect'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
        COALESCE(NEW.raw_user_meta_data->>'phone', '')
    );

    -- Si el rol registrado es 'tutor', creamos la entrada base en la tabla tutors
    IF (NEW.raw_user_meta_data->>'role' = 'tutor') THEN
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
            COALESCE(NEW.raw_user_meta_data->>'subject_name', 'Tutoría General'),
            COALESCE(NEW.raw_user_meta_data->>'subject_category', 'matematicas'),
            COALESCE(NEW.raw_user_meta_data->>'bio', 'Profesor apasionado por la enseñanza personalizada.'),
            COALESCE((NEW.raw_user_meta_data->>'price_per_hour')::numeric, 25),
            COALESCE(NEW.raw_user_meta_data->>'modality', 'online'),
            5.0,
            1,
            ARRAY['Tutor Verificado', 'Nuevo'],
            true
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
