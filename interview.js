/* Live AI interview — interview.html?mode=resume|role|skill&role=&track=&topics=a|b&title=&back=
   Talks to the backend through PrepAPI (api.js). */
(function () {
  const { icon, esc, crumbs } = UI;
  const q = new URLSearchParams(location.search);
  const mode = ['resume', 'role', 'skill'].includes(q.get('mode')) ? q.get('mode') : 'resume';
  const ctx = {
    mode,
    role: q.get('role') || undefined,
    track: q.get('track') || undefined,
    topics: (q.get('topics') || '').split('|').map((t) => t.trim()).filter(Boolean),
  };
  const title = q.get('title') || (mode === 'resume' ? 'Resume Interview' : `${ctx.role || 'Skill'} — AI Interview`);
  const back = q.get('back') || (mode === 'resume' ? 'resume-interview.html' : 'index.html');
  document.title = `${title} | AccioJob`;

  const state = { session: null, voice: true, busy: false, recorder: null, chunks: [], recStart: 0, timer: null, done: false, audio: null };
  const page = document.getElementById('page');
  // The floating WhatsApp button would sit on top of the answer controls; hide it while interviewing.
  document.body.classList.add('iv-page');

  // ---------- setup screen ----------
  function renderSetup(serverError) {
    page.innerHTML = `
      ${crumbs([['Job Preparation', 'index.html'], [mode === 'resume' ? 'Resume Interview' : 'Back', back], ['AI Interview']])}
      <span class="chip-sm chip-green">${icon('i-mic')}Live AI interview</span>
      <h1 class="page-title page-title--sm">${esc(title)}</h1>
      ${ctx.topics.length ? `<div class="dr-chips" style="margin:14px 0 0">${ctx.topics.map((t) => `<span style="background:var(--blue-soft);color:var(--blue)">${esc(t)}</span>`).join('')}</div>` : ''}
      <div id="serverBanner"></div>
      <section class="section-card iv-setup">
        ${mode === 'resume' ? `
          <h2>Paste your resume</h2>
          <p>The interviewer reads it first and asks about your introduction, projects, internship and skills.</p>
          <textarea id="resume" class="iv-textarea" placeholder="Paste the text of your resume here…"></textarea>
          <label class="iv-file">${icon('i-upload')}<span>or load a .txt file</span><input type="file" id="resumeFile" accept=".txt,text/plain" hidden /></label>
        ` : `
          <h2>How it works</h2>
          <p>The AI interviewer asks you questions one at a time and follows up until it finds the edge of what you know. Answer out loud with your mic, or type if you prefer. You get a full report at the end.</p>
        `}
        <label class="iv-toggle"><input type="checkbox" id="voice" checked /> Read questions out loud</label>
        <div class="iv-row">
          <button class="btn btn-primary" id="startBtn">Start interview ${icon('i-arrow')}</button>
          <span class="start-note" style="margin:0">${icon('i-camera')}Mic recommended · ~15 minutes</span>
        </div>
        <p class="iv-error" id="setupError" hidden></p>
      </section>`;

    if (serverError) showServerBanner(serverError);
    document.getElementById('startBtn').addEventListener('click', start);
    document.getElementById('resumeFile')?.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) document.getElementById('resume').value = await file.text();
    });
  }

  function showServerBanner(err) {
    const el = document.getElementById('serverBanner');
    if (!el) return;
    el.innerHTML = `<div class="callout" style="margin-top:18px">${icon('i-bulb')}<div><h4>Interview server not reachable</h4>
      <p>${esc(err.message)} Start it in a terminal with <code>cd backend</code> then <code>npm start</code>, and add your API keys as environment variables (see backend/README.md).</p></div></div>`;
  }

  function setupError(msg) {
    const el = document.getElementById('setupError');
    el.textContent = msg;
    el.hidden = false;
  }

  async function start() {
    const btn = document.getElementById('startBtn');
    const resumeText = document.getElementById('resume')?.value.trim();
    if (mode === 'resume' && resumeText.length < 50) return setupError('Paste your resume first (at least a few lines).');
    state.voice = document.getElementById('voice').checked;
    btn.disabled = true;
    btn.innerHTML = 'Preparing your interview…';
    try {
      const res = await PrepAPI.startSession({ ...ctx, resumeText: mode === 'resume' ? resumeText : undefined, voice: state.voice });
      state.session = res.session;
      renderLive();
      addBubble('interviewer', res.question);
      play(res.audio);
      updateProgress(res.session);
      if (res.degraded) notice('Voice is unavailable right now, so questions are shown as text only.');
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = `Start interview ${icon('i-arrow')}`;
      if (err.offline) showServerBanner(err);
      setupError(err.message);
    }
  }

  // ---------- live screen ----------
  function renderLive() {
    page.innerHTML = `
      ${crumbs([['Job Preparation', 'index.html'], ['AI Interview']])}
      <div class="iv-head">
        <div><h1 class="page-title page-title--sm">${esc(title)}</h1><div class="iv-progress-label" id="progLabel"></div></div>
        <button class="btn btn-outline" id="endBtn">End &amp; get report</button>
      </div>
      <div class="iv-progress"><i id="progBar"></i></div>
      <div class="iv-log" id="log" aria-live="polite"></div>
      <div class="iv-notice" id="notice" hidden></div>
      <div class="iv-controls" id="controls">
        <button class="iv-mic" id="micBtn" aria-label="Record answer">${icon('i-mic')}</button>
        <div class="iv-mic-label" id="micLabel">Tap to answer out loud</div>
        <form class="iv-type" id="typeForm">
          <input id="typeInput" placeholder="…or type your answer" autocomplete="off" />
          <button class="btn btn-primary" type="submit">Send</button>
        </form>
      </div>`;
    document.getElementById('micBtn').addEventListener('click', toggleRecording);
    document.getElementById('typeForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('typeInput');
      if (input.value.trim()) submit({ text: input.value.trim() });
      input.value = '';
    });
    document.getElementById('endBtn').addEventListener('click', finish);
  }

  function addBubble(role, text, extra = '') {
    const log = document.getElementById('log');
    const el = document.createElement('div');
    el.className = `iv-msg iv-msg--${role}`;
    el.innerHTML = `<div class="iv-who">${role === 'interviewer' ? 'Interviewer' : 'You'}</div><div class="iv-bubble">${esc(text)}${extra}</div>`;
    log.appendChild(el);
    el.scrollIntoView({ behavior: 'smooth', block: 'end' });
    return el;
  }

  function thinking() {
    return addBubble('interviewer', '', '<span class="iv-dots"><i></i><i></i><i></i></span>');
  }

  function notice(msg) {
    const el = document.getElementById('notice');
    if (!el) return;
    el.textContent = msg;
    el.hidden = !msg;
  }

  function updateProgress(s) {
    const n = Math.min(s.questionsAsked, s.maxQuestions);
    document.getElementById('progLabel').textContent = state.done ? 'Interview complete' : `Question ${n} of ${s.maxQuestions}`;
    document.getElementById('progBar').style.width = `${(n / s.maxQuestions) * 100}%`;
  }

  function setBusy(busy) {
    state.busy = busy;
    document.querySelectorAll('#controls button, #controls input').forEach((el) => { el.disabled = busy || state.done; });
  }

  function play(audio) {
    if (!audio || !state.voice) return;
    state.audio?.pause();
    state.audio = new Audio(`data:${audio.mimeType};base64,${audio.base64}`);
    state.audio.play().catch(() => { /* autoplay blocked: the question is on screen anyway */ });
  }

  async function submit({ text, blob }) {
    if (state.busy || state.done) return;
    setBusy(true);
    notice('');
    state.audio?.pause();
    const mine = addBubble('candidate', text || 'Transcribing your answer…');
    const wait = thinking();
    try {
      const res = blob ? await PrepAPI.sendAudio(state.session.id, blob) : await PrepAPI.sendText(state.session.id, text);
      mine.querySelector('.iv-bubble').textContent = res.transcript;
      wait.remove();
      state.session = res.session;
      if (res.done) {
        state.done = true;
        addBubble('interviewer', 'That was the last question. Generating your report…');
        updateProgress(res.session);
        play(res.audio);
        return finish();
      }
      addBubble('interviewer', res.question);
      play(res.audio);
      updateProgress(res.session);
      if (res.degraded) notice('Voice is unavailable right now, so questions are shown as text only.');
    } catch (err) {
      wait.remove();
      if (blob) mine.remove();
      notice(err.message + (blob ? ' You can record again or type your answer.' : ''));
    } finally {
      setBusy(false);
    }
  }

  // ---------- microphone ----------
  async function toggleRecording() {
    if (state.recorder?.state === 'recording') return state.recorder.stop();
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      return notice('Microphone access was blocked. Allow it in your browser, or type your answer below.');
    }
    const type = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find((t) => window.MediaRecorder?.isTypeSupported?.(t)) || '';
    state.chunks = [];
    state.recorder = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
    state.recorder.ondataavailable = (e) => e.data.size && state.chunks.push(e.data);
    state.recorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      clearInterval(state.timer);
      setMic(false);
      const blob = new Blob(state.chunks, { type: state.recorder.mimeType || 'audio/webm' });
      if (Date.now() - state.recStart < 1000) return notice('That recording was too short. Hold on to your thought and try again.');
      submit({ blob });
    };
    state.audio?.pause();
    state.recorder.start();
    state.recStart = Date.now();
    setMic(true);
    state.timer = setInterval(() => setMic(true), 500);
  }

  function setMic(on) {
    const btn = document.getElementById('micBtn');
    const label = document.getElementById('micLabel');
    btn.classList.toggle('rec', on);
    const secs = Math.floor((Date.now() - state.recStart) / 1000);
    label.textContent = on ? `Recording ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')} — tap to send` : 'Tap to answer out loud';
  }

  // ---------- report ----------
  async function finish() {
    if (!state.session) return;
    if (state.recorder?.state === 'recording') return notice('Finish your recording first.');
    setBusy(true);
    const endBtn = document.getElementById('endBtn');
    endBtn.disabled = true;
    endBtn.textContent = 'Generating report…';
    try {
      await PrepAPI.report(state.session.id);
      location.href = `sample-report.html?session=${encodeURIComponent(state.session.id)}`;
    } catch (err) {
      notice(err.code === 'invalid_request' ? 'Answer at least one question before ending the interview.' : err.message);
      endBtn.disabled = false;
      endBtn.textContent = 'End & get report';
      setBusy(false);
    }
  }

  // Check the server up front so a missing backend is explained before the candidate types anything.
  renderSetup();
  PrepAPI.health().catch(showServerBanner);
})();
