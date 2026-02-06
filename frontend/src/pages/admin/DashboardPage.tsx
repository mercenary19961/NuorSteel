import { Link } from 'react-router-dom';
import { useDashboard } from '../../hooks/useDashboard';
import StatsCard from '../../components/admin/StatsCard';
import StatusBadge from '../../components/admin/StatusBadge';
import {
  Package,
  CheckCircle,
  Briefcase,
  Users,
  MessageSquare,
  Newspaper,
} from 'lucide-react';

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-24">
        <p className="text-red-600">Failed to load dashboard data.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatsCard
          label="Total Products"
          value={data.stats.products}
          icon={<Package size={24} />}
          color="blue"
        />
        <StatsCard
          label="Active Products"
          value={data.stats.active_products}
          icon={<CheckCircle size={24} />}
          color="green"
        />
        <StatsCard
          label="Open Jobs"
          value={data.stats.open_jobs}
          icon={<Briefcase size={24} />}
          color="purple"
        />
        <StatsCard
          label="New Applications"
          value={data.stats.new_applications}
          icon={<Users size={24} />}
          color="yellow"
        />
        <StatsCard
          label="Unread Contacts"
          value={data.stats.unread_contacts}
          icon={<MessageSquare size={24} />}
          color="red"
        />
        <StatsCard
          label="Newsletter Subscribers"
          value={data.stats.newsletter_subscribers}
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
            <Link to="/admin/applications" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {data.recent_applications.length === 0 ? (
              <p className="px-6 py-8 text-sm text-gray-500 text-center">No applications yet.</p>
            ) : (
              data.recent_applications.map((app) => (
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
            <Link to="/admin/contacts" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {data.recent_contacts.length === 0 ? (
              <p className="px-6 py-8 text-sm text-gray-500 text-center">No contact submissions yet.</p>
            ) : (
              data.recent_contacts.map((contact) => (
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
    </div>
  );
}
