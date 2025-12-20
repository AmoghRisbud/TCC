'use client';

import React, { useState } from 'react';

export default function CVSubmissionForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSubmitStatus({
          type: 'error',
          message: 'File size must be less than 5MB',
        });
        return;
      }
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowedTypes.includes(file.type)) {
        setSubmitStatus({
          type: 'error',
          message: 'Please upload a PDF or Word document',
        });
        return;
      }
      setCvFile(file);
      setSubmitStatus({ type: null, message: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cvFile) {
      setSubmitStatus({
        type: 'error',
        message: 'Please attach your CV',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('cv', cvFile);

      const response = await fetch('/api/careers/submit-cv', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit CV');
      }

      setSubmitStatus({
        type: 'success',
        message: 'Your CV has been submitted successfully! We\'ll be in touch soon.',
      });
      
      // Reset form
      setFormData({ name: '', email: '', phone: '', message: '' });
      setCvFile(null);
      // Reset file input
      const fileInput = document.getElementById('cv') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to submit CV. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="h3 mb-6 text-center text-brand-dark">Submit Your CV</h2>
      
      {submitStatus.type && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            submitStatus.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-brand-dark mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-dark mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-brand-dark mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div>
          <label htmlFor="cv" className="block text-sm font-medium text-brand-dark mb-2">
            Upload CV <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="file"
              id="cv"
              name="cv"
              required
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20 cursor-pointer"
            />
          </div>
          {cvFile && (
            <p className="mt-2 text-sm text-green-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {cvFile.name} ({(cvFile.size / 1024).toFixed(1)} KB)
            </p>
          )}
          <p className="mt-1 text-xs text-brand-muted">
            Accepted formats: PDF, DOC, DOCX (Max 5MB)
          </p>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-brand-dark mb-2">
            Message to Hiring Manager <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            value={formData.message}
            onChange={handleInputChange}
            rows={6}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all resize-none"
            placeholder="Tell us about yourself, your experience, and why you'd like to work with TCC..."
          />
          <p className="mt-1 text-xs text-brand-muted">
            Include a brief introduction and why you&apos;re interested in working with us
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Submit CV
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
