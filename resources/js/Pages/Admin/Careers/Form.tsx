import { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import BilingualEditor from '@/Components/Admin/BilingualEditor';
import { ArrowLeft } from 'lucide-react';
import CustomSelect from '@/Components/Admin/CustomSelect';
import UndoButton from '@/Components/Admin/UndoButton';
import type { CareerListing, UndoMeta } from '@/types';

interface CareerForm {
  title_en: string;
  title_ar: string;
  slug: string;
  description_en: string;
  description_ar: string;
  requirements_en: string;
  requirements_ar: string;
  location: string;
  employment_type: 'full-time' | 'part-time' | 'contract';
  status: 'draft' | 'open' | 'closed';
  expires_at: string;
}

const emptyForm: CareerForm = {
  title_en: '',
  title_ar: '',
  slug: '',
  description_en: '',
  description_ar: '',
  requirements_en: '',
  requirements_ar: '',
  location: '',
  employment_type: 'full-time',
  status: 'draft',
  expires_at: '',
};

interface Props {
  item: CareerListing | null;
  undoMeta?: UndoMeta | null;
}

export default function CareerFormPage({ item, undoMeta }: Props) {
  const isEditing = !!item;

  const [form, setForm] = useState<CareerForm>(
    item
      ? {
          title_en: item.title_en,
          title_ar: item.title_ar,
          slug: item.slug,
          description_en: item.description_en,
          description_ar: item.description_ar,
          requirements_en: item.requirements_en ?? '',
          requirements_ar: item.requirements_ar ?? '',
          location: item.location ?? '',
          employment_type: item.employment_type,
          status: item.status,
          expires_at: item.expires_at ?? '',
        }
      : emptyForm,
  );
  const initialForm = useRef(
    item
      ? {
          title_en: item.title_en,
          title_ar: item.title_ar,
          slug: item.slug,
          description_en: item.description_en,
          description_ar: item.description_ar,
          requirements_en: item.requirements_en ?? '',
          requirements_ar: item.requirements_ar ?? '',
          location: item.location ?? '',
          employment_type: item.employment_type,
          status: item.status,
          expires_at: item.expires_at ?? '',
        }
      : null,
  );
  const [saving, setSaving] = useState(false);

  const isDirty = !isEditing || JSON.stringify(form) !== JSON.stringify(initialForm.current);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      router.put(`/admin/careers/${item.id}`, form as any, {
        onStart: () => setSaving(true),
        onFinish: () => setSaving(false),
      });
    } else {
      router.post('/admin/careers', form as any, {
        onStart: () => setSaving(true),
        onFinish: () => setSaving(false),
      });
    }
  };

  const inputClass =
    'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary';

  return (
    <AdminLayout>
      <Head title={isEditing ? 'Edit Job Listing' : 'New Job Listing'} />
      <div>
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.visit('/admin/careers')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Job Listing' : 'New Job Listing'}
          </h1>
          {isEditing && item && (
            <div className="ml-auto">
              <UndoButton modelType="career" modelId={item.id} undoMeta={undoMeta ?? null} />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <BilingualEditor
            label="Job Title"
            valueEn={form.title_en}
            valueAr={form.title_ar}
            onChangeEn={(v) => setForm((f) => ({ ...f, title_en: v }))}
            onChangeAr={(v) => setForm((f) => ({ ...f, title_ar: v }))}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="auto-generated-from-title"
              className={`${inputClass} max-w-md`}
            />
            <p className="text-xs text-gray-400 mt-1">Leave empty to auto-generate.</p>
          </div>

          <BilingualEditor
            label="Description"
            valueEn={form.description_en}
            valueAr={form.description_ar}
            onChangeEn={(v) => setForm((f) => ({ ...f, description_en: v }))}
            onChangeAr={(v) => setForm((f) => ({ ...f, description_ar: v }))}
            type="textarea"
            rows={5}
            required
          />

          <BilingualEditor
            label="Requirements"
            valueEn={form.requirements_en}
            valueAr={form.requirements_ar}
            onChangeEn={(v) => setForm((f) => ({ ...f, requirements_en: v }))}
            onChangeAr={(v) => setForm((f) => ({ ...f, requirements_ar: v }))}
            type="textarea"
            rows={4}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="e.g. Riyadh, Saudi Arabia"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employment Type <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                value={form.employment_type}
                onChange={(val) =>
                  setForm((f) => ({
                    ...f,
                    employment_type: val as CareerForm['employment_type'],
                  }))
                }
                options={[
                  { value: 'full-time', label: 'Full-time' },
                  { value: 'part-time', label: 'Part-time' },
                  { value: 'contract', label: 'Contract' },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                value={form.status}
                onChange={(val) =>
                  setForm((f) => ({ ...f, status: val as CareerForm['status'] }))
                }
                options={[
                  { value: 'draft', label: 'Draft' },
                  { value: 'open', label: 'Open' },
                  { value: 'closed', label: 'Closed' },
                ]}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input
              type="date"
              value={form.expires_at}
              onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))}
              className={`${inputClass} max-w-xs`}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.visit('/admin/careers')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !isDirty}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEditing ? 'Update Listing' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
