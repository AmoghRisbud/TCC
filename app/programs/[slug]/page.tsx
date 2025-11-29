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
      <h1 className="h1 mb-4">{program.title}</h1>
      <p className="mb-6">{program.fullDescription || program.shortDescription}</p>
      {program.sessions && program.sessions.length > 0 && (
        <div className="mt-8">
          <h2 className="h2 mb-3">Sessions</h2>
          <ul className="space-y-2 text-sm">
            {program.sessions.map((s, i) => <li key={i} className="border rounded p-3"><strong>{s.title}</strong> – {s.date}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
