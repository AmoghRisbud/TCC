'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Error Icon */}
          <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          {/* Error Title */}
          <h1 className="text-2xl font-bold text-brand-dark mb-3">Authentication Error</h1>

          {/* Error Message */}
          <p className="text-brand-muted mb-6">
            {error === 'Configuration' && 'There is a problem with the server configuration.'}
            {error === 'AccessDenied' && 'You do not have permission to sign in.'}
            {error === 'Verification' && 'The verification token has expired or has already been used.'}
            {!['Configuration', 'AccessDenied', 'Verification'].includes(error || '') && 'An error occurred during authentication. Please try again.'}
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="block w-full px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-all duration-200 font-medium"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="block w-full px-6 py-3 border-2 border-gray-200 text-brand-dark rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Go Home
            </Link>
          </div>

          {/* Help */}
          <div className="mt-6">
            <p className="text-sm text-brand-muted">
              Need assistance? <a href="/contact" className="text-brand-primary hover:underline">Contact support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-brand-muted">Loading...</div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
