import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/Admin/StatusBadge';
import Pagination from '@/Components/Admin/Pagination';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';
import { Download, Trash2, Eye, X, User, Mail, Phone, Briefcase, Calendar } from 'lucide-react';
import CustomSelect from '@/Components/Admin/CustomSelect';
import UndoButton from '@/Components/Admin/UndoButton';
import type { PaginatedData, CareerApplication, UndoMeta } from '@/types';

interface Props {
  applications: PaginatedData<CareerApplication>;
  filters: {
    status?: string;
    listing_id?: string;
    open_only?: string;
    period?: string;
  };
  undoMeta?: UndoMeta | null;
  undoModelId?: string | null;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const statusColors: Record<string, string> = {
  new: 'border-t-blue-500',
  reviewed: 'border-t-yellow-500',
  shortlisted: 'border-t-green-500',
  rejected: 'border-t-red-500',
};

export default function Applications({ applications, filters, undoMeta, undoModelId }: Props) {
  const [viewItem, setViewItem] = useState<CareerApplication | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CareerApplication | null>(null);
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const statusFilter = filters.status ?? '';

  const handleStatusChange = (
    id: number,
    status: 'new' | 'reviewed' | 'shortlisted' | 'rejected',
  ) => {
    setProcessing(true);
    router.put(
      `/admin/applications/${id}`,
      { status, admin_notes: notes || undefined },
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          if (viewItem?.id === id) {
            setViewItem({ ...viewItem, status });
          }
        },
        onFinish: () => setProcessing(false),
      },
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setDeleting(true);
    router.delete(`/admin/applications/${deleteTarget.id}`, {
      preserveScroll: true,
      onSuccess: () => setDeleteTarget(null),
      onFinish: () => setDeleting(false),
    });
  };

  const openView = (item: CareerApplication) => {
    setViewItem(item);
    setNotes(item.admin_notes ?? '');
  };

  const handleFilterChange = (newFilters: Record<string, string | undefined>) => {
    router.get(
      '/admin/applications',
      { ...filters, ...newFilters, page: 1 },
      { preserveState: true, preserveScroll: true },
    );
  };

  const handlePageChange = (page: number) => {
    router.get(
      window.location.pathname,
      { ...filters, page },
      { preserveState: true, preserveScroll: true },
    );
  };

  return (
    <AdminLayout>
      <Head title="Applications" />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        {undoMeta && undoModelId && (
          <UndoButton modelType="application" modelId={undoModelId} undoMeta={undoMeta} />
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <CustomSelect
          value={statusFilter}
          onChange={(val) => handleFilterChange({ status: val || undefined })}
          placeholder="All Status"
          options={[
            { value: '', label: 'All Status' },
            { value: 'new', label: 'New' },
            { value: 'reviewed', label: 'Reviewed' },
            { value: 'shortlisted', label: 'Shortlisted' },
            { value: 'rejected', label: 'Rejected' },
          ]}
          className="w-40"
        />

        <CustomSelect
          value={filters.period ?? ''}
          onChange={(val) => handleFilterChange({ period: val || undefined })}
          placeholder="All Time"
          options={[
            { value: '', label: 'All Time' },
            { value: '1w', label: 'Last Week' },
            { value: '1m', label: 'Last Month' },
            { value: '3m', label: 'Last 3 Months' },
            { value: '6m', label: 'Last 6 Months' },
            { value: '1y', label: 'Last Year' },
            { value: 'older', label: 'Older than a Year' },
          ]}
          className="w-44"
        />

        <span className="text-sm text-gray-500 ml-auto">
          {applications.total} applications
        </span>
      </div>

      {/* Application cards */}
      {applications.data.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 px-6 py-12 text-center text-sm text-gray-500">
          No applications found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {applications.data.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl border border-gray-200 border-t-4 ${statusColors[item.status] ?? 'border-t-gray-300'} hover:shadow-md transition-all overflow-hidden flex flex-col`}
            >
              <div className="p-4 flex-1 flex flex-col">
                {/* Header: name + status */}
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{item.email}</p>
                  </div>
                  <StatusBadge status={item.status} size="sm" />
                </div>

                {/* Info rows */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate">{item.job_title}</span>
                  </div>
                  {item.career_listing && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="shrink-0 w-3.5" />
                      <span className="truncate">Listing: {item.career_listing.title_en}</span>
                    </div>
                  )}
                  {!item.career_listing && (
                    <div className="flex items-center gap-2 text-xs text-orange-500">
                      <span className="shrink-0 w-3.5" />
                      <span>Open application</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate">{item.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} className="text-gray-400 shrink-0" />
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end mt-4 pt-3 border-t border-gray-100 gap-1">
                  <button
                    onClick={() => openView(item)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    title="View details"
                  >
                    <Eye size={16} />
                  </button>
                  <a
                    href={`/admin/applications/${item.id}/cv`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Download CV"
                  >
                    <Download size={16} />
                  </a>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {applications.last_page > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={applications.current_page}
            lastPage={applications.last_page}
            perPage={applications.per_page}
            total={applications.total}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Detail Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewItem(null)} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Application Details</h2>
              <button onClick={() => setViewItem(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-900">{viewItem.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-700">{viewItem.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm text-gray-700">{viewItem.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Job Title</p>
                  <p className="text-sm text-gray-700">{viewItem.job_title}</p>
                </div>
              </div>

              {viewItem.career_listing && (
                <div>
                  <p className="text-xs text-gray-500">Applied to Listing</p>
                  <p className="text-sm text-gray-700">{viewItem.career_listing.title_en}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <div className="flex gap-2">
                  {(['new', 'reviewed', 'shortlisted', 'rejected'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(viewItem.id, s)}
                      disabled={processing}
                      className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                        viewItem.status === s
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Admin Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Internal notes..."
                />
                <button
                  onClick={() => handleStatusChange(viewItem.id, viewItem.status)}
                  disabled={processing}
                  className="mt-2 px-3 py-1.5 text-xs font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 disabled:opacity-50"
                >
                  {processing ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Application"
        message={`Are you sure you want to delete the application from "${deleteTarget?.name}"? This will also remove the uploaded CV.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
