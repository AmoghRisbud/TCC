'use client';

import React from 'react';

interface GalleryItem {
  id: string;
  title: string;
  image: string;
  description?: string;
  category?: string;
  date?: string;
  featured?: boolean;
}

const emptyItem: GalleryItem = {
  id: '',
  title: '',
  image: '',
  description: '',
  category: '',
  date: '',
  featured: false,
};

export default function AdminGalleryManager() {
  const [items, setItems] = React.useState<GalleryItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<'add' | 'edit'>('add');
  const [formData, setFormData] = React.useState<GalleryItem>(emptyItem);
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null);
  const [viewItem, setViewItem] = React.useState<GalleryItem | null>(null);

  const refresh = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/gallery', { method: 'GET' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch gallery');
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }, []);

  React.useEffect(() => { refresh(); }, [refresh]);

  const openAddModal = () => { setFormData(emptyItem); setModalMode('add'); setIsModalOpen(true); };
  const openEditModal = (item: GalleryItem) => { setFormData(item); setModalMode('edit'); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setFormData(emptyItem); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/gallery', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Failed to ${modalMode} item`);
      setSuccess(`Gallery item ${modalMode === 'add' ? 'added' : 'updated'} successfully!`);
      setTimeout(() => setSuccess(null), 3000);
      closeModal();
      await refresh();
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/gallery?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to delete item');
      setSuccess('Gallery item deleted successfully!');
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
          <h2 className="text-2xl font-bold text-brand-dark">Gallery</h2>
          <p className="text-brand-muted">{items.length} item{items.length !== 1 ? 's' : ''} total</p>
        </div>
        <button onClick={openAddModal} className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-lg shadow hover:bg-brand-primary/90 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Image
        </button>
      </div>

      {loading && items.length === 0 ? (
        <div className="text-center py-12 text-brand-muted">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-brand-primary/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <p className="text-brand-muted mb-2">No gallery items yet</p>
          <button onClick={openAddModal} className="text-brand-primary hover:underline">Add your first image</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative aspect-video bg-gray-100">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
                {item.featured && (
                  <span className="absolute top-2 right-2 px-2 py-1 text-xs bg-yellow-400 text-yellow-900 rounded-full font-medium">Featured</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-brand-dark text-sm line-clamp-1 mb-1">{item.title}</h3>
                {item.category && <span className="inline-block text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full mb-2">{item.category}</span>}
                {item.description && <p className="text-xs text-brand-muted line-clamp-2 mb-2">{item.description}</p>}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button onClick={() => setViewItem(item)} className="flex-1 px-2 py-1.5 text-xs bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">View</button>
                  <button onClick={() => openEditModal(item)} className="flex-1 px-2 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">Edit</button>
                  <button onClick={() => setDeleteConfirm(item.id)} className="flex-1 px-2 py-1.5 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-xl font-semibold text-brand-dark">{modalMode === 'add' ? 'Add Image' : 'Edit Image'}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">ID *</label>
                <input type="text" required disabled={modalMode === 'edit'} value={formData.id} onChange={e => setFormData(p => ({ ...p, id: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary disabled:bg-gray-50" placeholder="unique-id" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Title *</label>
                <input type="text" required value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" placeholder="Image title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Image URL *</label>
                <input type="text" required value={formData.image} onChange={e => setFormData(p => ({ ...p, image: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" placeholder="/images/gallery/..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">Category</label>
                  <input type="text" value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" placeholder="Event" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">Date</label>
                  <input type="date" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Description</label>
                <textarea rows={2} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary resize-none" placeholder="Brief description" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" checked={formData.featured || false} onChange={e => setFormData(p => ({ ...p, featured: e.target.checked }))} className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary/20" />
                <label htmlFor="featured" className="text-sm text-brand-dark">Featured image</label>
              </div>
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
              <h3 className="text-lg font-semibold text-brand-dark mb-2">Delete Image?</h3>
              <p className="text-brand-muted mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} disabled={loading} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">{loading ? 'Deleting...' : 'Delete'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setViewItem(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white">
              <h3 className="text-xl font-semibold text-brand-dark">{viewItem.title}</h3>
              <button onClick={() => setViewItem(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-5 space-y-4">
              {viewItem.image && (
                <img src={viewItem.image} alt={viewItem.title} className="w-full max-h-96 object-contain rounded-lg bg-gray-100" />
              )}
              <div className="flex flex-wrap gap-2">
                {viewItem.featured && <span className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">Featured</span>}
                {viewItem.category && <span className="text-xs px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">{viewItem.category}</span>}
                {viewItem.date && <span className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full">{viewItem.date}</span>}
              </div>
              {viewItem.description && (
                <div>
                  <p className="text-sm font-medium text-brand-dark mb-1">Description</p>
                  <p className="text-brand-muted">{viewItem.description}</p>
                </div>
              )}
              <div className="text-xs text-brand-muted">
                <span className="font-medium">ID:</span> {viewItem.id}
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <button onClick={() => { setViewItem(null); openEditModal(viewItem); }} className="flex-1 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">Edit Image</button>
                <button onClick={() => setViewItem(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
