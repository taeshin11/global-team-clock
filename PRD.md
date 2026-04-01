# PRD: Global Team Clock

## Timezone Overlap Dashboard for Remote Teams

---

## 1. Product Overview

### Service Name
Global Team Clock

### Short Title
Timezone Overlap Dashboard for Remote Teams

### Description
Global Team Clock is a visual tool designed for remote teams to find overlapping work hours across multiple cities and timezones. Built entirely with vanilla JavaScript using the native `Intl.DateTimeFormat` and `Intl.supportedValuesOf('timeZone')` APIs, it requires zero external API calls. Users can add cities, visualize 24-hour timelines, adjust working hours, find optimal meeting times, and share their configuration via URL parameters.

### Target Audience
- Remote team managers scheduling across timezones
- Distributed engineering teams planning standups
- Freelancers coordinating with international clients
- Digital nomads tracking time back home
- HR professionals managing global workforce

### Target Keywords (SEO)
- "timezone overlap"
- "remote team clock"
- "world clock for teams"
- "timezone converter"
- "meeting time finder"
- "work hours overlap tool"

---

## 2. Harness Design Methodology

### Agent Workflow

```
Planner Agent
  --> Analyze PRD, break into milestones and tasks
  --> Output: milestone_plan.json

Initializer Agent
  --> Generate feature_list.json
  --> Generate claude-progress.txt
  --> Generate init.sh (project scaffold)
  --> Bootstrap project structure

Fixed Session Routine
  --> Each session: read claude-progress.txt
  --> Pick next incomplete task
  --> Build -> Test -> Commit
  --> Update claude-progress.txt

Builder Agent
  --> Implements features per milestone
  --> Writes code, tests locally

Reviewer Agent
  --> Reviews code quality, accessibility, SEO
  --> Validates against PRD requirements
  --> Confirms milestone completion
```

### Initializer Agent Outputs

#### feature_list.json
```json
{
  "project": "GlobalTeamClock",
  "features": [
    {
      "id": "F01",
      "name": "Project Scaffold & Tailwind Setup",
      "milestone": 1,
      "status": "pending"
    },
    {
      "id": "F02",
      "name": "Timezone Data Engine (Intl API)",
      "milestone": 1,
      "status": "pending"
    },
    {
      "id": "F03",
      "name": "City Selector (Searchable)",
      "milestone": 2,
      "status": "pending"
    },
    {
      "id": "F04",
      "name": "Live Clock Per City",
      "milestone": 2,
      "status": "pending"
    },
    {
      "id": "F05",
      "name": "Horizontal 24h Timeline Bars",
      "milestone": 3,
      "status": "pending"
    },
    {
      "id": "F06",
      "name": "Working Hours Overlay (Adjustable)",
      "milestone": 3,
      "status": "pending"
    },
    {
      "id": "F07",
      "name": "Overlap Highlight Zone",
      "milestone": 3,
      "status": "pending"
    },
    {
      "id": "F08",
      "name": "Find Best Meeting Time Button",
      "milestone": 4,
      "status": "pending"
    },
    {
      "id": "F09",
      "name": "Share Link via URL Params",
      "milestone": 4,
      "status": "pending"
    },
    {
      "id": "F10",
      "name": "Auto i18n (8+ Languages)",
      "milestone": 5,
      "status": "pending"
    },
    {
      "id": "F11",
      "name": "SEO Optimization",
      "milestone": 5,
      "status": "pending"
    },
    {
      "id": "F12",
      "name": "Ad Integration (Adsterra + AdSense)",
      "milestone": 6,
      "status": "pending"
    },
    {
      "id": "F13",
      "name": "Google Sheets Webhook",
      "milestone": 6,
      "status": "pending"
    },
    {
      "id": "F14",
      "name": "Visitor Counter (Today + Total)",
      "milestone": 6,
      "status": "pending"
    },
    {
      "id": "F15",
      "name": "Feedback & Social Sharing",
      "milestone": 7,
      "status": "pending"
    },
    {
      "id": "F16",
      "name": "Static Pages (About, FAQ, Privacy, Terms)",
      "milestone": 7,
      "status": "pending"
    },
    {
      "id": "F17",
      "name": "Deployment to Vercel",
      "milestone": 8,
      "status": "pending"
    }
  ]
}
```

