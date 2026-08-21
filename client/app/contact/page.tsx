'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, PhoneCall, Globe } from 'lucide-react';
import emailjs from '@emailjs/browser';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_mdmhd9a';
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_rjjc9al';
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'ekuskUcrGiLPmY7gR';

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: name,
          from_email: email,
          subject: subject,
          message: message,
          to_email: 'helptempmailnova@gmail.com',
        },
        publicKey
      );
    } catch (error) {
      console.error('EmailJS Submission Error:', error);
    } finally {
      setLoading(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 font-manrope">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-xs font-bold mb-3 font-mono">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>GET IN TOUCH</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Contact Us & Support</h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
          Have questions or feedback? Send us a message below and we will get back to you shortly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Side Cards */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#080d16]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-emerald-500/25 space-y-2 shadow-md dark:shadow-lg">
            <Mail className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Email Support</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono-code">helptempmailnova@gmail.com</p>
          </div>

          <div className="bg-white dark:bg-[#080d16]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-emerald-500/25 space-y-2 shadow-md dark:shadow-lg">
            <Globe className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Help Center</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono-code">helptempmailnova@gmail.com</p>
          </div>

          <div className="bg-white dark:bg-[#080d16]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-emerald-500/25 space-y-2 shadow-md dark:shadow-lg">
            <PhoneCall className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Response Time</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">Within 24 Hours</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-white dark:bg-[#080d16]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-emerald-500/25 shadow-xl">
          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Message Sent Successfully!</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Thank you for reaching out. Our support team will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase mb-1">Your Name</label>
                  <input
                    id="contact-name"
                    name="from_name"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#04070d] border border-slate-300 dark:border-emerald-500/40 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono-code"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase mb-1">Email Address</label>
                  <input
                    id="contact-email"
                    name="from_email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#04070d] border border-slate-300 dark:border-emerald-500/40 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono-code"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase mb-1">Subject</label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  required
                  placeholder="e.g. Inquiry about temporary mail services"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#04070d] border border-slate-300 dark:border-emerald-500/40 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase mb-1">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#04070d] border border-slate-300 dark:border-emerald-500/40 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-gradient-to-r dark:from-emerald-500 dark:to-teal-400 font-bold text-white dark:text-slate-950 transition text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
