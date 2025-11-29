import SectionHeading from '../components/SectionHeading';

export const metadata = { title: 'About | TCC' };

export default function AboutPage() {
  return (
    <div className="section container">
      <SectionHeading title="Who We Are" subtitle="Brief mission, the problem, and what TCC solves." />
      <div className="grid md:grid-cols-3 gap-8 mt-8">
        {['Vision','Mission','Approach'].map(s => (
          <div key={s} className="border rounded p-5">
            <h3 className="h3 mb-2">{s}</h3>
            <p className="text-sm">Placeholder content for {s}. Update via CMS later.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
