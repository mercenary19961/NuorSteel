import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCareer, useCreateCareer, useUpdateCareer } from '../../hooks/useCareers';
import { useToast } from '../../contexts/ToastContext';
import BilingualEditor from '../../components/admin/BilingualEditor';
import { ArrowLeft } from 'lucide-react';

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

export default function CareerFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id && id !== 'new';
  const careerId = isEditing ? Number(id) : null;

  const { data: listing, isLoading } = useCareer(careerId);
  const createMutation = useCreateCareer();
  const updateMutation = useUpdateCareer();
  const { success, error: showError } = useToast();

  const [form, setForm] = useState<CareerForm>(emptyForm);

  useEffect(() => {
    if (listing) {
      setForm({
        title_en: listing.title_en,
        title_ar: listing.title_ar,
        slug: listing.slug,
        description_en: listing.description_en,
        description_ar: listing.description_ar,
        requirements_en: listing.requirements_en ?? '',
        requirements_ar: listing.requirements_ar ?? '',
        location: listing.location ?? '',
        employment_type: listing.employment_type,
        status: listing.status,
        expires_at: listing.expires_at ?? '',
      });
    }
  }, [listing]);

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
      if (isEditing && careerId) {
        await updateMutation.mutateAsync({ id: careerId, ...form });
        success('Job listing updated.');
      } else {
        await createMutation.mutateAsync(form);
        success('Job listing created.');
      }
      navigate('/admin/careers');
    } catch {
      showError('Failed to save listing.');
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const inputClass =
    'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary';

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/careers')}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Job Listing' : 'New Job Listing'}
        </h1>
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
            <select
              value={form.employment_type}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  employment_type: e.target.value as CareerForm['employment_type'],
                }))
              }
              className={inputClass}
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value as CareerForm['status'] }))
              }
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
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
            onClick={() => navigate('/admin/careers')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : isEditing ? 'Update Listing' : 'Create Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
