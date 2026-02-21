import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/Admin/StatusBadge';
import Pagination from '@/Components/Admin/Pagination';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';
import { Plus, Pencil, Trash2, FileText, Eye, Download, AlertTriangle, X, ArrowLeft, Leaf, Award, Scale } from 'lucide-react';
import UndoButton from '@/Components/Admin/UndoButton';
import type { Certificate, PaginatedData, UndoMeta } from '@/types';

const CATEGORIES = [
  { key: 'esg', label: 'ESG', description: 'Sustainability & Environmental', icon: Leaf },
  { key: 'quality', label: 'Quality', description: 'Standards & Compliance', icon: Award },
  { key: 'governance', label: 'Governance', description: 'Policies & Code of Conduct', icon: Scale },
] as const;

function getExpiryStatus(expiryDate: string | null): 'valid' | 'expiring' | 'expired' | null {
  if (!expiryDate) return null;
  const now = new Date();
  const expiry = new Date(expiryDate);
  if (expiry < now) return 'expired';
  const thirtyDays = new Date();
  thirtyDays.setDate(thirtyDays.getDate() + 30);
  if (expiry <= thirtyDays) return 'expiring';
  return 'valid';
}

interface Props {
  certificates: PaginatedData<Certificate>;
  filters: { category?: string; active?: string };
  categoryCounts: Record<string, number>;
  undoMeta?: UndoMeta | null;
  undoModelId?: string | null;
}

