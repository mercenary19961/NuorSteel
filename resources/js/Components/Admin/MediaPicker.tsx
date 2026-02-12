import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import {
  X,
  Search,
  Upload,
  Check,
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ImageIcon,
} from 'lucide-react';
import type { Media, PaginatedData } from '@/types';

interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (items: Media[]) => void;
  multiple?: boolean;
  typeFilter?: 'image' | 'pdf';
  title?: string;
}

export default function MediaPicker({
  open,
  onClose,
  onSelect,
  multiple = false,
  typeFilter,
  title = 'Select Media',
}: MediaPickerProps) {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const [loading, setLoading] = useState(false);
  const [mediaData, setMediaData] = useState<PaginatedData<Media> | null>(null);
  const [folders, setFolders] = useState<string[]>([]);
  const [selected, setSelected] = useState<Map<number, Media>>(new Map());

  // Filters
  const [folder, setFolder] = useState('');
  const [type, setType] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Upload panel
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFolder, setUploadFolder] = useState('products');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---------------------------------------------------------------------------
  // Debounced search
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ---------------------------------------------------------------------------
  // Fetch media
  // ---------------------------------------------------------------------------
  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page };
      if (folder) params.folder = folder;
      if (typeFilter) {
        params.type = typeFilter;
      } else if (type) {
        params.type = type;
      }
      if (search) params.search = search;

      const response = await axios.get('/admin/media/json', { params });
      setMediaData(response.data.media);
      setFolders(response.data.folders);
    } catch {
      // Silently fail — grid will show empty state
    } finally {
      setLoading(false);
    }
  }, [page, folder, type, typeFilter, search]);

  useEffect(() => {
    if (open) {
      fetchMedia();
    }
  }, [open, fetchMedia]);

  // ---------------------------------------------------------------------------
  // Body scroll lock
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [open]);

  // ---------------------------------------------------------------------------
  // Escape key
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // ---------------------------------------------------------------------------
  // Reset state when modal closes
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!open) {
      setSelected(new Map());
      setSearchInput('');
      setSearch('');
      setFolder('');
      setType('');
      setPage(1);
      setShowUpload(false);
      setUploadFile(null);
      setUploadFolder('products');
      setUploadError('');
      setMediaData(null);
    }
  }, [open]);

  // ---------------------------------------------------------------------------
  // Selection logic
  // ---------------------------------------------------------------------------
  const toggleSelection = (item: Media) => {
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        if (!multiple) {
          next.clear();
        }
        next.set(item.id, item);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    onSelect(Array.from(selected.values()));
  };

  // ---------------------------------------------------------------------------
  // Upload handler
  // ---------------------------------------------------------------------------
  const handleUpload = async () => {
    if (!uploadFile) return;
    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('folder', uploadFolder);

      const response = await axios.post('/admin/media/json', formData);
      const newMedia: Media = response.data.media;

      // Hide panel and reset
      setShowUpload(false);
      setUploadFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      // Refresh grid
      await fetchMedia();

      // Auto-select the new item
      if (!multiple) {
        setSelected(new Map([[newMedia.id, newMedia]]));
      } else {
        setSelected((prev) => new Map(prev).set(newMedia.id, newMedia));
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.errors) {
        const errors = err.response.data.errors as Record<string, string[]>;
        const firstKey = Object.keys(errors)[0];
        setUploadError(errors[firstKey][0]);
      } else {
        setUploadError('Upload failed. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  if (!open) return null;

  const items = mediaData?.data ?? [];
  const currentPage = mediaData?.current_page ?? 1;
  const lastPage = mediaData?.last_page ?? 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Card */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[85vh] flex flex-col">
        {/* ---- Header ---- */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* ---- Filter bar ---- */}
        <div className="flex flex-wrap items-center gap-3 px-6 py-3 border-b border-gray-100 shrink-0">
          {/* Folder dropdown */}
          <select
            value={folder}
            onChange={(e) => {
              setFolder(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">All Folders</option>
            {folders.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          {/* Type dropdown */}
          <select
            value={typeFilter ?? type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
            disabled={!!typeFilter}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">All Types</option>
            <option value="image">Images</option>
            <option value="pdf">PDFs</option>
          </select>

          {/* Search input */}
          <div className="relative flex-1 min-w-[180px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Upload button */}
          <button
            onClick={() => setShowUpload((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Upload size={16} />
            Upload
          </button>
        </div>

        {/* ---- Upload panel ---- */}
        {showUpload && (
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 shrink-0">
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Folder
                </label>
                <input
                  type="text"
                  value={uploadFolder}
                  onChange={(e) => setUploadFolder(e.target.value)}
                  placeholder="products"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  File
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    setUploadFile(e.target.files?.[0] ?? null);
                    setUploadError('');
                  }}
                  className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowUpload(false);
                    setUploadFile(null);
                    setUploadError('');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!uploadFile || uploading}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
            {uploadError && (
              <p className="mt-2 text-xs text-red-600">{uploadError}</p>
            )}
          </div>
        )}

        {/* ---- Grid area ---- */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Loader2 size={32} className="animate-spin mb-3" />
              <p className="text-sm">Loading media...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <ImageIcon size={40} className="mb-3" />
              <p className="text-sm">No media found</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {items.map((item) => {
                const isSelected = selected.has(item.id);
                const isImage = item.mime_type.startsWith('image/');

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleSelection(item)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all group focus:outline-none ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/30'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Thumbnail */}
                    {isImage ? (
                      <img
                        src={item.url}
                        alt={item.alt_text_en ?? item.original_filename}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <FileText size={28} className="text-red-400" />
                      </div>
                    )}

                    {/* Check icon */}
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow">
                        <Check size={14} className="text-white" />
                      </div>
                    )}

                    {/* Filename overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-black/50 px-1.5 py-1">
                      <p className="text-[10px] text-white truncate leading-tight">
                        {item.original_filename}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ---- Pagination ---- */}
        {lastPage > 1 && (
          <div className="flex items-center justify-center gap-3 px-6 py-2 border-t border-gray-100 shrink-0">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {lastPage}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
              disabled={currentPage === lastPage}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* ---- Footer ---- */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 shrink-0">
          <span className="text-sm text-gray-500">
            {selected.size} selected
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selected.size === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors"
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
