import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts, useProductCategories, useDeleteProduct } from '../../hooks/useProducts';
import { useToast } from '../../contexts/ToastContext';
import DataTable, { type Column } from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import Pagination from '../../components/admin/Pagination';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Product } from '../../types';

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('');

  const { data, isLoading } = useProducts({
    page,
    category: category || undefined,
    active: activeFilter === '' ? undefined : activeFilter === 'true',
  });
  const { data: categories } = useProductCategories();
  const deleteMutation = useDeleteProduct();
  const { success, error: showError } = useToast();

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      success('Product deleted.');
      setDeleteTarget(null);
    } catch {
      showError('Failed to delete product.');
    }
  };

  const columns: Column<Product>[] = [
    {
      key: 'name_en',
      label: 'Name',
      render: (item) => (
        <div>
          <p className="font-medium text-gray-900">{item.name_en}</p>
          <p className="text-xs text-gray-500" dir="rtl">{item.name_ar}</p>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (item) => (
        <span className="text-sm text-gray-600">{item.category || '—'}</span>
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
      key: 'is_featured',
      label: 'Featured',
      render: (item) => (
        <span className={`text-xs font-medium ${item.is_featured ? 'text-yellow-600' : 'text-gray-400'}`}>
          {item.is_featured ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'sort_order',
      label: 'Order',
      sortable: true,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="">All Categories</option>
          {categories?.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={activeFilter}
          onChange={(e) => { setActiveFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {data?.meta && (
          <span className="text-sm text-gray-500 ml-auto">{data.meta.total} products</span>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        loading={isLoading}
        emptyMessage="No products found."
        actions={(item) => (
          <>
            <Link
              to={`/admin/products/${item.id}`}
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
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name_en}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
