import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable, { type Column } from '@/Components/Admin/DataTable';
import StatusBadge from '@/Components/Admin/StatusBadge';
import Pagination from '@/Components/Admin/Pagination';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { CareerListing, PaginatedData } from '@/types';

interface Props {
  listings: PaginatedData<CareerListing>;
  filters: { status?: string };
}

export default function CareersIndex({ listings, filters }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<CareerListing | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleFilterChange = (newFilters: Record<string, string>) => {
    router.get('/admin/careers', {
      ...filters,
      ...newFilters,
      page: 1,
    }, { preserveState: true, preserveScroll: true });
  };

  const handlePageChange = (page: number) => {
    router.get('/admin/careers', { ...filters, page }, { preserveState: true, preserveScroll: true });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    router.delete(`/admin/careers/${deleteTarget.id}`, {
      preserveScroll: true,
      onStart: () => setDeleting(true),
      onFinish: () => setDeleting(false),
      onSuccess: () => setDeleteTarget(null),
    });
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
    <AdminLayout>
      <Head title="Career Listings" />
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Career Listings</h1>
          <Link
            href="/admin/careers/create"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus size={16} />
            Add Listing
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4">
          <select
            value={filters.status ?? ''}
            onChange={(e) => handleFilterChange({ status: e.target.value })}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>

          <span className="text-sm text-gray-500 ml-auto">{listings.total} listings</span>
        </div>

        <DataTable
          columns={columns}
          data={listings.data}
          loading={false}
          emptyMessage="No career listings found."
          actions={(item) => (
            <>
              <Link
                href={`/admin/careers/${item.id}/edit`}
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

        {listings.last_page > 1 && (
          <div className="mt-4">
            <Pagination
              currentPage={listings.current_page}
              lastPage={listings.last_page}
              perPage={listings.per_page}
              total={listings.total}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        <ConfirmDialog
          open={!!deleteTarget}
          title="Delete Listing"
          message={`Are you sure you want to delete "${deleteTarget?.title_en}"? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      </div>
    </AdminLayout>
  );
}
