import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50">
        <LoadingSpinner label="Checking your session…" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
