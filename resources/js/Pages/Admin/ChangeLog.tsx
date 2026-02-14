import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Admin/Pagination';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';
import CustomSelect from '@/Components/Admin/CustomSelect';
import { ChevronDown, ChevronUp, Undo2, ArrowRight, RotateCcw, Trash2 } from 'lucide-react';
import type { PageProps, PaginatedData, ChangeLog as ChangeLogType, UndoFieldChange, User } from '@/types';

const SECTION_COLORS: Record<string, string> = {
  settings: 'bg-purple-100 text-purple-700',
  site_content: 'bg-blue-100 text-blue-700',
  product: 'bg-green-100 text-green-700',
  media: 'bg-yellow-100 text-yellow-700',
  certificate: 'bg-orange-100 text-orange-700',
  career: 'bg-indigo-100 text-indigo-700',
  application: 'bg-pink-100 text-pink-700',
};

interface Props {
  logs: PaginatedData<ChangeLogType>;
  users: Pick<User, 'id' | 'name'>[];
  sectionLabels: Record<string, string>;
  filters: {
    model_type?: string;
    changed_by?: string;
    period?: string;
  };
}

export default function ChangeLog({ logs, users, sectionLabels, filters }: Props) {
  const { auth } = usePage<PageProps>().props;
  const isAdmin = auth.user?.role === 'admin';

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [revertTarget, setRevertTarget] = useState<ChangeLogType | null>(null);
  const [reverting, setReverting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ChangeLogType | null>(null);
  const [deleting, setDeleting] = useState(false);

  const modelType = filters.model_type ?? '';
  const changedBy = filters.changed_by ?? '';
  const period = filters.period ?? '';

  const applyFilters = (overrides: Record<string, string | undefined>) => {
    const params: Record<string, string | undefined> = {
      model_type: modelType || undefined,
      changed_by: changedBy || undefined,
      period: period || undefined,
      ...overrides,
    };

    const cleanParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, val]) => {
      if (val) cleanParams[key] = val;
    });

    router.get('/admin/change-log', cleanParams, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handlePageChange = (page: number) => {
    const params: Record<string, string | undefined> = {
      model_type: modelType || undefined,
      changed_by: changedBy || undefined,
      period: period || undefined,
    };
    const cleanParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, val]) => {
      if (val) cleanParams[key] = val;
    });

    router.get('/admin/change-log', { ...cleanParams, page }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setDeleting(true);
    router.delete(`/admin/change-log/${deleteTarget.id}`, {
      preserveScroll: true,
      onSuccess: () => setDeleteTarget(null),
      onFinish: () => setDeleting(false),
    });
  };

  const handleRevert = () => {
    if (!revertTarget) return;
    setReverting(true);
    router.post(`/admin/change-log/${revertTarget.id}/revert`, {}, {
      preserveScroll: true,
      onSuccess: () => setRevertTarget(null),
      onFinish: () => setReverting(false),
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const PREVIEW_COUNT = 2;

  const ChangeItem = ({ change }: { change: UndoFieldChange }) => (
    <div className="py-1.5">
      <p className="text-[11px] font-medium text-gray-400 mb-0.5">{change.label}</p>
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-red-500 line-through truncate" title={change.old || '(empty)'}>
          {change.old || <span className="no-underline italic text-gray-300">(empty)</span>}
        </span>
        <ArrowRight size={10} className="text-gray-300 shrink-0" />
        <span className="text-green-600 truncate" title={change.new || '(empty)'}>
          {change.new || <span className="italic text-gray-300">(empty)</span>}
        </span>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <Head title="Change Log" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Change Log</h1>
          <p className="text-sm text-gray-500 mt-1">History of all content changes across the admin panel</p>
        </div>
        <span className="text-sm text-gray-500">{logs.total} entries</span>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <CustomSelect
          value={modelType}
          onChange={(val) => applyFilters({ model_type: val || undefined })}
          placeholder="All Sections"
          options={[
            { value: '', label: 'All Sections' },
            ...Object.entries(sectionLabels).map(([key, label]) => ({ value: key, label })),
          ]}
          className="w-44"
        />

        <CustomSelect
          value={changedBy}
          onChange={(val) => applyFilters({ changed_by: val || undefined })}
          placeholder="All Users"
          options={[
            { value: '', label: 'All Users' },
            ...users.map((user) => ({ value: String(user.id), label: user.name })),
          ]}
          className="w-40"
        />

        <CustomSelect
          value={period}
          onChange={(val) => applyFilters({ period: val || undefined })}
          placeholder="All Time"
          options={[
            { value: '', label: 'All Time' },
            { value: 'week', label: 'Past Week' },
            { value: 'month', label: 'Past Month' },
            { value: 'year', label: 'Past Year' },
          ]}
          className="w-36"
        />
      </div>

      {/* Card grid */}
      {logs.data.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 px-6 py-12 text-center text-sm text-gray-500">
          No change history found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {logs.data.map((item) => {
            const isExpanded = expandedId === item.id;
            const isReverted = !!item.reverted_at;
            const colorClass = SECTION_COLORS[item.model_type] || 'bg-gray-100 text-gray-600';
            const previewChanges = item.changes.slice(0, PREVIEW_COUNT);
            const remainingCount = item.changes.length - PREVIEW_COUNT;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl border shadow-sm flex flex-col transition-all ${
                  isReverted
                    ? 'border-gray-200 opacity-50'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-2 px-4 pt-3 pb-2">
                  <div className="min-w-0">
                    <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full ${colorClass}`}>
                      {sectionLabels[item.model_type] || item.model_type}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-xs font-medium text-gray-600">
                        {item.user?.name || 'Unknown'}
                      </span>
                      <span className="text-[11px] text-gray-400" title={new Date(item.created_at).toLocaleString()}>
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!isReverted ? (
                      <button
                        onClick={() => setRevertTarget(item)}
                        className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Revert to previous state"
                      >
                        <Undo2 size={14} />
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 text-gray-400">
                        <RotateCcw size={9} />
                        Reverted
                      </span>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete log entry"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Changes */}
                <div className="px-4 pb-3 flex-1">
                  <div className="divide-y divide-gray-100">
                    {previewChanges.map((change: UndoFieldChange, idx: number) => (
                      <ChangeItem key={idx} change={change} />
                    ))}

                    {isExpanded && item.changes.slice(PREVIEW_COUNT).map((change: UndoFieldChange, idx: number) => (
                      <ChangeItem key={`exp-${idx}`} change={change} />
                    ))}
                  </div>

                  {remainingCount > 0 && (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="flex items-center gap-1 mt-1.5 text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp size={12} />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown size={12} />
                          +{remainingCount} more
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Reverted by footer */}
                {isReverted && item.reverter && (
                  <div className="px-4 py-2 border-t border-gray-100 text-[11px] text-gray-400">
                    Reverted by {item.reverter.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {logs.last_page > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={logs.current_page}
            lastPage={logs.last_page}
            perPage={logs.per_page}
            total={logs.total}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Revert Confirmation */}
      <ConfirmDialog
        open={!!revertTarget}
        title="Revert Changes"
        message={`This will restore ${sectionLabels[revertTarget?.model_type ?? ''] || 'this section'} to its previous state (${revertTarget?.changes.length || 0} field${(revertTarget?.changes.length || 0) === 1 ? '' : 's'}).`}
        confirmLabel="Revert"
        variant="warning"
        loading={reverting}
        onConfirm={handleRevert}
        onCancel={() => setRevertTarget(null)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Log Entry"
        message="This will permanently delete this change log entry. This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
