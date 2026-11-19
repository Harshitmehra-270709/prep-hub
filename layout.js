/* Shared layout: icon sprite, sidebar, top bar and WhatsApp widget.
   Every page includes this file once. Pages only provide <div class="shell"><main class="content">…</main></div>.
   Set <body data-nav="prep"> to highlight the active sidebar item. */
(function () {
  const ASSET = {
    logo: 'https://placement.acciojob.com/_next/static/media/logoWithName.0ijj9j5dk1yc1.svg',
    mark: 'https://placement.acciojob.com/_next/static/media/acciojob.2caah15xxxi-b.svg',
    placements: 'https://placement.acciojob.com/_next/static/media/placement-icon-active.25o_u71npy-wz.png',
    play: 'https://placement.acciojob.com/google-play.png',
    qrLink: 'https://placement.acciojob.com/record-qr-scan?d=Home_Page%2CWeb%2CQR%2CWeb_Home_Page_QR&utm=Web_Home_Page_QR%2C%2C%2C%2C%2C',
    waSupport: 'https://api.whatsapp.com/send?phone=918882483638&text=Hi%20Team%2C%0AI%20have%20a%20few%20questions%2C%20can%20you%20help%3F%0AThanks',
    waChannel: 'https://go.acciojob.com/Kz7yU4',
  };

  // Phosphor icons (exact paths from the live site) + a few stroke icons for inner pages
  const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<symbol id="i-bell" viewBox="0 0 256 256"><path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"/></symbol>
<symbol id="i-home" viewBox="0 0 256 256"><path d="M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V160h32v56a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68ZM208,208H160V152a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8v56H48V120l80-80,80,80Z"/></symbol>
<symbol id="i-jobs" viewBox="0 0 256 256"><path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm64,24V200H96V72ZM40,72H80V200H40ZM216,200H176V72h40V200Z"/></symbol>
<symbol id="i-courses" viewBox="0 0 256 256"><path d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87v48.42a15.91,15.91,0,0,0,4.06,10.65C49.16,191.53,78.51,216,128,216a130,130,0,0,0,48-8.76V240a8,8,0,0,0,16,0V199.51a115.63,115.63,0,0,0,27.94-22.57A15.91,15.91,0,0,0,224,166.29V117.87l27.76-14.81a8,8,0,0,0,0-14.12ZM128,200c-43.27,0-68.72-21.14-80-33.71V126.4l76.24,40.66a8,8,0,0,0,7.52,0L176,143.47v46.34C163.4,195.69,147.52,200,128,200Zm80-33.75a97.83,97.83,0,0,1-16,14.25V134.93l16-8.53ZM188,118.94l-.22-.13-56-29.87a8,8,0,0,0-7.52,14.12L171,128l-43,22.93L25,96,128,41.07,231,96Z"/></symbol>
<symbol id="i-book" viewBox="0 0 256 256"><path d="M232,48H160a40,40,0,0,0-32,16A40,40,0,0,0,96,48H24a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h72a8,8,0,0,0,8-8V56A8,8,0,0,0,232,48ZM96,192H32V64H96a24,24,0,0,1,24,24V200A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V88a24,24,0,0,1,24-24h64Z"/></symbol>
<symbol id="i-trophy" viewBox="0 0 256 256"><path d="M232,64H208V48a8,8,0,0,0-8-8H56a8,8,0,0,0-8,8V64H24A16,16,0,0,0,8,80V96a40,40,0,0,0,40,40h3.65A80.13,80.13,0,0,0,120,191.61V216H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V191.58c31.94-3.23,58.44-25.64,68.08-55.58H208a40,40,0,0,0,40-40V80A16,16,0,0,0,232,64ZM48,120A24,24,0,0,1,24,96V80H48v32q0,4,.39,8Zm144-8.9c0,35.52-29,64.64-64,64.9a64,64,0,0,1-64-64V56H192ZM232,96a24,24,0,0,1-24,24h-.5a81.81,81.81,0,0,0,.5-8.9V80h24Z"/></symbol>
<symbol id="i-prep" viewBox="0 0 256 256"><path d="M96,113.89,107.06,136H84.94ZM232,56V216a8,8,0,0,1-11.58,7.16L192,208.94l-28.42,14.22a8,8,0,0,1-7.16,0L128,208.94,99.58,223.16a8,8,0,0,1-7.16,0L64,208.94,35.58,223.16A8,8,0,0,1,24,216V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56ZM135.16,156.42l-32-64a8,8,0,0,0-14.32,0l-32,64a8,8,0,0,0,14.32,7.16L76.94,152h38.12l5.78,11.58a8,8,0,1,0,14.32-7.16ZM208,128a8,8,0,0,0-8-8H184V104a8,8,0,0,0-16,0v16H152a8,8,0,0,0,0,16h16v16a8,8,0,0,0,16,0V136h16A8,8,0,0,0,208,128Z"/></symbol>
<symbol id="i-target" viewBox="0 0 256 256"><path d="M221.87,83.16A104.1,104.1,0,1,1,195.67,49l22.67-22.68a8,8,0,0,1,11.32,11.32l-96,96a8,8,0,0,1-11.32-11.32l27.72-27.72a40,40,0,1,0,17.87,31.09,8,8,0,1,1,16-.9,56,56,0,1,1-22.38-41.65L184.3,60.39a87.88,87.88,0,1,0,23.13,29.67,8,8,0,0,1,14.44-6.9Z"/></symbol>
<symbol id="i-signin" viewBox="0 0 256 256"><path d="M141.66,133.66l-40,40A8,8,0,0,1,88,168V136H24a8,8,0,0,1,0-16H88V88a8,8,0,0,1,13.66-5.66l40,40A8,8,0,0,1,141.66,133.66ZM200,32H136a8,8,0,0,0,0,16h56V208H136a8,8,0,0,0,0,16h64a8,8,0,0,0,8-8V40A8,8,0,0,0,200,32Z"/></symbol>
<symbol id="i-arrow" viewBox="0 0 256 256"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/></symbol>
<symbol id="i-mic" viewBox="0 0 256 256"><path d="M128,176a48.05,48.05,0,0,0,48-48V64a48,48,0,0,0-96,0v64A48.05,48.05,0,0,0,128,176ZM96,64a32,32,0,0,1,64,0v64a32,32,0,0,1-64,0Zm40,143.6V240a8,8,0,0,1-16,0V207.6A80.11,80.11,0,0,1,48,128a8,8,0,0,1,16,0,64,64,0,0,0,128,0,8,8,0,0,1,16,0A80.11,80.11,0,0,1,136,207.6Z"/></symbol>
<symbol id="i-briefcase" viewBox="0 0 256 256"><path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,72v41.61A184,184,0,0,1,128,136a184.07,184.07,0,0,1-88-22.38V72Zm0,128H40V131.64A200.19,200.19,0,0,0,128,152a200.25,200.25,0,0,0,88-20.37V200ZM104,112a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H112A8,8,0,0,1,104,112Z"/></symbol>
<symbol id="i-compass" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM172.42,72.84l-64,32a8.05,8.05,0,0,0-3.58,3.58l-32,64A8,8,0,0,0,80,184a8.1,8.1,0,0,0,3.58-.84l64-32a8.05,8.05,0,0,0,3.58-3.58l32-64a8,8,0,0,0-10.74-10.74ZM138,138,97.89,158.11,118,118l40.15-20.07Z"/></symbol>
<symbol id="i-chart" viewBox="0 0 256 256"><path d="M224,200h-8V40a8,8,0,0,0-8-8H152a8,8,0,0,0-8,8V80H96a8,8,0,0,0-8,8v40H48a8,8,0,0,0-8,8v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM160,48h40V200H160ZM104,96h40V200H104ZM56,144H88v56H56Z"/></symbol>
<symbol id="i-infinity" viewBox="0 0 256 256"><path d="M248,128a56,56,0,0,1-95.6,39.6l-.33-.35L92.12,99.55a40,40,0,1,0,0,56.9l8.52-9.62a8,8,0,1,1,12,10.61l-8.69,9.81-.33.35a56,56,0,1,1,0-79.2l.33.35,59.95,67.7a40,40,0,1,0,0-56.9l-8.52,9.62a8,8,0,1,1-12-10.61l8.69-9.81.33-.35A56,56,0,0,1,248,128Z"/></symbol>
<symbol id="i-whatsapp" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.862L.057 23.486a.5.5 0 0 0 .612.612l5.684-1.46A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.034-1.384l-.36-.214-3.735.96.99-3.647-.235-.374A9.818 9.818 0 1 1 12 21.818z"/></symbol>
<symbol id="i-chevron" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m9 6 6 6-6 6"/></symbol>
<symbol id="i-search" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></g></symbol>
<symbol id="i-plus" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 5v14M5 12h14"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="m5 12 5 5 9-10"/></symbol>
<symbol id="i-building" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10 21v-3h4v3"/></g></symbol>
<symbol id="i-pin" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></g></symbol>
<symbol id="i-cash" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10M7 9h10M12 9c3 0 4-2.5 4-5M7 4c3 0 5 2 5 5L7 20"/></g></symbol>
<symbol id="i-clock" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></g></symbol>
<symbol id="i-monitor" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></g></symbol>
<symbol id="i-gauge" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 18a8 8 0 1 1 16 0"/><path d="m12 18 4-6"/></g></symbol>
<symbol id="i-code" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/></symbol>
<symbol id="i-star" viewBox="0 0 24 24"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></symbol>
<symbol id="i-bulb" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></g></symbol>
<symbol id="i-chat" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z"/></symbol>
<symbol id="i-user" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/></g></symbol>
<symbol id="i-folder" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></symbol>
<symbol id="i-file" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></g></symbol>
<symbol id="i-upload" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M12 17v-6M9.5 13.5 12 11l2.5 2.5"/></g></symbol>
<symbol id="i-trend" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="m3 17 6-6 4 4 8-8M15 7h6v6"/></symbol>
<symbol id="i-refresh" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M20 11a8 8 0 0 0-14.9-3M4 4v4h4M4 13a8 8 0 0 0 14.9 3M20 20v-4h-4"/></symbol>
<symbol id="i-camera" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/></g></symbol>
<symbol id="i-external" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M7 17 17 7M9 7h8v8"/></symbol>
<symbol id="i-layers" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/></g></symbol>
<symbol id="i-layout" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/></g></symbol>
<symbol id="i-database" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></g></symbol>
<symbol id="i-bug" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="7" y="7" width="10" height="13" rx="5"/><path d="M12 12v4M3 13h4M17 13h4M5 7l2 2M19 7l-2 2M5 20l2-2M19 20l-2-2M9 4l1 3M15 4l-1 3"/></g></symbol>
<symbol id="i-cpu" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M10 2v4M14 2v4M10 18v4M14 18v4M2 10h4M2 14h4M18 10h4M18 14h4"/></g></symbol>
<symbol id="i-cube" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m12 2 9 5v10l-9 5-9-5V7z"/><path d="m3 7 9 5 9-5M12 12v10"/></g></symbol>
<symbol id="i-brain" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/></g></symbol>
<symbol id="i-graph" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4v16h16"/><path d="m8 15 3-4 3 2 5-6"/></g></symbol>
</defs></svg>`;

  const NAV = [
    { key: 'home', label: 'Home', icon: 'i-home', href: '#' },
    { key: 'jobs', label: 'Jobs', icon: 'i-jobs', href: '#' },
    { key: 'placements', label: 'Placements', img: ASSET.placements, href: '#' },
    { key: 'courses', label: 'Courses', icon: 'i-courses', href: '#' },
    { key: 'fast-track', label: 'Fast Track Placements', icon: 'i-book', href: '#' },
    { key: 'ai-open', label: 'India AI Open', sub: 'Registrations open', icon: 'i-trophy', href: '#', flag: true },
    { key: 'prep', label: 'Job Preparation Hub', icon: 'i-prep', href: 'index.html' },
    { key: 'skill-analysis', label: 'Skill Analysis', icon: 'i-target', href: '#' },
  ];

  const active = document.body.dataset.nav || 'prep';
  const navHtml = NAV.map((n) => {
    const icon = n.img ? `<img class="nav-img" src="${n.img}" alt="" />` : `<svg><use href="#${n.icon}"/></svg>`;
    const label = n.sub ? `<span class="nav-event-text">${n.label}<small>${n.sub}</small></span>` : n.label;
    const flag = n.flag ? '<span class="nav-flag"><i></i><i></i></span>' : '';
    return `<a href="${n.href}" class="nav-item${n.key === active ? ' active' : ''}">${icon}${label}${flag}</a>`;
  }).join('');

  const sidebar = `
  <aside class="sidebar" id="sidebar">
    <a class="brand" href="index.html"><img src="${ASSET.logo}" alt="AccioJob Logo" width="142" height="42" /></a>
    <nav class="nav">${navHtml}</nav>
    <div class="sidebar-bottom">
      <div class="app-card">
        <div class="qr" id="qr" aria-label="QR code to download the AccioJob app"></div>
        <p><strong>2590+</strong> Users have downloaded our app in the last 24 hours!</p>
        <span class="muted-xs">Available on</span>
        <a href="#" class="play-badge"><img src="${ASSET.play}" alt="Google Play Store" width="122" height="40" /></a>
      </div>
      <button class="btn-signin">Sign in <svg><use href="#i-signin"/></svg></button>
    </div>
  </aside>
  <div class="scrim" id="scrim"></div>`;

  const topbar = `
  <header class="topbar">
    <button class="menu-btn" id="menuBtn" aria-label="Open menu"><svg class="stroke" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>
    <div class="topbar-right">
      <button class="icon-btn" aria-label="Notifications"><svg><use href="#i-bell"/></svg></button>
      <a href="#" class="btn-about"><img src="${ASSET.mark}" alt="AccioJob Logo" width="24" height="24" />About Acciojob</a>
    </div>
  </header>`;

  const whatsapp = `
  <div class="wa-popup" id="waPopup" hidden>
    <button class="wa-close" id="waClose" aria-label="Close">×</button>
    <div class="wa-section">
      <h5>Join WhatsApp community</h5>
      <p>Get real-time updates on new job drives, results, and masterclasses</p>
      <a href="${ASSET.waChannel}" target="_blank" rel="noopener" class="wa-btn"><svg><use href="#i-whatsapp"/></svg>Join Community</a>
      <small>1,200+ students are already in the community</small>
    </div>
    <hr />
    <div class="wa-section">
      <h5>Need help? Chat with our support team</h5>
      <p>We're available 9 AM to 10 PM, every day. We typically reply in 2–3 minutes.</p>
      <a href="${ASSET.waSupport}" target="_blank" rel="noopener" class="wa-btn wa-btn--ghost"><svg><use href="#i-whatsapp"/></svg>Chat on WhatsApp</a>
    </div>
  </div>
  <button class="wa-fab" id="waFab" aria-label="WhatsApp"><span class="wa-dot"></span><svg><use href="#i-whatsapp"/></svg></button>`;

  document.body.insertAdjacentHTML('afterbegin', SPRITE + sidebar);
  const shell = document.querySelector('.shell');
  shell.insertAdjacentHTML('afterbegin', topbar);
  document.body.insertAdjacentHTML('beforeend', whatsapp);

  // QR code (same tracking link as the live site)
  const qrEl = document.getElementById('qr');
  if (qrEl && window.qrcode) {
    const qr = qrcode(0, 'L');
    qr.addData(ASSET.qrLink);
    qr.make();
    qrEl.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
  }

  // Mobile sidebar
  const sb = document.getElementById('sidebar');
  const scrim = document.getElementById('scrim');
  const toggle = (open) => { sb.classList.toggle('open', open); scrim.classList.toggle('show', open); };
  document.getElementById('menuBtn').addEventListener('click', () => toggle(true));
  scrim.addEventListener('click', () => toggle(false));

  // WhatsApp popup
  const wa = document.getElementById('waPopup');
  document.getElementById('waFab').addEventListener('click', () => { wa.hidden = !wa.hidden; });
  document.getElementById('waClose').addEventListener('click', () => { wa.hidden = true; });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { wa.hidden = true; toggle(false); } });

  // Generic accordion: any .acc-item with a .acc-head button
  document.addEventListener('click', (e) => {
    const head = e.target.closest('.acc-head');
    if (head) head.parentElement.classList.toggle('open');
  });

  // "Start test" sheet shared by role and skill pages (front-end only — no test engine is connected)
  document.body.insertAdjacentHTML('beforeend', `
  <div class="modal" id="startModal" hidden>
    <div class="modal-card start-sheet">
      <button class="wa-close" data-close aria-label="Close">×</button>
      <span class="chip-sm" id="stKind"></span>
      <h3 id="stTitle"></h3>
      <div class="pills" id="stPills"></div>
      <div class="hb-label" style="margin-top:18px">Before you begin</div>
      <ul class="st-rules">
        <li>Keep ${'~'}<b id="stMins"></b> minutes free — the timer can't be paused once you start.</li>
        <li>Use a laptop or desktop with a stable internet connection.</li>
        <li id="stCam">Your camera and mic will be on for the AI interview part.</li>
        <li>Your report is emailed to you when you finish.</li>
      </ul>
      <button class="btn-block" id="stGo">I'm ready — start test</button>
      <p class="st-note" id="stNote" hidden>The multiple-choice test engine isn't part of this build yet. Pick the “+ AI Interview” option to take a live voice interview on the same topics.</p>
    </div>
  </div>`);
  const sm = document.getElementById('startModal');
  let startHref = null;
  sm.addEventListener('click', (e) => { if (e.target === sm || e.target.hasAttribute('data-close')) sm.hidden = true; });
  // AI-interview options carry an href to the live interview page; plain MCQ tests have none yet.
  document.getElementById('stGo').addEventListener('click', () => {
    if (startHref) location.href = startHref;
    else document.getElementById('stNote').hidden = false;
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') sm.hidden = true; });
  const startTest = ({ title, minutes, parts = [], ai = false, href = null }) => {
    startHref = href;
    document.getElementById('stKind').textContent = ai ? 'Practice test + AI interview' : 'Practice test';
    document.getElementById('stTitle').textContent = title;
    document.getElementById('stMins').textContent = minutes;
    document.getElementById('stPills').innerHTML = [`<span><svg><use href="#i-clock"/></svg>${minutes} mins</span>`,
      ...parts.map((p) => `<span><svg><use href="#i-check"/></svg>${p}</span>`)].join('');
    document.getElementById('stCam').hidden = !ai;
    document.getElementById('stNote').hidden = true;
    sm.hidden = false;
  };

  /** Link to the live interview page. Topics are '|'-separated because topic names contain commas. */
  const interviewUrl = ({ mode, role, track, topics = [], title, back }) => {
    const q = new URLSearchParams({ mode });
    if (role) q.set('role', role);
    if (track && track !== 'default') q.set('track', track);
    if (topics.length) q.set('topics', topics.join('|'));
    if (title) q.set('title', title);
    q.set('back', back || location.pathname.split('/').pop() + location.search);
    return 'interview.html?' + q;
  };

  // Shared helpers for page scripts
  window.UI = {
    startTest,
    interviewUrl,
    icon: (id, cls = '') => `<svg class="${cls}"><use href="#${id}"/></svg>`,
    esc: (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])),
    crumbs: (items) => `<nav class="crumbs">${items.map((c, i) => i < items.length - 1
      ? `<a href="${c[1]}">${c[0]}</a><svg><use href="#i-chevron"/></svg>` : `<span>${c[0]}</span>`).join('')}</nav>`,
  };
})();
