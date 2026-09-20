import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../api/apiClient';
import { isSupabaseConfigured as clientSupabaseConfigured } from '../api/supabaseClient';
import { AuthContextType, AppUser, UserProfile, SignUpParams } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<string[]>(['student']);
  const [activeRole, setActiveRole] = useState<string>(() => localStorage.getItem('educonnect_active_role') || 'student');
  const [loading, setLoading] = useState<boolean>(true);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState<boolean>(clientSupabaseConfigured);

  const switchActiveRole = (newRole: string) => {
    setActiveRole(newRole);
    localStorage.setItem('educonnect_active_role', newRole);
    if (profile) {
      setProfile({ ...profile, role: newRole });
    }
  };

  // Mapeador auxiliar de usuario de API a estructura de estado React
  const mapApiUserToState = (apiUser: any) => {
    if (!apiUser) return;
    const userRoles: string[] = Array.isArray(apiUser.roles) && apiUser.roles.length > 0
      ? apiUser.roles
      : [apiUser.role || 'student'];
    setRoles(userRoles);

    const savedActive = localStorage.getItem('educonnect_active_role');
    const resolvedRole = (savedActive && userRoles.includes(savedActive))
      ? savedActive
      : userRoles[0];
    setActiveRole(resolvedRole);
    localStorage.setItem('educonnect_active_role', resolvedRole);

    const mappedProfile: UserProfile = {
      id: apiUser.id,
      full_name: apiUser.fullName || apiUser.full_name || apiUser.email?.split('@')[0] || 'Usuario',
      role: resolvedRole,
      roles: userRoles,
      avatar_url: apiUser.avatarUrl || apiUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      phone: apiUser.phone,
      email: apiUser.email,
      created_at: apiUser.createdAt || apiUser.created_at,
    };

    const appUser: AppUser = {
      id: apiUser.id,
      email: apiUser.email,
      roles: userRoles,
      user_metadata: {
        full_name: mappedProfile.full_name,
        role: resolvedRole,
        roles: userRoles,
        phone: apiUser.phone,
      },
      profile: mappedProfile,
    };

    setUser(appUser);
    setProfile(mappedProfile);
  };

  // 1. Inicialización de sesión: verificar cookie HttpOnly con el backend
  useEffect(() => {
    let isMounted = true;

    const checkCurrentSession = async () => {
      try {
        // Consultar salud del backend para sincronizar modo de base de datos
        apiClient.get('/health').then((hRes) => {
          if (hRes.data?.isSupabaseConfigured !== undefined) {
            setIsSupabaseConfigured(Boolean(hRes.data.isSupabaseConfigured));
          }
        }).catch(() => {});

        const res = await apiClient.get('/auth/me');
        if (!isMounted) return;

        const userData = res.data?.data || res.data?.user || res.data;
        if (userData && userData.id) {
          mapApiUserToState(userData);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        if (!isMounted) return;
        // Si la cookie no existe o expiró (401), se asume estado no autenticado limpiamente
        setUser(null);
        setProfile(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkCurrentSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Iniciar sesión mediante POST /auth/login (inyección de Cookie HttpOnly)
  const signIn = async (email: string, password: string): Promise<any> => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      const userData = res.data?.data?.user || res.data?.user;

      if (userData) {
        mapApiUserToState(userData);
        return res.data;
      }
      throw new Error('Respuesta de autenticación incompleta');
    } catch (err: any) {
      console.error('[AuthContext] Error en signIn:', err.message);
      throw err;
    }
  };

  // 3. Registro de usuario mediante POST /auth/register + login automático
  const signUp = async (
    paramsOrEmail: SignUpParams | string,
    maybePassword?: string,
    maybeExtra?: { fullName?: string; full_name?: string; role?: string; phone?: string }
  ): Promise<any> => {
    let email = '';
    let password = '';
    let fullName = '';
    let role = 'student';
    let phone: string | undefined = undefined;

    if (typeof paramsOrEmail === 'string') {
      email = paramsOrEmail;
      password = maybePassword || '';
      fullName = maybeExtra?.fullName || maybeExtra?.full_name || '';
      role = maybeExtra?.role || 'student';
      phone = maybeExtra?.phone;
    } else {
      email = paramsOrEmail.email;
      password = paramsOrEmail.password;
      fullName = paramsOrEmail.fullName || paramsOrEmail.full_name || '';
      role = paramsOrEmail.role || 'student';
      phone = paramsOrEmail.phone;
    }

    try {
      // 1. Crear usuario en el servidor
      const regRes = await apiClient.post('/auth/register', {
        email,
        password,
        fullName,
        role,
        phone,
      });

      // 2. Iniciar sesión para establecer la cookie auth_token HttpOnly
      await signIn(email, password);
      return regRes.data;
    } catch (err: any) {
      console.error('[AuthContext] Error en signUp:', err.message);
      throw err;
    }
  };

  // 4. Cerrar sesión mediante POST /auth/logout (limpieza de cookie en servidor)
  const signOut = async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.warn('[AuthContext] Fallo al invalidar cookie en logout:', err);
    } finally {
      setUser(null);
      setProfile(null);
    }
  };

  // 5. Demo login asistido con credenciales reales sembradas en el backend
  const demoLogin = async (selectedRole: string = 'student') => {
    setLoading(true);
    try {
      if (selectedRole === 'tutor') {
        await signIn('carlos@educonnect.com', 'password123');
      } else if (selectedRole === 'admin') {
        await signIn('admin@educonnect.com', 'password123');
      } else {
        await signIn('alumno@educonnect.com', 'password123');
      }
    } catch (err: any) {
      console.error('[AuthContext] Fallo en demoLogin:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await apiClient.get('/auth/me');
      const userData = res.data?.data || res.data?.user || res.data;
      if (userData && userData.id) {
        mapApiUserToState(userData);
      }
    } catch (err: any) {
      console.error('[AuthContext] Error en refreshProfile:', err.message);
    }
  };

  const role = activeRole || profile?.role || user?.user_metadata?.role || 'student';

  const value: AuthContextType = {
    user,
    profile,
    role,
    roles,
    activeRole,
    loading,
    switchActiveRole,
    refreshProfile,
    signIn,
    signUp,
    signOut,
    demoLogin,
    isSupabaseConfigured,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
