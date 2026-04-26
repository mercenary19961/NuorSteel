import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Lock, Mail } from 'lucide-react';
import { useRef } from 'react';
import Turnstile, { type TurnstileHandle } from '@/Components/Public/Turnstile';
import PasswordInput from '@/Components/ui/PasswordInput';
import type { PageProps } from '@/types';

export default function Login() {
  const turnstileRef = useRef<TurnstileHandle>(null);
  const { flash, turnstileSiteKey } = usePage<PageProps>().props;
  const status = (flash as Record<string, string | undefined>)?.status;
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    'cf-turnstile-response': '',
  });

  const turnstileError = (errors as Record<string, string>)['cf-turnstile-response'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/login', {
      onError: () => turnstileRef.current?.reset(),
    });
  };

  return (
    <>
      <Head title="Login" />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Nuor Steel</h1>
              <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
            </div>

            {/* Status banner — e.g. "Your password has been reset" */}
            {status && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">{status}</p>
              </div>
            )}

            {/* Error */}
            {(errors.email || errors.password || turnstileError) && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  {errors.email || errors.password || turnstileError}
                </p>
                {errors.password && (
                  <Link
                    href="/forgot-password"
                    className="inline-block mt-2 text-xs font-medium text-red-700 underline hover:text-red-900"
                  >
                    Forgot your password? Reset it here →
                  </Link>
                )}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="admin@nuorsteel.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  leftIcon={<Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <Turnstile
                ref={turnstileRef}
                theme="light"
                onVerify={(token) => setData('cf-turnstile-response', token)}
              />

              <button
                type="submit"
                disabled={processing || (!!turnstileSiteKey && !data['cf-turnstile-response'])}
                className="w-full py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {processing ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
