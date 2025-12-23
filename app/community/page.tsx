'use client';

import Link from 'next/link';
import { useState } from 'react';

const channels = [
  {
    name: 'WhatsApp',
    description: 'Join our WhatsApp group for quick updates and discussions',
    href: 'https://docs.google.com/forms/d/e/1FAIpQLSfvFXAbRwMKmTeuCuAOr2Vz88RBll8cdWR_Cx_5gv-ndXDLrQ/viewform?usp=send_form',
    external: true,
    color: 'bg-green-500',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    description: 'Follow us on Instagram for some exciting content',
    href: 'https://www.instagram.com/the_collective_counsel?igsh=MTZwY3VyaHN6NWJ1ag==',
    external: true,
    color: 'bg-indigo-500',

    icon: (
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
        <svg
          className="w-7 h-7 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2h-8.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zM17.25 6.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z" />
        </svg>
      </div>
    ),
  },
  {
    name: 'Email',
    description: 'Subscribe to our newsletter for updates and resources',
    href: 'mailto:info.thecollectivecounsel@gmail.com',
    color: 'bg-brand-primary',
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },

  {
    name: 'LinkedIn',
    description: 'Connect with us professionally on LinkedIn',
    href: ' https://www.linkedin.com/company/the-collective-counsel/',
    external: true,
    color: 'bg-[#0A66C2]',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
      </svg>
    ),
  },
];

