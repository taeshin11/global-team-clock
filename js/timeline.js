// timeline.js - 24h bar rendering, overlap calculation

const Timeline = (() => {
  function renderTimeline(cities, overlapHours) {
    const container = document.getElementById('timeline-container');
    if (!container) return;

    if (cities.length === 0) {
      container.innerHTML = `<div class="text-center py-16 text-gray-400"><svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><p class="text-lg">${I18n.t('no_cities')}</p></div>`;
      return;
    }

    // Calculate overlap
    const overlap = TimezoneEngine.findOverlap(cities);
    const overlapUTCSet = new Set(overlap.hours);

    let html = '';

    // Hour labels header
    html += '<div class="timeline-header flex mb-1 pl-48 lg:pl-56">';
    html += '<div class="flex-1 grid grid-cols-24 text-xs text-gray-500">';
    for (let h = 0; h < 24; h++) {
      if (h % 3 === 0) {
        html += `<div class="col-span-1 text-center">${String(h).padStart(2, '0')}</div>`;
      } else {
        html += '<div class="col-span-1"></div>';
      }
    }
    html += '</div></div>';

    // Render each city bar
    cities.forEach((city, idx) => {
      const offset = TimezoneEngine.getTimezoneOffset(city.tz);
      const { hour: currentHour, minute: currentMinute } = TimezoneEngine.getCurrentHourMinute(city.tz);
      const currentTime = TimezoneEngine.getCurrentTime(city.tz);
      const dateDiff = TimezoneEngine.getDateDiff(city.tz);
      const isDayNow = TimezoneEngine.isDaytime(currentHour);
      const cityName = TimezoneEngine.getCityName(city.tz);
      const offsetVal = TimezoneEngine.getTimezoneOffset(city.tz);
      const sign = offsetVal >= 0 ? '+' : '-';
      const absOff = Math.abs(offsetVal);
      const offH = Math.floor(absOff);
      const offM = Math.round((absOff - offH) * 60);
      const offsetStr = offM > 0 ? `UTC${sign}${offH}:${String(offM).padStart(2, '0')}` : `UTC${sign}${offH}`;

      html += `<div class="timeline-row flex items-center mb-2 group" data-idx="${idx}">`;

      // City info panel
      html += `<div class="city-info w-48 lg:w-56 flex-shrink-0 pr-3">`;
      html += `<div class="flex items-center justify-between">`;
      html += `<div class="flex-1 min-w-0">`;
      html += `<div class="flex items-center gap-2">`;
      html += `<span class="text-lg">${isDayNow ? '☀️' : '🌙'}</span>`;
      html += `<div class="min-w-0">`;
      html += `<div class="font-semibold text-gray-800 truncate">${cityName}</div>`;
      html += `<div class="text-xs text-gray-500">${offsetStr}${dateDiff ? ' <span class="text-orange-500">' + dateDiff + '</span>' : ''}</div>`;
      html += `</div>`;
      html += `</div>`;
      html += `<div class="font-mono text-sm text-gray-700 mt-0.5 tabular-nums clock-display" data-tz="${city.tz}">${currentTime}</div>`;
      html += `</div>`;
      html += `<button class="remove-city-btn ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 p-1" data-idx="${idx}" title="${I18n.t('remove')}">`;
      html += `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`;
      html += `</button>`;
      html += `</div>`;

      // Work hours controls
      html += `<div class="flex items-center gap-1 mt-1 text-xs">`;
      html += `<label class="text-gray-400">${I18n.t('work_start')}:</label>`;
      html += `<select class="work-start-select text-xs border border-gray-200 rounded px-1 py-0.5 bg-white" data-idx="${idx}">`;
      for (let h = 0; h < 24; h++) {
        html += `<option value="${h}" ${h === city.workStart ? 'selected' : ''}>${String(h).padStart(2, '0')}:00</option>`;
      }
      html += `</select>`;
      html += `<label class="text-gray-400 ml-1">${I18n.t('work_end')}:</label>`;
      html += `<select class="work-end-select text-xs border border-gray-200 rounded px-1 py-0.5 bg-white" data-idx="${idx}">`;
      for (let h = 0; h < 24; h++) {
        html += `<option value="${h}" ${h === city.workEnd ? 'selected' : ''}>${String(h).padStart(2, '0')}:00</option>`;
      }
      html += `</select>`;
      html += `</div>`;

      html += `</div>`;

      // Timeline bar
      html += `<div class="flex-1 relative">`;
      html += `<div class="timeline-bar grid grid-cols-24 h-10 rounded-lg overflow-hidden border border-gray-200" role="row" aria-label="${cityName} timeline">`;

      for (let h = 0; h < 24; h++) {
        const isDay = TimezoneEngine.isDaytime(h);
        const isWork = TimezoneEngine.isWorkingHour(h, city.workStart, city.workEnd);

        // Convert local hour to UTC to check overlap
        let utcH = ((h - offset) % 24 + 24) % 24;
        utcH = Math.round(utcH);
        if (utcH === 24) utcH = 0;
        const isOverlap = isWork && overlapUTCSet.has(utcH);

        let bgClass = isDay ? 'bg-yellow-50' : 'bg-indigo-50';
        let overlayStyle = '';
        if (isOverlap) {
          overlayStyle = 'background-color: rgba(34, 197, 94, 0.5);';
        } else if (isWork) {
          overlayStyle = 'background-color: rgba(34, 197, 94, 0.2);';
        }

        const ariaLabel = `${String(h).padStart(2, '0')}:00 - ${isDay ? 'day' : 'night'}${isWork ? ', work hours' : ''}${isOverlap ? ', overlap' : ''}`;

        html += `<div class="col-span-1 ${bgClass} border-r border-gray-100 relative flex items-end justify-center" style="${overlayStyle}" role="cell" aria-label="${ariaLabel}">`;
        if (h % 6 === 0) {
          html += `<span class="text-[9px] text-gray-400 leading-none mb-0.5">${String(h).padStart(2, '0')}</span>`;
        }
        html += `</div>`;
      }

      html += `</div>`;

      // Current time marker
      const markerPos = ((currentHour + currentMinute / 60) / 24) * 100;
      html += `<div class="current-time-marker absolute top-0 h-full w-0.5 bg-red-500 z-10 transition-all" style="left: ${markerPos}%" aria-label="Current time">`;
      html += `<div class="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>`;
      html += `</div>`;

      html += `</div>`;
      html += `</div>`;
    });

    // Overlap summary
    if (cities.length > 1) {
      html += '<div class="overlap-summary mt-4 p-3 rounded-lg border" ';
      if (overlap.hours.length > 0) {
        html += 'style="background-color: rgba(34, 197, 94, 0.1); border-color: rgba(34, 197, 94, 0.3);">';
        const sortedHours = [...overlap.hours].sort((a, b) => a - b);
        const rangeStart = sortedHours[0];
        const rangeEnd = (sortedHours[sortedHours.length - 1] + 1) % 24;
        html += `<div class="flex items-center gap-2">`;
        html += `<span class="text-green-600 font-semibold">${I18n.t('hours_overlap', { count: overlap.hours.length })}</span>`;
        html += `<span class="text-sm text-gray-600">(${String(rangeStart).padStart(2, '0')}:00 - ${String(rangeEnd).padStart(2, '0')}:00 UTC)</span>`;
        html += `</div>`;
      } else {
        html += 'style="background-color: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3);">';
        html += `<div class="text-red-600 font-medium">${I18n.t('no_overlap')}</div>`;
      }
      html += '</div>';
    }

    container.innerHTML = html;

    // Attach event listeners
    container.querySelectorAll('.remove-city-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        if (typeof App !== 'undefined') App.removeCity(idx);
      });
    });

    container.querySelectorAll('.work-start-select').forEach(sel => {
      sel.addEventListener('change', () => {
        const idx = parseInt(sel.dataset.idx, 10);
        if (typeof App !== 'undefined') App.updateWorkHours(idx, parseInt(sel.value, 10), null);
      });
    });

    container.querySelectorAll('.work-end-select').forEach(sel => {
      sel.addEventListener('change', () => {
        const idx = parseInt(sel.dataset.idx, 10);
        if (typeof App !== 'undefined') App.updateWorkHours(idx, null, parseInt(sel.value, 10));
      });
    });
  }

  function updateClocks(cities) {
    document.querySelectorAll('.clock-display').forEach(el => {
      const tz = el.dataset.tz;
      if (tz) {
        el.textContent = TimezoneEngine.getCurrentTime(tz);
      }
    });

    // Update current time markers
    document.querySelectorAll('.timeline-row').forEach((row, idx) => {
      if (cities[idx]) {
        const { hour, minute } = TimezoneEngine.getCurrentHourMinute(cities[idx].tz);
        const marker = row.querySelector('.current-time-marker');
        if (marker) {
          const pos = ((hour + minute / 60) / 24) * 100;
          marker.style.left = `${pos}%`;
        }
      }
    });
  }

  return { renderTimeline, updateClocks };
})();
