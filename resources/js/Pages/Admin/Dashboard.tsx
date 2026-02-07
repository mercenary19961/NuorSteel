import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatsCard from '@/Components/Admin/StatsCard';
import StatusBadge from '@/Components/Admin/StatusBadge';
import type { DashboardStats, DashboardRecentApplication, DashboardRecentContact } from '@/types';
import {
  Package,
  CheckCircle,
  Briefcase,
  Users,
  MessageSquare,
  Newspaper,
} from 'lucide-react';

interface Props {
  stats: DashboardStats;
  recent_applications: DashboardRecentApplication[];
  recent_contacts: DashboardRecentContact[];
}

export default function Dashboard({ stats, recent_applications, recent_contacts }: Props) {
  return (
    <AdminLayout>
      <Head title="Dashboard" />

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatsCard
          label="Total Products"
          value={stats.products}
          icon={<Package size={24} />}
          color="blue"
        />
        <StatsCard
          label="Active Products"
          value={stats.active_products}
          icon={<CheckCircle size={24} />}
          color="green"
        />
        <StatsCard
          label="Open Jobs"
          value={stats.open_jobs}
          icon={<Briefcase size={24} />}
          color="purple"
        />
        <StatsCard
          label="New Applications"
          value={stats.new_applications}
          icon={<Users size={24} />}
          color="yellow"
        />
        <StatsCard
          label="Unread Contacts"
          value={stats.unread_contacts}
          icon={<MessageSquare size={24} />}
          color="red"
        />
        <StatsCard
          label="Newsletter Subscribers"
          value={stats.newsletter_subscribers}
          icon={<Newspaper size={24} />}
          color="gray"
        />
      </div>

      {/* Recent Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Recent Applications</h2>
            <Link href="/admin/applications" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recent_applications.length === 0 ? (
              <p className="px-6 py-8 text-sm text-gray-500 text-center">No applications yet.</p>
            ) : (
              recent_applications.map((app) => (
                <div key={app.id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{app.name}</p>
                    <p className="text-xs text-gray-500">
                      {app.job_title}
                      {app.listing_title && <span> — {app.listing_title}</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={app.status} size="sm" />
                    <span className="text-xs text-gray-400">{app.created_at}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Recent Contacts</h2>
            <Link href="/admin/contacts" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recent_contacts.length === 0 ? (
              <p className="px-6 py-8 text-sm text-gray-500 text-center">No contact submissions yet.</p>
            ) : (
              recent_contacts.map((contact) => (
                <div key={contact.id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {!contact.is_read && (
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2" />
                      )}
                      {contact.name}
                    </p>
                    <p className="text-xs text-gray-500">{contact.subject}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={contact.request_type} size="sm" />
                    <span className="text-xs text-gray-400">{contact.created_at}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
