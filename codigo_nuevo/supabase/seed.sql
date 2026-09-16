-- ==========================================================
-- EDUCONNECT - SEED DATA FOR SUPABASE
-- Carga inicial de tutores de demostración
-- ==========================================================

-- Nota: Estos IDs estáticos permiten enlazar perfiles con tutores de prueba.
-- En Supabase puedes correr este script directamente en el SQL Editor.

DO $$
DECLARE
    tutor1_id UUID := '11111111-1111-1111-1111-111111111111';
    tutor2_id UUID := '22222222-2222-2222-2222-222222222222';
    tutor3_id UUID := '33333333-3333-3333-3333-333333333333';
    tutor4_id UUID := '44444444-4444-4444-4444-444444444444';
    tutor5_id UUID := '55555555-5555-5555-5555-555555555555';
    tutor6_id UUID := '66666666-6666-6666-6666-666666666666';
BEGIN
    -- 1. Insertar Perfiles (profiles)
    INSERT INTO public.profiles (id, full_name, avatar_url, role, phone)
    VALUES 
    (
        tutor1_id,
        'Dra. Elena Rostova',
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
        'tutor',
        '+1 555-0101'
    ),
    (
        tutor2_id,
        'Ing. Carlos Mendoza',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
        'tutor',
        '+1 555-0102'
    ),
    (
        tutor3_id,
        'Sarah Jenkins',
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
        'tutor',
        '+1 555-0103'
    ),
    (
        tutor4_id,
        'Prof. Miguel Ángel',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
        'tutor',
        '+1 555-0104'
    ),
    (
        tutor5_id,
        'Valeria Gómez',
        'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=250',
        'tutor',
        '+1 555-0105'
    ),
    (
        tutor6_id,
        'David Smith',
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
        'tutor',
        '+1 555-0106'
    )
    ON CONFLICT (id) DO NOTHING;

    -- 2. Insertar Información de Tutores (tutors)
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
    )
    VALUES
    (
        tutor1_id,
        'Matemáticas & Cálculo',
        'matematicas',
        'Doctora en Ciencias Matemáticas por la UAM. Más de 10 años preparando a estudiantes para exámenes de admisión, cálculo multivariable y álgebra lineal con métodos intuitivos y visuales.',
        25,
        'online',
        4.9,
        84,
        ARRAY['Tutor Top', 'Verificada'],
        true
    ),
    (
        tutor2_id,
        'Programación Python & Web',
        'programacion',
        'Ingeniero de Software Senior con especialidad en Python, React, FastAPI y arquitectura en la nube. Te enseño desde los fundamentos lógicos hasta proyectos listos para tu portafolio.',
        30,
        'presencial',
        5.0,
        112,
        ARRAY['Respuesta Rápida', 'Verificado'],
        true
    ),
    (
        tutor3_id,
        'Inglés Nativo & TOEFL',
        'ingles',
        'Profesora nativa certificada CELTA de Cambridge. Clases personalizadas de preparación para TOEFL, IELTS e inglés técnico para entrevistas profesionales internacionales.',
        22,
        'online',
        4.8,
        65,
        ARRAY['Nativa', 'Verificada'],
        true
    ),
    (
        tutor4_id,
        'Álgebra y Física Básica',
        'matematicas',
        'Licenciado en Física aplicada. Especialista en ayudar a alumnos de secundaria y bachillerato a perder el miedo a las ecuaciones, cinemática y leyes de Newton con experimentos cotidianos.',
        20,
        'presencial',
        4.9,
        43,
        ARRAY['Paciencia Garantizada', 'Verificado'],
        true
    ),
    (
        tutor5_id,
        'Bases de Datos & SQL',
        'programacion',
        'Arquitecta de bases de datos relacionales y NoSQL. Domina SQL, PostgreSQL, modelado relacional y optimización de consultas complejas desde cero.',
        28,
        'online',
        4.7,
        29,
        ARRAY['Verificada'],
        true
    ),
    (
        tutor6_id,
        'Inglés Conversacional',
        'ingles',
        'Profesor bilingüe con enfoque en fluidez, pronunciación y reducción de acento. Ideal para profesionales que necesitan ganar confianza en reuniones de trabajo en tiempo récord.',
        24,
        'online',
        4.9,
        91,
        ARRAY['Tutor Top'],
        true
    )
    ON CONFLICT (id) DO UPDATE SET
        subject_name = EXCLUDED.subject_name,
        subject_category = EXCLUDED.subject_category,
        bio = EXCLUDED.bio,
        price_per_hour = EXCLUDED.price_per_hour,
        modality = EXCLUDED.modality,
        rating = EXCLUDED.rating,
        reviews_count = EXCLUDED.reviews_count,
        badges = EXCLUDED.badges;
END $$;
