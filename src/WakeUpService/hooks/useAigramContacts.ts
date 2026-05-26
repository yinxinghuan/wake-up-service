// Ported from spot-diff-s2 with minor adjustments — pads to MAX_CONTACTS
// with demo data so the picker is always full, and never throws.

import { useEffect, useState } from 'react';
import type { AigramContact } from '../types';

const MAX_CONTACTS = 6;

const DEMO_CONTACTS: AigramContact[] = [
  { telegram_id: 'demo1', name: 'Algram',     head_url: '' },
  { telegram_id: 'demo2', name: 'Jenny',      head_url: '' },
  { telegram_id: 'demo3', name: 'JM·F',       head_url: '' },
  { telegram_id: 'demo4', name: 'ghostpixel', head_url: '' },
  { telegram_id: 'demo5', name: 'Isaya',      head_url: '' },
  { telegram_id: 'demo6', name: 'Isabel',     head_url: '' },
];

function urlParams(): { apiOrigin: string | null; telegramId: string | null } {
  const p = new URLSearchParams(window.location.search);
  return {
    apiOrigin: p.get('api_origin'),
    telegramId: p.get('telegram_id'),
  };
}

function postMessageCall(
  apiOrigin: string,
  url: string,
  timeoutMs = 8000,
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const requestId = crypto.randomUUID();
    const payload = {
      url,
      method: 'GET',
      data: null,
      request_id: requestId,
      emitter: window.location.origin,
    };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));

    const timer = setTimeout(() => {
      window.removeEventListener('message', handler);
      reject(new Error('API timeout'));
    }, timeoutMs);

    function handler(event: MessageEvent) {
      if (typeof event.data !== 'string') return;
      if (!event.data.startsWith('callAPIResult-')) return;
      try {
        const raw = event.data.slice('callAPIResult-'.length);
        const result = JSON.parse(decodeURIComponent(escape(atob(raw))));
        if (result.request_id !== requestId) return;
        clearTimeout(timer);
        window.removeEventListener('message', handler);
        if (!result.success) {
          reject(new Error(result.error || 'API error'));
          return;
        }
        resolve(result.data);
      } catch {
        /* ignore */
      }
    }

    window.addEventListener('message', handler);
    window.parent.postMessage(`callAPI-${encoded}`, apiOrigin);
  });
}

async function fetchUserName(
  apiOrigin: string,
  telegramId: string,
): Promise<string | null> {
  try {
    const data = (await postMessageCall(
      apiOrigin,
      `/note/telegram/user/get/info/by/telegram_id?telegram_id=${telegramId}`,
      5000,
    )) as { name?: string } | null;
    return data?.name || null;
  } catch {
    return null;
  }
}

async function fetchContacts(
  apiOrigin: string,
  telegramId: string,
): Promise<AigramContact[]> {
  const data = (await postMessageCall(
    apiOrigin,
    `/note/telegram/user/contact/list?telegram_id=${telegramId}`,
    10000,
  )) as Array<{
    telegram_id: string;
    name?: string;
    head_url?: string;
  }> | null;

  const raw: AigramContact[] = (Array.isArray(data) ? data : [])
    .slice(0, MAX_CONTACTS)
    .map((u) => ({
      telegram_id: String(u.telegram_id),
      name: u.name || '',
      head_url: u.head_url || '',
    }));

  if (raw.length === 0) return [];

  const enriched = await Promise.all(
    raw.map(async (contact) => {
      if (contact.name) return contact;
      const name = await fetchUserName(apiOrigin, contact.telegram_id);
      return { ...contact, name: name || contact.telegram_id };
    }),
  );

  return enriched;
}

export interface UseAigramContactsResult {
  contacts: AigramContact[];
  loading: boolean;
  error: string | null;
  isDemo: boolean;
}

export function useAigramContacts(): UseAigramContactsResult {
  const [contacts, setContacts] = useState<AigramContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const { apiOrigin, telegramId } = urlParams();

    if (!apiOrigin || !telegramId) {
      setContacts(DEMO_CONTACTS);
      setIsDemo(true);
      setLoading(false);
      return;
    }

    fetchContacts(apiOrigin, telegramId)
      .then((result) => {
        if (result.length === 0) {
          setContacts(DEMO_CONTACTS);
          setIsDemo(true);
        } else {
          // Pad to MAX_CONTACTS with demo if user has fewer friends
          const padded = [...result];
          let i = 0;
          while (padded.length < MAX_CONTACTS && i < DEMO_CONTACTS.length) {
            const d = DEMO_CONTACTS[i++];
            if (!padded.find((c) => c.name === d.name)) padded.push(d);
          }
          setContacts(padded.slice(0, MAX_CONTACTS));
          setIsDemo(false);
        }
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'unknown');
        setContacts(DEMO_CONTACTS);
        setIsDemo(true);
      })
      .finally(() => setLoading(false));
  }, []);

  return { contacts, loading, error, isDemo };
}
