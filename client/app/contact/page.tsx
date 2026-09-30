'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Send } from 'lucide-react';
import emailjs from '@emailjs/browser';
import PageHeader from '../../components/common/PageHeader';

type Fields = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;
const EMPTY: Fields = { name: '', email: '', subject: '', message: '' };
const SUPPORT_EMAIL = 'helptempmailnova@gmail.com';

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = 'Enter your name.';
  if (!f.email.trim()) e.email = 'Enter an email address so we can reply.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Enter a valid email address, like name@example.com.';
  if (!f.subject.trim()) e.subject = 'Enter a subject.';
  if (f.message.trim().length < 10) e.message = 'Write a message of at least 10 characters.';
  return e;
}

export default function ContactPage() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const update = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields(f => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors(err => ({ ...err, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(fields);
    setErrors(found);
    const firstInvalid = (Object.keys(found) as (keyof Fields)[])[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`#contact-${firstInvalid}`)?.focus();
      return;
    }
    setState('sending');
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_mdmhd9a',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_rjjc9al',
        { from_name: fields.name, from_email: fields.email, subject: fields.subject, message: fields.message, to_email: SUPPORT_EMAIL },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'ekuskUcrGiLPmY7gR',
      );
      setState('sent');
      setFields(EMPTY);
    } catch (error) {
      console.error('EmailJS submission error:', error);
      setState('failed'); // Keep what the person typed so they can retry or email us directly.
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const field = (key: keyof Fields, label: string, input: React.ReactNode, hint?: string) => (
    <div className="field">
      <label htmlFor={`contact-${key}`}>{label}</label>
      {input}
      {hint && <p className="hint" id={`contact-${key}-hint`}>{hint}</p>}
      {errors[key] && <p className="field-error" id={`contact-${key}-error`}>{errors[key]}</p>}
    </div>
  );
  const describedBy = (key: keyof Fields, hint = false) => [hint && `contact-${key}-hint`, errors[key] && `contact-${key}-error`].filter(Boolean).join(' ') || undefined;

  return (
    <div className="nova-public">
      <PageHeader
        crumbs={[{ name: 'Contact', path: '/contact' }]}
        kicker="CONTACT"
        title="Contact TempMail Nova"
        lede="Questions, bug reports, corrections to a guide, or abuse reports. We reply by email to the address you give us."
      />
      <div className="nova-container page-body">
        <div className="contact-grid">
          <div className="prose-nova">
            <h2>Before you write</h2>
            <ul>
              <li>Use an email address you will still be able to read. A temporary address may expire before we reply.</li>
              <li>Please do not include passwords, verification codes or personal documents.</li>
              <li>We cannot recover messages from a mailbox that has expired or been deleted.</li>
            </ul>
            <p>Many questions are already answered in the <Link href="/faq">FAQ</Link>.</p>
            <h2>Email us directly</h2>
            <p><a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p>
          </div>

          <div className="contact-panel">
            <div ref={statusRef} tabIndex={-1} aria-live="polite">
              {state === 'sent' && <p className="form-status success" style={{ marginBottom: 18 }}>Thanks, your message was sent. We will reply to the address you provided.</p>}
              {state === 'failed' && <p className="form-status error" style={{ marginBottom: 18 }}>Your message could not be sent. Please try again, or email us at <a href={`mailto:${SUPPORT_EMAIL}`} style={{ textDecoration: 'underline' }}>{SUPPORT_EMAIL}</a>.</p>}
            </div>
            <form ref={formRef} onSubmit={handleSubmit} className="nova-form" noValidate aria-label="Contact form">
              <div className="form-row">
                {field('name', 'Your name', <input id="contact-name" name="from_name" type="text" autoComplete="name" value={fields.name} onChange={update('name')} aria-invalid={!!errors.name} aria-describedby={describedBy('name')} required />)}
                {field('email', 'Your email', <input id="contact-email" name="from_email" type="email" autoComplete="email" inputMode="email" value={fields.email} onChange={update('email')} aria-invalid={!!errors.email} aria-describedby={describedBy('email')} required />)}
              </div>
              {field('subject', 'Subject', <input id="contact-subject" name="subject" type="text" value={fields.subject} onChange={update('subject')} aria-invalid={!!errors.subject} aria-describedby={describedBy('subject')} required />)}
              {field('message', 'Message', <textarea id="contact-message" name="message" rows={6} value={fields.message} onChange={update('message')} aria-invalid={!!errors.message} aria-describedby={describedBy('message', true)} required />, 'If you are reporting a problem, tell us what you did and what happened.')}
              <button type="submit" className="primary-link" disabled={state === 'sending'}>
                <Send size={16} aria-hidden="true" />{state === 'sending' ? 'Sending…' : 'Send message'}
              </button>
              <p className="hint" style={{ fontSize: 13, color: '#5f705a' }}>Messages are delivered through EmailJS. See our <Link href="/privacy" style={{ textDecoration: 'underline' }}>privacy policy</Link>.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
