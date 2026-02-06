import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useEffect, useRef } from 'react';

interface RequireAdminProps {
  children: React.ReactNode;
}

export default function RequireAdmin({ children }: RequireAdminProps) {
  const { user } = useAuth();
  const { error } = useToast();
  const hasWarned = useRef(false);

  useEffect(() => {
    if (user && user.role !== 'admin' && !hasWarned.current) {
      error('Access denied. Admin privileges required.');
      hasWarned.current = true;
    }
  }, [user, error]);

  if (user && user.role !== 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
