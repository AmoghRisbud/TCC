import Link from 'next/link';
import SectionHeading from '../components/SectionHeading';
import { getJobs } from '../../lib/content';

export const metadata = { title: 'Careers | TCC' };

export default function CareersPage() {
  const jobs = getJobs();
  return (
    <div className="section container">
      <SectionHeading title="Work With TCC" subtitle="Currently, no open roles. But we love hearing from passionate people." />
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {jobs.map(j => (
          <Link key={j.slug} href={`/careers/${j.slug}`} className="border rounded p-5 hover:shadow">
            <h3 className="h3 mb-2">{j.title}</h3>
            <p className="text-sm mb-3">{j.description?.slice(0,120)}...</p>
            <span className="text-xs font-medium text-brand-primary">View Details →</span>
          </Link>
        ))}
      </div>
      <div className="mt-10 text-sm">Send your CV to <strong>info.thecollectivecounsel@gmail.com</strong></div>
    </div>
  );
}
