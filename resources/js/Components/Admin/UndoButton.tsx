import { useState } from 'react';
import { router } from '@inertiajs/react';
import { History, AlertTriangle, ArrowRight, X } from 'lucide-react';
import type { UndoMeta } from '@/types';

interface UndoButtonProps {
  modelType: string;
  modelId: string | number;
  undoMeta: UndoMeta | null;
}

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(isoDate).toLocaleDateString();
}

export default function UndoButton({ modelType, modelId, undoMeta }: UndoButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [restoring, setRestoring] = useState(false);

  if (!undoMeta?.available || !undoMeta.changes?.length) {
    return null;
  }

  const handleRestore = () => {
    router.post(`/admin/undo/${modelType}/${modelId}`, {}, {
      preserveScroll: true,
      onStart: () => setRestoring(true),
      onFinish: () => {
        setRestoring(false);
        setShowConfirm(false);
      },
    });
  };

  const handleDismiss = () => {
    router.delete(`/admin/undo/${modelType}/${modelId}`, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  return (
    <>
      {/* Undo trigger button */}
      <div className="group/undo relative inline-flex">
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <History size={15} />
          <span>Undo Last Update</span>
          <span className="bg-blue-200 text-blue-800 text-xs font-semibold px-1.5 py-0.5 rounded-full">
            {undoMeta.changes.length}
          </span>
          <span className="text-xs text-blue-400 ml-0.5">{timeAgo(undoMeta.saved_at)}</span>
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="ml-1 p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
          title="Dismiss"
        >
          <X size={14} />
        </button>

        {/* Hover tooltip showing changes */}
        <div className="absolute left-0 top-full mt-2 hidden group-hover/undo:block z-30 w-80">
          <div className="bg-gray-900 text-white text-xs rounded-xl p-3.5 shadow-xl border border-gray-700">
            <div className="flex items-center gap-2 mb-2.5">
              <History size={13} className="text-blue-400" />
              <span className="font-medium text-gray-300">Changes in last update</span>
              <span className="ml-auto bg-blue-500/20 text-blue-300 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                {undoMeta.changes.length} {undoMeta.changes.length === 1 ? 'field' : 'fields'}
              </span>
            </div>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {undoMeta.changes.map((change, i) => (
                <li key={i} className="border-t border-gray-700/50 pt-2 first:border-0 first:pt-0">
                  <p className="font-medium text-gray-300 mb-1">{change.label}</p>
                  <div className="flex items-start gap-1.5">
                    <span className="shrink-0 mt-0.5 w-3.5 h-3.5 rounded bg-red-500/20 text-red-400 flex items-center justify-center text-[9px] font-bold">−</span>
                    <span className="text-red-300 line-through break-all">
                      {change.old || <span className="italic text-gray-500">empty</span>}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5 mt-0.5">
                    <span className="shrink-0 mt-0.5 w-3.5 h-3.5 rounded bg-green-500/20 text-green-400 flex items-center justify-center text-[9px] font-bold">+</span>
                    <span className="text-green-300 break-all">
                      {change.new || <span className="italic text-gray-500">empty</span>}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => !restoring && setShowConfirm(false)} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle size={20} className="text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Restore previous version?</h3>
                <p className="mt-1 text-sm text-gray-600">
                  The following {undoMeta.changes.length === 1 ? 'field' : `${undoMeta.changes.length} fields`} will be reverted:
                </p>
              </div>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={restoring}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-5 max-h-48 overflow-y-auto space-y-2.5 rounded-lg bg-gray-50 p-3">
              {undoMeta.changes.map((change, i) => (
                <div key={i} className="text-sm">
                  <p className="font-medium text-gray-700 mb-0.5">{change.label}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-red-600 line-through truncate max-w-35">
                      {change.new || '(empty)'}
                    </span>
                    <ArrowRight size={12} className="text-gray-400 shrink-0" />
                    <span className="text-green-700 truncate max-w-35">
                      {change.old || '(empty)'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={restoring}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRestore}
                disabled={restoring}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:opacity-50"
              >
                <History size={15} />
                {restoring ? 'Restoring...' : 'Restore'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