#### claude-progress.txt
```
# Global Team Clock - Progress Tracker
# Updated: [timestamp]

## Current Milestone: 1
## Current Task: F01 - Project Scaffold & Tailwind Setup
## Status: NOT STARTED

### Milestone 1: Foundation [NOT STARTED]
- [ ] F01: Project Scaffold & Tailwind Setup
- [ ] F02: Timezone Data Engine

### Milestone 2: Core Clock [NOT STARTED]
- [ ] F03: City Selector
- [ ] F04: Live Clock Per City

### Milestone 3: Timeline Visualization [NOT STARTED]
- [ ] F05: Horizontal 24h Timeline Bars
- [ ] F06: Working Hours Overlay
- [ ] F07: Overlap Highlight Zone

### Milestone 4: Smart Features [NOT STARTED]
- [ ] F08: Find Best Meeting Time
- [ ] F09: Share Link via URL Params

### Milestone 5: SEO & i18n [NOT STARTED]
- [ ] F10: Auto i18n
- [ ] F11: SEO Optimization

### Milestone 6: Monetization & Analytics [NOT STARTED]
- [ ] F12: Ad Integration
- [ ] F13: Google Sheets Webhook
- [ ] F14: Visitor Counter

### Milestone 7: Content & Social [NOT STARTED]
- [ ] F15: Feedback & Social Sharing
- [ ] F16: Static Pages

### Milestone 8: Deployment [NOT STARTED]
- [ ] F17: Deploy to Vercel

### Notes:
```

#### init.sh
```bash
#!/bin/bash
# Global Team Clock - Project Initializer

mkdir -p src/{css,js,images,pages}
touch src/index.html
touch src/css/styles.css
touch src/js/app.js
touch src/js/timezone.js
touch src/js/timeline.js
touch src/js/i18n.js
touch src/js/analytics.js
touch src/js/ads.js
touch src/pages/about.html
touch src/pages/faq.html
touch src/pages/privacy.html
touch src/pages/terms.html
touch src/sitemap.xml
touch src/robots.txt

echo "Project scaffold created."
```

---

## 3. Technical Architecture

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Markup | Vanilla HTML5 (semantic) |
| Styling | Tailwind CSS (CDN), custom CSS |
| Logic | Vanilla JavaScript (ES6+) |
| Timezone Data | `Intl.DateTimeFormat`, `Intl.supportedValuesOf('timeZone')` |
| Hosting | Vercel (free tier) |
| Ads | Adsterra (primary), Google AdSense (secondary) |
| Analytics | Google Sheets via Apps Script webhook |

### No External APIs Needed
This project uses zero external API calls. All timezone data comes from the browser's built-in `Intl` API:
- `Intl.supportedValuesOf('timeZone')` returns all IANA timezone identifiers
- `Intl.DateTimeFormat` formats time per timezone
- `Intl.DateTimeFormat().resolvedOptions().timeZone` detects user timezone

### Infrastructure Cost
**$0 total** - Pure client-side, Vercel free hosting. No API calls.

### File Structure
```
GlobalTeamClock/
├── index.html                 # Main dashboard
├── css/
│   └── styles.css             # Custom styles, timeline CSS
├── js/
│   ├── app.js                 # Core state management, UI rendering
│   ├── timezone.js            # Timezone engine: Intl API wrapper
│   ├── timeline.js            # 24h bar rendering, overlap calculation
│   ├── i18n.js                # Internationalization
│   ├── analytics.js           # Visitor counter, webhook
│   └── ads.js                 # Ad injection
├── pages/
│   ├── about.html
│   ├── faq.html
│   ├── privacy.html
│   └── terms.html
├── images/
│   ├── og-image.png
│   └── favicon.ico
├── sitemap.xml
├── robots.txt
├── feature_list.json
├── claude-progress.txt
├── init.sh
├── vercel.json
└── README.md
```

---

## 4. Design System

### Color Palette (Soft Background)
| Role | Color | Hex |
|------|-------|-----|
| Background | Soft warm gray | #F5F3EF |
| Background Alt | Slightly darker | #ECE9E3 |
| Surface/Card | White soft | #FEFDFB |
| Primary | Deep teal | #0D9488 |
| Primary Hover | Lighter teal | #14B8A6 |
| Secondary | Warm coral | #F97316 |
| Timeline Day | Soft yellow | #FEF3C7 |
| Timeline Night | Soft indigo | #E0E7FF |
| Work Hours | Green overlay | rgba(34, 197, 94, 0.25) |
| Overlap Zone | Bright green | rgba(34, 197, 94, 0.5) |
| Text Primary | Dark charcoal | #1F2937 |
| Text Secondary | Warm gray | #6B7280 |
| Border | Light warm gray | #D1D5DB |
| Current Time Marker | Red line | #EF4444 |

