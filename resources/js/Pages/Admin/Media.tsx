import { useState, useRef, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Admin/Pagination';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';
import CustomSelect from '@/Components/Admin/CustomSelect';
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
  Link2,
  Eye,
  Download,
  CheckSquare,
  Square,
  Check,
} from 'lucide-react';
import UndoButton from '@/Components/Admin/UndoButton';
import type { Media, MediaUsage, PaginatedData, UndoMeta } from '@/types';

interface FolderPreview {
  mime_type: string;
  url: string;
}

interface Props {
  media: PaginatedData<Media>;
  folders: string[];
  folderCounts: Record<string, number>;
  folderPreviews: Record<string, FolderPreview>;
  filters: { folder?: string; type?: string };
  mediaUsage: Record<number, MediaUsage[]>;
  undoMeta?: UndoMeta | null;
  undoModelId?: string | null;
}

export default function MediaPage({ media, folders, folderCounts, folderPreviews, filters, mediaUsage, undoMeta, undoModelId }: Props) {
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

  // Edit / Delete / Preview media item
  const [editItem, setEditItem] = useState<Media | null>(null);
  const [editAltEn, setEditAltEn] = useState('');
  const [editAltAr, setEditAltAr] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Media | null>(null);
  const [previewItem, setPreviewItem] = useState<Media | null>(null);
  const [processing, setProcessing] = useState(false);

  // Multi-select (only inside a folder)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [bulkDeleteConfirmText, setBulkDeleteConfirmText] = useState('');

  // Folder-delete also-delete-files toggle
  const [deleteFolderFiles, setDeleteFolderFiles] = useState(false);

  const items = media.data;
  const allSelectedOnPage = items.length > 0 && items.every((it) => selectedIds.has(it.id));

  // Drop selection when the user navigates between folders or pages.
  // Stale ids from another view would otherwise hang around in state.
  useEffect(() => {
    setSelectedIds(new Set());
  }, [filters.folder, media.current_page]);

  const toggleSelected = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelectedOnPage) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((it) => it.id)));
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    router.post('/admin/media/bulk-delete', {
      ids: Array.from(selectedIds),
    } as unknown as Record<string, string>, {
      preserveScroll: true,
      onStart: () => setProcessing(true),
      onFinish: () => setProcessing(false),
      onSuccess: () => {
        setShowBulkDeleteModal(false);
        setBulkDeleteConfirmText('');
        setSelectedIds(new Set());
      },
    });
  };

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
    setDeleteFolderFiles(false);
    setFolderMenuOpen(null);
  };

  const handleDeleteFolder = () => {
    if (!deletingFolder || deleteConfirmText !== deletingFolder) return;
    const target = deletingFolder;
    const alsoDeleteFiles = deleteFolderFiles;
    setDeletingFolder(null);
    setDeleteConfirmText('');
    setDeleteFolderFiles(false);
    router.delete('/admin/media/folders', {
      data: { name: target, delete_files: alsoDeleteFiles },
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
            {undoMeta && undoModelId && (
              <UndoButton modelType="media" modelId={undoModelId} undoMeta={undoMeta} />
            )}
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {folders.map((folder) => {
                const preview = folderPreviews[folder];
                const count = folderCounts[folder] ?? 0;

                return (
                  <div
                    key={folder}
                    className="group relative bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer overflow-hidden"
                    onClick={() => enterFolder(folder)}
                  >
                    {/* Context menu button (hidden for "general" folder) */}
                    {folder !== 'general' && (
                      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFolderMenuOpen(folderMenuOpen === folder ? null : folder);
                          }}
                          className="p-1 rounded-md bg-white/80 backdrop-blur-sm hover:bg-white text-gray-400 hover:text-gray-600 shadow-sm"
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

                    {/* Folder preview thumbnail */}
                    <div className="aspect-4/3 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                      {preview ? (
                        preview.mime_type.startsWith('image/') ? (
                          <img
                            src={preview.url}
                            alt={folder}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                          />
                        ) : preview.mime_type === 'application/pdf' ? (
                          <div className="w-full h-full relative">
                            <iframe
                              src={`${preview.url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                              className="w-[200%] h-[200%] origin-top-left scale-50 pointer-events-none opacity-70 group-hover:opacity-90 transition-opacity"
                              title={folder}
                            />
                          </div>
                        ) : (
                          <Folder size={48} className="text-primary/40 group-hover:text-primary/60 transition-colors" />
                        )
                      ) : (
                        <Folder size={48} className="text-primary/40 group-hover:text-primary/60 transition-colors" />
                      )}
                    </div>

                    {/* Folder info */}
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-800 truncate">{folderDisplayName(folder)}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {count} {count === 1 ? 'file' : 'files'}
                      </p>
                    </div>
                  </div>
                );
              })}
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

            {/* ---- Inside Folder: Selection Action Bar ---- */}
            {items.length > 0 && (
              <div
                className={`flex items-center gap-3 mb-4 p-3 rounded-lg border transition-colors ${
                  selectedIds.size > 0
                    ? 'bg-primary/5 border-primary/30'
                    : 'bg-white border-gray-200'
                }`}
              >
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 px-2 py-1 -m-1 rounded-md hover:bg-white/60 transition-colors text-sm font-medium text-gray-700 cursor-pointer"
                >
                  {allSelectedOnPage ? (
                    <CheckSquare size={18} className="text-primary" />
                  ) : (
                    <Square size={18} className="text-gray-400" />
                  )}
                  {allSelectedOnPage ? 'Deselect all' : 'Select all'}
                </button>

                {selectedIds.size > 0 && (
                  <>
                    <span className="text-sm text-gray-600">
                      <strong className="text-gray-900">{selectedIds.size}</strong> selected
                    </span>
                    <button
                      onClick={clearSelection}
                      className="text-sm text-gray-500 hover:text-gray-700 underline cursor-pointer"
                    >
                      Clear
                    </button>
                    <div className="ml-auto">
                      <button
                        onClick={() => setShowBulkDeleteModal(true)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
                      >
                        <Trash2 size={14} />
                        Delete ({selectedIds.size})
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ---- Inside Folder: Media Grid ---- */}
            {items.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <FolderOpen size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 mb-1">This folder is empty.</p>
                <p className="text-sm text-gray-400">Click Upload to add files to this folder.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {items.map((item) => {
                  const isSelected = selectedIds.has(item.id);
                  return (
                  <div
                    key={item.id}
                    className={`group relative bg-white rounded-xl border transition-shadow hover:shadow-md ${
                      isSelected ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200'
                    }`}
                  >
                    {/* Selection checkbox — always visible when something is selected on this page,
                        else only on hover. Stops click propagation so it doesn't open the preview. */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelected(item.id);
                      }}
                      aria-label={isSelected ? 'Deselect' : 'Select'}
                      className={`absolute top-2 left-2 z-10 w-6 h-6 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary text-white shadow-md opacity-100'
                          : `bg-white/90 backdrop-blur-sm border border-gray-300 text-transparent hover:border-primary ${
                              selectedIds.size > 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`
                      }`}
                    >
                      <Check size={14} strokeWidth={3} />
                    </button>

                    <div
                      className="aspect-square bg-gray-100 flex items-center justify-center relative rounded-t-xl overflow-hidden cursor-pointer"
                      onClick={() => setPreviewItem(item)}
                    >
                      {item.mime_type.startsWith('image/') ? (
                        <img
                          src={item.url}
                          alt={item.alt_text_en ?? item.original_filename}
                          className="w-full h-full object-contain"
                        />
                      ) : item.mime_type === 'application/pdf' ? (
                        <div className="w-full h-full relative">
                          <iframe
                            src={`${item.url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                            className="w-[200%] h-[200%] origin-top-left scale-50 pointer-events-none"
                            title={item.original_filename}
                          />
                        </div>
                      ) : (
                        <FileText size={32} className="text-red-400" />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setPreviewItem(item)}
                            className="p-2 bg-white rounded-lg shadow hover:bg-gray-50"
                            title="Preview"
                          >
                            <Eye size={14} className="text-gray-600" />
                          </button>
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
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-xs text-gray-400">{formatSize(item.size)}</p>
                        {mediaUsage[item.id] && mediaUsage[item.id].length > 0 && (
                          <div className="group/usage relative">
                            <span className="flex items-center gap-1 text-xs text-emerald-600 cursor-help">
                              <Link2 size={11} />
                              {mediaUsage[item.id].length}
                            </span>
                            {/* Tooltip */}
                            <div className="absolute bottom-full right-0 mb-1.5 hidden group-hover/usage:block z-20 w-52">
                              <div className="bg-gray-900 text-white text-xs rounded-lg p-2.5 shadow-lg">
                                <p className="font-medium mb-1.5 text-gray-300">Used in:</p>
                                <ul className="space-y-1">
                                  {mediaUsage[item.id].map((u, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                      <span className="text-gray-400 shrink-0">&bull;</span>
                                      <span>
                                        <a
                                          href={u.url}
                                          className="text-primary-light hover:underline"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            router.visit(u.url);
                                          }}
                                        >
                                          {u.name}
                                        </a>
                                        <span className="text-gray-400 block text-[10px]">{u.type}</span>
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  );
                })}
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
                <CustomSelect
                  value={uploadFolder}
                  onChange={(val) => setUploadFolder(val)}
                  disabled={uploading}
                  options={[
                    ...folders.map((f) => ({ value: f, label: folderDisplayName(f) })),
                    ...(filters.folder && !folders.includes(filters.folder)
                      ? [{ value: filters.folder, label: filters.folder }]
                      : []),
                  ]}
                />
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
                <CustomSelect
                  value={moveToFolder}
                  onChange={setMoveToFolder}
                  options={folders
                    .filter((f) => f !== moveItem.folder)
                    .map((f) => ({
                      value: f,
                      label: folderDisplayName(f),
                      icon: <Folder size={14} className="text-primary/60" />,
                    }))}
                  placeholder="Select a folder…"
                />
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
          message={`Are you sure you want to delete "${deleteTarget?.original_filename}"? You can undo this action.`}
          confirmLabel="Delete"
          variant="danger"
          loading={processing}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />

        {/* ---- Preview Modal ---- */}
        {previewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/70" onClick={() => setPreviewItem(null)} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  {previewItem.mime_type.startsWith('image/') ? (
                    <Image size={18} className="text-blue-500" />
                  ) : (
                    <FileText size={18} className="text-red-500" />
                  )}
                  <span className="text-sm font-medium text-gray-900 truncate">{previewItem.original_filename}</span>
                  <span className="text-xs text-gray-400">{formatSize(previewItem.size)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={previewItem.url}
                    download={previewItem.original_filename}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                    title="Download"
                  >
                    <Download size={18} />
                  </a>
                  <button onClick={() => setPreviewItem(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4 flex items-center justify-center min-h-[60vh]">
                {previewItem.mime_type.startsWith('image/') ? (
                  <img
                    src={previewItem.url}
                    alt={previewItem.alt_text_en ?? previewItem.original_filename}
                    className="max-w-full max-h-[75vh] object-contain"
                  />
                ) : previewItem.mime_type === 'application/pdf' ? (
                  <iframe
                    src={previewItem.url}
                    className="w-full h-[75vh] rounded-lg border border-gray-200"
                    title={previewItem.original_filename}
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                    <p>Preview not available for this file type.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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

        {/* ---- Bulk Delete Confirmation Modal ---- */}
        {showBulkDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => { setShowBulkDeleteModal(false); setBulkDeleteConfirmText(''); }}
            />
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Selected Files</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    You're about to delete{' '}
                    <strong className="text-red-600">{selectedIds.size} {selectedIds.size === 1 ? 'file' : 'files'}</strong>.
                    Files will be soft-deleted and can be restored from the database.
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type <span className="font-mono text-red-600 bg-red-50 px-1.5 py-0.5 rounded">delete</span> to confirm
                </label>
                <input
                  type="text"
                  value={bulkDeleteConfirmText}
                  onChange={(e) => setBulkDeleteConfirmText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && bulkDeleteConfirmText === 'delete' && handleBulkDelete()}
                  placeholder="Type 'delete'..."
                  autoFocus
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => { setShowBulkDeleteModal(false); setBulkDeleteConfirmText(''); }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={bulkDeleteConfirmText !== 'delete' || processing}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} />
                  Delete {selectedIds.size} {selectedIds.size === 1 ? 'file' : 'files'}
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
                      deleteFolderFiles ? (
                        <span className="block mt-1 text-red-600 font-medium">
                          {folderCounts[deletingFolder]} {folderCounts[deletingFolder] === 1 ? 'file' : 'files'} inside this folder will also be deleted.
                        </span>
                      ) : (
                        <span className="block mt-1 text-gray-600">
                          The {folderCounts[deletingFolder]} {folderCounts[deletingFolder] === 1 ? 'file' : 'files'} inside will be moved to the "General Media" folder.
                        </span>
                      )
                    )}
                  </p>
                </div>
              </div>

              {(folderCounts[deletingFolder] ?? 0) > 0 && (
                <label className="flex items-start gap-2.5 mb-4 p-3 rounded-lg bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={deleteFolderFiles}
                    onChange={(e) => setDeleteFolderFiles(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">
                    <span className="font-medium">Also delete all files inside this folder</span>
                    <span className="block text-xs text-gray-500 mt-0.5">
                      Files will be soft-deleted and can be restored from the database, but they won't appear in the Media Library anymore.
                    </span>
                  </span>
                </label>
              )}

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
                  onClick={() => { setDeletingFolder(null); setDeleteConfirmText(''); setDeleteFolderFiles(false); }}
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
