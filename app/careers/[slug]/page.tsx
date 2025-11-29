import { getJobs } from '../../../lib/content';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return getJobs().map(j => ({ slug: j.slug }));
}

export default function JobDetail({ params }: { params: { slug: string } }) {
  const job = getJobs().find(j => j.slug === params.slug);
  if (!job) return notFound();
  return (
    <div className="section container max-w-3xl">
      <h1 className="h1 mb-4">{job.title}</h1>
      <p className="mb-6">{job.description}</p>
      <div className="mt-8 space-y-4">
        {job.requirements && (
          <div>
            <h2 className="h3 mb-2">Requirements</h2>
            <ul className="list-disc ml-6 text-sm space-y-1">{job.requirements.map((r,i)=><li key={i}>{r}</li>)}</ul>
          </div>
        )}
        {job.responsibilities && (
          <div>
            <h2 className="h3 mb-2">Responsibilities</h2>
            <ul className="list-disc ml-6 text-sm space-y-1">{job.responsibilities.map((r,i)=><li key={i}>{r}</li>)}</ul>
          </div>
        )}
      </div>
      <div className="mt-10">
        <a href={`mailto:${job.applyEmail || 'info.thecollectivecounsel@gmail.com'}`} className="btn">Apply via Email</a>
      </div>
    </div>
  );
}
