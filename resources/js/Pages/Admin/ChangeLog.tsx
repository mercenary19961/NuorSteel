import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable, { type Column } from '@/Components/Admin/DataTable';
import Pagination from '@/Components/Admin/Pagination';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';
import { Eye, Undo2, X } from 'lucide-react';
import type { PaginatedData, ChangeLog as ChangeLogType, UndoFieldChange, User } from '@/types';

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
  };
}

export default function ChangeLog({ logs, users, sectionLabels, filters }: Props) {
  const [viewItem, setViewItem] = useState<ChangeLogType | null>(null);
  const [revertTarget, setRevertTarget] = useState<ChangeLogType | null>(null);
  const [reverting, setReverting] = useState(false);

  const modelType = filters.model_type ?? '';
  const changedBy = filters.changed_by ?? '';

  const applyFilters = (overrides: Record<string, string | undefined>) => {
    const params: Record<string, string | undefined> = {
      model_type: modelType || undefined,
      changed_by: changedBy || undefined,
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

  const columns: Column<ChangeLogType>[] = [
    {
      key: 'model_type',
      label: 'Section',
      render: (item) => {
        const colorClass = SECTION_COLORS[item.model_type] || 'bg-gray-100 text-gray-600';
        return (
          <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${colorClass}`}>
            {sectionLabels[item.model_type] || item.model_type}
          </span>
        );
      },
    },
    {
      key: 'changed_by',
      label: 'Changed By',
      render: (item) => (
        <span className="text-sm text-gray-700">{item.user?.name || 'Unknown'}</span>
      ),
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (item) => (
        <span className="text-sm text-gray-500" title={new Date(item.created_at).toLocaleString()}>
          {formatDate(item.created_at)}
        </span>
      ),
    },
    {
      key: 'changes',
      label: 'Changes',
      render: (item) => (
        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
          {item.changes.length} {item.changes.length === 1 ? 'field' : 'fields'}
        </span>
      ),
    },
  ];

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
        <select
          value={modelType}
          onChange={(e) => applyFilters({ model_type: e.target.value || undefined })}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="">All Sections</option>
          {Object.entries(sectionLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <select
          value={changedBy}
          onChange={(e) => applyFilters({ changed_by: e.target.value || undefined })}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="">All Users</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={logs.data}
        emptyMessage="No change history found."
        actions={(item) => (
          <>
            <button
              onClick={() => setViewItem(item)}
              className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
              title="View details"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => setRevertTarget(item)}
              className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              title="Revert to this state"
            >
              <Undo2 size={16} />
            </button>
          </>
        )}
      />

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

      {/* Detail Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewItem(null)} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Change Details</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {sectionLabels[viewItem.model_type] || viewItem.model_type} &middot;{' '}
                  {viewItem.user?.name || 'Unknown'} &middot;{' '}
                  {formatDate(viewItem.created_at)}
                </p>
              </div>
              <button onClick={() => setViewItem(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {viewItem.changes.map((change: UndoFieldChange, idx: number) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 mb-1.5">{change.label}</p>
                    <div className="space-y-1">
                      {change.old ? (
                        <p className="text-sm text-red-600 line-through">{change.old}</p>
                      ) : (
                        <p className="text-sm text-gray-400 italic">(empty)</p>
                      )}
                      {change.new ? (
                        <p className="text-sm text-green-600">{change.new}</p>
                      ) : (
                        <p className="text-sm text-gray-400 italic">(empty)</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setViewItem(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => { setRevertTarget(viewItem); setViewItem(null); }}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100"
                >
                  <Undo2 size={14} />
                  Revert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revert Confirmation */}
      <ConfirmDialog
        open={!!revertTarget}
        title="Revert Changes"
        message={`This will restore ${sectionLabels[revertTarget?.model_type ?? ''] || 'this section'} to its previous state (${revertTarget?.changes.length || 0} field${(revertTarget?.changes.length || 0) === 1 ? '' : 's'}). A new log entry will be created for this revert.`}
        confirmLabel="Revert"
        variant="warning"
        loading={reverting}
        onConfirm={handleRevert}
        onCancel={() => setRevertTarget(null)}
      />
    </AdminLayout>
  );
}
