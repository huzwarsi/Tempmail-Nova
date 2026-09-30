'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import API from '../lib/api';
import { trackEvent } from '../lib/analytics';
import { getSocket } from '../lib/socket';

interface InboxContextType {
  currentAddress: string;
  setCurrentAddress: (addr: string) => void;
  inboxDetails: any;
  emails: any[];
  selectedEmail: any;
  setSelectedEmail: (email: any) => void;
  availableDomains: any[];
  loading: boolean;
  isGenerating: boolean;
  newEmailNotice: boolean;
  inboxError: string;
  generateRandomInbox: (source?: 'automatic' | 'new_address' | 'after_delete') => Promise<void>;
  createCustomInbox: (customUsername: string, requestedDomain: string) => Promise<any>;
  deleteCurrentInbox: () => Promise<void>;
  fetchEmails: (address: string, showLoading?: boolean) => Promise<void>;
}

const InboxContext = createContext<InboxContextType>({
  currentAddress: '',
  setCurrentAddress: () => {},
  inboxDetails: null,
  emails: [],
  selectedEmail: null,
  setSelectedEmail: () => {},
  availableDomains: [],
  loading: false,
  isGenerating: false,
  newEmailNotice: false,
  inboxError: '',
  generateRandomInbox: async () => {},
  createCustomInbox: async () => {},
  deleteCurrentInbox: async () => {},
  fetchEmails: async () => {},
});

export const InboxProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentAddress, setCurrentAddress] = useState<string>('');
  const [inboxDetails, setInboxDetails] = useState<any>(null);
  const [emails, setEmails] = useState<any[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [availableDomains, setAvailableDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [newEmailNotice, setNewEmailNotice] = useState<boolean>(false);

  const [inboxError, setInboxError] = useState('');
  const knownMessages = useRef(new Map<string, Set<string>>());
  const initialized = useRef(false);
  // Seed restored mail without counting it as a new delivery; deduplicate socket/poll events.
  const observeMessages = useCallback((address: string, messages: any[]) => {
    const known = knownMessages.current.get(address);
    if (known) messages.forEach(message => { if (!known.has(message._id)) trackEvent('receive_email'); });
    const next = known || new Set<string>();
    messages.forEach(message => next.add(message._id));
    knownMessages.current.set(address, next);
    if (knownMessages.current.size > 10) knownMessages.current.delete(knownMessages.current.keys().next().value!);
  }, []);

  // Play notification ping
  const playNotificationPing = () => {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // Audio context fallback
    }
  };

  // Fetch public domains
  const fetchDomains = useCallback(async () => {
    try {
      const { data } = await API.get('/domain/public');
      setAvailableDomains(data.domains || []);
    } catch (err) {
      console.warn('Failed to load public domains');
    }
  }, []);

  // Fetch emails for address
  const fetchEmails = useCallback(async (address: string, showLoading = true) => {
    if (!address) return;
    if (showLoading) setLoading(true);
    try {
      const { data } = await API.get(`/email/inbox/${address}`);
      observeMessages(address, data.emails || []);
      setEmails(data.emails || []);
      setInboxError('');
      if (showLoading && initialized.current) trackEvent('refresh_inbox');
    } catch (err) {
      setInboxError('Could not load messages. Please refresh your inbox.');
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [observeMessages]);

  // Generate random new inbox
  const generateRandomInbox = async (source: 'automatic' | 'new_address' | 'after_delete' = 'automatic') => {
    setInboxError('');
    setIsGenerating(true);
    setLoading(true);
    setEmails([]);
    setSelectedEmail(null);
    try {
      const { data } = await API.post('/inbox/random', {});
      setCurrentAddress(data.inbox.address);
      setInboxDetails(data.inbox);
      if (typeof window !== 'undefined') {
        localStorage.setItem('tempmail_current_address', data.inbox.address);
      }
      await fetchEmails(data.inbox.address, false);
      trackEvent('generate_email', { source });
      if (source === 'new_address') trackEvent('create_new_address');
    } catch (err) {
      setInboxError('Could not create an address. Please try again.');
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  };

  // Create custom inbox
  const createCustomInbox = async (customUsername: string, requestedDomain: string) => {
    setIsGenerating(true);
    setLoading(true);
    setEmails([]);
    setSelectedEmail(null);
    try {
      const { data } = await API.post('/inbox/custom', {
        customUsername,
        requestedDomain,
      });
      setCurrentAddress(data.inbox.address);
      setInboxDetails(data.inbox);
      if (typeof window !== 'undefined') {
        localStorage.setItem('tempmail_current_address', data.inbox.address);
      }
      await fetchEmails(data.inbox.address, false);
      trackEvent('generate_email', { source: 'custom' });
      return data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  };

  // Delete current inbox
  const deleteCurrentInbox = async () => {
    if (!currentAddress) return;
    setIsGenerating(true);
    setLoading(true);
    setEmails([]);
    setSelectedEmail(null);
    try {
      await API.delete(`/inbox/${currentAddress}`);
      await generateRandomInbox('after_delete');
    } catch (err) {
      setInboxError('Could not delete this inbox. Please try again.');
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  };

  // Mount initialization: restore saved address from LocalStorage or generate new one
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    fetchDomains();

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tempmail_current_address');
      if (saved) {
        setCurrentAddress(saved);
        fetchEmails(saved, false);
      } else {
        generateRandomInbox();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Socket.io subscription + polling effect
  useEffect(() => {
    if (!currentAddress) return;

    const socket = getSocket();
    if (socket) {
      socket.emit('join_inbox', currentAddress);

      const handleNewEmail = (newEmail: any) => {
        if (newEmail.inboxAddress?.toLowerCase() === currentAddress?.toLowerCase()) {
          observeMessages(currentAddress, [newEmail]);
          setEmails((prev) => prev.some(email => email._id === newEmail._id) ? prev : [newEmail, ...prev]);
          setNewEmailNotice(true);
          playNotificationPing();
          setTimeout(() => setNewEmailNotice(false), 5000);
        }
      };

      socket.on('email_received', handleNewEmail);

      const pollInterval = setInterval(() => {
        fetchEmails(currentAddress, false);
      }, 5000);

      return () => {
        socket.emit('leave_inbox', currentAddress);
        socket.off('email_received', handleNewEmail);
        clearInterval(pollInterval);
      };
    }
  }, [currentAddress, fetchEmails, observeMessages]);

  return (
    <InboxContext.Provider
      value={{
        currentAddress,
        setCurrentAddress,
        inboxDetails,
        emails,
        selectedEmail,
        setSelectedEmail,
        availableDomains,
        loading,
        isGenerating,
        newEmailNotice,
        inboxError,
        generateRandomInbox,
        createCustomInbox,
        deleteCurrentInbox,
        fetchEmails,
      }}
    >
      {children}
    </InboxContext.Provider>
  );
};

export const useInbox = () => useContext(InboxContext);
