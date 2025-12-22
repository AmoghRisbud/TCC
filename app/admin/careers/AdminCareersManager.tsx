'use client';

import React from 'react';
import { Job } from '@/lib/types';

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

const emptyJob: Job = {
  slug: '',
  title: '',
  department: '',
  location: '',
  category: 'tcc',
  type: 'Full-time',
  description: '',
  requirements: [],
  responsibilities: [],
  applyEmail: '',
  closingDate: '',
  status: 'Open',
  salaryRange: ''
};

export default function AdminCareersManager() {
  const [items, setItems] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [dateError, setDateError] = React.useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<'add' | 'edit'>('add');
  const [formData, setFormData] = React.useState<Job>(emptyJob);
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null);
  const [viewItem, setViewItem] = React.useState<Job | null>(null);

  // Helper state for array fields input
  const [requirementsInput, setRequirementsInput] = React.useState('');
  const [responsibilitiesInput, setResponsibilitiesInput] = React.useState('');

  const refresh = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/careers', { method: 'GET' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch jobs');
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }, []);

  React.useEffect(() => { refresh(); }, [refresh]);

  const openAddModal = () => { 
    setFormData(emptyJob); 
    setRequirementsInput('');
    setResponsibilitiesInput('');
    setModalMode('add'); 
    setIsModalOpen(true); 
  };

  const openEditModal = (item: Job) => { 
    setFormData(item); 
    setRequirementsInput(item.requirements?.join('\n') || '');
    setResponsibilitiesInput(item.responsibilities?.join('\n') || '');
    setModalMode('edit'); 
    setIsModalOpen(true); 
  };

  const closeModal = () => { 
    setIsModalOpen(false); 
    setFormData(emptyJob); 
    setDateError(null);
  };

  const validateClosingDate = (closingDate: string) => {
    if (closingDate) {
      const closing = new Date(closingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (closing < today) {
        setDateError('Closing date cannot be in the past');
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
      
      // Validate closing date
      if (!validateClosingDate(formData.closingDate || '')) {
        setLoading(false);
        return;
      }
      
      // Process array inputs
      const processedData = {
        ...formData,
        slug: modalMode === 'add' ? generateSlug(formData.title) : formData.slug,
        requirements: requirementsInput.split('\n').filter(line => line.trim() !== ''),
        responsibilities: responsibilitiesInput.split('\n').filter(line => line.trim() !== '')
      };

      const method = modalMode === 'add' ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/careers', { 
        method, 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(processedData) 
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Failed to ${modalMode} job`);
      
      setSuccess(`Job ${modalMode === 'add' ? 'added' : 'updated'} successfully!`);
      setTimeout(() => setSuccess(null), 3000);
      closeModal();
      await refresh();
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  const handleDelete = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/careers?slug=${encodeURIComponent(slug)}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to delete job');
      setSuccess('Job deleted successfully!');
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

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-dark">Job Listings</h2>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors flex items-center gap-2"
        >
          <span>+</span> Add New Job
        </button>
      </div>

      {loading && items.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Loading jobs...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 mb-4">No job listings found.</p>
          <button onClick={openAddModal} className="text-brand-primary hover:underline">Create your first job listing</button>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item.slug} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-brand-dark">{item.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {item.status}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700">
                    {item.type}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{item.department} • {item.location}</p>
                <p className="text-gray-500 text-sm line-clamp-2">{item.description}</p>
              </div>
              <div className="flex items-center gap-2 md:self-center">
                <button
                  onClick={() => setViewItem(item)}
                  className="p-2 text-gray-500 hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors"
                  title="View Details"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 00 2 2h11a2 2 0 00 2-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => setDeleteConfirm(item.slug)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
              <h3 className="text-xl font-bold text-brand-dark">
                {modalMode === 'add' ? 'Add New Job' : 'Edit Job'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="overflow-y-auto flex-1">
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position ID *</label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={e => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      placeholder="e.g., senior-legal-associate"
                    />
                    <p className="text-xs text-gray-500 mt-1">Unique identifier for this position</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                  >
                    <option value="tcc">Careers with TCC</option>
                    <option value="law">Careers in Law</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Select "Careers with TCC" for internal team positions, or "Careers in Law" for internships and legal career opportunities
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input
                      type="text"
                      value={formData.department || ''}
                      onChange={e => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={formData.type || 'Full-time'}
                      onChange={e => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Volunteer">Volunteer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status || 'Open'}
                      onChange={e => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    >
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={4}
                    value={formData.description || ''}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (one per line)</label>
                    <textarea
                      rows={4}
                      value={requirementsInput}
                      onChange={e => setRequirementsInput(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      placeholder="- Law degree&#10;- 3+ years experience"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities (one per line)</label>
                    <textarea
                      rows={4}
                      value={responsibilitiesInput}
                      onChange={e => setResponsibilitiesInput(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      placeholder="- Legal research&#10;- Client consultation"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apply Email</label>
                    <input
                      type="email"
                      value={formData.applyEmail || ''}
                      onChange={e => setFormData({ ...formData, applyEmail: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Closing Date</label>
                    <input
                      type="date"
                      value={formData.closingDate || ''}
                      onChange={e => {
                        const newClosingDate = e.target.value;
                        setFormData({ ...formData, closingDate: newClosingDate });
                        validateClosingDate(newClosingDate);
                      }}
                      className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary ${
                        dateError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {dateError && (
                      <p className="text-xs text-red-600 mt-1">{dateError}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : modalMode === 'add' ? 'Create Job' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-brand-dark mb-2">Delete Job Listing?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this job listing? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
              <h3 className="text-xl font-bold text-brand-dark">Job Details</h3>
              <button onClick={() => setViewItem(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="overflow-y-auto flex-1">
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-brand-dark">{viewItem.title}</h2>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      viewItem.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {viewItem.status}
                    </span>
                  </div>
                  <p className="text-gray-600">{viewItem.department} • {viewItem.location} • {viewItem.type}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-brand-dark mb-2">Description</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{viewItem.description}</p>
                </div>

                {viewItem.requirements && viewItem.requirements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-brand-dark mb-2">Requirements</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {viewItem.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {viewItem.responsibilities && viewItem.responsibilities.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-brand-dark mb-2">Responsibilities</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {viewItem.responsibilities.map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-sm text-gray-500 block">Apply Email</span>
                    <span className="text-brand-dark">{viewItem.applyEmail || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block">Closing Date</span>
                    <span className="text-brand-dark">{viewItem.closingDate || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => { setViewItem(null); openEditModal(viewItem); }}
                    className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
                  >
                    Edit Job
                  </button>
                  <button
                    onClick={() => setViewItem(null)}
                    className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
