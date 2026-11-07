(function () {
  "use strict";

  var root = document.documentElement;
  function conf() {
    var t = window.SiteTheme;
    return t && t.config ? t.config() : {};
  }

  var NAMES = {
    c: "C", h: "C", cpp: "C++", "c++": "C++", cxx: "C++", hpp: "C++", cc: "C++", csharp: "C#", cs: "C#",
    py: "Python", python: "Python", python3: "Python", js: "JavaScript", javascript: "JavaScript", jsx: "JSX",
    ts: "TypeScript", typescript: "TypeScript", tsx: "TSX", sh: "Shell", shell: "Shell", bash: "Bash", zsh: "Zsh",
    powershell: "PowerShell", ps1: "PowerShell", pwsh: "PowerShell", posh: "PowerShell", bat: "Batch", batch: "Batch", cmd: "CMD",
    console: "Console", terminal: "Terminal", shellsession: "Shell session", nasm: "Assembly", asm: "Assembly", x86: "Assembly",
    armasm: "ARM Assembly", gas: "Assembly", masm: "Assembly", yaml: "YAML", yml: "YAML", json: "JSON", toml: "TOML", ini: "INI",
    html: "HTML", xml: "XML", css: "CSS", scss: "SCSS", md: "Markdown", markdown: "Markdown", rust: "Rust", rs: "Rust",
    go: "Go", golang: "Go", java: "Java", kotlin: "Kotlin", swift: "Swift", objc: "Objective-C", "objective-c": "Objective-C",
    sql: "SQL", diff: "Diff", patch: "Diff", make: "Makefile", makefile: "Makefile", cmake: "CMake", dockerfile: "Dockerfile",
    ruby: "Ruby", rb: "Ruby", php: "PHP", lua: "Lua", perl: "Perl", r: "R", llvm: "LLVM IR", gdb: "GDB", windbg: "WinDbg",
    plaintext: "Plaintext", text: "Plaintext", txt: "Plaintext", log: "Log", "": "Plaintext"
  };
  function langOf(pre) {
    var el = pre.closest('[class*="language-"]') || pre.querySelector('[class*="language-"]'), id = "";
    if (el) { var m = /language-([\w+#.-]+)/.exec(el.className); if (m) id = m[1].toLowerCase(); }
    var name = NAMES.hasOwnProperty(id) ? NAMES[id] : (id ? id.charAt(0).toUpperCase() + id.slice(1) : "Plaintext");
    return { id: id || "plaintext", name: name };
  }

  var I = {
    code: '<svg class="cw-ic cw-codeicon" viewBox="0 0 24 24" aria-hidden="true"><path d="m8 8-4 4 4 4"/><path d="m16 8 4 4-4 4"/><path d="m13.5 6-3 12"/></svg>',
    term: '<svg class="cw-ic cw-termicon" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 7 5 5-5 5"/><path d="M12 18h7"/></svg>',
    clip: '<svg class="cw-ic cc-clip" viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="3" width="8" height="4" rx="1"/><path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"/></svg>',
    ok: '<svg class="cw-ic cc-ok" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    min: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12"/></svg>',
    max: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="1.5"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6v12M6 12h12"/></svg>',
    caret: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>'
  };

  var wins = [];

  function copyText(text, done) {
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(ta); done(ok);
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
    else fallback();
  }

  function build(pre) {
    if (pre.closest(".code-win")) return;
    var host = pre.closest("div.highlighter-rouge") || pre;
    if (host.closest(".code-win")) return;
    var lang = langOf(pre);
    var win = document.createElement("div");
    win.className = "code-win";
    win.setAttribute("data-lang", lang.id);
    win.innerHTML =
      '<div class="code-head">' +
        '<span class="cw-dots" aria-hidden="true"><i></i><i></i><i></i></span>' +
        '<span class="cw-tab">' + I.term + I.code + '<span class="cw-lang">' + lang.name + '</span><span class="cw-tabx" aria-hidden="true">' + I.close + '</span></span>' +
        '<span class="cw-plus" aria-hidden="true">' + I.plus + '</span><span class="cw-caret" aria-hidden="true">' + I.caret + '</span>' +
        '<span class="cw-end">' +
          '<button class="code-copy" type="button" aria-label="Copy code" title="Copy code">' + I.clip + I.ok + '<span class="cc-text">Copy</span></button>' +
          '<span class="cw-wc" aria-hidden="true"><i>' + I.min + '</i><i>' + I.max + '</i><i class="cw-x">' + I.close + '</i></span>' +
        '</span>' +
      '</div><div class="code-body"></div>';
    host.parentNode.insertBefore(win, host);
    win.querySelector(".code-body").appendChild(host);
    pre.setAttribute("tabindex", "0");

    var codeEl = pre.querySelector("code") || pre;
    win._orig = codeEl.innerHTML;
    win._raw = codeEl.textContent.replace(/\n$/, "");
    win._code = codeEl;

    var btn = win.querySelector(".code-copy"), label = btn.querySelector(".cc-text"), timer = 0;
    btn.addEventListener("click", function () {
      copyText(win._raw, function (ok) {
        win.classList.toggle("copied", ok);
        label.textContent = ok ? "Copied" : "Press Ctrl+C";
        btn.title = ok ? "Copied!" : "Copy failed";
        clearTimeout(timer);
        timer = setTimeout(function () { win.classList.remove("copied"); label.textContent = "Copy"; btn.title = "Copy code"; }, 1800);
      });
    });
    wins.push(win);
  }

  function toLines(codeEl, html) {
    var src = document.createElement("div");
    src.innerHTML = html;
    var lines = [], stack = [];
    function open(ancs) {
      var line = document.createElement("span");
      line.className = "cl"; lines.push(line); stack = [line];
      ancs.forEach(function (a) { var c = a.cloneNode(false); stack[stack.length - 1].appendChild(c); stack.push(c); });
    }
    function top() { return stack[stack.length - 1]; }
    function walk(node, ancs) {
      if (node.nodeType === 3) {
        node.nodeValue.split("\n").forEach(function (part, i) {
          if (i > 0) open(ancs);
          if (part) top().appendChild(document.createTextNode(part));
        });
      } else if (node.nodeType === 1) {
        var c = node.cloneNode(false), a2 = ancs.concat([node]);
        top().appendChild(c); stack.push(c);
        Array.prototype.forEach.call(node.childNodes, function (ch) { walk(ch, a2); });
        stack.pop();
      }
    }
    open([]);
    Array.prototype.forEach.call(src.childNodes, function (n) { walk(n, []); });
    if (lines.length > 1 && !lines[lines.length - 1].textContent) lines.pop();   // trailing newline
    codeEl.textContent = "";
    lines.forEach(function (l) { if (!l.firstChild) l.appendChild(document.createTextNode("​")); codeEl.appendChild(l); });
  }

  function syncLines() {
    var on = (conf().code || {}).ln === true;
    wins.forEach(function (w) {
      var has = w.classList.contains("has-ln");
      if (on && !has) { toLines(w._code, w._orig); w.classList.add("has-ln"); }
      else if (!on && has) { w._code.innerHTML = w._orig; w.classList.remove("has-ln"); }
    });
  }

  function initCode() {
    var pres = document.querySelectorAll(".post-content pre");
    Array.prototype.forEach.call(pres, build);
    syncLines();
  }

  var ICONS = {
    chevron: '<path d="m6 15 6-6 6 6"/>',
    arrow: '<path d="M12 19V6"/><path d="m5.5 12.5 6.5-6.5 6.5 6.5"/>',
    double: '<path d="m6 12 6-6 6 6"/><path d="m6 19 6-6 6 6"/>'
  };
  var btn = null, ring = null, lastY = 0, ticking = false, visible = false;
  var preview = !!window.SITE_PREVIEW;

  function ensureBtn() {
    if (btn) return btn;
    btn = document.createElement("button");
    btn.type = "button"; btn.id = "to-top"; btn.className = "to-top";
    btn.setAttribute("aria-label", "Back to top"); btn.title = "Back to top"; btn.tabIndex = -1;
    btn.innerHTML = '<svg class="tt-ring" viewBox="0 0 44 44" aria-hidden="true"><circle class="tt-ring-bg" cx="22" cy="22" r="20.5"/><circle class="tt-ring-fg" cx="22" cy="22" r="20.5"/></svg>' +
      '<svg class="tt-ic" viewBox="0 0 24 24" aria-hidden="true"></svg><span class="tt-label"></span>';
    document.body.appendChild(btn);
    btn.addEventListener("click", function () {
      var c = conf().top || {}, calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: c.smooth && !calm ? "smooth" : "instant" });
      btn.blur();
    });
    return btn;
  }

  function setVisible(v) {
    if (v === visible) return;
    visible = v;
    btn.classList.toggle("is-visible", v);
    btn.tabIndex = v ? 0 : -1;
  }

  function update() {
    ticking = false;
    var c = conf().top;
    if (!c || !c.show || (c.on === "posts" && !root.classList.contains("is-post"))) { if (btn) setVisible(false); return; }
    ensureBtn();
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    btn.style.setProperty("--tt-p", String(Math.min(1, Math.max(0, y / max))));
    var far = y > c.after, up = y < lastY - 2, down = y > lastY + 2;
    var want = far;
    if (far && c.behavior === "scroll_up") want = up || (visible && !down) || btn.matches(":hover, :focus-visible");
    if (preview) want = true;
    lastY = y;
    setVisible(want);
  }

  function refreshBtn() {
    var c = conf().top;
    if (!c) return;
    if (c.show && !(c.on === "posts" && !root.classList.contains("is-post"))) ensureBtn();
    if (!btn) return;
    btn.setAttribute("data-style", c.style);
    btn.setAttribute("data-pos", c.pos);
    btn.setAttribute("data-progress", c.progress ? "on" : "off");
    btn.querySelector(".tt-ic").innerHTML = ICONS[c.icon] || ICONS.chevron;
    btn.querySelector(".tt-label").textContent = c.label;
    update();
  }

  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener("resize", update);

  function refresh() { syncLines(); refreshBtn(); }
  document.addEventListener("site-appearance", refresh);   // fired by the live preview in tools/_Apps/Site_Conf/Site_Conf.py

  function wrapTables() {
    var tables = document.querySelectorAll(".post-content table");
    Array.prototype.forEach.call(tables, function (t) {
      if (t.parentNode && t.parentNode.classList.contains("table-wrap")) return;
      var w = document.createElement("div");
      w.className = "table-wrap";
      t.parentNode.insertBefore(w, t);
      w.appendChild(t);
    });
  }

  function artContrast() {
    var cards = document.querySelectorAll(".project-card[data-artown]");
    Array.prototype.forEach.call(cards, function (card) {
      var c = getComputedStyle(card).getPropertyValue("--art-c").trim();
      if (!c) return;
      var probe = document.createElement("span");
      probe.style.color = c;
      document.body.appendChild(probe);
      var m = (getComputedStyle(probe).color || "").match(/[\d.]+/g);
      document.body.removeChild(probe);
      if (!m || m.length < 3) return;
      var lum = (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255;
      card.setAttribute("data-artlight", lum > 0.62 ? "1" : "0");
    });
  }

  var fy = 0, fTick = false;
  function floatUpdate() {
    fTick = false;
    var mode = root.getAttribute("data-float-hide") || "off";
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    var end = document.documentElement.scrollHeight - window.innerHeight - 40;
    var busy = root.classList.contains("toc-open") || document.querySelector('.dock-btn[aria-expanded="true"]') ||
               (document.activeElement && document.activeElement.closest && document.activeElement.closest(".nav-toggle, .toc-toggle, .settings, .to-top"));
    var away = root.classList.contains("float-away");
    if (mode === "off" || preview || busy || y < 90 || y >= end) away = false;
    else if (y > fy + 6) away = true;          // reading down
    else if (y < fy - 6) away = false;         // scrolled back up a little
    else { return; }                           // tiny jitter: keep the current state and the old reference point
    fy = y;
    root.classList.toggle("float-away", away);
  }
  window.addEventListener("scroll", function () {
    if (!fTick) { fTick = true; window.requestAnimationFrame(floatUpdate); }
  }, { passive: true });
  document.addEventListener("site-appearance", floatUpdate);

  function init() { wrapTables(); initCode(); artContrast(); refreshBtn(); lastY = window.pageYOffset || 0; update(); fy = lastY; floatUpdate(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

(function () {
  "use strict";
  var root = document.documentElement;
  var CANVAS = { waves: 1, particles: 1, starfield: 1, matrix: 1, circuit: 1, radar: 1, packets: 1, hexdump: 1, binary: 1 };
  var layer, cv, ctx, raf = 0, sig = "", W = 0, H = 0, type = "none", animate = true, k = 1, density = 50, inter = true;
  var cols = [[138, 180, 248], [200, 90, 220], [60, 190, 220]], parts = [], stars = [], drops = [], colIdx = [], fs = 16, sp = 20;
  var mouse = { x: -9999, y: -9999 }, last = 0, acc = 0;
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var GLYPHS = "01ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ<>/{}[]=+*#$%";

  function conf() { var t = window.SiteTheme; return (t && t.config ? t.config() : {}).bg || {}; }
  function build() {
    if (layer) return true;
    if (!document.body) return false;
    layer = document.createElement("div");
    layer.id = "bgfx";
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML = "<i class=\"b1\"></i><i class=\"b2\"></i><i class=\"b3\"></i><canvas></canvas>";
    document.body.insertBefore(layer, document.body.firstChild);
    cv = layer.querySelector("canvas");
    ctx = cv.getContext("2d");
    return true;
  }

  function readColors() {
    var probe = document.createElement("span");
    probe.style.cssText = "position:absolute;visibility:hidden";
    layer.appendChild(probe);
    cols = [1, 2, 3].map(function (n, i) {
      probe.style.color = "var(--bgfx-c" + n + ")";
      var s = getComputedStyle(probe).color, m = s.match(/[\d.]+(?:e-?\d+)?/g) || [];
      if (s.indexOf("color(") === 0) return m.length >= 3 ? m.slice(0, 3).map(function (v) { return Math.round(parseFloat(v) * 255); }) : cols[i];
      return m.length >= 3 ? m.slice(0, 3).map(Number) : cols[i];
    });
    layer.removeChild(probe);
  }
  function rgba(c, a) { return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")"; }

  function size() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = layer.clientWidth || window.innerWidth; H = layer.clientHeight || window.innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seed() {
    var area = (W * H) / (1280 * 720);
    parts = []; stars = []; drops = []; colIdx = [];
    if (type === "particles") {
      var n = Math.max(14, Math.min(220, Math.round(density * 1.5 * area)));
      for (var i = 0; i < n; i++) parts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .6, vy: (Math.random() - .5) * .6, r: 1 + Math.random() * 1.6 });
    } else if (type === "starfield") {
      var m = Math.max(40, Math.min(700, Math.round(density * 6 * area)));
      for (var j = 0; j < m; j++) stars.push({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() * .98 + .02, c: Math.random() });
    } else if (type === "matrix") {
      sp = Math.round(34 - density * .22); fs = Math.max(11, sp - 3);
      for (var c = 0; c < Math.ceil(W / sp); c++) { drops.push(Math.random() * (H / sp) * -1); colIdx.push(Math.random() < .08 ? 1 + (Math.random() < .5 ? 1 : 0) : 0); }
    }
    seedCyber();
  }


  var circ = { off: null, traces: [], pulses: [] }, blips = [], net = { nodes: [], edges: [], adj: [], pk: [] }, hx = { cols: [], cw: 7, rh: 18, fs: 12, w: 75 }, bn = { rows: [], cw: 8, rh: 20, fs: 13 };
  var HEXV = [0, 0, 0, 0, 0xFF, 0x90, 0xCC, 0x55, 0x8B, 0xEC, 0xE8, 0x48, 0x89, 0xC3, 0x0F, 0x1F];
  function rnd(n) { return (Math.random() * n) | 0; }

  function seedCircuit() {
    var cell = Math.round(46 - density * .22), n = Math.max(10, Math.min(130, Math.round(density * .9 * (W * H) / 921600)));
    var DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]], i, s;
    circ.traces = []; circ.pulses = [];
    circ.off = document.createElement("canvas"); circ.off.width = cv.width; circ.off.height = cv.height;
    var o = circ.off.getContext("2d");
    o.setTransform(cv.width / W, 0, 0, cv.height / H, 0, 0); o.lineWidth = 1.3; o.lineJoin = "round"; o.strokeStyle = rgba(cols[0], .3); o.fillStyle = rgba(cols[0], .5);
    for (i = 0; i < n; i++) {
      var d = rnd(8), pts = [{ x: rnd(Math.floor(W / cell)) * cell, y: rnd(Math.floor(H / cell)) * cell }], segs = 3 + rnd(5), len = 0, cum = [0];
      for (s = 0; s < segs; s++) {
        d = (d + [0, 0, 1, 7][rnd(4)]) & 7;
        var L = (2 + rnd(4)) * cell, last = pts[pts.length - 1], nx = last.x + DIRS[d][0] * L, ny = last.y + DIRS[d][1] * L;
        if (nx < -cell || nx > W + cell || ny < -cell || ny > H + cell) break;
        len += Math.sqrt((nx - last.x) * (nx - last.x) + (ny - last.y) * (ny - last.y)); pts.push({ x: nx, y: ny }); cum.push(len);
      }
      if (pts.length < 2) continue;
      o.beginPath(); o.moveTo(pts[0].x, pts[0].y); for (s = 1; s < pts.length; s++) o.lineTo(pts[s].x, pts[s].y); o.stroke();
      o.beginPath(); o.arc(pts[0].x, pts[0].y, 3.6, 0, 6.2832); o.stroke();
      o.beginPath(); o.arc(pts[pts.length - 1].x, pts[pts.length - 1].y, 2.4, 0, 6.2832); o.fill();
      circ.traces.push({ pts: pts, cum: cum, len: len });
    }
    for (i = 0; i < circ.traces.length; i++) if (Math.random() < .55) circ.pulses.push({ tr: circ.traces[i], d: Math.random() * circ.traces[i].len, v: 1.2 + Math.random() * 1.8, c: Math.random() < .75 ? 0 : 1 + rnd(2) });
  }
  function traceAt(tr, d) {
    var i = 1; while (i < tr.cum.length - 1 && tr.cum[i] < d) i++;
    var a = tr.pts[i - 1], b = tr.pts[i], f = (d - tr.cum[i - 1]) / ((tr.cum[i] - tr.cum[i - 1]) || 1);
    return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
  }
  function drawCircuit(dt) {
    ctx.clearRect(0, 0, W, H);
    if (circ.off) ctx.drawImage(circ.off, 0, 0, W, H);
    for (var i = 0; i < circ.pulses.length; i++) {
      var p = circ.pulses[i];
      p.d += p.v * dt * k * 1.6;
      if (p.d > p.tr.len + 40) { p.tr = circ.traces[rnd(circ.traces.length)]; p.d = -Math.random() * 120; }
      for (var j = 0; j < 8; j++) {
        var dd = p.d - j * 5; if (dd < 0 || dd > p.tr.len) continue;
        var q = traceAt(p.tr, dd);
        ctx.fillStyle = rgba(cols[p.c], (1 - j / 8) * .95); ctx.beginPath(); ctx.arc(q.x, q.y, 2.8 - j * .25, 0, 6.2832); ctx.fill();
      }
    }
  }

  function seedRadar() { blips = []; for (var i = 0, n = Math.round(6 + density * .18); i < n; i++) blips.push({ a: Math.random() * 6.2832, r: .12 + Math.random() * .85 }); }
  function drawRadar(t) {
    ctx.clearRect(0, 0, W, H);
    var cx = W * .62, cy = H * .52, R = Math.max(W, H) * .55, ang = t / 1000 * 1.1 * k, i, a;
    ctx.lineWidth = 1; ctx.strokeStyle = rgba(cols[0], .2);
    for (i = 1; i <= 5; i++) { ctx.beginPath(); ctx.arc(cx, cy, R * i / 5, 0, 6.2832); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
    ctx.beginPath(); for (i = 0; i < 72; i++) { a = i * .0873; ctx.moveTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.lineTo(cx + Math.cos(a) * (R - (i % 6 ? 6 : 14)), cy + Math.sin(a) * (R - (i % 6 ? 6 : 14))); } ctx.stroke();
    for (i = 0; i < 36; i++) { var a1 = ang - i * .035; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, a1 - .036, a1); ctx.closePath(); ctx.fillStyle = rgba(cols[0], (1 - i / 36) * .3); ctx.fill(); }
    ctx.strokeStyle = rgba(cols[0], .85); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(ang) * R, cy + Math.sin(ang) * R); ctx.stroke();
    for (i = 0; i < blips.length; i++) {
      var b = blips[i], diff = (((ang - b.a) % 6.2832) + 6.2832) % 6.2832, life = Math.max(0, 1 - diff / 4.2);
      if (life < .03) continue;
      var x = cx + Math.cos(b.a) * R * b.r, y = cy + Math.sin(b.a) * R * b.r;
      ctx.fillStyle = rgba(cols[2], life); ctx.beginPath(); ctx.arc(x, y, 3.2, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = rgba(cols[2], life * .6); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, 3.2 + (1 - life) * 12, 0, 6.2832); ctx.stroke();
    }
  }

  function seedNet() {
    var cell = Math.round(170 - density * .9), gc = Math.ceil(W / cell) + 1, gr = Math.ceil(H / cell) + 1, x, y, i;
    net = { nodes: [], edges: [], adj: [], pk: [] };
    for (y = 0; y < gr; y++) for (x = 0; x < gc; x++) { net.nodes.push({ x: x * cell + (Math.random() - .5) * cell * .6, y: y * cell + (Math.random() - .5) * cell * .6, pulse: 0 }); net.adj.push([]); }
    function link(a, b) {
      var A = net.nodes[a], B = net.nodes[b], len = Math.sqrt((A.x - B.x) * (A.x - B.x) + (A.y - B.y) * (A.y - B.y));
      net.edges.push([a, b]); net.adj[a].push({ to: b, len: len }); net.adj[b].push({ to: a, len: len });
    }
    for (y = 0; y < gr; y++) for (x = 0; x < gc; x++) {
      i = y * gc + x;
      if (x + 1 < gc && Math.random() < .85) link(i, i + 1);
      if (y + 1 < gr && Math.random() < .85) link(i, i + gc);
      if (x + 1 < gc && y + 1 < gr && Math.random() < .3) link(i, i + gc + 1);
      if (x > 0 && y + 1 < gr && Math.random() < .25) link(i, i + gc - 1);
    }
    for (i = 0; i < Math.max(8, Math.round(net.nodes.length * .4)); i++) {
      var f = rnd(net.nodes.length), opts = net.adj[f]; if (!opts.length) continue;
      var o = opts[rnd(opts.length)];
      net.pk.push({ from: f, to: o.to, len: o.len, s: Math.random() * o.len, v: 1.3 + Math.random() * 1.8, c: Math.random() < .78 ? 0 : 1 + rnd(2) });
    }
  }
  function drawNet(dt) {
    ctx.clearRect(0, 0, W, H);
    var i, n = net.nodes;
    ctx.lineWidth = 1; ctx.strokeStyle = rgba(cols[0], .16); ctx.beginPath();
    for (i = 0; i < net.edges.length; i++) { ctx.moveTo(n[net.edges[i][0]].x, n[net.edges[i][0]].y); ctx.lineTo(n[net.edges[i][1]].x, n[net.edges[i][1]].y); }
    ctx.stroke();
    for (i = 0; i < n.length; i++) {
      var nd = n[i]; nd.pulse = Math.max(0, nd.pulse - .03 * dt);
      ctx.fillStyle = rgba(cols[0], .45); ctx.beginPath(); ctx.arc(nd.x, nd.y, 2.4, 0, 6.2832); ctx.fill();
      if (nd.pulse > 0) { ctx.strokeStyle = rgba(cols[1], nd.pulse * .7); ctx.beginPath(); ctx.arc(nd.x, nd.y, 3 + (1 - nd.pulse) * 14, 0, 6.2832); ctx.stroke(); }
    }
    for (i = 0; i < net.pk.length; i++) {
      var p = net.pk[i], A = n[p.from], B = n[p.to];
      p.s += p.v * dt * k;
      if (p.s >= p.len) {
        B.pulse = 1; var opts = net.adj[p.to], o = opts[rnd(opts.length)];
        if (opts.length > 1 && o.to === p.from) o = opts[rnd(opts.length)];
        p.from = p.to; p.to = o.to; p.len = o.len; p.s = 0; A = n[p.from]; B = n[p.to];
      }
      var f = p.s / p.len, x = A.x + (B.x - A.x) * f, y = A.y + (B.y - A.y) * f, f2 = Math.max(0, (p.s - 16) / p.len);
      ctx.strokeStyle = rgba(cols[p.c], .5); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(A.x + (B.x - A.x) * f2, A.y + (B.y - A.y) * f2); ctx.lineTo(x, y); ctx.stroke();
      ctx.fillStyle = rgba(cols[p.c], .95); ctx.fillRect(x - 2, y - 2, 4, 4);
    }
  }

  function hexRow(addr, hi) {
    var s = ("00000000" + addr.toString(16)).slice(-8).toUpperCase() + "  ", asc = "", i, v;
    for (i = 0; i < 16; i++) { v = Math.random() < .5 ? HEXV[rnd(HEXV.length)] : rnd(256); s += (i ? " " : "") + ("0" + v.toString(16)).slice(-2).toUpperCase(); asc += v >= 32 && v < 127 ? String.fromCharCode(v) : "."; }
    return { txt: s + "  " + asc, hi: hi ? rnd(16) : -1 };
  }
  function seedHex() {
    hx.fs = Math.round(14 - density * .04); ctx.font = hx.fs + "px monospace"; hx.cw = ctx.measureText("M").width || 7; hx.rh = Math.round(hx.fs * 1.55);
    var colW = hx.w * hx.cw + 50, n = Math.max(1, Math.ceil(W / colW)), rows = Math.ceil(H / hx.rh) + 3, i, j;
    hx.cols = [];
    for (i = 0; i < n; i++) {
      var col = { x: i * colW + 12, off: Math.random() * hx.rh, v: .3 + Math.random() * .45, addr: 0x00400000 + rnd(0xFFFF) * 16, rows: [] };
      for (j = 0; j < rows; j++) { col.rows.push(hexRow(col.addr, Math.random() < .12)); col.addr += 16; }
      hx.cols.push(col);
    }
  }
  function drawHex(dt) {
    ctx.clearRect(0, 0, W, H); ctx.font = hx.fs + "px monospace";
    for (var i = 0; i < hx.cols.length; i++) {
      var c = hx.cols[i];
      c.off += c.v * dt * k;
      while (c.off >= hx.rh) { c.off -= hx.rh; c.rows.shift(); c.rows.push(hexRow(c.addr, Math.random() < .12)); c.addr += 16; }
      for (var r = 0; r < c.rows.length; r++) {
        var y = r * hx.rh - c.off + hx.rh, row = c.rows[r];
        ctx.fillStyle = rgba(cols[0], .5); ctx.fillText(row.txt, c.x, y);
        if (row.hi >= 0) { var p = 10 + row.hi * 3, x = c.x + p * hx.cw; ctx.clearRect(x, y - hx.fs * .9, hx.cw * 2, hx.fs * 1.2); ctx.fillStyle = rgba(cols[1], .98); ctx.fillText(row.txt.substr(p, 2), x, y); }
      }
    }
  }

  function bitStr(n) { var s = "", b = rnd(2); for (var i = 0; i < n; i++) { if (Math.random() < .3) b = 1 - b; s += b; } return s; }
  function seedBinary() {
    bn.fs = Math.round(15 - density * .05); ctx.font = bn.fs + "px monospace"; bn.cw = ctx.measureText("0").width || 8; bn.rh = Math.round(bn.fs * 1.7); bn.rows = [];
    for (var i = 0, n = Math.ceil(H / bn.rh) + 1; i < n; i++) {
      var len = Math.ceil(W / bn.cw) + 8;
      bn.rows.push({ str: bitStr(len), w: len * bn.cw, x: Math.random() * len * bn.cw, v: (.25 + Math.random() * .6) * (Math.random() < .5 ? -1 : 1), a: .12 + Math.random() * .45, c: Math.random() < .72 ? 0 : 1 + rnd(2) });
    }
  }
  function drawBinary(dt) {
    ctx.clearRect(0, 0, W, H); ctx.font = bn.fs + "px monospace";
    var i, r, f;
    for (i = 0; i < 3; i++) { r = bn.rows[rnd(bn.rows.length)]; f = rnd(r.str.length); r.str = r.str.slice(0, f) + (r.str.charAt(f) === "0" ? "1" : "0") + r.str.slice(f + 1); }
    for (i = 0; i < bn.rows.length; i++) {
      r = bn.rows[i]; r.x += r.v * dt * k;
      var sx = ((r.x % r.w) + r.w) % r.w, y = (i + 1) * bn.rh;
      ctx.fillStyle = rgba(cols[r.c], r.a); ctx.fillText(r.str, -sx, y); ctx.fillText(r.str, -sx + r.w, y);
    }
  }
  function seedCyber() {
    if (type === "circuit") seedCircuit(); else if (type === "radar") seedRadar(); else if (type === "packets") seedNet();
    else if (type === "hexdump") seedHex(); else if (type === "binary") seedBinary();
  }
  function drawCyber(dt, t) {
    if (type === "circuit") drawCircuit(dt); else if (type === "radar") drawRadar(t); else if (type === "packets") drawNet(dt);
    else if (type === "hexdump") drawHex(dt); else if (type === "binary") drawBinary(dt);
  }

  function drawParticles(dt) {
    ctx.clearRect(0, 0, W, H);
    var link = 100 + density * .55, l2 = link * link, i, j, p, q, dx, dy, d2, d;
    for (i = 0; i < parts.length; i++) {
      p = parts[i];
      p.x += p.vx * dt * k; p.y += p.vy * dt * k;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      if (inter) { dx = p.x - mouse.x; dy = p.y - mouse.y; d2 = dx * dx + dy * dy; if (d2 < 14400 && d2 > 1) { d = Math.sqrt(d2); p.x += dx / d * (1 - d / 120) * 1.6 * dt; p.y += dy / d * (1 - d / 120) * 1.6 * dt; } }
    }
    ctx.lineWidth = 1;
    for (i = 0; i < parts.length; i++) {
      p = parts[i];
      for (j = i + 1; j < parts.length; j++) {
        q = parts[j]; dx = p.x - q.x; dy = p.y - q.y; d2 = dx * dx + dy * dy;
        if (d2 < l2) { ctx.strokeStyle = rgba(cols[1], (1 - Math.sqrt(d2) / link) * .55); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      }
      if (inter) { dx = p.x - mouse.x; dy = p.y - mouse.y; d2 = dx * dx + dy * dy; if (d2 < l2 * 1.7) { ctx.strokeStyle = rgba(cols[2], (1 - Math.sqrt(d2) / (link * 1.3)) * .7); ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); } }
      ctx.fillStyle = rgba(cols[0], .95); ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
    }
  }

  function drawStars(dt) {
    ctx.clearRect(0, 0, W, H);
    var cx = W / 2 + (inter && mouse.x > -9000 ? (mouse.x - W / 2) * .08 : 0), cy = H / 2 + (inter && mouse.y > -9000 ? (mouse.y - H / 2) * .08 : 0), sc = Math.max(W, H) * .2;
    ctx.lineCap = "round";
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i], pz = s.z + .012 * k;
      s.z -= .0035 * k * dt;
      var x = cx + s.x / s.z * sc, y = cy + s.y / s.z * sc;
      if (s.z <= .02 || x < -20 || x > W + 20 || y < -20 || y > H + 20) { s.x = Math.random() * 2 - 1; s.y = Math.random() * 2 - 1; s.z = 1; continue; }
      var px = cx + s.x / pz * sc, py = cy + s.y / pz * sc, c = s.c < .6 ? cols[0] : (s.c < .8 ? cols[1] : cols[2]);
      ctx.strokeStyle = rgba(c, Math.min(1, (1 - s.z) * 1.3)); ctx.lineWidth = .4 + (1 - s.z) * 2.2;
      ctx.beginPath(); ctx.moveTo(animate ? px : x, animate ? py : y); ctx.lineTo(x + .01, y); ctx.stroke();
    }
  }

  function stepMatrix() {
    ctx.globalCompositeOperation = "destination-out"; ctx.fillStyle = "rgba(0,0,0,.09)"; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "source-over"; ctx.font = fs + "px monospace";
    for (var i = 0; i < drops.length; i++) {
      var y = drops[i] * sp;
      if (y > 0) { ctx.fillStyle = rgba(cols[colIdx[i]], 1); ctx.fillText(GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length)), i * sp, y); }
      if (y > H && Math.random() > .975) drops[i] = 0; else drops[i] += 1;
    }
  }
  function drawMatrix(dt) {
    acc += dt * 16.7;
    var every = 125 - conf().speed * 9;
    if (acc >= every) { acc = 0; stepMatrix(); }
  }

  function drawWaves(t) {
    ctx.clearRect(0, 0, W, H);
    var ph = t / 1000 * k * .9, amp = .5 + density / 100;
    for (var i = 0; i < 3; i++) {
      var base = H * (.58 + i * .1), a = (26 + i * 10) * amp;
      ctx.beginPath(); ctx.moveTo(0, H);
      for (var x = 0; x <= W + 8; x += 8) ctx.lineTo(x, base + Math.sin(x / (170 + i * 80) + ph * (1 + i * .35) + i * 2) * a + Math.sin(x / 90 - ph * .7) * a * .35);
      ctx.lineTo(W, H); ctx.closePath(); ctx.fillStyle = rgba(cols[i], .3); ctx.fill();
    }
  }

  function draw(dt, t) {
    if (type === "particles") drawParticles(dt); else if (type === "starfield") drawStars(dt);
    else if (type === "matrix") drawMatrix(dt); else if (type === "waves") drawWaves(t); else drawCyber(dt, t);
  }
  function frame(ts) {
    raf = requestAnimationFrame(frame);
    if (document.hidden) { last = 0; return; }
    var dt = last ? Math.min(50, ts - last) / 16.7 : 1; last = ts;
    draw(dt, ts);
  }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; last = 0; }

  function refresh() {
    if (!build()) return;
    var c = conf(), a = root.getAttribute("data-bg-anim") === "1" && !still;
    type = c.type || "none"; animate = a; k = (c.speed || 5) / 5; density = c.density || 50; inter = c.inter !== false;
    readColors();
    var s = [type, a, k, density, inter, cols.join(";"), root.getAttribute("data-theme")].join("|");
    if (s === sig) return;
    sig = s; stop();
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
    if (!CANVAS[type]) return;
    size(); seed(); acc = 1e9;
    if (type === "matrix" && !animate) { for (var i = 0; i < 40; i++) stepMatrix(); return; }
    draw(1, 3000);
    if (animate) raf = requestAnimationFrame(frame);
  }

  var rt = 0;
  window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { sig = ""; refresh(); }, 150); });
  window.addEventListener("pointermove", function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  document.addEventListener("pointerleave", function () { mouse.x = mouse.y = -9999; });
  document.addEventListener("site-appearance", refresh);              // live preview in tools/_Apps/Site_Conf/Site_Conf.py
  if (window.MutationObserver) new MutationObserver(refresh).observe(root, { attributes: true, attributeFilter: ["data-theme", "data-bg", "data-bg-anim", "style"] });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", refresh); else refresh();
})();
