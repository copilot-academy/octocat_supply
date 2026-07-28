import { useState } from 'react';
import { useCookieConsent } from '../context/CookieConsentContext';
import { useTheme } from '../context/ThemeContext';

export default function CookieBanner() {
  const { decision, acceptAll, rejectAll, saveCustom } = useCookieConsent();
  const { darkMode } = useTheme();
  const [showCustomize, setShowCustomize] = useState(false);
  const [analyticsChecked, setAnalyticsChecked] = useState(false);
  const [advertisingChecked, setAdvertisingChecked] = useState(false);

  if (decision === 'decided') {
    return null;
  }

  const handleSaveCustom = () => {
    saveCustom({ analytics: analyticsChecked, advertising: advertisingChecked });
  };

  const basePanel = `fixed bottom-0 left-0 right-0 z-50 ${darkMode ? 'bg-gray-900 text-gray-200 border-gray-700' : 'bg-white text-gray-800 border-gray-200'} border-t shadow-xl px-4 py-5 transition-colors duration-300`;
  const primaryBtn = 'px-4 py-2 rounded-lg bg-primary hover:bg-accent text-white font-semibold transition-colors text-sm';
  const secondaryBtn = `px-4 py-2 rounded-lg border font-semibold transition-colors text-sm ${darkMode ? 'border-gray-500 text-gray-200 hover:border-primary hover:text-primary' : 'border-gray-400 text-gray-700 hover:border-primary hover:text-primary'}`;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      className={basePanel}
    >
      <div className="max-w-7xl mx-auto">
        {!showCustomize ? (
          /* ── Default view ── */
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm leading-relaxed max-w-2xl">
              We use cookies to improve your experience. Strictly necessary cookies are always active.
              You can accept all cookies, reject non-essential ones, or customise your preferences.
              Read our{' '}
              <a
                href="#"
                className="underline hover:text-primary"
                aria-label="Privacy Policy (opens in same page)"
              >
                Privacy Policy
              </a>{' '}
              for more details.
            </p>
            <div className="flex flex-wrap gap-2 shrink-0">
              {/* Reject All — same visual weight as Accept All per compliance requirement */}
              <button type="button" onClick={rejectAll} className={secondaryBtn}>
                Reject All
              </button>
              <button type="button" onClick={() => setShowCustomize(true)} className={secondaryBtn}>
                Customize
              </button>
              <button type="button" onClick={acceptAll} className={primaryBtn}>
                Accept All
              </button>
            </div>
          </div>
        ) : (
          /* ── Customize view ── */
          <div className="flex flex-col gap-4">
            <h2 className={`text-base font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
              Cookie Preferences
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {/* Necessary — always on, not toggleable */}
              <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">Strictly Necessary</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-300 text-gray-600'}`}>
                    Always on
                  </span>
                </div>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Required for the site to function (e.g., session, cart). Cannot be disabled.
                </p>
              </div>

              {/* Analytics */}
              <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="cookie-analytics" className="font-semibold cursor-pointer">
                    Analytics
                  </label>
                  <input
                    id="cookie-analytics"
                    type="checkbox"
                    checked={analyticsChecked}
                    onChange={(e) => setAnalyticsChecked(e.target.checked)}
                    className="w-4 h-4 accent-primary cursor-pointer"
                    aria-label="Enable analytics cookies"
                  />
                </div>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Help us understand how visitors use the site so we can improve it.
                </p>
              </div>

              {/* Advertising */}
              <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="cookie-advertising" className="font-semibold cursor-pointer">
                    Advertising
                  </label>
                  <input
                    id="cookie-advertising"
                    type="checkbox"
                    checked={advertisingChecked}
                    onChange={(e) => setAdvertisingChecked(e.target.checked)}
                    className="w-4 h-4 accent-primary cursor-pointer"
                    aria-label="Enable advertising cookies"
                  />
                </div>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Used to show you relevant ads on other sites.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              <button type="button" onClick={() => setShowCustomize(false)} className={secondaryBtn}>
                Back
              </button>
              <button type="button" onClick={rejectAll} className={secondaryBtn}>
                Reject All
              </button>
              <button type="button" onClick={handleSaveCustom} className={primaryBtn}>
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
