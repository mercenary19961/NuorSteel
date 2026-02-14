import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Admin/Pagination';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';
import { Mail, Plus, Download, ToggleLeft, ToggleRight, Trash2, Users, UserCheck, UserX } from 'lucide-react';
import UndoButton from '@/Components/Admin/UndoButton';
import type { NewsletterSubscriber, PaginatedData, UndoMeta } from '@/types';

interface Props {
  subscribers: PaginatedData<NewsletterSubscriber>;
  stats: { total: number; active: number; inactive: number; by_source: Record<string, number> };
  filters: { active?: string };
  undoMeta?: UndoMeta | null;
  undoModelId?: string | null;
}

export default function Newsletter({ subscribers, stats, filters, undoMeta, undoModelId }: Props) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<NewsletterSubscriber | null>(null);
  const [processing, setProcessing] = useState(false);

  const handlePageChange = (page: number) => {
    router.get('/admin/newsletter', { ...filters, page }, { preserveState: true, preserveScroll: true });
  };

  const handleAdd = () => {
    if (!newEmail.trim()) return;
    router.post('/admin/newsletter', { email: newEmail.trim(), source: 'admin' }, {
      preserveScroll: true,
      onStart: () => setProcessing(true),
      onFinish: () => setProcessing(false),
      onSuccess: () => {
        setNewEmail('');
        setShowAddModal(false);
      },
    });
  };

  const handleToggle = (id: number) => {
    router.post(`/admin/newsletter/${id}/toggle`, {}, { preserveScroll: true });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    router.delete(`/admin/newsletter/${deleteTarget.id}`, {
      preserveScroll: true,
      onStart: () => setProcessing(true),
      onFinish: () => setProcessing(false),
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/admin/newsletter/export', {
        headers: { 'Accept': 'application/json' },
      });
      const data = await response.json();
      const emails = data.emails ?? data.data ?? [];
      const blob = new Blob([emails.join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'newsletter-subscribers.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // handled by flash
    }
  };

  return (
    <AdminLayout>
      <Head title="Newsletter" />
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Newsletter</h1>
            <p className="text-sm text-gray-500 mt-1">Manage newsletter subscribers</p>
          </div>
          <div className="flex items-center gap-2">
            {undoMeta && undoModelId && (
              <UndoButton modelType="newsletter" modelId={undoModelId} undoMeta={undoMeta} />
            )}
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download size={16} />
              Export
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90"
            >
              <Plus size={16} />
              Add Subscriber
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Subscribers</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <UserCheck size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <UserX size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
              <p className="text-sm text-gray-500">Inactive</p>
            </div>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="bg-white rounded-xl border border-gray-200">
          {subscribers.data.length === 0 ? (
            <div className="p-12 text-center">
              <Mail size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No subscribers yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Subscribed</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.data.map((sub) => (
                  <tr key={sub.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-gray-900">{sub.email}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sub.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {sub.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(sub.subscribed_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggle(sub.id)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                          title={sub.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {sub.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(sub)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          title="Remove"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {subscribers.last_page > 1 && (
            <div className="px-4 border-t border-gray-200">
              <Pagination
                currentPage={subscribers.current_page}
                lastPage={subscribers.last_page}
                total={subscribers.total}
                perPage={subscribers.per_page}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>

        {/* Add Subscriber Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Subscriber</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!newEmail.trim() || processing}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {processing ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog
          open={!!deleteTarget}
          title="Remove Subscriber"
          message={`Are you sure you want to remove "${deleteTarget?.email}" from the newsletter?`}
          confirmLabel="Remove"
          loading={processing}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      </div>
    </AdminLayout>
  );
}
