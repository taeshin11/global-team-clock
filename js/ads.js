// ads.js - Ad injection (Adsterra + Google AdSense)

const Ads = (() => {
  function init() {
    injectAdSense();
    injectAdsterra();
  }

  function injectAdSense() {
    // Google AdSense auto-ads script
    if (!document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7098271335538021';
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  }

  function injectAdsterra() {
    // Adsterra placeholders are already in HTML
    // Populate them with ad code when key is available
    const adSlots = document.querySelectorAll('[data-adsterra-key]');
    adSlots.forEach(slot => {
      if (!slot.dataset.loaded) {
        slot.dataset.loaded = 'true';
        slot.innerHTML = '<div class="ad-placeholder text-center text-gray-400 text-sm py-2">Advertisement</div>';
      }
    });
  }

  return { init };
})();
