import { useState } from 'react';
import {
  useContacts,
  useMarkAsRead,
  useArchiveContact,
  useUnarchiveContact,
  useDeleteContact,
} from '../../hooks/useContacts';
import { useToast } from '../../contexts/ToastContext';
import DataTable, { type Column } from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import Pagination from '../../components/admin/Pagination';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { Eye, Archive, ArchiveRestore, Trash2, Download, X, Mail } from 'lucide-react';
import type { ContactSubmission } from '../../types';

const TYPE_LABELS: Record<string, string> = {
  vendor: 'Vendor Registration',
  partnership: 'Partnerships',
  careers: 'Careers',
  sustainability: 'Sustainability',
  general: 'General Enquiry',
  quotation: 'Quotation',
};

export default function ContactsPage() {
  const [page, setPage] = useState(1);
  const [requestType, setRequestType] = useState('');
  const [readFilter, setReadFilter] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const { data, isLoading } = useContacts({
    page,
    request_type: requestType || undefined,
    is_read: readFilter === '' ? undefined : readFilter === 'true',
    archived: showArchived,
  });
  const markReadMutation = useMarkAsRead();
  const archiveMutation = useArchiveContact();
  const unarchiveMutation = useUnarchiveContact();
  const deleteMutation = useDeleteContact();
  const { success, error: showError } = useToast();

  const [viewItem, setViewItem] = useState<ContactSubmission | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactSubmission | null>(null);

  const handleMarkRead = async (id: number) => {
    try {
      await markReadMutation.mutateAsync(id);
      success('Marked as read.');
    } catch {
      showError('Failed to mark as read.');
    }
  };

  const handleArchive = async (id: number) => {
    try {
      await archiveMutation.mutateAsync(id);
      success('Submission archived.');
      if (viewItem?.id === id) setViewItem(null);
    } catch {
      showError('Failed to archive.');
    }
  };

  const handleUnarchive = async (id: number) => {
    try {
      await unarchiveMutation.mutateAsync(id);
      success('Submission unarchived.');
    } catch {
      showError('Failed to unarchive.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      success('Submission deleted.');
      setDeleteTarget(null);
    } catch {
      showError('Failed to delete submission.');
    }
  };

  const openView = (item: ContactSubmission) => {
    setViewItem(item);
    if (!item.is_read) {
      handleMarkRead(item.id);
    }
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
        <p className={`text-sm truncate max-w-[200px] ${item.is_read ? 'text-gray-600' : 'font-medium text-gray-900'}`}>
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contact Submissions</h1>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <select
          value={requestType}
          onChange={(e) => { setRequestType(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="">All Types</option>
          {Object.entries(TYPE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <select
          value={readFilter}
          onChange={(e) => { setReadFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="">All</option>
          <option value="false">Unread</option>
          <option value="true">Read</option>
        </select>

        <button
          onClick={() => { setShowArchived(!showArchived); setPage(1); }}
          className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
            showArchived
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {showArchived ? 'Showing Archived' : 'Show Archived'}
        </button>

        {data?.meta && (
          <span className="text-sm text-gray-500 ml-auto">{data.meta.total} submissions</span>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        loading={isLoading}
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

      {data?.meta && data.meta.last_page > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={data.meta.current_page}
            lastPage={data.meta.last_page}
            perPage={data.meta.per_page}
            total={data.meta.total}
            onPageChange={setPage}
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
                  href={`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/admin/contacts/${viewItem.id}/file`}
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
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
