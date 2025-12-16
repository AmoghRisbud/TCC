import Link from 'next/link';
import SectionHeading from '../../components/SectionHeading';
import { getTestimonials } from '../../../lib/content';

export const metadata = { title: 'Manage Testimonials | Admin | TCC' };

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials();
  
  return (
    <div>
      {/* Hero Section */}
      <section className="section bg-brand-hero text-white from-brand-primary to-brand-accent text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <nav className="mb-4">
              <Link href="/admin" className="text-white/70 hover:text-white transition-colors">
                ← Back to Admin Dashboard
              </Link>
            </nav>
            <h1 className="h1 mb-6">Manage Testimonials</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Review, approve, and publish testimonials from students, educators, and partners.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials List */}
      <section className="section bg-brand-light">
        <div className="container">
          <SectionHeading 
            title="All Testimonials" 
            subtitle="Manage testimonials and control which ones are featured on the homepage."
          />
          
          {/* Add New Testimonial Button */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-brand-primary/10 rounded-lg border-2 border-dashed border-brand-primary/30 text-brand-primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Add New Testimonial</span>
              <span className="text-sm text-brand-muted">(Coming Soon)</span>
            </div>
          </div>

          {testimonials.length > 0 ? (
            <div className="grid gap-4">
              {testimonials.map(testimonial => (
                <article 
                  key={testimonial.id}
                  className="card hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-brand-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-brand-primary font-semibold text-xl">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1">
                          {/* Author Info */}
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-brand-dark">{testimonial.name}</h3>
                            {testimonial.featured && (
                              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                Featured
                              </span>
                            )}
                          </div>
                          
                          {/* Role & Organization */}
                          <div className="text-sm text-brand-muted mb-3">
                            {testimonial.role && <span>{testimonial.role}</span>}
                            {testimonial.role && testimonial.organization && <span> at </span>}
                            {testimonial.organization && <span>{testimonial.organization}</span>}
                          </div>
                          
                          {/* Quote */}
                          <p className="text-brand-dark italic mb-3">
                            &ldquo;{testimonial.quote}&rdquo;
                          </p>
                          
                          {/* Metadata */}
                          <div className="flex flex-wrap gap-2">
                            {testimonial.rating && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                                {testimonial.rating}/5
                              </span>
                            )}
                            {testimonial.programRef && (
                              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                {testimonial.programRef}
                              </span>
                            )}
                            {testimonial.date && (
                              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                {testimonial.date}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button 
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors cursor-not-allowed opacity-60"
                            title={testimonial.featured ? "Remove from featured (Coming Soon)" : "Mark as featured (Coming Soon)"}
                            disabled
                          >
                            <svg className="w-4 h-4" fill={testimonial.featured ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            {testimonial.featured ? 'Featured' : 'Feature'}
                          </button>
                          <button 
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors cursor-not-allowed opacity-60"
                            title="Edit testimonial (Coming Soon)"
                            disabled
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button 
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors cursor-not-allowed opacity-60"
                            title="Delete testimonial (Coming Soon)"
                            disabled
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-6 bg-brand-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-brand-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-brand-muted text-lg mb-4">No testimonials have been added yet.</p>
              <p className="text-brand-muted">Add your first testimonial to get started.</p>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-8 bg-brand-secondary/10 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="h2 mb-6 text-brand-dark">How to Manage Testimonials</h2>
            <p className="text-xl text-brand-muted mb-8">
              Testimonials are stored as Markdown files in the <code className="bg-gray-100 px-2 py-1 rounded">content/testimonials/</code> directory.
              Set <code className="bg-gray-100 px-2 py-1 rounded">featured: true</code> to display a testimonial on the homepage.
            </p>
            <div className="text-left bg-gray-50 rounded-lg p-6 mb-8">
              <p className="font-medium text-brand-dark mb-3">To add or edit a testimonial:</p>
              <ol className="list-decimal list-inside space-y-2 text-brand-muted">
                <li>Navigate to <code className="bg-gray-200 px-1 rounded">content/testimonials/</code> in your repository</li>
                <li>Create a new <code className="bg-gray-200 px-1 rounded">.md</code> file or edit an existing one</li>
                <li>Add frontmatter with name, role, quote, and optional metadata</li>
                <li>Set <code className="bg-gray-200 px-1 rounded">featured: true</code> to show on homepage</li>
                <li>Commit and push your changes</li>
              </ol>
            </div>
            <Link href="/admin" className="btn-secondary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
