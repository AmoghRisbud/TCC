import Link from 'next/link';
import SectionHeading from '../components/SectionHeading';
import { getProjects } from '../../lib/content';

export const metadata = { title: 'Projects | TCC' };

export default function ProjectsPage() {
  const projects = getProjects();
  return (
    <div className="section container">
      <SectionHeading title="Our Proof of Concept" />
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map(p => (
          <Link key={p.slug} href={`/projects/${p.slug}`} className="border rounded p-5 hover:shadow">
            <h3 className="h3 mb-2">{p.title}</h3>
            <p className="text-sm mb-3">{p.summary}</p>
            <span className="text-xs font-medium text-brand-primary">View Details →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
