import Image from 'next/image';
import { getAchievements } from '../../lib/content';
import AchievementsGrid from './AchievementsGrid';
import Link from "next/link";
export const metadata = { title: 'Achievements | TCC' };
export const dynamic = 'force-dynamic';

export default async function AchievementsPage() {
  const achievements = await getAchievements();

  // Separate featured and regular achievements
  const featuredAchievements = achievements.filter(a => a.featured);
  const regularAchievements = achievements.filter(a => !a.featured);

  return (
    <div>
      {/* Hero */}
      <section 
        className="relative section bg-brand-hero text-white overflow-hidden"
        style={{
          backgroundImage: 'url(/images/achievements-collab.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: '40% center',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="absolute inset-0 bg-brand-primary/85 md:bg-brand-primary/80"></div>
        <div className="container text-center max-w-3xl mx-auto relative z-10 px-4">
          <h1 className="h1 mb-4">Broadcast Your Achievements</h1>
          <p className="text-base md:text-lg text-white/90 leading-relaxed mx-auto">
            Celebrating milestones, awards, and recognition that mark our journey in legal education and community impact.
          </p>
        </div>
      </section>

      {/* Partnership Logo */}
      <section className="py-4 bg-white">
  <div className="container max-w-2xl flex justify-center">
    <Link
      href="https://www.linkedin.com/company/thekarnyxrecords/?viewAsMember=true"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Karonyx LinkedIn Page"
    >
      <Image
        src="/Karonyx_CollabUpdated.jpeg"
        alt="Karonyx X TCC Partnership"
        width={300}
        height={80}
        priority
        className="w-full max-w-xs md:max-w-sm h-auto rounded-lg shadow-md cursor-pointer hover:opacity-90 transition"
      />
    </Link>
  </div>
</section>

      {/* Achievements Grid with Modal */}
      <AchievementsGrid 
        achievements={achievements}
        featuredAchievements={featuredAchievements}
        regularAchievements={regularAchievements}
      />
    </div>
  );
}
