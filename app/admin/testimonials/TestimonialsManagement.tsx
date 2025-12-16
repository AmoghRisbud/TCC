'use client';

import { useState } from 'react';
import { Testimonial } from '../../../lib/types';

interface TestimonialsManagementProps {
  initialTestimonials: Testimonial[];
}

export default function TestimonialsManagement({ initialTestimonials }: TestimonialsManagementProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleAdd = () => {
    setFormData({ featured: false });
    setIsAddModalOpen(true);
  };

  const handleEdit = (item: Testimonial) => {
    setFormData(item);
    setEditingItem(item);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete testimonial');

      setTestimonials(testimonials.filter(item => item.id !== id));
      showMessage('success', 'Testimonial deleted successfully');
    } catch (error) {
      showMessage('error', 'Failed to delete testimonial');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save testimonial');

      const result = await response.json();
      
      // Refresh the list
      const updatedResponse = await fetch('/api/admin/testimonials');
      const updatedTestimonials = await updatedResponse.json();
      setTestimonials(updatedTestimonials);

      setIsAddModalOpen(false);
      setEditingItem(null);
      setFormData({});
      showMessage('success', editingItem ? 'Testimonial updated successfully' : 'Testimonial added successfully');
    } catch (error) {
      showMessage('error', 'Failed to save testimonial');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const isModalOpen = isAddModalOpen || editingItem !== null;

  return (
    <>
      {/* Message Banner */}
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Add Button */}
      <div className="mb-8 text-center">
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-3 px-6 py-3 bg-brand-primary text-white rounded-lg shadow-md hover:shadow-lg hover:bg-brand-primary/90 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-medium">Add New Testimonial</span>
        </button>
      </div>

      {/* Testimonials List */}
      {testimonials.length > 0 ? (
        <div className="grid gap-4">
          {testimonials.map(testimonial => (
            <article 
              key={testimonial.id}
              className="card hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-brand-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-brand-primary font-semibold text-xl">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Author Info */}
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-brand-dark">{testimonial.name}</h3>
                        {testimonial.featured && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            Featured
                          </span>
                        )}
                      </div>
                      
                      {/* Role & Organization */}
                      <div className="text-sm text-brand-muted mb-3">
                        {testimonial.role && <span>{testimonial.role}</span>}
                        {testimonial.role && testimonial.organization && <span> at </span>}
                        {testimonial.organization && <span>{testimonial.organization}</span>}
                      </div>
                      
                      {/* Quote */}
                      <p className="text-brand-dark italic mb-3">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>
                      
                      {/* Metadata */}
                      <div className="flex flex-wrap gap-2">
                        {testimonial.rating && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                            {testimonial.rating}/5
                          </span>
                        )}
                        {testimonial.programRef && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            {testimonial.programRef}
                          </span>
                        )}
                        {testimonial.date && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            {testimonial.date}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button 
                        onClick={() => handleEdit(testimonial)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        disabled={loading}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(testimonial.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        disabled={loading}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-6 bg-brand-primary/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-brand-muted text-lg mb-4">No testimonials have been added yet.</p>
          <p className="text-brand-muted">Add your first testimonial to get started.</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-brand-dark">
                {editingItem ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  ID * <span className="text-xs text-gray-500">(unique identifier, e.g., test-john-2025)</span>
                </label>
                <input
                  type="text"
                  value={formData.id || ''}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  required
                  disabled={!!editingItem}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Role</label>
                <input
                  type="text"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Organization</label>
                <input
                  type="text"
                  value={formData.organization || ''}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Quote *</label>
                <textarea
                  value={formData.quote || ''}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">
                    Rating <span className="text-xs text-gray-500">(1-5)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating || ''}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">
                    Date <span className="text-xs text-gray-500">(YYYY-MM-DD)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    placeholder="2025-01-15"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Program Reference</label>
                <input
                  type="text"
                  value={formData.programRef || ''}
                  onChange={(e) => setFormData({ ...formData, programRef: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  placeholder="arbitration-law"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured || false}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                />
                <label htmlFor="featured" className="text-sm font-medium text-brand-dark">
                  Featured (show on homepage)
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : editingItem ? 'Update Testimonial' : 'Add Testimonial'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
