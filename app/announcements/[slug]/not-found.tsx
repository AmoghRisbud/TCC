import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      {/* Hero Section */}
      <section className="section bg-brand-hero from-brand-primary to-brand-accent text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="h1 mb-4">Announcement Not Found</h1>
            <p className="text-xl text-white/80">
              The announcement you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section bg-brand-light">
        <div className="container max-w-2xl text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-brand-dark mb-4">
              404 - Not Found
            </h2>
            <p className="text-brand-muted mb-8">
              This announcement may have been removed or the link may be incorrect.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/announcements"
                className="btn"
              >
                View All Announcements
              </Link>
              <Link
                href="/"
                className="btn-secondary"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
