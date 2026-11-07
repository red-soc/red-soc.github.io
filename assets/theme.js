(function () {
  "use strict";

  var root = document.documentElement;
  function syncButtonDocumentY() {
    root.style.setProperty("--button-document-y", Math.max(0, window.scrollY || window.pageYOffset || 0) + "px");
  }
  window.addEventListener("scroll", syncButtonDocumentY, {passive: true});
  syncButtonDocumentY();
  var MODES = ["light", "dark", "system"];
  var MODE_KEY = "theme-mode";

  var COLOR_VARS = { bg: "--bg", sidebar: "--bg-sidebar", card: "--card", border: "--border", text: "--text", muted: "--text-muted" };
  var DEF_BG = { dark: "#1b1b1e", light: "#f4f4f7" };

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

  var BG_TYPES = ["none", "gradient", "aurora", "mesh", "grid", "dots", "noise", "waves", "particles", "starfield", "matrix", "scanlines", "hexgrid", "circuit", "radar", "packets", "hexdump", "binary"];
  var DEFAULT_APPEARANCE = {"mode":"dark","accent":"#b3202a","keep_text_readable":true,"colors":{"dark":{},"light":{}},"page_style":{"style":"default"},"background":{"type":"packets","animate":true,"speed":3,"intensity":60,"density":35,"blur":0,"color1":"","color2":"","color3":"","interactive":false,"glass":false,"surfaces":"custom","mobile":true},"surf_sidebar":{"mode":"transparent","opacity":70,"blur":0,"edge_shadow":"on"},"surf_page":{"mode":"glass","opacity":0,"blur":30,"edge_shadow":"on"},"surf_cards":{"mode":"transparent","opacity":0,"blur":0,"edge_shadow":"on"},"surf_panels":{"mode":"transparent","opacity":60,"blur":0,"edge_shadow":"on"},"surf_pg_categories":{"mode":"transparent","opacity":68,"blur":0,"edge_shadow":"on"},"surf_pg_tags":{"mode":"transparent","opacity":68,"blur":0,"edge_shadow":"on"},"surf_pg_archive":{"mode":"transparent","opacity":68,"blur":0,"edge_shadow":"on"},"surf_pg_projects":{"mode":"transparent","opacity":68,"blur":0,"edge_shadow":"on"},"surf_pg_about":{"mode":"transparent","opacity":68,"blur":0,"edge_shadow":"on"},"sidebar":{"style":"panel","label":"","head_layout":"inline","inline_avatar_size":63,"align":"left","avatar_align":"auto","title_align":"auto","tagline_align":"auto","avatar_position":"top","title_position":"top","tagline_position":"top","show_title":true,"show_icons":true,"icon_size":22,"icon_gap":13,"font_size":15,"uppercase":true,"bold_active":true,"item_padding":7,"item_gap":2,"item_radius":14,"active_style":"outline","show_check":false,"text_color":"","hover_bg":"","active_bg":"","active_color":"","divider":true,"resizable":false,"toggle_style":"arrow","toggle_look":"auto","toggle_shape":"auto","toggle_size":33,"toggle_position":"edge_middle","toggle_reveal":"always","toggle_shortcut":true,"edge_hide":"drag","hidden_content":"wider","hidden_style":"rail","rail_width":65,"rail_avatar":true,"avatar_toggle":true,"rail_avatar_toggle":true,"rail_tooltips":true,"rail_toggle":"above","hover_open":"off","hover_delay":150,"button_scroll":"current","button_scroll_sidebar":true,"button_scroll_toc":false,"button_scroll_settings":false,"button_scroll_to_top":false},"avatar":{"show":true,"image":"/assets/logo.png","image_x":50,"image_y":50,"image_zoom":115,"image_fit":"cover","size":196,"shape":"rounded","border_color":"","border_width":2,"background":"#000000"},"links":{"color":"","hover_color":"","highlight_bg":"","underline":"always"},"search":{"hit_bg":"","hit_text":"","focus_color":""},"breadcrumb":{"show":true,"style":"underline","separator":"chevron","font_size":15,"link_color":"","current_color":"","highlight":"","bold_current":false,"uppercase":false},"pagination":{"per_page":10,"max_pages":5,"show_edges":true,"show_arrows":true,"show_info":false,"align":"center","gap":8,"scroll_top":true},"buttons":{"variant":"outline","shape":"auto","size":"medium","color":"","border_width":1,"shadow":"none","hover":"glow","floating":"frosted","float_solid":true,"float_hide":"always"},"to_top":{"show":true,"style":"circle","icon":"chevron","label":"Top","position":"bottom-right","show_after":400,"behavior":"always","show_on":"all","progress":false,"smooth":true,"offset_x":20,"offset_y":24,"color":""},"theme_button":{"show":false},"article":{"table_style":"grid","table_header":"accent","table_density":"normal","table_font_size":15,"table_align":"left","table_first_bold":false,"table_hover":true,"table_scroll":true,"table_nowrap":false,"table_radius":10,"heading_style":"underline","heading_color":"default","inline_code":"box","blockquote":"minimal","list_marker":"accent","image_radius":0,"image_border":false,"image_shadow":false,"paragraph_gap":100,"justify":false,"meta_date":true,"meta_categories":true,"meta_tags":true},"toc":{"style":"lines","active_style":"bar","font_size":14,"width":250,"title_style":"plain","active_color":"","hover_color":"","caret_style":"chevron","toggle_look":"auto","toggle_shape":"auto","toggle_label":true,"button_scroll":"current"},"archive":{"row_style":"timeline","row_radius":0,"date_format":"iso","date_position":"left","date_font":"mono","date_color":"","title_weight":"normal","title_color":"","font_size":17,"row_padding":15,"col_gap":24,"show_excerpt":false,"show_arrow":true,"show_category":false,"cat_style":"pill","group_by_year":true,"year_style":"line","year_size":22,"year_count":true,"hover":"slide"},"taxonomy":{"tag_style":"box","tag_size":"medium","tag_color":"","tag_count":true,"tag_align":"left","cat_style":"compact","cat_icon":true,"cat_count":true,"cat_color":"","meta_style":"outline","meta_color":""},"text":{"font":"sans","heading_font":"serif","font_size":16,"line_height":172,"selection":""},"code":{"window":"mac","highlight":"auto","background":"site","show_language":true,"copy":"both","dots":"muted","line_numbers":false,"wrap":false,"italic_comments":true,"font":"mono","ligatures":false,"font_size":14,"line_height":155,"max_height":0,"radius":10,"shadow":true},"projects":{"columns":"auto","align":"rows","show_images":true,"image_height":170,"image_fit":"cover","default_art":true,"default_image":"","art_style":"network","art_bg":"split","art_deco":"corners","art_color":"","art_text":true,"art_default_text":"","art_default_sub":"","show_status":true,"show_tags":true,"show_date":true,"date_position":"top-right"},"layout":{"sidebar_width":283,"content_width":980,"card_radius":14,"show_tagline":true},"fx_load":{"on":false},"fx_scroll":{"reveal":false,"reveal_style":"fade","reveal_duration":500,"reveal_stagger":60,"reveal_easing":"ease-out","progress":true,"progress_scope":"all","progress_height":3,"progress_color":"","parallax":false,"parallax_strength":15,"progress_posts":true,"progress_home":false,"progress_archive":false,"progress_categories":false,"progress_tags":false,"progress_projects":false,"progress_about":false,"progress_pages":false},"fx_cards":{"tilt":false,"tilt_max":6,"glow":false,"glow_color":"","glow_size":220,"border":false,"border_speed":4,"hover":"lift","hover_duration":200,"hover_easing":"ease-out"},"fx_text":{"typing":"both","typing_speed":25,"typing_delay":0,"cursor_char":"block","decrypt":false,"decrypt_duration":700,"glitch":false,"glitch_color":""},"fx_cursor":{"glow":"off","trail":false,"custom":"off"},"fx_menu":{"marker":false,"marker_duration":300,"slide":false,"slide_stagger":50,"hover_glow":true,"glow_color":""},"fx_toc":{"panel":true,"panel_style":"slide","panel_duration":350,"slide":true,"slide_style":"slide","slide_stagger":35,"marker":true,"marker_duration":300,"hover_glow":true,"glow_color":""},"fx_code":{"typewriter":false,"type_speed":40,"scanline":false,"scan_speed":4,"glow":true,"glow_color":"","glow_size":10},"fx_pages":{"fade":false},"fx_theme":{"crossfade":false}};
  var conf = {};
  function pick(v, list, d) { return list.indexOf(v) > -1 ? v : d; }
  function num(v, d, lo, hi) { v = parseFloat(v); return isNaN(v) ? d : Math.min(hi, Math.max(lo, v)); }
  function col(v) { return isHex(v) ? normHex(v) : ""; }
  function bool(v, d) { return v === undefined || v === null || v === "" ? d : (v !== false && v !== "false"); }

  var SURF_MODES = ["solid", "glass", "transparent", "hidden"];
  function psurf(g) { return { mode: pick(g.mode, ["inherit"].concat(SURF_MODES), "inherit"), op: num(g.opacity, 68, 0, 100), blur: num(g.blur, 10, 0, 40), edge: pick(g.edge_shadow, EDGE_MODES, "on") }; }
  function surf(g, op, bl) { return { mode: pick(g.mode, SURF_MODES, "solid"), op: num(g.opacity, op, 0, 100), blur: num(g.blur, bl, 0, 40), edge: pick(g.edge_shadow, EDGE_MODES, "on") }; }
  var EDGE_MODES = ["on", "phone_off", "off"];   // frosted blur: on | off on phones | off (the blur draws the screen-edge shadow)

  function setConfig(c) {
    var supplied = c || {}, merged = {};
    Object.keys(DEFAULT_APPEARANCE).forEach(function (k) {
      var d = DEFAULT_APPEARANCE[k], v = supplied[k];
      merged[k] = d && typeof d === "object" && !Array.isArray(d)
        ? Object.assign({}, d, v || {}) : (v === undefined ? d : v);
    });
    c = Object.assign(merged, supplied);
    Object.keys(DEFAULT_APPEARANCE).forEach(function (k) {
      var d = DEFAULT_APPEARANCE[k];
      if (d && typeof d === "object" && !Array.isArray(d)) c[k] = Object.assign({}, d, supplied[k] || {});
    });
    (function () {
      var SM = ["current", "fixed_top", "page_top"], sb = c.sidebar || {};
      var mode = pick(sb.button_scroll, SM, "current");
      function on(k, d) { var v = sb["button_scroll_" + k]; return v === undefined ? d : !!v; }
      root.setAttribute("data-sidebar-button-scroll", on("sidebar", true) ? mode : "current");
      root.setAttribute("data-toc-button-scroll", on("toc", false) ? mode : pick((c.toc || {}).button_scroll, SM, "current"));
      root.setAttribute("data-settings-button-scroll", on("settings", false) ? mode : "current");
      root.setAttribute("data-totop-button-scroll", on("to_top", false) ? mode : "current");
    })();
    function grp(n) { return c[n] && typeof c[n] === "object" ? c[n] : {}; }
    var colors = { dark: {}, light: {} };
    ["dark", "light"].forEach(function (t) {
      var src = c.colors && c.colors[t] || {};
      Object.keys(COLOR_VARS).forEach(function (k) { if (isHex(src[k])) colors[t][k] = normHex(src[k]); });
    });
    var av = grp("avatar"), li = grp("links"), se = grp("search"), bu = grp("buttons"),
        tb = grp("theme_button"), tx = grp("text"), la = grp("layout"), sb = grp("sidebar"), co = grp("code"), tt = grp("to_top"),
        ar = grp("article"), ah = grp("archive"), tg = grp("taxonomy"), pg = grp("pagination"), pj = grp("projects"), ps = grp("page_style"), bgx = grp("background"),
        bc = grp("breadcrumb"), tc = grp("toc");
    conf = {
      mode: MODES.indexOf(c.mode) > -1 ? c.mode : "dark",
      accent: isHex(c.accent) ? normHex(c.accent) : "#8ab4f8",
      auto: c.keep_text_readable !== false,
      colors: colors,
      avatar: { show: bool(av.show, true), size: num(av.size, 150, 60, 300), shape: pick(av.shape, ["circle", "rounded", "square"], "circle"),
                x: num(av.image_x, 50, 0, 100), y: num(av.image_y, 50, 0, 100), zoom: num(av.image_zoom, 100, 10, 300), fit: pick(av.image_fit, ["cover", "contain"], "cover"),
                border: col(av.border_color), width: num(av.border_width, 3, 0, 12), bg: col(av.background) || "#000000" },
      links: { color: col(li.color), hover: col(li.hover_color), hl: col(li.highlight_bg), underline: pick(li.underline, ["hover", "always", "never"], "hover") },
      search: { bg: col(se.hit_bg), fg: col(se.hit_text), focus: col(se.focus_color) },
      buttons: { variant: pick(bu.variant, ["outline", "soft", "solid", "ghost", "gradient", "glow"], "outline"), shape: pick(bu.shape, ["auto", "pill", "rounded", "square"], "auto"),
                 size: pick(bu.size, ["small", "medium", "large", "xlarge"], "medium"), color: col(bu.color),
                 bw: num(bu.border_width, 1, 0, 4), shadow: pick(bu.shadow, ["none", "soft", "strong"], "none"), hover: pick(bu.hover, ["color", "lift", "grow", "glow"], "color"),
                 float: pick(bu.floating, ["frosted", "solid", "plain"], "frosted"),
                 floatSolid: bool(bu.float_solid, true), floatHide: pick(bu.float_hide, ["off", "phones", "always"], "phones") },   // floating buttons over the article
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
      pcard: Object.assign({}, grp("proj_card"), grp("proj_badges"), grp("proj_date")),   // Card style + Badges and tags + Date
      scard: Object.assign({}, grp("series_card"), grp("series_badges"), grp("series_date")),
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
      page: { style: pick(ps.style, ["default", "studio", "minimal", "glass", "editorial", "compact", "neon", "paper", "brutalist", "soft", "terminal"], "default") },
      bg: { type: pick(bgx.type, BG_TYPES, "none"), animate: bool(bgx.animate, true), speed: num(bgx.speed, 5, 1, 10), intensity: num(bgx.intensity, 60, 5, 100),
            density: num(bgx.density, 50, 10, 100), blur: num(bgx.blur, 0, 0, 80), c1: col(bgx.color1), c2: col(bgx.color2), c3: col(bgx.color3),
            inter: bool(bgx.interactive, true), glass: bool(bgx.glass, false), mobile: bool(bgx.mobile, true),
            surfaces: pick(bgx.surfaces, ["custom", "solid", "glass", "transparent", "hidden"], "custom") },   // appearance.background (Site_Conf "Background")
      surf: {   // appearance.surf_* (Site_Conf "Background: Sidebar / Content panel / Cards / Other panels")
        sidebar: surf(grp("surf_sidebar"), 70, 12), page: surf(grp("surf_page"), 68, 10),
        cards: surf(grp("surf_cards"), 68, 10), panels: surf(grp("surf_panels"), 60, 10),
        pg: { categories: psurf(grp("surf_pg_categories")), tags: psurf(grp("surf_pg_tags")), archive: psurf(grp("surf_pg_archive")),
              projects: psurf(grp("surf_pg_projects")), about: psurf(grp("surf_pg_about")), series: psurf(grp("surf_pg_series")) },
        series: psurf(grp("surf_series")) },   // series boxes (playlist, Previous / Next, related, series cards); inherit = same as Cards   // per-page content box (html[data-pagekind])
      crumb: { show: bool(bc.show, true), style: pick(bc.style, ["plain", "pills", "filled", "boxed", "bar", "steps", "brackets", "underline"], "plain"),
               sep: pick(bc.separator, ["slash", "chevron", "arrow", "dot"], "slash"), size: num(bc.font_size, 15, 12, 20),
               link: col(bc.link_color), current: col(bc.current_color), hl: col(bc.highlight),
               bold: bool(bc.bold_current, false), upper: bool(bc.uppercase, false) },
      toc: { style: pick(tc.style, ["lines", "pills", "cards", "plain"], "lines"),
             active: pick(tc.active_style, ["bar", "fill", "text"], "bar"), size: num(tc.font_size, 14, 12, 18),
             width: num(tc.width, 250, 200, 340), title: pick(tc.title_style, ["small_caps", "plain", "hidden"], "small_caps"),
             activeColor: col(tc.active_color), hover: col(tc.hover_color),
             caret: pick(tc.caret_style, ["chevron", "plus", "none"], "chevron"),
             tLook: pick(tc.toggle_look, ["auto", "ghost", "outline", "soft", "solid", "glass"], "auto"),
             tShape: pick(tc.toggle_shape, ["auto", "square", "rounded", "circle", "pill"], "auto"),
             tLabel: bool(tc.toggle_label, true) },
      layout: { side: num(la.sidebar_width, 280, 200, 380), content: num(la.content_width, 980, 640, 1400), radius: num(la.card_radius, 14, 0, 32), tagline: bool(la.show_tagline, true) }
    };
  }
  setConfig(window.SITE_APPEARANCE);

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

  var applied = [], metaTheme = null;
  function apply() {
    var theme = resolved(), st = root.style;
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-mode", state.mode);
    root.setAttribute("data-page-style", conf.page.style);   // appearance.page_style (Site_Conf "Page visual style")

    applied.forEach(function (v) { st.removeProperty(v); });
    applied = [];
    function put(v, val) { st.setProperty(v, val); applied.push(v); }

    var bfx = conf.bg, small = !!(window.matchMedia && window.matchMedia("(max-width: 760px)").matches);
    root.setAttribute("data-bg", bfx.type);
    root.setAttribute("data-bg-anim", bfx.animate && (bfx.mobile || !small) ? "1" : "0");
    root.setAttribute("data-bg-glass", bfx.glass && bfx.type !== "none" ? "1" : "0");
    var SF = conf.surf || {};
    var edgeAll = 0, edgePhone = 0, edgeOn = false;   // blur (px) the animated background takes over from boxes whose own blur is switched off
    (function () {
      var ss = SF.series || { mode: "inherit", op: 68, blur: 10 }, cs = SF.cards || { mode: "solid", op: 68, blur: 10 };
      var sm = bfx.surfaces !== "custom" ? bfx.surfaces : ss.mode === "inherit" ? cs.mode : ss.mode, sv = ss.mode === "inherit" ? cs : ss;
      root.setAttribute("data-surf-series", sm);
      st.setProperty("--surf-series-op", sv.op + "%"); applied.push("--surf-series-op");
      st.setProperty("--surf-series-blur", sv.blur + "px"); applied.push("--surf-series-blur");
    })();
    ["sidebar", "page", "cards", "panels"].forEach(function (n) {
      var sf = SF[n] || { mode: "solid", op: 70, blur: 10 }, m = bfx.surfaces !== "custom" ? bfx.surfaces : sf.mode;
      if (n === "page" && bfx.surfaces === "custom") {   // Categories / Tags / Archives / Projects / About page box override
        var pgs = (SF.pg || {})[root.getAttribute("data-pagekind") || ""];
        if (pgs && pgs.mode !== "inherit") { sf = pgs; m = pgs.mode; }
      }
      if (bfx.surfaces === "custom" && m === "solid" && bfx.glass && bfx.type !== "none" && (n === "sidebar" || n === "cards")) m = "glass";   // older "See-through cards and sidebar" switch
      root.setAttribute("data-surf-" + n, m);
      put("--surf-" + n + "-op", sf.op + "%");
      put("--surf-" + n + "-blur", sf.blur + "px");
      root.setAttribute("data-surf-" + n + "-edge", sf.edge || "on");
      if (m === "glass") {
        if (sf.edge !== "off" && sf.edge !== "phone_off") edgeOn = true;
        if (sf.edge === "off") edgeAll = Math.max(edgeAll, sf.blur);
        else if (sf.edge === "phone_off") edgePhone = Math.max(edgePhone, sf.blur);
      }
    });
    put("--bgfx-c1", bfx.c1 || "var(--accent)");
    put("--bgfx-c2", bfx.c2 || "color-mix(in srgb, var(--accent) 45%, #ff4fd8)");
    put("--bgfx-c3", bfx.c3 || "color-mix(in srgb, var(--accent) 45%, #22d3ee)");
    put("--bgfx-t", String(+(5 / bfx.speed).toFixed(3)));
    put("--bgfx-op", String(bfx.intensity / 100));
    put("--bgfx-size", Math.round(100 - bfx.density * 0.8) + "px");
    var bl = bfx.blur;
    put("--bgfx-filter", bl ? "blur(" + bl + "px)" : "none");
    put("--bgfx-filter-phone", bl ? "blur(" + bl + "px)" : "none");
    root.setAttribute("data-edge-shadow", edgeOn ? "on" : (edgePhone ? "desktop" : "off"));

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

    var av = conf.avatar;
    put("--avatar-display", av.show ? "block" : "none");
    put("--avatar-size", av.size + "px");
    put("--avatar-focus", av.x + "% " + av.y + "%");
    put("--avatar-zoom", av.zoom / 100);
    put("--avatar-fit", av.fit);
    put("--avatar-radius", av.shape === "circle" ? "50%" : av.shape === "rounded" ? "22%" : "6px");
    put("--avatar-border-w", av.width + "px");
    put("--avatar-bg", av.bg);
    if (av.border) put("--avatar-border-color", av.border);

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

    var se = conf.search;
    if (se.bg) { put("--mark-bg", se.bg); put("--mark-fg", se.fg || onColor(se.bg)); }
    else if (se.fg) put("--mark-fg", se.fg);
    if (se.focus) { put("--focus", se.focus); put("--focus-rgb", rgbOf(se.focus)); }

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
    root.setAttribute("data-btn-float", bu.float || "frosted");
    root.setAttribute("data-float-solid", bu.floatSolid ? "on" : "off");   // readable backing for the floating buttons
    root.setAttribute("data-float-hide", bu.floatHide);                    // hide them while reading (assets/extras.js)

    var tp = conf.top;
    put("--tt-x", tp.x + "px");
    put("--tt-y", tp.y + "px");
    if (tp.color) { put("--tt", tp.color); put("--tt-rgb", rgbOf(tp.color)); put("--tt-text", textOn(tp.color)); put("--on-tt", onColor(tp.color)); }
    else { put("--tt", "var(--btn)"); put("--tt-rgb", "var(--btn-rgb)"); put("--tt-text", "var(--btn-text)"); put("--on-tt", "var(--on-btn)"); }
    var tbSide = conf.tb.position === "bottom-left" ? "bottom-left" : "bottom-right";
    var lift = conf.tb.show && tp.show && tp.pos === tbSide ? "calc(40px * var(--btn-scale) + 12px)" : "0px";
    put("--tt-lift", lift);
    root.setAttribute("data-totop", tp.show ? "on" : "off");

    var tx = conf.text, cd = conf.code;
    var bodyF = FONTS[tx.font], headF = tx.heading === "same" ? bodyF : FONTS[tx.heading], codeF = FONTS[cd.font];
    put("--sans", bodyF.s);
    put("--serif", headF.s);
    put("--mono", codeF.s);
    loadFonts([tx.font, tx.heading === "same" ? tx.font : tx.heading, cd.font]);
    put("--base-size", tx.size + "px");
    put("--post-lh", String(tx.lh / 100));
    if (tx.selection) put("--selection-rgb", rgbOf(tx.selection));

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

    var pg = conf.pager;
    root.setAttribute("data-pg-align", pg.align);
    put("--pg-gap", pg.gap + "px");

    var bc2 = conf.crumb;
    root.setAttribute("data-crumb", bc2.show ? "on" : "off");
    root.setAttribute("data-crumb-style", bc2.style);
    root.setAttribute("data-crumb-sep", bc2.sep);
    root.setAttribute("data-crumb-bold", bc2.bold ? "on" : "off");
    root.setAttribute("data-crumb-upper", bc2.upper ? "on" : "off");
    put("--crumb-size", bc2.size + "px");
    if (bc2.link) put("--crumb-link", textOn(bc2.link));
    if (bc2.current) put("--crumb-current", textOn(bc2.current));
    if (bc2.hl) { put("--crumb-hl", textOn(bc2.hl)); put("--crumb-hl-rgb", rgbOf(bc2.hl)); }

    var tc2 = conf.toc;
    root.setAttribute("data-toc-style", tc2.style);
    root.setAttribute("data-toc-active", tc2.active);
    root.setAttribute("data-toc-title", tc2.title);
    root.setAttribute("data-toc-caret", tc2.caret);
    root.setAttribute("data-toc-tlook", tc2.tLook);
    root.setAttribute("data-toc-tshape", tc2.tShape);
    root.setAttribute("data-toc-tlabel", tc2.tLabel ? "on" : "off");
    put("--toc-size", tc2.size + "px");
    put("--toc-w", tc2.width + "px");
    if (tc2.activeColor) { put("--toc-active", textOn(tc2.activeColor)); put("--toc-active-rgb", rgbOf(tc2.activeColor)); }
    if (tc2.hover) put("--toc-hover", textOn(tc2.hover));

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

    root.setAttribute("data-tb-follow", conf.tb.hideWithSidebar ? "sidebar" : "always");

    function cardDateFmt(p, fmt) {
      var F = window.__cardDateFmt = window.__cardDateFmt || {};
      F[p] = pick(fmt, ["asis", "iso", "dmy", "mdy", "dmy_dash", "dmy_dot", "short", "short_dmy", "long", "long_dmy", "month_year", "year"], "asis");
      var MS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      var ML = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      function z(n) { return (n < 10 ? "0" : "") + n; }
      function parse(s) {
        s = String(s || "").trim(); var m;
        if ((m = s.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/))) return [+m[1], +m[2], +m[3]];
        if ((m = s.match(/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})$/))) {
          var a = +m[1], b = +m[2];
          return b > 12 && a <= 12 ? [+m[3], a, b] : [+m[3], b, a];   // day first unless that is impossible
        }
        if (/^\d{4}$/.test(s)) return null;
        var t = Date.parse(s); if (isNaN(t)) return null;
        var d = new Date(t); return [d.getFullYear(), d.getMonth() + 1, d.getDate()];
      }
      function out(raw, f) {
        if (f === "asis") return raw;
        var d = parse(raw); if (!d || d[1] < 1 || d[1] > 12) return raw;
        var y = d[0], mo = d[1], da = d[2];
        switch (f) {
          case "iso": return y + "-" + z(mo) + "-" + z(da);
          case "dmy": return z(da) + "/" + z(mo) + "/" + y;
          case "mdy": return z(mo) + "/" + z(da) + "/" + y;
          case "dmy_dash": return z(da) + "-" + z(mo) + "-" + y;
          case "dmy_dot": return z(da) + "." + z(mo) + "." + y;
          case "short": return MS[mo - 1] + " " + da + ", " + y;
          case "short_dmy": return da + " " + MS[mo - 1] + " " + y;
          case "long": return ML[mo - 1] + " " + da + ", " + y;
          case "long_dmy": return da + " " + ML[mo - 1] + " " + y;
          case "month_year": return MS[mo - 1] + " " + y;
          case "year": return String(y);
        }
        return raw;
      }
      function run() {
        var els = document.querySelectorAll(".project-date");
        for (var i = 0; i < els.length; i++) {
          var el = els[i], k = el.classList.contains("sr-card-date") ? "sc" : "pc";
          if (el.getAttribute("data-date-fmt-out") !== el.textContent) el.setAttribute("data-date-raw", el.textContent.trim());
          var txt = out(el.getAttribute("data-date-raw"), F[k] || "asis");
          if (el.textContent !== txt) el.textContent = txt;
          el.setAttribute("data-date-fmt-out", txt);
        }
      }
      window.__cardDateRun = run;
      if (!window.__cardDateObs && window.MutationObserver) {      // cards drawn later (series.js, configurator preview) get the format too
        var pend = false;
        window.__cardDateObs = new MutationObserver(function () {
          if (pend) return; pend = true;
          setTimeout(function () { pend = false; window.__cardDateRun(); }, 0);
        });
        var start = function () { window.__cardDateObs.observe(document.documentElement, { childList: true, subtree: true }); window.__cardDateRun(); };
        if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
      }
      run();
    }

    [["pc", conf.pcard || {}], ["sc", conf.scard || {}]].forEach(function (a) {
      var p = a[0], g = a[1];
      function at(k, v) { root.setAttribute("data-" + p + "-" + k, v); }
      function cv(k, v) { var c = col(v); if (c) put("--" + p + "-" + k, c); return c; }
      at("box", pick(g.box_style, ["default", "bordered", "flat", "outline", "accent_top", "accent_left", "glow"], "default"));
      at("shadow", pick(g.shadow, ["none", "soft", "strong", "glow"], "none"));
      at("boxhover", pick(g.hover, ["border", "lift", "grow", "glow", "none"], "border"));
      at("talign", pick(g.text_align, ["left", "center"], "left"));
      at("inset", pick(g.image_inset, ["edge", "inset"], "edge"));
      at("tfont", pick(g.title_font, ["serif", "sans", "mono"], "serif"));
      at("badge", pick(g.badge_style, ["outline", "soft", "solid", "plain", "hidden"], "outline"));
      at("bg", cv("bg", g.background) ? "on" : "off");
      at("bc", cv("bc", g.border_color) ? "on" : "off");
      at("tc", cv("tc", g.title_color) ? "on" : "off");
      at("dc", cv("dc", g.desc_color) ? "on" : "off");
      at("bdg", cv("bdg", g.badge_color) ? "on" : "off");
      put("--" + p + "-bw", num(g.border_width, 1, 0, 6) + "px");
      put("--" + p + "-r", num(g.radius, 14, 0, 40) + "px");
      put("--" + p + "-pad", num(g.padding, 26, 8, 56) + "px");
      put("--" + p + "-cgap", num(g.gap, 22, 0, 60) + "px");
      if (g.image_height !== undefined && g.image_height !== "") put("--" + p + "-imgh", num(g.image_height, 170, 60, 420) + "px");
      put("--" + p + "-ts", num(g.title_size, 20, 12, 40) + "px");
      put("--" + p + "-ds", num(g.desc_size, 15, 11, 22) + "px");
      var dl = num(g.desc_lines, 0, 0, 12); at("clamp", dl ? "on" : "off"); put("--" + p + "-dl", String(dl || 99));
      at("style", pick(g.link_style, ["link", "underline", "button", "outline", "solid", "soft", "pill", "ghost"], "link"));
      at("arrow", pick(g.link_arrow, ["arrow", "chevron", "none"], "arrow"));
      at("align", pick(g.link_align, ["left", "center", "right", "spread", "full"], "left"));
      at("weight", pick(g.link_weight, ["normal", "semibold", "bold"], "normal"));
      at("upper", bool(g.link_uppercase, false) ? "on" : "off");
      at("equal", bool(g.link_equal, false) ? "on" : "off");
      at("hover", pick(g.link_hover, ["color", "lift", "grow", "glow", "none"], "color"));
      put("--" + p + "-fs", num(g.link_font_size, 14, 10, 24) + "px");
      put("--" + p + "-gap", num(g.link_gap, 20, 0, 60) + "px");
      put("--" + p + "-radius", num(g.link_radius, 8, 0, 30) + "px");
      at("dpos", pick(g.date_position, ["auto", "top-right", "top-left", "inline", "first", "end", "hidden"], "auto"));
      at("dstyle", pick(g.date_style, ["auto", "glass", "pill", "soft", "solid", "plain"], "auto"));
      at("dfont", pick(g.date_font, ["sans", "mono"], "sans"));
      at("dupper", bool(g.date_upper, false) ? "on" : "off");
      at("dcol", cv("dcol", g.date_color) ? "on" : "off");
      if (g.date_size !== undefined && g.date_size !== "") put("--" + p + "-dsz", num(g.date_size, 12, 10, 18) + "px");
      at("tag", pick(g.tag_style, ["pill", "outline", "soft", "box", "hash", "plain", "hidden"], "pill"));
      at("tagc", cv("tagc", g.tag_color) ? "on" : "off");
      at("btc", cv("btc", g.badge_text_color) ? "on" : "off");
      at("bshape", pick(g.badge_shape, ["pill", "rounded", "square"], "pill"));
      at("bsize", pick(g.badge_size, ["small", "medium", "large"], "medium"));
      at("bweight", pick(g.badge_weight, ["normal", "semibold", "bold"], "bold"));
      at("bupper", bool(g.badge_uppercase, true) ? "on" : "off");
      at("bequal", bool(g.badge_equal, false) ? "on" : "off");
      put("--" + p + "-bbw", num(g.badge_border_width, 1, 0, 4) + "px");
      put("--" + p + "-bgap", num(g.badge_gap, 8, 0, 24) + "px");
      at("ttc", cv("ttc", g.tag_text_color) ? "on" : "off");
      at("tshape", pick(g.tag_shape, ["auto", "pill", "rounded", "square"], "auto"));
      at("tsize", pick(g.tag_size, ["small", "medium", "large"], "medium"));
      at("tupper", bool(g.tag_uppercase, false) ? "on" : "off");
      at("tequal", bool(g.tag_equal, false) ? "on" : "off");
      at("tgalign", pick(g.tag_align, ["left", "center", "right"], "left"));
      at("tghover", pick(g.tag_hover, ["none", "accent", "lift"], "none"));
      put("--" + p + "-tbw", num(g.tag_border_width, 1, 0, 4) + "px");
      put("--" + p + "-tgap", num(g.tag_gap, 6, 0, 24) + "px");
      at("dbg", cv("dbg", g.date_bg) ? "on" : "off");
      at("dshape", pick(g.date_shape, ["auto", "pill", "rounded", "square"], "auto"));
      at("dweight", pick(g.date_weight, ["auto", "normal", "semibold", "bold"], "auto"));
      at("dicon", pick(g.date_icon, ["none", "calendar", "clock"], "none"));
      cardDateFmt(p, g.date_format);
      at("imghover", pick(g.image_hover, ["none", "zoom", "brighten", "dim", "color", "blur"], "none"));
      at("thover", pick(g.title_hover, ["none", "accent", "underline", "slide"], "none"));
      var c = col(g.link_color), h = col(g.link_hover_color);
      if (c) put("--" + p + "-c", c);
      if (h) put("--" + p + "-h", h);
    });

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

    var la = conf.layout;
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

  function pageList(total, cur, max, edges, lo) {   // lo = smallest allowed max (5; the pager passes less to fit small screens)
    var out = [], i, s, e;
    max = Math.max(lo || 5, Math.min(15, max | 0 || 7));
    if (edges && max < 3) edges = false;
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
    el.classList.remove("pg-tight");
    if (total <= 1) { el.hidden = true; return; }
    el.hidden = false;
    function btn(html, label, page, cls) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "page-btn" + (cls ? " " + cls : ""); b.innerHTML = html; b.setAttribute("aria-label", label);
      if (page === null) b.disabled = true; else b.addEventListener("click", function () { go(page); });
      return b;
    }
    function build(max, edges) {
      el.innerHTML = "";
      if (pg.arrows) el.appendChild(btn(CHEV_L, "Previous page", cur > 1 ? cur - 1 : null, "page-arrow"));
      pageList(total, cur, max, edges, 1).forEach(function (p) {
        if (p === "\u2026") { var gap = document.createElement("span"); gap.className = "page-gap"; gap.textContent = "\u2026"; el.appendChild(gap); return; }
        var b = btn(String(p), "Page " + p, p, p === cur ? "active" : "");
        if (p === cur) b.setAttribute("aria-current", "page");
        el.appendChild(b);
      });
      if (pg.arrows) el.appendChild(btn(CHEV_R, "Next page", cur < total ? cur + 1 : null, "page-arrow"));
      if (pg.info) { var t = document.createElement("span"); t.className = "page-info"; t.textContent = "Page " + cur + " of " + total; el.appendChild(t); }
    }
    function oneRow() {
      var items = el.querySelectorAll(".page-btn, .page-gap");
      if (!items.length || !el.offsetWidth) return true;   // not visible yet: nothing to measure
      return items[items.length - 1].offsetTop === items[0].offsetTop;
    }
    var max = Math.max(5, Math.min(15, pg.max | 0 || 7)), edges = pg.edges;
    build(max, edges);
    while (!oneRow()) {
      if (edges && max > 3) max--;
      else if (edges) edges = false;
      else if (max > 1) max--;
      else if (!el.classList.contains("pg-tight")) el.classList.add("pg-tight");
      else break;
      build(max, edges);
    }
    el._pgRender = function () { renderPager(el, total, cur, go); };
    if (!el._pgResize) {
      var tm = 0, lastW = window.innerWidth;
      el._pgResize = function () {
        if (window.innerWidth === lastW) return; lastW = window.innerWidth;
        clearTimeout(tm); tm = setTimeout(function () { if (el._pgRender) el._pgRender(); }, 120);
      };
      window.addEventListener("resize", el._pgResize);
    }
  }

  window.SiteTheme = {
    pageList: pageList,
    renderPager: renderPager,
    setMode: setMode,
    state: state,
    config: function () { return conf; },
    preview: function (cfg, mode) {
      window.SITE_APPEARANCE = cfg;   // read by assets/effects.js
      setConfig(cfg);
      state.mode = MODES.indexOf(mode) > -1 ? mode : conf.mode;
      apply(); buildUI(); syncUI();
      notify();
    }
  };

  var SVG = {
    sun: '<svg class="ic ic-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg class="ic ic-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>',
    sys: '<svg class="ic ic-sys" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
    gear: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/></svg>',
    check: '<svg class="opt-check" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>'
  };
  var NAMES = { light: "Light", dark: "Dark", system: "System" };
  var ui = {}, wired = false;

  function buildUI() {}
  function syncUI() {}
  function setOpen() {}
  function init() { buildUI(); syncUI(); }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
