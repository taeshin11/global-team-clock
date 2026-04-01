// analytics.js - Visitor counter + Google Sheets webhook

const Analytics = (() => {
  const WEBHOOK_URL = ''; // Set your Google Apps Script URL here
  const COUNTER_KEY = 'gtc-visitor';
  const TODAY_KEY = 'gtc-today';
  const TOTAL_KEY = 'gtc-total';

  function initCounter() {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem(COUNTER_KEY);

    let todayCount = parseInt(localStorage.getItem(TODAY_KEY) || '0', 10);
    let totalCount = parseInt(localStorage.getItem(TOTAL_KEY) || '0', 10);

    if (lastVisit !== today) {
      // New day or first visit
      todayCount = 1;
      totalCount += 1;
      localStorage.setItem(COUNTER_KEY, today);
      localStorage.setItem(TODAY_KEY, '1');
      localStorage.setItem(TOTAL_KEY, String(totalCount));
    } else {
      // Same day, increment today only on new sessions
      const sessionKey = 'gtc-session';
      if (!sessionStorage.getItem(sessionKey)) {
        todayCount += 1;
        totalCount += 1;
        localStorage.setItem(TODAY_KEY, String(todayCount));
        localStorage.setItem(TOTAL_KEY, String(totalCount));
        sessionStorage.setItem(sessionKey, '1');
      }
    }

    return { today: todayCount, total: totalCount };
  }

  function updateCounterUI() {
    const counts = initCounter();
    const el = document.getElementById('visitor-counter');
    if (el) {
      const todayLabel = typeof I18n !== 'undefined' ? I18n.t('today') : 'Today';
      const totalLabel = typeof I18n !== 'undefined' ? I18n.t('total') : 'Total';
      el.textContent = `${todayLabel}: ${counts.today} | ${totalLabel}: ${counts.total}`;
    }
  }

  function trackEvent(action, detail = '') {
    if (!WEBHOOK_URL) return;
    const payload = {
      timestamp: new Date().toISOString(),
      action,
      detail,
      language: typeof I18n !== 'undefined' ? I18n.getLang() : navigator.language,
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent
    };
    // Non-blocking, silent
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(WEBHOOK_URL, JSON.stringify(payload));
      } else {
        fetch(WEBHOOK_URL, {
          method: 'POST',
          body: JSON.stringify(payload),
          mode: 'no-cors',
          keepalive: true
        }).catch(() => {});
      }
    } catch (e) {
      // Silent fail
    }
  }

  return { initCounter, updateCounterUI, trackEvent };
})();
