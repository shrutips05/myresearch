// Content is JSON under ../content; this file only renders it.
const BASE = '../content/';
const store = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem('psh:' + k)) ?? d; } catch { return d; } },
  set: (k, v) => localStorage.setItem('psh:' + k, JSON.stringify(v)),
};
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fetchJson = async (p) => { const r = await fetch(BASE + p); if (!r.ok) throw new Error(p); return r.json(); };

const app = document.getElementById('app');
const nav = document.getElementById('nav');
let specialties = [];
let mermaidLoaded;

async function load() {
  const manifest = await fetchJson('manifest.json');
  specialties = await Promise.all(manifest.specialties.map(async (m) => {
    const overview = await fetchJson(`${m.slug}/overview.json`);
    const study = await Promise.all(m.study.map((f) => fetchJson(`${m.slug}/study/${f}.json`)));
    const assessment = await Promise.all(m.assessment.map((f) => fetchJson(`${m.slug}/assessment/${f}.json`)));
    return { slug: m.slug, overview, study, assessment };
  }));
}

const progress = (sp) => {
  const done = store.get(`topics:${sp.slug}`, []);
  const total = sp.overview.coreTopics.length;
  const n = sp.overview.coreTopics.filter((t) => done.includes(t)).length;
  return { n, total, pct: total ? Math.round((n / total) * 100) : 0 };
};

function renderNav(active) {
  nav.innerHTML = `<a href="#/" class="${active === '' ? 'active' : ''}">Dashboard</a>` +
    specialties.map((s) => `<a href="#/${s.slug}" class="${active === s.slug ? 'active' : ''}"><span>${esc(s.overview.icon)} ${esc(s.overview.name)}</span><span class="pct">${progress(s).pct}%</span></a>`).join('');
}

