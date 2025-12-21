export default function Loading() {
  return (
    <div>
      {/* Hero Section Skeleton */}
      <section className="section bg-brand-hero from-brand-primary to-brand-accent text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="h-8 w-32 bg-white/20 rounded-full mx-auto mb-4 animate-pulse" />
            <div className="h-12 bg-white/20 rounded-lg mb-4 animate-pulse" />
            <div className="h-6 w-48 bg-white/20 rounded mx-auto animate-pulse" />
          </div>
        </div>
      </section>

      {/* Content Section Skeleton */}
      <section className="section bg-brand-light">
        <div className="container max-w-4xl">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="w-full h-[400px] bg-gray-200 animate-pulse" />
            <div className="p-8 md:p-12 space-y-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-5/6 animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
