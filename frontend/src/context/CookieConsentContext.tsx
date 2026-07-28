import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const CONSENT_STORAGE_KEY = 'octocat.cookie-consent.v1';

export interface CookieConsent {
  necessary: true;
  analytics: boolean;
  advertising: boolean;
}

type ConsentDecision = 'pending' | 'decided';

interface CookieConsentState {
  decision: ConsentDecision;
  consent: CookieConsent;
}

interface CookieConsentContextValue {
  decision: ConsentDecision;
  consent: CookieConsent;
  acceptAll: () => void;
  rejectAll: () => void;
  saveCustom: (prefs: Omit<CookieConsent, 'necessary'>) => void;
  reopenBanner: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(undefined);

function readInitialState(): CookieConsentState {
  if (typeof window === 'undefined') {
    return { decision: 'pending', consent: { necessary: true, analytics: false, advertising: false } };
  }
  const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  if (!raw) {
    return { decision: 'pending', consent: { necessary: true, analytics: false, advertising: false } };
  }
  try {
    const parsed = JSON.parse(raw) as CookieConsentState;
    if (parsed?.decision === 'decided' && parsed.consent) {
      return { decision: 'decided', consent: { ...parsed.consent, necessary: true } };
    }
  } catch {
    // ignore malformed data
  }
  return { decision: 'pending', consent: { necessary: true, analytics: false, advertising: false } };
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CookieConsentState>(readInitialState);

  useEffect(() => {
    if (state.decision === 'decided') {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const acceptAll = useCallback(() => {
    setState({ decision: 'decided', consent: { necessary: true, analytics: true, advertising: true } });
  }, []);

  const rejectAll = useCallback(() => {
    setState({ decision: 'decided', consent: { necessary: true, analytics: false, advertising: false } });
  }, []);

  const saveCustom = useCallback((prefs: Omit<CookieConsent, 'necessary'>) => {
    setState({ decision: 'decided', consent: { necessary: true, ...prefs } });
  }, []);

  const reopenBanner = useCallback(() => {
    setState({ decision: 'pending', consent: { necessary: true, analytics: false, advertising: false } });
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  }, []);

  const value = useMemo<CookieConsentContextValue>(
    () => ({ decision: state.decision, consent: state.consent, acceptAll, rejectAll, saveCustom, reopenBanner }),
    [state, acceptAll, rejectAll, saveCustom, reopenBanner],
  );

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}
