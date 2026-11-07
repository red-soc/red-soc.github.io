---
layout: page
title: Series
permalink: /series/
---

{%- assign stp = site.appearance.series_page | default: site.appearance.series -%}
{%- assign cols = stp.page_columns | default: "auto" -%}
{%- assign img_h = stp.page_image_height | default: 170 -%}
{%- assign img_fit = stp.page_image_fit | default: "cover" -%}
{%- assign shown = 0 -%}
<p class="project-intro sr-page-intro" data-sr-text="intro">{{ stp.page_intro | escape }}</p>
<div class="project-grid sr-cards cols-{{ cols }}" style="--proj-img-h: {{ img_h }}px; --proj-img-fit: {{ img_fit }};">
{%- for s in site.data.series.items -%}{%- unless s.hidden -%}{% include series-card.html s=s i=shown %}{%- assign shown = shown | plus: 1 -%}{%- endunless -%}{%- endfor -%}
</div>
{%- if shown == 0 %}
<p class="sr-empty">No series yet.</p>
{%- endif %}
