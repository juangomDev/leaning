import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';

export const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, demoLogin } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signIn(email, password);
      navigate(redirectUrl);
    } catch (err: any) {
      setError(err.message || 'Credenciales inválidas. Revisa tu correo y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: string) => {
    demoLogin(role);
    navigate(role === 'tutor' ? '/dashboard/tutor' : '/dashboard');
  };

  return (
    <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="card" style={{ maxWidth: 440, width: '100%', padding: 36, display: 'flex', flexDirection: 'column', gap: 24, boxShadow: 'var(--shadow-xl)' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 50, height: 50, borderRadius: 'var(--radius-lg)', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
            <GraduationCap size={28} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Bienvenido de nuevo</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Ingresa a tu cuenta de EduConnect</p>
        </div>

        {/* 1-Click Demo */}
        <div style={{ padding: 14, background: 'var(--primary-light)', border: '1px solid var(--primary-border)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>
            <Sparkles size={14} color="#f59e0b" />
            <span>Acceso Demo Inmediato (1 Clic)</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className="btn btn-secondary btn-sm"
              style={{ background: '#fff', border: '1px solid var(--border-light)' }}
            >
              Estudiante Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('tutor')}
              className="btn btn-secondary btn-sm"
              style={{ background: '#fff', border: '1px solid var(--emerald-border)', color: 'var(--emerald-dark)' }}
            >
              Tutor Demo
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
            <label className="form-label">Contraseña</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-control"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block btn-lg"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
          ¿No tienes una cuenta?{' '}
          <Link to="/registro" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};
