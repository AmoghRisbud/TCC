import Image from 'next/image';
import { getAchievements } from '../../lib/content';

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
      <section className="section bg-brand-hero text-white">
        <div className="container text-center max-w-3xl mx-auto">
          <h1 className="h1 mb-4">Our Achievements</h1>
          <p className="text-lg text-white/85 leading-relaxed mx-auto">
            Celebrating milestones, awards, and recognition that mark our journey in legal education and community impact.
          </p>
        </div>
      </section>

      {/* Featured Achievements */}
      {featuredAchievements.length > 0 && (
        <section className="section bg-white">
          <div className="container max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-3">
                Featured <span className="text-brand-primary">Achievements</span>
              </h2>
              <div className="h-1 w-16 rounded-full bg-brand-primary/70 mx-auto" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 rounded-xl p-6 border-2 border-brand-primary/20 hover:shadow-lg transition-shadow"
                >
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={achievement.image}
                      alt={achievement.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-brand-dark">{achievement.title}</h3>
                    <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full flex-shrink-0">
                      Featured
                    </span>
                  </div>
                  {achievement.category && (
                    <p className="text-sm text-brand-primary font-medium mb-2">{achievement.category}</p>
                  )}
                  <p className="text-sm text-brand-muted mb-3 leading-relaxed">
                    {achievement.description}
                  </p>
                  <p className="text-xs text-brand-muted">
                    {new Date(achievement.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Achievements */}
      <section className="section bg-brand-light">
        <div className="container max-w-6xl">
          {featuredAchievements.length > 0 && (
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-3">
                All Achievements
              </h2>
              <div className="h-1 w-16 rounded-full bg-brand-primary/70 mx-auto" />
            </div>
          )}

          {achievements.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-primary/10 mb-6">
                <svg
                  className="w-10 h-10 text-brand-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-brand-dark mb-3">No achievements yet</h3>
              <p className="text-brand-muted max-w-md mx-auto">
                We&apos;re working hard to create meaningful impact. Check back soon for updates on our milestones and achievements.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(featuredAchievements.length > 0 ? regularAchievements : achievements).map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={achievement.image}
                      alt={achievement.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-brand-dark mb-2">{achievement.title}</h3>
                  {achievement.category && (
                    <p className="text-sm text-brand-primary font-medium mb-2">{achievement.category}</p>
                  )}
                  <p className="text-sm text-brand-muted mb-3 leading-relaxed line-clamp-3">
                    {achievement.description}
                  </p>
                  <p className="text-xs text-brand-muted">
                    {new Date(achievement.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
