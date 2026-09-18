import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../api/supabaseClient';
import { AuthContextType, AppUser, UserProfile, SignUpParams } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async (userId: string) => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data as UserProfile);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize session
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // 1. Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      });

      // 2. Listen to auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session?.user) {
            setUser(session.user);
            await fetchProfile(session.user.id);
          } else {
            setUser(null);
            setProfile(null);
            setLoading(false);
          }
        }
      );

      return () => subscription.unsubscribe();
    } else {
      // Local fallback session
      const savedUser = localStorage.getItem('educonnect_demo_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
          setProfile(parsed.profile);
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<any> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    }

    // Local demo fallback
    let role = 'student';
    let name = 'Estudiante Demo';
    let id = 'std-' + Date.now();

    if (email.toLowerCase().includes('tutor') || email.toLowerCase().includes('carlos')) {
      role = 'tutor';
      name = 'Ing. Carlos Mendoza';
      id = '22222222-2222-2222-2222-222222222222';
    }

    const demoUser: AppUser = {
      id,
      email,
      profile: {
        id,
        full_name: name,
        role,
        avatar_url: role === 'tutor' 
          ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      }
    };
    setUser(demoUser);
    setProfile(demoUser.profile || null);
    localStorage.setItem('educonnect_demo_user', JSON.stringify(demoUser));
    return { user: demoUser };
  };

  const signUp = async (
    paramsOrEmail: SignUpParams | string,
    maybePassword?: string,
    maybeExtra?: { fullName?: string; full_name?: string; role?: string; phone?: string }
  ): Promise<any> => {
    let email = '';
    let password = '';
    let full_name = '';
    let role = 'student';
    let phone: string | undefined = undefined;

    if (typeof paramsOrEmail === 'string') {
      email = paramsOrEmail;
      password = maybePassword || '';
      full_name = maybeExtra?.full_name || maybeExtra?.fullName || '';
      role = maybeExtra?.role || 'student';
      phone = maybeExtra?.phone;
    } else {
      email = paramsOrEmail.email;
      password = paramsOrEmail.password;
      full_name = paramsOrEmail.full_name || paramsOrEmail.fullName || '';
      role = paramsOrEmail.role || 'student';
      phone = paramsOrEmail.phone;
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            role,
            phone,
          }
        }
      });
      if (error) throw error;
      return data;
    }

    // Local demo fallback
    const id = role === 'tutor' ? 'tut-' + Date.now() : 'std-' + Date.now();
    const newUser: AppUser = {
      id,
      email,
      profile: {
        id,
        full_name,
        role,
        phone,
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      }
    };
    setUser(newUser);
    setProfile(newUser.profile || null);
    localStorage.setItem('educonnect_demo_user', JSON.stringify(newUser));
    return { user: newUser };
  };

  const demoLogin = (selectedRole: string = 'student') => {
    if (selectedRole === 'tutor') {
      const tutorUser: AppUser = {
        id: '22222222-2222-2222-2222-222222222222',
        email: 'carlos@educonnect.com',
        profile: {
          id: '22222222-2222-2222-2222-222222222222',
          full_name: 'Ing. Carlos Mendoza',
          role: 'tutor',
          avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
          phone: '+1 555-0102'
        }
      };
      setUser(tutorUser);
      setProfile(tutorUser.profile || null);
      localStorage.setItem('educonnect_demo_user', JSON.stringify(tutorUser));
    } else {
      const studentUser: AppUser = {
        id: 'std-9999-demo',
        email: 'estudiante@educonnect.com',
        profile: {
          id: 'std-9999-demo',
          full_name: 'Alejandro Martínez',
          role: 'student',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          phone: '+1 555-9876'
        }
      };
      setUser(studentUser);
      setProfile(studentUser.profile || null);
      localStorage.setItem('educonnect_demo_user', JSON.stringify(studentUser));
    }
  };

  const signOut = async (): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('educonnect_demo_user');
    setUser(null);
    setProfile(null);
  };

  const role = profile?.role || user?.user_metadata?.role || (user?.profile?.role) || null;

  const value: AuthContextType = {
    user,
    profile,
    role,
    loading,
    signIn,
    signUp,
    signOut,
    demoLogin,
    isSupabaseConfigured
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
