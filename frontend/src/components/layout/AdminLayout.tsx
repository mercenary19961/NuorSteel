import { useState } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminSidebar from './AdminSidebar';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function AdminLayout() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main content area */}
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        {/* Top header bar */}
        <header className="sticky top-0 z-30 flex items-center justify-end h-16 px-6 bg-white border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <UserIcon size={16} />
              <span>{user?.name}</span>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary capitalize">
                {user?.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
