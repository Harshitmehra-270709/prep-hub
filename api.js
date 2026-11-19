/* Client for the Prep Hub backend (backend/). Shared by interview.html and sample-report.html.
   The base URL defaults to the local dev server; set localStorage "prepApiBase" to point elsewhere. */
(function () {
  let base = 'http://localhost:8080/api';
  try { base = localStorage.getItem('prepApiBase') || base; } catch { /* storage blocked: keep default */ }

  async function request(path, options = {}) {
    let res;
    try {
      res = await fetch(base + path, options);
    } catch {
      const err = new Error(`Can't reach the interview server at ${base}.`);
      err.offline = true;
      throw err;
    }
    const isJson = (res.headers.get('content-type') || '').includes('application/json');
    const body = isJson ? await res.json() : await res.blob();
    if (!res.ok) {
      const err = new Error(body?.error?.message || `Request failed (${res.status})`);
      err.status = res.status;
      err.code = body?.error?.code;
      throw err;
    }
    return body;
  }

  const json = (method, data) => ({ method, headers: { 'Content-Type': 'application/json' }, body: data === undefined ? undefined : JSON.stringify(data) });

  window.PrepAPI = {
    base,
    health: () => request('/health'),
    startSession: (body) => request('/interview/sessions', json('POST', body)),
    getSession: (id) => request(`/interview/sessions/${encodeURIComponent(id)}`),
    sendText: (id, text) => request(`/interview/sessions/${encodeURIComponent(id)}/turns`, json('POST', { text })),
    sendAudio: (id, blob) => {
      const form = new FormData();
      const ext = (blob.type.split('/')[1] || 'webm').split(';')[0];
      form.append('audio', blob, `answer.${ext}`);
      return request(`/interview/sessions/${encodeURIComponent(id)}/turns`, { method: 'POST', body: form });
    },
    report: (id) => request(`/interview/sessions/${encodeURIComponent(id)}/report`, { method: 'POST' }),
  };
})();
