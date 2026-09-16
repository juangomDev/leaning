import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, Mail, User, Phone, AlertCircle } from 'lucide-react';

export const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const initialRole = searchParams.get('role') === 'tutor' ? 'tutor' : 'student';
  const [role, setRole] = useState(initialRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Tutor specific
  const [subjectName, setSubjectName] = useState('');
  const [subjectCategory, setSubjectCategory] = useState('matematicas');
  const [pricePerHour, setPricePerHour] = useState(25);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);

      await signUp({
        email,
        password,
        full_name: fullName,
        role,
        phone,
        subject_name: subjectName,
        subject_category: subjectCategory,
        price_per_hour: pricePerHour,
      });

      navigate(role === 'tutor' ? '/dashboard/tutor' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Error al registrarte. Revisa tus datos e intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="card" style={{ maxWidth: 500, width: '100%', padding: 36, display: 'flex', flexDirection: 'column', gap: 20, boxShadow: 'var(--shadow-xl)' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 50, height: 50, borderRadius: 'var(--radius-lg)', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
            <GraduationCap size={28} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Crear Cuenta</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Únete a la comunidad de EduConnect</p>
        </div>

        {/* Role Toggle */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, background: 'var(--bg-muted)', padding: 6, borderRadius: 'var(--radius-lg)' }}>
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`btn btn-sm ${role === 'student' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontWeight: 800 }}
          >
            Quiero Aprender (Estudiante)
          </button>
          <button
            type="button"
            onClick={() => setRole('tutor')}
            className={`btn btn-sm ${role === 'tutor' ? 'btn-success' : 'btn-secondary'}`}
            style={{ fontWeight: 800 }}
          >
            Quiero Enseñar (Tutor)
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Nombre Completo</label>
            <div className="input-with-icon">
              <User size={16} className="input-icon" />
              <input
                type="text"
                required
                placeholder="Ej. Sofía Ramírez"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-control"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  required
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono / WhatsApp</label>
              <div className="input-with-icon">
                <Phone size={16} className="input-icon" />
                <input
                  type="tel"
                  placeholder="+52 55 1234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-control"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                type="password"
                required
                placeholder="Al menos 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-control"
              />
            </div>
          </div>

          {/* Tutor extra inputs */}
          {role === 'tutor' && (
            <div style={{ padding: 16, background: 'var(--emerald-light)', border: '1px solid var(--emerald-border)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--emerald-dark)' }}>
                Detalles del Profesor
              </span>

              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--emerald-dark)' }}>Materia Principal</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Cálculo Diferencial & Álgebra"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="input-control"
                  style={{ background: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--emerald-dark)' }}>Categoría</label>
                  <select
                    value={subjectCategory}
                    onChange={(e) => setSubjectCategory(e.target.value)}
                    className="input-control"
                    style={{ background: '#fff' }}
                  >
                    <option value="matematicas">Matemáticas</option>
                    <option value="programacion">Programación</option>
                    <option value="ingles">Idiomas</option>
                    <option value="ciencias">Ciencias</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--emerald-dark)' }}>Tarifa / hora ($ USD)</label>
                  <input
                    type="number"
                    min="5"
                    max="200"
                    value={pricePerHour}
                    onChange={(e) => setPricePerHour(e.target.value)}
                    className="input-control"
                    style={{ background: '#fff' }}
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block btn-lg"
            style={{ marginTop: 8 }}
          >
            {loading ? 'Creando cuenta...' : 'Completar Registro'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
};
