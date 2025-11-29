import { getTeam } from '../../../lib/content';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return getTeam().map(m => ({ slug: m.slug }));
}

export default function TeamDetail({ params }: { params: { slug: string } }) {
  const member = getTeam().find(m => m.slug === params.slug);
  if (!member) return notFound();
  return (
    <div className="section container max-w-3xl">
      <h1 className="h1 mb-4">{member.name}</h1>
      <p className="mb-2 text-sm">{member.title}</p>
      <p className="text-sm">{member.bio || 'Bio coming soon.'}</p>
      <div className="mt-6">
        <a href="/careers" className="btn">Work With Us</a>
      </div>
    </div>
  );
}
