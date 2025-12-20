'use client';

import React from 'react';

export default function MigrationButton() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<{ success: boolean; message: string; migrated?: any } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleMigrate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/admin/migrate', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Migration failed');
      }

      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-brand-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-brand-dark mb-2">Content Migration</h3>
          <p className="text-brand-muted mb-4">
            Migrate markdown content from <code className="bg-brand-light px-2 py-0.5 rounded text-sm">content/</code> directory to Redis database.
          </p>
          <p className="text-sm text-brand-muted">
            This will migrate: Programs, Research, Testimonials, Gallery, and Careers.
          </p>
        </div>
      </div>

      <button
        onClick={handleMigrate}
        disabled={loading}
        className="btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Migrating...
          </span>
        ) : (
          'Run Migration'
        )}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="font-semibold text-green-800 mb-2">{result.message}</h4>
              {result.migrated && (
                <div className="text-sm text-green-700 space-y-1">
                  <p>✓ Programs: {result.migrated.programs} items</p>
                  <p>✓ Research: {result.migrated.research} items</p>
                  <p>✓ Testimonials: {result.migrated.testimonials} items</p>
                  <p>✓ Gallery: {result.migrated.gallery} items</p>
                  <p>✓ Careers: {result.migrated.careers} items</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className="font-semibold text-red-800 mb-1">Migration Failed</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
