'use client';

import React from 'react';
import { Research } from '@/lib/types';

const emptyResearch: Research = {
  slug: '',
  title: '',
  summary: '',
  content: '',
  author: '',
  category: '',
  publishDate: '',
  tags: [],
  year: '',
  image: '',
  driveLink: '',
  pdf: '',
};

export default function AdminResearchManager() {
  const [items, setItems] = React.useState<Research[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<'add' | 'edit'>('add');
  const [formData, setFormData] = React.useState<Research>(emptyResearch);
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null);
  const [viewItem, setViewItem] = React.useState<Research | null>(null);

  const refresh = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/research', { method: 'GET' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch research');
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }, []);

  React.useEffect(() => { refresh(); }, [refresh]);

  const openAddModal = () => { setFormData(emptyResearch); setModalMode('add'); setIsModalOpen(true); };
  const openEditModal = (item: Research) => { setFormData(item); setModalMode('edit'); setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setFormData(emptyResearch); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/research', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Failed to ${modalMode} article`);
      setSuccess(`Article ${modalMode === 'add' ? 'added' : 'updated'} successfully!`);
      setTimeout(() => setSuccess(null), 3000);
      closeModal();
      await refresh();
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  const handleDelete = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/research?slug=${encodeURIComponent(slug)}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to delete article');
      setSuccess('Article deleted successfully!');
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
          <h2 className="text-2xl font-bold text-brand-dark">Research Articles</h2>
          <p className="text-brand-muted">{items.length} article{items.length !== 1 ? 's' : ''} total</p>
        </div>
        <button onClick={openAddModal} className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-lg shadow hover:bg-brand-primary/90 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Article
        </button>
      </div>

      {loading && items.length === 0 ? (
        <div className="text-center py-12 text-brand-muted">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-brand-primary/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <p className="text-brand-muted mb-2">No research articles yet</p>
          <button onClick={openAddModal} className="text-brand-primary hover:underline">Add your first article</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.slug} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-brand-dark line-clamp-2">{item.title}</h3>
              </div>
              {item.category && <span className="inline-block text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded-full mb-3">{item.category}</span>}
              <p className="text-sm text-brand-muted line-clamp-2 mb-3">{item.summary}</p>
              <div className="flex items-center gap-3 text-xs text-brand-muted mb-4">
                {item.author && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    {item.author}
                  </span>
                )}
                {(item.publishDate || item.year) && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {item.publishDate || item.year}
                  </span>
                )}
              </div>
              {item.driveLink && (
                <a href={item.driveLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-700 mb-3">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7.71 3.5L1.15 15l4.58 7.5h13.54l4.58-7.5L17.29 3.5H7.71zm.79 1.5h7l1.5 2.5H7l1.5-2.5zm-2.31 4h11.62l3.84 6.25-3.5 5.75H6.85l-3.5-5.75L5.19 9z"/></svg>
                  Google Drive
                </a>
              )}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <button onClick={() => setViewItem(item)} className="flex-1 px-3 py-2 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">View</button>
                <button onClick={() => openEditModal(item)} className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">Edit</button>
                <button onClick={() => setDeleteConfirm(item.slug)} className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b flex-shrink-0">
              <h3 className="text-xl font-semibold text-brand-dark">{modalMode === 'add' ? 'Add Article' : 'Edit Article'}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-brand-dark mb-1">Slug (URL) *</label>
                    <input type="text" required disabled={modalMode === 'edit'} value={formData.slug} onChange={e => setFormData(p => ({ ...p, slug: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary disabled:bg-gray-50" placeholder="article-slug" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-brand-dark mb-1">Title *</label>
                    <input type="text" required value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" placeholder="Article Title" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">Author</label>
                    <input type="text" value={formData.author || ''} onChange={e => setFormData(p => ({ ...p, author: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" placeholder="Author name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">Category</label>
                    <input type="text" value={formData.category || ''} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" placeholder="Legal / Policy" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">Publish Date / Year</label>
                    <input type="text" value={formData.publishDate || formData.year || ''} onChange={e => setFormData(p => ({ ...p, publishDate: e.target.value, year: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" placeholder="2025" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-dark mb-1">PDF URL</label>
                    <input type="text" value={formData.pdf || ''} onChange={e => setFormData(p => ({ ...p, pdf: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" placeholder="/research/file.pdf" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-brand-dark mb-1">Google Drive Link</label>
                    <input type="url" value={formData.driveLink || ''} onChange={e => setFormData(p => ({ ...p, driveLink: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" placeholder="https://drive.google.com/..." />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-brand-dark mb-1">Summary *</label>
                    <textarea required rows={3} value={formData.summary} onChange={e => setFormData(p => ({ ...p, summary: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" placeholder="Brief summary" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-brand-dark mb-1">Content</label>
                    <textarea rows={6} value={formData.content || ''} onChange={e => setFormData(p => ({ ...p, content: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" placeholder="Full article content..." />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button type="button" onClick={closeModal} className="px-6 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" disabled={loading} className="px-6 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50">{loading ? 'Saving...' : modalMode === 'add' ? 'Create Article' : 'Save Changes'}</button>
                </div>
              </form>
            </div>
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
              <h3 className="text-lg font-semibold text-brand-dark mb-2">Delete Article?</h3>
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b flex-shrink-0">
              <h3 className="text-xl font-semibold text-brand-dark">{viewItem.title}</h3>
              <button onClick={() => setViewItem(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              <div className="p-5 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {viewItem.category && <span className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full">{viewItem.category}</span>}
                  {(viewItem.publishDate || viewItem.year) && <span className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full">{viewItem.publishDate || viewItem.year}</span>}
                </div>
                {viewItem.author && (
                  <p className="text-sm text-brand-muted flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    By {viewItem.author}
                  </p>
                )}
                {viewItem.summary && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-brand-dark mb-1">Summary</p>
                    <p className="text-brand-muted">{viewItem.summary}</p>
                  </div>
                )}
                {viewItem.content && (
                  <div>
                    <p className="text-sm font-medium text-brand-dark mb-2">Content</p>
                    <div className="prose prose-sm max-w-none text-brand-muted whitespace-pre-wrap">{viewItem.content}</div>
                  </div>
                )}
                {viewItem.driveLink && (
                  <a href={viewItem.driveLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7.71 3.5L1.15 15l4.58 7.5h13.54l4.58-7.5L17.29 3.5H7.71zm.79 1.5h7l1.5 2.5H7l1.5-2.5zm-2.31 4h11.62l3.84 6.25-3.5 5.75H6.85l-3.5-5.75L5.19 9z"/></svg>
                    Open in Google Drive
                  </a>
                )}
                {viewItem.pdf && (
                  <a href={viewItem.pdf} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors ml-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Download PDF
                  </a>
                )}
                <div className="flex gap-3 pt-4 border-t">
                  <button onClick={() => { setViewItem(null); openEditModal(viewItem); }} className="flex-1 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">Edit Article</button>
                  <button onClick={() => setViewItem(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
