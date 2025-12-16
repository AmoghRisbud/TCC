'use client';

import { useState } from 'react';
import { GalleryItem } from '../../../lib/types';
import Image from 'next/image';

interface GalleryManagementProps {
  initialItems: GalleryItem[];
}

export default function GalleryManagement({ initialItems }: GalleryManagementProps) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState<Partial<GalleryItem>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleAdd = () => {
    setFormData({ album: 'events' });
    setIsAddModalOpen(true);
  };

  const handleEdit = (item: GalleryItem) => {
    setFormData(item);
    setEditingItem(item);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/gallery?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete gallery item');

      setItems(items.filter(item => item.id !== id));
      showMessage('success', 'Gallery item deleted successfully');
    } catch (error) {
      showMessage('error', 'Failed to delete gallery item');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save gallery item');

      const result = await response.json();
      
      // Refresh the list
      const updatedResponse = await fetch('/api/admin/gallery');
      const updatedItems = await updatedResponse.json();
      setItems(updatedItems);

      setIsAddModalOpen(false);
      setEditingItem(null);
      setFormData({});
      showMessage('success', editingItem ? 'Gallery item updated successfully' : 'Gallery item added successfully');
    } catch (error) {
      showMessage('error', 'Failed to save gallery item');
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
          <span className="font-medium">Add New Gallery Item</span>
        </button>
      </div>

      {/* Gallery Items Grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <article
              key={item.id}
              className="card hover:shadow-lg transition-shadow duration-300"
            >
              {item.image && (
                <div className="mb-4 relative h-48 bg-gray-200 rounded-lg overflow-hidden">
                  <Image 
                    src={item.image} 
                    alt={item.altText || item.title} 
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <h3 className="font-semibold text-brand-dark mb-2">{item.title}</h3>
              {item.description && <p className="text-sm text-brand-muted mb-3">{item.description}</p>}
              <div className="flex flex-wrap gap-2 mb-4">
                {item.album && (
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    {item.album}
                  </span>
                )}
                {item.date && (
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    {item.date}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-6 bg-brand-primary/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-brand-muted text-lg mb-4">No gallery items have been added yet.</p>
          <p className="text-brand-muted">Add your first gallery item to get started.</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-brand-dark">
                {editingItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
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
                  ID * <span className="text-xs text-gray-500">(unique identifier, e.g., event-2025-01)</span>
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
                <label className="block text-sm font-medium text-brand-dark mb-1">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  Image URL * <span className="text-xs text-gray-500">(e.g., /images/media/event.jpg)</span>
                </label>
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Alt Text</label>
                <input
                  type="text"
                  value={formData.altText || ''}
                  onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Album</label>
                <select
                  value={formData.album || 'events'}
                  onChange={(e) => setFormData({ ...formData, album: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  <option value="events">Events</option>
                  <option value="workshops">Workshops</option>
                  <option value="projects">Projects</option>
                  <option value="team">Team</option>
                </select>
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
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : editingItem ? 'Update Gallery Item' : 'Add Gallery Item'}
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
