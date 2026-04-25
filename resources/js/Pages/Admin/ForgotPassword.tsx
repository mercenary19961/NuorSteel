import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, ArrowLeft } from 'lucide-react';

interface Props {
  status?: string;
}

export default function ForgotPassword({ status }: Props) {
  const { data, setData, post, processing, errors, wasSuccessful } = useForm({
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/forgot-password');
  };

  return (
    <>
      <Head title="Forgot Password" />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Forgot your password?</h1>
              <p className="text-sm text-gray-500 mt-2">
                Enter your email and we'll send you a link to reset it.
              </p>
            </div>

            {(status || wasSuccessful) && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  {status || 'If an account exists for that email, a reset link has been sent.'}
                </p>
              </div>
            )}

            {errors.email && !wasSuccessful && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{errors.email}</p>
              </div>
            )}

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

              <button
                type="submit"
                disabled={processing}
                className="w-full py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {processing ? 'Sending...' : 'Send reset link'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={14} />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