export default function CertificatesIndex({ certificates, filters, categoryCounts, undoMeta, undoModelId }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<Certificate | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [viewingPdf, setViewingPdf] = useState<Certificate | null>(null);

  const insideCategory = !!filters.category;
  const activeCategory = CATEGORIES.find((c) => c.key === filters.category);

  const enterCategory = (category: string) => {
    router.get('/admin/certificates', { category }, { preserveState: false });
  };

  const goBack = () => {
    router.get('/admin/certificates', {}, { preserveState: false });
  };

  const handlePageChange = (page: number) => {
    router.get('/admin/certificates', { ...filters, page }, { preserveState: true, preserveScroll: true });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    router.delete(`/admin/certificates/${deleteTarget.id}`, {
      preserveScroll: true,
      onStart: () => setDeleting(true),
      onFinish: () => setDeleting(false),
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const totalCerts = Object.values(categoryCounts).reduce((sum, n) => sum + n, 0);

  return (
    <AdminLayout>
      <Head title="Certificates" />
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {insideCategory && (
              <button
                onClick={goBack}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
              {insideCategory && activeCategory && (
                <p className="text-sm text-gray-500 mt-0.5">
                  <button onClick={goBack} className="hover:text-primary transition-colors">
                    Certificates
                  </button>
                  {' / '}
                  <span className="text-gray-700 font-medium">{activeCategory.label}</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {undoMeta && undoModelId && (
              <UndoButton modelType="certificate" modelId={undoModelId} undoMeta={undoMeta} />
            )}
            <Link
              href="/admin/certificates/create"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Plus size={16} />
              Add Certificate
            </Link>
          </div>
        </div>

        {/* Top Level — Category Cards */}
        {!insideCategory ? (
          totalCerts === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <FileText size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 mb-1">No certificates yet.</p>
              <p className="text-sm text-gray-400">Click "Add Certificate" to upload your first certificate.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const count = categoryCounts[cat.key] ?? 0;
                return (
                  <button
                    key={cat.key}
                    onClick={() => enterCategory(cat.key)}
                    className="group bg-white rounded-xl border border-gray-200 p-6 text-left hover:shadow-md hover:border-primary/30 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon size={24} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{cat.label}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{cat.description}</p>
                    <p className="text-sm text-gray-400 mt-3">
                      {count} {count === 1 ? 'certificate' : 'certificates'}
                    </p>
                  </button>
                );
              })}
            </div>
          )
        ) : (
          <>
            {/* Inside Category — Certificate Cards */}
            <div className="flex items-center mb-4">
              <span className="text-sm text-gray-500 ml-auto">
                {certificates.total} {certificates.total === 1 ? 'certificate' : 'certificates'}
              </span>
            </div>

            {certificates.data.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <FileText size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 mb-1">No certificates in this category.</p>
                <p className="text-sm text-gray-400">Click "Add Certificate" to add one.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.data.map((item) => {
                  const thumbnailUrl = item.thumbnail?.url;
                  const expiryStatus = getExpiryStatus(item.expiry_date);

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all overflow-hidden flex flex-col"
                    >
                      {/* Category color band */}
                      <div className="h-1.5 bg-primary" />

                      <div className="flex flex-1">
                        {/* Thumbnail / Placeholder */}
                        <div className="w-36 shrink-0 bg-gray-50 flex items-center justify-center border-r border-gray-100">
                          {thumbnailUrl ? (
                            <img
                              src={thumbnailUrl}
                              alt={item.title_en}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-2 p-4 text-gray-300">
                              <FileText size={36} />
                              <span className="text-[10px] font-medium uppercase tracking-wider">PDF</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4 flex flex-col min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-gray-900 text-base truncate">
                                {item.title_en}
                              </h3>
                              <p className="text-sm text-gray-500 truncate" dir="rtl">
                                {item.title_ar}
                              </p>
                            </div>
                            <StatusBadge
                              status={item.is_active ? 'active' : 'inactive'}
                              size="sm"
                            />
                          </div>

                          {/* Expiry badges */}
                          {(expiryStatus === 'expired' || expiryStatus === 'expiring') && (
                            <div className="flex items-center gap-2 mt-2">
                              {expiryStatus === 'expired' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full bg-red-100 text-red-700">
                                  <AlertTriangle size={10} /> Expired
                                </span>
                              )}
                              {expiryStatus === 'expiring' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full bg-yellow-100 text-yellow-700">
                                  <AlertTriangle size={10} /> Expiring Soon
                                </span>
                              )}
                            </div>
                          )}

                          {/* Dates */}
                          <div className="flex items-center gap-4 mt-auto pt-3 text-xs text-gray-400">
                            {item.issue_date && (
                              <span>Issued: {new Date(item.issue_date).toLocaleDateString()}</span>
                            )}
                            {item.expiry_date && (
                              <span>Expires: {new Date(item.expiry_date).toLocaleDateString()}</span>
                            )}
                            {!item.issue_date && !item.expiry_date && (
                              <span>No dates set</span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <button
                              onClick={() => setViewingPdf(item)}
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
                            >
                              <Eye size={13} />
                              View PDF
                            </button>
                            <div className="flex items-center gap-1">
                              <Link
                                href={`/admin/certificates/${item.id}/edit`}
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
                    </div>
                  );
                })}
              </div>
            )}

            {certificates.last_page > 1 && (
              <div className="mt-4">
                <Pagination
                  currentPage={certificates.current_page}
                  lastPage={certificates.last_page}
                  perPage={certificates.per_page}
                  total={certificates.total}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation */}
        <ConfirmDialog
          open={!!deleteTarget}
          title="Delete Certificate"
          message={`Are you sure you want to delete "${deleteTarget?.title_en}"? This will also remove the uploaded PDF file.`}
          confirmLabel="Delete"
          variant="danger"
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />

        {/* PDF Viewer Modal */}
        {viewingPdf && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setViewingPdf(null)}
            />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl mx-4 h-[90vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 shrink-0">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {viewingPdf.title_en}
                  </h3>
                  <p className="text-xs text-gray-500 truncate" dir="rtl">
                    {viewingPdf.title_ar}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <a
                    href={`/admin/certificates/${viewingPdf.id}/file`}
                    download
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Download size={13} />
                    Download
                  </a>
                  <button
                    onClick={() => setViewingPdf(null)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* PDF iframe */}
              <div className="flex-1 bg-gray-100">
                <iframe
                  src={`/admin/certificates/${viewingPdf.id}/file`}
                  className="w-full h-full border-0"
                  title={viewingPdf.title_en}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