function table(t) {
  return `<h3>${esc(t.title)}</h3><table><thead><tr>${t.headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${t.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
const list = (items) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;

function dashboard() {
  const totalNotes = specialties.reduce((a, s) => a + s.study.length, 0);
  const totalQs = specialties.reduce((a, s) => a + s.assessment.reduce((b, set) => b + set.questions.length, 0), 0);
  const scores = specialties.flatMap((s) => s.assessment.map((set) => store.get(`score:${s.slug}:${set.id}`, null)).filter(Boolean));
  return `<h1>Placement Study Hub</h1>
  <p class="lead">${totalNotes} study notes, ${totalQs} assessment items across ${specialties.length} specialties.</p>
  <div class="grid">${specialties.map((s) => { const p = progress(s); return `<a class="card" href="#/${s.slug}"><div class="icon">${esc(s.overview.icon)}</div><h3>${esc(s.overview.name)}</h3><p class="muted">${esc(s.overview.summary)}</p><div class="muted">${s.study.length} notes, ${p.n}/${p.total} core topics</div><div class="bar"><span style="width:${p.pct}%"></span></div></a>`; }).join('')}</div>
  <h2>Suggested routine</h2>
  <div class="callout"><ol>
    <li>Same day: write an anonymised note after each session using the tutor agent and skill.</li>
    <li>Within 48 hours: take the self-test and mark the core topic as covered.</li>
    <li>Weekly: redo missed SBA questions and write one reflection.</li>
    <li>Before each placement ends: tick off core topics and list 3 gaps to study next.</li>
  </ol></div>
  ${scores.length ? `<p class="muted">${scores.length} SBA set(s) attempted.</p>` : ''}`;
}

function overviewTab(sp) {
  const o = sp.overview;
  const done = store.get(`topics:${sp.slug}`, []);
  const p = progress(sp);
  return `<p class="lead">${esc(o.summary)}</p>
  <h2>Placement focus</h2>${list(o.placementFocus)}
  <h2>Core topics checklist (${p.n}/${p.total})</h2>
  <div class="bar"><span style="width:${p.pct}%"></span></div>
  <ul class="check">${o.coreTopics.map((t, i) => `<li><label><input type="checkbox" data-topic="${esc(t)}" id="t${i}" ${done.includes(t) ? 'checked' : ''}> ${esc(t)}</label></li>`).join('')}</ul>
  <h2>Recommendations</h2><div class="callout ok">${list(o.recommendations)}</div>
  <h2>Resources</h2><ul>${o.resources.map((r) => `<li><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.name)}</a></li>`).join('')}</ul>
  <h2>My notes</h2><textarea id="notes" rows="5" style="width:100%" placeholder="Personal goals, gaps, feedback (saved in this browser only; no patient information)">${esc(store.get(`notes:${sp.slug}`, ''))}</textarea>`;
}

function studyTab(sp) {
  if (!sp.study.length) return '<p class="empty">No study notes yet. Ask the tutor agent to add one, or use the add-medical-content skill.</p>';
  return sp.study.map((n) => `<a class="card" style="display:block;margin-bottom:10px" href="#/${sp.slug}/study/${n.id}"><h3>${esc(n.title)}</h3><div>${n.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div><p class="muted">${esc(n.setting)} - ${esc(n.date)}</p></a>`).join('');
}

function studyNote(sp, n) {
  return `<p><a href="#/${sp.slug}/study">Back to notes</a> <button class="secondary" onclick="window.print()">Print</button></p>
  <h1>${esc(n.title)}</h1><div>${n.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
  <p class="muted">${esc(n.setting)} - ${esc(n.date)}</p>
  <h2>Presentation</h2><p>${esc(n.presentation)}</p>
  <h2>${esc(n.framework.title)}</h2><div class="cols">${n.framework.groups.map((g) => `<div class="card"><h3>${esc(g.name)}</h3>${list(g.items)}</div>`).join('')}</div>
  ${n.pathway ? `<h2>${esc(n.pathway.title)}</h2><pre class="mermaid">${esc(n.pathway.mermaid)}</pre>` : ''}
  ${(n.tables || []).map(table).join('')}
  <h2>Investigations</h2><table><thead><tr><th>Test</th><th>Why</th></tr></thead><tbody>${n.investigations.map((i) => `<tr><td>${esc(i.test)}</td><td>${esc(i.why)}</td></tr>`).join('')}</tbody></table>
  <h2>Management</h2>${list(n.management)}
  <h2>Red flags</h2><div class="callout warn">${list(n.redFlags)}</div>
  <h2>Pearls from teaching</h2><div class="callout">${list(n.pearls)}</div>
  <h2>To look up</h2>${list(n.lookUp)}
  <h2>Self-test</h2>${n.selfTest.map((q, i) => `<div class="card" style="margin-bottom:8px"><strong>${i + 1}. ${esc(q.q)}</strong><div><button class="secondary reveal" style="margin-top:6px">Show answer</button></div><div class="answer">${esc(q.a)}</div></div>`).join('')}
  <h2>Sources</h2>${list(n.sources)}`;
}

function assessmentTab(sp) {
  if (!sp.assessment.length) return '<p class="empty">No assessment sets yet.</p>';
  return sp.assessment.map((s) => { const sc = store.get(`score:${sp.slug}:${s.id}`, null); return `<a class="card" style="display:block;margin-bottom:10px" href="#/${sp.slug}/assessment/${s.id}"><h3>${esc(s.title)} <span class="tag">${esc(s.type)}</span></h3><p class="muted">${esc(s.description)} ${s.questions.length} item(s).${sc ? ` Last score: ${sc.score}/${sc.total}.` : ''}</p></a>`; }).join('');
}

function assessmentSet(sp, s) {
  const isSba = s.type === 'SBA';
  return `<p><a href="#/${sp.slug}/assessment">Back to assessments</a></p><h1>${esc(s.title)}</h1><p class="lead">${esc(s.description)}</p>
  ${s.questions.map((q, i) => `<div class="card" style="margin-bottom:10px" data-i="${i}"><strong>${i + 1}. ${esc(q.q)}</strong>
    ${isSba ? q.options.map((o, j) => `<button class="opt" data-j="${j}">${String.fromCharCode(65 + j)}. ${esc(o)}</button>`).join('') + `<div class="answer callout">${esc(q.explanation)}</div>`
      : `<div><button class="secondary reveal" style="margin-top:6px">Show model answer</button></div><div class="answer callout">${esc(q.answer)}</div>`}
  </div>`).join('')}
  ${isSba ? '<p id="score" class="callout">Answer all questions to see your score.</p>' : '<p class="muted">Write your own answer first, then compare.</p>'}`;
}

function search(term) {
  const t = term.toLowerCase();
  const hits = [];
  specialties.forEach((sp) => {
    sp.study.forEach((n) => { if (JSON.stringify(n).toLowerCase().includes(t)) hits.push(`<a class="card" style="display:block;margin-bottom:8px" href="#/${sp.slug}/study/${n.id}">${esc(sp.overview.name)}: ${esc(n.title)}</a>`); });
    sp.assessment.forEach((s) => { if (JSON.stringify(s).toLowerCase().includes(t)) hits.push(`<a class="card" style="display:block;margin-bottom:8px" href="#/${sp.slug}/assessment/${s.id}">${esc(sp.overview.name)}: ${esc(s.title)}</a>`); });
  });
  return `<h1>Search: ${esc(term)}</h1>${hits.join('') || '<p class="empty">No matches.</p>'}`;
}

async function drawMermaid() {
  const nodes = app.querySelectorAll('.mermaid');
  if (!nodes.length) return;
  try {
    mermaidLoaded ??= import('https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs').then((m) => { m.default.initialize({ startOnLoad: false }); return m.default; });
    await (await mermaidLoaded).run({ nodes });
  } catch { nodes.forEach((n) => n.insertAdjacentHTML('afterend', '<p class="muted">Diagram needs internet access to load.</p>')); }
}

function bind(sp, view) {
  app.querySelectorAll('input[data-topic]').forEach((cb) => cb.addEventListener('change', () => {
    const done = new Set(store.get(`topics:${sp.slug}`, []));
    cb.checked ? done.add(cb.dataset.topic) : done.delete(cb.dataset.topic);
    store.set(`topics:${sp.slug}`, [...done]);
    route();
  }));
  const notes = app.querySelector('#notes');
  notes?.addEventListener('input', () => store.set(`notes:${sp.slug}`, notes.value));
  app.querySelectorAll('.reveal').forEach((b) => b.addEventListener('click', () => {
    const a = b.closest('.card').querySelector('.answer');
    a.classList.toggle('show');
    b.textContent = a.classList.contains('show') ? 'Hide answer' : 'Show answer';
  }));
  if (view?.type === 'SBA') {
    let answered = 0; let correct = 0;
    app.querySelectorAll('.card[data-i]').forEach((card) => {
      const q = view.questions[card.dataset.i];
      card.querySelectorAll('.opt').forEach((btn) => btn.addEventListener('click', () => {
        if (card.dataset.done) return;
        card.dataset.done = '1'; answered++;
        const j = Number(btn.dataset.j);
        if (j === q.answer) correct++;
        btn.classList.add(j === q.answer ? 'right' : 'wrong');
        card.querySelectorAll('.opt')[q.answer].classList.add('right');
        card.querySelector('.answer').classList.add('show');
        if (answered === view.questions.length) {
          store.set(`score:${sp.slug}:${view.id}`, { score: correct, total: answered });
          app.querySelector('#score').textContent = `Score: ${correct}/${answered}`;
          renderNav(sp.slug);
        }
      }));
    });
  }
}

async function route() {
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const [slug, tab = 'overview', id] = parts;
  renderNav(slug || '');
  if (!slug) { app.innerHTML = dashboard(); return; }
  const sp = specialties.find((s) => s.slug === slug);
  if (!sp) { app.innerHTML = '<p class="empty">Page not found.</p>'; return; }
  let view;
  let body;
  if (tab === 'study' && id) { const n = sp.study.find((x) => x.id === id); body = n ? studyNote(sp, n) : '<p class="empty">Note not found.</p>'; }
  else if (tab === 'assessment' && id) { view = sp.assessment.find((x) => x.id === id); body = view ? assessmentSet(sp, view) : '<p class="empty">Set not found.</p>'; }
  else {
    const tabs = [['overview', 'Overview'], ['study', 'Study'], ['assessment', 'Assessment']];
    const content = tab === 'study' ? studyTab(sp) : tab === 'assessment' ? assessmentTab(sp) : overviewTab(sp);
    body = `<h1>${esc(sp.overview.icon)} ${esc(sp.overview.name)}</h1><div class="tabs">${tabs.map(([k, l]) => `<a href="#/${sp.slug}/${k}" class="${tab === k ? 'active' : ''}">${l}</a>`).join('')}</div>${content}`;
  }
  app.innerHTML = body;
  bind(sp, view);
  drawMermaid();
  app.focus();
}

document.getElementById('search').addEventListener('input', (e) => {
  const v = e.target.value.trim();
  if (v.length < 2) { route(); return; }
  app.innerHTML = search(v);
});

window.addEventListener('hashchange', route);
load().then(route).catch(() => { app.innerHTML = '<p class="empty">Could not load content. Serve the project root with a local web server (python3 -m http.server) and open /site/.</p>'; });
