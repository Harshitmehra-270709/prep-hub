/* Role readiness detail page — role.html?r=<slug>&track=<Track> */
(function () {
  const { icon, esc, crumbs, startTest } = UI;
  const params = new URLSearchParams(location.search);
  const role = ROLES.find((r) => r.slug === params.get('r')) || ROLES[0];
  const tracksData = ROLE_TESTS[role.slug];
  const trackNames = Object.keys(tracksData).filter((t) => t !== 'default');
  let track = trackNames.includes(params.get('track')) ? params.get('track') : (trackNames[0] || 'default');
  let tab = params.get('tab') === 'assessments' ? 'assessments' : 'details';
  document.title = `${role.name} — Role Readiness Check | AccioJob`;

  const tests = () => tracksData[track];
  const parts = (structure) => structure.split(' · ');

  const testCard = ([name, mins, structure, skills], i) => `
    <div class="rt-card">
      <div class="rt-top">
        <span class="rt-icon" style="background:${role.bg};color:${role.tile}">${icon(testIcon(name))}</span>
        <div><h4>${esc(name)}</h4><span class="rt-time">${icon('i-clock')}${mins} mins</span></div>
      </div>
      <div class="rt-struct"><small>TEST STRUCTURE</small><b>${esc(structure)}</b></div>
      <div class="hb-label" style="margin:14px 0 8px">Skills tested</div>
      <div class="rt-skills" data-i="${i}">
        ${skills.slice(0, 2).map((s) => `<span style="background:${role.bg};color:${role.tile}">${esc(s)}</span>`).join('')}
        ${skills.length > 2 ? `<button class="rt-more" data-i="${i}">+${skills.length - 2} more</button>` : ''}
      </div>
    </div>`;

  const assessmentRows = () => {
    const prefix = `${role.name}${track !== 'default' ? ' - ' + track : ''} - `;
    const rows = [];
    tests().forEach((t, i) => rows.push({ i, ai: false, label: prefix + t[0], mins: t[1] }));
    tests().forEach((t, i) => rows.push({ i, ai: true, label: prefix + t[0] + ' + AI Interview', mins: t[1] }));
    return rows.map((r) => `
      <div class="as-row">
        <div><div class="as-title">${esc(r.label)}</div><div class="as-time">${icon('i-clock')}Estimated time: <b>${r.mins} mins</b></div></div>
        ${r.ai ? '<span class="as-ai">AI</span>' : ''}
        <button class="as-btn" data-start="${r.i}" data-ai="${r.ai}">Start Test</button>
      </div>`).join('');
  };

  const sideCard = () => `
    <aside class="rt-side">
      <div class="pkg-box">
        <div class="pkg-box-h">${icon('i-check')}Included in the Job Preparation Package</div>
        <button class="pkg-row" data-goto="assessments">Practice Tests<span>Start ${icon('i-arrow')}</span></button>
        <a class="pkg-row" href="${UI.interviewUrl({ mode: 'role', role: role.name, track, topics: [...new Set(tests().flatMap((t) => t[3]))], title: `${role.name}${track !== 'default' ? ' (' + track + ')' : ''} — Full AI Interview` })}">Full role AI interview<span>Start ${icon('i-arrow')}</span></a>
        <a class="pkg-link" href="index.html#package">Get all roles for ₹1299 · 75% OFF →</a>
      </div>
      <div class="rt-total">
        <div><b>${tests().length}</b><span>tests</span></div>
        <div><b>${tests().reduce((m, t) => m + t[1], 0)}</b><span>total mins</span></div>
        <div><b>${new Set(tests().flatMap((t) => t[3])).size}</b><span>skills checked</span></div>
      </div>
    </aside>`;

  function render() {
    const trackToggle = trackNames.length ? `
      <div class="track-row"><span class="hb-label" style="margin:0">Track</span>
        <div class="seg">${trackNames.map((t) => `<button class="${t === track ? 'on' : ''}" data-track="${t}">${t}</button>`).join('')}</div>
      </div>` : '';

    const details = `
      <div class="rt-body">
        <div>
          <div class="hb-label">What's covered</div>
          <p class="rt-lead">Here's everything ${role.name} hiring tests you on. You'll be assessed across all of it.</p>
          <div class="rt-grid">${tests().map(testCard).join('')}</div>
          <div class="voice-card">
            <div class="voice-h"><span class="icon-tile icon-tile--glass" style="background:rgba(124,58,237,.25)">${icon('i-mic')}</span>VOICE AI INTERVIEW</div>
            <p>The tests check whether you know each skill. The voice AI interview checks whether you can defend it — it cross-questions you on your answers like a real ${role.name} interviewer, probing how deeply you actually understand what you built and chose. That's the difference between looking ready on paper and holding up in the room.</p>
          </div>
          <div class="report-card">
            <div class="voice-h" style="color:var(--muted-2)"><span class="icon-tile tint-blue">${icon('i-file')}</span>WHAT YOUR REPORT SHOWS</div>
            <p>With the AI interview, the report also evaluates how well you defend your answers during follow-up questions—not just whether you got them right.</p>
            <a href="sample-report.html" class="hl" style="font-weight:700;font-size:13.5px">View a sample report ↗</a>
          </div>
        </div>
        ${sideCard()}
      </div>`;

    document.getElementById('page').innerHTML = `
      ${crumbs([['Job Preparation', 'index.html'], ['Role Readiness Check', 'role-readiness.html'], [role.name]])}
      <span class="chip-sm">${icon('i-target')}Role readiness check</span>
      <div class="rt-title"><span class="icon-tile" style="background:${role.tile}">${icon(role.icon)}</span><h1 class="page-title page-title--sm">${role.name}</h1></div>
      <p class="lead" style="max-width:640px">A role isn't one skill. This checks you across the ${tests().length} skills ${role.name} hiring actually tests — then shows you exactly where you stand.</p>
      ${trackToggle}
      <div class="tabs2"><button class="${tab === 'details' ? 'on' : ''}" data-tab="details">Test Details</button><button class="${tab === 'assessments' ? 'on' : ''}" data-tab="assessments">Assessments</button></div>
      ${tab === 'details' ? details : `<div class="as-list">${assessmentRows()}</div>`}`;
  }

  function syncUrl() {
    const q = new URLSearchParams({ r: role.slug });
    if (track !== 'default') q.set('track', track);
    if (tab === 'assessments') q.set('tab', 'assessments');
    history.replaceState(null, '', '?' + q);
  }

  document.getElementById('page').addEventListener('click', (e) => {
    const t = e.target.closest('[data-track]');
    if (t) { track = t.dataset.track; syncUrl(); render(); return; }
    const tb = e.target.closest('[data-tab]');
    if (tb) { tab = tb.dataset.tab; syncUrl(); render(); return; }
    const go = e.target.closest('[data-goto]');
    if (go) {
      tab = 'assessments'; syncUrl(); render();
      if (go.dataset.goto === 'assessments-ai') document.querySelectorAll('.as-row')[tests().length]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const more = e.target.closest('.rt-more');
    if (more) {
      const [, , , skills] = tests()[+more.dataset.i];
      more.parentElement.innerHTML = skills.map((s) => `<span style="background:${role.bg};color:${role.tile}">${esc(s)}</span>`).join('');
      return;
    }
    const st = e.target.closest('[data-start]');
    if (st) {
      const [name, mins, structure, skills] = tests()[+st.dataset.start];
      const ai = st.dataset.ai === 'true';
      const label = `${role.name}${track !== 'default' ? ' - ' + track : ''} - ${name}`;
      startTest({
        title: label + (ai ? ' + AI Interview' : ''),
        minutes: mins,
        parts: parts(structure).concat(ai ? ['AI interview'] : []),
        ai,
        href: ai ? UI.interviewUrl({ mode: 'role', role: role.name, track, topics: [name, ...skills], title: `${label} — AI Interview` }) : null,
      });
    }
  });

  render();
})();
