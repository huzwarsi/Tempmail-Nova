'use client';
import { useState } from 'react';
import { Inbox, Mail, Search, RefreshCw, Paperclip, Check } from 'lucide-react';
import { useInbox } from '../../context/InboxContext';

export default function InboxList() {
  const { emails, setSelectedEmail, loading, isGenerating, fetchEmails, currentAddress, inboxError } = useInbox();
  const [search, setSearch] = useState('');
  const filtered = emails.filter(email => [email.subject, email.sender?.address, email.sender?.name].some(value => value?.toLowerCase().includes(search.toLowerCase())));
  return <section className="nova-inbox" aria-labelledby="inbox-heading">
    <div className="inbox-toolbar"><div className="inbox-title"><Inbox size={17} aria-hidden="true" /><h2 id="inbox-heading">Your inbox</h2><span className="inbox-count" aria-label={emails.length + ' messages'}>{emails.length}</span></div><div className="inbox-search"><label><span className="sr-only">Search inbox messages</span><Search size={14} aria-hidden="true" /><input type="search" placeholder="Search messages" value={search} onChange={event => setSearch(event.target.value)} /></label><button onClick={() => fetchEmails(currentAddress, true)} disabled={loading || !currentAddress} aria-label="Refresh inbox"><RefreshCw size={15} className={loading ? 'animate-spin' : ''} aria-hidden="true" /></button></div></div>
    <div className="inbox-columns" aria-hidden="true"><span>SENDER</span><span>SUBJECT</span><span>TIME</span></div>
    <div className="inbox-body" aria-busy={loading || isGenerating}>
      {filtered.length === 0 ? <div className="inbox-empty"><span className="inbox-empty-icon">{loading || isGenerating ? <RefreshCw size={22} className="animate-spin" aria-hidden="true" /> : <Mail size={23} aria-hidden="true" />}</span><h3>{isGenerating ? 'Creating your address...' : inboxError ? 'Unable to update your inbox' : search ? 'No matching messages' : !currentAddress ? 'Your inbox will appear here' : loading ? 'Checking for new mail...' : 'Waiting for your first email'}</h3><p>{inboxError ? 'Check your connection and try refreshing again.' : search ? 'Try another sender or subject.' : 'Copy your address, use it in a form, and come back here. New messages appear automatically.'}</p></div> : filtered.map(email => <button key={email._id} className={'inbox-message' + (!email.isRead ? ' unread' : '')} onClick={() => setSelectedEmail(email)}><span>{email.sender?.name || email.sender?.address || 'Unknown sender'}</span><span><strong>{email.subject || '(No subject)'}</strong><small>{email.isSpam ? 'Flagged as spam - ' : ''}{email.snippet}</small></span><span><time dateTime={email.createdAt}>{new Date(email.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</time>{email.attachmentsCount > 0 && <Paperclip size={12} aria-label="Has attachments" />}</span></button>)}
    </div>
    <div className="inbox-footer" role="status">{inboxError ? 'Connection issue - try Refresh inbox' : <><Check size={12} aria-hidden="true" />{currentAddress ? 'Checks for new messages every 5 seconds' : 'No signup needed to get started'}</>}</div>
  </section>;
}
