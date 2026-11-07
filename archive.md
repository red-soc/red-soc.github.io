---
layout: page
title: Archives
permalink: /archive/
---

<div class="list-section">
  {% assign by_year = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
  {% for year in by_year %}
    <h2 class="archive-year">{{ year.name }}<span class="archive-year-count">{{ year.items | size }}</span></h2>
    {% for post in year.items %}
      {% include archive-row.html post=post %}
    {% endfor %}
  {% endfor %}
</div>
