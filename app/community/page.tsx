import SectionHeading from '../components/SectionHeading';
import Link from 'next/link';

export const metadata = { title: 'Community | TCC' };

export default function CommunityPage() {
  return (
    <div className="section container max-w-3xl">
      <SectionHeading title="Join the Community" subtitle="WhatsApp, Discord or email-based community." />
      <div className="space-y-4 text-sm">
        <p>Choose a channel below to stay connected.</p>
        <div className="flex gap-4 flex-wrap">
          <Link href="#" className="btn">WhatsApp</Link>
          <Link href="#" className="btn-secondary">Discord</Link>
          <Link href="mailto:info.thecollectivecounsel@gmail.com" className="btn">Email Us</Link>
        </div>
      </div>
    </div>
  );
}
