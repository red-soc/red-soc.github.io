/* Blog template — sidebar toggle + post table of contents */
(function () {
  "use strict";

  var root = document.documentElement;
  var PREVIEW = !!window.SITE_PREVIEW;                 // inside the configurator: nothing is remembered, and the page reports what it is doing
  var wide = window.matchMedia("(min-width: 1280px)"); // TOC sits beside the post at this width

  function save(key, value) {
    if (PREVIEW) return;                               // the live preview must never touch a visitor's saved choices
    try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ }
  }

  /* ---------------- left sidebar: show / hide ---------------- */
  var sbBtn = document.getElementById("sidebar-toggle");

  function syncSidebarBtn() {
    if (!sbBtn) return;
    var hidden = root.classList.contains("sidebar-hidden");
    var label = hidden ? "Show sidebar" : "Hide sidebar";
    sbBtn.setAttribute("aria-expanded", String(!hidden));
    sbBtn.setAttribute("aria-label", label);
    sbBtn.title = label;
  }

  // the one place that hides / shows the sidebar (button, Ctrl+B, edge click, edge drag, hover-open all end up here)
  function setSidebar(hide, remember, dismissed) {
    clearTimeout(peekT); clearTimeout(closeT);
    if (glideFinish) glideFinish(true);
    root.classList.toggle("sidebar-hidden", hide);
    root.classList.toggle("sidebar-dismissed", !!hide && !!dismissed);
    root.classList.remove("sidebar-peek");              // a click always wins over a hover peek
    if (remember !== false) {
      save("sidebar-hidden", hide ? "1" : "0");
      save("sidebar-dismissed", hide && dismissed ? "1" : "0");
    }
    syncSidebarBtn();
    announce();
  }

  if (sbBtn) {
    syncSidebarBtn();
    sbBtn.addEventListener("click", function () { setSidebar(!root.classList.contains("sidebar-hidden")); });
  }

  /* icon rail + rail_avatar_toggle: the avatar in the rail does what the hide / show button does (opens the sidebar).
     Only while the rail is what you see - with the sidebar open the avatar is the normal link to the home page. */
  var railAv = document.querySelector(".brand-logo-link");
  if (railAv) {
    railAv.addEventListener("keydown", function (e) {
      if (root.getAttribute("data-sb-avtoggle") === "on" && (e.key === " " || e.key === "Spacebar")) { e.preventDefault(); railAv.click(); }
    });
    railAv.addEventListener("click", function (e) {
      if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;     // let "open in new tab" through
      if (!window.matchMedia("(min-width: 921px)").matches) return;                  // phones: the sidebar is a header, keep the home link
      var hidden = root.classList.contains("sidebar-hidden"), peek = root.classList.contains("sidebar-peek");
      if (root.getAttribute("data-sb-avtoggle") === "on") {        // avatar_toggle: the avatar IS the hide / show button, everywhere
        e.preventDefault();
        setSidebar(peek ? false : !hidden);                         // a peek is made permanent, otherwise toggle
        return;
      }
      if (root.getAttribute("data-sb-railavtoggle") !== "on" || root.getAttribute("data-sb-hidden") !== "rail") return;
      if (!hidden || peek) return;
      e.preventDefault();
      setSidebar(false);
    });
  }

  /* ---------------- left sidebar: hidden-state handle, open on hover, button only on hover ----------------
     appearance.sidebar in _config.yml:  hidden_style (rail / strip / tab / avatar), hover_open (off / peek / open),
     hover_delay, toggle_reveal (always / hover).  theme.js sets the data-sb-* attributes this reads. */
  var sidebarEl = document.getElementById("sidebar");
  var hot = document.getElementById("sb-hot");
  var desk = window.matchMedia("(min-width: 921px)");
  var overSb = false, overHot = false, overBtn = false;
  var simOver = false;                                  // configurator only: the "Mouse: on the sidebar" switch
  var dragging = false;                                 // an edge / handle drag is in progress: no hover peek meanwhile
  var nearT = 0, peekT = 0, closeT = 0;

  function isHidden() { return root.classList.contains("sidebar-hidden"); }
  function peeking() { return root.classList.contains("sidebar-peek"); }
  function isOver() { return overSb || overHot || overBtn || simOver; }
  function endPeek() { clearTimeout(peekT); clearTimeout(closeT); root.classList.remove("sidebar-peek"); announce(); }

  // configurator preview: tell the page around us what just happened (hidden / peeking / mouse over) so its switches stay truthful
  function announce() {
    if (!PREVIEW) return;
    try {
      document.dispatchEvent(new CustomEvent("site-sidebar", { detail: { hidden: isHidden(), peek: peeking(), over: isOver() } }));
    } catch (e) { /* old browser */ }
  }

  function evalHover() {
    var over = isOver();
    // the hide / show button: only visible while the mouse is on the sidebar or its handle
    if (root.getAttribute("data-sb-treveal") === "hover") {
      clearTimeout(nearT);
      if (over) root.classList.add("sb-near");
      else nearT = setTimeout(function () { root.classList.remove("sb-near"); }, 350);
    }
    if (dragging) return;
    // open the hidden sidebar when the mouse touches the left edge
    var mode = root.getAttribute("data-sb-hover") || "off";
    if (mode === "off" || !desk.matches || !isHidden()) { if (peeking()) endPeek(); return; }
    if (over) {
      clearTimeout(closeT);
      if (peeking()) return;
      clearTimeout(peekT);
      var delay = parseInt(root.getAttribute("data-sb-hover-delay"), 10);
      peekT = setTimeout(function () {
        if (!isHidden()) return;
        if (mode === "open") {                  // behaves like a click: stays open
          setSidebar(false);
        } else {
          root.classList.add("sidebar-peek");   // slides over the page, closes when the mouse leaves
          announce();
        }
      }, isNaN(delay) ? 150 : delay);
    } else {
      clearTimeout(peekT);
      if (peeking()) { clearTimeout(closeT); closeT = setTimeout(function () { if (!isOver()) endPeek(); }, 260); }
    }
  }
  function hoverChanged() { evalHover(); announce(); }
  function track(el, set) {
    if (!el) return;
    el.addEventListener("pointerenter", function (e) { if (e.pointerType === "touch") return; set(true); hoverChanged(); });
    el.addEventListener("pointerleave", function (e) { if (e.pointerType === "touch") return; set(false); hoverChanged(); });
  }
  track(sidebarEl, function (v) { overSb = v; });
  track(hot, function (v) { overHot = v; });
  track(sbBtn, function (v) { overBtn = v; });

  /* ---------------- mouse gestures: shared helpers ----------------
     While the button is down the sidebar simply follows the pointer (no animation = no lag). When the button is
     released the drag classes / variables are removed in the same moment the final state is set, so the normal CSS
     transitions (style.css: --sb-dur / --sb-ease) carry it on from exactly where it was: no jump, no snap. */
  function velocity(samples, now) {                     // px per ms over the last ~100 ms of the gesture (negative = leftwards)
    var i = samples.length - 1, last = samples[i];
    if (!last || now - last.t > 100) return 0;          // the pointer rested before letting go: not a flick
    while (i > 0 && last.t - samples[i - 1].t <= 100) i--;
    var dt = last.t - samples[i].t;
    return dt > 0 ? (last.x - samples[i].x) / dt : 0;
  }
  function pushSample(samples, ev) {
    samples.push({ x: ev.clientX, t: ev.timeStamp });
    if (samples.length > 10) samples.shift();
  }
  function endDragVars() {
    root.classList.remove("sb-drag", "sb-drag-hide", "sb-reveal", "sb-glide");
    root.style.removeProperty("--sb-p");
    root.style.removeProperty("--sb-edge");
    root.style.removeProperty("--sb-shift");
  }

  /* icon rail: after the mouse is released the sidebar keeps its full layout (only clipped) and glides to the
     rail width (or back open), the labels fading on the way; the real state is set when it arrives */
  var glideFinish = null;
  function railGlide(edgePx, p, done) {
    var from = parseFloat(root.style.getPropertyValue("--sb-edge"));
    if (isNaN(from)) from = curW();
    var distance = Math.abs(edgePx - from);
    var duration = Math.min(slideMs(), Math.max(60, slideMs() * distance / Math.max(1, curW() - railW())));
    var timer = 0, raf = 0;
    dragging = true;                         // hover-open must not fight the release animation
    clearTimeout(peekT); clearTimeout(closeT);
    root.style.setProperty("--sb-settle-dur", duration + "ms");
    root.classList.remove("sb-drag-hide");
    if (sidebarEl) sidebarEl.getBoundingClientRect();  // commit the final pointer position first
    root.classList.add("sb-glide");
    var finish = function (interrupted) {
      if (glideFinish !== finish) return;
      glideFinish = null;
      clearTimeout(timer); cancelAnimationFrame(raf);
      endDragVars();
      root.style.removeProperty("--sb-settle-dur");
      dragging = false;
      if (!interrupted) done();
    };
    glideFinish = finish;
    if (distance < 1) { finish(false); return; }
    raf = requestAnimationFrame(function () {
      root.style.setProperty("--sb-edge", edgePx + "px");
      root.style.setProperty("--sb-shift", (edgePx - curW()) + "px");
      root.style.setProperty("--sb-p", String(p));
      timer = setTimeout(function () { finish(false); }, duration + 30);
    });
  }

  /* drag the hidden-state handle to the right: the sidebar is pulled out from the edge and follows the pointer;
     let go past a third of its width (or flick right) and it stays open, otherwise it slides back */
  if (hot && sbBtn) {
    var swallow = false;                                // a drag also ends in a click on the handle: ignore that one
    hot.addEventListener("click", function () { if (swallow) { swallow = false; return; } sbBtn.click(); });
    hot.addEventListener("pointerdown", function (e) {
      var m = root.getAttribute("data-sb-edgehide");
      if (e.button !== 0 || !(m === "drag" || m === "both") || !desk.matches) return;
      var x0 = e.clientX, w = curW(), edge = 0, moved = false, raf = 0, samples = [{ x: e.clientX, t: e.timeStamp }];
      function paint() { raf = 0; root.style.setProperty("--sb-edge", edge + "px"); }
      function mv(ev) {
        var dx = ev.clientX - x0;
        if (!moved) {
          if (dx < 4) return;                           // not a drag yet (or dragging the wrong way)
          moved = true; dragging = true;
          clearTimeout(peekT);
          root.classList.add("sb-drag", "sb-reveal");
        }
        edge = Math.max(0, Math.min(w, dx));
        pushSample(samples, ev);
        if (!raf) raf = requestAnimationFrame(paint);
      }
      function end(ev) {
        window.removeEventListener("pointermove", mv);
        window.removeEventListener("pointerup", end);
        window.removeEventListener("pointercancel", end);
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
        if (!moved) return;                             // a plain press: the click handler does the rest
        swallow = true; setTimeout(function () { swallow = false; }, 80);
        var open = ev.type !== "pointercancel" && (edge > w * 0.35 || (velocity(samples, ev.timeStamp) > 0.45 && edge > 8));
        dragging = false;
        endDragVars();
        if (open) setSidebar(false);                    // stays open
        else hoverChanged();                            // slides back to the edge
      }
      window.addEventListener("pointermove", mv);
      window.addEventListener("pointerup", end);
      window.addEventListener("pointercancel", end);
    });
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && peeking()) endPeek(); });
  if (desk.addEventListener) desk.addEventListener("change", function () { endPeek(); hoverChanged(); });

  /* ---------------- left sidebar: drag the edge to resize / hide, Ctrl+B to hide / show ----------------
     Both are switched on / off from  appearance.sidebar  in _config.yml (theme.js sets data-sb-resize / data-sb-shortcut).
     A visitor's width is remembered in this browser only; double-click the edge to go back to your default.
     Dragging left: the sidebar narrows to its minimum width, and from there on slides away under the pointer
     (with the page following). Let go past 70 % of the way, or flick, and it hides; let go earlier and it springs back. */
  var rz = document.getElementById("side-resizer");
  var MIN_W = 200, MAX_W = 420;
  var HIDE_FRAC = 0.7;                                  // dragged past this share of its narrowest width = hide on release
  function clampW(n) { return Math.max(MIN_W, Math.min(MAX_W, Math.round(n))); }
  function curW() {
    var v = parseInt(getComputedStyle(root).getPropertyValue("--sidebar-w"), 10);
    return v || 280;
  }
  function defW() { return parseInt(root.getAttribute("data-sb-default"), 10) || 280; }
  function setW(w) {
    root.style.setProperty("--sidebar-w", w + "px");
    if (PREVIEW) window.SITE_PREVIEW_W = w;             // the configurator keeps a width you dragged while you tweak other settings
    if (rz) rz.setAttribute("aria-valuenow", String(w));
  }
  function edgeMode() { return root.getAttribute("data-sb-edgehide") || "off"; }
  function canDragHide() { var m = edgeMode(); return m === "drag" || m === "both"; }
  function canClickHide() { var m = edgeMode(); return m === "click" || m === "both"; }
  function canResize() { return root.getAttribute("data-sb-resizew") !== "off"; }
  function railMode() { return root.getAttribute("data-sb-hidden") === "rail"; }
  function railW() { return parseInt(getComputedStyle(root).getPropertyValue("--sb-rail-w"), 10) || 64; }
  function slideMs() {                                  // how long the CSS slide takes (--sb-dur in style.css)
    var v = getComputedStyle(root).getPropertyValue("--sb-dur").trim(), n = parseFloat(v);
    if (isNaN(n)) return 340;
    return /ms$/.test(v) ? n : n * 1000;
  }
  function rubber(d) { return 26 * (1 - Math.exp(-d / 80)); }   // a little elastic give when hiding by drag is not allowed
  if (rz) {
    rz.setAttribute("aria-valuemin", String(MIN_W));
    rz.setAttribute("aria-valuemax", String(MAX_W));
    rz.setAttribute("aria-valuenow", String(curW()));
    rz.addEventListener("pointerdown", function (e) {
      if (e.button !== 0 || !desk.matches || isHidden()) return;
      if (glideFinish) glideFinish(true);
      e.preventDefault();
      rz.setPointerCapture(e.pointerId);
      var startX = e.clientX, w0 = curW(), grab = startX - w0;        // grab = where on the edge it was picked up (no jump on the first move)
      var resize = canResize(), canHide = canDragHide(), rail = railMode();
      var floor = resize ? MIN_W : w0;
      var hideAt = floor * HIDE_FRAC;
      var w = w0, edge = w0, shift = 0, moved = false, hideIt = false, raf = 0;
      var samples = [{ x: startX, t: e.timeStamp }];
      function paint() {
        raf = 0;
        if (resize) setW(w);
        root.style.setProperty("--sb-edge", edge + "px");
        root.style.setProperty("--sb-shift", shift + "px");
        if (rail) root.style.setProperty("--sb-p", String(Math.max(0, Math.min(1, (w - edge) / Math.max(1, w - railW())))));
        root.classList.toggle("sb-drag-hide", hideIt);
      }
      function move(ev) {
        if (!moved) {
          if (Math.abs(ev.clientX - startX) <= 3) return;             // still just a click
          moved = true; dragging = true;
          clearTimeout(peekT);
          root.classList.add("sb-drag");
        }
        var x = ev.clientX - grab;                                    // where the sidebar's edge should be
        w = resize ? clampW(x) : w0;
        edge = w; shift = 0;
        if (x < floor) {                                              // pushed past its narrowest width
          if (canHide) {
            if (rail) { edge = Math.max(0, x); shift = edge - w; }                  // narrows toward the icon rail
            else { shift = Math.max(x - floor, -w); edge = w + shift; }                     // slides away with the pointer
          } else { shift = -rubber(floor - x); edge = w + shift; }                          // hiding by drag is off: only a small give
        }
        hideIt = canHide && x < hideAt;
        pushSample(samples, ev);
        if (!raf) raf = requestAnimationFrame(paint);
      }
      function up(ev) {
        rz.removeEventListener("pointermove", move);
        rz.removeEventListener("pointerup", up);
        rz.removeEventListener("pointercancel", up);
        rz.removeEventListener("lostpointercapture", up);
        try { rz.releasePointerCapture(ev.pointerId); } catch (err) { /* already released */ }
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
        if (moved) paint();                    // do not discard the last queued pointer position
        dragging = false;
        if (!moved) {                                                 // a click on the edge
          if (canClickHide() && ev.type === "pointerup") setSidebar(true);
          return;
        }
        var cancelled = ev.type !== "pointerup";
        var flick = canHide && shift < -6 && velocity(samples, ev.timeStamp) < -0.45;
        var hideNow = !cancelled && (hideIt || flick);
        if (cancelled) { endDragVars(); setW(w0); hoverChanged(); return; }
        if (rail && canHide && shift < 0) {                           // icon rail: glide the clipped sidebar the rest of the way, then swap in the rail
          railGlide(hideNow ? 0 : w, hideNow ? 1 : 0, function () {
            if (hideNow) {
              root.classList.add("sb-snap");                          // the rail appears at its width at once (no second narrowing)
              if (resize) setW(w0);          // restore width atomically: no delayed jump or stale timer
              setSidebar(true, true, true);
              requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.remove("sb-snap"); }); });
            } else {
              if (resize) { setW(w); save("sidebar-w", String(w)); }
              hoverChanged();
            }
          });
          return;
        }
        endDragVars();                                                // same task as the state change below: CSS animates from where the drag left it
        if (hideNow) {                                                // slides the rest of the way out
          setSidebar(true);
          if (resize && w !== w0) setTimeout(function () { if (isHidden()) setW(w0); }, slideMs() + 60);   // hiding is not resizing: it comes back at the width it had
          return;
        }
        if (resize) { setW(w); save("sidebar-w", String(w)); }        // else: springs back to its width
        hoverChanged();
      }
      rz.addEventListener("pointermove", move);
      rz.addEventListener("pointerup", up);
      rz.addEventListener("pointercancel", up);
      rz.addEventListener("lostpointercapture", up);
    });
    rz.addEventListener("dblclick", function () {
      if (!canResize() || canClickHide()) return;
      setW(defW());
      if (PREVIEW) window.SITE_PREVIEW_W = 0;
      else try { localStorage.removeItem("sidebar-w"); } catch (e) { /* storage unavailable */ }
    });
    rz.addEventListener("keydown", function (e) {
      if (!canResize()) return;
      var step = e.shiftKey ? 40 : 10, w = curW();
      if (e.key === "ArrowLeft") w = clampW(w - step);
      else if (e.key === "ArrowRight") w = clampW(w + step);
      else if (e.key === "Home") w = MIN_W;
      else if (e.key === "End") w = MAX_W;
      else return;
      e.preventDefault();
      setW(w);
      save("sidebar-w", String(w));
    });
  }
  document.addEventListener("keydown", function (e) {
    if (!sbBtn || root.getAttribute("data-sb-shortcut") === "off") return;
    if (!(e.ctrlKey || e.metaKey) || e.shiftKey || e.altKey || String(e.key).toLowerCase() !== "b") return;
    var t = e.target, tag = t && t.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (t && t.isContentEditable)) return;
    e.preventDefault();
    sbBtn.click();
  });

  /* ---------------- configurator preview hooks ----------------
     tools/_Apps/Site_Conf/Site_Conf.html drives the sidebar of its live preview through this (the preview is the real page behaviour,
     not a picture): the Shown / Hidden and Mouse switches call it, and it reports back through "site-sidebar" events. */
  if (PREVIEW) {
    window.SiteSidebar = {
      setHidden: function (hide) { hide = !!hide; if (hide !== isHidden()) setSidebar(hide, false); },
      hover: function (on) { simOver = !!on; hoverChanged(); },
      state: function () { return { hidden: isHidden(), peek: peeking(), over: isOver() }; }
    };
    // every settings change: re-judge the hover rules (e.g. "open on hover" just switched on while the mouse is "on the sidebar")
    document.addEventListener("site-appearance", function () { hoverChanged(); });
  }

  /* ---------------- right side: post contents ---------------- */
  var panel = document.getElementById("toc-panel");
  var tocBtn = document.getElementById("toc-toggle");
  var nav = document.getElementById("toc-nav");
  var backdrop = document.getElementById("toc-backdrop");
  var content = document.querySelector(".post-content");
  if (!panel || !tocBtn || !nav || !content) return;

  var headings = Array.prototype.slice.call(content.querySelectorAll("h2, h3"));
  if (headings.length < 2) {            // nothing worth a table of contents
    root.classList.remove("toc-open");
    panel.parentNode.removeChild(panel);
    tocBtn.parentNode.removeChild(tocBtn);
    if (backdrop) backdrop.parentNode.removeChild(backdrop);
    return;
  }

  // make sure every heading has a unique id to link to
  var used = {};
  Array.prototype.forEach.call(document.querySelectorAll("[id]"), function (el) { used[el.id] = true; });
  function slug(text) {
    return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-") || "section";
  }

  var links = [];            // one <a> per heading, in document order
  var groupOf = [];          // parallel to links: the h2 group <li> a link belongs to (or null)
  var collapsible = [];      // groups that have sub-headings and therefore a caret
  var list = document.createElement("ul");
  var group = null, groupRow = null, sub = null, uid = 0;
  var caretSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';

  // expand / collapse one group
  function setGroup(li, open) {
    li.classList.toggle("collapsed", !open);
    var btn = li.querySelector(".toc-caret");
    var title = li.querySelector(".toc-row a").textContent;
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", (open ? "Collapse " : "Expand ") + title);
    btn.title = (open ? "Collapse" : "Expand") + " section";
  }

  headings.forEach(function (h) {
    if (!h.id) {
      var base = slug(h.textContent), id = base, n = 1;
      while (used[id]) id = base + "-" + (++n);
      h.id = id;
      used[id] = true;
    }
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = "#" + h.id;
    a.textContent = h.textContent;
    a.title = h.textContent;

    if (h.tagName === "H2") {
      group = li; sub = null;
      groupRow = document.createElement("div");
      groupRow.className = "toc-row";
      groupRow.appendChild(a);
      li.appendChild(groupRow);
      groupOf.push(li);
    } else {                                   // H3
      a.className = "toc-h3";
      li.appendChild(a);
      if (group) {
        if (!sub) {                            // first child: turn the h2 into a collapsible group
          sub = document.createElement("ul");
          sub.className = "toc-sub";
          sub.id = "toc-sub-" + (++uid);
          group.classList.add("toc-group", "collapsed");
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "toc-caret";
          btn.setAttribute("aria-controls", sub.id);
          btn.innerHTML = caretSvg;
          groupRow.insertBefore(btn, groupRow.firstChild);
          group.appendChild(sub);
          collapsible.push(group);
          setGroup(group, false);
          (function (g) {
            btn.addEventListener("click", function () { setGroup(g, g.classList.contains("collapsed")); });
          })(group);
        }
        sub.appendChild(li);
        groupOf.push(group);
        links.push(a);
        return;
      }
      groupOf.push(null);                      // h3 before any h2: plain top-level entry
    }
    if (h.tagName === "H2" || !group) list.appendChild(li);
    links.push(a);
  });
  nav.appendChild(list);
  panel.classList.add("ready");
  tocBtn.hidden = false;

  /* open / close */
  function syncTocBtn() {
    var open = root.classList.contains("toc-open");
    var label = open ? "Hide contents" : "Show contents";
    tocBtn.setAttribute("aria-expanded", String(open));
    tocBtn.setAttribute("aria-label", label);
    tocBtn.title = label;
  }

  function setToc(open, remember) {
    root.classList.toggle("toc-open", open);
    if (remember) save("toc-hidden", open ? "0" : "1");
    syncTocBtn();
    if (open) onScroll();
  }

  syncTocBtn();
  tocBtn.addEventListener("click", function () {
    setToc(!root.classList.contains("toc-open"), wide.matches); // only remember the desktop choice
  });

  // narrow screens: the panel is a drawer, so dismiss it on backdrop / Esc / link tap
  if (backdrop) backdrop.addEventListener("click", function () { setToc(false, false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !wide.matches && root.classList.contains("toc-open")) setToc(false, false);
  });
  nav.addEventListener("click", function (e) {
    if (!wide.matches && e.target.closest("a")) setToc(false, false);
  });

  // crossing the breakpoint: desktop honours the saved choice, mobile starts closed
  function onBreakpoint() {
    var hiddenByUser = false;
    try { hiddenByUser = localStorage.getItem("toc-hidden") === "1"; } catch (e) {}
    setToc(wide.matches && !hiddenByUser, false);
  }
  if (wide.addEventListener) wide.addEventListener("change", onBreakpoint);
  else if (wide.addListener) wide.addListener(onBreakpoint);
  if (!wide.matches) setToc(false, false);   // drawer never starts open

  /* scroll-spy: highlight the section being read */
  var current = -1, ticking = false, activeGroup = null;

  function onScroll() {
    ticking = false;
    var idx = -1;
    for (var i = 0; i < headings.length; i++) {
      if (headings[i].getBoundingClientRect().top <= 110) idx = i; else break;
    }
    if (window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 4) idx = headings.length - 1;
    if (idx === current) return;
    current = idx;
    links.forEach(function (a, i) { a.classList.toggle("active", i === idx); });

    // reading moved into another section: open it (a group the reader closed by hand stays closed while they stay in it)
    var g = idx >= 0 ? groupOf[idx] : null;
    if (g !== activeGroup) {
      // reading moved to another section (or back to the top): close every other open section,
      // including ones the reader opened by hand, then open the one being read
      collapsible.forEach(function (c) {
        if (c !== g && !c.classList.contains("collapsed")) setGroup(c, false);
      });
      if (g && g.classList.contains("collapsed")) setGroup(g, true);
      activeGroup = g;
    }
    // a closed group still shows which section you are in
    collapsible.forEach(function (c) { c.classList.toggle("has-active", c === g); });

    // keep the active entry visible inside the panel without moving the page
    if (idx >= 0 && panel.scrollHeight > panel.clientHeight) {
      var a = links[idx];
      if (!a.offsetParent && g) a = g.querySelector(".toc-row a");   // entry is hidden in a closed group
      var pr = panel.getBoundingClientRect(), ar = a.getBoundingClientRect();
      var top = ar.top - pr.top + panel.scrollTop, bottom = top + ar.height;
      if (top < panel.scrollTop + 40) panel.scrollTop = Math.max(0, top - 40);
      else if (bottom > panel.scrollTop + panel.clientHeight - 20) panel.scrollTop = bottom - panel.clientHeight + 20;
    }
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();
