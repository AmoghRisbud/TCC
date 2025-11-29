import Link from 'next/link';
import SectionHeading from '../components/SectionHeading';
import { getPrograms } from '../../lib/content';

export const metadata = { title: 'Programs | TCC' };

export default function ProgramsPage() {
  const programs = getPrograms();
  return (
    <div className="section container">
      <SectionHeading title="Programs You Can Join" />
      <div className="grid md:grid-cols-2 gap-6">
        {programs.map(p => (
          <Link key={p.slug} href={`/programs/${p.slug}`} className="border rounded p-5 hover:shadow">
            <h3 className="h3 mb-2">{p.title}</h3>
            <p className="text-sm mb-3">{p.shortDescription}</p>
            <span className="text-xs font-medium text-brand-primary">View Details →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
