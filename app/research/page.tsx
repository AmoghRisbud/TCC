'use client';

import Link from 'next/link';
import SectionHeading from '../components/SectionHeading';
import React from 'react';

interface Research {
  slug: string;
  title: string;
  summary: string;
  year?: string;
  pdf?: string;
}

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

  // Function to handle research click and track view
  const handleResearchClick = async (slug: string, e: React.MouseEvent) => {
    // Track the view
    try {
      await fetch('/api/research/views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug })
      });
      
      // Update the local state to show the new count immediately
      setResearch(prev => prev.map(item => 
        item.slug === slug 
          ? { ...item, views: (item.views || 0) + 1 }
          : item
      ));
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="section bg-gradient-to-r from-brand-primary to-brand-accent text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="h1 mb-6">Our Proof of Concept</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Discover the impact we&apos;ve made through our wide research.
            </p>
          </div>
        </div>
      </section>

      {/* research Grid */}
      <section className="section bg-brand-light">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            {research.map(p => (
              <Link
                key={p.slug}
                href={p.pdf || `/research/${p.slug}`}
                {...(p.pdf && { target: "_blank", rel: "noopener noreferrer" })}
                className="card-interactive group"
                onClick={(e) => handleResearchClick(p.slug, e)}
              >

                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-brand-secondary/10 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    {p.year && (
                      <span className="text-sm text-brand-muted">{p.year}</span>
                    )}
                  </div>
                  <h3 className="h3 mb-3 text-brand-dark group-hover:text-brand-primary transition-colors">{p.title}</h3>
                  <p className="text-brand-muted mb-6 leading-relaxed flex-1">{p.summary}</p>
                  
                  <div className="flex flex-wrap gap-4 mb-6 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold gradient-text">{p.views || 0}</div>
                      <div className="text-xs text-brand-muted">Students Reached</div>
                    </div>
                  </div>
                  
                  <span className="inline-flex items-center gap-2 text-brand-primary font-medium group-hover:gap-3 transition-all">
                    View Research Article
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
              <p className="text-brand-muted text-lg">No researches to display yet. Stay tuned!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
