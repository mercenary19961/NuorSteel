import { Link, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import {
  LayoutDashboard,
  FileText,
  Clock,
  Image,
  Package,
  Award,
  Briefcase,
  Users as UsersIcon,
  Mail,
  MessageSquare,
  Newspaper,
  Settings,
  History,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Site Content', path: '/admin/content', icon: <FileText size={20} /> },
      { label: 'Timeline', path: '/admin/timeline', icon: <Clock size={20} /> },
      { label: 'Media Library', path: '/admin/media', icon: <Image size={20} /> },
    ],
  },
  {
    label: 'Business',
    items: [
      { label: 'Products', path: '/admin/products', icon: <Package size={20} /> },
      { label: 'Certificates', path: '/admin/certificates', icon: <Award size={20} /> },
    ],
  },
  {
    label: 'Careers',
    items: [
      { label: 'Job Listings', path: '/admin/careers', icon: <Briefcase size={20} /> },
      { label: 'Applications', path: '/admin/applications', icon: <UsersIcon size={20} /> },
    ],
  },
  {
    label: 'Communication',
    items: [
      { label: 'Contacts', path: '/admin/contacts', icon: <MessageSquare size={20} /> },
      { label: 'Newsletter', path: '/admin/newsletter', icon: <Newspaper size={20} />, adminOnly: true },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', path: '/admin/settings', icon: <Settings size={20} />, adminOnly: true },
      { label: 'Users', path: '/admin/users', icon: <Mail size={20} />, adminOnly: true },
      { label: 'Change Log', path: '/admin/change-log', icon: <History size={20} />, adminOnly: true },
    ],
  },
];

export default function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const { props, url } = usePage<PageProps>();
  const isAdmin = props.auth.user?.role === 'admin';

  const isActive = (path: string) => {
    if (path === '/admin') return url === '/admin';
    return url.startsWith(path);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-300 z-40 flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-800">
        {!collapsed && (
          <span className="text-lg font-bold text-white truncate">Nuor Steel</span>
        )}
        <button
          onClick={onToggle}
          className={`p-1.5 rounded-lg hover:bg-gray-800 transition-colors ${
            collapsed ? 'mx-auto' : 'ml-auto'
          }`}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter(
            (item) => !item.adminOnly || isAdmin
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label} className="mb-4">
              {!collapsed && (
                <p className="px-4 mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {group.label}
                </p>
              )}
              {visibleItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  } ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  {item.icon}
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              ))}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
