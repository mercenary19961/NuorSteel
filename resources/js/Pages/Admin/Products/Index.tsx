import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable, { type Column } from '@/Components/Admin/DataTable';
import StatusBadge from '@/Components/Admin/StatusBadge';
import Pagination from '@/Components/Admin/Pagination';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import UndoButton from '@/Components/Admin/UndoButton';
import type { Product, PaginatedData, UndoMeta } from '@/types';

interface Props {
  products: PaginatedData<Product>;
  categories: string[];
  filters: { category?: string; active?: string };
  undoMeta?: UndoMeta | null;
  undoModelId?: string | null;
}

export default function ProductsIndex({ products, categories, filters, undoMeta, undoModelId }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleFilterChange = (newFilters: Record<string, string>) => {
    router.get('/admin/products', {
      ...filters,
      ...newFilters,
      page: 1,
    }, { preserveState: true, preserveScroll: true });
  };

  const handlePageChange = (page: number) => {
    router.get('/admin/products', { ...filters, page }, { preserveState: true, preserveScroll: true });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    router.delete(`/admin/products/${deleteTarget.id}`, {
      preserveScroll: true,
      onStart: () => setDeleting(true),
      onFinish: () => setDeleting(false),
      onSuccess: () => setDeleteTarget(null),
    });
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
    <AdminLayout>
      <Head title="Products" />
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <div className="flex items-center gap-2">
            {undoMeta && undoModelId && (
              <UndoButton modelType="product" modelId={undoModelId} undoMeta={undoMeta} />
            )}
            <Link
              href="/admin/products/create"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Plus size={16} />
              Add Product
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4">
          <select
            value={filters.category ?? ''}
            onChange={(e) => handleFilterChange({ category: e.target.value })}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={filters.active ?? ''}
            onChange={(e) => handleFilterChange({ active: e.target.value })}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <span className="text-sm text-gray-500 ml-auto">{products.total} products</span>
        </div>

        <DataTable
          columns={columns}
          data={products.data}
          loading={false}
          emptyMessage="No products found."
          actions={(item) => (
            <>
              <Link
                href={`/admin/products/${item.id}/edit`}
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

        {products.last_page > 1 && (
          <div className="mt-4">
            <Pagination
              currentPage={products.current_page}
              lastPage={products.last_page}
              perPage={products.per_page}
              total={products.total}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        <ConfirmDialog
          open={!!deleteTarget}
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteTarget?.name_en}"? This action cannot be undone.`}
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
