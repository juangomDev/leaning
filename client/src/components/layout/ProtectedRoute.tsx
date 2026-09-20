import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Cargando sesión...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole) {
    const hasRole = 
      role === 'admin' ||
      role === allowedRole || 
      (Array.isArray(user.roles) && user.roles.includes(allowedRole)) ||
      (allowedRole === 'admin' && (user.email?.includes('admin') || user.email === 'admin@educonnect.com'));
      
    if (!hasRole && role) {
      const destination = role === 'admin' ? '/admin' : (role === 'tutor' ? '/tutor' : '/student');
      return <Navigate to={destination} replace />;
    }
  }

  return <>{children}</>;
};
