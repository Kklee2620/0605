import React, { useState } from 'react';
import { Button } from '../components/Button';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For V1, this is a mock submission.
    alert('Thank you for your message! (This is a demo, your message was not actually sent).');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Contact Us</h1>
          
          <p className="text-gray-700 leading-relaxed mb-8 text-center">
            Have a question or feedback? We'd love to hear from you! Reach out through the form below or contact us directly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-indigo-700">Email Us</h3>
                <a href="mailto:support@modernstore.example.com" className="text-gray-600 hover:text-indigo-600">support@modernstore.example.com</a>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-indigo-700">Call Us (Mon-Fri, 9am-5pm)</h3>
                <p className="text-gray-600">+1 (555) 123-4567 (Mock Number)</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-indigo-700">Visit Us (By Appointment)</h3>
                <p className="text-gray-600">123 Modern Ave, Suite 100<br/>Cityville, ST 54321 (Mock Address)</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
              </div>
              <div>
                <label htmlFor="email_contact" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" name="email" id="email_contact" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea name="message" id="message" rows={4} value={formData.message} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"></textarea>
              </div>
              <div>
                <Button type="submit" variant="primary" className="w-full">
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};