import Link from "next/link";
import SectionHeading from "../components/SectionHeading";
import { getPrograms } from "../../lib/content";
import Image from "next/image";

export const metadata = { title: "Programs | TCC" };

// Force dynamic rendering to always fetch fresh data from Redis
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <div>
      {/* Hero Section */}
      <section className="section bg-brand-hero text-white from-brand-primary to-brand-accent">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="h1 mb-6">Programs You Can Join</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Explore our range of programs designed to enhance your legal
              skills and career prospects.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="section bg-gradient-to-b from-brand-light via-white to-brand-light">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((p) => (
              <Link
                key={p.slug}
                href={`/programs/${p.slug}`}
                className="group block"
              >
                <div
                  className="card-interactive flex flex-col h-full
                            bg-gradient-to-br from-white via-white to-brand-light/40
                            border border-brand-primary/10
                            shadow-sm hover:shadow-xl hover:-translate-y-1
                            transition-all duration-300 overflow-hidden"
                >
                  {/* Logo Image - Full Width */}
                  {p.logo && (
                    <div className="mb-4 overflow-hidden">
                      <Image
                        src={p.logo}
                        alt={`${p.title} logo`}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6 pt-0">
                    {/* Title */}
                    <h3 className="h3 mb-2 group-hover:text-brand-primary transition-colors">
                      {p.title}
                    </h3>

                    {/* Description */}
                    <p className="text-brand-muted text-sm leading-relaxed line-clamp-3 mb-6 break-words overflow-hidden flex-1">
                      {p.shortDescription}
                    </p>

                    {/* Bottom CTA */}
                    <div className="flex flex-col items-center gap-3">
                      {/* Apply Now Button */}
                      <span
                        className="inline-flex items-center justify-center px-5 py-2 rounded-lg
                                  bg-brand-primary text-white text-sm font-semibold
                                  shadow-md hover:bg-brand-accent hover:shadow-lg
                                  transition-all w-full"
                      >
                        Apply Now
                      </span>

                      {/* View Details */}
                      <span
                        className="inline-flex items-center gap-2 text-brand-primary text-sm font-medium
                                      group-hover:gap-3 transition-all"
                      >
                        View Details
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {programs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-brand-muted text-lg">
                No programs available at the moment. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="h2 mb-6 text-brand-dark">
              Can&apos;t Find What You&apos;re Looking For?
            </h2>
            <p className="text-xl text-brand-muted mb-10">
              We&apos;re constantly developing new programs. Let us know what
              you&apos;d like to see.
            </p>
            <Link href="/contact" className="btn">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
