import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  const confirmClass =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 text-white'
      : 'bg-yellow-600 hover:bg-yellow-700 text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      {/* Dialog */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-start gap-4">
          <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            variant === 'danger' ? 'bg-red-100' : 'bg-yellow-100'
          }`}>
            <AlertTriangle size={20} className={variant === 'danger' ? 'text-red-600' : 'text-yellow-600'} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium rounded-lg disabled:opacity-50 ${confirmClass}`}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
