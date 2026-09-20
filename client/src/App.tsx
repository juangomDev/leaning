import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { GuestRoute } from './components/layout/GuestRoute';

// Public Pages
import { Home } from './pages/Home';
import { Explorar } from './pages/Explorar';
import { TutorPerfil } from './pages/TutorPerfil';
import { RegistroTutor } from './pages/RegistroTutor';

// Feature Pages - Public
import { PricingPage } from './features/pricing/pages/PricingPage';
import { HelpContactPage } from './features/help/pages/HelpContactPage';
import { TermsPage } from './features/legal/pages/TermsPage';
import { PrivacyPage } from './features/legal/pages/PrivacyPage';
import { BookingPreviewPage } from './features/booking/pages/BookingPreviewPage';
import { SubjectsPage } from './features/subjects/pages/SubjectsPage';
import { SubjectDetailPage } from './features/subjects/pages/SubjectDetailPage';

// Feature Pages - Auth (Rutas 16 a 22)
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { RegisterStudentPage } from './features/auth/pages/RegisterStudentPage';
import { RegisterTutorPage } from './features/auth/pages/RegisterTutorPage';
import { ForgotPasswordPage } from './features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from './features/auth/pages/ResetPasswordPage';
import { VerifyEmailPage } from './features/auth/pages/VerifyEmailPage';

// Feature Pages - Onboarding (Ruta 23)
import { OnboardingPage } from './features/onboarding/pages/OnboardingPage';

// Student Portal Pages & Modern Feature-Based Layout
import { StudentLayout } from './features/student/components/StudentLayout';
import { StudentDashboardPage } from './features/student/pages/StudentDashboardPage';
import { StudentBookingsPage } from './features/student/pages/StudentBookingsPage';
import { StudentBookingNewPage } from './features/student/pages/StudentBookingNewPage';
import { StudentBookingDetailPage } from './features/student/pages/StudentBookingDetailPage';
import { StudentWalletPage } from './features/student/pages/StudentWalletPage';
import { StudentTutorsPage } from './features/student/pages/StudentTutorsPage';
import { StudentTutorDetailPage } from './features/student/pages/StudentTutorDetailPage';
import { StudentProfilePage } from './features/student/pages/StudentProfilePage';
import { StudentSettingsPage } from './features/student/pages/StudentSettingsPage';

// Bidirectional Role Management
import { RoleManagementPage } from './features/roles/pages/RoleManagementPage';

// Tutor Portal Pages & Consolidated Layout
import { TutorLayout } from './features/tutor/components/TutorLayout';
import { TutorDashboardPage } from './features/tutor/pages/TutorDashboardPage';
import { TutorSchedulePage } from './features/tutor/pages/TutorSchedulePage';
import { TutorBookingsPage } from './features/tutor/pages/TutorBookingsPage';
import { TutorBookingDetailPage } from './features/tutor/pages/TutorBookingDetailPage';
import { TutorProfilePage } from './features/tutor/pages/TutorProfilePage';
import { TutorWalletPage } from './features/tutor/pages/TutorWalletPage';
import { TutorStudentsPage } from './features/tutor/pages/TutorStudentsPage';
import { TutorStudentDetailPage } from './features/tutor/pages/TutorStudentDetailPage';
import { TutorReviewsPage } from './features/tutor/pages/TutorReviewsPage';
import { TutorSettingsPage } from './features/tutor/pages/TutorSettingsPage';

// Virtual Classroom
import { AulaVirtual } from './pages/AulaVirtual';