### Typography
- **Headings**: Inter, weight 600-700
- **Body**: Inter, weight 400
- **Clock digits**: Tabular nums, JetBrains Mono or monospace
- **Base size**: 16px

### Timeline Visual Language
- Each city = one horizontal bar (full width)
- Bar divided into 24 segments (hours)
- Night hours (18:00-06:00): soft indigo tint
- Day hours (06:00-18:00): soft yellow tint
- Work hours: green overlay (adjustable start/end)
- Overlap of all work hours: bright green highlight
- Current time: vertical red line animated

### Component Patterns
- **City Card**: Horizontal row with city name, UTC offset, live clock, remove button
- **Timeline Bar**: CSS Grid 24 columns, each column = 1 hour
- **City Selector**: Searchable dropdown with autocomplete, grouped by region
- **Meeting Time Button**: Prominent CTA, outputs list of overlapping 1-hour slots

---

## 5. Feature Specifications

### F01: Project Scaffold & Tailwind Setup
- Directory structure per file structure spec
- Tailwind CSS via CDN
- Base HTML template with semantic structure
- Soft warm gray background
- Responsive viewport settings

### F02: Timezone Data Engine
- Module `timezone.js`:
  - `getAllTimezones()` - returns all IANA timezone IDs via `Intl.supportedValuesOf('timeZone')`
  - `getTimezoneOffset(tz)` - returns UTC offset in hours
  - `getCurrentTime(tz)` - returns formatted current time string
  - `getUserTimezone()` - detects user's local timezone
  - `getTimezoneLabel(tz)` - human-readable label (e.g., "New York (UTC-5)")
  - `isWorkingHour(tz, hour, workStart, workEnd)` - checks if hour is within work range
  - `findOverlap(timezones, workHours)` - calculates overlap windows
- City-to-timezone mapping for common cities
- Group timezones by continent/region

### F03: City Selector (Searchable)
- Input field with autocomplete dropdown
- Search by city name, country, or timezone ID
- Grouped results: Americas, Europe, Asia, Africa, Oceania
- Quick-add popular cities (New York, London, Tokyo, Sydney, etc.)
- Maximum 8-10 cities simultaneously
- Add user's detected timezone automatically on first visit
- Remove city with X button on each city row

### F04: Live Clock Per City
- Digital clock display per city row
- Updates every second via `setInterval`
- Format: HH:MM:SS (24h or 12h based on locale)
- Show date if different from user's local date (e.g., "+1 day")
- UTC offset display (e.g., "UTC+9")
- Day/night icon based on current time at that city
- Pulse animation on the colon separator

### F05: Horizontal 24h Timeline Bars
- Each city gets a full-width horizontal bar
- Bar is divided into 24 equal columns (hours)
- Hour labels at top (00, 03, 06, 09, 12, 15, 18, 21)
- Visual differentiation: daytime vs nighttime hours
- Bars are aligned so the same visual column = same absolute moment
- Scroll or zoom capability if bars get dense
- Current time marker (red vertical line) across all bars

### F06: Working Hours Overlay (Adjustable)
- Default working hours: 09:00 - 18:00 (per city)
- Green semi-transparent overlay on working hour segments
- Adjustable per city via:
  - Click-drag on timeline bar to set range
  - Or numeric inputs (start hour / end hour)
- Handle overnight work hours (e.g., 22:00 - 06:00)
- "Apply to All" button to set same hours for all cities
- Visual distinction between custom and default hours

### F07: Overlap Highlight Zone
- Calculate the intersection of all cities' working hours
- Highlight overlapping hours with a bright green zone
- If no overlap exists, show warning message with suggestion
- Overlap summary text: "3 hours overlap (14:00-17:00 UTC)"
- Partial overlap indicator (e.g., only 2 of 3 cities overlap)
- Visual: brighter green overlay where all bars have work hours

