import { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import MediaPicker from '@/Components/Admin/MediaPicker';
import CustomSelect from '@/Components/Admin/CustomSelect';
import UndoButton from '@/Components/Admin/UndoButton';
import { Plus, Trash2, Eye, EyeOff, Edit2, Image as ImageIcon, X, Info, AlertTriangle } from 'lucide-react';
import type { Partner, Media, UndoMeta } from '@/types';

interface Props {
  partners: Partner[];
  undoMeta?: UndoMeta | null;
  undoModelId?: string | null;
}

interface PartnerForm {
  name_en: string;
  name_ar: string;
  logo_media_id: number | null;
  logo_url: string | null;
  size_tier: 'sm' | 'md' | 'lg' | 'xl';
  sort_order: number;
  is_visible: boolean;
}

const emptyForm: PartnerForm = {
  name_en: '',
  name_ar: '',
  logo_media_id: null,
  logo_url: null,
  size_tier: 'md',
  sort_order: 0,
  is_visible: true,
};

const SIZE_OPTIONS = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
];

export default function Partners({ partners, undoMeta, undoModelId }: Props) {
  const [editing, setEditing] = useState<Partner | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<PartnerForm>(emptyForm);
  const [showLogoPicker, setShowLogoPicker] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Partner | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!deleteTarget) setDeleteConfirmText('');
  }, [deleteTarget]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, sort_order: partners.length });
    setShowForm(true);
  };

  const openEdit = (p: Partner) => {
    setEditing(p);
    setForm({
      name_en: p.name_en,
      name_ar: p.name_ar,
      logo_media_id: p.logo_media_id,
      logo_url: p.logo_media?.url ?? null,
      size_tier: p.size_tier,
      sort_order: p.sort_order,
      is_visible: p.is_visible,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.logo_media_id) return;

    const payload = {
      name_en: form.name_en,
      name_ar: form.name_ar,
      logo_media_id: form.logo_media_id,
      size_tier: form.size_tier,
      sort_order: form.sort_order,
      is_visible: form.is_visible,
    };

    setProcessing(true);
    if (editing) {
      router.put(`/admin/partners/${editing.id}`, payload as any, {
        preserveScroll: true,
        onSuccess: closeForm,
        onFinish: () => setProcessing(false),
      });
    } else {
      router.post('/admin/partners', payload as any, {
        preserveScroll: true,
        onSuccess: closeForm,
        onFinish: () => setProcessing(false),
      });
    }
  };

  const handleToggleVisibility = (p: Partner) => {
    router.put(
      `/admin/partners/${p.id}`,
      {
        name_en: p.name_en,
        name_ar: p.name_ar,
        logo_media_id: p.logo_media_id,
        size_tier: p.size_tier,
        sort_order: p.sort_order,
        is_visible: !p.is_visible,
      } as any,
      { preserveScroll: true },
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setProcessing(true);
    router.delete(`/admin/partners/${deleteTarget.id}`, {
      preserveScroll: true,
      onSuccess: () => setDeleteTarget(null),
      onFinish: () => setProcessing(false),
    });
  };

  const handleLogoSelect = (selected: Media[]) => {
    if (selected.length > 0) {
      setForm((f) => ({ ...f, logo_media_id: selected[0].id, logo_url: selected[0].url }));
    }
  };

  const inputClass =
    'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary';

  return (
    <AdminLayout>
      <Head title="Partners & Clients" />
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Partners & Clients</h1>
            <p className="text-sm text-gray-500 mt-1">
              Logos displayed in the Partners section on the homepage
            </p>
          </div>
          <div className="flex items-center gap-2">
            {undoMeta && undoModelId && (
              <UndoButton modelType="partner" modelId={undoModelId} undoMeta={undoMeta} />
            )}
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark"
            >
              <Plus size={14} />
              Add Partner
            </button>
          </div>
        </div>

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-2">
          <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-900 leading-relaxed">
            <p className="font-medium mb-1">Recommended logo specs</p>
            <ul className="list-disc list-inside space-y-0.5 text-blue-800/90">
              <li><strong>Dimensions:</strong> ~600 × 200 px (landscape, ~3:1 ratio)</li>
              <li><strong>Format:</strong> WebP or PNG with a <strong>transparent background</strong></li>
              <li><strong>Logo color:</strong> dark — the belt renders logos on a white card</li>
              <li><strong>File size:</strong> under 50 KB; trim tight to the logo (no extra padding)</li>
            </ul>
          </div>
        </div>

        {partners.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <ImageIcon size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No partners yet. Click "Add Partner" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {partners.map((p) => (
              <div
                key={p.id}
                className={`bg-white rounded-xl border p-4 flex flex-col ${
                  p.is_visible ? 'border-gray-200' : 'border-gray-200 opacity-60'
                }`}
              >
                <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center mb-3 overflow-hidden p-6">
                  {p.logo_media?.url ? (
                    <img
                      src={p.logo_media.url}
                      alt={p.name_en}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <ImageIcon size={32} className="text-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.name_en}</p>
                  <p className="text-xs text-gray-500 truncate" dir="rtl">
                    {p.name_ar}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 uppercase">{p.size_tier}</p>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleToggleVisibility(p)}
                    className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg"
                    title={p.is_visible ? 'Hide' : 'Show'}
                  >
                    {p.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    onClick={() => openEdit(p)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(p)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editing ? 'Edit Partner' : 'Add Partner'}
                </h2>
                <button
                  type="button"
                  onClick={closeForm}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                  <p className="text-xs text-gray-500 mb-2">
                    Recommended: ~600×200 px, WebP/PNG, transparent background, dark logo.
                  </p>
                  {form.logo_url ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={form.logo_url}
                        alt=""
                        className="w-20 h-20 object-contain bg-gray-50 rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLogoPicker(true)}
                        className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowLogoPicker(true)}
                      className="w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 text-sm text-gray-500"
                    >
                      Click to select a logo from the media library
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name (EN)</label>
                    <input
                      type="text"
                      value={form.name_en}
                      onChange={(e) => setForm((f) => ({ ...f, name_en: e.target.value }))}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name (AR)</label>
                    <input
                      type="text"
                      value={form.name_ar}
                      onChange={(e) => setForm((f) => ({ ...f, name_ar: e.target.value }))}
                      dir="rtl"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                    <CustomSelect
                      value={form.size_tier}
                      onChange={(val) => setForm((f) => ({ ...f, size_tier: val as PartnerForm['size_tier'] }))}
                      options={SIZE_OPTIONS}
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
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_visible}
                    onChange={(e) => setForm((f) => ({ ...f, is_visible: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Visible on site</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 p-5 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing || !form.logo_media_id}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50"
                >
                  {processing ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        )}

        <MediaPicker
          open={showLogoPicker}
          onClose={() => setShowLogoPicker(false)}
          onSelect={handleLogoSelect}
          multiple={false}
          typeFilter="image"
          title="Select Partner Logo"
        />

        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => !processing && setDeleteTarget(null)}
            />
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Delete Partner</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    This will remove <strong>{deleteTarget.name_en}</strong> from the homepage
                    Partners belt.
                  </p>
                </div>
              </div>

              {deleteTarget.logo_media?.url && (
                <div className="mt-4 flex items-center justify-center bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <img
                    src={deleteTarget.logo_media.url}
                    alt={deleteTarget.name_en}
                    className="max-h-16 max-w-40 object-contain"
                  />
                </div>
              )}

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed">
                <p>
                  <strong>This is reversible.</strong> An "Undo" button will appear in the header,
                  and every deletion is permanently recorded in the{' '}
                  <a href="/admin/change-log" className="underline font-medium">
                    Change Log
                  </a>{' '}
                  where it can be restored later.
                </p>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Type <span className="font-mono text-red-600">{deleteTarget.name_en}</span> to
                  confirm
                </label>
                <input
                  type="text"
                  autoFocus
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
                  placeholder={deleteTarget.name_en}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={processing}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={processing || deleteConfirmText.trim() !== deleteTarget.name_en}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Deleting...' : 'Delete partner'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
