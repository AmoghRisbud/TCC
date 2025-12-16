import Image from 'next/image';
import SectionHeading from '../components/SectionHeading';
import { getGallery } from '../../lib/content';

export const metadata = { title: 'Media | TCC' };

export default async function MediaPage() {
  const items = await getGallery();

  return (
    <div>
      {/* Hero Section */}
      <section className="section bg-brand-hero text-white from-brand-primary to-brand-accent">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="h1 mb-6">In Pictures</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Explore moments from our events, workshops, and community gatherings.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section bg-brand-light">
        <div className="container">
          <SectionHeading
            title="Our Gallery"
            subtitle="A glimpse into our journey and activities"
          />

          {items.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
              {items.map(i => (
                <div
                  key={i.id}
                  className="card group cursor-pointer overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
                    <Image
                      src={i.image}
                      alt={i.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Subtle overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-brand-dark mb-1 group-hover:text-brand-primary transition-colors">
                    {i.title}
                  </h3>

                  {/* Description (optional) */}
                  {i.description && (
                    <p className="text-sm text-brand-muted">
                      {i.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-brand-primary/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-brand-primary/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="h3 mb-4 text-brand-dark">Gallery Coming Soon</h3>
              <p className="text-brand-muted max-w-md mx-auto">
                We&apos;re curating our best moments. Check back soon for photos
                from our events and workshops.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
