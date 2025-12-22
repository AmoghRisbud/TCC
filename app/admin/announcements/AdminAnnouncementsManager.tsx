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

interface Announcement {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
}

const emptyAnnouncement: Announcement = {
  id: '',
  slug: '',
  title: '',
  description: '',
  image: '/images/announcements/sample.jpeg',
  date: new Date().toISOString().split('T')[0],
};

export default function AdminAnnouncementsManager() {
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<'add' | 'edit'>('add');
  const [formData, setFormData] = React.useState<Announcement>(emptyAnnouncement);
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/announcements', { method: 'GET' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch announcements');
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { refresh(); }, [refresh]);

  const openAddModal = () => {
    setFormData({ ...emptyAnnouncement, date: new Date().toISOString().split('T')[0] });
    setModalMode('add');
    setIsModalOpen(true);
  };

  const openEditModal = (announcement: Announcement) => {
    setFormData(announcement);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData(emptyAnnouncement);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Auto-generate slug from title if adding new announcement
      const dataToSubmit = modalMode === 'add' 
        ? { ...formData, slug: generateSlug(formData.title), id: generateSlug(formData.title) }
        : formData;
      
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/announcements', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Failed to ${modalMode} announcement`);
      setSuccess(`Announcement ${modalMode === 'add' ? 'added' : 'updated'} successfully!`);
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
      const res = await fetch(`/api/admin/announcements?slug=${encodeURIComponent(slug)}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to delete announcement');
      setSuccess('Announcement deleted successfully!');
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
          <h2 className="text-2xl font-bold text-brand-dark">Announcements</h2>
          <p className="text-brand-muted">{announcements.length} announcement{announcements.length !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-lg shadow hover:bg-brand-primary/90 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Announcement
        </button>
      </div>

      {loading && announcements.length === 0 ? (
        <div className="text-center py-12 text-brand-muted">Loading...</div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-brand-muted mb-4">No announcements yet.</p>
          <button onClick={openAddModal} className="text-brand-primary hover:underline">
            Add your first announcement
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <img 
                  src={announcement.image} 
                  alt={announcement.title}
                  className="w-32 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-brand-dark">{announcement.title}</h3>
                  <p className="text-sm text-brand-muted mt-1 line-clamp-2">{announcement.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-brand-muted">{announcement.date}</span>
                    <span className="text-xs text-brand-muted">Slug: {announcement.slug}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(announcement)}
                    className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(announcement.slug)}
                    className="px-3 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-brand-dark">
                {modalMode === 'add' ? 'Add New Announcement' : 'Edit Announcement'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary"
                  placeholder="Campus Ambassador Program"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  Description
                </label>
                <RichTextEditor 
                  value={formData.description} 
                  onChange={(value) => setFormData({ ...formData, description: value })} 
                  placeholder="Brief description of the announcement..." 
                  height="200px"
                />
              </div>

              <ImageUpload
                currentImage={formData.image}
                category="announcements"
                onImageChange={(url) => setFormData({ ...formData, image: url })}
                label="Announcement Image"
              />

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : modalMode === 'add' ? 'Add Announcement' : 'Update Announcement'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full m-4 p-6">
            <h3 className="text-xl font-bold text-brand-dark mb-3">Confirm Delete</h3>
            <p className="text-brand-muted mb-6">
              Are you sure you want to delete this announcement? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
