import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable, { type Column } from '@/Components/Admin/DataTable';
import StatusBadge from '@/Components/Admin/StatusBadge';
import Pagination from '@/Components/Admin/Pagination';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import CustomSelect from '@/Components/Admin/CustomSelect';
import UndoButton from '@/Components/Admin/UndoButton';
import type { Certificate, PaginatedData, UndoMeta } from '@/types';

const CATEGORY_LABELS: Record<string, string> = {
  esg: 'ESG',
  quality: 'Quality',
  governance: 'Governance',
};

interface Props {
  certificates: PaginatedData<Certificate>;
  filters: { category?: string; active?: string };
  undoMeta?: UndoMeta | null;
  undoModelId?: string | null;
}

export default function CertificatesIndex({ certificates, filters, undoMeta, undoModelId }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<Certificate | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleFilterChange = (newFilters: Record<string, string>) => {
    router.get('/admin/certificates', {
      ...filters,
      ...newFilters,
      page: 1,
    }, { preserveState: true, preserveScroll: true });
  };

  const handlePageChange = (page: number) => {
    router.get('/admin/certificates', { ...filters, page }, { preserveState: true, preserveScroll: true });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    router.delete(`/admin/certificates/${deleteTarget.id}`, {
      preserveScroll: true,
      onStart: () => setDeleting(true),
      onFinish: () => setDeleting(false),
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const columns: Column<Certificate>[] = [
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
      key: 'category',
      label: 'Category',
      render: (item) => (
        <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
          {CATEGORY_LABELS[item.category] || item.category}
        </span>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (item) => (
        <StatusBadge status={item.is_active ? 'active' : 'inactive'} size="sm" />
      ),
    },
    {
      key: 'issue_date',
      label: 'Issued',
      render: (item) => (
        <span className="text-sm text-gray-600">{item.issue_date || '—'}</span>
      ),
    },
    {
      key: 'expiry_date',
      label: 'Expires',
      render: (item) => (
        <span className="text-sm text-gray-600">{item.expiry_date || '—'}</span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Head title="Certificates" />
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
          <div className="flex items-center gap-2">
            {undoMeta && undoModelId && (
              <UndoButton modelType="certificate" modelId={undoModelId} undoMeta={undoMeta} />
            )}
            <Link
              href="/admin/certificates/create"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Plus size={16} />
              Add Certificate
            </Link>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-3 mb-4">
          <CustomSelect
            value={filters.category ?? ''}
            onChange={(val) => handleFilterChange({ category: val })}
            placeholder="All Categories"
            options={[
              { value: '', label: 'All Categories' },
              { value: 'esg', label: 'ESG' },
              { value: 'quality', label: 'Quality' },
              { value: 'governance', label: 'Governance' },
            ]}
            className="w-44"
          />

          <span className="text-sm text-gray-500 ml-auto">{certificates.total} certificates</span>
        </div>

        <DataTable
          columns={columns}
          data={certificates.data}
          loading={false}
          emptyMessage="No certificates found."
          actions={(item) => (
            <>
              <Link
                href={`/admin/certificates/${item.id}/edit`}
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

        {certificates.last_page > 1 && (
          <div className="mt-4">
            <Pagination
              currentPage={certificates.current_page}
              lastPage={certificates.last_page}
              perPage={certificates.per_page}
              total={certificates.total}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        <ConfirmDialog
          open={!!deleteTarget}
          title="Delete Certificate"
          message={`Are you sure you want to delete "${deleteTarget?.title_en}"? This will also remove the uploaded PDF file.`}
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
