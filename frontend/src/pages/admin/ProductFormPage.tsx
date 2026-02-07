import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  useAddProductImage,
  useRemoveProductImage,
  useUpdateProductSpecifications,
} from '../../hooks/useProducts';
import { useToast } from '../../contexts/ToastContext';
import BilingualEditor from '../../components/admin/BilingualEditor';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { ArrowLeft, Plus, Trash2, Image, X } from 'lucide-react';
import type { ProductSpecification } from '../../types';

interface ProductForm {
  name_en: string;
  name_ar: string;
  slug: string;
  short_description_en: string;
  short_description_ar: string;
  description_en: string;
  description_ar: string;
  category: string;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
}

interface SpecForm {
  property_en: string;
  property_ar: string;
  spec_type: 'chemical' | 'mechanical' | 'dimensional';
  min_value: string;
  max_value: string;
  value: string;
  unit: string;
  sort_order: number;
}

const emptyForm: ProductForm = {
  name_en: '',
  name_ar: '',
  slug: '',
  short_description_en: '',
  short_description_ar: '',
  description_en: '',
  description_ar: '',
  category: '',
  is_active: true,
  is_featured: false,
  sort_order: 0,
};

const emptySpec: SpecForm = {
  property_en: '',
  property_ar: '',
  spec_type: 'chemical',
  min_value: '',
  max_value: '',
  value: '',
  unit: '',
  sort_order: 0,
};

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id && id !== 'new';
  const productId = isEditing ? Number(id) : null;

  const { data: product, isLoading } = useProduct(productId);
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const addImageMutation = useAddProductImage();
  const removeImageMutation = useRemoveProductImage();
  const updateSpecsMutation = useUpdateProductSpecifications();
  const { success, error: showError } = useToast();

  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [specs, setSpecs] = useState<SpecForm[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'images' | 'specs'>('details');
  const [removeImageTarget, setRemoveImageTarget] = useState<{ productId: number; imageId: number } | null>(null);

  // Media ID input for adding images
  const [newMediaId, setNewMediaId] = useState('');

  useEffect(() => {
    if (product) {
      setForm({
        name_en: product.name_en,
        name_ar: product.name_ar,
        slug: product.slug,
        short_description_en: product.short_description_en ?? '',
        short_description_ar: product.short_description_ar ?? '',
        description_en: product.description_en ?? '',
        description_ar: product.description_ar ?? '',
        category: product.category ?? '',
        is_active: product.is_active,
        is_featured: product.is_featured,
        sort_order: product.sort_order,
      });
      setSpecs(
        product.specifications?.map((s) => ({
          property_en: s.property_en,
          property_ar: s.property_ar,
          spec_type: s.spec_type,
          min_value: s.min_value ?? '',
          max_value: s.max_value ?? '',
          value: s.value ?? '',
          unit: s.unit ?? '',
          sort_order: s.sort_order,
        })) ?? [],
      );
    }
  }, [product]);

  if (isEditing && isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && productId) {
        await updateMutation.mutateAsync({ id: productId, ...form });
        success('Product updated.');
      } else {
        await createMutation.mutateAsync(form);
        success('Product created.');
      }
      navigate('/admin/products');
    } catch {
      showError('Failed to save product.');
    }
  };

  const handleAddImage = async () => {
    if (!productId || !newMediaId) return;
    try {
      await addImageMutation.mutateAsync({ productId, media_id: Number(newMediaId) });
      success('Image added.');
      setNewMediaId('');
    } catch {
      showError('Failed to add image.');
    }
  };

  const handleRemoveImage = async () => {
    if (!removeImageTarget) return;
    try {
      await removeImageMutation.mutateAsync(removeImageTarget);
      success('Image removed.');
      setRemoveImageTarget(null);
    } catch {
      showError('Failed to remove image.');
    }
  };

  const handleSaveSpecs = async () => {
    if (!productId) return;
    const validSpecs = specs.filter((s) => s.property_en && s.property_ar);
    try {
      await updateSpecsMutation.mutateAsync({
        productId,
        specifications: validSpecs.map((s, i) => ({
          ...s,
          min_value: s.min_value || null,
          max_value: s.max_value || null,
          value: s.value || null,
          unit: s.unit || null,
          sort_order: i,
        })),
      });
      success('Specifications saved.');
    } catch {
      showError('Failed to save specifications.');
    }
  };

  const addSpec = () => setSpecs([...specs, { ...emptySpec, sort_order: specs.length }]);
  const removeSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index));
  const updateSpec = (index: number, field: keyof SpecForm, value: string | number) => {
    setSpecs(specs.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const inputClass =
    'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Product' : 'New Product'}
        </h1>
      </div>

      {/* Tabs (only show images/specs for existing products) */}
      {isEditing && (
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
          {(['details', 'images', 'specs'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'details' ? 'Details' : tab === 'images' ? 'Images' : 'Specifications'}
            </button>
          ))}
        </div>
      )}

      {/* Details Tab */}
      {activeTab === 'details' && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <BilingualEditor
            label="Product Name"
            valueEn={form.name_en}
            valueAr={form.name_ar}
            onChangeEn={(v) => setForm((f) => ({ ...f, name_en: v }))}
            onChangeAr={(v) => setForm((f) => ({ ...f, name_ar: v }))}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="auto-generated-from-name"
              className={`${inputClass} max-w-md`}
            />
            <p className="text-xs text-gray-400 mt-1">Leave empty to auto-generate from English name.</p>
          </div>

          <BilingualEditor
            label="Short Description"
            valueEn={form.short_description_en}
            valueAr={form.short_description_ar}
            onChangeEn={(v) => setForm((f) => ({ ...f, short_description_en: v }))}
            onChangeAr={(v) => setForm((f) => ({ ...f, short_description_ar: v }))}
            type="textarea"
            rows={2}
          />

          <BilingualEditor
            label="Full Description"
            valueEn={form.description_en}
            valueAr={form.description_ar}
            onChangeEn={(v) => setForm((f) => ({ ...f, description_en: v }))}
            onChangeAr={(v) => setForm((f) => ({ ...f, description_ar: v }))}
            type="textarea"
            rows={5}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="e.g. Rebar, Wire Rod"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
                className={inputClass}
              />
            </div>

            <div className="flex items-end gap-6 pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Featured</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      )}

      {/* Images Tab */}
      {activeTab === 'images' && productId && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Product Images</h2>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={newMediaId}
                onChange={(e) => setNewMediaId(e.target.value)}
                placeholder="Media ID"
                className="w-28 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                onClick={handleAddImage}
                disabled={!newMediaId || addImageMutation.isPending}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50"
              >
                <Plus size={14} />
                Add
              </button>
            </div>
          </div>

          {product?.images && product.images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {product.images.map((img) => (
                <div key={img.id} className="relative group rounded-lg overflow-hidden border border-gray-200">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {img.media ? (
                      <img
                        src={img.media.url}
                        alt={img.media.alt_text_en ?? ''}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image size={32} className="text-gray-300" />
                    )}
                  </div>
                  {img.is_primary && (
                    <span className="absolute top-2 left-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                      Primary
                    </span>
                  )}
                  <button
                    onClick={() => setRemoveImageTarget({ productId, imageId: img.id })}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Image size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">No images yet. Add images using media IDs from the Media Library.</p>
            </div>
          )}
        </div>
      )}

      {/* Specifications Tab */}
      {activeTab === 'specs' && productId && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Specifications</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={addSpec}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Plus size={14} />
                Add Row
              </button>
              <button
                onClick={handleSaveSpecs}
                disabled={updateSpecsMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50"
              >
                {updateSpecsMutation.isPending ? 'Saving...' : 'Save Specs'}
              </button>
            </div>
          </div>

          {specs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">No specifications yet. Click "Add Row" to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {specs.map((spec, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <select
                      value={spec.spec_type}
                      onChange={(e) => updateSpec(index, 'spec_type', e.target.value)}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="chemical">Chemical</option>
                      <option value="mechanical">Mechanical</option>
                      <option value="dimensional">Dimensional</option>
                    </select>
                    <button
                      onClick={() => removeSpec(index)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Property (EN)</label>
                      <input
                        type="text"
                        value={spec.property_en}
                        onChange={(e) => updateSpec(index, 'property_en', e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Property (AR)</label>
                      <input
                        type="text"
                        value={spec.property_ar}
                        onChange={(e) => updateSpec(index, 'property_ar', e.target.value)}
                        dir="rtl"
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Value</label>
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => updateSpec(index, 'value', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Min</label>
                      <input
                        type="text"
                        value={spec.min_value}
                        onChange={(e) => updateSpec(index, 'min_value', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Max</label>
                      <input
                        type="text"
                        value={spec.max_value}
                        onChange={(e) => updateSpec(index, 'max_value', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Unit</label>
                      <input
                        type="text"
                        value={spec.unit}
                        onChange={(e) => updateSpec(index, 'unit', e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Remove Image Confirmation */}
      <ConfirmDialog
        open={!!removeImageTarget}
        title="Remove Image"
        message="Are you sure you want to remove this image from the product?"
        confirmLabel="Remove"
        variant="danger"
        loading={removeImageMutation.isPending}
        onConfirm={handleRemoveImage}
        onCancel={() => setRemoveImageTarget(null)}
      />
    </div>
  );
}
