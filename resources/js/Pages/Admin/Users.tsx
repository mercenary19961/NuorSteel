import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmDialog from '@/Components/Admin/ConfirmDialog';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Shield, User as UserIcon } from 'lucide-react';
import CustomSelect from '@/Components/Admin/CustomSelect';
import type { User, PageProps } from '@/types';

interface UserFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'admin' | 'editor';
  is_active: boolean;
}

const emptyForm: UserFormData = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'editor',
  is_active: true,
};

interface Props {
  users: User[];
}

export default function UsersPage({ users }: Props) {
  const currentUser = usePage<PageProps>().props.auth.user;

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserFormData>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [processing, setProcessing] = useState(false);

  const openCreate = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      password_confirmation: '',
      role: user.role,
      is_active: user.is_active,
    });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    if (!editingUser && !form.password) return;
    if (form.password && form.password !== form.password_confirmation) return;

    if (editingUser) {
      const payload: Record<string, string | boolean> = {
        name: form.name,
        email: form.email,
        role: form.role,
        is_active: form.is_active,
      };
      if (form.password) {
        payload.password = form.password;
        payload.password_confirmation = form.password_confirmation;
      }
      router.put(`/admin/users/${editingUser.id}`, payload, {
        preserveScroll: true,
        onStart: () => setProcessing(true),
        onFinish: () => setProcessing(false),
        onSuccess: () => setShowModal(false),
      });
    } else {
      router.post('/admin/users', {
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
        role: form.role,
        is_active: form.is_active,
      }, {
        preserveScroll: true,
        onStart: () => setProcessing(true),
        onFinish: () => setProcessing(false),
        onSuccess: () => setShowModal(false),
      });
    }
  };

  const handleToggle = (user: User) => {
    if (user.id === currentUser?.id) return;
    router.post(`/admin/users/${user.id}/toggle`, {}, { preserveScroll: true });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    router.delete(`/admin/users/${deleteTarget.id}`, {
      preserveScroll: true,
      onStart: () => setProcessing(true),
      onFinish: () => setProcessing(false),
      onSuccess: () => setDeleteTarget(null),
    });
  };

  return (
    <AdminLayout>
      <Head title="Users" />
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-sm text-gray-500 mt-1">Manage admin and editor accounts</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90"
          >
            <Plus size={16} />
            Add User
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          {!users || users.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No users found</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Created</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isSelf = user.id === currentUser?.id;
                  return (
                    <tr key={user.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                            <UserIcon size={18} className="text-gray-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user.name}
                              {isSelf && <span className="text-xs text-primary ml-2">(you)</span>}
                            </p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role === 'admin' && <Shield size={12} />}
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(user)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          {!isSelf && (
                            <>
                              <button
                                onClick={() => handleToggle(user)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                                title={user.is_active ? 'Deactivate' : 'Activate'}
                              >
                                {user.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                              </button>
                              <button
                                onClick={() => setDeleteTarget(user)}
                                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingUser ? 'Edit User' : 'Create User'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password {editingUser && <span className="text-gray-400">(leave blank to keep current)</span>}
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  />
                </div>
                {form.password && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      value={form.password_confirmation}
                      onChange={(e) => setForm((f) => ({ ...f, password_confirmation: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <CustomSelect
                    value={form.role}
                    onChange={(val) => setForm((f) => ({ ...f, role: val as 'admin' | 'editor' }))}
                    disabled={editingUser?.id === currentUser?.id}
                    options={[
                      { value: 'editor', label: 'Editor' },
                      { value: 'admin', label: 'Admin' },
                    ]}
                  />
                  {editingUser?.id === currentUser?.id && (
                    <p className="text-xs text-gray-400 mt-1">You cannot change your own role</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={form.is_active}
                    onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                    disabled={editingUser?.id === currentUser?.id}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={processing}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {processing ? 'Saving...' : editingUser ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog
          open={!!deleteTarget}
          title="Delete User"
          message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          loading={processing}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      </div>
    </AdminLayout>
  );
}
