(function () {
  "use strict";
  var DEF = {"fx_load":{"on":false},"fx_scroll":{"reveal":false,"reveal_style":"fade","reveal_duration":500,"reveal_stagger":60,"reveal_easing":"ease-out","progress":true,"progress_scope":"all","progress_height":3,"progress_color":"","parallax":false,"parallax_strength":15,"progress_posts":true,"progress_home":false,"progress_archive":false,"progress_categories":false,"progress_tags":false,"progress_projects":false,"progress_about":false,"progress_pages":false},"fx_cards":{"tilt":false,"tilt_max":6,"glow":false,"glow_color":"","glow_size":220,"border":false,"border_speed":4,"hover":"lift","hover_duration":200,"hover_easing":"ease-out"},"fx_text":{"typing":"both","typing_speed":25,"typing_delay":0,"cursor_char":"block","decrypt":false,"decrypt_duration":700,"glitch":false,"glitch_color":""},"fx_cursor":{"glow":"off","trail":false,"custom":"off"},"fx_menu":{"marker":false,"marker_duration":300,"slide":false,"slide_stagger":50,"hover_glow":true,"glow_color":""},"fx_toc":{"panel":true,"panel_style":"slide","panel_duration":350,"slide":true,"slide_style":"slide","slide_stagger":35,"marker":true,"marker_duration":300,"hover_glow":true,"glow_color":""},"fx_code":{"typewriter":false,"type_speed":40,"scanline":false,"scan_speed":4,"glow":true,"glow_color":"","glow_size":10},"fx_pages":{"fade":false},"fx_theme":{"crossfade":false}};   // generated from Site_Conf.py SCHEMA - keep in sync
  var EASE = { "ease": "ease", "ease-out": "cubic-bezier(.22,1,.36,1)", "ease-in-out": "ease-in-out", "linear": "linear", "spring": "cubic-bezier(.34,1.56,.64,1)" };
  var CARDS = ".post-card, .page-card, .project-card, .archive-row";
  var BTNS = "button:not(.fx-x), .scope-btn, .page-btn, .page-arrow, .meta-link";
  var HEADS = ".content-inner h1, .content-inner h2, .content-inner h3, .entry-title";
  var CODE = ".code-win, .content-inner pre:not(.code-win pre)";
  var root = document.documentElement, style, cleanups = [], lastSig = {}, first = true;
  var fine = window.matchMedia ? window.matchMedia("(pointer: fine)").matches : true;

  function conf() {
    var a = window.SITE_APPEARANCE || {}, c = {};
    Object.keys(DEF).forEach(function (g) {
      var src = a[g] && typeof a[g] === "object" ? a[g] : {};
      c[g] = {};
      Object.keys(DEF[g]).forEach(function (k) {
        var d = DEF[g][k], v = src[k];
        if (v === undefined || v === null || v === "") v = d;
        if (typeof d === "number") { v = Number(v); if (isNaN(v)) v = d; }
        if (typeof d === "boolean") v = !(v === false || v === "false" || v === 0);
        c[g][k] = v;
      });
    });
    return c;
  }
  function col(v) { return /^#[0-9a-f]{3,8}$/i.test(v || "") ? v : "var(--accent)"; }
  function ez(v) { return EASE[v] || "ease"; }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function on(el, ev, fn, o) { el.addEventListener(ev, fn, o); cleanups.push(function () { el.removeEventListener(ev, fn, o); }); }
  function node(tag, cls, parent) { var n = document.createElement(tag); n.className = "fx-x " + cls; (parent || document.body).appendChild(n); cleanups.push(function () { n.remove(); }); return n; }
  function later(fn, ms) { var t = setTimeout(fn, ms); cleanups.push(function () { clearTimeout(t); }); }
  function teardown() {
    cleanups.splice(0).forEach(function (f) { try { f(); } catch (e) { /* ignore */ } });
    $$("[class*='fx-']").forEach(function (el) {
      el.className.split(/\s+/).forEach(function (c) { if (/^fx-/.test(c) && c !== "fx-x") el.classList.remove(c); });
      ["--fx-mx", "--fx-my", "--fx-i", "transform"].forEach(function (p) { el.style.removeProperty(p); });
    });
  }

  function css(c) {
    var L = c.fx_load, S = c.fx_scroll, K = c.fx_cards, T = c.fx_text, U = c.fx_cursor, M = c.fx_menu, Q = c.fx_toc, C = c.fx_code, P = c.fx_pages, H = c.fx_theme, r = [];
    r.push(":root{--fx-rv-d:" + S.reveal_duration + "ms;--fx-rv-e:" + ez(S.reveal_easing) + ";--fx-hv-d:" + K.hover_duration + "ms;--fx-hv-e:" + ez(K.hover_easing) + "}");
    r.push(".fx-x{pointer-events:none}");
    if (S.reveal) {
      var from = { fade: "opacity:0", slide: "opacity:0;transform:translateY(28px)", zoom: "opacity:0;transform:scale(.92)" }[S.reveal_style] || "opacity:0";
      r.push(".fx-rv{" + from + ";transition:opacity var(--fx-rv-d) var(--fx-rv-e),transform var(--fx-rv-d) var(--fx-rv-e);transition-delay:calc(var(--fx-i,0) * " + S.reveal_stagger + "ms)}");
      r.push(".fx-rv.fx-in{opacity:1;transform:none}");
    }
    if (S.progress) r.push(".fx-progress{position:fixed;left:0;top:0;height:" + S.progress_height + "px;width:100%;transform-origin:0 50%;transform:scaleX(0);background:" + col(S.progress_color) + ";z-index:9999}");
    if (K.hover !== "off") {
      r.push(CARDS + "," + BTNS + "{transition:transform var(--fx-hv-d) var(--fx-hv-e),box-shadow var(--fx-hv-d) var(--fx-hv-e)}");
      if (K.hover === "lift" || K.hover === "both") r.push(".fx-hv:hover:not(.fx-tilt){transform:translateY(-4px)}.fx-hv:hover{box-shadow:0 10px 26px -12px color-mix(in srgb,var(--accent) 55%,transparent)}");
      if (K.hover === "shine" || K.hover === "both") {
        r.push(".fx-shine{position:relative;overflow:hidden}.fx-shine::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 35%,color-mix(in srgb,#fff 28%,transparent) 50%,transparent 65%);transform:translateX(-120%)}");
        r.push(".fx-shine:hover::after{transform:translateX(120%);transition:transform calc(var(--fx-hv-d) * 3) var(--fx-hv-e)}");
      }
    }
    if (K.tilt) r.push(".fx-tilt{transform-style:preserve-3d;will-change:transform}");
    if (K.glow) r.push(".fx-glow{background-image:radial-gradient(circle " + K.glow_size + "px at var(--fx-mx,-999px) var(--fx-my,-999px)," + "color-mix(in srgb," + col(K.glow_color) + " 22%,transparent),transparent 70%)}");
    if (K.border) {
      r.push("@property --fx-ang{syntax:'<angle>';inherits:false;initial-value:0deg}@keyframes fx-spin{to{--fx-ang:360deg}}");
      r.push(".fx-bd{position:relative}.fx-bd::before{content:'';position:absolute;inset:-1px;border-radius:inherit;padding:1.5px;pointer-events:none;background:conic-gradient(from var(--fx-ang),transparent 0 60%,var(--accent) 80%,transparent);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:fx-spin " + K.border_speed + "s linear infinite}");
    }
    if (T.typing !== "off") r.push(".fx-caret{display:inline-block;margin-left:1px;animation:fx-blink 1s steps(1) infinite;color:var(--accent)}@keyframes fx-blink{50%{opacity:0}}");
    if (T.glitch) {
      var g = col(T.glitch_color);
      r.push(".fx-glitch:hover{will-change:text-shadow;animation:fx-glitch .35s steps(2) infinite}@keyframes fx-glitch{0%{text-shadow:2px 0 " + g + ",-2px 0 #0ff}25%{text-shadow:-2px -1px " + g + ",2px 1px #0ff}50%{text-shadow:1px 2px " + g + ",-1px -2px #0ff}100%{text-shadow:none}}");
    }
    if (M.marker) r.push(".side-nav.fx-mk{position:relative}.fx-marker{position:absolute;left:0;width:3px;border-radius:3px;background:var(--accent);transition:top " + M.marker_duration + "ms cubic-bezier(.34,1.56,.64,1),height " + M.marker_duration + "ms ease,opacity .2s;box-shadow:0 0 10px var(--accent)}");
    if (M.slide) r.push(".fx-slin{animation:fx-slin .45s cubic-bezier(.22,1,.36,1) both;animation-delay:calc(var(--fx-i,0) * " + M.slide_stagger + "ms)}@keyframes fx-slin{from{opacity:0;transform:translateX(-18px)}}");
    if (M.hover_glow) r.push(".side-nav a{transition:text-shadow .2s,box-shadow .2s}.side-nav a:hover{text-shadow:0 0 10px " + col(M.glow_color) + ";box-shadow:inset 0 0 18px -6px " + col(M.glow_color) + "}");
    if (C.glow) r.push(".fx-cglw{box-shadow:0 0 " + C.glow_size + "px -2px color-mix(in srgb," + col(C.glow_color) + " 60%,transparent),inset 0 0 0 1px color-mix(in srgb," + col(C.glow_color) + " 55%,transparent)!important}");
    if (C.scanline) r.push(".fx-scanhost{position:relative;overflow:hidden}.fx-scan{position:absolute;left:0;right:0;top:0;height:40px;background:linear-gradient(transparent,color-mix(in srgb,var(--accent) 16%,transparent),transparent);animation:fx-scan " + C.scan_speed + "s linear infinite}@keyframes fx-scan{from{transform:translateY(-40px)}to{transform:translateY(var(--fx-h,400px))}}");
    if (C.typewriter) r.push(".fx-tw{clip-path:inset(0 0 100% 0)}.fx-tw.fx-in{animation:fx-tw var(--fx-twd) steps(var(--fx-twn)) forwards}@keyframes fx-tw{to{clip-path:inset(0 0 0 0)}}");
    if (Q.panel) {   // table of contents: panel opens (desktop: keyframes, because the panel is display:none when closed; narrow screens: the drawer transition)
      var pf = { slide: "opacity:0;transform:translateX(34px)", fade: "opacity:0", zoom: "opacity:0;transform:scale(.92)" }[Q.panel_style] || "opacity:0";
      r.push("@media (min-width:1280px){html.toc-open .toc-panel.ready{animation:fx-tocp " + Q.panel_duration + "ms cubic-bezier(.22,1,.36,1) both}}@keyframes fx-tocp{from{" + pf + "}}");
      r.push("@media (max-width:1279px){.toc-panel{transition:transform " + Q.panel_duration + "ms cubic-bezier(.22,1,.36,1),visibility 0s " + Q.panel_duration + "ms}html.toc-open .toc-panel{transition:transform " + Q.panel_duration + "ms cubic-bezier(.22,1,.36,1)}}");
    }
    if (Q.slide) {   // table of contents: items come in one after the other (also when a section is expanded)
      var qf = { slide: "opacity:0;transform:translateX(18px)", fade: "opacity:0", zoom: "opacity:0;transform:scale(.85)" }[Q.slide_style] || "opacity:0";
      r.push("html.toc-open .toc-nav a.fx-tocin{animation:fx-tocin .45s cubic-bezier(.22,1,.36,1) both;animation-delay:calc(var(--fx-i,0) * " + Q.slide_stagger + "ms)}@keyframes fx-tocin{from{" + qf + "}}");
    }
    if (Q.marker) r.push(".toc-nav{position:relative}.fx-toc-mk{position:absolute;left:0;width:2px;border-radius:2px;background:var(--toc-active,var(--accent));box-shadow:0 0 8px var(--toc-active,var(--accent));opacity:0;z-index:1;transition:top " + Q.marker_duration + "ms cubic-bezier(.34,1.56,.64,1),height " + Q.marker_duration + "ms ease,opacity .2s}.toc-nav.fx-tocmk a.active{border-left-color:var(--border-soft)}");
    if (Q.hover_glow) r.push(".toc-nav a{transition:color .12s,border-color .12s,text-shadow .2s}.toc-nav a:hover{text-shadow:0 0 10px " + col(Q.glow_color) + "}");
    return r.join("\n");
  }

  function pageLoad() {}
  function reveal(S) {
    if (!S.reveal || !("IntersectionObserver" in window)) return;
    var els = $$(CARDS + "," + HEADS + ", .content-inner .project-intro");
    var io = new IntersectionObserver(function (ents) {
      var batch = 0;
      ents.forEach(function (e) { if (e.isIntersecting) { e.target.style.setProperty("--fx-i", batch++); e.target.classList.add("fx-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { el.classList.add("fx-rv"); io.observe(el); });
    cleanups.push(function () { io.disconnect(); });
  }

  function scrolling(S) {
    var kind = root.classList.contains("is-post") ? "posts" : (root.getAttribute("data-pagekind") || "pages");
    if (kind === "pages" && (location.pathname === "/" || location.pathname === "/index.html")) kind = "home";
    var show = S.progress && (S.progress_scope !== "custom" || S["progress_" + kind]);
    var bar = show ? node("div", "fx-progress") : null;
    if (bar) bar.setAttribute("aria-hidden", "true");
    var imgs = S.parallax ? $$(".content-inner img") : [], bg = document.getElementById("bgfx"), k = S.parallax_strength / 100;
    if (!bar && !S.parallax) return;
    var tick = function () {
      var y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
      if (bar) bar.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
      if (S.parallax) {
        if (bg) bg.style.transform = "translateY(" + (-y * k) + "px)";
        imgs.forEach(function (im) { var r = im.getBoundingClientRect(), c = r.top + r.height / 2 - innerHeight / 2; im.style.transform = "translateY(" + (-c * k * 0.4) + "px)"; });
      }
    };
    on(window, "scroll", tick, { passive: true }); tick();
    cleanups.push(function () { if (bg) bg.style.transform = ""; imgs.forEach(function (im) { im.style.transform = ""; }); });
  }

  function cards(K) {
    var cs = $$(CARDS), bs = $$(BTNS).filter(function (b) { return !b.closest("#settings"); });
    if (K.hover !== "off") cs.concat(bs).forEach(function (el) {
      el.classList.add("fx-hv");
      if (K.hover === "shine" || K.hover === "both") el.classList.add("fx-shine");
    });
    cs.forEach(function (el) {
      if (K.border) el.classList.add("fx-bd");
      if (K.glow) el.classList.add("fx-glow");
      if (K.tilt) el.classList.add("fx-tilt");
      if (!K.tilt && !K.glow) return;
      on(el, "mousemove", function (e) {
        var r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        if (K.glow) { el.style.setProperty("--fx-mx", x + "px"); el.style.setProperty("--fx-my", y + "px"); }
        if (K.tilt) { var rx = (0.5 - y / r.height) * K.tilt_max * 2, ry = (x / r.width - 0.5) * K.tilt_max * 2; el.style.transform = "perspective(800px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)"; }
      });
      on(el, "mouseleave", function () { el.style.removeProperty("--fx-mx"); el.style.removeProperty("--fx-my"); if (K.tilt) el.style.transform = ""; });
    });
  }

  var GLYPHS = "!<>-_\\/[]{}=+*^?#01ABCDEF";
  function scramble(el, ms) {
    var txt = el.getAttribute("data-fx-text") || el.textContent; el.setAttribute("data-fx-text", txt);
    var t0 = performance.now(), stop = false;
    cleanups.push(function () { stop = true; el.textContent = txt; el.removeAttribute("data-fx-text"); });
    (function f(now) {
      if (stop) return;
      var p = Math.min(1, (now - t0) / ms), n = Math.floor(txt.length * p), out = txt.slice(0, n);
      for (var i = n; i < txt.length; i++) out += txt[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      el.textContent = out;
      if (p < 1) requestAnimationFrame(f);
    })(t0);
  }
  var typeStops = [];
  function stopTyping() { typeStops.splice(0).forEach(function (f) { try { f(); } catch (e) { /* ignore */ } }); }
  function startTyping(T) {
    stopTyping();
    if (T.typing === "off") return;
    var targets = [];
    if (T.typing === "title" || T.typing === "both") targets.push(document.querySelector(".site-title"));
    if (T.typing === "tagline" || T.typing === "both") targets.push(document.querySelector(".tagline"));
    var ch = { bar: "|", block: "\u2588", under: "_" }[T.cursor_char] || "|", delay = T.typing_delay, timers = [];
    var wait = function (fn, ms) { timers.push(setTimeout(fn, ms)); };
    typeStops.push(function () { timers.forEach(clearTimeout); });
    targets.filter(Boolean).forEach(function (el, idx) {
      var full = el.textContent, i = 0, caret = document.createElement("span");
      el.setAttribute("data-fx-full", full);
      caret.className = "fx-caret"; caret.textContent = ch;
      el.textContent = ""; el.appendChild(caret);
      typeStops.push(function () { if (el.hasAttribute("data-fx-full")) { el.textContent = el.getAttribute("data-fx-full"); el.removeAttribute("data-fx-full"); } });
      var typeNext = function () {
        if (i < full.length) { caret.before(full[i++]); wait(typeNext, T.typing_speed); }
        else if (idx < targets.length - 1) wait(function () { caret.remove(); }, 600);
      };
      wait(typeNext, delay);
      delay += full.length * T.typing_speed + 300;
    });
  }
  function text(T, replay) {
    if (T.typing === "off") stopTyping();
    else if (first || replay) startTyping(T);
    var hs = $$(HEADS);
    if (T.glitch) hs.forEach(function (h) { h.classList.add("fx-glitch"); });
    if (T.decrypt && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (ents) { ents.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); scramble(e.target, T.decrypt_duration); } }); });
      hs.forEach(function (h) { if (!h.children.length) io.observe(h); });
      cleanups.push(function () { io.disconnect(); });
    }
  }

  function cursor() {}
  function menu(M, replay) {
    var nav = document.querySelector(".side-nav");
    if (!nav) return;
    var items = $$("a", nav);
    if (M.slide && (first || replay)) items.forEach(function (a, i) { a.style.setProperty("--fx-i", i); a.classList.add("fx-slin"); });
    if (!M.marker) return;
    nav.classList.add("fx-mk");
    var mk = node("span", "fx-marker", nav), act = nav.querySelector("a.active") || items[0];
    var to = function (a) { if (!a) { mk.style.opacity = 0; return; } mk.style.opacity = 1; mk.style.top = a.offsetTop + "px"; mk.style.height = a.offsetHeight + "px"; };
    var cur = function () { return nav.querySelector("a.active") || act; };   // the current item can change without a reload (live preview)
    to(act);
    items.forEach(function (a) { on(a, "mouseenter", function () { to(a); }); on(a, "click", function () { setTimeout(function () { to(cur()); }, 0); }); });
    on(nav, "mouseleave", function () { to(cur()); });
    on(window, "resize", function () { to(cur()); });
  }

  function code(C) {
    var blocks = $$(CODE);
    blocks.forEach(function (b) {
      if (C.glow) b.classList.add("fx-cglw");
      if (C.scanline) { b.classList.add("fx-scanhost"); b.style.setProperty("--fx-h", b.offsetHeight + 40 + "px"); node("div", "fx-scan", b); }
    });
    if (C.typewriter && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (ents) { ents.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); e.target.classList.add("fx-in"); } }); }, { threshold: 0.15 });
      blocks.forEach(function (b) {
        var n = Math.max(1, (b.textContent.match(/\n/g) || []).length);
        b.style.setProperty("--fx-twn", n); b.style.setProperty("--fx-twd", n * C.type_speed + "ms");
        b.classList.add("fx-tw"); io.observe(b);
      });
      cleanups.push(function () { io.disconnect(); });
    }
  }

  function pageFrames() {}
  function pages() {}
  function toc(Q) {
    var nav = document.getElementById("toc-nav");
    if (!nav || !nav.firstChild) return;
    if (Q.slide) $$("a", nav).forEach(function (a) {        // stagger = position inside its own list (a section's sub-list starts again at 0)
      var li = a.closest("li");
      a.style.setProperty("--fx-i", Math.min(20, li && li.parentNode ? Array.prototype.indexOf.call(li.parentNode.children, li) : 0));
      a.classList.add("fx-tocin");
    });
    if (!Q.marker) return;
    nav.classList.add("fx-tocmk");
    var mk = node("span", "fx-toc-mk", nav), raf = 0;
    var place = function () {
      raf = 0;
      var a = nav.querySelector("a.active");
      if (a && !a.offsetParent) { var g = a.closest(".toc-group"); a = g ? g.querySelector(".toc-row a") : null; }   // active heading is inside a collapsed section
      if (!a || !a.offsetParent) { mk.style.opacity = 0; return; }
      var nr = nav.getBoundingClientRect(), ar = a.getBoundingClientRect();
      mk.style.opacity = 1; mk.style.top = (ar.top - nr.top) + "px"; mk.style.height = ar.height + "px";
    };
    var sched = function () { if (!raf) raf = requestAnimationFrame(place); };
    if (window.MutationObserver) {
      var mo = new MutationObserver(sched);
      mo.observe(nav, { subtree: true, attributes: true, attributeFilter: ["class"] });   // active heading / expanded section changed
      mo.observe(root, { attributes: true, attributeFilter: ["class"] });                // panel opened / closed
      cleanups.push(function () { mo.disconnect(); cancelAnimationFrame(raf); });
    }
    on(window, "resize", sched);
    sched();
  }

  function theme() {}
  function apply() {
    var c = conf();
    teardown();
    if (!style) { style = document.createElement("style"); style.id = "fx-style"; document.head.appendChild(style); }
    style.textContent = css(c);
    if (!document.body) return;
    var sig = JSON.stringify([c.fx_load, c.fx_text, c.fx_menu.slide, c.fx_pages]), replay = !first && sig !== lastSig.load;
    lastSig.load = sig;
    if (first || replay) pageLoad(c.fx_load, c.fx_pages, replay);
    root.classList.remove("fx-pre");
    reveal(c.fx_scroll); scrolling(c.fx_scroll); cards(c.fx_cards); text(c.fx_text, replay);
    cursor(c.fx_cursor); menu(c.fx_menu, replay); toc(c.fx_toc); code(c.fx_code); pages(c.fx_pages); theme(c.fx_theme);
    first = false;
  }

  window.SiteEffects = { apply: apply, defaults: DEF, retype: function () { startTyping(conf().fx_text); } };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply); else apply();
  document.addEventListener("site-appearance", function () { if (!first) apply(); });   // live preview in Site_Conf
})();
