'use client';

import { notFound } from 'next/navigation';
import React from 'react';

interface Research {
  slug: string;
  title: string;
  summary: string;
  year?: string;
  impactMetrics?: Array<{ label: string; value: string }>;
}

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const [project, setProject] = React.useState<Research | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadAndTrackProject() {
      try {
        // Fetch research data from public API
        const resResponse = await fetch('/api/research');
        const research = await resResponse.json();
        const foundProject = research.find((p: Research) => p.slug === params.slug);
        
        if (!foundProject) {
          notFound();
          return;
        }
        
        setProject(foundProject);
        
        // Track view
        try {
          await fetch('/api/research/views', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug: params.slug })
          });
        } catch (error) {
          console.error('Error tracking view:', error);
        }
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadAndTrackProject();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="section container max-w-3xl text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="section container max-w-3xl">
      <h1 className="h1 mb-4">{project.title}</h1>
      {project.impactMetrics && project.impactMetrics.length > 0 && (
        <div className="mt-8">
          <h2 className="h2 mb-3">Impact</h2>
          <ul className="space-y-2 text-sm">
            {project.impactMetrics.map((m: any, i: number) => <li key={i} className="border rounded p-3"><strong>{m.label}:</strong> {m.value}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
