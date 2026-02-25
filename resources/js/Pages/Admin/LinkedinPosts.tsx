import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Admin/Pagination';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';
import UndoButton from '@/Components/Admin/UndoButton';
import { Linkedin, Plus, ToggleLeft, ToggleRight, Trash2, Hash, Eye, EyeOff, ExternalLink } from 'lucide-react';
import type { LinkedinPost, PaginatedData, UndoMeta } from '@/types';

interface Props {
  posts: PaginatedData<LinkedinPost>;
  stats: { total: number; active: number; hidden: number };
  filters: { active?: string };
  undoMeta?: UndoMeta | null;
  undoModelId?: string | null;
}

export default function LinkedinPosts({ posts, stats, filters, undoMeta, undoModelId }: Props) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [postUrl, setPostUrl] = useState('');
  const [postNote, setPostNote] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<LinkedinPost | null>(null);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePageChange = (page: number) => {
    router.get('/admin/linkedin-posts', { ...filters, page }, { preserveState: true, preserveScroll: true });
  };

  const handleAdd = () => {
    if (!postUrl.trim()) return;
    setErrors({});
    router.post('/admin/linkedin-posts', { post_input: postUrl.trim(), content: postNote.trim() } as any, {
      preserveScroll: true,
      onStart: () => setProcessing(true),
      onFinish: () => setProcessing(false),
      onSuccess: () => {
        setPostUrl('');
        setPostNote('');
        setShowAddModal(false);
      },
      onError: (errs) => setErrors(errs),
    });
  };

  const handleToggle = (id: number) => {
    router.post(`/admin/linkedin-posts/${id}/toggle`, {}, { preserveScroll: true });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    router.delete(`/admin/linkedin-posts/${deleteTarget.id}`, {
      preserveScroll: true,
      onStart: () => setProcessing(true),
      onFinish: () => setProcessing(false),
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const handleFilter = (active?: string) => {
    router.get('/admin/linkedin-posts', active !== undefined ? { active } : {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    <AdminLayout>
      <Head title="LinkedIn Posts" />
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">LinkedIn Posts</h1>
            <p className="text-sm text-gray-500 mt-1">Manage LinkedIn posts displayed on the homepage</p>
          </div>
          <div className="flex items-center gap-2">
            {undoMeta && undoModelId && (
              <UndoButton modelType="linkedin" modelId={undoModelId} undoMeta={undoMeta} />
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90"
            >
              <Plus size={16} />
              Add Post
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => handleFilter()}
            className={`bg-white rounded-xl border p-4 flex items-center gap-4 text-left transition-colors ${
              !filters.active ? 'border-primary ring-1 ring-primary/20' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-[#0A66C2]/10 flex items-center justify-center">
              <Hash size={20} className="text-[#0A66C2]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Posts</p>
            </div>
          </button>
          <button
            onClick={() => handleFilter('1')}
            className={`bg-white rounded-xl border p-4 flex items-center gap-4 text-left transition-colors ${
              filters.active === '1' ? 'border-primary ring-1 ring-primary/20' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Eye size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              <p className="text-sm text-gray-500">Visible</p>
            </div>
          </button>
          <button
            onClick={() => handleFilter('0')}
            className={`bg-white rounded-xl border p-4 flex items-center gap-4 text-left transition-colors ${
              filters.active === '0' ? 'border-primary ring-1 ring-primary/20' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <EyeOff size={20} className="text-gray-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.hidden}</p>
              <p className="text-sm text-gray-500">Hidden</p>
            </div>
          </button>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-xl border border-gray-200">
          {posts.data.length === 0 ? (
            <div className="p-12 text-center">
              <Linkedin size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No LinkedIn posts yet</p>
              <p className="text-sm text-gray-400 mt-1">Add a post by pasting a LinkedIn post URL</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Post</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Added</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.data.map((post) => (
                  <tr key={post.id} className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 ${!post.is_active ? 'opacity-60' : ''}`}>
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded bg-[#0A66C2]/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Linkedin size={16} className="text-[#0A66C2]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate max-w-md">
                            {post.content || post.post_id}
                          </p>
                          <a
                            href={post.post_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#0A66C2] hover:underline inline-flex items-center gap-1 mt-0.5"
                          >
                            View on LinkedIn
                            <ExternalLink size={10} />
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {post.is_active ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(post.posted_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggle(post.id)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                          title={post.is_active ? 'Hide' : 'Show'}
                        >
                          {post.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(post)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {posts.last_page > 1 && (
            <div className="px-4 border-t border-gray-200">
              <Pagination
                currentPage={posts.current_page}
                lastPage={posts.last_page}
                total={posts.total}
                perPage={posts.per_page}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>

        {/* Add Post Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => { setShowAddModal(false); setErrors({}); }} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add LinkedIn Post</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Embed Code</label>
                  <textarea
                    value={postUrl}
                    onChange={(e) => setPostUrl(e.target.value)}
                    placeholder='<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:..." ...></iframe>'
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-mono ${
                      errors.post_input ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.post_input && (
                    <p className="text-sm text-red-600 mt-1">{errors.post_input}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    On LinkedIn: click ••• on the post → "Embed this post" → copy the code and paste it here
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
                  <input
                    type="text"
                    value={postNote}
                    onChange={(e) => setPostNote(e.target.value)}
                    placeholder="Brief description for internal reference"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    maxLength={500}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => { setShowAddModal(false); setErrors({}); }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!postUrl.trim() || processing}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {processing ? 'Adding...' : 'Add Post'}
                </button>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog
          open={!!deleteTarget}
          title="Delete Post"
          message="Are you sure you want to remove this LinkedIn post? It will no longer appear on the homepage."
          confirmLabel="Delete"
          loading={processing}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      </div>
    </AdminLayout>
  );
}
