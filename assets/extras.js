/* Code windows + back-to-top button.
   Everything about how they look comes from the `code:` and `to_top:` groups in _config.yml
   (read via assets/theme.js -> window.SiteTheme.config()); most of the styling is pure CSS driven by
   data-code-* attributes on <html>, so this file only builds the markup and handles behaviour.
     - every <pre> in a post is wrapped in a "window" with a language label and a copy button
     - optional line numbers (re-built from the original markup, so they can be switched live)
     - a button that jumps back to the top once you are far from it                                  */
(function () {
  "use strict";

  var root = document.documentElement;
  function conf() {
    var t = window.SiteTheme;
    return t && t.config ? t.config() : {};
  }

  /* ================= code windows ================= */
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

  /* split <code> into one <span class="cl"> per line, keeping every highlight span intact */
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

  /* ================= back-to-top ================= */
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

  /* ================= article tables ================= */
  // every table in a post gets a wrapper so wide tables can scroll sideways instead of breaking the layout.
  // The look (grid / striped / ...) is pure CSS driven by data-tbl-* on <html>; see  article:  in _config.yml.
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

  /* ================= project pictures: own colour ================= */
  // When a project has its own colour and the picture background is "None", the picture is filled with that colour
  // (see style.css). Light colours get dark ink instead of white, so this marks each such card as light or dark.
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

  function init() { wrapTables(); initCode(); artContrast(); refreshBtn(); lastY = window.pageYOffset || 0; update(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
