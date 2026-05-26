import { useCallback, useEffect, useRef, useState } from 'react';
import './WakeUpService.less';
import { ThemeProvider, useTheme } from './theme';
import { useAigramContacts } from './hooks/useAigramContacts';
import { useClock } from './hooks/useClock';
import LCDFrame from './components/LCDFrame';
import Lobby from './screens/Lobby';
import ContactPicker from './screens/ContactPicker';
import TargetDetail from './screens/TargetDetail';
import MethodPicker from './screens/MethodPicker';
import Dialing from './screens/Dialing';
import Receipt from './screens/Receipt';
import Settings from './screens/Settings';
import type { FlowPhase, MethodId, View } from './types';
import { getMethod } from './utils/methods';
import { unlockAudio } from './utils/sounds';

const LS_LAST_METHOD = 'wakeup_last_method';

function GameInner() {
  const { color, font, brightness } = useTheme();
  const now = useClock();
  const { contacts, loading: contactsLoading, isDemo } = useAigramContacts();

  const [view, setView] = useState<View>('lobby');
  const [phase, setPhase] = useState<FlowPhase>('picker');
  const [targetId, setTargetId] = useState<string | null>(null);
  const [methodId, setMethodId] = useState<MethodId | null>(() => {
    try {
      const v = localStorage.getItem(LS_LAST_METHOD);
      return (v as MethodId | null) || null;
    } catch {
      return null;
    }
  });
  const [receiptTs, setReceiptTs] = useState<Date | null>(null);

  // First-touch audio unlock — captured at the document root in capture phase
  // so we catch the very first interaction regardless of which screen it hits.
  const audioReady = useRef(false);
  useEffect(() => {
    if (audioReady.current) return;
    const onFirst = () => {
      if (audioReady.current) return;
      unlockAudio();
      audioReady.current = true;
      document.removeEventListener('pointerdown', onFirst, true);
    };
    document.addEventListener('pointerdown', onFirst, true);
    return () => document.removeEventListener('pointerdown', onFirst, true);
  }, []);

  // Persist last-used method
  useEffect(() => {
    if (!methodId) return;
    try {
      localStorage.setItem(LS_LAST_METHOD, methodId);
    } catch {
      /* ignore */
    }
  }, [methodId]);

  const target = contacts.find((c) => c.telegram_id === targetId) || null;
  const method = getMethod(methodId);

  const startFlow = useCallback(() => {
    setView('flow');
    setPhase('picker');
    setTargetId(null);
    setReceiptTs(null);
  }, []);

  const toLobby = useCallback(() => {
    setView('lobby');
  }, []);

  const openSettings = useCallback(() => {
    setView('settings');
  }, []);

  const backFromPhase = useCallback(() => {
    if (phase === 'picker')      toLobby();
    else if (phase === 'detail') setPhase('picker');
    else if (phase === 'method') setPhase('detail');
    // dialing/receipt have no manual back — they auto-complete
  }, [phase, toLobby]);

  const onContactSelect = useCallback((id: string) => {
    setTargetId(id);
  }, []);
  const onMethodSelect = useCallback((id: MethodId) => {
    setMethodId(id);
  }, []);

  const onConfirmDispatch = useCallback(() => {
    if (phase === 'dialing') return; // re-dispatch guard
    setPhase('dialing');
  }, [phase]);

  const onDialingDone = useCallback(() => {
    setReceiptTs(new Date());
    setPhase('receipt');
  }, []);

  // Decide what to render
  let body: React.ReactNode;
  if (view === 'settings') {
    body = <Settings onClose={toLobby} />;
  } else if (view === 'lobby') {
    body = (
      <Lobby
        now={now}
        contacts={contacts}
        isDemo={isDemo}
        onStart={startFlow}
        onSettings={openSettings}
      />
    );
  } else {
    // view === 'flow'
    if (phase === 'picker') {
      body = (
        <ContactPicker
          contacts={contacts}
          loading={contactsLoading}
          isDemo={isDemo}
          selectedId={targetId}
          onSelect={onContactSelect}
          onNext={() => target && setPhase('detail')}
          onBack={backFromPhase}
        />
      );
    } else if (phase === 'detail' && target) {
      body = (
        <TargetDetail
          contact={target}
          onNext={() => setPhase('method')}
          onBack={backFromPhase}
        />
      );
    } else if (phase === 'method' && target) {
      body = (
        <MethodPicker
          target={target}
          now={now}
          selectedMethod={methodId}
          onSelect={onMethodSelect}
          onConfirm={onConfirmDispatch}
          onBack={backFromPhase}
        />
      );
    } else if (phase === 'dialing' && target && method) {
      body = (
        <Dialing
          target={target}
          method={method}
          onComplete={onDialingDone}
        />
      );
    } else if (phase === 'receipt' && target && method && receiptTs) {
      body = (
        <Receipt
          target={target}
          method={method}
          ts={receiptTs}
          onLobby={toLobby}
        />
      );
    } else {
      // defensive fallback — shouldn't normally happen
      body = <Lobby now={now} contacts={contacts} isDemo={isDemo} onStart={startFlow} onSettings={openSettings} />;
    }
  }

  return (
    <div
      className="wus-root"
      data-theme={color}
      data-font={font}
      data-brightness={String(brightness)}
    >
      <LCDFrame>{body}</LCDFrame>
    </div>
  );
}

export default function WakeUpService() {
  return (
    <ThemeProvider>
      <GameInner />
    </ThemeProvider>
  );
}
