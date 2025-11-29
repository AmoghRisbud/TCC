import SectionHeading from '../components/SectionHeading';
import { getGallery } from '../../lib/content';

export const metadata = { title: 'Media | TCC' };

export default function MediaPage() {
  const items = getGallery();
  return (
    <div className="section container">
      <SectionHeading title="In Pictures" />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map(i => (
          <div key={i.id} className="border rounded p-3">
            <div className="text-sm font-medium mb-1">{i.title}</div>
            <p className="text-xs">{i.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
