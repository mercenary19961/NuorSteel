import { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, Image } from 'lucide-react';

interface FileUploadProps {
  onUpload: (file: File) => void;
  accept?: string;
  maxSize?: number;
  label?: string;
  loading?: boolean;
}

export default function FileUpload({
  onUpload,
  accept = 'image/jpeg,image/png,image/webp,application/pdf',
  maxSize = 10,
  label = 'Upload File',
  loading = false,
}: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<{ name: string; type: string } | null>(null);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = accept.split(',').map((t) => t.trim());
  const maxBytes = maxSize * 1024 * 1024;

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!acceptedTypes.some((t) => file.type.match(t.replace('*', '.*')))) {
        return `Invalid file type. Accepted: ${accept}`;
      }
      if (file.size > maxBytes) {
        return `File too large. Max size: ${maxSize}MB`;
      }
      return null;
    },
    [acceptedTypes, accept, maxBytes, maxSize],
  );

  const handleFile = useCallback(
    (file: File) => {
      setError('');
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      setPreview({ name: file.name, type: file.type });
      onUpload(file);
    },
    [validateFile, onUpload],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  const clearPreview = () => {
    setPreview(null);
    setError('');
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

      {preview ? (
        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          {preview.type.startsWith('image/') ? (
            <Image size={20} className="text-blue-500" />
          ) : (
            <FileText size={20} className="text-red-500" />
          )}
          <span className="flex-1 text-sm text-gray-700 truncate">{preview.name}</span>
          {loading ? (
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <button onClick={clearPreview} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            dragOver
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <Upload size={24} className="text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            Drag & drop or <span className="text-primary font-medium">browse</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">Max {maxSize}MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
