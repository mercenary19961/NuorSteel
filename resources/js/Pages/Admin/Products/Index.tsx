import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/Admin/StatusBadge';
import Pagination from '@/Components/Admin/Pagination';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';
import CustomSelect from '@/Components/Admin/CustomSelect';
import { Plus, Pencil, Trash2, ImageOff, Star } from 'lucide-react';
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
          <CustomSelect
            value={filters.category ?? ''}
            onChange={(val) => handleFilterChange({ category: val })}
            placeholder="All Categories"
            options={[
              { value: '', label: 'All Categories' },
              ...categories.map((c) => ({ value: c, label: c })),
            ]}
            className="w-44"
          />

          <CustomSelect
            value={filters.active ?? ''}
            onChange={(val) => handleFilterChange({ active: val })}
            placeholder="All Status"
            options={[
              { value: '', label: 'All Status' },
              { value: 'true', label: 'Active' },
              { value: 'false', label: 'Inactive' },
            ]}
            className="w-36"
          />

          <span className="text-sm text-gray-500 ml-auto">{products.total} products</span>
        </div>

        {/* Product cards */}
        {products.data.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 px-6 py-12 text-center text-sm text-gray-500">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.data.map((item) => {
              const imageUrl = item.featured_image?.url;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.name_en}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageOff size={40} />
                      </div>
                    )}
                    {/* Badges overlay */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <StatusBadge status={item.is_active ? 'active' : 'inactive'} size="sm" />
                      {item.is_featured && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full bg-yellow-100 text-yellow-700">
                          <Star size={10} className="fill-current" />
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base">{item.name_en}</h3>
                      <p className="text-sm text-gray-500 mt-0.5" dir="rtl">{item.name_ar}</p>
                      {item.category && (
                        <span className="inline-block mt-2 px-2 py-0.5 text-[11px] font-medium rounded-full bg-gray-100 text-gray-600">
                          {item.category}
                        </span>
                      )}
                      {item.short_description_en && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.short_description_en}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end mt-4 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/products/${item.id}/edit`}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </Link>
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
                </div>
              );
            })}
          </div>
        )}

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
