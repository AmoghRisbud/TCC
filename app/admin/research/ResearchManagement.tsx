'use client';

import { useState } from 'react';
import { Research } from '../../../lib/types';

interface ResearchManagementProps {
  initialResearch: Research[];
}

export default function ResearchManagement({ initialResearch }: ResearchManagementProps) {
  const [research, setResearch] = useState<Research[]>(initialResearch);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Research | null>(null);
  const [formData, setFormData] = useState<Partial<Research>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleAdd = () => {
    setFormData({});
    setIsAddModalOpen(true);
  };

  const handleEdit = (item: Research) => {
    setFormData(item);
    setEditingItem(item);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this research article?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/research?slug=${slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete research article');

      setResearch(research.filter(item => item.slug !== slug));
      showMessage('success', 'Research article deleted successfully');
    } catch (error) {
      showMessage('error', 'Failed to delete research article');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/research', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save research article');

      const result = await response.json();
      
      // Refresh the list
      const updatedResponse = await fetch('/api/admin/research');
      const updatedResearch = await updatedResponse.json();
      setResearch(updatedResearch);

      setIsAddModalOpen(false);
      setEditingItem(null);
      setFormData({});
      showMessage('success', editingItem ? 'Research article updated successfully' : 'Research article added successfully');
    } catch (error) {
      showMessage('error', 'Failed to save research article');
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
          <span className="font-medium">Add New Research Article</span>
        </button>
      </div>

      {/* Research List */}
      {research.length > 0 ? (
        <div className="grid gap-4">
          {research.map(item => (
            <article
              key={item.slug}
              className="card hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col lg:flex-row gap-4 justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-brand-dark mb-2">{item.title}</h3>
                  <p className="text-sm text-brand-muted mb-3">{item.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.year && (
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {item.year}
                      </span>
                    )}
                    {item.client && (
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        Client: {item.client}
                      </span>
                    )}
                    {item.pdf && (
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        PDF Available
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex lg:flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.slug)}
                    className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-6 bg-brand-primary/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <p className="text-brand-muted text-lg mb-4">No research articles have been added yet.</p>
          <p className="text-brand-muted">Add your first research article to get started.</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-brand-dark">
                {editingItem ? 'Edit Research Article' : 'Add New Research Article'}
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
                  Slug * <span className="text-xs text-gray-500">(unique URL identifier, e.g., legal-reform-2025)</span>
                </label>
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  required
                  disabled={!!editingItem}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Summary *</label>
                <textarea
                  value={formData.summary || ''}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Year</label>
                <input
                  type="text"
                  value={formData.year || ''}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  placeholder="2025"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Client</label>
                <input
                  type="text"
                  value={formData.client || ''}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  PDF URL <span className="text-xs text-gray-500">(e.g., /research/article.pdf)</span>
                </label>
                <input
                  type="text"
                  value={formData.pdf || ''}
                  onChange={(e) => setFormData({ ...formData, pdf: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  Thumbnail URL <span className="text-xs text-gray-500">(e.g., /images/research/thumb.jpg)</span>
                </label>
                <input
                  type="text"
                  value={formData.thumbnail || ''}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  Tags <span className="text-xs text-gray-500">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={formData.tags?.join(', ') || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  placeholder="legal reform, policy, arbitration"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : editingItem ? 'Update Research Article' : 'Add Research Article'}
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
