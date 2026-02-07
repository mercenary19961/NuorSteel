import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCareers, useDeleteCareer } from '../../hooks/useCareers';
import { useToast } from '../../contexts/ToastContext';
import DataTable, { type Column } from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import Pagination from '../../components/admin/Pagination';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { CareerListing } from '../../types';

export default function CareersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  const { data, isLoading } = useCareers({
    page,
    status: status || undefined,
  });
  const deleteMutation = useDeleteCareer();
  const { success, error: showError } = useToast();

  const [deleteTarget, setDeleteTarget] = useState<CareerListing | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      success('Job listing deleted.');
      setDeleteTarget(null);
    } catch {
      showError('Failed to delete listing.');
    }
  };

  const columns: Column<CareerListing>[] = [
    {
      key: 'title_en',
      label: 'Title',
      render: (item) => (
        <div>
          <p className="font-medium text-gray-900">{item.title_en}</p>
          <p className="text-xs text-gray-500" dir="rtl">{item.title_ar}</p>
        </div>
      ),
    },
    {
      key: 'employment_type',
      label: 'Type',
      render: (item) => (
        <span className="text-sm text-gray-600 capitalize">{item.employment_type}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => <StatusBadge status={item.status} size="sm" />,
    },
    {
      key: 'applications_count',
      label: 'Applications',
      render: (item) => (
        <span className="text-sm text-gray-600">{item.applications_count ?? 0}</span>
      ),
    },
    {
      key: 'expires_at',
      label: 'Expires',
      render: (item) => (
        <span className="text-sm text-gray-600">{item.expires_at || '—'}</span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Career Listings</h1>
        <Link
          to="/admin/careers/new"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus size={16} />
          Add Listing
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>

        {data?.meta && (
          <span className="text-sm text-gray-500 ml-auto">{data.meta.total} listings</span>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        loading={isLoading}
        emptyMessage="No career listings found."
        actions={(item) => (
          <>
            <Link
              to={`/admin/careers/${item.id}`}
              className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
              <Pencil size={16} />
            </Link>
            <button
              onClick={() => setDeleteTarget(item)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      />

      {data?.meta && data.meta.last_page > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={data.meta.current_page}
            lastPage={data.meta.last_page}
            perPage={data.meta.per_page}
            total={data.meta.total}
            onPageChange={setPage}
          />
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Listing"
        message={`Are you sure you want to delete "${deleteTarget?.title_en}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
