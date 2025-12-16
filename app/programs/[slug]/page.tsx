import Image from 'next/image';
import Link from 'next/link';
import { getPrograms } from '../../../lib/content';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const programs = await getPrograms();
  return programs.map(p => ({ slug: p.slug }));
}

export default async function ProgramDetail({ params }: { params: { slug: string } }) {
  const programs = await getPrograms();
  const program = programs.find(p => p.slug === params.slug);
  if (!program) return notFound();

  return (
    <div>

      {/* HERO */}
      <section className="section bg-brand-hero text-white">
        <div className="container max-w-4xl text-center">

          {program.logo && (
            <div className="mx-auto mb-6 w-20 h-20 rounded-xl bg-white flex items-center justify-center shadow">
              <Image
                src={program.logo}
                alt={`${program.title} logo`}
                width={64}
                height={64}
                className="object-contain"
                priority
              />
            </div>
          )}

          <h1 className="h1 mb-4">{program.title}</h1>

          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {program.shortDescription}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {program.featured && (
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-brand-accent text-white">
                Featured
              </span>
            )}
            {program.status && (
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/20">
                {program.status.toUpperCase()}
              </span>
            )}
            {program.category && (
              <span className="px-3 py-1 text-xs rounded-full border border-white/30">
                {program.category}
              </span>
            )}
          </div>

        </div>
      </section>

      {/* CONTENT */}
      <section className="section bg-brand-light">
        <div className="container max-w-4xl grid md:grid-cols-3 gap-10">

          {/* LEFT: Description */}
          <div className="md:col-span-2">

            <h2 className="h2 mb-4">Program Overview</h2>
            <p className="text-brand-muted leading-relaxed mb-8">
              {program.fullDescription || program.shortDescription}
            </p>

          </div>

          {/* RIGHT: Program Meta */}
          <aside className="bg-white rounded-2xl p-6 shadow-sm border h-fit">

            <h3 className="font-semibold mb-4">Program Details</h3>

            <ul className="space-y-3 text-sm">
              {program.mode && (
                <li><strong>Mode:</strong> {program.mode}</li>
              )}
              {program.location && (
                <li><strong>Location:</strong> {program.location}</li>
              )}
              {program.startDate && (
                <li><strong>Start Date:</strong> {program.startDate}</li>
              )}
              {program.endDate && (
                <li><strong>End Date:</strong> {program.endDate}</li>
              )}
            </ul>

            {/* CTA */}
            {program.ctaUrl && (
              <Link
                href={program.ctaUrl}
                className="mt-6 inline-flex w-full justify-center items-center
                           px-5 py-3 rounded-lg bg-brand-primary text-white
                           font-semibold hover:bg-brand-accent transition"
              >
                {program.ctaLabel || 'Apply Now'}
              </Link>
            )}

          </aside>

        </div>
      </section>
    </div>
  );
}
