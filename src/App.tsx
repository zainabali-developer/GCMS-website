import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext';

import PublicLayout from './components/layout/PublicLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';

import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ProgramsPage from './pages/public/ProgramsPage';
import ProgramDetailPage from './pages/public/ProgramDetailPage';
import DepartmentsPage from './pages/public/DepartmentsPage';
import DepartmentDetailPage from './pages/public/DepartmentDetailPage';
import FacultyPage from './pages/public/FacultyPage';
import FacultyDetailPage from './pages/public/FacultyDetailPage';
import SubjectsPage from './pages/public/SubjectsPage';
import AdmissionsPage from './pages/public/AdmissionsPage';
import NoticesPage from './pages/public/NoticesPage';
import NoticeDetailPage from './pages/public/NoticeDetailPage';
import EventsPage from './pages/public/EventsPage';
import EventDetailPage from './pages/public/EventDetailPage';
import GalleryPage from './pages/public/GalleryPage';
import DownloadsPage from './pages/public/DownloadsPage';
import CampusLifePage from './pages/public/CampusLifePage';
import ContactPage from './pages/public/ContactPage';
import SearchPage from './pages/public/SearchPage';
import NotFoundPage from './pages/public/NotFoundPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';

// The admin dashboard is a large, separate part of the app that public
// visitors never load — code-split it into its own chunk so the public
// site's initial download stays small.
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminAboutPage = lazy(() => import('./pages/admin/AdminAboutPage'));
const AdminPrincipalPage = lazy(() => import('./pages/admin/AdminPrincipalPage'));
const AdminProgramsPage = lazy(() => import('./pages/admin/AdminProgramsPage'));
const AdminDepartmentsPage = lazy(() => import('./pages/admin/AdminDepartmentsPage'));
const AdminFacultyPage = lazy(() => import('./pages/admin/AdminFacultyPage'));
const AdminSubjectsPage = lazy(() => import('./pages/admin/AdminSubjectsPage'));
const AdminStatisticsPage = lazy(() => import('./pages/admin/AdminStatisticsPage'));
const AdminHighlightsPage = lazy(() => import('./pages/admin/AdminHighlightsPage'));
const AdminAdmissionsPage = lazy(() => import('./pages/admin/AdminAdmissionsPage'));
const AdminNoticesPage = lazy(() => import('./pages/admin/AdminNoticesPage'));
const AdminEventsPage = lazy(() => import('./pages/admin/AdminEventsPage'));
const AdminMessagesPage = lazy(() => import('./pages/admin/AdminMessagesPage'));
const AdminGalleryPage = lazy(() => import('./pages/admin/AdminGalleryPage'));
const AdminDownloadsPage = lazy(() => import('./pages/admin/AdminDownloadsPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));

function AdminFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50">
      <LoadingSpinner label="Loading admin dashboard…" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <SiteSettingsProvider>
            <Routes>
              {/* Public site */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/programs" element={<ProgramsPage />} />
                <Route path="/programs/:slug" element={<ProgramDetailPage />} />
                <Route path="/departments" element={<DepartmentsPage />} />
                <Route path="/departments/:slug" element={<DepartmentDetailPage />} />
                <Route path="/faculty" element={<FacultyPage />} />
                <Route path="/faculty/:slug" element={<FacultyDetailPage />} />
                <Route path="/subjects" element={<SubjectsPage />} />
                <Route path="/admissions" element={<AdmissionsPage />} />
                <Route path="/notices" element={<NoticesPage />} />
                <Route path="/notices/:slug" element={<NoticeDetailPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:slug" element={<EventDetailPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/downloads" element={<DownloadsPage />} />
                <Route path="/campus-life" element={<CampusLifePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Admin */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<AdminFallback />}>
                      <AdminLayout />
                    </Suspense>
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminDashboardPage />
                    </Suspense>
                  }
                />
                <Route
                  path="about"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminAboutPage />
                    </Suspense>
                  }
                />
                <Route
                  path="principal"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminPrincipalPage />
                    </Suspense>
                  }
                />
                <Route
                  path="programs"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminProgramsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="departments"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminDepartmentsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="faculty"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminFacultyPage />
                    </Suspense>
                  }
                />
                <Route
                  path="subjects"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminSubjectsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="statistics"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminStatisticsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="highlights"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminHighlightsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="admissions"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminAdmissionsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="notices"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminNoticesPage />
                    </Suspense>
                  }
                />
                <Route
                  path="events"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminEventsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="messages"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminMessagesPage />
                    </Suspense>
                  }
                />
                <Route
                  path="gallery"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminGalleryPage />
                    </Suspense>
                  }
                />
                <Route
                  path="downloads"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminDownloadsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminSettingsPage />
                    </Suspense>
                  }
                />
              </Route>
            </Routes>
          </SiteSettingsProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
