/* Blog template — client-side post search (home page live filter) */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var input = document.getElementById("search-input");
    if (!input) return;

    var clearBtn = document.getElementById("search-clear");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".post-card"));
    var noResults = document.getElementById("no-results");
    var noResultsQuery = document.getElementById("no-results-query");

    // elements whose text gets the search keyword highlighted
    var targets = [];
    cards.forEach(function (card) {
      var els = card.querySelectorAll(".card-link, .excerpt, .meta-link");
      Array.prototype.forEach.call(els, function (el) {
        // excerpt belongs to the "content" scope; title, category and tag links to "title"
        var scope = el.classList.contains("excerpt") ? "content" : "title";
        targets.push({ el: el, text: el.textContent, scope: scope });
      });
    });

    // which fields are searched: at least one stays on
    var scopes = { title: true, content: true };
    var scopeBtns = Array.prototype.slice.call(document.querySelectorAll(".scope-btn"));

    function escapeRegExp(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    // Rebuild each target's content, wrapping matches in <mark>.
    // Uses text nodes only, so no HTML is ever injected.
    function highlight(rawQuery) {
      var base = rawQuery ? new RegExp(escapeRegExp(rawQuery), "gi") : null;
      targets.forEach(function (t) {
        // only highlight inside the fields currently being searched
        var re = scopes[t.scope] ? base : null;
        if (!re) {
          if (t.el.querySelector("mark")) t.el.textContent = t.text;
          return;
        }
        var frag = document.createDocumentFragment();
        var last = 0, m;
        re.lastIndex = 0;
        while ((m = re.exec(t.text)) !== null) {
          if (m.index > last) {
            frag.appendChild(document.createTextNode(t.text.slice(last, m.index)));
          }
          var mark = document.createElement("mark");
          mark.className = "search-hit";
          mark.textContent = m[0];
          frag.appendChild(mark);
          last = m.index + m[0].length;
          if (m[0].length === 0) re.lastIndex++;
        }
        frag.appendChild(document.createTextNode(t.text.slice(last)));
        t.el.textContent = "";
        t.el.appendChild(frag);
      });
    }

    // ---- pagination (client-side, so it works together with search) ----
    // How many posts per page and how many page numbers show comes from  appearance.pagination  in _config.yml
    // (read through assets/theme.js). The page-number buttons are built by SiteTheme.renderPager.
    var list = document.getElementById("post-list");
    var pager = document.getElementById("pagination");
    var theme = window.SiteTheme;
    var perPage = parseInt((list && list.getAttribute("data-per-page")) || "10", 10);
    if (theme && theme.config && theme.config().pager) perPage = theme.config().pager.per;
    var currentPage = 1;
    var matched = cards.slice();

    function goTo(page, scroll) {
      currentPage = page;
      render();
      var pg = theme && theme.config && theme.config().pager;
      if (scroll && (!pg || pg.scroll)) window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function renderPager(totalPages) {
      if (!pager) return;
      if (theme && theme.renderPager) {
        theme.renderPager(pager, totalPages, currentPage, function (p) { goTo(p, true); });
      } else {
        pager.hidden = true;
      }
    }

    function render() {
      var totalPages = Math.max(1, Math.ceil(matched.length / perPage));
      if (currentPage > totalPages) currentPage = totalPages;
      var start = (currentPage - 1) * perPage, end = start + perPage;

      cards.forEach(function (card) { card.style.display = "none"; });
      matched.slice(start, end).forEach(function (card) { card.style.display = ""; });

      renderPager(totalPages);

      if (history.replaceState) {
        history.replaceState(null, "", currentPage > 1 ? "#page-" + currentPage : location.pathname + location.search);
      }
    }

    function applyFilter(resetPage) {
      var rawQuery = input.value.trim();
      var query = rawQuery.toLowerCase();

      matched = cards.filter(function (card) {
        if (query === "") return true;
        var inTitle = scopes.title && (card.getAttribute("data-title") || "").indexOf(query) !== -1;
        var inContent = scopes.content && (card.getAttribute("data-content") || "").indexOf(query) !== -1;
        return inTitle || inContent;
      });

      if (resetPage !== false) currentPage = 1;
      highlight(rawQuery);
      render();

      if (noResults) {
        noResults.hidden = matched.length !== 0;
        if (noResultsQuery && matched.length === 0) {
          noResultsQuery.textContent = rawQuery;
        }
      }
      if (clearBtn) {
        clearBtn.classList.toggle("visible", input.value.length > 0);
      }
    }

    input.addEventListener("input", function () { applyFilter(); });

    scopeBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-scope");
        var other = key === "title" ? "content" : "title";
        // keep at least one field selected
        if (scopes[key] && !scopes[other]) return;
        scopes[key] = !scopes[key];
        btn.classList.toggle("active", scopes[key]);
        btn.setAttribute("aria-pressed", scopes[key] ? "true" : "false");
        applyFilter();
        input.focus();
      });
    });

    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        input.value = "";
        applyFilter();
        input.focus();
      });
    }

    // initial render (open the page named in the URL hash, e.g. #page-2)
    var m = /^#page-(\d+)$/.exec(location.hash);
    if (m) currentPage = parseInt(m[1], 10);
    applyFilter(false);
  });
})();