### F08: Find Best Meeting Time Button
- CTA button: "Find Best Meeting Time"
- Algorithm:
  1. Calculate all overlapping 1-hour slots across all cities
  2. Rank by number of cities available
  3. Prefer slots during traditional work hours (9-18)
  4. Present top 3 suggestions
- Output: Modal or panel with:
  - Suggested time slots
  - Time displayed in each city's local time
  - "Copy to clipboard" for easy sharing
- Edge case: when no overlap, suggest "least bad" option (most cities in work hours)

### F09: Share Link via URL Params
- Encode current configuration in URL parameters:
  - `cities`: comma-separated timezone IDs
  - `work`: comma-separated work hour ranges (start-end per city)
  - Example: `?cities=America/New_York,Europe/London,Asia/Tokyo&work=9-18,9-17,10-19`
- Auto-restore configuration from URL on page load
- "Copy Share Link" button in UI
- Short enough for messaging and email
- URL updates dynamically as user modifies configuration

### F10: Auto i18n (8+ Languages)
- Detect via `navigator.language`
- Supported: EN, KO, JA, ZH, ES, DE, FR, PT
- Translate all UI strings
- Date/time formatting uses `Intl.DateTimeFormat` per locale automatically
- Language switcher dropdown
- localStorage preference persistence
- Fallback to EN

### F11: SEO Optimization
- Semantic HTML5 structure
- Meta title: "Global Team Clock - Timezone Overlap Dashboard for Remote Teams"
- Meta description with target keywords
- Open Graph tags (og:title, og:description, og:image, og:url)
- Twitter Card tags
- JSON-LD structured data (WebApplication, SoftwareApplication)
- sitemap.xml, robots.txt
- Canonical URLs
- Heading hierarchy

### F12: Ad Integration
- **Adsterra (Primary)**:
  - Top banner below header (728x90 / 320x50)
  - Sidebar ad on desktop (300x250)
  - Placeholder divs with `data-adsterra-key`
- **Google AdSense (Secondary)**:
  - Publisher ID: `ca-pub-7098271335538021`
  - Auto-ads script
  - Manual slot below timeline area

### F13: Google Sheets Webhook
- Auto POST on:
  - Page load (cities from URL if shared link)
  - City added (city name)
  - "Find Best Meeting Time" clicked
- Payload: `{ timestamp, action, detail, language, referrer }`
- Non-blocking, silent

### F14: Visitor Counter
- Footer: "Today: X | Total: Y"
- localStorage-based with external counter backup
- Non-intrusive

### F15: Feedback & Social Sharing
- Feedback mailto: `taeshinkim11@gmail.com` with subject "Global Team Clock Feedback"
- Social sharing: Twitter/X, LinkedIn, Slack (copy link), Email
- Pre-filled message: "Check our team's timezone overlap: [URL]"
- Share button copies the parameterized URL

### F16: Static Pages
- About, FAQ/How to Use, Privacy Policy, Terms of Service
- Consistent design theme
- FAQ includes timezone explanation, DST notes

---

## 6. Milestones & Git Strategy

### Milestone Plan

| Milestone | Features | Git Tag | Description |
|-----------|----------|---------|-------------|
| M1 | F01, F02 | v0.1.0 | Foundation + timezone engine |
| M2 | F03, F04 | v0.2.0 | City selector + live clocks |
| M3 | F05, F06, F07 | v0.3.0 | Timeline visualization + overlap |
| M4 | F08, F09 | v0.4.0 | Meeting finder + sharing |
| M5 | F10, F11 | v0.5.0 | SEO + i18n |
| M6 | F12, F13, F14 | v0.6.0 | Monetization + analytics |
| M7 | F15, F16 | v0.7.0 | Content + social |
| M8 | F17 | v1.0.0 | Deployment |

### Git Strategy
```bash
gh repo create GlobalTeamClock --private --source=. --remote=origin
git init && git add . && git commit -m "feat(F01): initial scaffold"
git push -u origin main
git tag v0.1.0 && git push origin v0.1.0
```

---

## 7. Deployment Checklist

### Pre-Deployment
- [ ] All features implemented and tested
- [ ] Timeline renders correctly for edge cases (DST transitions, UTC+13, etc.)
- [ ] Responsive design verified (mobile/tablet/desktop)
- [ ] SEO tags validated
- [ ] Ad slots configured
- [ ] Webhook tested
- [ ] Visitor counter functional
- [ ] i18n verified for all 8 languages
- [ ] Static pages complete
- [ ] URL sharing works end-to-end
- [ ] No console errors
- [ ] Lighthouse > 90

