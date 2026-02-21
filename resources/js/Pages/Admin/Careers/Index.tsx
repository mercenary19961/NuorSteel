import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/Admin/StatusBadge';
import Pagination from '@/Components/Admin/Pagination';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';
import { Plus, Pencil, Trash2, Eye, MapPin, Clock, Calendar, Users, X, FileText, Briefcase } from 'lucide-react';
import CustomSelect from '@/Components/Admin/CustomSelect';
import UndoButton from '@/Components/Admin/UndoButton';
import type { CareerListing, CareerApplication, PaginatedData, UndoMeta } from '@/types';

interface Props {
  listings: PaginatedData<CareerListing>;
  filters: { status?: string };
  undoMeta?: UndoMeta | null;
  undoModelId?: string | null;
}

interface ShowData {
  listing: CareerListing;
  applications: Pick<CareerApplication, 'id' | 'name' | 'email' | 'phone' | 'job_title' | 'status' | 'created_at'>[];
}

function getExpiryLabel(expiresAt: string | null): { text: string; className: string } | null {
  if (!expiresAt) return null;
  const expiry = new Date(expiresAt);
  const now = new Date();
  if (expiry < now) return { text: 'Expired', className: 'text-red-600' };
  const thirtyDays = new Date();
  thirtyDays.setDate(thirtyDays.getDate() + 30);
  if (expiry <= thirtyDays) return { text: `Expires ${expiry.toLocaleDateString()}`, className: 'text-yellow-600' };
  return { text: `Expires ${expiry.toLocaleDateString()}`, className: 'text-gray-400' };
}

