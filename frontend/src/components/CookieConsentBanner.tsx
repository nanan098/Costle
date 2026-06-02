import React, { useEffect, useState } from "react";

const COOKIE_CONSENT_KEY = "cookieConsent";
const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";
const AW_CONVERSION_ID = "AW-XXXXXXXXX";

const injectTrackingScripts = () => {
  if (document.getElementById("gtag-js")) return;

  const gtagScript = document.createElement("script");
  gtagScript.id = "gtag-js";
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(gtagScript);

  const inlineScript = document.createElement("script");
  inlineScript.id = "gtag-inline";
  inlineScript.text = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');
gtag('config', '${AW_CONVERSION_ID}');`;
  document.head.appendChild(inlineScript);
};

export const CookieConsentBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "granted");
    injectTrackingScripts();
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-2xl shadow-black/10 backdrop-blur-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Polityka plików cookie
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Używamy plików cookie, aby poprawić działanie strony i analizować
            ruch. Kliknij „Akceptuję”, aby włączyć Google Analytics i Google
            Ads. Więcej informacji znajdziesz w naszej{" "}
            <a
              href="/Polityka_prywatnosci.pdf"
              className="font-medium text-glowny underline transition hover:text-emerald-600"
            >
              polityce prywatności
            </a>
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Odmów
          </button>
          <button
            type="button"
            onClick={acceptCookies}
            className="inline-flex items-center justify-center rounded-full bg-glowny px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-600"
          >
            Akceptuję
          </button>
        </div>
      </div>
    </div>
  );
};
