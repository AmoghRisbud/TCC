import Link from 'next/link';
import SectionHeading from '../components/SectionHeading';
import { getTeam } from '../../lib/content';

export const metadata = { title: 'Team | TCC' };

export default function TeamPage() {
  const team = getTeam();
  return (
    <div className="section container">
      <SectionHeading title="Meet the Educators" />
      <div className="grid md:grid-cols-3 gap-6">
        {team.map(m => (
          <Link key={m.slug} href={`/team/${m.slug}`} className="border rounded p-5 hover:shadow">
            <h3 className="h3 mb-2">{m.name}</h3>
            <p className="text-xs">{m.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
