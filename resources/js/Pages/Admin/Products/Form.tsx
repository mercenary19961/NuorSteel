import { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import BilingualEditor from '@/Components/Admin/BilingualEditor';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';
import MediaPicker from '@/Components/Admin/MediaPicker';
import { ArrowLeft, Plus, Trash2, Image, ImageOff, X } from 'lucide-react';
import CustomSelect from '@/Components/Admin/CustomSelect';
import UndoButton from '@/Components/Admin/UndoButton';
import type { Product, Media, UndoMeta } from '@/types';

interface Props {
  item: Product | null;
  undoMeta?: UndoMeta | null;
}

interface ProductForm {
  name_en: string;
  name_ar: string;
  short_description_en: string;
  short_description_ar: string;
  description_en: string;
  description_ar: string;
  category: string;
  featured_image_id: number | null;
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

function initForm(item: Product | null): ProductForm {
  if (!item) {
    return {
      name_en: '',
      name_ar: '',
      short_description_en: '',
      short_description_ar: '',
      description_en: '',
      description_ar: '',
      category: '',
      featured_image_id: null,
      is_active: true,
      is_featured: false,
      sort_order: 0,
    };
  }
  return {
    name_en: item.name_en,
    name_ar: item.name_ar,
    short_description_en: item.short_description_en ?? '',
    short_description_ar: item.short_description_ar ?? '',
    description_en: item.description_en ?? '',
    description_ar: item.description_ar ?? '',
    category: item.category ?? '',
    featured_image_id: item.featured_image_id,
    is_active: item.is_active,
    is_featured: item.is_featured,
    sort_order: item.sort_order,
  };
}

function initSpecs(item: Product | null): SpecForm[] {
  if (!item?.specifications) return [];
  return item.specifications.map((s) => ({
    property_en: s.property_en,
    property_ar: s.property_ar,
    spec_type: s.spec_type,
    min_value: s.min_value ?? '',
    max_value: s.max_value ?? '',
    value: s.value ?? '',
    unit: s.unit ?? '',
    sort_order: s.sort_order,
  }));
}

export default function ProductFormPage({ item, undoMeta }: Props) {
  const isEditing = !!item;

  const [form, setForm] = useState<ProductForm>(() => initForm(item));
  const initialForm = useRef(initForm(item));
  const [specs, setSpecs] = useState<SpecForm[]>(() => initSpecs(item));
  const initialSpecs = useRef(initSpecs(item));
  const [activeTab, setActiveTab] = useState<'details' | 'images' | 'specs'>('details');
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(
    item?.featured_image?.url ?? null,
  );
  const [removeImageTarget, setRemoveImageTarget] = useState<{ imageId: number } | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showFeaturedPicker, setShowFeaturedPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removingImage, setRemovingImage] = useState(false);
  const [savingSpecs, setSavingSpecs] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (isEditing) {
      router.put(`/admin/products/${item.id}`, form as any, {
        preserveScroll: true,
        onFinish: () => setSaving(false),
      });
    } else {
      router.post('/admin/products', form as any, {
        onSuccess: () => router.visit('/admin/products'),
        onFinish: () => setSaving(false),
      });
    }
  };

  const handleMediaSelect = (selected: Media[]) => {
    if (!item) return;
    selected.forEach((media) => {
      router.post(`/admin/products/${item.id}/images`, { media_id: media.id }, {
        preserveScroll: true,
        preserveState: true,
      });
    });
  };

  const handleRemoveImage = () => {
    if (!removeImageTarget || !item) return;
    setRemovingImage(true);
    router.delete(`/admin/products/${item.id}/images/${removeImageTarget.imageId}`, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => setRemoveImageTarget(null),
      onFinish: () => setRemovingImage(false),
    });
  };

  const handleSaveSpecs = () => {
    if (!item) return;
    const validSpecs = specs.filter((s) => s.property_en && s.property_ar);
    setSavingSpecs(true);
    router.post(`/admin/products/${item.id}/specifications`, {
      specifications: validSpecs.map((s, i) => ({
        ...s,
        min_value: s.min_value || null,
        max_value: s.max_value || null,
        value: s.value || null,
        unit: s.unit || null,
        sort_order: i,
      })),
    }, {
      preserveScroll: true,
      onFinish: () => setSavingSpecs(false),
    });
  };

  const addSpec = () => setSpecs([...specs, { ...emptySpec, sort_order: specs.length }]);
  const removeSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index));
  const updateSpec = (index: number, field: keyof SpecForm, value: string | number) => {
    setSpecs(specs.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const isDetailsDirty = !isEditing || JSON.stringify(form) !== JSON.stringify(initialForm.current);
  const isSpecsDirty = !isEditing || JSON.stringify(specs) !== JSON.stringify(initialSpecs.current);

  const inputClass =
    'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary';

  return (
    <AdminLayout>
      <Head title={isEditing ? 'Edit Product' : 'New Product'} />

      <div>
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.visit('/admin/products')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Product' : 'New Product'}
          </h1>
          {isEditing && item && (
            <div className="ml-auto">
              <UndoButton modelType="product" modelId={item.id} undoMeta={undoMeta ?? null} />
            </div>
          )}
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

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
              {form.featured_image_id && featuredImageUrl ? (
                <div className="relative inline-block group">
                  <img
                    src={featuredImageUrl}
                    alt="Featured"
                    className="w-40 h-40 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 rounded-lg transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => setShowFeaturedPicker(true)}
                      className="p-2 bg-white rounded-full text-gray-700 shadow hover:bg-gray-50"
                      title="Change image"
                    >
                      <Image size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setForm((f) => ({ ...f, featured_image_id: null }));
                        setFeaturedImageUrl(null);
                      }}
                      className="p-2 bg-white rounded-full text-red-500 shadow hover:bg-red-50"
                      title="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowFeaturedPicker(true)}
                  className="flex items-center gap-3 w-full max-w-sm px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-sm text-gray-500"
                >
                  <ImageOff size={24} className="text-gray-300 shrink-0" />
                  <span>Click to select a featured image from the media library</span>
                </button>
              )}
            </div>

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
                onClick={() => router.visit('/admin/products')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !isDetailsDirty}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50"
              >
                {saving ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && item && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Product Images</h2>
              <button
                onClick={() => setShowMediaPicker(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark"
              >
                <Plus size={14} />
                Add from Media Library
              </button>
            </div>

            {item.images && item.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {item.images.map((img) => (
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
                      onClick={() => setRemoveImageTarget({ imageId: img.id })}
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
                <p className="text-gray-500 text-sm">No images yet. Click 'Add from Media Library' to get started.</p>
              </div>
            )}
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === 'specs' && item && (
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
                  disabled={savingSpecs || !isSpecsDirty}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50"
                >
                  {savingSpecs ? 'Saving...' : 'Save Specs'}
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
                      <CustomSelect
                        value={spec.spec_type}
                        onChange={(val) => updateSpec(index, 'spec_type', val)}
                        options={[
                          { value: 'chemical', label: 'Chemical' },
                          { value: 'mechanical', label: 'Mechanical' },
                          { value: 'dimensional', label: 'Dimensional' },
                        ]}
                        className="w-40"
                      />
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
          loading={removingImage}
          onConfirm={handleRemoveImage}
          onCancel={() => setRemoveImageTarget(null)}
        />

        <MediaPicker
          open={showMediaPicker}
          onClose={() => setShowMediaPicker(false)}
          onSelect={handleMediaSelect}
          multiple={true}
          typeFilter="image"
          title="Add Product Images"
        />

        <MediaPicker
          open={showFeaturedPicker}
          onClose={() => setShowFeaturedPicker(false)}
          onSelect={(selected) => {
            if (selected.length > 0) {
              setForm((f) => ({ ...f, featured_image_id: selected[0].id }));
              setFeaturedImageUrl(selected[0].url);
            }
          }}
          multiple={false}
          typeFilter="image"
          title="Select Featured Image"
        />
      </div>
    </AdminLayout>
  );
}