// Admin Executive Portal (Rutas 58 a 74)
import { AdminLayout } from './features/admin/components/AdminLayout';
import { AdminDashboardPage } from './features/admin/pages/AdminDashboardPage';
import { AdminUsersPage } from './features/admin/pages/AdminUsersPage';
import { AdminUserDetailPage } from './features/admin/pages/AdminUserDetailPage';
import { AdminTutorsPage } from './features/admin/pages/AdminTutorsPage';
import { AdminTutorDetailPage } from './features/admin/pages/AdminTutorDetailPage';
import { AdminStudentsPage } from './features/admin/pages/AdminStudentsPage';
import { AdminBookingsPage } from './features/admin/pages/AdminBookingsPage';
import { AdminBookingDetailPage } from './features/admin/pages/AdminBookingDetailPage';
import { AdminReviewsPage } from './features/admin/pages/AdminReviewsPage';
import { AdminReviewDetailPage } from './features/admin/pages/AdminReviewDetailPage';
import { AdminWalletsPage } from './features/admin/pages/AdminWalletsPage';
import { AdminTransactionsPage } from './features/admin/pages/AdminTransactionsPage';
import { AdminSubjectsPage } from './features/admin/pages/AdminSubjectsPage';
import { AdminMetricsPage } from './features/admin/pages/AdminMetricsPage';
import { AdminReportsPage } from './features/admin/pages/AdminReportsPage';
import { AdminLogsPage } from './features/admin/pages/AdminLogsPage';
import { AdminSettingsPage } from './features/admin/pages/AdminSettingsPage';

// Error Pages (Rutas 75 a 79)
import { NotFoundPage } from './features/errors/pages/NotFoundPage';
import { ForbiddenPage } from './features/errors/pages/ForbiddenPage';
import { ServerErrorPage } from './features/errors/pages/ServerErrorPage';
import { MaintenancePage } from './features/errors/pages/MaintenancePage';
import { OfflinePage } from './features/errors/pages/OfflinePage';

