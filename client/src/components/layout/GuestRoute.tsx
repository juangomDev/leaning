import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface GuestRouteProps {
  children: ReactNode;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500">Comprobando credenciales...</p>
        </div>
      </div>
    );
  }

  if (user) {
    const destination = role === 'admin' ? '/admin' : (role === 'tutor' ? '/tutor' : '/student');
    return <Navigate to={destination} replace />;
  }

  return <>{children}</>;
};
