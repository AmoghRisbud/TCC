import Link from 'next/link';
import Image from 'next/image';
import SectionHeading from '../../components/SectionHeading';
import { getPrograms } from '../../../lib/content';

export const metadata = { title: 'Manage Programs | Admin | TCC' };

export default async function AdminProgramsPage() {
  const programs = await getPrograms();

  return (
    <div>
      {/* Hero Section */}
      <section className="section bg-gradient-to-r from-brand-primary to-brand-accent text-white">
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
            <Link
              href="#"
              className="inline-flex items-center gap-3 px-6 py-3
                         bg-brand-primary text-white rounded-lg
                         shadow-md hover:shadow-lg hover:bg-brand-primary/90
                         transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Add New Program</span>
              <span className="text-sm text-white/80">(Coming Soon)</span>
            </Link>
          </div>

          {programs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map(program => (
                <article
                  key={program.slug}
                  className="card-interactive flex flex-col justify-between p-6
                             bg-gradient-to-br from-[#FAF8F2] via-brand-light to-[#F3EFE3]
                             rounded-lg shadow-md ring-1 ring-black/10
                             hover:shadow-xl hover:ring-brand-secondary/40
                             transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 w-16 h-16 rounded-xl bg-white/80 flex items-center justify-center">
                      {program.logo && (
                        <Image src={program.logo} alt={`${program.title} logo`} width={40} height={40} className="object-contain" />
                      )}
                    </div>
                    <h3 className="h3 mb-2 text-brand-dark">{program.title}</h3>
                    <p className="text-sm text-brand-muted line-clamp-2">{program.shortDescription}</p>
                  </div>

                  <div className="flex flex-col md:flex-row gap-2 mt-4 justify-center w-full">
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-6 bg-brand-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-brand-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <svg className="w-10 h-10 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