export default function CareersIndex({ listings, filters, undoMeta, undoModelId }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<CareerListing | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showData, setShowData] = useState<ShowData | null>(null);
  const [showLoading, setShowLoading] = useState(false);

  const handleFilterChange = (newFilters: Record<string, string>) => {
    router.get('/admin/careers', {
      ...filters,
      ...newFilters,
      page: 1,
    }, { preserveState: true, preserveScroll: true });
  };

  const handlePageChange = (page: number) => {
    router.get('/admin/careers', { ...filters, page }, { preserveState: true, preserveScroll: true });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    router.delete(`/admin/careers/${deleteTarget.id}`, {
      preserveScroll: true,
      onStart: () => setDeleting(true),
      onFinish: () => setDeleting(false),
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const handleShow = async (id: number) => {
    setShowLoading(true);
    try {
      const response = await fetch(`/admin/careers/${id}`, {
        headers: { 'Accept': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        setShowData(data);
      }
    } finally {
      setShowLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Head title="Career Listings" />
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Career Listings</h1>
          <div className="flex items-center gap-2">
            {undoMeta && undoModelId && (
              <UndoButton modelType="career" modelId={undoModelId} undoMeta={undoMeta} />
            )}
            <Link
              href="/admin/careers/create"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Plus size={16} />
              Add Listing
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-4">
          <CustomSelect
            value={filters.status ?? ''}
            onChange={(val) => handleFilterChange({ status: val })}
            placeholder="All Status"
            options={[
              { value: '', label: 'All Status' },
              { value: 'draft', label: 'Draft' },
              { value: 'open', label: 'Open' },
              { value: 'closed', label: 'Closed' },
            ]}
            className="w-36"
          />

          <span className="text-sm text-gray-500 ml-auto">{listings.total} listings</span>
        </div>

        {/* Cards */}
        {listings.data.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 px-6 py-12 text-center">
            <Briefcase size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 mb-1">No career listings found.</p>
            <p className="text-sm text-gray-400">Click "Add Listing" to create your first job posting.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listings.data.map((item) => {
              const expiryInfo = getExpiryLabel(item.expires_at);
              const appCount = item.applications_count ?? 0;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all overflow-hidden flex flex-col"
                >
                  {/* Status color band */}
                  <div className={`h-1.5 ${
                    item.status === 'open' ? 'bg-green-500' :
                    item.status === 'draft' ? 'bg-yellow-400' :
                    'bg-gray-300'
                  }`} />

                  <div className="p-4 flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-base truncate">{item.title_en}</h3>
                        <p className="text-sm text-gray-500 truncate" dir="rtl">{item.title_ar}</p>
                      </div>
                      <StatusBadge status={item.status} size="sm" />
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {item.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1 capitalize">
                        <Clock size={12} />
                        {item.employment_type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {appCount} {appCount === 1 ? 'applicant' : 'applicants'}
                      </span>
                    </div>

                    {/* Expiry */}
                    {expiryInfo && (
                      <div className="mb-3">
                        <span className={`text-xs font-medium ${expiryInfo.className}`}>
                          <Calendar size={11} className="inline mr-1" />
                          {expiryInfo.text}
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleShow(item.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
                      >
                        <Eye size={13} />
                        View Details
                      </button>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/careers/${item.id}/edit`}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {listings.last_page > 1 && (
          <div className="mt-4">
            <Pagination
              currentPage={listings.current_page}
              lastPage={listings.last_page}
              perPage={listings.per_page}
              total={listings.total}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Delete Confirmation */}
        <ConfirmDialog
          open={!!deleteTarget}
          title="Delete Listing"
          message={`Are you sure you want to delete "${deleteTarget?.title_en}"? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />

        {/* Detail Modal */}
        {(showData || showLoading) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => { setShowData(null); setShowLoading(false); }}
            />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">
              {showLoading && !showData ? (
                <div className="p-12 text-center text-gray-400">Loading...</div>
              ) : showData && (
                <>
                  {/* Header */}
                  <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200 shrink-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-lg font-semibold text-gray-900 truncate">
                          {showData.listing.title_en}
                        </h2>
                        <StatusBadge status={showData.listing.status} size="sm" />
                      </div>
                      <p className="text-sm text-gray-500 truncate" dir="rtl">
                        {showData.listing.title_ar}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowData(null)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ml-4 shrink-0"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Scrollable content */}
                  <div className="overflow-y-auto flex-1 px-6 py-4 space-y-5">
                    {/* Job Info Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Location</p>
                        <p className="text-sm text-gray-700">{showData.listing.location || '—'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Type</p>
                        <p className="text-sm text-gray-700 capitalize">{showData.listing.employment_type}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Expires</p>
                        <p className="text-sm text-gray-700">
                          {showData.listing.expires_at
                            ? new Date(showData.listing.expires_at).toLocaleDateString()
                            : 'No expiry'}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Created</p>
                        <p className="text-sm text-gray-700">
                          {new Date(showData.listing.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Description (EN)</h3>
                      <p className="text-sm text-gray-600 whitespace-pre-line bg-gray-50 rounded-lg p-3">
                        {showData.listing.description_en}
                      </p>
                    </div>
                    {showData.listing.description_ar && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Description (AR)</h3>
                        <p className="text-sm text-gray-600 whitespace-pre-line bg-gray-50 rounded-lg p-3" dir="rtl">
                          {showData.listing.description_ar}
                        </p>
                      </div>
                    )}

                    {/* Requirements */}
                    {showData.listing.requirements_en && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Requirements (EN)</h3>
                        <p className="text-sm text-gray-600 whitespace-pre-line bg-gray-50 rounded-lg p-3">
                          {showData.listing.requirements_en}
                        </p>
                      </div>
                    )}
                    {showData.listing.requirements_ar && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Requirements (AR)</h3>
                        <p className="text-sm text-gray-600 whitespace-pre-line bg-gray-50 rounded-lg p-3" dir="rtl">
                          {showData.listing.requirements_ar}
                        </p>
                      </div>
                    )}

                    {/* Applications */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Users size={14} />
                        Applications ({showData.applications.length})
                      </h3>
                      {showData.applications.length === 0 ? (
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <FileText size={24} className="mx-auto text-gray-300 mb-2" />
                          <p className="text-sm text-gray-400">No applications yet.</p>
                        </div>
                      ) : (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-50 text-left">
                                <th className="px-3 py-2 font-medium text-gray-500 text-xs">Applicant</th>
                                <th className="px-3 py-2 font-medium text-gray-500 text-xs">Contact</th>
                                <th className="px-3 py-2 font-medium text-gray-500 text-xs">Status</th>
                                <th className="px-3 py-2 font-medium text-gray-500 text-xs">Applied</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {showData.applications.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50">
                                  <td className="px-3 py-2.5">
                                    <p className="font-medium text-gray-900">{app.name}</p>
                                    <p className="text-xs text-gray-400">{app.job_title}</p>
                                  </td>
                                  <td className="px-3 py-2.5">
                                    <p className="text-gray-600">{app.email}</p>
                                    <p className="text-xs text-gray-400">{app.phone}</p>
                                  </td>
                                  <td className="px-3 py-2.5">
                                    <StatusBadge status={app.status} size="sm" />
                                  </td>
                                  <td className="px-3 py-2.5 text-gray-500 text-xs">
                                    {new Date(app.created_at).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-gray-200 shrink-0 bg-gray-50">
                    <Link
                      href={`/admin/careers/${showData.listing.id}/edit`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      <Pencil size={14} />
                      Edit Listing
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