### Vercel Deployment
```bash
vercel --prod
```

### vercel.json
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

---

## 8. Google Sheets Webhook Setup

### Apps Script
```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(),
    data.action,
    data.detail,
    data.language,
    data.referrer,
    data.userAgent
  ]);
  return ContentService.createTextOutput(
    JSON.stringify({ status: "ok" })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

---

## 9. Ad Monetization Strategy

### Adsterra Placements
- Top banner below header
- Sidebar ad on desktop (next to timeline)
- Footer banner above footer content
- All non-intrusive to timeline workflow

### Google AdSense
- Publisher ID: `ca-pub-7098271335538021`
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7098271335538021" crossorigin="anonymous"></script>
```

---

## 10. i18n Implementation

### Supported Languages
| Code | Language |
|------|----------|
| EN | English |
| KO | Korean |
| JA | Japanese |
| ZH | Chinese (Simplified) |
| ES | Spanish |
| DE | German |
| FR | French |
| PT | Portuguese |

### Translation Keys (Sample)
```json
{
  "EN": {
    "title": "Global Team Clock",
    "subtitle": "Timezone Overlap Dashboard for Remote Teams",
    "add_city": "Add City",
    "search_city": "Search city or timezone...",
    "working_hours": "Working Hours",
    "overlap": "Overlap",
    "find_meeting": "Find Best Meeting Time",
    "share_link": "Copy Share Link",
    "no_overlap": "No overlap found. Try adjusting work hours.",
    "hours_overlap": "{count} hours overlap",
    "remove": "Remove",
    "apply_all": "Apply to All",
    "suggested_times": "Suggested Meeting Times",
    "copy": "Copy"
  }
}
```

---

## 11. Performance & Accessibility

### Performance
- Zero API calls (all client-side Intl API)
- Lightweight: total page < 200KB
- Efficient timeline rendering with CSS Grid
- requestAnimationFrame for clock updates
- Debounced city search input

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation for city selector and timeline
- ARIA labels on timeline segments (hour, day/night, work/non-work)
- Screen reader announcements for overlap results
- High contrast mode support
- Color is not the only indicator (patterns + labels)

---

## 12. Edge Cases & Special Handling

| Case | Handling |
|------|---------|
| DST transitions | Use Intl API (handles DST natively) |
| Half-hour offsets (India +5:30) | Support 30-min granularity on timeline |
| 45-min offsets (Nepal +5:45) | Round to nearest 30 min for display, exact in calculations |
| UTC+13/+14 (Samoa, Kiribati) | Full support, bars wrap correctly |
| Overnight work hours | Wrap green overlay across midnight |
| No overlap possible | Show "no overlap" message with suggestion |
| Same city added twice | Prevent duplicate additions |
| URL too long for sharing | Abbreviate timezone IDs where possible |

---

## 13. Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Browser Intl API inconsistency | Low | Medium | Feature detection, fallback timezone list |
| DST calculation errors | Low | Medium | Rely on Intl API (browser handles DST) |
| Too many cities slow rendering | Low | Low | Cap at 10 cities, optimize redraws |
| URL param encoding issues | Medium | Low | encodeURIComponent, validate on parse |
| Old browser compatibility | Low | Medium | Polyfill for supportedValuesOf if needed |

---

## 14. Success Metrics

| Metric | Target (Month 1) | Target (Month 3) |
|--------|------------------|------------------|
| Daily Visitors | 30 | 300 |
| Shared Links Created | 10/day | 100/day |
| "Find Meeting" Clicks | 20/day | 200/day |
| Avg Cities Per Session | 3 | 4 |
| Ad Revenue | $0-3 | $5-30 |
| Returning Users | 20% | 40% |

---

## 15. Future Enhancements (Post-MVP)

- Slack integration (post meeting suggestion to channel)
- Google Calendar integration (create event from suggestion)
- Team presets (save named team configurations)
- DST change alerts ("clocks change next week in London")
- Dark mode toggle
- Drag-to-schedule on timeline (visual meeting block)
- PWA for quick access from home screen
- Weekly overlap report (email digest)

---

*Document Version: 1.0*
*Created: 2026-04-01*
*Methodology: Harness Design*
