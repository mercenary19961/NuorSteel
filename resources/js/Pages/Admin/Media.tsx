import { useState, useRef, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Admin/Pagination';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';
import {
  Image,
  FileText,
  Pencil,
  Trash2,
  X,
  FolderOpen,
  FolderPlus,
  Upload,
  ArrowLeft,
  Folder,
  MoreVertical,
  FolderPen,
  AlertTriangle,
  FolderInput,
} from 'lucide-react';
import type { Media, PaginatedData } from '@/types';

interface Props {
  media: PaginatedData<Media>;
  folders: string[];
  folderCounts: Record<string, number>;
  filters: { folder?: string; type?: string };
}

export default function MediaPage({ media, folders, folderCounts, filters }: Props) {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const insideFolder = !!filters.folder;

  // Upload
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFolder, setUploadFolder] = useState(filters.folder ?? 'general');
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create folder
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [folderNameError, setFolderNameError] = useState('');

  // Rename folder
  const [renamingFolder, setRenamingFolder] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [renameError, setRenameError] = useState('');

  // Delete folder
  const [deletingFolder, setDeletingFolder] = useState<string | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Folder context menu
  const [folderMenuOpen, setFolderMenuOpen] = useState<string | null>(null);

  // Move media item
  const [moveItem, setMoveItem] = useState<Media | null>(null);
  const [moveToFolder, setMoveToFolder] = useState('');

  // Edit / Delete media item
  const [editItem, setEditItem] = useState<Media | null>(null);
  const [editAltEn, setEditAltEn] = useState('');
  const [editAltAr, setEditAltAr] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Media | null>(null);
  const [processing, setProcessing] = useState(false);

  const items = media.data;

  // Close folder context menu when clicking outside
  useEffect(() => {
    if (!folderMenuOpen) return;
    const handleClick = () => setFolderMenuOpen(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [folderMenuOpen]);

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------
  const enterFolder = (folder: string) => {
    router.get('/admin/media', { folder }, { preserveState: false });
  };

  const goBack = () => {
    router.get('/admin/media', {}, { preserveState: false });
  };

  const handleFilterChange = (newFilters: Record<string, string>) => {
    router.get('/admin/media', {
      ...filters,
      ...newFilters,
    }, { preserveState: true, preserveScroll: true });
  };

  const handlePageChange = (page: number) => {
    router.get('/admin/media', { ...filters, page }, { preserveState: true, preserveScroll: true });
  };

  // ---------------------------------------------------------------------------
  // Create folder
  // ---------------------------------------------------------------------------
  const handleCreateFolder = () => {
    const name = newFolderName.trim();
    if (!name) {
      setFolderNameError('Folder name is required.');
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      setFolderNameError('Only letters, numbers, dashes, and underscores are allowed.');
      return;
    }
    if (folders.includes(name)) {
      setFolderNameError('A folder with this name already exists.');
      return;
    }
    setShowCreateFolder(false);
    setNewFolderName('');
    setFolderNameError('');
    router.post('/admin/media/folders', { name } as Record<string, string>, {
      preserveState: false,
    });
  };

  // ---------------------------------------------------------------------------
  // Rename folder
  // ---------------------------------------------------------------------------
  const openRenameFolder = (folder: string) => {
    setRenamingFolder(folder);
    setRenameValue(folder);
    setRenameError('');
    setFolderMenuOpen(null);
  };

  const handleRenameFolder = () => {
    const name = renameValue.trim();
    if (!name) {
      setRenameError('Folder name is required.');
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      setRenameError('Only letters, numbers, dashes, and underscores are allowed.');
      return;
    }
    if (name !== renamingFolder && folders.includes(name)) {
      setRenameError('A folder with this name already exists.');
      return;
    }
    setRenamingFolder(null);
    setRenameValue('');
    setRenameError('');
    router.put('/admin/media/folders', {
      old_name: renamingFolder,
      new_name: name,
    } as Record<string, string>, { preserveState: false });
  };

  // ---------------------------------------------------------------------------
  // Delete folder
  // ---------------------------------------------------------------------------
  const openDeleteFolder = (folder: string) => {
    setDeletingFolder(folder);
    setDeleteConfirmText('');
    setFolderMenuOpen(null);
  };

  const handleDeleteFolder = () => {
    if (!deletingFolder || deleteConfirmText !== deletingFolder) return;
    setDeletingFolder(null);
    setDeleteConfirmText('');
    router.delete('/admin/media/folders', {
      data: { name: deletingFolder },
      preserveState: false,
    });
  };

  // ---------------------------------------------------------------------------
  // Upload
  // ---------------------------------------------------------------------------
  const openUploadModal = () => {
    setUploadFolder(filters.folder ?? 'general');
    setShowUpload(true);
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return;
    setUploading(true);
    setUploadError('');
    setUploadProgress({ current: 0, total: uploadFiles.length });

    let failed = 0;
    for (let i = 0; i < uploadFiles.length; i++) {
      setUploadProgress({ current: i + 1, total: uploadFiles.length });
      try {
        const formData = new FormData();
        formData.append('file', uploadFiles[i]);
        formData.append('folder', uploadFolder);
        await axios.post('/admin/media/json', formData);
      } catch {
        failed++;
      }
    }

    setUploading(false);
    setUploadFiles([]);
    setUploadProgress({ current: 0, total: 0 });
    if (fileInputRef.current) fileInputRef.current.value = '';

    if (failed > 0) {
      setUploadError(`${failed} of ${uploadFiles.length} files failed to upload.`);
    } else {
      setShowUpload(false);
    }

    router.reload();
  };

  // ---------------------------------------------------------------------------
  // Edit / Delete
  // ---------------------------------------------------------------------------
  const openEdit = (item: Media) => {
    setEditItem(item);
    setEditAltEn(item.alt_text_en ?? '');
    setEditAltAr(item.alt_text_ar ?? '');
  };

  const handleUpdateAlt = () => {
    if (!editItem) return;
    router.put(`/admin/media/${editItem.id}`, {
      alt_text_en: editAltEn,
      alt_text_ar: editAltAr,
    }, {
      preserveScroll: true,
      onStart: () => setProcessing(true),
      onFinish: () => setProcessing(false),
      onSuccess: () => setEditItem(null),
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    router.delete(`/admin/media/${deleteTarget.id}`, {
      preserveScroll: true,
      onStart: () => setProcessing(true),
      onFinish: () => setProcessing(false),
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const openMoveItem = (item: Media) => {
    setMoveItem(item);
    // Default to first folder that isn't the current one
    const other = folders.find((f) => f !== item.folder) ?? folders[0] ?? 'general';
    setMoveToFolder(other);
  };

  const handleMoveItem = () => {
    if (!moveItem || !moveToFolder || moveToFolder === moveItem.folder) return;
    router.put(`/admin/media/${moveItem.id}`, {
      folder: moveToFolder,
    }, {
      preserveScroll: true,
      onStart: () => setProcessing(true),
      onFinish: () => setProcessing(false),
      onSuccess: () => setMoveItem(null),
    });
  };

  const folderDisplayName = (folder: string) => folder === 'general' ? 'General Media' : folder;

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <AdminLayout>
      <Head title="Media Library" />
      <div>
        {/* ---- Header ---- */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {insideFolder && (
              <button
                onClick={goBack}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
              {insideFolder && (
                <p className="text-sm text-gray-500 mt-0.5">
                  <button onClick={goBack} className="hover:text-primary transition-colors">Folders</button>
                  {' / '}
                  <span className="text-gray-700 font-medium">{folderDisplayName(filters.folder!)}</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!insideFolder && (
              <button
                onClick={() => setShowCreateFolder(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FolderPlus size={16} />
                New Folder
              </button>
            )}
            <button
              onClick={openUploadModal}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Upload size={16} />
              Upload
            </button>
          </div>
        </div>

        {/* ---- Folder View (no folder selected) ---- */}
        {!insideFolder ? (
          folders.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <FolderOpen size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 mb-1">No folders yet.</p>
              <p className="text-sm text-gray-400">Create a folder or upload files to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {folders.map((folder) => (
                <div
                  key={folder}
                  className="group relative bg-white rounded-xl border border-gray-200 p-4 text-left hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
                  onClick={() => enterFolder(folder)}
                >
                  {/* Context menu button (hidden for "general" folder) */}
                  {folder !== 'general' && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFolderMenuOpen(folderMenuOpen === folder ? null : folder);
                        }}
                        className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {/* Dropdown menu */}
                      {folderMenuOpen === folder && (
                        <div className="absolute right-0 top-8 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openRenameFolder(folder);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <FolderPen size={14} />
                            Rename
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteFolder(folder);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-center mb-3">
                    <Folder size={40} className="text-primary/70 group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-sm font-medium text-gray-800 truncate text-center">{folderDisplayName(folder)}</p>
                  <p className="text-xs text-gray-400 text-center mt-1">
                    {folderCounts[folder] ?? 0} {(folderCounts[folder] ?? 0) === 1 ? 'file' : 'files'}
                  </p>
                </div>
              ))}
            </div>
          )
        ) : (
          <>
            {/* ---- Inside Folder: Filters ---- */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5">
                {[
                  { value: '', label: 'All' },
                  { value: 'image', label: 'Images' },
                  { value: 'pdf', label: 'PDFs' },
                ].map((opt) => {
                  const active = (filters.type ?? '') === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleFilterChange({ type: opt.value })}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        active
                          ? 'bg-primary text-white'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              <span className="text-sm text-gray-500 ml-auto">{media.total} files</span>
            </div>

            {/* ---- Inside Folder: Media Grid ---- */}
            {items.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <FolderOpen size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 mb-1">This folder is empty.</p>
                <p className="text-sm text-gray-400">Click Upload to add files to this folder.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                      {item.mime_type.startsWith('image/') ? (
                        <img
                          src={item.url}
                          alt={item.alt_text_en ?? item.original_filename}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <FileText size={32} className="text-red-400" />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEdit(item)}
                            className="p-2 bg-white rounded-lg shadow hover:bg-gray-50"
                            title="Edit alt text"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => openMoveItem(item)}
                            className="p-2 bg-white rounded-lg shadow hover:bg-blue-50"
                            title="Move to folder"
                          >
                            <FolderInput size={14} className="text-blue-500" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="p-2 bg-white rounded-lg shadow hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={14} className="text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="text-xs text-gray-700 truncate">{item.original_filename}</p>
                      <p className="text-xs text-gray-400">{formatSize(item.size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {media.last_page > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={media.current_page}
                  lastPage={media.last_page}
                  perPage={media.per_page}
                  total={media.total}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}

        {/* ---- Create Folder Modal ---- */}
        {showCreateFolder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreateFolder(false)} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">New Folder</h2>
                <button onClick={() => { setShowCreateFolder(false); setFolderNameError(''); }} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Folder Name</label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => { setNewFolderName(e.target.value); setFolderNameError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                  placeholder="e.g. products, banners, certificates"
                  autoFocus
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                {folderNameError && (
                  <p className="mt-1 text-xs text-red-600">{folderNameError}</p>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => { setShowCreateFolder(false); setNewFolderName(''); setFolderNameError(''); }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50"
                >
                  <FolderPlus size={16} />
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---- Upload Modal ---- */}
        {showUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => !uploading && setShowUpload(false)} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Upload Files</h2>
                <button onClick={() => !uploading && setShowUpload(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              {/* Folder selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Folder</label>
                <select
                  value={uploadFolder}
                  onChange={(e) => setUploadFolder(e.target.value)}
                  disabled={uploading}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                >
                  {folders.map((f) => (
                    <option key={f} value={f}>{folderDisplayName(f)}</option>
                  ))}
                  {/* If currently inside a folder not in the list (new/empty), include it */}
                  {filters.folder && !folders.includes(filters.folder) && (
                    <option value={filters.folder}>{filters.folder}</option>
                  )}
                </select>
              </div>

              {/* File input */}
              <div className="mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  disabled={uploading}
                  onChange={(e) => {
                    setUploadFiles(e.target.files ? Array.from(e.target.files) : []);
                    setUploadError('');
                  }}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 disabled:opacity-50"
                />
              </div>

              {/* File list preview */}
              {uploadFiles.length > 1 && !uploading && (
                <div className="mb-4 max-h-32 overflow-y-auto rounded-lg border border-gray-200 divide-y divide-gray-100">
                  {uploadFiles.map((file, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 text-xs">
                      <span className="text-gray-700 truncate mr-2">{file.name}</span>
                      <span className="text-gray-400 shrink-0">{(file.size / 1024).toFixed(0)} KB</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Progress bar */}
              {uploading && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Uploading {uploadProgress.current} of {uploadProgress.total}...</span>
                    <span>{Math.round((uploadProgress.current / uploadProgress.total) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {uploadError && (
                <p className="mb-4 text-xs text-red-600">{uploadError}</p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowUpload(false);
                    setUploadFiles([]);
                    setUploadError('');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  disabled={uploading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploadFiles.length === 0 || uploading}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50"
                >
                  <Upload size={16} />
                  {uploading
                    ? `Uploading ${uploadProgress.current}/${uploadProgress.total}`
                    : uploadFiles.length > 1
                      ? `Upload ${uploadFiles.length} Files`
                      : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---- Edit Alt Text Modal ---- */}
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
                  disabled={processing}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50"
                >
                  {processing ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---- Move to Folder Modal ---- */}
        {moveItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMoveItem(null)} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Move to Folder</h2>
                <button onClick={() => setMoveItem(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                {moveItem.mime_type.startsWith('image/') ? (
                  <Image size={20} className="text-blue-500 shrink-0" />
                ) : (
                  <FileText size={20} className="text-red-500 shrink-0" />
                )}
                <span className="text-sm text-gray-700 truncate">{moveItem.original_filename}</span>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination Folder</label>
                <select
                  value={moveToFolder}
                  onChange={(e) => setMoveToFolder(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {folders.filter((f) => f !== moveItem.folder).map((f) => (
                    <option key={f} value={f}>{folderDisplayName(f)}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setMoveItem(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMoveItem}
                  disabled={processing || !moveToFolder}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50"
                >
                  <FolderInput size={16} />
                  {processing ? 'Moving...' : 'Move'}
                </button>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog
          open={!!deleteTarget}
          title="Delete Media"
          message={`Are you sure you want to delete "${deleteTarget?.original_filename}"? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          loading={processing}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />

        {/* ---- Rename Folder Modal ---- */}
        {renamingFolder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setRenamingFolder(null)} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Rename Folder</h2>
                <button onClick={() => setRenamingFolder(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">New Name</label>
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) => { setRenameValue(e.target.value); setRenameError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleRenameFolder()}
                  autoFocus
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                {renameError && (
                  <p className="mt-1 text-xs text-red-600">{renameError}</p>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setRenamingFolder(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRenameFolder}
                  disabled={!renameValue.trim() || renameValue.trim() === renamingFolder}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50"
                >
                  <FolderPen size={16} />
                  Rename
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---- Delete Folder Confirmation Modal ---- */}
        {deletingFolder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setDeletingFolder(null)} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Folder</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Are you sure you want to delete the folder <strong>"{folderDisplayName(deletingFolder)}"</strong>?
                    {(folderCounts[deletingFolder] ?? 0) > 0 && (
                      <span className="block mt-1 text-red-600 font-medium">
                        This folder contains {folderCounts[deletingFolder]} {folderCounts[deletingFolder] === 1 ? 'file' : 'files'} that will be moved to the "general" folder.
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type <span className="font-mono text-red-600 bg-red-50 px-1.5 py-0.5 rounded">{deletingFolder}</span> to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && deleteConfirmText === deletingFolder && handleDeleteFolder()}
                  placeholder="Type the folder name..."
                  autoFocus
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => { setDeletingFolder(null); setDeleteConfirmText(''); }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteFolder}
                  disabled={deleteConfirmText !== deletingFolder}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} />
                  Delete Folder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
