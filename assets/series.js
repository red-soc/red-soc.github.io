(function () {
  var G = {
    series: {enabled: true, accent: "", radius: 12, border_width: 1, shadow: "none", font_size: 100, hover: "lift"},
    series_box: {box: "top", box_paragraph: 1, box_heading: 1, box_also_bottom: false, box_style: "card", box_width: "full",
      box_collapsed: false, box_show_label: true, box_label: "Series", box_numbers: true, box_number_style: "circle",
      box_progress: true, box_part_text: "Part", box_of_text: "of", box_dates: false, box_done: true, box_max_height: 0},
    series_prevnext: {prevnext: "series", prevnext_position: "bottom", prevnext_style: "cards", prevnext_titles: true,
      prevnext_mid: true, prevnext_stack: false, prev_label: "Previous", next_label: "Next"},
    series_related: {related: true, related_position: "end", related_title: "You may also like", related_title_align: "left",
      related_count: 3, related_auto: false, related_style: "cards", related_columns: "auto", related_date: true,
      related_excerpt: false, related_divider: false, related_hover: "", related_hover_color: "", related_hover_lift: 2, related_hover_duration: 200},
    series_sidebar: {"sidebar_link": false, "sidebar_playlist": false},
    series_hover: {hover_on: true, hover_pn: "highlight", hover_related: "highlight", hover_list: "highlight", hover_color: "",
      hover_lift: 2, hover_grow: 103, hover_duration: 200, hover_easing: "ease"},
    series_page: {page_intro: "", page_columns: "auto", page_images: true, page_image_height: 170, page_image_fit: "cover",
      page_default_art: true, page_default_image: "", page_desc: true, page_count: true, page_first_link: true,
      page_start_label: "Start reading", page_open_label: "Open", page_hero: true, page_hero_height: 220, page_style: "cards", page_dates: true,
      page_back: true, page_back_label: "All series", page_btn_style: "inherit", page_btn_shape: "inherit", page_btn_size: "inherit", page_btn_hover: "inherit", page_btn_layout: "spread", page_btn_icons: true, page_align: "rows", page_art_style: "inherit", page_art_bg: "inherit",
      page_art_deco: "inherit", page_art_color: "", page_art_text: true, page_art_default_text: "", page_art_default_sub: "",
      page_show_status: true, page_show_tags: true, page_show_date: true}
  };
  var first = true;
  function rgb(h) { var m = /^#?([0-9a-f]{6})$/i.exec(h || ""); if (!m) return ""; var n = parseInt(m[1], 16); return (n >> 16 & 255) + ", " + (n >> 8 & 255) + ", " + (n & 255); }
  function settings(app) {
    var s = {}, g, k, legacy = (app && app.series) || {};
    for (g in G) {
      var src = (app && app[g]) || {};
      for (k in G[g]) {
        var v = src[k];
        if (v === undefined || v === null) v = legacy[k];
        s[k] = v === undefined || v === null ? G[g][k] : v;
      }
    }
    return s;
  }

  function jsAttr(el, attr, val) {
    var flag = "data-js-" + attr.slice(5);
    if (el.hasAttribute(attr) && !el.hasAttribute(flag)) return;
    if (val === null || val === undefined || val === "" || val === "inherit") { el.removeAttribute(attr); el.removeAttribute(flag); }
    else { el.setAttribute(attr, val); el.setAttribute(flag, ""); }
  }
  function seriesArt(s) {
    var c = /^#[0-9a-f]{6}$/i.test(s.page_art_color || "") ? s.page_art_color : "";
    document.querySelectorAll(".sr-cards, .sr-page").forEach(function (g) {
      if (c) g.style.setProperty("--proj-art-c", c); else g.style.removeProperty("--proj-art-c");
    });
    document.querySelectorAll(".sr-cards .project-card, .sr-page .sr-hero").forEach(function (card) {
      jsAttr(card, "data-art", s.page_art_style);
      jsAttr(card, "data-artbg", s.page_art_bg);
      jsAttr(card, "data-artdeco", s.page_art_deco);
      jsAttr(card, "data-artlabel", s.page_art_text === false ? "off" : "on");
      jsAttr(card, "data-artdraw", s.page_default_art === false ? "off" : "on");
    });
  }

  function home(el) {
    if (!el.__srHome) { el.__srHome = document.createComment("sr-home"); el.parentNode.insertBefore(el.__srHome, el); }
    return el.__srHome;
  }
  function goHome(el) { var h = home(el); if (h.parentNode && h.nextSibling !== el) h.parentNode.insertBefore(el, h.nextSibling); }
  function before(el, ref) { home(el); if (ref && ref.parentNode && ref.previousSibling !== el) ref.parentNode.insertBefore(el, ref); }
  function after(el, ref) { home(el); if (ref && ref.parentNode && ref.nextSibling !== el) ref.parentNode.insertBefore(el, ref.nextSibling); }
  function kids(body, sel) {
    var out = [];
    for (var i = 0; i < body.children.length; i++) { var c = body.children[i]; if (!c.matches(".sr-box, .sr-pn, .sr-related") && (!sel || c.matches(sel))) out.push(c); }
    return out;
  }
  function placeBox(box, s, art) {
    var title = art.querySelector(".entry-title"), meta = art.querySelector(".entry-meta"), body = art.querySelector(".post-content"), where = s.box, list;
    if (where === "before_title" && title) return before(box, title);
    if (where === "after_title" && title) return after(box, title);
    if (where === "end") return art.appendChild(home(box) && box);
    if (body && where === "after_paragraph") { list = kids(body, "p"); if (list.length) return after(box, list[Math.min(list.length, +s.box_paragraph || 1) - 1]); }
    if (body && where === "before_heading") { list = kids(body, "h2, h3, h4"); if (list.length >= (+s.box_heading || 1)) return before(box, list[(+s.box_heading || 1) - 1]); }
    if (body && where === "middle") { list = kids(body); if (list.length > 1) return before(box, list[Math.floor(list.length / 2)]); }
    if (where === "top" && meta && !home(box).parentNode) return after(box, meta);
    goHome(box);
  }
  function placeAll(s) {
    document.querySelectorAll("article").forEach(function (art) {
      var top = art.querySelector('.sr-box[data-where="top"]');
      if (top) placeBox(top, s, art);
      var title = art.querySelector(".entry-title");
      var pnTop = art.querySelector('.sr-pn[data-where="top"]'), pnBot = art.querySelector('.sr-pn[data-where="bottom"]');
      if (pnTop) { if (s.prevnext_position === "before_title" && title) before(pnTop, title); else goHome(pnTop); }
      var rel = art.querySelector(".sr-related"), body = art.querySelector(".post-content");
      if (rel) {
        if (s.related_position === "before_prevnext" && pnBot) before(rel, pnBot);
        else if (s.related_position === "after_content" && body) after(rel, body);
        else goHome(rel);
      }
      if (pnBot) { if (s.prevnext_position === "end") art.appendChild(home(pnBot) && pnBot); else goHome(pnBot); }
      if (top && s.box === "before_title" && title) before(top, title);
    });
  }

  function apply(app) {
    var s = settings(app);
    var r = document.documentElement, on = function (v) { return v ? "on" : "off"; };
    var boxMode = s.box === "off" ? "off" : s.box === "bottom" ? "bottom" : "top";
    var pnMode = {before_title: "top", top: "top", bottom: "bottom", end: "bottom", both: "both"}[s.prevnext_position] || "bottom";
    var at = {"data-series": on(s.enabled), "data-sr-prevnext": s.prevnext, "data-sr-pnstyle": s.prevnext_style,
      "data-sr-pnpos": pnMode, "data-sr-pntitles": on(s.prevnext_titles), "data-sr-pnmid": on(s.prevnext_mid), "data-sr-pnstack": on(s.prevnext_stack),
      "data-sr-box": boxMode, "data-sr-boxalso": on(s.box_also_bottom), "data-sr-boxstyle": s.box_style, "data-sr-boxwidth": s.box_width,
      "data-sr-boxlabel": on(s.box_show_label), "data-sr-numbers": on(s.box_numbers), "data-sr-numstyle": s.box_number_style,
      "data-sr-progress": on(s.box_progress), "data-sr-boxdates": on(s.box_dates), "data-sr-boxdone": on(s.box_done),
      "data-sr-related": on(s.related), "data-sr-relstyle": s.related_style, "data-sr-relcols": s.related_columns,
      "data-sr-reldate": on(s.related_date), "data-sr-relexcerpt": on(s.related_excerpt), "data-sr-relalign": s.related_title_align,
      "data-sr-reldivider": on(s.related_divider), "data-sr-sblink": on(s.sidebar_link),
      "data-sr-sbplaylist": on(s.sidebar_playlist), "data-sr-sbstyle": s.sidebar_style, "data-sr-sbcount": on(s.sidebar_count),
      "data-sr-pagestyle": s.page_style, "data-sr-btn": s.page_btn_style, "data-sr-btnsize": s.page_btn_size, "data-sr-btnshape": s.page_btn_shape, "data-sr-btnhover": s.page_btn_hover, "data-sr-btnlayout": s.page_btn_layout, "data-sr-btnicons": on(s.page_btn_icons), "data-sr-pagecount": on(s.page_count), "data-sr-pagedesc": on(s.page_desc),
      "data-sr-pagedates": on(s.page_dates), "data-sr-pagefirst": on(s.page_first_link), "data-sr-pageback": on(s.page_back),
      "data-sr-pagehero": on(s.page_hero), "data-sr-pageimages": on(s.page_images),
      "data-srp-align": s.page_align === "top" ? "top" : "rows", "data-srp-status": on(s.page_show_status), "data-srp-tags": on(s.page_show_tags), "data-srp-date": on(s.page_show_date),
      "data-sr-shadow": s.shadow, "data-sr-hover": s.hover};
    for (var k in at) r.setAttribute(k, at[k]);
    var hon = s.hover_on !== false, NEW = {highlight: 1, underline: 1, slide: 1, bar: 1, none: 1}, hin = function (v) { return !hon ? s.hover : (NEW[v] ? v : "highlight"); };
    r.setAttribute("data-srh-pn", hin(s.hover_pn)); // Related articles is its own feature: its hover comes from series_related (older configs: series_hover > hover_related)
    r.setAttribute("data-srh-rel", s.related_hover ? (NEW[s.related_hover] ? s.related_hover : "highlight") : hin(s.hover_related));
    var hl = s.hover_list === "accent" ? "highlight" : s.hover_list;
    r.setAttribute("data-srh-list", hon ? (hl || "highlight") : "highlight");
    var hc = hon && rgb(s.hover_color) ? s.hover_color : "";
    if (hc) { r.style.setProperty("--srh-c", hc); r.style.setProperty("--srh-c-rgb", rgb(hc)); }
    else { r.style.removeProperty("--srh-c"); r.style.removeProperty("--srh-c-rgb"); }
    var EZ = {"ease": "ease", "ease-out": "cubic-bezier(.22,1,.36,1)", "ease-in-out": "ease-in-out", "linear": "linear", "spring": "cubic-bezier(.34,1.56,.64,1)"};
    r.style.setProperty("--srh-lift", "-" + Math.max(0, +s.hover_lift || 2) + "px");
    r.style.setProperty("--srh-grow", (+s.hover_grow || 103) / 100);
    r.style.setProperty("--srh-dur", (+s.hover_duration || 200) + "ms");
    r.style.setProperty("--srh-ease", EZ[s.hover_easing] || "ease");
    if (s.accent && rgb(s.accent)) { r.style.setProperty("--sr-accent", s.accent); r.style.setProperty("--sr-accent-rgb", rgb(s.accent)); }
    else { r.style.removeProperty("--sr-accent"); r.style.removeProperty("--sr-accent-rgb"); }
    r.style.setProperty("--sr-radius", (+s.radius || 0) + "px");
    r.style.setProperty("--sr-bw", (+s.border_width || 0) + "px");
    r.style.setProperty("--sr-fs", (+s.font_size || 100) / 100);
    r.style.setProperty("--sr-box-maxh", +s.box_max_height > 0 ? s.box_max_height + "px" : "none");
    r.style.setProperty("--sr-sb-maxh", (+s.sidebar_max_height || 360) + "px");
    r.style.setProperty("--sr-hero-h", (+s.page_hero_height || 220) + "px");
    if (!document.body) return;
    var texts = {prev: s.prev_label, next: s.next_label, box: s.box_label, related: s.related_title, sidebar: s.sidebar_label,
      part: s.box_part_text, of: s.box_of_text, start: s.page_start_label, open: s.page_open_label, back: s.page_back_label, intro: s.page_intro};
    document.querySelectorAll("[data-sr-text]").forEach(function (el) { var t = texts[el.getAttribute("data-sr-text")]; if (t != null && el.textContent !== t) el.textContent = t; });
    document.querySelectorAll(".sr-related").forEach(function (sec) {
      var n = 0, max = Math.max(1, +s.related_count || 3);
      sec.querySelectorAll(".sr-rel").forEach(function (a) {
        var ok = (a.getAttribute("data-kind") !== "auto" || s.related_auto) && n < max;
        a.hidden = !ok; if (ok) n++;
      });
      sec.hidden = n === 0;
      var rc = s.related_hover ? rgb(s.related_hover_color) : "";
      if (rc) { sec.style.setProperty("--srh-c", s.related_hover_color); sec.style.setProperty("--srh-c-rgb", rc); }
      else { sec.style.removeProperty("--srh-c"); sec.style.removeProperty("--srh-c-rgb"); }
      if (s.related_hover) { sec.style.setProperty("--srh-lift", "-" + Math.max(0, +s.related_hover_lift || 2) + "px"); sec.style.setProperty("--srh-dur", (+s.related_hover_duration || 200) + "ms"); }
      else { sec.style.removeProperty("--srh-lift"); sec.style.removeProperty("--srh-dur"); }
    });
    seriesArt(s);
    placeAll(s);
    if (first || window.SITE_PREVIEW) {
      document.querySelectorAll(".sr-box").forEach(function (b) { b.open = !s.box_collapsed; });
      document.querySelectorAll(".sb-series-pl").forEach(function (b) { b.open = !!s.sidebar_open; });
    }
    first = false;
  }
  window.SiteSeries = {apply: apply, settings: settings};
  apply(window.SITE_APPEARANCE);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { first = true; apply(window.SITE_APPEARANCE); });
  else { first = true; apply(window.SITE_APPEARANCE); }
})();
