import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Public Pages
import { Home } from './pages/Home';
import { Explorar } from './pages/Explorar';
import { TutorPerfil } from './pages/TutorPerfil';
import { LoginRegistro } from './pages/LoginRegistro';
import { RegistroTutor } from './pages/RegistroTutor';

// Student Portal Pages & Layout
import { StudentLayout } from './pages/student/StudentLayout';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { MisClases } from './pages/student/MisClases';
import { MisTutores } from './pages/student/MisTutores';
import { Finanzas } from './pages/student/Finanzas';

// Virtual Classroom & Tutor Dashboard
import { AulaVirtual } from './pages/AulaVirtual';
import { TutorDashboard } from './pages/tutor/TutorDashboard';

// Public Layout Container with Public Navbar & Footer
const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Pages with Header & Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/explorar" element={<Explorar />} />
            <Route path="/tutores" element={<Explorar />} />
            <Route path="/tutores/:id" element={<TutorPerfil />} />
            <Route path="/registro-tutor" element={<RegistroTutor />} />
          </Route>

          {/* Standalone Auth Page */}
          <Route path="/login-registro" element={<LoginRegistro />} />
          <Route path="/login" element={<LoginRegistro />} />
          <Route path="/registro" element={<LoginRegistro />} />

          {/* Fullscreen Virtual Classroom */}
          <Route path="/aula-virtual" element={<AulaVirtual />} />

          {/* Student Protected Portal with Dedicated Student Layout & Sidebar */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentLayout title="Dashboard Alumno" />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="clases" element={<MisClases />} />
            <Route path="tutores" element={<MisTutores />} />
            <Route path="finanzas" element={<Finanzas />} />
          </Route>

          {/* Tutor Protected Portal */}
          <Route
            path="/dashboard/tutor"
            element={
              <ProtectedRoute allowedRole="tutor">
                <TutorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
