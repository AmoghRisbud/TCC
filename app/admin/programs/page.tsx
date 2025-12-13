import Link from 'next/link';
import SectionHeading from '../../components/SectionHeading';
import { getPrograms } from '../../../lib/content';

export const metadata = { title: 'Manage Programs | Admin | TCC' };

export default function AdminProgramsPage() {
  const programs = getPrograms();
  
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
            <h1 className="h1 mb-6">Manage Programs</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Add, edit, or remove programs available to students.
            </p>
          </div>
        </div>
      </section>

      {/* Programs List */}
      <section className="section bg-brand-light">
        <div className="container">
          <SectionHeading 
            title="All Programs" 
            subtitle="Manage your programs from here. Click on a program to edit its details."
          />
          
          {/* Add New Program Button */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-brand-primary/10 rounded-lg border-2 border-dashed border-brand-primary/30 text-brand-primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Add New Program</span>
              <span className="text-sm text-brand-muted">(Coming Soon)</span>
            </div>
          </div>

          {programs.length > 0 ? (
            <div className="grid gap-4">
              {programs.map(program => (
                <article 
                  key={program.slug}
                  className="card hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="h3 text-brand-dark mb-1">{program.title}</h3>
                          <p className="text-brand-muted text-sm mb-2">{program.shortDescription}</p>
                          <div className="flex flex-wrap gap-2">
                            {program.status && (
                              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                program.status === 'active' ? 'bg-green-100 text-green-700' : 
                                program.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {program.status}
                              </span>
                            )}
                            {program.featured && (
                              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                Featured
                              </span>
                            )}
                            {program.category && (
                              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                {program.category}
                              </span>
                            )}
                            {program.mode && (
                              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                {program.mode}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Link 
                            href={`/programs/${program.slug}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-brand-primary/10 text-brand-primary rounded-lg hover:bg-brand-primary/20 transition-colors"
                            title="View program"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </Link>
                          <button 
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors cursor-not-allowed opacity-60"
                            title="Edit program (Coming Soon)"
                            disabled
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button 
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors cursor-not-allowed opacity-60"
                            title="Delete program (Coming Soon)"
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-brand-muted text-lg mb-4">No programs have been added yet.</p>
              <p className="text-brand-muted">Add your first program to get started.</p>
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
            <h2 className="h2 mb-6 text-brand-dark">How to Manage Programs</h2>
            <p className="text-xl text-brand-muted mb-8">
              Programs are stored as Markdown files in the <code className="bg-gray-100 px-2 py-1 rounded">content/programs/</code> directory.
              Each file represents a program with frontmatter metadata and optional content.
            </p>
            <div className="text-left bg-gray-50 rounded-lg p-6 mb-8">
              <p className="font-medium text-brand-dark mb-3">To add or edit a program:</p>
              <ol className="list-decimal list-inside space-y-2 text-brand-muted">
                <li>Navigate to <code className="bg-gray-200 px-1 rounded">content/programs/</code> in your repository</li>
                <li>Create a new <code className="bg-gray-200 px-1 rounded">.md</code> file or edit an existing one</li>
                <li>Add frontmatter with title, shortDescription, and other metadata</li>
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
