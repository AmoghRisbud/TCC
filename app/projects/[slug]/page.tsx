import { getProjects } from '../../../lib/content';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return getProjects().map(p => ({ slug: p.slug }));
}

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const project = getProjects().find(p => p.slug === params.slug);
  if (!project) return notFound();
  return (
    <div className="section container max-w-3xl">
      <h1 className="h1 mb-4">{project.title}</h1>
      <p className="mb-6">{project.description || project.summary}</p>
      {project.impactMetrics && project.impactMetrics.length > 0 && (
        <div className="mt-8">
          <h2 className="h2 mb-3">Impact</h2>
          <ul className="space-y-2 text-sm">
            {project.impactMetrics.map((m, i) => <li key={i} className="border rounded p-3"><strong>{m.label}:</strong> {m.value}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
