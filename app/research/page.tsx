'use client';

import Link from 'next/link';
import SectionHeading from '../components/SectionHeading';
import React from 'react';
import { Research } from '@/lib/types';

interface ResearchWithViews extends Research {
  views?: number;
}

export default function ResearchPage() {
  const [research, setResearch] = React.useState<ResearchWithViews[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadResearch() {
      try {
        // Fetch research data from public API
        const resResponse = await fetch('/api/research');
        const data = await resResponse.json();
        
        // Fetch view counts for all research articles
        const researchWithViews = await Promise.all(
          data.map(async (item: Research) => {
            try {
              const response = await fetch(`/api/research/views?slug=${item.slug}`);
              const viewData = await response.json();
              return { ...item, views: viewData.views || 0 };
            } catch (error) {
              console.error(`Error fetching views for ${item.slug}:`, error);
              return { ...item, views: 0 };
            }
          })
        );
        
        setResearch(researchWithViews);
      } catch (error) {
        console.error('Error loading research:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadResearch();
  }, []);

  // Function to handle research click and track view (unique users only)
  const handleResearchClick = async (slug: string, e: React.MouseEvent, pdfUrl?: string) => {
    // Check if user has already viewed this article
    const viewedArticles = JSON.parse(localStorage.getItem('viewedResearch') || '[]');

    // Only track if user hasn't viewed this article before
    if (!viewedArticles.includes(slug)) {
      try {
        await fetch('/api/research/views', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug })
        });

        // Mark this article as viewed
        viewedArticles.push(slug);
        localStorage.setItem('viewedResearch', JSON.stringify(viewedArticles));

        // Update the local state to show the new count immediately
        setResearch(prev => prev.map(item => 
          item.slug === slug 
            ? { ...item, views: (item.views || 0) + 1 }
            : item
        ));
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    }

    // If there's a PDF URL
    if (pdfUrl) {
      // If it's a local path (served from this domain), open the proxy path directly
      if (pdfUrl.startsWith('/')) {
        window.open(`/research/files/${slug}`, '_blank', 'noopener,noreferrer');
        return;
      }

      // Trust Cloudinary URLs - open directly via proxy without validation
      if (pdfUrl.includes('res.cloudinary.com/')) {
        console.log('Opening trusted Cloudinary PDF via proxy:', pdfUrl);
        window.open(`/research/files/${slug}`, '_blank', 'noopener,noreferrer');
        return;
      }

      // For other remote URLs, validate before opening
      try {
        const check = await fetch('/api/admin/pdf-info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: pdfUrl })
        });
        
        if (!check.ok) {
          console.warn(`PDF validation failed (${check.status}), opening via proxy anyway`);
          // Still try to open via proxy even if validation failed
          window.open(`/research/files/${slug}`, '_blank', 'noopener,noreferrer');
          return;
        }
        
        const info = await check.json();
        
        // Log validation results for debugging
        console.log('PDF validation result:', info);

        // If fetch to remote failed or response isn't a PDF, open with Google Docs viewer (absolute URL)
        if (!info.ok || !info.startsWithPdf) {
          console.warn('PDF validation indicates not a valid PDF, using Google Docs viewer');
          const absoluteUrl = pdfUrl.startsWith('http') ? pdfUrl : window.location.origin + pdfUrl;
          window.open(`https://docs.google.com/viewer?url=${encodeURIComponent(absoluteUrl)}`, '_blank', 'noopener,noreferrer');
          return;
        }

        // Looks like a PDF — open via our proxy path so the site URL is consistent
        window.open(`/research/files/${slug}`, '_blank', 'noopener,noreferrer');
      } catch (err) {
        console.error('PDF check failed, opening via proxy as fallback:', err);
        // Fallback to proxy route instead of direct URL to maintain consistent behavior
        window.open(`/research/files/${slug}`, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="section bg-brand-hero text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="h2 mb-6">The Collective Counsel Law Review</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Advancing Scholar Research through editorial excellence and academic integrity.
            </p>
          </div>
        </div>
      </section>

      {/* research Grid */}
      <section className="section bg-brand-light">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            {research.map((p) => (
              <Link
                key={p.slug}
                href={`/research/files/${p.slug}`}
                className="card-interactive group"
                onClick={(e) => {
                  e.preventDefault();
                  // Let the handler perform checks and open the appropriate URL
                  handleResearchClick(p.slug, e, p.pdf);
                }}
              >
                <div className="flex flex-col h-full">
                  {p.image && (
  <div className="mb-4 overflow-hidden rounded-xl">
    <img
      src={p.image}
      alt={p.title}
      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
    />
  </div>
)}

                  <h3 className="h3 mb-3 text-brand-dark group-hover:text-brand-primary transition-colors">
                    {p.title}
                  </h3>
                  
                  {p.author && (
                    <p className="text-sm text-brand-primary font-medium mb-3 flex items-center gap-2">
                      <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                        />
                      </svg>
                      {p.author}
                    </p>
                  )}
                  
                  <p className="text-brand-muted mb-6 leading-relaxed flex-1">
                    {p.summary}
                  </p>

                  {/* Dynamic View Counter - Students Reached */}
                  <div className="flex flex-wrap gap-4 mb-6 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold gradient-text">
                        {p.views || 0}
                      </div>
                      <div className="text-xs text-brand-muted">
                        Students Reached
                      </div>
                    </div>
                  </div>
                  
                  <span className="inline-flex items-center gap-2 text-brand-primary font-medium group-hover:gap-3 transition-all">
                    View Research Article
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
          
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
              <p className="text-brand-muted text-lg mt-4">Loading research...</p>
            </div>
          )}
          
          {!loading && research.length === 0 && (
            <div className="text-center py-12">
              <p className="text-brand-muted text-lg">
                No researches to display yet. Stay tuned!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