export default function CommunityPage() {
  const [showFellowshipForm, setShowFellowshipForm] = useState(false);
  
  // Fellowship form state
  const [fellowshipFormData, setFellowshipFormData] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    yearOfStudy: '',
    areaOfInterest: '',
    motivation: '',
    experience: '',
    portfolio: '',
  });
  const [fellowshipSubmitting, setFellowshipSubmitting] = useState(false);
  const [fellowshipStatus, setFellowshipStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Handle fellowship form submission
  const handleFellowshipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFellowshipSubmitting(true);
    setFellowshipStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact/fellowship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fellowshipFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setFellowshipStatus({
        type: 'success',
        message: 'Your application has been submitted successfully! We\'ll review it and get back to you soon.',
      });
      
      // Reset form
      setFellowshipFormData({
        name: '',
        email: '',
        phone: '',
        institution: '',
        yearOfStudy: '',
        areaOfInterest: '',
        motivation: '',
        experience: '',
        portfolio: '',
      });
      
      // Scroll to top of form to show success message
      setTimeout(() => {
        const formSection = document.querySelector('.animate-fade-in');
        if (formSection) {
          formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      
    } catch (error) {
      setFellowshipStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to submit application. Please try again.',
      });
    } finally {
      setFellowshipSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="section bg-brand-hero from-brand-primary to-brand-accent text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="h1 mb-6">Join the Community</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Connect with fellow law students, educators, mentors and legal professionals. Choose your
              preferred platform to stay connected.
            </p>
          </div>
        </div>
      </section>

      {/* Channels */}
      <section className="section bg-brand-light">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {channels.map((channel) => (
              <a
                key={channel.name}
                href={channel.href}
                target={channel.external ? '_blank' : undefined}
                rel={channel.external ? 'noopener noreferrer' : undefined}
                className="card-interactive group text-center"
              >
                <div
                  className={`w-16 h-16 mx-auto mb-6 ${channel.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  {channel.icon}
                </div>
                <h3 className="h3 mb-3 text-brand-dark">{channel.name}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{channel.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="section bg-brand-light">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Campus Ambassador Program */}
            <div className="card flex flex-col text-center hover:shadow-xl transition">
              {/* Logo */}
              <div className="h-24 flex items-center justify-center mb-6">
                <img
                  src="/images/counsel/campusambassador.JPG"
                  alt="Campus Ambassador Program"
                  className="h-20 object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="h3 text-brand-dark mb-4">Campus Ambassador Program</h3>

              {/* Spacer to align buttons */}
              <div className="flex-grow" />

              {/* Actions */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <a
                  href="/community/Campus Ambassador.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-brand-primary hover:underline underline-offset-4 transition"
                >
                  View Details →
                </a>

                <Link href="https://forms.gle/GJApGJq7Sc6Kr4f96" target="_blank">
                  <button className="btn-cta w-full">Apply Now</button>
                </Link>
              </div>
            </div>

            {/* Educator Program */}
            <div className="card flex flex-col text-center hover:shadow-xl transition">
              {/* Logo */}
              <div className="h-24 flex items-center justify-center mb-6">
                <img
                  src="/images/counsel/educatorpro.JPG"
                  alt="Educator Program"
                  className="h-20 object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="h3 text-brand-dark mb-4">Educator Program</h3>

              {/* Spacer to align buttons */}
              <div className="flex-grow" />

              {/* Actions */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <a
                  href="/community/EDUCATOR PROGRAMME.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-brand-primary hover:underline underline-offset-4 transition"
                >
                  View Details →
                </a>

                <a
                  href="https://forms.gle/HcnGx5THbWNw46XK9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cta w-full"
                >
                  Apply Now
                </a>
              </div>
            </div>

            {/* Partnership Program */}
            <div className="card flex flex-col text-center hover:shadow-xl transition">
              {/* Logo */}
              <div className="h-24 flex items-center justify-center mb-6">
                <img
                  src="/images/counsel/partnershippro.JPG" // change path if needed
                  alt="Partnership Program"
                  className="h-20 object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="h3 text-brand-dark mb-4">Partnership Program</h3>

              {/* Spacer */}
              <div className="flex-grow" />

              {/* Actions */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <a
                  href="/community/TCC_Legal_Content_Fellowship.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-brand-primary hover:underline underline-offset-4 transition"
                >
                  View Details →
                </a>

                <a
                  href="/contact?type=partner"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cta w-full"
                >
                  Apply Now
                </a>
              </div>
            </div>

            {/*Legal content fellowship*/}
            <div className="card flex flex-col text-center hover:shadow-xl transition">
              {/* Logo */}
              <div className="h-24 flex items-center justify-center mb-6">
                <img
                  src="/images/counsel/fellowship_logo.jpeg" // change path if needed
                  alt="Partnership Program"
                  className="h-20 object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="h3 text-brand-dark mb-4">Legal Content Fellowship</h3>

              {/* Spacer */}
              <div className="flex-grow" />

              {/* Actions */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <a
                  href="/community/TCC_Legal_Content_Fellowship.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-brand-primary hover:underline underline-offset-4 transition"
                >
                  View Details →
                </a>

                <button
                  onClick={() => setShowFellowshipForm(true)}
                  className="btn-cta w-full"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Content Fellowship Application Form */}
      {showFellowshipForm && (
        <section className="section bg-brand-light">
          <div className="container">
            <div className="card max-w-2xl mx-auto animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="h3 text-brand-dark">
                  Legal Content Fellowship Application
                </h2>
                <button
                  onClick={() => {
                    setShowFellowshipForm(false);
                    setFellowshipStatus({ type: null, message: '' });
                  }}
                  className="text-brand-muted hover:text-brand-dark transition"
                  aria-label="Close form"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {fellowshipStatus.type && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    fellowshipStatus.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {fellowshipStatus.message}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleFellowshipSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-2">
                      Full Name *
                    </label>
                    <input 
                      className="input" 
                      placeholder="Your full name"
                      value={fellowshipFormData.name}
                      onChange={(e) => setFellowshipFormData({ ...fellowshipFormData, name: e.target.value })}
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-2">
                      Email *
                    </label>
                    <input 
                      type="email"
                      className="input" 
                      placeholder="your@email.com"
                      value={fellowshipFormData.email}
                      onChange={(e) => setFellowshipFormData({ ...fellowshipFormData, email: e.target.value })}
                      required 
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-2">
                      Phone Number
                    </label>
                    <input 
                      type="tel"
                      className="input" 
                      placeholder="+91 1234567890"
                      value={fellowshipFormData.phone}
                      onChange={(e) => setFellowshipFormData({ ...fellowshipFormData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-2">
                      Institution/College *
                    </label>
                    <input 
                      className="input" 
                      placeholder="Your institution name"
                      value={fellowshipFormData.institution}
                      onChange={(e) => setFellowshipFormData({ ...fellowshipFormData, institution: e.target.value })}
                      required 
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-2">
                      Year of Study
                    </label>
                    <select 
                      className="input"
                      value={fellowshipFormData.yearOfStudy}
                      onChange={(e) => setFellowshipFormData({ ...fellowshipFormData, yearOfStudy: e.target.value })}
                    >
                      <option value="">Select year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="5th Year">5th Year</option>
                      <option value="Graduate">Graduate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-2">
                      Area of Interest
                    </label>
                    <input 
                      className="input" 
                      placeholder="e.g., Corporate Law, Criminal Law"
                      value={fellowshipFormData.areaOfInterest}
                      onChange={(e) => setFellowshipFormData({ ...fellowshipFormData, areaOfInterest: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-2">
                    Why do you want to join the Legal Content Fellowship? *
                  </label>
                  <textarea
                    className="input resize-none"
                    rows={5}
                    placeholder="Tell us about your motivation and what you hope to achieve..."
                    value={fellowshipFormData.motivation}
                    onChange={(e) => setFellowshipFormData({ ...fellowshipFormData, motivation: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-2">
                    Previous writing or research experience (if any)
                  </label>
                  <textarea
                    className="input resize-none"
                    rows={4}
                    placeholder="Share any relevant experience with legal writing, research, or publications..."
                    value={fellowshipFormData.experience}
                    onChange={(e) => setFellowshipFormData({ ...fellowshipFormData, experience: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-2">
                    Portfolio/Work Samples (Optional)
                  </label>
                  <input 
                    className="input" 
                    placeholder="Link to your portfolio, LinkedIn, or work samples"
                    value={fellowshipFormData.portfolio}
                    onChange={(e) => setFellowshipFormData({ ...fellowshipFormData, portfolio: e.target.value })}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowFellowshipForm(false);
                      setFellowshipStatus({ type: null, message: '' });
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn"
                    disabled={fellowshipSubmitting}
                  >
                    {fellowshipSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="h2 mb-4 text-brand-dark">Why Join Our Community?</h2>
            <p className="text-lg text-brand-muted">
              Being part of TCC means access to exclusive resources, mentorship, and a network of
              passionate legal minds.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: 'Networking',
                desc: 'Connect with peers and professionals',
              },
              {
                title: 'Resources',
                desc: 'Access exclusive learning materials',
              },
              { title: 'Events', desc: 'Attend workshops and webinars' },
              { title: 'Support', desc: 'Get guidance when you need it' },
            ].map((benefit, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-brand-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-brand-dark mb-2">{benefit.title}</h4>
                <p className="text-sm text-brand-muted">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
