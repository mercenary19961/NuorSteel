import { useState } from 'react';
import {
  useTimeline,
  useCreateTimeline,
  useUpdateTimeline,
  useDeleteTimeline,
  useReorderTimeline,
} from '../../hooks/useTimeline';
import { useToast } from '../../contexts/ToastContext';
import BilingualEditor from '../../components/admin/BilingualEditor';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { Plus, Pencil, Trash2, GripVertical, X } from 'lucide-react';
import type { TimelineEvent } from '../../types';

interface FormData {
  year: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  image_id: number | null;
  sort_order: number;
}

const emptyForm: FormData = {
  year: '',
  title_en: '',
  title_ar: '',
  description_en: '',
  description_ar: '',
  image_id: null,
  sort_order: 0,
};

export default function TimelinePage() {
  const { data: events, isLoading, error } = useTimeline();
  const createMutation = useCreateTimeline();
  const updateMutation = useUpdateTimeline();
  const deleteMutation = useDeleteTimeline();
  const reorderMutation = useReorderTimeline();
  const { success, error: showError } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<TimelineEvent | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !events) {
    return (
      <div className="text-center py-24">
        <p className="text-red-600">Failed to load timeline events.</p>
      </div>
    );
  }

  const openCreateForm = () => {
    setForm({ ...emptyForm, sort_order: events.length });
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (event: TimelineEvent) => {
    setForm({
      year: event.year,
      title_en: event.title_en,
      title_ar: event.title_ar,
      description_en: event.description_en ?? '',
      description_ar: event.description_ar ?? '',
      image_id: event.image_id,
      sort_order: event.sort_order,
    });
    setEditingId(event.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...form });
        success('Timeline event updated.');
      } else {
        await createMutation.mutateAsync(form);
        success('Timeline event created.');
      }
      closeForm();
    } catch {
      showError('Failed to save timeline event.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      success('Timeline event deleted.');
      setDeleteTarget(null);
    } catch {
      showError('Failed to delete timeline event.');
    }
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const reordered = [...events];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(index, 0, moved);

    // Optimistically reorder - the query will update on success
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    if (dragIndex === null) return;
    // Submit new order
    const orderedIds = events.map((e) => e.id);
    // We need to recalculate since drag events modify dragIndex
    reorderMutation.mutate(orderedIds);
    setDragIndex(null);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Timeline Events</h1>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus size={16} />
          Add Event
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-2">
        {events.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No timeline events yet.</p>
          </div>
        ) : (
          events.map((event, index) => (
            <div
              key={event.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-4 hover:shadow-sm transition-shadow"
            >
              <GripVertical size={18} className="text-gray-300 cursor-grab shrink-0" />

              <div className="flex items-center gap-3 min-w-80">
                <span className="text-lg font-bold text-primary">{event.year}</span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {event.title_en}
                </p>
                <p className="text-xs text-gray-500 truncate" dir="rtl">
                  {event.title_ar}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEditForm(event)}
                  className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => setDeleteTarget(event)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeForm} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Edit Event' : 'Add Event'}
              </h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.year}
                  onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                  required
                  maxLength={20}
                  placeholder="e.g. 2020"
                  className="w-full max-w-50 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <BilingualEditor
                label="Title"
                valueEn={form.title_en}
                valueAr={form.title_ar}
                onChangeEn={(v) => setForm((f) => ({ ...f, title_en: v }))}
                onChangeAr={(v) => setForm((f) => ({ ...f, title_ar: v }))}
                required
              />

              <BilingualEditor
                label="Description"
                valueEn={form.description_en}
                valueAr={form.description_ar}
                onChangeEn={(v) => setForm((f) => ({ ...f, description_en: v }))}
                onChangeAr={(v) => setForm((f) => ({ ...f, description_ar: v }))}
                type="textarea"
                required
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleteTarget?.title_en}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
