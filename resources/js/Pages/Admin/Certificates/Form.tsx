import { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import BilingualEditor from '@/Components/Admin/BilingualEditor';
import { ArrowLeft, Upload, FileText } from 'lucide-react';
import UndoButton from '@/Components/Admin/UndoButton';
import type { Certificate, UndoMeta } from '@/types';

interface CertForm {
  title_en: string;
  title_ar: string;
  category: 'esg' | 'quality' | 'governance';
  description_en: string;
  description_ar: string;
  issue_date: string;
  expiry_date: string;
  is_active: boolean;
  sort_order: number;
}

const emptyForm: CertForm = {
  title_en: '',
  title_ar: '',
  category: 'quality',
  description_en: '',
  description_ar: '',
  issue_date: '',
  expiry_date: '',
  is_active: true,
  sort_order: 0,
};

interface Props {
  item: Certificate | null;
  undoMeta?: UndoMeta | null;
}

export default function CertificateForm({ item, undoMeta }: Props) {
  const isEditing = !!item;

  const [form, setForm] = useState<CertForm>(
    item
      ? {
          title_en: item.title_en,
          title_ar: item.title_ar,
          category: item.category,
          description_en: item.description_en ?? '',
          description_ar: item.description_ar ?? '',
          issue_date: item.issue_date ?? '',
          expiry_date: item.expiry_date ?? '',
          is_active: item.is_active,
          sort_order: item.sort_order,
        }
      : emptyForm,
  );
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.type !== 'application/pdf') return;
      if (selected.size > 10 * 1024 * 1024) return;
      setFile(selected);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing && !file) return;

    const formData = new FormData();
    formData.append('title_en', form.title_en);
    formData.append('title_ar', form.title_ar);
    formData.append('category', form.category);
    if (form.description_en) formData.append('description_en', form.description_en);
    if (form.description_ar) formData.append('description_ar', form.description_ar);
    if (form.issue_date) formData.append('issue_date', form.issue_date);
    if (form.expiry_date) formData.append('expiry_date', form.expiry_date);
    formData.append('is_active', form.is_active ? '1' : '0');
    formData.append('sort_order', String(form.sort_order));
    if (file) formData.append('file', file);

    if (isEditing) {
      formData.append('_method', 'POST');
      router.post(`/admin/certificates/${item.id}`, formData, {
        forceFormData: true,
        onStart: () => setSaving(true),
        onFinish: () => setSaving(false),
      });
    } else {
      router.post('/admin/certificates', formData, {
        forceFormData: true,
        onStart: () => setSaving(true),
        onFinish: () => setSaving(false),
      });
    }
  };

  const inputClass =
    'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary';

  return (
    <AdminLayout>
      <Head title={isEditing ? 'Edit Certificate' : 'New Certificate'} />
      <div>
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.visit('/admin/certificates')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Certificate' : 'New Certificate'}
          </h1>
          {isEditing && item && (
            <div className="ml-auto">
              <UndoButton modelType="certificate" modelId={item.id} undoMeta={undoMeta ?? null} />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <BilingualEditor
            label="Title"
            valueEn={form.title_en}
            valueAr={form.title_ar}
            onChangeEn={(v) => setForm((f) => ({ ...f, title_en: v }))}
            onChangeAr={(v) => setForm((f) => ({ ...f, title_ar: v }))}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value as CertForm['category'] }))
              }
              className={`${inputClass} max-w-xs`}
            >
              <option value="esg">ESG</option>
              <option value="quality">Quality</option>
              <option value="governance">Governance</option>
            </select>
          </div>

          <BilingualEditor
            label="Description"
            valueEn={form.description_en}
            valueAr={form.description_ar}
            onChangeEn={(v) => setForm((f) => ({ ...f, description_en: v }))}
            onChangeAr={(v) => setForm((f) => ({ ...f, description_ar: v }))}
            type="textarea"
            rows={3}
          />

          {/* PDF Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PDF File {!isEditing && <span className="text-red-500">*</span>}
            </label>
            {file ? (
              <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <FileText size={20} className="text-red-500" />
                <span className="flex-1 text-sm text-gray-700 truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                {isEditing && item?.file_path && (
                  <p className="text-xs text-gray-500 mb-2">
                    Current file: {item.file_path.split('/').pop()} — Upload a new file to replace it.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Upload size={16} />
                  {isEditing ? 'Replace PDF' : 'Upload PDF'}
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
              <input
                type="date"
                value={form.issue_date}
                onChange={(e) => setForm((f) => ({ ...f, issue_date: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                type="date"
                value={form.expiry_date}
                onChange={(e) => setForm((f) => ({ ...f, expiry_date: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
                className={`${inputClass} max-w-30`}
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.visit('/admin/certificates')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEditing ? 'Update Certificate' : 'Create Certificate'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
