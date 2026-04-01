// timezone.js - Timezone Data Engine using Intl API

const TimezoneEngine = (() => {
  // City-to-timezone mapping for popular cities
  const CITY_MAP = {
    'New York': 'America/New_York',
    'Los Angeles': 'America/Los_Angeles',
    'Chicago': 'America/Chicago',
    'Denver': 'America/Denver',
    'Toronto': 'America/Toronto',
    'Vancouver': 'America/Vancouver',
    'Mexico City': 'America/Mexico_City',
    'Sao Paulo': 'America/Sao_Paulo',
    'Buenos Aires': 'America/Argentina/Buenos_Aires',
    'Lima': 'America/Lima',
    'Bogota': 'America/Bogota',
    'Santiago': 'America/Santiago',
    'London': 'Europe/London',
    'Paris': 'Europe/Paris',
    'Berlin': 'Europe/Berlin',
    'Madrid': 'Europe/Madrid',
    'Rome': 'Europe/Rome',
    'Amsterdam': 'Europe/Amsterdam',
    'Brussels': 'Europe/Brussels',
    'Vienna': 'Europe/Vienna',
    'Zurich': 'Europe/Zurich',
    'Stockholm': 'Europe/Stockholm',
    'Oslo': 'Europe/Oslo',
    'Helsinki': 'Europe/Helsinki',
    'Warsaw': 'Europe/Warsaw',
    'Prague': 'Europe/Prague',
    'Athens': 'Europe/Athens',
    'Istanbul': 'Europe/Istanbul',
    'Moscow': 'Europe/Moscow',
    'Dubai': 'Asia/Dubai',
    'Mumbai': 'Asia/Kolkata',
    'Delhi': 'Asia/Kolkata',
    'Bangalore': 'Asia/Kolkata',
    'Kolkata': 'Asia/Kolkata',
    'Karachi': 'Asia/Karachi',
    'Dhaka': 'Asia/Dhaka',
    'Bangkok': 'Asia/Bangkok',
    'Singapore': 'Asia/Singapore',
    'Kuala Lumpur': 'Asia/Kuala_Lumpur',
    'Jakarta': 'Asia/Jakarta',
    'Hong Kong': 'Asia/Hong_Kong',
    'Taipei': 'Asia/Taipei',
    'Shanghai': 'Asia/Shanghai',
    'Beijing': 'Asia/Shanghai',
    'Seoul': 'Asia/Seoul',
    'Tokyo': 'Asia/Tokyo',
    'Manila': 'Asia/Manila',
    'Hanoi': 'Asia/Ho_Chi_Minh',
    'Riyadh': 'Asia/Riyadh',
    'Tel Aviv': 'Asia/Jerusalem',
    'Kathmandu': 'Asia/Kathmandu',
    'Sydney': 'Australia/Sydney',
    'Melbourne': 'Australia/Melbourne',
    'Brisbane': 'Australia/Brisbane',
    'Perth': 'Australia/Perth',
    'Auckland': 'Pacific/Auckland',
    'Honolulu': 'Pacific/Honolulu',
    'Anchorage': 'America/Anchorage',
    'Cairo': 'Africa/Cairo',
    'Lagos': 'Africa/Lagos',
    'Nairobi': 'Africa/Nairobi',
    'Johannesburg': 'Africa/Johannesburg',
    'Casablanca': 'Africa/Casablanca',
    'Accra': 'Africa/Accra'
  };

  const REGION_ORDER = ['Americas', 'Europe', 'Asia', 'Africa', 'Oceania', 'Other'];

  function getAllTimezones() {
    try {
      return Intl.supportedValuesOf('timeZone');
    } catch (e) {
      // Fallback for older browsers
      return Object.values(CITY_MAP).filter((v, i, a) => a.indexOf(v) === i);
    }
  }

  function getTimezoneOffset(tz) {
    try {
      const now = new Date();
      const fmt = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        timeZoneName: 'shortOffset'
      });
      const parts = fmt.formatToParts(now);
      const tzPart = parts.find(p => p.type === 'timeZoneName');
      if (!tzPart) return 0;
      const val = tzPart.value; // e.g., "GMT+5:30" or "GMT-5"
      if (val === 'GMT' || val === 'UTC') return 0;
      const match = val.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
      if (!match) return 0;
      const sign = match[1] === '+' ? 1 : -1;
      const hours = parseInt(match[2], 10);
      const minutes = match[3] ? parseInt(match[3], 10) : 0;
      return sign * (hours + minutes / 60);
    } catch (e) {
      return 0;
    }
  }

  function getCurrentTime(tz, locale = 'en-US') {
    try {
      return new Intl.DateTimeFormat(locale, {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(new Date());
    } catch (e) {
      return '--:--:--';
    }
  }

  function getCurrentHourMinute(tz) {
    try {
      const now = new Date();
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      }).formatToParts(now);
      const hour = parseInt(parts.find(p => p.type === 'hour').value, 10);
      const minute = parseInt(parts.find(p => p.type === 'minute').value, 10);
      return { hour: hour === 24 ? 0 : hour, minute };
    } catch (e) {
      return { hour: 0, minute: 0 };
    }
  }

  function getCurrentDate(tz) {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }).format(new Date());
    } catch (e) {
      return '';
    }
  }

  function getUserTimezone() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
      return 'UTC';
    }
  }

  function getTimezoneLabel(tz) {
    const offset = getTimezoneOffset(tz);
    const sign = offset >= 0 ? '+' : '-';
    const absOffset = Math.abs(offset);
    const hours = Math.floor(absOffset);
    const minutes = Math.round((absOffset - hours) * 60);
    const offsetStr = minutes > 0 ? `${hours}:${String(minutes).padStart(2, '0')}` : `${hours}`;
    const cityName = tz.split('/').pop().replace(/_/g, ' ');
    return `${cityName} (UTC${sign}${offsetStr})`;
  }

  function getCityName(tz) {
    // Reverse lookup from CITY_MAP
    for (const [city, tzId] of Object.entries(CITY_MAP)) {
      if (tzId === tz) return city;
    }
    return tz.split('/').pop().replace(/_/g, ' ');
  }

  function getRegion(tz) {
    if (tz.startsWith('America/')) return 'Americas';
    if (tz.startsWith('Europe/')) return 'Europe';
    if (tz.startsWith('Asia/')) return 'Asia';
    if (tz.startsWith('Africa/')) return 'Africa';
    if (tz.startsWith('Australia/') || tz.startsWith('Pacific/')) return 'Oceania';
    return 'Other';
  }

  function isWorkingHour(hour, workStart, workEnd) {
    if (workStart <= workEnd) {
      return hour >= workStart && hour < workEnd;
    } else {
      // Overnight: e.g., 22:00 - 06:00
      return hour >= workStart || hour < workEnd;
    }
  }

  function getWorkingHoursInUTC(tz, workStart, workEnd) {
    const offset = getTimezoneOffset(tz);
    const hours = [];
    for (let h = 0; h < 24; h++) {
      if (isWorkingHour(h, workStart, workEnd)) {
        let utcHour = (h - offset + 48) % 24;
        utcHour = Math.round(utcHour * 2) / 2; // handle half-hour offsets
        hours.push(utcHour % 24);
      }
    }
    return hours;
  }

  function findOverlap(cities) {
    // cities = [{ tz, workStart, workEnd }]
    if (cities.length === 0) return { hours: [], slots: [] };

    // For each city, get set of UTC hours that are working hours
    const allWorkingUTC = cities.map(c => {
      const set = new Set();
      const offset = getTimezoneOffset(c.tz);
      for (let h = 0; h < 24; h++) {
        if (isWorkingHour(h, c.workStart, c.workEnd)) {
          let utcH = ((h - offset) % 24 + 24) % 24;
          utcH = Math.round(utcH);
          if (utcH === 24) utcH = 0;
          set.add(utcH);
        }
      }
      return set;
    });

    // Find intersection
    const overlapHours = [];
    for (let h = 0; h < 24; h++) {
      if (allWorkingUTC.every(set => set.has(h))) {
        overlapHours.push(h);
      }
    }

    // Build slots with local times
    const slots = overlapHours.map(utcH => {
      const localTimes = cities.map(c => {
        const offset = getTimezoneOffset(c.tz);
        let localH = ((utcH + offset) % 24 + 24) % 24;
        localH = Math.round(localH);
        if (localH === 24) localH = 0;
        return { tz: c.tz, city: getCityName(c.tz), hour: localH };
      });
      return { utcHour: utcH, localTimes };
    });

    return { hours: overlapHours, slots };
  }

  function findBestMeetingTimes(cities, topN = 3) {
    if (cities.length === 0) return [];

    const overlap = findOverlap(cities);

    if (overlap.slots.length > 0) {
      // Score slots: prefer middle of work day (12-15 local time for most cities)
      const scored = overlap.slots.map(slot => {
        let score = 100;
        slot.localTimes.forEach(lt => {
          // Prefer 9-16 range, best at 10-14
          if (lt.hour >= 10 && lt.hour <= 14) score += 10;
          else if (lt.hour >= 9 && lt.hour <= 16) score += 5;
          else if (lt.hour >= 7 && lt.hour <= 19) score += 2;
          else score -= 5;
        });
        return { ...slot, score };
      });
      scored.sort((a, b) => b.score - a.score);
      return scored.slice(0, topN);
    }

    // No full overlap: find "least bad" times
    const allScores = [];
    for (let utcH = 0; utcH < 24; utcH++) {
      let citiesInWork = 0;
      let score = 0;
      const localTimes = cities.map(c => {
        const offset = getTimezoneOffset(c.tz);
        let localH = ((utcH + offset) % 24 + 24) % 24;
        localH = Math.round(localH);
        if (localH === 24) localH = 0;
        const inWork = isWorkingHour(localH, c.workStart, c.workEnd);
        if (inWork) {
          citiesInWork++;
          score += 10;
        }
        if (localH >= 7 && localH <= 21) score += 3;
        return { tz: c.tz, city: getCityName(c.tz), hour: localH, inWork };
      });
      allScores.push({ utcHour: utcH, localTimes, score, citiesInWork });
    }
    allScores.sort((a, b) => b.score - a.score || b.citiesInWork - a.citiesInWork);
    return allScores.slice(0, topN);
  }

  function getSearchableCities() {
    const results = [];
    // Add known cities first
    for (const [city, tz] of Object.entries(CITY_MAP)) {
      results.push({ city, tz, region: getRegion(tz) });
    }
    // Add all timezones
    const allTz = getAllTimezones();
    const knownTzSet = new Set(Object.values(CITY_MAP));
    for (const tz of allTz) {
      if (!knownTzSet.has(tz)) {
        const city = tz.split('/').pop().replace(/_/g, ' ');
        results.push({ city, tz, region: getRegion(tz) });
      }
    }
    return results;
  }

  function getPopularCities() {
    return [
      { city: 'New York', tz: 'America/New_York' },
      { city: 'London', tz: 'Europe/London' },
      { city: 'Tokyo', tz: 'Asia/Tokyo' },
      { city: 'Sydney', tz: 'Australia/Sydney' },
      { city: 'Paris', tz: 'Europe/Paris' },
      { city: 'Dubai', tz: 'Asia/Dubai' },
      { city: 'Singapore', tz: 'Asia/Singapore' },
      { city: 'Seoul', tz: 'Asia/Seoul' }
    ];
  }

  function isDaytime(hour) {
    return hour >= 6 && hour < 18;
  }

  function getDateDiff(tz) {
    const userTz = getUserTimezone();
    const now = new Date();
    const userDate = new Intl.DateTimeFormat('en-US', { timeZone: userTz, day: 'numeric' }).format(now);
    const cityDate = new Intl.DateTimeFormat('en-US', { timeZone: tz, day: 'numeric' }).format(now);
    const diff = parseInt(cityDate) - parseInt(userDate);
    if (diff === 0) return '';
    if (diff === 1 || diff < -27) return '+1 day';
    if (diff === -1 || diff > 27) return '-1 day';
    return '';
  }

  return {
    getAllTimezones,
    getTimezoneOffset,
    getCurrentTime,
    getCurrentHourMinute,
    getCurrentDate,
    getUserTimezone,
    getTimezoneLabel,
    getCityName,
    getRegion,
    isWorkingHour,
    getWorkingHoursInUTC,
    findOverlap,
    findBestMeetingTimes,
    getSearchableCities,
    getPopularCities,
    isDaytime,
    getDateDiff,
    CITY_MAP,
    REGION_ORDER
  };
})();
