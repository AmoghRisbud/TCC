'use client';

import React from 'react';
import ImageUpload from '../components/ImageUpload';
import RichTextEditor from '../components/RichTextEditor';

// Helper function to generate URL-friendly slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

interface Program {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  mode?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  fee?: string;
  enrollmentFormUrl?: string;
  introVideoLink?: string;
  duration?: string;
  logo?: string;
  featured?: boolean;
  seatsLeft?: number;
}

const emptyProgram: Program = {
  slug: '',
  title: '',
  shortDescription: '',
  fullDescription: '',
  mode: 'Online',
  location: '',
  startDate: '',
  endDate: '',
  fee: '',
  enrollmentFormUrl: '',
  introVideoLink: '',
  duration: '',
  logo: '',
  featured: false,
  seatsLeft: undefined,
};

export default function AdminProgramsManager() {
  const [programs, setPrograms] = React.useState<Program[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [dateError, setDateError] = React.useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<'add' | 'edit'>('add');
  const [formData, setFormData] = React.useState<Program>(emptyProgram);
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/programs', { method: 'GET' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch programs');
      setPrograms(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { refresh(); }, [refresh]);

  const openAddModal = () => {
    setFormData(emptyProgram);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const openEditModal = (program: Program) => {
    setFormData(program);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(emptyProgram);
    setDateError(null);
  };

  const validateDates = (startDate: string, endDate: string) => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        setDateError('Start date cannot be greater than end date');
        return false;
      }
    }
    setDateError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Validate dates
      if (!validateDates(formData.startDate || '', formData.endDate || '')) {
        setLoading(false);
        return;
      }
      
      // Auto-generate slug from title if adding new program
      const dataToSubmit = modalMode === 'add' 
        ? { ...formData, slug: generateSlug(formData.title) }
        : formData;
      
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/programs', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Failed to ${modalMode} program`);
      setSuccess(`Program ${modalMode === 'add' ? 'added' : 'updated'} successfully!`);
      setTimeout(() => setSuccess(null), 3000);
      closeModal();
      await refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/programs?slug=${encodeURIComponent(slug)}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to delete program');
      setSuccess('Program deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
      setDeleteConfirm(null);
      await refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">✕</button>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="text-green-500 hover:text-green-700">✕</button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark">Programs</h2>
          <p className="text-brand-muted">{programs.length} program{programs.length !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-lg shadow hover:bg-brand-primary/90 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Program
        </button>
      </div>

      {loading && programs.length === 0 ? (
        <div className="text-center py-12 text-brand-muted">Loading...</div>
      ) : programs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-brand-primary/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-brand-muted mb-2">No programs yet</p>
          <button onClick={openAddModal} className="text-brand-primary hover:underline">Add your first program</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map(program => (
            <div key={program.slug} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-brand-dark line-clamp-1">{program.title}</h3>
                <div className="flex items-center gap-2">
                  {program.featured && <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Featured</span>}
                  <span className="text-xs px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-full">{program.mode || 'Online'}</span>
                </div>
              </div>
              <p className="text-sm text-brand-muted line-clamp-2 mb-4">{program.shortDescription}</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-brand-muted mb-4">
                {program.location && (
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                    {program.location}
                  </div>
                )}
                {program.startDate && (
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {program.startDate}
                  </div>
                )}
                {program.duration && (
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {program.duration}
                  </div>
                )}
                {program.fee && (
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {program.fee}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <button onClick={() => openEditModal(program)} className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">Edit</button>
                <button onClick={() => setDeleteConfirm(program.slug)} className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-xl font-semibold text-brand-dark">{modalMode === 'add' ? 'Add New Program' : 'Edit Program'}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-brand-dark mb-1">Title *</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" placeholder="Program Title" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-brand-dark mb-1">Short Description</label>
                  <textarea rows={2} value={formData.shortDescription} onChange={e => setFormData(p => ({ ...p, shortDescription: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary resize-none" placeholder="Brief description (shown below title)" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-brand-dark mb-1">Program Overview</label>
                  <RichTextEditor 
                    value={formData.fullDescription || ''} 
                    onChange={(value) => setFormData(p => ({ ...p, fullDescription: value }))} 
                    placeholder="Detailed program overview (shown in the main content area)" 
                    height="250px"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">Mode</label>
                  <select value={formData.mode} onChange={e => setFormData(p => ({ ...p, mode: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary">
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">Location</label>
                  <input type="text" value={formData.location} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" placeholder="Remote / City" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">Start Date</label>
                  <input 
                    type="date" 
                    value={formData.startDate} 
                    onChange={e => {
                      const newStartDate = e.target.value;
                      setFormData(p => ({ ...p, startDate: newStartDate }));
                      validateDates(newStartDate, formData.endDate || '');
                    }} 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">End Date</label>
                  <input 
                    type="date" 
                    value={formData.endDate} 
                    onChange={e => {
                      const newEndDate = e.target.value;
                      setFormData(p => ({ ...p, endDate: newEndDate }));
                      validateDates(formData.startDate || '', newEndDate);
                    }} 
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary ${
                      dateError ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  {dateError && (
                    <p className="text-xs text-red-600 mt-1">{dateError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">Duration</label>
                  <input type="text" value={formData.duration} onChange={e => setFormData(p => ({ ...p, duration: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" placeholder="e.g., 6 months" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">Fee</label>
                  <input type="text" value={formData.fee} onChange={e => setFormData(p => ({ ...p, fee: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" placeholder="e.g., ₹50,000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">Seats Left</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.seatsLeft ?? ''} 
                    onChange={e => setFormData(p => ({ ...p, seatsLeft: e.target.value ? parseInt(e.target.value) : undefined }))} 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" 
                    placeholder="e.g., 25" 
                  />
                </div>

                <div className="flex items-center gap-2 col-span-2">
                  <input type="checkbox" id="featured" checked={!!formData.featured} onChange={e => setFormData(p => ({ ...p, featured: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                  <label htmlFor="featured" className="text-sm font-medium text-brand-dark">Featured on Homepage</label>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-brand-dark mb-1">Enrollment Form URL</label>
                  <input type="url" value={formData.enrollmentFormUrl} onChange={e => setFormData(p => ({ ...p, enrollmentFormUrl: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" placeholder="https://forms.google.com/..." />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-brand-dark mb-1">Intro Video Link (YouTube)</label>
                  <input type="url" value={formData.introVideoLink} onChange={e => setFormData(p => ({ ...p, introVideoLink: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" placeholder="https://www.youtube.com/watch?v=..." />
                  <p className="text-xs text-brand-muted mt-1">Enter YouTube video URL to display on program details page</p>
                </div>
              </div>

              {/* Image Upload Field */}
              <ImageUpload
                currentImage={formData.logo}
                category="programs"
                onImageChange={(url) => setFormData(p => ({ ...p, logo: url }))}
                label="Program Logo"
              />

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50">{loading ? 'Saving...' : modalMode === 'add' ? 'Add Program' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-brand-dark mb-2">Delete Program?</h3>
              <p className="text-brand-muted mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} disabled={loading} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">{loading ? 'Deleting...' : 'Delete'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
