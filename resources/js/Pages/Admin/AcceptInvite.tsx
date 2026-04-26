import { Head, useForm } from '@inertiajs/react';
import { Lock, User as UserIcon } from 'lucide-react';
import PasswordInput from '@/Components/ui/PasswordInput';

interface Props {
  user: {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'editor';
  };
  signedQuery: string;
}

export default function AcceptInvite({ user, signedQuery }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Preserve the signed query string so the POST passes the signature middleware.
    const url = `/admin/invite/${user.id}/accept${signedQuery ? `?${signedQuery}` : ''}`;
    post(url);
  };

  return (
    <>
      <Head title="Accept Invite" />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <UserIcon size={20} className="text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
              <p className="text-sm text-gray-500 mt-2">
                Set a password to activate your <span className="font-medium text-gray-900">{user.role}</span> account.
              </p>
              <p className="text-xs text-gray-400 mt-1">{user.email}</p>
            </div>

            {errors.password && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{errors.password}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
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
              </div>

              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm password
                </label>
                <PasswordInput
                  id="password_confirmation"
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  required
                  autoComplete="new-password"
                  minLength={8}
                  placeholder="Re-enter your password"
                  leftIcon={<Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {processing ? 'Activating...' : 'Activate account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
