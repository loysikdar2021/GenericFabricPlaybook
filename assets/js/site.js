/* ==========================================================================
   Fabric Implementation Playbooks — site behaviour (no dependencies)
   Builds header / sidebar / TOC / pager / footer from window.SITE_DATA,
   plus theme toggle, search, code highlighting, copy buttons, tabs, checklists.
   Page contract: <body data-root="../../" data-playbook="<id>" data-page="<file>">
   ========================================================================== */
(function () {
  'use strict';

  var D = window.SITE_DATA || { title: 'Fabric Implementation Playbooks', categories: [], playbooks: [] };
  var body = document.body;
  var ROOT = body.getAttribute('data-root') || '';
  var PB_ID = body.getAttribute('data-playbook') || '';
  var PAGE = body.getAttribute('data-page') || (location.pathname.split('/').pop() || 'index.html');
  var SECTION = body.getAttribute('data-section') || ''; // home | catalog | paths | architecture | glossary | styleguide

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (attrs[k] !== null && attrs[k] !== undefined) e.setAttribute(k, attrs[k]); }
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function slug(s) { return String(s).toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64) || 'section'; }
  function pbUrl(pb, file) { return ROOT + 'playbooks/' + pb.id + '/' + (file || 'index.html'); }
  function storeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function storeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }

  var CUR = null, CUR_IDX = -1;
  D.playbooks.forEach(function (p, i) { if (p.id === PB_ID) { CUR = p; CUR_IDX = i; } });

  /* ---------- Theme ---------- */
  function applyTheme(t) { document.documentElement.setAttribute('data-theme', t); }
  function currentTheme() { return document.documentElement.getAttribute('data-theme') || 'light'; }

  /* ---------- Header ---------- */
  var MARK = '<svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true"><rect x="2" y="3" width="28" height="7" rx="3" fill="#b5651d"/><rect x="2" y="12.5" width="28" height="7" rx="3" fill="#8fa1b5"/><rect x="2" y="22" width="28" height="7" rx="3" fill="#d9aa1e"/></svg>';
  var ICON_SEARCH = '<svg class="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="9" r="6"/><path d="m14 14 4 4"/></svg>';
  var ICON_SUN = '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var ICON_MOON = '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  var ICON_MENU = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';

  function buildHeader() {
    var h = document.getElementById('site-header');
    if (!h) return;
    var nav = [
      ['Home', 'index.html', 'home'],
      ['Playbooks', 'playbooks/index.html', 'catalog'],
      ['Learning paths', 'paths.html', 'paths'],
      ['Reference architecture', 'reference-architecture.html', 'architecture'],
      ['Glossary', 'glossary.html', 'glossary']
    ];
    var links = nav.map(function (n) {
      var cur = (SECTION === n[2]) || (n[2] === 'catalog' && PB_ID) ? ' aria-current="page"' : '';
      return '<a href="' + ROOT + n[1] + '"' + cur + '>' + n[0] + '</a>';
    }).join('');
    h.innerHTML =
      '<button class="icon-btn menu-btn" id="menu-btn" aria-label="Toggle navigation" aria-expanded="false">' + ICON_MENU + '</button>' +
      '<a class="brand" href="' + ROOT + 'index.html">' + MARK + '<span>' + esc(D.brandShort || 'Fabric Playbooks') + '<small>' + esc(D.brandSub || 'Implementation guides') + '</small></span></a>' +
      '<nav class="top-nav" aria-label="Primary">' + links + '</nav>' +
      '<div class="header-spacer"></div>' +
      '<div class="search" role="search">' + ICON_SEARCH +
      '<input id="search-input" type="search" placeholder="Search playbooks…" autocomplete="off" aria-label="Search playbooks" /><kbd>/</kbd>' +
      '<div class="search-results" id="search-results" role="listbox"></div></div>' +
      '<button class="icon-btn theme-btn" id="theme-btn" aria-label="Toggle light / dark theme" title="Toggle theme">' + ICON_SUN + ICON_MOON + '</button>';
    document.getElementById('theme-btn').addEventListener('click', function () {
      var t = currentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(t); storeSet('fp-theme', t);
    });
    var mb = document.getElementById('menu-btn');
    mb.addEventListener('click', function () {
      var open = body.classList.toggle('nav-open');
      mb.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (body.classList.contains('nav-open') && !e.target.closest('#sidebar') && !e.target.closest('#menu-btn')) body.classList.remove('nav-open');
    });
  }

  /* ---------- Sidebar ---------- */
  function buildSidebar() {
    var s = document.getElementById('sidebar');
    var layout = document.getElementById('layout');
    if (!s) return;
    var html = '';
    if (CUR) {
      html += '<div class="side-pb"><div class="num">PLAYBOOK ' + esc(CUR.number) + '</div><div class="name">' + esc(CUR.title) + '</div></div>';
      html += '<div class="side-title">In this playbook</div><ul class="side-list">';
      CUR.pages.forEach(function (pg, i) {
        var c = pg.file === PAGE ? ' aria-current="page"' : '';
        html += '<li><a href="' + pbUrl(CUR, pg.file) + '"' + c + '><span class="n">' + (i + 1) + '.</span>' + esc(pg.title) + '</a></li>';
      });
      html += '</ul>';
    } else {
      html += '<div class="side-title">Site</div><ul class="side-list">' +
        [['Home', 'index.html', 'home'], ['All playbooks', 'playbooks/index.html', 'catalog'], ['Learning paths', 'paths.html', 'paths'],
         ['Reference architecture', 'reference-architecture.html', 'architecture'], ['Glossary', 'glossary.html', 'glossary']]
        .map(function (n) { return '<li><a href="' + ROOT + n[1] + '"' + (SECTION === n[2] ? ' aria-current="page"' : '') + '>' + n[0] + '</a></li>'; }).join('') + '</ul>';
    }
    html += '<div class="side-title">All playbooks</div>';
    D.categories.forEach(function (cat) {
      var items = D.playbooks.filter(function (p) { return p.category === cat.id; });
      if (!items.length) return;
      var open = CUR && CUR.category === cat.id ? ' open' : '';
      html += '<details class="side-group"' + open + '><summary>' + esc(cat.title) + '</summary><ul class="side-list">';
      items.forEach(function (p) {
        var c = CUR && p.id === CUR.id ? ' aria-current="page"' : '';
        html += '<li><a href="' + pbUrl(p) + '"' + c + '><span class="n">' + esc(p.number) + '</span>' + esc(p.short || p.title) + '</a></li>';
      });
      html += '</ul></details>';
    });
    s.innerHTML = html;
    if (layout && layout.classList.contains('wide')) s.style.display = 'none';
  }

  /* ---------- Content enhancement ---------- */
  function enhanceHeadings() {
    var used = {};
    document.querySelectorAll('.content h2, .content h3, .content h4').forEach(function (h) {
      if (!h.id) {
        var base = slug(h.textContent), id = base, n = 2;
        while (used[id] || document.getElementById(id)) id = base + '-' + (n++);
        h.id = id;
      }
      used[h.id] = true;
      if (!h.querySelector('.anchor')) {
        var a = el('a', { class: 'anchor', href: '#' + h.id, 'aria-label': 'Link to this section' }, '#');
        h.appendChild(a);
      }
    });
  }

  function buildToc() {
    var t = document.getElementById('toc');
    var layout = document.getElementById('layout');
    if (!t) return;
    var hs = Array.prototype.slice.call(document.querySelectorAll('.content h2, .content h3')).filter(function (h) { return !h.closest('.takeaways') && !h.closest('.callout') && !h.closest('.card'); });
    if (hs.length < 3) { t.style.display = 'none'; if (layout) layout.classList.add('no-toc'); return; }
    var html = '<p class="toc-title">On this page</p><ul>';
    hs.forEach(function (h) {
      var txt = h.cloneNode(true); var an = txt.querySelector('.anchor'); if (an) an.remove();
      html += '<li class="' + (h.tagName === 'H3' ? 'l3' : 'l2') + '"><a href="#' + h.id + '">' + esc(txt.textContent.trim()) + '</a></li>';
    });
    t.innerHTML = html + '</ul>';
    var links = {};
    t.querySelectorAll('a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    if ('IntersectionObserver' in window) {
      var current = null;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            if (current) current.classList.remove('active');
            current = links[en.target.id]; if (current) current.classList.add('active');
          }
        });
      }, { rootMargin: '-72px 0px -70% 0px', threshold: 0 });
      hs.forEach(function (h) { io.observe(h); });
    }
  }

  function buildPager() {
    var main = document.getElementById('main');
    if (!main || !CUR) return;
    var idx = -1;
    CUR.pages.forEach(function (p, i) { if (p.file === PAGE) idx = i; });
    if (idx < 0) return;
    var prev = null, next = null;
    if (idx > 0) prev = { t: CUR.pages[idx - 1].title, u: pbUrl(CUR, CUR.pages[idx - 1].file), d: 'Previous' };
    else if (CUR_IDX > 0) { var pp = D.playbooks[CUR_IDX - 1]; prev = { t: 'Playbook ' + pp.number + ' · ' + pp.title, u: pbUrl(pp), d: 'Previous playbook' }; }
    if (idx < CUR.pages.length - 1) next = { t: CUR.pages[idx + 1].title, u: pbUrl(CUR, CUR.pages[idx + 1].file), d: 'Next' };
    else if (CUR_IDX < D.playbooks.length - 1) { var np = D.playbooks[CUR_IDX + 1]; next = { t: 'Playbook ' + np.number + ' · ' + np.title, u: pbUrl(np), d: 'Next playbook' }; }
    var h = '<nav class="pager" aria-label="Pagination">';
    h += prev ? '<a class="prev" href="' + prev.u + '"><span class="dir">← ' + prev.d + '</span><span class="ttl">' + esc(prev.t) + '</span></a>' : '<span></span>';
    h += next ? '<a class="next" href="' + next.u + '"><span class="dir">' + next.d + ' →</span><span class="ttl">' + esc(next.t) + '</span></a>' : '';
    main.appendChild(el('div', null, h + '</nav>'));
  }

  function buildFooter() {
    var f = document.getElementById('site-footer');
    if (!f) return;
    var edit = '';
    if (D.repo && CUR) edit = ' · <a href="' + esc(D.repo) + '/edit/main/playbooks/' + CUR.id + '/' + PAGE + '">Edit this page</a>';
    f.innerHTML = '<div class="inner"><p><strong>' + esc(D.title) + '</strong> — a vendor-neutral practitioner guide. Always validate against current <a href="https://learn.microsoft.com/fabric/" rel="noopener">Microsoft Learn</a> documentation before implementing.' + edit + '</p>' +
      '<p>Not affiliated with or endorsed by Microsoft. Microsoft Fabric, Power BI, OneLake and Azure are trademarks of Microsoft Corporation. · <a href="' + ROOT + 'styleguide.html">Authoring style guide</a></p></div>';
  }

  /* ---------- Code: highlight + copy ---------- */
  var KW = {
    python: 'False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield self cls',
    sql: 'SELECT FROM WHERE GROUP BY ORDER HAVING JOIN INNER LEFT RIGHT FULL OUTER CROSS ON AS AND OR NOT IN IS NULL LIKE BETWEEN CASE WHEN THEN ELSE END INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE VIEW ALTER DROP TRUNCATE MERGE USING MATCHED TARGET SOURCE WITH DISTINCT UNION ALL EXISTS TOP LIMIT OFFSET OVER PARTITION PARTITIONED ROW_NUMBER RANK PRIMARY KEY FOREIGN REFERENCES DEFAULT IF BEGIN DECLARE EXEC EXECUTE PROCEDURE PROC RETURN RETURNS CAST CONVERT OPTIMIZE ZORDER VACUUM RETAIN HOURS DESCRIBE HISTORY SHOW USE DATABASE SCHEMA TBLPROPERTIES LOCATION DELTA ADD COLUMN COLUMNS RENAME TO REPLACE OVERWRITE CLUSTER CLUSTERED BY ASC DESC INT BIGINT VARCHAR NVARCHAR DATE DATETIME2 DATETIME BIT DECIMAL FLOAT STRING TIMESTAMP BOOLEAN TRY CATCH THROW PRINT GO OUTPUT INSERTED DELETED NOT ENFORCED CONSTRAINT UNIQUE INDEX GRANT DENY REVOKE ROLE',
    dax: 'VAR RETURN DEFINE EVALUATE MEASURE COLUMN TABLE ORDER BY ASC DESC START AT IF SWITCH TRUE FALSE BLANK AND OR NOT IN',
    shell: 'if then else elif fi for while do done case esac function in echo export cd git az pip npm python python3 mkdir rm cp mv cat grep curl sudo set unset return exit source Get-ChildItem Set-Location Write-Host Write-Output Invoke-RestMethod Invoke-WebRequest ForEach-Object Where-Object Select-Object ConvertTo-Json ConvertFrom-Json Connect-AzAccount param function foreach',
    yaml: 'true false null yes no on off',
    json: 'true false null',
    js: 'const let var function return if else for while new class import export from async await try catch throw null undefined true false typeof'
  };
  var LANGMAP = { py: 'python', pyspark: 'python', python: 'python', sql: 'sql', tsql: 'sql', sparksql: 'sql', 'spark-sql': 'sql', dax: 'dax', bash: 'shell', sh: 'shell', shell: 'shell', powershell: 'shell', ps: 'shell', ps1: 'shell', yaml: 'yaml', yml: 'yaml', json: 'json', js: 'js', javascript: 'js', toml: 'yaml', ini: 'yaml', text: 'text', plaintext: 'text', txt: 'text', m: 'text', powerquery: 'text' };
  var LABEL = { python: 'Python', sql: 'SQL', dax: 'DAX', shell: 'Shell', yaml: 'YAML', json: 'JSON', js: 'JavaScript', text: 'Text' };

  function wrapRe(words, ci) { return new RegExp('\\b(?:' + words.trim().split(/\s+/).join('|') + ')\\b', ci ? 'i' : ''); }
  function highlight(code, lang) {
    if (lang === 'text') return esc(code);
    var comment, str, kwre, ci = (lang === 'sql' || lang === 'dax');
    if (lang === 'python' || lang === 'shell' || lang === 'yaml') comment = '#[^\\n]*';
    else if (lang === 'sql') comment = '--[^\\n]*|/\\*[\\s\\S]*?\\*/';
    else if (lang === 'dax' || lang === 'js') comment = '//[^\\n]*|--[^\\n]*|/\\*[\\s\\S]*?\\*/';
    else comment = null;
    if (lang === 'python') str = '"""[\\s\\S]*?"""|\'\'\'[\\s\\S]*?\'\'\'|"(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])*\'';
    else if (lang === 'sql') str = "'(?:''|[^'])*'";
    else str = '"(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])*\'';
    kwre = wrapRe(KW[lang] || '', ci).source;
    var parts = [];
    if (comment) parts.push('(' + comment + ')'); else parts.push('(?!)');
    parts.push('(' + str + ')');
    parts.push('(\\b\\d+(?:\\.\\d+)?\\b)');
    parts.push('(' + kwre + ')');
    parts.push('(\\$[A-Za-z_][\\w:]*|@[A-Za-z_][\\w]*)'); // variables / sql params
    parts.push('(\\b[A-Za-z_][\\w]*(?=\\())');
    var re = new RegExp(parts.join('|'), ci ? 'gi' : 'g');
    var out = '', last = 0, m;
    while ((m = re.exec(code)) !== null) {
      if (m[0] === '') { re.lastIndex++; continue; }
      out += esc(code.slice(last, m.index));
      var cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'n' : m[4] ? 'k' : m[5] ? 't' : 'f';
      if (cls === 's' && lang === 'json' && /^\s*:/.test(code.slice(re.lastIndex))) cls = 't';
      if (cls === 'k' && lang === 'python' && false) cls = 'k';
      out += '<span class="tok-' + cls + '">' + esc(m[0]) + '</span>';
      last = re.lastIndex;
    }
    return out + esc(code.slice(last));
  }

  function enhanceCode() {
    document.querySelectorAll('.content pre').forEach(function (pre) {
      var code = pre.querySelector('code');
      if (!code) { code = el('code'); code.textContent = pre.textContent; pre.textContent = ''; pre.appendChild(code); }
      var m = (code.className || '').match(/language-([\w-]+)/);
      var lang = LANGMAP[(m ? m[1] : 'text').toLowerCase()] || 'text';
      var raw = code.textContent.replace(/^\n+|\s+$/g, '');
      code.innerHTML = highlight(raw, lang);
      var title = pre.getAttribute('data-title') || '';
      var head = el('div', { class: 'pre-head' }, '<span class="title">' + esc(title) + '</span><span class="lang">' + (LABEL[lang] || '') + '</span><button type="button" class="copy-btn" aria-label="Copy code">Copy</button>');
      pre.insertBefore(head, pre.firstChild);
      var btn = head.querySelector('.copy-btn');
      btn.addEventListener('click', function () {
        var done = function () { btn.textContent = 'Copied'; btn.classList.add('done'); setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('done'); }, 1400); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(raw).then(done, function () { fallbackCopy(raw); done(); });
        else { fallbackCopy(raw); done(); }
      });
    });
  }
  function fallbackCopy(text) {
    var ta = el('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) { /* ignore */ } ta.remove();
  }

  /* ---------- Tabs, tables, checklists, links ---------- */
  function enhanceTabs() {
    document.querySelectorAll('.tabs').forEach(function (tabs, ti) {
      var panels = Array.prototype.slice.call(tabs.querySelectorAll(':scope > .tab'));
      if (panels.length < 2) return;
      tabs.classList.add('js');
      var list = el('div', { class: 'tab-list', role: 'tablist' });
      panels.forEach(function (p, i) {
        var b = el('button', { type: 'button', role: 'tab', 'aria-selected': i === 0 ? 'true' : 'false' }, esc(p.getAttribute('data-title') || ('Tab ' + (i + 1))));
        b.addEventListener('click', function () {
          panels.forEach(function (q, j) { q.hidden = j !== i; });
          Array.prototype.forEach.call(list.children, function (c, j) { c.setAttribute('aria-selected', j === i ? 'true' : 'false'); });
        });
        list.appendChild(b);
        p.hidden = i !== 0;
      });
      tabs.insertBefore(list, tabs.firstChild);
    });
  }
  function enhanceTables() {
    document.querySelectorAll('.content table').forEach(function (t) {
      if (t.closest('.table-wrap')) return;
      var w = el('div', { class: 'table-wrap' });
      t.parentNode.insertBefore(w, t); w.appendChild(t);
    });
  }
  function enhanceChecklists() {
    document.querySelectorAll('ul.checklist').forEach(function (ul, ui) {
      ul.querySelectorAll(':scope > li').forEach(function (li, i) {
        if (li.querySelector('input[type=checkbox]')) return;
        var key = 'fp-chk:' + location.pathname + ':' + ui + ':' + i;
        var cb = el('input', { type: 'checkbox', 'aria-label': 'Mark done' });
        var span = el('span'); while (li.firstChild) span.appendChild(li.firstChild);
        li.appendChild(cb); li.appendChild(span);
        cb.checked = storeGet(key) === '1';
        cb.addEventListener('change', function () { storeSet(key, cb.checked ? '1' : '0'); });
      });
    });
  }
  function enhanceLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(function (a) { a.setAttribute('rel', 'noopener noreferrer'); });
  }

  /* ---------- Search ---------- */
  var searchLoaded = false, idx = null;
  function loadIndex(cb) {
    if (idx) return cb();
    if (searchLoaded) { setTimeout(function () { loadIndex(cb); }, 80); return; }
    searchLoaded = true;
    var s = el('script', { src: ROOT + 'assets/js/search-index.js' });
    s.onload = function () { idx = window.SEARCH_INDEX || []; cb(); };
    s.onerror = function () { idx = []; cb(); };
    document.head.appendChild(s);
  }
  function runSearch(q) {
    var toks = q.toLowerCase().split(/[^a-z0-9_#.+-]+/).filter(function (x) { return x.length > 1; });
    if (!toks.length) return [];
    var res = [];
    idx.forEach(function (e) {
      var hay = (e.t + ' ' + e.s + ' ' + e.x).toLowerCase(), score = 0, ok = true;
      for (var i = 0; i < toks.length; i++) {
        var tk = toks[i];
        if (hay.indexOf(tk) < 0) { ok = false; break; }
        if (e.s.toLowerCase().indexOf(tk) >= 0) score += 6;
        if (e.t.toLowerCase().indexOf(tk) >= 0) score += 3;
        if (e.p.toLowerCase().indexOf(tk) >= 0) score += 2;
        if (e.x.toLowerCase().indexOf(tk) >= 0) score += 1;
      }
      if (ok) res.push({ e: e, s: score });
    });
    res.sort(function (a, b) { return b.s - a.s; });
    return res.slice(0, 9).map(function (r) { return { e: r.e, toks: toks }; });
  }
  function markText(text, toks) {
    var out = esc(text);
    toks.forEach(function (t) { out = out.replace(new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); });
    return out;
  }
  function initSearch() {
    var input = document.getElementById('search-input'), box = document.getElementById('search-results');
    if (!input) return;
    var active = -1;
    function render(q) {
      if (!q.trim()) { box.classList.remove('open'); return; }
      var r = runSearch(q);
      if (!r.length) box.innerHTML = '<div class="sr-empty">No matches for “' + esc(q) + '”.</div>';
      else box.innerHTML = r.map(function (x) {
        var e = x.e;
        return '<a href="' + ROOT + e.u + '"><div class="sr-title">' + markText(e.s || e.t, x.toks) + '</div><div class="sr-path">' + esc(e.p) + ' › ' + esc(e.t) + '</div><div class="sr-snip">' + markText(e.x.slice(0, 150), x.toks) + '…</div></a>';
      }).join('');
      active = -1; box.classList.add('open');
    }
    input.addEventListener('focus', function () { loadIndex(function () { if (input.value) render(input.value); }); });
    input.addEventListener('input', function () { loadIndex(function () { render(input.value); }); });
    input.addEventListener('keydown', function (e) {
      var items = box.querySelectorAll('a');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault(); if (!items.length) return;
        active = (active + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items.forEach(function (a, i) { a.classList.toggle('active', i === active); });
        items[active].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter' && items.length) { e.preventDefault(); (items[active] || items[0]).click(); }
      else if (e.key === 'Escape') { box.classList.remove('open'); input.blur(); }
    });
    document.addEventListener('click', function (e) { if (!e.target.closest('.search')) box.classList.remove('open'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '')) { e.preventDefault(); input.focus(); input.select(); }
    });
  }

  /* ---------- Init ---------- */
  function init() {
    buildHeader(); buildSidebar(); buildFooter();
    enhanceHeadings(); enhanceTables(); enhanceTabs(); enhanceCode(); enhanceChecklists(); enhanceLinks();
    buildToc(); buildPager(); initSearch();
    if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) setTimeout(function () { t.scrollIntoView(); }, 50); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
