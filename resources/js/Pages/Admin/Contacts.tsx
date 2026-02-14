import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable, { type Column } from '@/Components/Admin/DataTable';
import StatusBadge from '@/Components/Admin/StatusBadge';
import Pagination from '@/Components/Admin/Pagination';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';
import { Eye, Archive, ArchiveRestore, Trash2, Download, X, Mail } from 'lucide-react';
import CustomSelect from '@/Components/Admin/CustomSelect';
import UndoButton from '@/Components/Admin/UndoButton';
import type { PaginatedData, ContactSubmission, UndoMeta } from '@/types';

const TYPE_LABELS: Record<string, string> = {
  vendor: 'Vendor Registration',
  partnership: 'Partnerships',
  careers: 'Careers',
  sustainability: 'Sustainability',
  general: 'General Enquiry',
  quotation: 'Quotation',
};

interface Props {
  submissions: PaginatedData<ContactSubmission>;
  stats: {
    total: number;
    unread: number;
    by_type: Record<string, number>;
  };
  filters: {
    request_type?: string;
    is_read?: string;
    archived?: string;
  };
  undoMeta?: UndoMeta | null;
  undoModelId?: string | null;
}

export default function Contacts({ submissions, filters, undoMeta, undoModelId }: Props) {
  const [viewItem, setViewItem] = useState<ContactSubmission | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactSubmission | null>(null);
  const [deleting, setDeleting] = useState(false);

  const requestType = filters.request_type ?? '';
  const readFilter = filters.is_read ?? '';
  const showArchived = filters.archived === '1' || filters.archived === 'true';

  const applyFilters = (overrides: Record<string, string | undefined>) => {
    const params: Record<string, string | undefined> = {
      request_type: requestType || undefined,
      is_read: readFilter || undefined,
      archived: showArchived ? '1' : undefined,
      ...overrides,
    };

    // Clean out undefined/empty values
    const cleanParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, val]) => {
      if (val) cleanParams[key] = val;
    });

    router.get('/admin/contacts', cleanParams, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleMarkRead = (id: number) => {
    router.post(`/admin/contacts/${id}/read`, {}, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  const handleArchive = (id: number) => {
    router.post(`/admin/contacts/${id}/archive`, {}, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        if (viewItem?.id === id) setViewItem(null);
      },
    });
  };

  const handleUnarchive = (id: number) => {
    router.post(`/admin/contacts/${id}/unarchive`, {}, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setDeleting(true);
    router.delete(`/admin/contacts/${deleteTarget.id}`, {
      preserveScroll: true,
      onSuccess: () => setDeleteTarget(null),
      onFinish: () => setDeleting(false),
    });
  };

  const openView = (item: ContactSubmission) => {
    setViewItem(item);
    if (!item.is_read) {
      handleMarkRead(item.id);
    }
  };

  const handlePageChange = (page: number) => {
    const params: Record<string, string | undefined> = {
      request_type: requestType || undefined,
      is_read: readFilter || undefined,
      archived: showArchived ? '1' : undefined,
    };
    const cleanParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, val]) => {
      if (val) cleanParams[key] = val;
    });

    router.get(
      window.location.pathname,
      { ...cleanParams, page },
      { preserveState: true, preserveScroll: true },
    );
  };

  const columns: Column<ContactSubmission>[] = [
    {
      key: 'name',
      label: 'From',
      render: (item) => (
        <div className="flex items-center gap-2">
          {!item.is_read && (
            <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
          )}
          <div>
            <p className={`text-sm ${item.is_read ? 'text-gray-700' : 'font-semibold text-gray-900'}`}>
              {item.name}
            </p>
            <p className="text-xs text-gray-500">{item.company}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (item) => (
        <p className={`text-sm truncate max-w-50 ${item.is_read ? 'text-gray-600' : 'font-medium text-gray-900'}`}>
          {item.subject}
        </p>
      ),
    },
    {
      key: 'request_type',
      label: 'Type',
      render: (item) => <StatusBadge status={item.request_type} size="sm" />,
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (item) => (
        <span className="text-sm text-gray-500">{item.created_at}</span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Head title="Contact Submissions" />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contact Submissions</h1>
        {undoMeta && undoModelId && (
          <UndoButton modelType="contact" modelId={undoModelId} undoMeta={undoMeta} />
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <CustomSelect
          value={requestType}
          onChange={(val) => applyFilters({ request_type: val || undefined })}
          placeholder="All Types"
          options={[
            { value: '', label: 'All Types' },
            ...Object.entries(TYPE_LABELS).map(([key, label]) => ({ value: key, label })),
          ]}
          className="w-48"
        />

        <CustomSelect
          value={readFilter}
          onChange={(val) => applyFilters({ is_read: val || undefined })}
          placeholder="All"
          options={[
            { value: '', label: 'All' },
            { value: 'false', label: 'Unread' },
            { value: 'true', label: 'Read' },
          ]}
          className="w-32"
        />

        <button
          onClick={() => applyFilters({ archived: showArchived ? undefined : '1' })}
          className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
            showArchived
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {showArchived ? 'Showing Archived' : 'Show Archived'}
        </button>

        <span className="text-sm text-gray-500 ml-auto">
          {submissions.total} submissions
        </span>
      </div>

      <DataTable
        columns={columns}
        data={submissions.data}
        emptyMessage="No contact submissions found."
        actions={(item) => (
          <>
            <button
              onClick={() => openView(item)}
              className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
              <Eye size={16} />
            </button>
            {showArchived ? (
              <button
                onClick={() => handleUnarchive(item.id)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <ArchiveRestore size={16} />
              </button>
            ) : (
              <button
                onClick={() => handleArchive(item.id)}
                className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
              >
                <Archive size={16} />
              </button>
            )}
            <button
              onClick={() => setDeleteTarget(item)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      />

      {submissions.last_page > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={submissions.current_page}
            lastPage={submissions.last_page}
            perPage={submissions.per_page}
            total={submissions.total}
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
              <h2 className="text-lg font-semibold text-gray-900">Contact Details</h2>
              <button onClick={() => setViewItem(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-900">{viewItem.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Company</p>
                  <p className="text-sm text-gray-700">{viewItem.company}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <a href={`mailto:${viewItem.email}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                    <Mail size={12} />
                    {viewItem.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm text-gray-700">{viewItem.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Country</p>
                  <p className="text-sm text-gray-700">{viewItem.country}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Request Type</p>
                  <p className="text-sm text-gray-700">{TYPE_LABELS[viewItem.request_type] || viewItem.request_type}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">Subject</p>
                <p className="text-sm font-medium text-gray-900">{viewItem.subject}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Message</p>
                <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                  {viewItem.message}
                </div>
              </div>

              {viewItem.file_path && (
                <a
                  href={`/admin/contacts/${viewItem.id}/file`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 w-fit"
                >
                  <Download size={16} />
                  Download Attachment
                </a>
              )}

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                {!viewItem.is_archived && (
                  <button
                    onClick={() => handleArchive(viewItem.id)}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Archive size={14} />
                    Archive
                  </button>
                )}
                <button
                  onClick={() => { setDeleteTarget(viewItem); setViewItem(null); }}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Submission"
        message={`Are you sure you want to delete the submission from "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