// Public Layout Container with Public Navbar & Footer
const PublicLayout: React.FC = () => {
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

export default function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Pages with Header & Footer */}
          <Route element={<PublicLayout />}>
            {/* 1. / (Home + How it works + About) */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<Navigate to="/#about" replace />} />
            <Route path="/how-it-works" element={<Navigate to="/#como-funciona" replace />} />

            {/* 2. /pricing (Precios y comparativa de valor) */}
            <Route path="/pricing" element={<PricingPage />} />

            {/* 3. /help o /contact (FAQ + Formulario de contacto integrados) */}
            <Route path="/help" element={<HelpContactPage />} />
            <Route path="/contact" element={<HelpContactPage />} />
            <Route path="/faq" element={<Navigate to="/help" replace />} />

            {/* 4. /legal/terms y /legal/privacy (Plantilla legal compartida) */}
            <Route path="/legal/terms" element={<TermsPage />} />
            <Route path="/legal/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<Navigate to="/legal/terms" replace />} />
            <Route path="/privacy" element={<Navigate to="/legal/privacy" replace />} />

            {/* 5. /tutors (Búsqueda global y filtros) */}
            <Route path="/tutors" element={<Explorar />} />
            <Route path="/explorar" element={<Explorar />} />
            <Route path="/tutores" element={<Navigate to="/tutors" replace />} />

            {/* 6. /tutors/:id (Perfil profesional, materias y reseñas) */}
            <Route path="/tutors/:id" element={<TutorPerfil />} />
            <Route path="/tutores/:id" element={<TutorPerfil />} />

            {/* 7. /tutors/:id/book (Paso previo al pago/reserva) */}
            <Route path="/tutors/:id/book" element={<BookingPreviewPage />} />

            {/* 8. /subjects y /subjects/:slug (Exploración por categorías) */}
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/subjects/:slug" element={<SubjectDetailPage />} />

            {/* Registro legado de Tutor */}
            <Route path="/registro-tutor" element={<RegistroTutor />} />

            {/* Rutas de Autenticación para Invitados (Rutas 16 a 22) */}
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <LoginPage />
                </GuestRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <RegisterPage />
                </GuestRoute>
              }
            />
            <Route
              path="/register/student"
              element={
                <GuestRoute>
                  <RegisterStudentPage />
                </GuestRoute>
              }
            />
            <Route
              path="/register/tutor"
              element={
                <GuestRoute>
                  <RegisterTutorPage />
                </GuestRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <GuestRoute>
                  <ForgotPasswordPage />
                </GuestRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <GuestRoute>
                  <ResetPasswordPage />
                </GuestRoute>
              }
            />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            {/* Retrocompatibilidad con rutas anteriores */}
            <Route path="/login-registro" element={<Navigate to="/login" replace />} />
            <Route path="/registro" element={<Navigate to="/register" replace />} />

            {/* Ruta 23: Onboarding Post-Registro (Autenticado) */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fullscreen Virtual Classroom */}
          <Route path="/aula-virtual" element={<AulaVirtual />} />

          {/* Student Protected Portal with Dedicated Feature Layout & Sidebar */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDashboardPage />} />
            <Route path="bookings" element={<StudentBookingsPage />} />
            <Route path="bookings/new" element={<StudentBookingNewPage />} />
            <Route path="bookings/:id" element={<StudentBookingDetailPage />} />
            <Route path="wallet" element={<StudentWalletPage />} />
            <Route path="tutors" element={<StudentTutorsPage />} />
            <Route path="tutors/:id" element={<StudentTutorDetailPage />} />
            <Route path="profile" element={<StudentProfilePage />} />
            <Route path="settings" element={<StudentSettingsPage />} />
          </Route>

          {/* Bidirectional Role Management */}
          <Route
            path="/account/roles"
            element={
              <ProtectedRoute>
                <RoleManagementPage />
              </ProtectedRoute>
            }
          />
          <Route path="/account/switch-role" element={<Navigate to="/account/roles" replace />} />
          <Route path="/account/become-tutor" element={<Navigate to="/account/roles" replace />} />
          <Route path="/account/become-student" element={<Navigate to="/account/roles" replace />} />

          {/* Retrocompatibilidad con rutas anteriores /dashboard/* */}
          <Route path="/dashboard" element={<Navigate to="/student" replace />} />
          <Route path="/dashboard/clases" element={<Navigate to="/student/bookings" replace />} />
          <Route path="/dashboard/tutores" element={<Navigate to="/student/tutors" replace />} />
          <Route path="/dashboard/finanzas" element={<Navigate to="/student/wallet" replace />} />

          {/* Tutor Protected Portal with Dedicated Consolidated Layout & Sidebar */}
          <Route
            path="/tutor"
            element={
              <ProtectedRoute allowedRole="tutor">
                <TutorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TutorDashboardPage />} />
            <Route path="schedule" element={<TutorSchedulePage />} />
            <Route path="bookings" element={<TutorBookingsPage />} />
            <Route path="bookings/:id" element={<TutorBookingDetailPage />} />
            <Route path="profile" element={<TutorProfilePage />} />
            <Route path="wallet" element={<TutorWalletPage />} />
            <Route path="students" element={<TutorStudentsPage />} />
            <Route path="students/:id" element={<TutorStudentDetailPage />} />
            <Route path="reviews" element={<TutorReviewsPage />} />
            <Route path="settings" element={<TutorSettingsPage />} />
          </Route>

          {/* Admin Protected Executive Portal (Rutas 58 a 74) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="users/:id" element={<AdminUserDetailPage />} />
            <Route path="tutors" element={<AdminTutorsPage />} />
            <Route path="tutors/:id" element={<AdminTutorDetailPage />} />
            <Route path="students" element={<AdminStudentsPage />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="bookings/:id" element={<AdminBookingDetailPage />} />
            <Route path="reviews" element={<AdminReviewsPage />} />
            <Route path="reviews/:id" element={<AdminReviewDetailPage />} />
            <Route path="wallets" element={<AdminWalletsPage />} />
            <Route path="transactions" element={<AdminTransactionsPage />} />
            <Route path="subjects" element={<AdminSubjectsPage />} />
            <Route path="metrics" element={<AdminMetricsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="logs" element={<AdminLogsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Retrocompatibilidad con rutas del tutor */}
          <Route path="/dashboard/tutor" element={<Navigate to="/tutor" replace />} />
          <Route path="/tutor/earnings" element={<Navigate to="/tutor/wallet" replace />} />
          <Route path="/tutor/availability" element={<Navigate to="/tutor/schedule" replace />} />
          <Route path="/tutor/subjects" element={<Navigate to="/tutor/profile" replace />} />

          {/* Páginas de Error (Rutas 76 a 79) */}
          <Route path="/403" element={<ForbiddenPage />} />
          <Route path="/500" element={<ServerErrorPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/offline" element={<OfflinePage />} />

          {/* Ruta 75: 404 — Página no encontrada (Catch-all) */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
