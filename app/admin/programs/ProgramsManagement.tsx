'use client';

import { useState } from 'react';
import { Program } from '../../../lib/types';
import Image from 'next/image';

interface ProgramsManagementProps {
  initialPrograms: Program[];
}

export default function ProgramsManagement({ initialPrograms }: ProgramsManagementProps) {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState<Partial<Program>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleAdd = () => {
    setFormData({ category: 'Learning', featured: false, status: 'active' });
    setIsAddModalOpen(true);
  };

  const handleEdit = (program: Program) => {
    setFormData(program);
    setEditingProgram(program);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/programs?slug=${slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete program');

      setPrograms(programs.filter(p => p.slug !== slug));
      showMessage('success', 'Program deleted successfully');
    } catch (error) {
      showMessage('error', 'Failed to delete program');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/programs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save program');

      const result = await response.json();
      
      // Refresh the list
      const updatedResponse = await fetch('/api/admin/programs');
      const updatedPrograms = await updatedResponse.json();
      setPrograms(updatedPrograms);

      setIsAddModalOpen(false);
      setEditingProgram(null);
      setFormData({});
      showMessage('success', editingProgram ? 'Program updated successfully' : 'Program added successfully');
    } catch (error) {
      showMessage('error', 'Failed to save program');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingProgram(null);
    setFormData({});
  };

  const isModalOpen = isAddModalOpen || editingProgram !== null;

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
          <span className="font-medium">Add New Program</span>
        </button>
      </div>

      {/* Programs Grid */}
      {programs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map(program => (
            <article
              key={program.slug}
              className="card-interactive flex flex-col justify-between p-6 bg-gradient-to-br from-[#FAF8F2] via-brand-light to-[#F3EFE3] rounded-lg shadow-md ring-1 ring-black/10 hover:shadow-xl hover:ring-brand-secondary/40 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 w-16 h-16 rounded-xl bg-white/80 flex items-center justify-center">
                  {program.logo && (
                    <Image src={program.logo} alt={`${program.title} logo`} width={40} height={40} className="object-contain" />
                  )}
                </div>
                <h3 className="h3 mb-2 text-brand-dark">{program.title}</h3>
                <p className="text-sm text-brand-muted line-clamp-2 mb-3">{program.shortDescription}</p>
                {program.featured && (
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 mb-2">
                    Featured
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={() => handleEdit(program)}
                  className="w-full px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(program.slug)}
                  className="w-full px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-brand-muted text-lg mb-4">No programs have been added yet.</p>
          <p className="text-brand-muted">Add your first program to get started.</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-brand-dark">
                {editingProgram ? 'Edit Program' : 'Add New Program'}
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
                  Slug * <span className="text-xs text-gray-500">(unique URL identifier, e.g., arbitration-law)</span>
                </label>
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  required
                  disabled={!!editingProgram}
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
                <label className="block text-sm font-medium text-brand-dark mb-1">Short Description *</label>
                <textarea
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  rows={2}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Full Description</label>
                <textarea
                  value={formData.fullDescription || ''}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Category *</label>
                <select
                  value={formData.category || 'Learning'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  required
                >
                  <option value="Learning">Learning</option>
                  <option value="Engagement">Engagement</option>
                  <option value="Service">Service</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  Logo URL <span className="text-xs text-gray-500">(e.g., /images/programs/logo.png)</span>
                </label>
                <input
                  type="text"
                  value={formData.logo || ''}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">Start Date</label>
                  <input
                    type="text"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    placeholder="2025-01-15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">End Date</label>
                  <input
                    type="text"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    placeholder="2025-03-15"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">Mode</label>
                  <select
                    value={formData.mode || ''}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  >
                    <option value="">Select Mode</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured || false}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                  />
                  <span className="text-sm font-medium text-brand-dark">Featured Program</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Status</label>
                <select
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : editingProgram ? 'Update Program' : 'Add Program'}
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
