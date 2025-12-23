'use client';

import React from 'react';
import ImageUpload from '../components/ImageUpload';
import RichTextEditor from '../components/RichTextEditor';

// Helper function to generate URL-friendly ID from name
const generateId = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') + '-' + Date.now();
};

interface Testimonial {
  id: string;
  name: string;
  quote: string;
  role?: string;
  organization?: string;
  rating?: number;
  featured?: boolean;
  date?: string;
  programRef?: string;
  image?: string;
}

const emptyTestimonial: Testimonial = {
  id: '',
  name: '',
  quote: '',
  role: '',
  organization: '',
  rating: 5,
  featured: false,
  date: '',
  programRef: '',
  image: '',
};

export default function AdminTestimonialsManager() {
  const [items, setItems] = React.useState<Testimonial[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<'add' | 'edit'>('add');
  const [formData, setFormData] = React.useState<Testimonial>(emptyTestimonial);
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/testimonials', { method: 'GET' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch testimonials');
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }, []);

  React.useEffect(() => { refresh(); }, [refresh]);

  const openAddModal = () => { setFormData(emptyTestimonial); setModalMode('add'); setIsModalOpen(true); };
  const openEditModal = (item: Testimonial) => { setFormData(item); setModalMode('edit'); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setFormData(emptyTestimonial); };

  // Strip HTML tags from a string and collapse whitespace
  const stripHtml = (html: string) => {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    // Convert multiple whitespace/newlines to single spaces and trim
    return (div.textContent || div.innerText || '').replace(/\s+/g, ' ').trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Prepare testimonial payload and ensure quote is plain text (no HTML tags)
      const prepared = { ...formData, quote: stripHtml(formData.quote) } as Testimonial;

      // Auto-generate ID from name if adding new testimonial
      const dataToSubmit = modalMode === 'add' 
        ? { ...prepared, id: generateId(prepared.name) }
        : prepared;
      
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/testimonials', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dataToSubmit) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Failed to ${modalMode} testimonial`);
      setSuccess(`Testimonial ${modalMode === 'add' ? 'added' : 'updated'} successfully!`);
      setTimeout(() => setSuccess(null), 3000);
      closeModal();
      await refresh();
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/testimonials?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to delete testimonial');
      setSuccess('Testimonial deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
      setDeleteConfirm(null);
      await refresh();
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
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
          <h2 className="text-2xl font-bold text-brand-dark">Testimonials</h2>
          <p className="text-brand-muted">{items.length} testimonial{items.length !== 1 ? 's' : ''} total</p>
        </div>
        <button onClick={openAddModal} className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-lg shadow hover:bg-brand-primary/90 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Testimonial
        </button>
      </div>

      {loading && items.length === 0 ? (
        <div className="text-center py-12 text-brand-muted">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-brand-primary/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </div>
          <p className="text-brand-muted mb-2">No testimonials yet</p>
          <button onClick={openAddModal} className="text-brand-primary hover:underline">Add your first testimonial</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-primary font-bold text-lg">{item.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-brand-dark">{item.name}</h3>
                    {item.featured && <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">Featured</span>}
                  </div>
                  {(item.role || item.organization) && (
                    <p className="text-sm text-brand-muted mb-2">{item.role}{item.role && item.organization && ' at '}{item.organization}</p>
                  )}
                  <p className="text-sm text-brand-dark italic line-clamp-3 mb-3">&ldquo;{stripHtml(item.quote)}&rdquo;</p>
                  <div className="flex items-center gap-3 text-xs text-brand-muted">
                    {item.rating && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        {item.rating}/5
                      </span>
                    )}
                    {item.date && <span>{item.date}</span>}
                    {item.programRef && <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded">{item.programRef}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-4 mt-4 border-t border-gray-100">
                <button onClick={() => openEditModal(item)} className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">Edit</button>
                <button onClick={() => setDeleteConfirm(item.id)} className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-xl font-semibold text-brand-dark">{modalMode === 'add' ? 'Add Testimonial' : 'Edit Testimonial'}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-brand-dark mb-1">Name *</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" placeholder="John Doe" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-brand-dark mb-1">Quote *</label>
                  <RichTextEditor 
                    value={formData.quote} 
                    onChange={(value) => setFormData(p => ({ ...p, quote: value }))} 
                    placeholder="Their testimonial..." 
                    height="200px"
                  />
                  <p className="text-xs text-brand-muted mt-2">Tip: Any formatting you paste will be stripped and the quote will be saved as plain text.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">Role</label>
                  <input type="text" value={formData.role} onChange={e => setFormData(p => ({ ...p, role: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" placeholder="Student / Lawyer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">Organization</label>
                  <input type="text" value={formData.organization} onChange={e => setFormData(p => ({ ...p, organization: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" placeholder="Company / University" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">Rating</label>
                  <select value={formData.rating} onChange={e => setFormData(p => ({ ...p, rating: Number(e.target.value) }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary">
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">Date</label>
                  <input type="date" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">Program Reference</label>
                  <input type="text" value={formData.programRef} onChange={e => setFormData(p => ({ ...p, programRef: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" placeholder="program-slug" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData(p => ({ ...p, featured: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                  <label htmlFor="featured" className="text-sm font-medium text-brand-dark">Featured on Homepage</label>
                </div>
              </div>

              {/* Image Upload */}
              <ImageUpload
                currentImage={formData.image}
                category="testimonials"
                onImageChange={(url) => setFormData(p => ({ ...p, image: url }))}
                label="Profile Photo"
              />

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50">{loading ? 'Saving...' : modalMode === 'add' ? 'Add' : 'Save'}</button>
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
              <h3 className="text-lg font-semibold text-brand-dark mb-2">Delete Testimonial?</h3>
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
