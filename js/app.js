// app.js - Core state management and UI rendering

const App = (() => {
  let cities = []; // [{ tz, workStart, workEnd }]
  let clockInterval = null;
  const MAX_CITIES = 10;
  const DEFAULT_WORK_START = 9;
  const DEFAULT_WORK_END = 18;

  function init() {
    I18n.detect();
    renderUI();
    restoreFromURL();

    if (cities.length === 0) {
      // Add user's timezone by default
      const userTz = TimezoneEngine.getUserTimezone();
      addCity(userTz);
    }

    startClock();
    Analytics.updateCounterUI();
    Analytics.trackEvent('page_load', cities.map(c => c.tz).join(','));
    Ads.init();

    // Event listeners
    setupEventListeners();
  }

  function renderUI() {
    updateAllText();
    renderLanguageSelector();
    renderPopularCities();
    renderCitySearch();
    Timeline.renderTimeline(cities);
    updateShareLink();
  }

  function updateAllText() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (el.tagName === 'INPUT' && el.placeholder !== undefined) {
        el.placeholder = I18n.t(key);
      } else {
        el.textContent = I18n.t(key);
      }
    });
  }

  function renderLanguageSelector() {
    const sel = document.getElementById('lang-select');
    if (!sel) return;
    sel.innerHTML = '';
    I18n.getSupportedLangs().forEach(lang => {
      const opt = document.createElement('option');
      opt.value = lang.code;
      opt.textContent = lang.name;
      if (lang.code === I18n.getLang()) opt.selected = true;
      sel.appendChild(opt);
    });
  }

  function renderPopularCities() {
    const container = document.getElementById('popular-cities');
    if (!container) return;
    const popular = TimezoneEngine.getPopularCities();
    container.innerHTML = popular.map(c =>
      `<button class="popular-city-btn px-3 py-1.5 text-sm rounded-full border border-gray-200 bg-white hover:bg-teal-50 hover:border-teal-300 transition-colors" data-tz="${c.tz}">${c.city}</button>`
    ).join('');

    container.querySelectorAll('.popular-city-btn').forEach(btn => {
      btn.addEventListener('click', () => addCity(btn.dataset.tz));
    });
  }

  function renderCitySearch() {
    const input = document.getElementById('city-search');
    const dropdown = document.getElementById('city-dropdown');
    if (!input || !dropdown) return;

    let debounceTimer;
    const allCities = TimezoneEngine.getSearchableCities();

    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const query = input.value.trim().toLowerCase();
        if (query.length < 2) {
          dropdown.classList.add('hidden');
          return;
        }

        const matches = allCities.filter(c =>
          c.city.toLowerCase().includes(query) ||
          c.tz.toLowerCase().includes(query)
        ).slice(0, 20);

        if (matches.length === 0) {
          dropdown.classList.add('hidden');
          return;
        }

        // Group by region
        const grouped = {};
        matches.forEach(m => {
          if (!grouped[m.region]) grouped[m.region] = [];
          grouped[m.region].push(m);
        });

        let html = '';
        for (const region of TimezoneEngine.REGION_ORDER) {
          if (!grouped[region]) continue;
          html += `<div class="px-3 py-1 text-xs font-semibold text-gray-400 uppercase bg-gray-50">${region}</div>`;
          grouped[region].forEach(m => {
            const offset = TimezoneEngine.getTimezoneOffset(m.tz);
            const sign = offset >= 0 ? '+' : '-';
            const absOff = Math.abs(offset);
            const h = Math.floor(absOff);
            const min = Math.round((absOff - h) * 60);
            const offStr = min > 0 ? `UTC${sign}${h}:${String(min).padStart(2, '0')}` : `UTC${sign}${h}`;
            html += `<div class="city-option px-3 py-2 hover:bg-teal-50 cursor-pointer flex justify-between items-center" data-tz="${m.tz}">`;
            html += `<span class="text-gray-800">${m.city}</span>`;
            html += `<span class="text-xs text-gray-400">${offStr}</span>`;
            html += `</div>`;
          });
        }

        dropdown.innerHTML = html;
        dropdown.classList.remove('hidden');

        dropdown.querySelectorAll('.city-option').forEach(opt => {
          opt.addEventListener('click', () => {
            addCity(opt.dataset.tz);
            input.value = '';
            dropdown.classList.add('hidden');
          });
        });
      }, 200);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdown.classList.add('hidden');
      }
    });

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  }

  function addCity(tz) {
    if (cities.length >= MAX_CITIES) {
      showToast(I18n.t('max_cities'));
      return;
    }
    if (cities.some(c => c.tz === tz)) {
      showToast(I18n.t('duplicate_city'));
      return;
    }
    cities.push({ tz, workStart: DEFAULT_WORK_START, workEnd: DEFAULT_WORK_END });
    Timeline.renderTimeline(cities);
    updateURL();
    Analytics.trackEvent('city_added', tz);
  }

  function removeCity(idx) {
    cities.splice(idx, 1);
    Timeline.renderTimeline(cities);
    updateURL();
  }

  function updateWorkHours(idx, start, end) {
    if (start !== null) cities[idx].workStart = start;
    if (end !== null) cities[idx].workEnd = end;
    Timeline.renderTimeline(cities);
    updateURL();
  }

  function applyAllWorkHours() {
    if (cities.length === 0) return;
    const first = cities[0];
    cities.forEach(c => {
      c.workStart = first.workStart;
      c.workEnd = first.workEnd;
    });
    Timeline.renderTimeline(cities);
    updateURL();
  }

  function startClock() {
    if (clockInterval) clearInterval(clockInterval);
    clockInterval = setInterval(() => {
      Timeline.updateClocks(cities);
    }, 1000);
  }

  function findBestMeetingTime() {
    if (cities.length === 0) return;
    const suggestions = TimezoneEngine.findBestMeetingTimes(cities);
    const overlap = TimezoneEngine.findOverlap(cities);
    showMeetingModal(suggestions, overlap.hours.length > 0);
    Analytics.trackEvent('find_meeting', cities.map(c => c.tz).join(','));
  }

  function showMeetingModal(suggestions, hasFullOverlap) {
    const modal = document.getElementById('meeting-modal');
    if (!modal) return;

    const content = document.getElementById('meeting-modal-content');
    let html = `<h3 class="text-xl font-bold text-gray-800 mb-2">${I18n.t('suggested_times')}</h3>`;
    html += `<p class="text-sm text-gray-500 mb-4">${hasFullOverlap ? I18n.t('best_time_desc') : I18n.t('no_full_overlap')}</p>`;

    suggestions.forEach((slot, i) => {
      html += `<div class="mb-4 p-4 rounded-lg ${i === 0 ? 'bg-teal-50 border-2 border-teal-200' : 'bg-gray-50 border border-gray-200'}">`;
      html += `<div class="flex items-center gap-2 mb-2">`;
      html += `<span class="text-sm font-semibold text-teal-700">${I18n.t('utc_time')}: ${String(slot.utcHour).padStart(2, '0')}:00</span>`;
      if (i === 0) html += `<span class="text-xs bg-teal-500 text-white px-2 py-0.5 rounded-full">Best</span>`;
      html += `</div>`;
      html += `<div class="space-y-1">`;
      slot.localTimes.forEach(lt => {
        const inWork = lt.inWork !== undefined ? lt.inWork : TimezoneEngine.isWorkingHour(lt.hour, 9, 18);
        html += `<div class="flex justify-between text-sm">`;
        html += `<span class="text-gray-700">${lt.city}</span>`;
        html += `<span class="${inWork ? 'text-green-600 font-medium' : 'text-gray-400'}">${String(lt.hour).padStart(2, '0')}:00 ${inWork ? '✓' : ''}</span>`;
        html += `</div>`;
      });
      html += `</div>`;
      html += `</div>`;
    });

    // Copy button
    html += `<button id="copy-meeting-btn" class="w-full mt-2 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium">${I18n.t('copy_meeting')}</button>`;

    content.innerHTML = html;
    modal.classList.remove('hidden');

    document.getElementById('copy-meeting-btn').addEventListener('click', () => {
      let text = `${I18n.t('suggested_times')}\n\n`;
      suggestions.forEach((slot, i) => {
        text += `Option ${i + 1}: ${String(slot.utcHour).padStart(2, '0')}:00 UTC\n`;
        slot.localTimes.forEach(lt => {
          text += `  ${lt.city}: ${String(lt.hour).padStart(2, '0')}:00\n`;
        });
        text += '\n';
      });
      text += `\nGenerated by Global Team Clock\n${window.location.href}`;
      navigator.clipboard.writeText(text).then(() => showToast(I18n.t('copied')));
    });
  }

  function closeMeetingModal() {
    const modal = document.getElementById('meeting-modal');
    if (modal) modal.classList.add('hidden');
  }

  function updateURL() {
    if (cities.length === 0) {
      history.replaceState(null, '', window.location.pathname);
      return;
    }
    const params = new URLSearchParams();
    params.set('cities', cities.map(c => c.tz).join(','));
    params.set('work', cities.map(c => `${c.workStart}-${c.workEnd}`).join(','));
    history.replaceState(null, '', `?${params.toString()}`);
    updateShareLink();
  }

  function restoreFromURL() {
    const params = new URLSearchParams(window.location.search);
    const citiesParam = params.get('cities');
    const workParam = params.get('work');

    if (!citiesParam) return;

    const tzList = citiesParam.split(',').filter(Boolean);
    const workList = workParam ? workParam.split(',') : [];

    tzList.forEach((tz, i) => {
      let workStart = DEFAULT_WORK_START;
      let workEnd = DEFAULT_WORK_END;
      if (workList[i]) {
        const parts = workList[i].split('-');
        if (parts.length === 2) {
          workStart = parseInt(parts[0], 10) || DEFAULT_WORK_START;
          workEnd = parseInt(parts[1], 10) || DEFAULT_WORK_END;
        }
      }
      cities.push({ tz, workStart, workEnd });
    });

    Timeline.renderTimeline(cities);
  }

  function updateShareLink() {
    const btn = document.getElementById('share-link-btn');
    if (btn) {
      btn.onclick = copyShareLink;
    }
  }

  function copyShareLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      showToast(I18n.t('copied'));
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast(I18n.t('copied'));
    });
  }

  function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-gray-800 text-white rounded-lg shadow-lg z-50 transition-all transform translate-y-12 opacity-0';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.remove('translate-y-12', 'opacity-0');
    setTimeout(() => {
      toast.classList.add('translate-y-12', 'opacity-0');
    }, 2000);
  }

  function shareToTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Check our team's timezone overlap:");
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  }

  function shareToLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  }

  function shareViaEmail() {
    const subject = encodeURIComponent('Global Team Clock - Timezone Overlap');
    const body = encodeURIComponent(`Check our team's timezone overlap: ${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  function setupEventListeners() {
    // Language selector
    const langSel = document.getElementById('lang-select');
    if (langSel) {
      langSel.addEventListener('change', (e) => {
        I18n.setLang(e.target.value);
        renderUI();
        Analytics.updateCounterUI();
      });
    }

    // Find meeting time button
    const findBtn = document.getElementById('find-meeting-btn');
    if (findBtn) {
      findBtn.addEventListener('click', findBestMeetingTime);
    }

    // Apply all button
    const applyAllBtn = document.getElementById('apply-all-btn');
    if (applyAllBtn) {
      applyAllBtn.addEventListener('click', applyAllWorkHours);
    }

    // Close modal
    const closeModalBtn = document.getElementById('close-modal-btn');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeMeetingModal);
    }

    // Modal backdrop
    const modal = document.getElementById('meeting-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeMeetingModal();
      });
    }

    // Share buttons
    document.getElementById('share-twitter')?.addEventListener('click', shareToTwitter);
    document.getElementById('share-linkedin')?.addEventListener('click', shareToLinkedIn);
    document.getElementById('share-email')?.addEventListener('click', shareViaEmail);
    document.getElementById('share-link-btn')?.addEventListener('click', copyShareLink);

    // Feedback
    document.getElementById('feedback-btn')?.addEventListener('click', () => {
      window.location.href = 'mailto:taeshinkim11@gmail.com?subject=Global%20Team%20Clock%20Feedback';
    });
  }

  return {
    init,
    addCity,
    removeCity,
    updateWorkHours,
    applyAllWorkHours,
    findBestMeetingTime,
    cities: () => cities
  };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', App.init);
