/* Renders a company handbook page from data.js — company.html?c=<slug> */
(function () {
  const { icon, esc, crumbs } = UI;
  const slug = new URLSearchParams(location.search).get('c') || 'tcs-software-developer';
  const co = COMPANIES.find((c) => c.slug === slug) || COMPANIES[0];
  const hb = HANDBOOKS[co.slug] || fallbackHandbook(co);
  document.title = `${co.name} ${co.role} Interview Preparation Kit 2026 | AccioJob`;

  // Companies without a written handbook yet get a short placeholder built from their card data
  function fallbackHandbook(c) {
    return {
      title: `${c.name} ${c.role} Interview Preparation Kit 2026`,
      tracks: '', tags: [...c.tags], meta: [],
      test: { questions: '—', minutes: '—', mix: 'Same pattern as the actual test.', difficulty: 'Matches the real test.', covers: c.tags },
      aiPoints: ['The code you wrote in the test', 'Core CS concepts', 'The projects on your resume'],
      sections: [{
        nav: 'Overview', title: `${c.name} — Handbook coming soon`,
        blocks: [
          { p: `The full round-by-round handbook for <b>${esc(c.name)} · ${esc(c.role)}</b> hasn't been added to this site yet. The TCS Software Developer handbook shows the full layout every company page will use.` },
          { chips: { title: 'Topics this handbook covers', items: [...c.tags, `+${c.more} more`] } },
          { cta: 'Want this one sooner? Request it from the Company Prep page.' },
        ],
      }],
      sources: [], faq: [],
    };
  }

  // ---- block renderers ----
  const R = {
    p: (h) => `<p class="hb-p">${h}</p>`,
    stats: (s) => `<div class="stats">${s.map(([k, v, sub]) => `<div class="stat"><small>${k}</small><b>${v}</b><span>${sub}</span></div>`).join('')}</div>`,
    chips: ({ title, items }) => `<div class="hb-label">${title}</div><div class="chips">${items.map((i) => `<span>${esc(i)}</span>`).join('')}</div>`,
    tracks: ({ title, items }) => `<div class="hb-label">${title}</div><div class="tracks">${items.map(([n, pay, lvl, d]) =>
      `<div class="track"><h4>${n}</h4><div class="pay">${pay}<small>LPA</small></div><div class="lvl">${lvl.toUpperCase()}</div><p>${d}</p></div>`).join('')}</div>`,
    callout: ([t, h]) => `<div class="callout">${icon('i-bulb')}<div><h4>${t}</h4><p>${h}</p></div></div>`,
    rounds: (r) => `<div class="rounds">${r.map(([n, t, d], i) => `<div class="round"><small>ROUND ${i + 1}</small><h4>${n}</h4><b>${t}</b><p>${d}</p></div>`).join('')}</div>`,
    pills: (p) => `<div class="pills">${p.map(([ic, h]) => `<span>${icon(ic)}${h}</span>`).join('')}</div>`,
    table: ({ head, groups }) => `<table class="hb-table"><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${groups.map(([g, rows]) =>
      `<tr class="grp"><td colspan="${head.length}">${g}</td></tr>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}`).join('')}</tbody></table>`,
    topics: (t) => `<div class="topics${t.length === 1 ? ' one' : ''}">${t.map(([n, m, items]) =>
      `<div class="topic"><div class="topic-h"><h4>${n}</h4><small>${m}</small></div><ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('')}</div>`,
    tip: (h) => `<div class="tip">${icon('i-bulb')}<div><b>Pro tips</b>&nbsp; ${h}</div></div>`,
    cta: (h) => `<div class="cta-band"><span>${h}</span><a href="#practice">Practice now →</a></div>`,
    star: (s) => `<div class="hb-label">The STAR framework</div><div class="star">${s.map(([l, n, d]) => `<div><b>${l}</b><h4>${n}</h4><p>${esc(d)}</p></div>`).join('')}</div>`,
    docs: (d) => `<div class="hb-label">Document checklist — what to carry</div><div class="docs">${d.map(([n, s]) => `<div>${icon('i-check')}<h5>${n}</h5><p>${s}</p></div>`).join('')}</div>`,
  };
  const block = (b) => {
    const [type] = Object.keys(b);
    return `<div class="hb-block">${R[type](b[type])}</div>`;
  };

  const t = hb.test;
  // Company interview: the interviewer plays this company's technical round on its tested topics.
  const aiHref = UI.interviewUrl({
    mode: 'role',
    role: `${co.name} ${co.role}`,
    topics: [...new Set([...hb.tags, ...t.covers])],
    title: `${co.name} ${co.role} — AI Interview`,
    back: `company.html?c=${co.slug}`,
  });
  const side = `
    <aside class="hb-side" id="practice">
      <div class="side-card">
        <h4>Practice Tests</h4>
        <div class="sub">${esc(co.name)} · ${esc(co.role)}</div>
        <div class="side-stats"><div><b>${t.questions}</b><span>QUESTIONS</span></div><div><b>${t.minutes}<small>min</small></b><span>DURATION</span></div></div>
        <p class="small"><b>Mix:</b> ${t.mix}</p>
        <div class="diff-bar"><i style="flex:50;background:#22c55e"></i><i style="flex:35;background:#f59e0b"></i><i style="flex:15;background:#ef4444"></i></div>
        <p class="small"><b>Difficulty:</b> ${t.difficulty}</p>
        <div class="hb-label" style="margin:10px 0 0">Covers</div>
        <div class="tags">${t.covers.map((c) => `<span class="tag">${esc(c)}</span>`).join('')}</div>
        <a href="#" class="btn-navy-lg">✓ Start Practice Tests →</a>
      </div>
      <div class="side-card side-card--navy">
        <h4>Practice Tests + AI Interview</h4>
        <div class="sub">${esc(co.name)} · ${esc(co.role)}</div>
        <p class="small">Take the test, then our AI interviewer cross-examines you on:</p>
        <ul>${hb.aiPoints.map((p) => `<li>${p}</li>`).join('')}</ul>
        <a href="${aiHref}" class="btn-navy-lg">✓ Start Practice Tests + AI Interview →</a>
      </div>
    </aside>`;

  const sections = hb.sections.map((s, i) => `
    <section class="hb-sec" id="s${i + 1}">
      <h2><span class="hb-num">${String(i + 1).padStart(2, '0')}</span>${s.title}</h2>
      ${s.blocks.map(block).join('')}
    </section>`).join('');

  const others = (list, title) => list.length ? `<h3 class="sub-h">${title}</h3><div class="grid-3" style="margin-bottom:36px">${list.map((c) => `
      <a class="co-card" href="company.html?c=${c.slug}">
        <div class="co-top"><div class="co-logo"><img src="${c.logo}" alt="${esc(c.name)} logo" loading="lazy" /></div>
        <div><div class="co-name">${esc(c.name)}</div><div class="co-role">${esc(c.role)}</div></div></div>
        <div class="tags">${c.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}<span class="tag">+${c.more}</span></div>
        <span class="arrow-btn">${icon('i-arrow')}</span></a>`).join('')}</div>` : '';
  const sameGroup = COMPANIES.filter((c) => c.group === co.group && c.slug !== co.slug).slice(0, 3);
  const alsoPrep = COMPANIES.filter((c) => c.group !== co.group).filter((_, i) => i % 3 === 0).slice(0, 3);

  const tail = `
    ${hb.sources.length ? `<div class="sources"><div class="hb-label">Researched &amp; compiled from real candidate experiences</div><div class="chips">${hb.sources.map((s) => `<span>${s}</span>`).join('')}</div></div>
    <p class="disclaimer">This page contains AI-assisted content compiled from public sources, which may occasionally be inaccurate or outdated. Always verify role-specific details with official ${esc(co.name)} communications.</p>` : ''}
    ${hb.faq.length ? `<h3 class="sub-h">Frequently Asked Questions — ${esc(co.name)} Interview</h3>
    <div class="acc" style="margin-bottom:36px">${hb.faq.map(([q, a]) => `<div class="acc-item"><button class="acc-head">${q}${icon('i-plus')}</button><div class="acc-body">${a}</div></div>`).join('')}</div>` : ''}
    ${others(sameGroup, `Other companies in ${co.group}`)}
    ${others(alsoPrep, 'Other companies students like you also prep for')}`;

  document.getElementById('page').innerHTML = `
    ${crumbs([['Job Preparation', 'index.html'], ['Company Prep', 'interview-kit.html'], ['Interview Kit']])}
    <header class="hb-head">
      <div>
        <div class="hb-title">
          <div class="hb-logo"><img src="${co.logo}" alt="${esc(co.name)} logo" /></div>
          <div>
            <h1>${esc(hb.title)}</h1>
            <div class="hb-role">${esc(co.role)}${hb.tracks ? ` &nbsp;<b>${hb.tracks}</b>` : ''}</div>
            <div class="tags">${hb.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
          </div>
        </div>
      </div>
      <div class="hb-ctas">
        <a href="#practice" class="btn-ghost-lg">✓ Start Practice Tests →</a>
        <a href="${aiHref}" class="btn-navy-lg">✓ Start Practice Tests + AI Interview →</a>
      </div>
    </header>
    ${hb.meta.length ? `<div class="hb-meta">${hb.meta.map(([ic, txt]) => `<span>${icon(ic)}${txt}</span>`).join('')}</div>` : '<div style="height:18px"></div>'}
    <nav class="hb-tabs" id="tabs">${hb.sections.map((s, i) => `<a href="#s${i + 1}"${i === 0 ? ' class="on"' : ''}>${s.nav}</a>`).join('')}</nav>
    <div class="hb-body">
      <div>${sections}${tail}</div>
      ${side}
    </div>`;

  // Scroll-spy for the section tabs
  const tabs = [...document.querySelectorAll('#tabs a')];
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      tabs.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id));
      const on = tabs.find((a) => a.classList.contains('on'));
      const bar = document.getElementById('tabs');
      if (on) bar.scrollTo({ left: on.offsetLeft - bar.clientWidth / 2 + on.clientWidth / 2, behavior: 'smooth' });
    });
  }, { rootMargin: '-130px 0px -65% 0px' });
  document.querySelectorAll('.hb-sec').forEach((s) => obs.observe(s));
})();
