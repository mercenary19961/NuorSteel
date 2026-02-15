import { useState, type ReactNode } from 'react';
import { usePage, router } from '@inertiajs/react';
import type { PageProps } from '@/types';
import AdminSidebar from '@/Components/Layout/AdminSidebar';
import { LogOut, User as UserIcon, Menu } from 'lucide-react';

interface Props {
  children: ReactNode;
}

// Persist sidebar collapsed state across Inertia navigations
let globalSidebarCollapsed = false;

export default function AdminLayout({ children }: Props) {
  const { props } = usePage<PageProps>();
  const user = props.auth.user;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(globalSidebarCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggle = () => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    globalSidebarCollapsed = next;
  };

  const handleLogout = () => {
    router.post('/admin/logout');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button — hidden when sidebar is open */}
      {!mobileOpen && (
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 bg-white rounded-lg shadow-md"
          >
            <Menu size={22} />
          </button>
        </div>
      )}

      <AdminSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        onToggle={handleToggle}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content area */}
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
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
          {children}
        </main>
      </div>
    </div>
  );
}
