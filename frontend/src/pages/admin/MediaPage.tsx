import { useState } from 'react';
import {
  useMedia,
  useMediaFolders,
  useUploadMedia,
  useUpdateMedia,
  useDeleteMedia,
} from '../../hooks/useMedia';
import { useToast } from '../../contexts/ToastContext';
import FileUpload from '../../components/admin/FileUpload';
import Pagination from '../../components/admin/Pagination';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { Image, FileText, Pencil, Trash2, X, FolderOpen } from 'lucide-react';
import type { Media } from '../../types';

export default function MediaPage() {
  const [page, setPage] = useState(1);
  const [folder, setFolder] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const { data, isLoading, error } = useMedia({ page, folder: folder || undefined, type: typeFilter || undefined });
  const { data: folders } = useMediaFolders();
  const uploadMutation = useUploadMedia();
  const updateMutation = useUpdateMedia();
  const deleteMutation = useDeleteMedia();
  const { success, error: showError } = useToast();

  const [showUpload, setShowUpload] = useState(false);
  const [uploadFolder, setUploadFolder] = useState('general');
  const [editItem, setEditItem] = useState<Media | null>(null);
  const [editAltEn, setEditAltEn] = useState('');
  const [editAltAr, setEditAltAr] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Media | null>(null);

  const handleUpload = async (file: File) => {
    try {
      await uploadMutation.mutateAsync({ file, folder: uploadFolder });
      success('File uploaded successfully.');
      setShowUpload(false);
    } catch {
      showError('Failed to upload file.');
    }
  };

  const openEdit = (item: Media) => {
    setEditItem(item);
    setEditAltEn(item.alt_text_en ?? '');
    setEditAltAr(item.alt_text_ar ?? '');
  };

  const handleUpdateAlt = async () => {
    if (!editItem) return;
    try {
      await updateMutation.mutateAsync({
        id: editItem.id,
        alt_text_en: editAltEn,
        alt_text_ar: editAltAr,
      });
      success('Alt text updated.');
      setEditItem(null);
    } catch {
      showError('Failed to update alt text.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      success('Media deleted.');
      setDeleteTarget(null);
    } catch {
      showError('Failed to delete media.');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24">
        <p className="text-red-600">Failed to load media library.</p>
      </div>
    );
  }

  const items = data?.items ?? [];
  const meta = data?.meta;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
        >
          Upload
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <select
          value={folder}
          onChange={(e) => { setFolder(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="">All Folders</option>
          {folders?.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="">All Types</option>
          <option value="image">Images</option>
          <option value="pdf">PDFs</option>
        </select>

        {meta && (
          <span className="text-sm text-gray-500 ml-auto">{meta.total} files</span>
        )}
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FolderOpen size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No media files found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Preview */}
              <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                {item.mime_type.startsWith('image/') ? (
                  <img
                    src={item.url}
                    alt={item.alt_text_en ?? item.original_filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FileText size={32} className="text-red-400" />
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-2 bg-white rounded-lg shadow hover:bg-gray-50"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-2 bg-white rounded-lg shadow hover:bg-red-50"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-2">
                <p className="text-xs text-gray-700 truncate">{item.original_filename}</p>
                <p className="text-xs text-gray-400">{formatSize(item.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            perPage={meta.per_page}
            total={meta.total}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowUpload(false)} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upload File</h2>
              <button onClick={() => setShowUpload(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Folder</label>
              <input
                type="text"
                value={uploadFolder}
                onChange={(e) => setUploadFolder(e.target.value)}
                placeholder="general"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <FileUpload
              onUpload={handleUpload}
              loading={uploadMutation.isPending}
              label="Select file"
            />
          </div>
        </div>
      )}

      {/* Edit Alt Text Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditItem(null)} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Edit Alt Text</h2>
              <button onClick={() => setEditItem(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
              {editItem.mime_type.startsWith('image/') ? (
                <Image size={20} className="text-blue-500" />
              ) : (
                <FileText size={20} className="text-red-500" />
              )}
              <span className="text-sm text-gray-700 truncate">{editItem.original_filename}</span>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Alt Text (English)</label>
                <input
                  type="text"
                  value={editAltEn}
                  onChange={(e) => setEditAltEn(e.target.value)}
                  dir="ltr"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Alt Text (العربية)</label>
                <input
                  type="text"
                  value={editAltAr}
                  onChange={(e) => setEditAltAr(e.target.value)}
                  dir="rtl"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditItem(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAlt}
                disabled={updateMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50"
              >
                {updateMutation.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Media"
        message={`Are you sure you want to delete "${deleteTarget?.original_filename}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
