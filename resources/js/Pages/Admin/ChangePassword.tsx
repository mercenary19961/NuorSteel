import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Lock, AlertTriangle, ArrowLeft } from 'lucide-react';
import PasswordInput from '@/Components/ui/PasswordInput';
import type { PageProps } from '@/types';

interface Props {
  forced: boolean;
}

export default function ChangePassword({ forced }: Props) {
  const { auth, flash } = usePage<PageProps>().props;
  const { data, setData, post, processing, errors, reset } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/change-password', {
      onSuccess: () => reset(),
    });
  };

  return (
    <>
      <Head title="Change Password" />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Lock size={20} className="text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {forced ? 'Set a new password' : 'Change your password'}
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                {auth.user?.email}
              </p>
            </div>

            {forced && (
              <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800">
                  An admin set the password for your account. For security, you need to choose your own before continuing.
                </p>
              </div>
            )}

            {flash.error && !forced && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{flash.error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                  Current password
                </label>
                <PasswordInput
                  id="current_password"
                  value={data.current_password}
                  onChange={(e) => setData('current_password', e.target.value)}
                  required
                  autoComplete="current-password"
                  leftIcon={<Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                {errors.current_password && (
                  <p className="text-xs text-red-600 mt-1">{errors.current_password}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  New password
                </label>
                <PasswordInput
                  id="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  required
                  autoComplete="new-password"
                  minLength={8}
                  placeholder="At least 8 characters"
                  leftIcon={<Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm new password
                </label>
                <PasswordInput
                  id="password_confirmation"
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  required
                  autoComplete="new-password"
                  minLength={8}
                  leftIcon={<Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {processing ? 'Updating...' : 'Update password'}
              </button>
            </form>

            {!forced && (
              <div className="mt-6 text-center">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
