import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCertificates, useDeleteCertificate } from '../../hooks/useCertificates';
import { useToast } from '../../contexts/ToastContext';
import DataTable, { type Column } from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import Pagination from '../../components/admin/Pagination';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Certificate } from '../../types';

const CATEGORY_LABELS: Record<string, string> = {
  esg: 'ESG',
  quality: 'Quality',
  governance: 'Governance',
};

export default function CertificatesPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');

  const { data, isLoading } = useCertificates({
    page,
    category: category || undefined,
  });
  const deleteMutation = useDeleteCertificate();
  const { success, error: showError } = useToast();

  const [deleteTarget, setDeleteTarget] = useState<Certificate | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      success('Certificate deleted.');
      setDeleteTarget(null);
    } catch {
      showError('Failed to delete certificate.');
    }
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
        <Link
          to="/admin/certificates/new"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus size={16} />
          Add Certificate
        </Link>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-3 mb-4">
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="">All Categories</option>
          <option value="esg">ESG</option>
          <option value="quality">Quality</option>
          <option value="governance">Governance</option>
        </select>

        {data?.meta && (
          <span className="text-sm text-gray-500 ml-auto">{data.meta.total} certificates</span>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        loading={isLoading}
        emptyMessage="No certificates found."
        actions={(item) => (
          <>
            <Link
              to={`/admin/certificates/${item.id}`}
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
        title="Delete Certificate"
        message={`Are you sure you want to delete "${deleteTarget?.title_en}"? This will also remove the uploaded PDF file.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
