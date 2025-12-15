import Image from 'next/image';
import { getPrograms } from '../../../lib/content';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return getPrograms().map(p => ({ slug: p.slug }));
}

export default function ProgramDetail({ params }: { params: { slug: string } }) {
  const program = getPrograms().find(p => p.slug === params.slug);
  if (!program) return notFound();

  return (
    <div className="section container max-w-3xl">

      {/* Header: Logo + Title */}
      <div className="flex items-center gap-4 mb-6">
        {program.logo && (
          <img
            src={program.logo}
            alt={`${program.title} logo`}
            width={64}
            height={64}
            className="object-contain rounded"
            priority
          />
        )}
        <h1 className="h1">{program.title}</h1>
      </div>

      {/* Description */}
      <p className="mb-6 text-brand-muted leading-relaxed">
        {program.fullDescription || program.shortDescription}
      </p>

      {/* Sessions */}
      {program.sessions?.length > 0 && (
        <div className="mt-8">
          <h2 className="h2 mb-3">Sessions</h2>
          <ul className="space-y-3">
            {program.sessions.map((s, i) => (
              <li
                key={i}
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
                <strong>{s.title}</strong>
                <div className="text-sm text-brand-muted">{s.date}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
