import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRole }) => {
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

  if (allowedRole && role && role !== allowedRole) {
    return <Navigate to={role === 'tutor' ? '/dashboard/tutor' : '/dashboard'} replace />;
  }

  return children;
};
