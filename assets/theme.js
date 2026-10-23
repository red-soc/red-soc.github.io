/* Theme engine.
   - Visitors can only switch Light / Dark / System (remembered in their browser).
   - Everything else (accent, avatar, links, search highlight, buttons, theme button, fonts,
     layout, palette) comes from the `appearance:` block in _config.yml (window.SITE_APPEARANCE).
     Edit it by hand or run:  python tools/_Apps/Site_Conf/Site_Conf.py
   - The single theme button is built here (style: menu | toggle | cycle | switch).
   Loaded in <head> WITHOUT defer so the theme is applied before the first paint. */
(function () {
  "use strict";

  var root = document.documentElement;
  var MODES = ["light", "dark", "system"];
  var MODE_KEY = "theme-mode";

  // config key -> CSS variable (palette overrides, per theme)
  var COLOR_VARS = { bg: "--bg", sidebar: "--bg-sidebar", card: "--card", border: "--border", text: "--text", muted: "--text-muted" };
  var DEF_BG = { dark: "#1b1b1e", light: "#f4f4f7" };

  /* fonts: system stacks need nothing; entries with g: are loaded from Google Fonts only when chosen */
  var SYS_SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  var SYS_SERIF = 'Georgia, "Iowan Old Style", "Times New Roman", serif';
  var SYS_MONO = '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace';
  var FONTS = {
    "sans":           { s: SYS_SANS },
    "system-ui":      { s: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' },
    "rounded":        { s: 'ui-rounded, "SF Pro Rounded", "Hiragino Maru Gothic ProN", "Arial Rounded MT Bold", "Segoe UI", sans-serif' },
    "serif":          { s: SYS_SERIF },
    "mono":           { s: SYS_MONO },
    "consolas":       { s: 'Consolas, "Lucida Console", Menlo, Monaco, monospace' },
    "cascadia":       { s: '"Cascadia Code", "Cascadia Mono", Consolas, Menlo, monospace' },
    "inter":          { g: "Inter:wght@400;500;600;700", s: '"Inter", ' + SYS_SANS },
    "roboto":         { g: "Roboto:wght@400;500;700", s: '"Roboto", ' + SYS_SANS },
    "open-sans":      { g: "Open+Sans:wght@400;600;700", s: '"Open Sans", ' + SYS_SANS },
    "lato":           { g: "Lato:wght@400;700", s: '"Lato", ' + SYS_SANS },
    "poppins":        { g: "Poppins:wght@400;500;600;700", s: '"Poppins", ' + SYS_SANS },
    "nunito":         { g: "Nunito:wght@400;600;700", s: '"Nunito", ' + SYS_SANS },
    "ibm-plex-sans":  { g: "IBM+Plex+Sans:wght@400;500;600;700", s: '"IBM Plex Sans", ' + SYS_SANS },
    "source-sans-3":  { g: "Source+Sans+3:wght@400;600;700", s: '"Source Sans 3", ' + SYS_SANS },
    "merriweather":   { g: "Merriweather:wght@400;700", s: '"Merriweather", ' + SYS_SERIF },
    "lora":           { g: "Lora:wght@400;500;600;700", s: '"Lora", ' + SYS_SERIF },
    "source-serif-4": { g: "Source+Serif+4:wght@400;600;700", s: '"Source Serif 4", ' + SYS_SERIF },
    "playfair":       { g: "Playfair+Display:wght@400;600;700", s: '"Playfair Display", ' + SYS_SERIF },
    "jetbrains-mono": { g: "JetBrains+Mono:wght@400;500;700", s: '"JetBrains Mono", ' + SYS_MONO },
    "ibm-plex-mono":  { g: "IBM+Plex+Mono:wght@400;500;700", s: '"IBM Plex Mono", ' + SYS_MONO },
    "fira-code":      { g: "Fira+Code:wght@400;500;700", s: '"Fira Code", ' + SYS_MONO },
    "source-code-pro":{ g: "Source+Code+Pro:wght@400;500;700", s: '"Source Code Pro", ' + SYS_MONO },
    "roboto-mono":    { g: "Roboto+Mono:wght@400;500;700", s: '"Roboto Mono", ' + SYS_MONO },
    "space-mono":     { g: "Space+Mono:wght@400;700", s: '"Space Mono", ' + SYS_MONO }
  };
  var FONT_KEYS = Object.keys(FONTS);
  var CODE_THEMES = ["auto", "github", "monokai", "dracula", "nord", "solarized", "onedark", "none"];
  var fontLink = null;
  function loadFonts(keys) {
    var fam = [];
    keys.forEach(function (k) { var f = FONTS[k]; if (f && f.g && fam.indexOf(f.g) < 0) fam.push(f.g); });
    if (!fam.length) { if (fontLink) { fontLink.parentNode.removeChild(fontLink); fontLink = null; } return; }
    var href = "https://fonts.googleapis.com/css2?family=" + fam.join("&family=") + "&display=swap";
    if (fontLink && fontLink.getAttribute("href") === href) return;
    if (!fontLink) { fontLink = document.createElement("link"); fontLink.rel = "stylesheet"; document.head.appendChild(fontLink); }
    fontLink.setAttribute("href", href);
  }

  /* ---------------- colour maths ---------------- */
  function isHex(v) { return typeof v === "string" && /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v.trim()); }
  function normHex(v) {
    var h = v.trim().replace("#", "").toLowerCase();
    if (h.length === 3) h = h.replace(/(.)/g, "$1$1");
    return "#" + h;
  }
  function hexToRgb(hex) { var n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function rgbToHex(c) { return "#" + c.map(function (v) { return ("0" + Math.round(v).toString(16)).slice(-2); }).join(""); }
  function mix(a, b, t) {               // t = 0 -> a, t = 1 -> b
    var x = hexToRgb(a), y = hexToRgb(b);
    return rgbToHex([0, 1, 2].map(function (i) { return x[i] + (y[i] - x[i]) * t; }));
  }
  function luminance(c) {
    var a = c.map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }
  function contrast(a, b) {
    var l1 = luminance(a), l2 = luminance(b);
    if (l1 < l2) { var t = l1; l1 = l2; l2 = t; }
    return (l1 + 0.05) / (l2 + 0.05);
  }
  function rgbToHsl(c) {
    var r = c[0] / 255, g = c[1] / 255, b = c[2] / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, h = 0, s = 0;
    if (max !== min) {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
    }
    return [h, s, l];
  }
  function hslToRgb(c) {
    var h = c[0], s = c[1], l = c[2];
    if (s === 0) return [l * 255, l * 255, l * 255];
    function f(p, q, t) {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    return [f(p, q, h + 1 / 3) * 255, f(p, q, h) * 255, f(p, q, h - 1 / 3) * 255];
  }

  // Nudge the accent lighter (dark theme) / darker (light theme) only as far as needed
  // so link text stays readable. A colour that already passes is untouched.
  function readable(hex, bgHex, theme) {
    var rgb = hexToRgb(hex), bg = hexToRgb(bgHex);
    if (contrast(rgb, bg) >= 4.6) return hex;
    var hsl = rgbToHsl(rgb), step = theme === "light" ? -0.015 : 0.015;
    for (var i = 0; i < 70 && contrast(rgb, bg) < 4.6; i++) {
      hsl[2] = Math.min(1, Math.max(0, hsl[2] + step));
      rgb = hslToRgb(hsl);
    }
    return rgbToHex(rgb);
  }

  /* ---------------- site config (from _config.yml) ---------------- */
  var conf = {};
  function pick(v, list, d) { return list.indexOf(v) > -1 ? v : d; }
  function num(v, d, lo, hi) { v = parseFloat(v); return isNaN(v) ? d : Math.min(hi, Math.max(lo, v)); }
  function col(v) { return isHex(v) ? normHex(v) : ""; }
  function bool(v, d) { return v === undefined || v === null || v === "" ? d : (v !== false && v !== "false"); }

  function setConfig(c) {
    c = c || {};
    function grp(n) { return c[n] && typeof c[n] === "object" ? c[n] : {}; }
    var colors = { dark: {}, light: {} };
    ["dark", "light"].forEach(function (t) {
      var src = c.colors && c.colors[t] || {};
      Object.keys(COLOR_VARS).forEach(function (k) { if (isHex(src[k])) colors[t][k] = normHex(src[k]); });
    });
    var av = grp("avatar"), li = grp("links"), se = grp("search"), bu = grp("buttons"),
        tb = grp("theme_button"), tx = grp("text"), la = grp("layout"), sb = grp("sidebar"), co = grp("code"), tt = grp("to_top"),
        ar = grp("article"), ah = grp("archive"), tg = grp("taxonomy"), pg = grp("pagination"), pj = grp("projects");
    conf = {
      mode: MODES.indexOf(c.mode) > -1 ? c.mode : "dark",
      accent: isHex(c.accent) ? normHex(c.accent) : "#8ab4f8",
      auto: c.keep_text_readable !== false,
      colors: colors,
      avatar: { show: bool(av.show, true), size: num(av.size, 150, 60, 300), shape: pick(av.shape, ["circle", "rounded", "square"], "circle"),
                border: col(av.border_color), width: num(av.border_width, 3, 0, 12), bg: col(av.background) || "#000000" },
      links: { color: col(li.color), hover: col(li.hover_color), hl: col(li.highlight_bg), underline: pick(li.underline, ["hover", "always", "never"], "hover") },
      search: { bg: col(se.hit_bg), fg: col(se.hit_text), focus: col(se.focus_color) },
      buttons: { variant: pick(bu.variant, ["outline", "soft", "solid", "ghost", "gradient", "glow"], "outline"), shape: pick(bu.shape, ["auto", "pill", "rounded", "square"], "auto"),
                 size: pick(bu.size, ["small", "medium", "large", "xlarge"], "medium"), color: col(bu.color),
                 bw: num(bu.border_width, 1, 0, 4), shadow: pick(bu.shadow, ["none", "soft", "strong"], "none"), hover: pick(bu.hover, ["color", "lift", "grow", "glow"], "color") },
      tb: { show: tb.show === undefined ? bool(c.show_mode_buttons, true) : bool(tb.show, true),     // old option still works
            style: pick(tb.style, ["menu", "toggle", "cycle", "switch"], "menu"), position: pick(tb.position, ["bottom-left", "bottom-right"], "bottom-left"),
            hideWithSidebar: bool(tb.hide_with_sidebar, false) },
      text: { font: pick(tx.font, FONT_KEYS, "sans"), heading: pick(tx.heading_font, ["same"].concat(FONT_KEYS), "serif"), size: num(tx.font_size, 16, 13, 21),
              lh: num(tx.line_height, 172, 120, 220), selection: col(tx.selection) },
      code: { win: pick(co.window, ["mac", "windows", "terminal", "minimal", "none"], "mac"), theme: pick(co.highlight, CODE_THEMES, "auto"),
              bg: pick(co.background, ["site", "theme"], "site"), lang: bool(co.show_language, true),
              copy: pick(co.copy === false ? "off" : co.copy, ["icon", "label", "both", "off"], "icon"), dots: pick(co.dots, ["muted", "color"], "muted"),
              ln: bool(co.line_numbers, false), wrap: bool(co.wrap, false), italic: bool(co.italic_comments, true),
              font: pick(co.font, FONT_KEYS, "mono"), lig: bool(co.ligatures, false), size: num(co.font_size, 14, 11, 20), lh: num(co.line_height, 155, 110, 220),
              maxh: num(co.max_height, 0, 0, 1200), radius: num(co.radius, 10, 0, 24), shadow: bool(co.shadow, false) },
      top: { show: bool(tt.show, true), style: pick(tt.style, ["circle", "rounded", "square", "pill"], "circle"), icon: pick(tt.icon, ["chevron", "arrow", "double"], "chevron"),
             label: typeof tt.label === "string" && tt.label.trim() ? tt.label.trim().slice(0, 24) : "Top",
             pos: pick(tt.position, ["bottom-right", "bottom-left", "bottom-center"], "bottom-right"), after: num(tt.show_after, 400, 100, 3000),
             behavior: pick(tt.behavior, ["always", "scroll_up"], "always"), on: pick(tt.show_on, ["all", "posts"], "all"),
             progress: bool(tt.progress, false), smooth: bool(tt.smooth, true), x: num(tt.offset_x, 20, 8, 120), y: num(tt.offset_y, 24, 8, 160), color: col(tt.color) },
      article: { tStyle: pick(ar.table_style, ["grid", "striped", "lines", "minimal", "boxed"], "grid"),
                 tHead: pick(ar.table_header, ["subtle", "accent", "solid", "plain"], "subtle"),
                 tDensity: pick(ar.table_density, ["compact", "normal", "relaxed"], "normal"),
                 tSize: num(ar.table_font_size, 15, 12, 20), tAlign: pick(ar.table_align, ["left", "center"], "left"),
                 tFirst: bool(ar.table_first_bold, false), tHover: bool(ar.table_hover, false),
                 tScroll: bool(ar.table_scroll, true), tNowrap: bool(ar.table_nowrap, false), tRadius: num(ar.table_radius, 10, 0, 20),
                 h: pick(ar.heading_style, ["plain", "underline", "bar"], "plain"), hc: pick(ar.heading_color, ["default", "accent"], "default"),
                 code: pick(ar.inline_code, ["box", "pill", "accent", "plain"], "box"),
                 quote: pick(ar.blockquote, ["bar", "card", "accent", "minimal"], "bar"), list: pick(ar.list_marker, ["default", "accent"], "default"),
                 imgR: num(ar.image_radius, 0, 0, 24), imgB: bool(ar.image_border, false), imgS: bool(ar.image_shadow, false),
                 gap: num(ar.paragraph_gap, 100, 40, 220), justify: bool(ar.justify, false),
                 mDate: bool(ar.meta_date, true), mCats: bool(ar.meta_categories, true), mTags: bool(ar.meta_tags, true) },
      pager: { per: num(pg.per_page, 10, 1, 50), max: num(pg.max_pages, 7, 5, 15), edges: bool(pg.show_edges, true), arrows: bool(pg.show_arrows, true),
               info: bool(pg.show_info, false), align: pick(pg.align, ["left", "center", "right"], "center"), gap: num(pg.gap, 8, 0, 24),
               scroll: bool(pg.scroll_top, true) },
      archive: { row: pick(ah.row_style, ["lines", "cards", "zebra", "compact", "minimal", "bordered", "timeline"], "lines"),
                 dfmt: pick(ah.date_format, ["iso", "short", "long", "dmy"], "iso"), dpos: pick(ah.date_position, ["left", "right", "hidden"], "left"),
                 dfont: pick(ah.date_font, ["mono", "sans"], "mono"), years: bool(ah.group_by_year, false), cat: bool(ah.show_category, false),
                 size: num(ah.font_size, 17, 13, 26), pad: num(ah.row_padding, 15, 4, 32),
                 hover: pick(ah.hover, ["highlight", "underline", "slide", "bar", "none"], "highlight"),
                 radius: num(ah.row_radius, 0, 0, 24), dcolor: col(ah.date_color), tweight: pick(ah.title_weight, ["normal", "medium", "bold"], "normal"),
                 tcolor: col(ah.title_color), gap: num(ah.col_gap, 24, 6, 64), excerpt: bool(ah.show_excerpt, false), arrow: bool(ah.show_arrow, false),
                 catStyle: pick(ah.cat_style, ["pill", "outline", "soft", "text"], "pill"), yStyle: pick(ah.year_style, ["line", "plain", "bar", "pill"], "line"),
                 ySize: num(ah.year_size, 22, 16, 40), yCount: bool(ah.year_count, false) },
      tax: { tag: pick(tg.tag_style, ["box", "pill", "outline", "soft", "hash", "plain"], "box"), tagSize: pick(tg.tag_size, ["small", "medium", "large"], "medium"),
             tagColor: col(tg.tag_color), tagCount: bool(tg.tag_count, true), tagAlign: pick(tg.tag_align, ["left", "center"], "left"),
             cat: pick(tg.cat_style, ["card", "plain", "compact"], "card"), catIcon: bool(tg.cat_icon, true), catCount: bool(tg.cat_count, true),
             catColor: col(tg.cat_color), meta: pick(tg.meta_style, ["text", "underline", "pill", "outline", "chip"], "text"), metaColor: col(tg.meta_color) },
      proj: { artBg: pick(pj.art_bg, ["glow", "solid", "grid", "dots", "stripes", "none", "gradient", "aurora", "rings", "checker", "lines", "mesh", "split", "spotlight", "sunburst", "zigzag", "hatch", "blueprint", "fade", "off"], "glow"), art: pick(pj.art_style, ["auto", "circuit", "blocks", "waves", "hex", "code", "shield", "globe", "terminal", "bars", "network", "layers", "binary", "none"], "auto"), deco: pick(pj.art_deco, ["all", "rings", "dots", "crosses", "stars", "diamonds", "squares", "corners", "frame", "off"], "all"), defart: bool(pj.default_art, true), artText: bool(pj.art_text, true),
              color: col(pj.art_color), h: num(pj.image_height, 170, 80, 400), fit: pick(pj.image_fit, ["cover", "contain"], "cover"),
              status: bool(pj.show_status, true), tags: bool(pj.show_tags, true), date: bool(pj.show_date, true),
              datePos: pick(pj.date_position, ["top-right", "inline"], "top-right"), align: pick(pj.align, ["rows", "top"], "rows") },
      sidebar: { style: pick(sb.style, ["panel", "classic"], "panel"),
                 label: typeof sb.label === "string" ? sb.label.trim().slice(0, 24) : "",
                 align: pick(sb.align, ["center", "left", "right"], "center"), title: bool(sb.show_title, true), icons: bool(sb.show_icons, true),
                 headLayout: pick(sb.head_layout, ["stacked", "inline", "inline_right"], "stacked"), inlineAv: num(sb.inline_avatar_size, 52, 28, 100),
                 avAlign: pick(sb.avatar_align, ["auto", "left", "center", "right"], "auto"),
                 tiAlign: pick(sb.title_align, ["auto", "left", "center", "right"], "auto"),
                 tgAlign: pick(sb.tagline_align, ["auto", "left", "center", "right"], "auto"),
                 avPos: pick(sb.avatar_position, ["top", "bottom"], "top"),
                 tiPos: pick(sb.title_position, ["top", "bottom"], "top"),
                 tgPos: pick(sb.tagline_position, ["top", "bottom"], "top"),
                 iconSize: num(sb.icon_size, 18, 14, 26), iconGap: num(sb.icon_gap, 12, 6, 24), size: num(sb.font_size, 15, 12, 18),
                 upper: bool(sb.uppercase, false), boldActive: bool(sb.bold_active, true), pad: num(sb.item_padding, 9, 4, 18),
                 gap: num(sb.item_gap, 2, 0, 14), radius: num(sb.item_radius, 9, 0, 20),
                 active: pick(sb.active_style, ["fill", "accent", "bar", "outline"], "fill"), check: bool(sb.show_check, true),
                 color: col(sb.text_color), hoverBg: col(sb.hover_bg), activeBg: col(sb.active_bg), activeColor: col(sb.active_color),
                 divider: bool(sb.divider, true), resize: bool(sb.resizable, true),
                 toggle: pick(sb.toggle_style, ["panel", "burger", "chevron", "arrow", "dots", "menu_text", "none"], "panel"),
                 tLook: pick(sb.toggle_look, ["auto", "ghost", "outline", "soft", "solid", "glass"], "auto"),
                 tShape: pick(sb.toggle_shape, ["auto", "square", "rounded", "circle", "pill"], "auto"),
                 tSize: num(sb.toggle_size, 0, 0, 56),
                 tPos: pick(sb.toggle_position, ["edge", "inside", "edge_middle"], "edge"),
                 tReveal: pick(sb.toggle_reveal, ["always", "hover"], "always"),
                 hidden: pick(sb.hidden_style, ["none", "rail", "strip", "tab", "avatar"], "none"),
                 railW: num(sb.rail_width, 64, 48, 110), railAv: bool(sb.rail_avatar, true), railAvToggle: bool(sb.rail_avatar_toggle, false), avToggle: bool(sb.avatar_toggle, false), railTip: bool(sb.rail_tooltips, true), railToggle: pick(sb.rail_toggle, ["beside", "above"], "beside"),
                 hoverOpen: pick(sb.hover_open, ["off", "peek", "open"], "off"), hoverDelay: num(sb.hover_delay, 150, 0, 1200),
                 edgeHide: pick(sb.edge_hide, ["off", "drag", "click", "both"], "drag"),
                 fill: pick(sb.hidden_content, ["same", "wider", "full"], "wider"),
                 shortcut: bool(sb.toggle_shortcut, true) },
      layout: { side: num(la.sidebar_width, 280, 200, 380), content: num(la.content_width, 980, 640, 1400), radius: num(la.card_radius, 14, 0, 32), tagline: bool(la.show_tagline, true) }
    };
  }
  setConfig(window.SITE_APPEARANCE);

  /* ---------------- visitor choice: mode only ---------------- */
  var state = { mode: conf.mode };
  function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function write(key, val) { try { localStorage.setItem(key, val); } catch (e) { /* storage unavailable */ } }

  function loadMode() {
    var m = conf.tb.show ? read(MODE_KEY) : null;      // buttons hidden -> always the site default
    state.mode = MODES.indexOf(m) > -1 ? m : conf.mode;
  }

  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function resolved() {
    if (state.mode === "system") return mq && mq.matches ? "dark" : "light";
    return state.mode;
  }

  /* ---------------- apply to the page ---------------- */
  var applied = [], metaTheme = null;
  function apply() {
    var theme = resolved(), st = root.style;
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-mode", state.mode);

    // palette overrides from the config (cleared first so switching theme never leaks)
    applied.forEach(function (v) { st.removeProperty(v); });
    applied = [];
    function put(v, val) { st.setProperty(v, val); applied.push(v); }

    var o = conf.colors[theme], fg = theme === "dark" ? "#ffffff" : "#000000";
    var bg = o.bg || DEF_BG[theme];
    Object.keys(o).forEach(function (k) { put(COLOR_VARS[k], o[k]); });
    if (o.card) {
      put("--card-hover", mix(o.card, fg, 0.03));
      put("--pill", mix(o.card, fg, 0.07));
      put("--pill-active", mix(o.card, fg, 0.13));
    }
    if (o.border) {
      put("--border-soft", mix(o.border, bg, 0.45));
      put("--border-hover", mix(o.border, fg, 0.15));
    }
    if (o.text) { put("--text-title", o.text); put("--post-text", mix(o.text, bg, 0.12)); }
    if (o.muted) put("--text-faint", mix(o.muted, bg, 0.25));

    // accent
    var rgb = hexToRgb(conf.accent);
    var textBg = mix(o.card || (theme === "dark" ? "#232327" : "#ffffff"), fg, 0.08);
    var accText = conf.auto ? readable(conf.accent, textBg, theme) : conf.accent;
    function rgbOf(h) { return hexToRgb(h).join(", "); }
    function onColor(h) { var c = hexToRgb(h); return contrast(c, [255, 255, 255]) >= contrast(c, [17, 17, 20]) ? "#ffffff" : "#111114"; }
    function textOn(h) { return conf.auto ? readable(h, textBg, theme) : h; }
    st.setProperty("--accent", conf.accent);
    st.setProperty("--accent-rgb", rgb.join(", "));
    st.setProperty("--accent-text", accText);
    st.setProperty("--on-accent", onColor(conf.accent));

    // avatar
    var av = conf.avatar;
    put("--avatar-display", av.show ? "block" : "none");
    put("--avatar-size", av.size + "px");
    put("--avatar-radius", av.shape === "circle" ? "50%" : av.shape === "rounded" ? "22%" : "6px");
    put("--avatar-border-w", av.width + "px");
    put("--avatar-bg", av.bg);
    if (av.border) put("--avatar-border-color", av.border);

    // links + highlight
    var li = conf.links;
    if (li.color) put("--link", textOn(li.color));
    if (li.hover) put("--link-hover", textOn(li.hover));
    if (li.hl) {
      put("--link-hl-bg", "rgba(" + rgbOf(li.hl) + ", 0.2)");
      put("--link-hl-bd", "rgba(" + rgbOf(li.hl) + ", 0.65)");
      put("--link-hl", li.hover ? textOn(li.hover) : textOn(li.hl));
    } else if (li.hover) put("--link-hl", textOn(li.hover));
    put("--link-deco", li.underline === "always" ? "underline" : "none");
    put("--link-deco-hover", li.underline === "never" ? "none" : "underline");

    // search
    var se = conf.search;
    if (se.bg) { put("--mark-bg", se.bg); put("--mark-fg", se.fg || onColor(se.bg)); }
    else if (se.fg) put("--mark-fg", se.fg);
    if (se.focus) { put("--focus", se.focus); put("--focus-rgb", rgbOf(se.focus)); }

    // buttons
    var bu = conf.buttons;
    put("--btn-scale", { small: "0.85", medium: "1", large: "1.2", xlarge: "1.4" }[bu.size]);
    if (bu.shape !== "auto") put("--btn-radius", { pill: "999px", rounded: "10px", square: "3px" }[bu.shape]);
    var bc = bu.color || conf.accent;
    if (bu.color) { put("--btn", bc); put("--btn-rgb", rgbOf(bc)); put("--btn-text", textOn(bc)); put("--on-btn", onColor(bc)); }
    put("--btn-2", mix(bc, "#ffffff", 0.38));
    put("--btn-bw", bu.bw + "px");
    root.setAttribute("data-btn-variant", bu.variant);
    root.setAttribute("data-btn-shadow", bu.shadow);
    root.setAttribute("data-btn-hover", bu.hover);

    // back-to-top button
    var tp = conf.top;
    put("--tt-x", tp.x + "px");
    put("--tt-y", tp.y + "px");
    if (tp.color) { put("--tt", tp.color); put("--tt-rgb", rgbOf(tp.color)); put("--tt-text", textOn(tp.color)); put("--on-tt", onColor(tp.color)); }
    else { put("--tt", "var(--btn)"); put("--tt-rgb", "var(--btn-rgb)"); put("--tt-text", "var(--btn-text)"); put("--on-tt", "var(--on-btn)"); }
    var tbSide = conf.tb.position === "bottom-left" ? "bottom-left" : "bottom-right";
    var lift = conf.tb.show && tp.show && tp.pos === tbSide ? "calc(40px * var(--btn-scale) + 12px)" : "0px";
    put("--tt-lift", lift);
    root.setAttribute("data-totop", tp.show ? "on" : "off");

    // text + fonts
    var tx = conf.text, cd = conf.code;
    var bodyF = FONTS[tx.font], headF = tx.heading === "same" ? bodyF : FONTS[tx.heading], codeF = FONTS[cd.font];
    put("--sans", bodyF.s);
    put("--serif", headF.s);
    put("--mono", codeF.s);
    loadFonts([tx.font, tx.heading === "same" ? tx.font : tx.heading, cd.font]);
    put("--base-size", tx.size + "px");
    put("--post-lh", String(tx.lh / 100));
    if (tx.selection) put("--selection-rgb", rgbOf(tx.selection));

    // code blocks
    root.setAttribute("data-code-win", cd.win);
    root.setAttribute("data-code-theme", cd.theme);
    root.setAttribute("data-code-bg", cd.bg);
    root.setAttribute("data-code-lang", cd.lang ? "on" : "off");
    root.setAttribute("data-code-copy", cd.copy);
    root.setAttribute("data-code-dots", cd.dots);
    root.setAttribute("data-code-wrap", cd.wrap ? "on" : "off");
    root.setAttribute("data-code-italic", cd.italic ? "on" : "off");
    root.setAttribute("data-code-ln", cd.ln ? "on" : "off");
    root.setAttribute("data-code-lig", cd.lig ? "on" : "off");
    put("--cw-size", cd.size + "px");
    put("--cw-lh", String(cd.lh / 100));
    put("--cw-maxh", cd.maxh ? cd.maxh + "px" : "none");
    put("--cw-radius", cd.radius + "px");
    put("--cw-shadow", cd.shadow ? "0 8px 24px var(--shadow)" : "none");

    // article: tables, headings, quotes, images
    var ar = conf.article;
    root.setAttribute("data-tbl-style", ar.tStyle);
    root.setAttribute("data-tbl-head", ar.tHead);
    root.setAttribute("data-tbl-density", ar.tDensity);
    root.setAttribute("data-tbl-align", ar.tAlign);
    root.setAttribute("data-tbl-first", ar.tFirst ? "bold" : "normal");
    root.setAttribute("data-tbl-hover", ar.tHover ? "on" : "off");
    root.setAttribute("data-tbl-scroll", ar.tScroll ? "on" : "off");
    root.setAttribute("data-tbl-nowrap", ar.tNowrap ? "on" : "off");
    put("--tbl-size", ar.tSize + "px");
    put("--tbl-radius", ar.tRadius + "px");
    root.setAttribute("data-art-h", ar.h);
    root.setAttribute("data-art-hc", ar.hc);
    root.setAttribute("data-art-code", ar.code);
    root.setAttribute("data-art-quote", ar.quote);
    root.setAttribute("data-art-list", ar.list);
    root.setAttribute("data-art-justify", ar.justify ? "on" : "off");
    root.setAttribute("data-img-border", ar.imgB ? "on" : "off");
    root.setAttribute("data-img-shadow", ar.imgS ? "on" : "off");
    put("--img-radius", ar.imgR + "px");
    put("--para-gap", (ar.gap / 100) + "em");
    root.setAttribute("data-meta-date", ar.mDate ? "on" : "off");
    root.setAttribute("data-meta-cats", ar.mCats ? "on" : "off");
    root.setAttribute("data-meta-tags", ar.mTags ? "on" : "off");

    // archive lists
    var ah = conf.archive;
    root.setAttribute("data-arch-row", ah.row);
    root.setAttribute("data-arch-datefmt", ah.dfmt);
    root.setAttribute("data-arch-datepos", ah.dpos);
    root.setAttribute("data-arch-datefont", ah.dfont);
    root.setAttribute("data-arch-years", ah.years ? "on" : "off");
    root.setAttribute("data-arch-cat", ah.cat ? "on" : "off");
    root.setAttribute("data-arch-hover", ah.hover);
    put("--arch-size", ah.size + "px");
    put("--arch-pad", ah.pad + "px");
    put("--arch-radius", ah.radius + "px");
    put("--arch-gap", ah.gap + "px");
    put("--arch-year-size", ah.ySize + "px");
    root.setAttribute("data-arch-tweight", ah.tweight);
    root.setAttribute("data-arch-excerpt", ah.excerpt ? "on" : "off");
    root.setAttribute("data-arch-arrow", ah.arrow ? "on" : "off");
    root.setAttribute("data-arch-catstyle", ah.catStyle);
    root.setAttribute("data-arch-yearstyle", ah.yStyle);
    root.setAttribute("data-arch-yearcount", ah.yCount ? "on" : "off");
    if (ah.dcolor) put("--arch-date-c", textOn(ah.dcolor));
    if (ah.tcolor) put("--arch-title-c", textOn(ah.tcolor));

    // pagination look (the page numbers themselves are built by SiteTheme.renderPager)
    var pg = conf.pager;
    root.setAttribute("data-pg-align", pg.align);
    put("--pg-gap", pg.gap + "px");

    // tags + category links
    var tx2 = conf.tax;
    root.setAttribute("data-tag-style", tx2.tag);
    root.setAttribute("data-tag-size", tx2.tagSize);
    root.setAttribute("data-tag-count", tx2.tagCount ? "on" : "off");
    root.setAttribute("data-tag-align", tx2.tagAlign);
    root.setAttribute("data-cat-style", tx2.cat);
    root.setAttribute("data-cat-icon", tx2.catIcon ? "on" : "off");
    root.setAttribute("data-cat-count", tx2.catCount ? "on" : "off");
    root.setAttribute("data-meta-style", tx2.meta);
    if (tx2.tagColor) { put("--tag-c", textOn(tx2.tagColor)); put("--tag-bd", tx2.tagColor); put("--tag-rgb", rgbOf(tx2.tagColor)); }
    if (tx2.catColor) put("--cat-c", textOn(tx2.catColor));
    if (tx2.metaColor) { put("--meta-c", textOn(tx2.metaColor)); put("--meta-rgb", rgbOf(tx2.metaColor)); }

    // theme button: follow the sidebar
    root.setAttribute("data-tb-follow", conf.tb.hideWithSidebar ? "sidebar" : "always");

    // projects page
    var pj2 = conf.proj;
    root.setAttribute("data-proj-art", pj2.art);
    root.setAttribute("data-proj-artbg", pj2.artBg);
    root.setAttribute("data-proj-artdeco", pj2.deco);
    root.setAttribute("data-proj-defart", pj2.defart ? "on" : "off");
    root.setAttribute("data-proj-art-text", pj2.artText ? "on" : "off");
    root.setAttribute("data-proj-status", pj2.status ? "on" : "off");
    root.setAttribute("data-proj-tags", pj2.tags ? "on" : "off");
    root.setAttribute("data-proj-date-show", pj2.date ? "on" : "off");
    root.setAttribute("data-proj-date", pj2.datePos);
    root.setAttribute("data-proj-align", pj2.align);
    put("--proj-img-h", pj2.h + "px");
    put("--proj-img-fit", pj2.fit);
    if (pj2.color) put("--proj-art-c", pj2.color);

    // layout
    var la = conf.layout;
    // sidebar look (appearance.sidebar): panel style = the manager / configurator sidebar
    var sb2 = conf.sidebar, sw = la.side;
    if (!window.SITE_PREVIEW && sb2.resize) {            // a visitor who dragged the edge keeps their width
      var vs = parseInt(read("sidebar-w"), 10);
      if (vs) sw = Math.max(200, Math.min(420, vs));
    } else if (window.SITE_PREVIEW) {                    // configurator: a width you dragged in the preview stays until you change the default width
      if (sb2.resize && window.SITE_PREVIEW_W && window.SITE_PREVIEW_DEF === la.side) sw = window.SITE_PREVIEW_W;
      else { window.SITE_PREVIEW_W = 0; window.SITE_PREVIEW_DEF = la.side; }
    }
    root.setAttribute("data-sb-style", sb2.style);
    root.setAttribute("data-sb-align", sb2.align);
    root.setAttribute("data-sb-title", sb2.title ? "on" : "off");
    root.setAttribute("data-sb-icons", sb2.icons ? "on" : "off");
    root.setAttribute("data-sb-case", sb2.upper ? "upper" : "normal");
    root.setAttribute("data-sb-bold", sb2.boldActive ? "on" : "off");
    root.setAttribute("data-sb-active", sb2.active);
    root.setAttribute("data-sb-check", sb2.check ? "on" : "off");
    root.setAttribute("data-sb-divider", sb2.divider ? "on" : "off");
    root.setAttribute("data-sb-resize", (sb2.resize || sb2.edgeHide !== "off") ? "on" : "off");   // the edge exists for resizing and / or hiding
    root.setAttribute("data-sb-resizew", sb2.resize ? "on" : "off");
    root.setAttribute("data-sb-edgehide", sb2.edgeHide);
    root.setAttribute("data-sb-fill", sb2.fill);
    root.setAttribute("data-sb-toggle", sb2.toggle);
    root.setAttribute("data-sb-tlook", sb2.tLook);
    root.setAttribute("data-sb-tshape", sb2.tShape);
    root.setAttribute("data-sb-tpos", sb2.tPos);
    root.setAttribute("data-sb-treveal", sb2.tReveal);
    root.setAttribute("data-sb-hidden", sb2.hidden);
    root.setAttribute("data-sb-railav", (sb2.railAv || sb2.railAvToggle || sb2.avToggle) ? "on" : "off");
    root.setAttribute("data-sb-railavtoggle", sb2.railAvToggle ? "on" : "off");
    root.setAttribute("data-sb-avtoggle", sb2.avToggle ? "on" : "off");
    var avLink = document.querySelector(".brand-logo-link");
    if (avLink) {
      if (sb2.avToggle) { avLink.setAttribute("role", "button"); avLink.setAttribute("title", "Hide / show sidebar"); }
      else { avLink.removeAttribute("role"); avLink.removeAttribute("title"); }
    }
    root.setAttribute("data-sb-railtip", sb2.railTip ? "on" : "off");
    root.setAttribute("data-sb-railtoggle", sb2.railToggle);
    root.setAttribute("data-sb-hover", sb2.hoverOpen);
    root.setAttribute("data-sb-hover-delay", String(sb2.hoverDelay));
    // avatar / title / description: layout, alignment and position (stacked layout only uses the positions)
    var inline = sb2.headLayout !== "stacked";
    function al(v) { return v === "auto" ? sb2.align : v; }
    root.setAttribute("data-sb-head", sb2.headLayout);
    root.setAttribute("data-sb-av-align", al(sb2.avAlign));
    root.setAttribute("data-sb-ti-align", al(sb2.tiAlign));
    root.setAttribute("data-sb-tg-align", al(sb2.tgAlign));
    var avP = inline ? "top" : sb2.avPos, tiP = inline ? "top" : sb2.tiPos, tgP = inline ? "top" : sb2.tgPos;
    var avOn = conf.avatar.show, tiOn = sb2.title, tgOn = conf.layout.tagline;
    put("--o-av", avP === "top" ? "1" : "8");
    put("--o-ti", tiP === "top" ? "2" : "9");
    put("--o-tg", tgP === "top" ? "3" : "10");
    root.setAttribute("data-sb-hastop", ((avOn && avP === "top") || (tiOn && tiP === "top") || (tgOn && tgP === "top") || inline) ? "on" : "off");
    root.setAttribute("data-sb-hasbot", ((avOn && avP === "bottom") || (tiOn && tiP === "bottom") || (tgOn && tgP === "bottom")) ? "on" : "off");
    root.setAttribute("data-sb-tsize", sb2.tSize > 0 ? "custom" : "auto");
    if (sb2.tSize > 0) put("--tg-size", sb2.tSize + "px");
    // the invisible hover zone / handle on the left edge exists only when something needs it
    root.setAttribute("data-sb-hot", (sb2.hidden !== "rail" && (sb2.hidden !== "none" || sb2.hoverOpen !== "off" || sb2.tReveal === "hover")) ? "on" : "off");
    put("--sb-rail-w", sb2.railW + "px");
    put("--sb-inline-av", sb2.inlineAv + "px");
    root.setAttribute("data-sb-shortcut", sb2.shortcut ? "on" : "off");
    root.setAttribute("data-sb-default", String(la.side));
    put("--sb-fs", sb2.size + "px");
    put("--sb-ico", sb2.iconSize + "px");
    put("--sb-igap", sb2.iconGap + "px");
    put("--sb-pad", sb2.pad + "px");
    put("--sb-gap", sb2.gap + "px");
    put("--sb-r", sb2.radius + "px");
    if (sb2.color) put("--sb-c", sb2.color);
    if (sb2.hoverBg) put("--sb-hover-bg", sb2.hoverBg);
    if (sb2.activeBg) put("--sb-active-bg", sb2.activeBg);
    if (sb2.activeColor) put("--sb-active-c", sb2.activeColor);
    put("--sidebar-w", sw + "px");
    put("--content-max", la.content + "px");
    put("--radius", la.radius + "px");
    put("--tagline-display", la.tagline ? "block" : "none");

    if (document.head) {
      if (!metaTheme) {
        metaTheme = document.querySelector('meta[name="theme-color"]');
        if (!metaTheme) { metaTheme = document.createElement("meta"); metaTheme.name = "theme-color"; document.head.appendChild(metaTheme); }
      }
      metaTheme.content = bg;
    }
  }

  function notify() {
    try { document.dispatchEvent(new CustomEvent("site-appearance")); } catch (e) { /* old browser */ }
  }

  loadMode();
  apply();

  if (mq) {
    var onSys = function () { if (state.mode === "system") { apply(); syncUI(); } };
    if (mq.addEventListener) mq.addEventListener("change", onSys); else if (mq.addListener) mq.addListener(onSys);
  }
  window.addEventListener("storage", function (e) {
    if (e.key === MODE_KEY) { loadMode(); apply(); syncUI(); }
  });

  function setMode(m) {
    if (MODES.indexOf(m) < 0) return;
    state.mode = m; write(MODE_KEY, m); apply(); syncUI();
    if (window.SITE_PREVIEW) notify();                   // configurator: the Dark / Light switch follows the theme button you click in the preview
  }

  /* ---------------- page numbers (home page + live preview) ----------------
     pageList(total, current, max, edges) -> [1, 2, 3, "…", 20]
     max   = most page NUMBERS shown at once (the "…" marks do not count)
     edges = always keep the first and last page visible */
  function pageList(total, cur, max, edges) {
    var out = [], i, s, e;
    max = Math.max(5, Math.min(15, max | 0 || 7));
    cur = Math.max(1, Math.min(total, cur));
    if (total <= max) { for (i = 1; i <= total; i++) out.push(i); return out; }
    if (edges) {
      if (cur <= max - 2) {                                   // near the start:  1 2 3 4 5 … 20
        for (i = 1; i <= max - 1; i++) out.push(i);
        out.push("…", total);
      } else if (cur >= total - max + 3) {                    // near the end:    1 … 16 17 18 19 20
        out.push(1, "…");
        for (i = total - max + 2; i <= total; i++) out.push(i);
      } else {                                                // in the middle:  1 … 9 10 11 … 20
        var m = max - 2;
        s = cur - Math.floor((m - 1) / 2); e = s + m - 1;
        out.push(1, "…");
        for (i = s; i <= e; i++) out.push(i);
        out.push("…", total);
      }
      return out;
    }
    s = Math.max(1, Math.min(total - max + 1, cur - Math.floor((max - 1) / 2))); e = s + max - 1;   // no edges: a sliding window
    if (s > 1) out.push("…");
    for (i = s; i <= e; i++) out.push(i);
    if (e < total) out.push("…");
    return out;
  }

  var CHEV_L = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
  var CHEV_R = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';

  function renderPager(el, total, cur, go) {
    if (!el) return;
    var pg = conf.pager;
    el.innerHTML = "";
    if (total <= 1) { el.hidden = true; return; }
    el.hidden = false;
    function btn(html, label, page, cls) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "page-btn" + (cls ? " " + cls : ""); b.innerHTML = html; b.setAttribute("aria-label", label);
      if (page === null) b.disabled = true; else b.addEventListener("click", function () { go(page); });
      return b;
    }
    if (pg.arrows) el.appendChild(btn(CHEV_L, "Previous page", cur > 1 ? cur - 1 : null, "page-arrow"));
    pageList(total, cur, pg.max, pg.edges).forEach(function (p) {
      if (p === "…") { var gap = document.createElement("span"); gap.className = "page-gap"; gap.textContent = "…"; el.appendChild(gap); return; }
      var b = btn(String(p), "Page " + p, p, p === cur ? "active" : "");
      if (p === cur) b.setAttribute("aria-current", "page");
      el.appendChild(b);
    });
    if (pg.arrows) el.appendChild(btn(CHEV_R, "Next page", cur < total ? cur + 1 : null, "page-arrow"));
    if (pg.info) { var t = document.createElement("span"); t.className = "page-info"; t.textContent = "Page " + cur + " of " + total; el.appendChild(t); }
  }

  /* used by tools/_Apps/Site_Conf/Site_Conf.py for the live preview (nothing is stored) */
  window.SiteTheme = {
    pageList: pageList,
    renderPager: renderPager,
    setMode: setMode,
    state: state,
    config: function () { return conf; },
    preview: function (cfg, mode) {
      setConfig(cfg);
      state.mode = MODES.indexOf(mode) > -1 ? mode : conf.mode;
      apply(); buildUI(); syncUI();
      notify();
    }
  };

  /* ---------------- the ONE visitor theme button ---------------- */
  var SVG = {
    sun: '<svg class="ic ic-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg class="ic ic-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>',
    sys: '<svg class="ic ic-sys" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
    gear: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/></svg>',
    check: '<svg class="opt-check" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>'
  };
  var NAMES = { light: "Light", dark: "Dark", system: "System" };
  var ui = {}, wired = false;

  function buildUI() {
    var host = document.getElementById("settings");
    if (!host) return;
    ui = { host: host };
    if (!conf.tb.show) { host.style.display = "none"; host.innerHTML = ""; return; }
    host.style.display = "";
    host.setAttribute("data-pos", conf.tb.position);
    host.setAttribute("data-style", conf.tb.style);
    var s = conf.tb.style, h = "";
    if (s === "menu") {
      h = '<div class="settings-panel" id="settings-panel" role="dialog" aria-label="Theme" hidden><div role="radiogroup" aria-label="Theme mode">' +
        [["light", SVG.sun], ["dark", SVG.moon], ["system", SVG.sys]].map(function (p) {
          return '<button type="button" class="theme-opt" role="radio" aria-checked="false" data-mode="' + p[0] + '">' + p[1] + "<span>" + NAMES[p[0]] + "</span>" + SVG.check + "</button>";
        }).join("") + '</div></div>' +
        '<button type="button" class="dock-btn" id="settings-toggle" aria-haspopup="dialog" aria-expanded="false" aria-controls="settings-panel" aria-label="Theme" title="Theme">' + SVG.gear + "</button>";
    } else if (s === "toggle") {
      h = '<button type="button" class="dock-btn" id="theme-btn" aria-label="Switch theme" title="Switch theme">' + SVG.sun + SVG.moon + "</button>";
    } else if (s === "cycle") {
      h = '<button type="button" class="dock-btn" id="theme-btn" aria-label="Change theme" title="Change theme">' + SVG.sun + SVG.moon + SVG.sys + "</button>";
    } else {
      h = '<button type="button" class="tswitch" id="theme-btn" role="switch" aria-checked="false" aria-label="Dark theme" title="Light / Dark">' +
        SVG.sun.replace("ic ic-sun", "ts-ic ts-sun") + SVG.moon.replace("ic ic-moon", "ts-ic ts-moon") + '<span class="knob"></span></button>';
    }
    host.innerHTML = h;
    ui.panel = document.getElementById("settings-panel");
    ui.toggle = document.getElementById("settings-toggle");
    ui.btn = document.getElementById("theme-btn");
    ui.opts = Array.prototype.slice.call(host.querySelectorAll(".theme-opt"));
    ui.opts.forEach(function (b) { b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); }); });
    if (ui.toggle) ui.toggle.addEventListener("click", function () { setOpen(ui.panel.hidden); });
    if (ui.btn) ui.btn.addEventListener("click", function () {
      if (s === "cycle") setMode(MODES[(MODES.indexOf(state.mode) + 1) % MODES.length]);
      else setMode(resolved() === "dark" ? "light" : "dark");
    });
    if (!wired) {
      wired = true;
      document.addEventListener("click", function (e) {
        if (ui.panel && !ui.panel.hidden && !e.target.closest("#settings")) setOpen(false);
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && ui.panel && !ui.panel.hidden) { setOpen(false); ui.toggle.focus(); }
      });
    }
  }

  function syncUI() {
    if (!ui.host || !conf.tb.show) return;
    var next = resolved() === "dark" ? "light" : "dark";
    if (ui.opts) ui.opts.forEach(function (b) { b.setAttribute("aria-checked", String(b.getAttribute("data-mode") === state.mode)); });
    if (ui.btn) {
      if (conf.tb.style === "cycle") {
        var nm = MODES[(MODES.indexOf(state.mode) + 1) % MODES.length];
        ui.btn.setAttribute("aria-label", "Theme: " + NAMES[state.mode] + " (click for " + NAMES[nm] + ")");
        ui.btn.title = "Theme: " + NAMES[state.mode] + " - click for " + NAMES[nm];
      } else if (conf.tb.style === "switch") {
        ui.btn.setAttribute("aria-checked", String(resolved() === "dark"));
      } else {
        ui.btn.setAttribute("aria-label", "Switch to " + next + " theme");
        ui.btn.title = "Switch to " + next + " theme";
      }
    }
  }

  function setOpen(open) {
    if (!ui.panel) return;
    ui.panel.hidden = !open;
    ui.toggle.setAttribute("aria-expanded", String(open));
    if (open) syncUI();
  }

  function init() { buildUI(); syncUI(); }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
